import express from "express";
import path from "path";
import axios from "axios";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  const TMDB_API_KEY = process.env.TMDB_API_KEY;
  const TMDB_BASE_URL = "https://api.themoviedb.org/3";

  // Helper for TMDB requests
  const fetchFromTMDB = async (endpoint: string, params: Record<string, any> = {}) => {
    if (!TMDB_API_KEY) {
      console.log(`Using mock data for ${endpoint}`);
      if (endpoint.includes('/trending/tv')) return (await import('./mockData.js')).trendingTvShows;
      if (endpoint.includes('/trending/')) return (await import('./mockData.js')).trendingMovies;
      if (endpoint.includes('/search/tv')) return (await import('./mockData.js')).trendingTvShows;
      if (endpoint.includes('/search/')) return (await import('./mockData.js')).trendingMovies;
      if (endpoint.includes('/season/')) return (await import('./mockData.js')).mockSeason();
      if (endpoint.match(/\/(movie|tv)\/\d+/)) {
         const type = endpoint.includes('/tv/') ? 'tv' : 'movie';
         const id = endpoint.split('/')[2];
         return (await import('./mockData.js')).mockDetails(id, type);
      }
      return {};
    }
    
    const url = `${TMDB_BASE_URL}${endpoint}`;
    const response = await axios.get(url, {
      params: {
        api_key: TMDB_API_KEY,
        ...params,
      },
    });
    return response.data;
  };

  // API Routes
  
  // Trending Movies & TV Shows
  app.get("/api/trending", async (req, res) => {
    try {
      const type = req.query.type === 'tv' ? 'tv' : 'movie';
      const timeWindow = req.query.timeWindow === 'week' ? 'week' : 'day';
      const data = await fetchFromTMDB(`/trending/${type}/${timeWindow}`);
      res.json(data);
    } catch (error: any) {
      console.error("TMDB Error:", error?.response?.data || error.message);
      res.status(500).json({ error: error?.response?.data?.status_message || error.message || "Failed to fetch trending" });
    }
  });

  // Search
  app.get("/api/search", async (req, res) => {
    try {
      const query = req.query.q as string;
      const type = req.query.type === 'tv' ? 'tv' : 'movie'; // Or 'multi' for both
      if (!query) {
         return res.status(400).json({ error: "Missing search query" });
      }
      const data = await fetchFromTMDB(`/search/${type}`, { query });
      res.json(data);
    } catch (error: any) {
      console.error("TMDB Error:", error?.response?.data || error.message);
      res.status(500).json({ error: error?.response?.data?.status_message || error.message || "Failed to search" });
    }
  });

  // Details
  app.get("/api/details/:type/:id", async (req, res) => {
    try {
      const { type, id } = req.params;
      if (type !== "movie" && type !== "tv") {
        return res.status(400).json({ error: "Invalid type" });
      }
      const data = await fetchFromTMDB(`/${type}/${id}`, { append_to_response: "credits,similar,videos" });
      res.json(data);
    } catch (error: any) {
      console.error("TMDB Error:", error?.response?.data || error.message);
      res.status(500).json({ error: error?.response?.data?.status_message || error.message || "Failed to fetch details" });
    }
  });
  
  // Discover
  app.get("/api/discover/:type", async (req, res) => {
    try {
      const { type } = req.params;
      const { genre, page = 1 } = req.query;
      
      const params: any = { page };
      if (genre) {
          params.with_genres = genre;
      }
      const data = await fetchFromTMDB(`/discover/${type}`, params);
      res.json(data);
    } catch (error: any) {
      console.error("TMDB Error:", error?.response?.data || error.message);
      res.status(500).json({ error: error?.response?.data?.status_message || error.message || "Failed to discover" });
    }
  });
  
  // TV Show Season Details (for episodes)
  app.get("/api/tv/:id/season/:season_number", async (req, res) => {
      try {
          const { id, season_number } = req.params;
          const data = await fetchFromTMDB(`/tv/${id}/season/${season_number}`);
          res.json(data);
      } catch (error: any) {
         console.error("TMDB Error:", error?.response?.data || error.message);
         res.status(500).json({ error: error?.response?.data?.status_message || error.message || "Failed to fetch season details" });
      }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
