import axios from 'axios';
import type { TMDBResponse, MediaItem } from '../types';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

export const api = axios.create({
  baseURL: API_KEY ? TMDB_BASE_URL : '/api',
});

const getParams = (extraParams = {}) => {
  if (API_KEY) {
    return { api_key: API_KEY, ...extraParams };
  }
  return extraParams;
};

const validateData = (data: any) => {
  if (typeof data === 'string' || !data || (data.results === undefined && !data.id && !data.episodes)) {
    throw new Error('Invalid API response. Ensure the backend server is running and configured correctly, or provide a VITE_TMDB_API_KEY.');
  }
  return data;
};

export const getTrending = async (type: 'movie' | 'tv' = 'movie', timeWindow: 'day' | 'week' = 'day') => {
  if (API_KEY) {
    const { data } = await api.get<TMDBResponse<MediaItem>>(`/trending/${type}/${timeWindow}`, { params: getParams() });
    return validateData(data);
  }
  const { data } = await api.get<TMDBResponse<MediaItem>>(`/trending?type=${type}&timeWindow=${timeWindow}`);
  return validateData(data);
};

export const getDiscover = async (type: 'movie' | 'tv' = 'movie', page = 1) => {
  if (API_KEY) {
    const { data } = await api.get<TMDBResponse<MediaItem>>(`/discover/${type}`, { params: getParams({ page }) });
    return validateData(data);
  }
  const { data } = await api.get<TMDBResponse<MediaItem>>(`/discover/${type}?page=${page}`);
  return validateData(data);
};

export const searchMedia = async (query: string, type: 'movie' | 'tv' = 'movie') => {
  if (API_KEY) {
    const { data } = await api.get<TMDBResponse<MediaItem>>(`/search/${type}`, { params: getParams({ query }) });
    return validateData(data);
  }
  const { data } = await api.get<TMDBResponse<MediaItem>>(`/search?q=${query}&type=${type}`);
  return validateData(data);
};

export const getDetails = async (type: 'movie' | 'tv', id: string) => {
  if (API_KEY) {
    const { data } = await api.get(`/${type}/${id}`, { params: getParams({ append_to_response: 'videos,credits,similar' }) });
    return validateData(data);
  }
  const { data } = await api.get(`/details/${type}/${id}`);
  return validateData(data);
};

export const getSeasonDetails = async (tvId: string, seasonNumber: string) => {
  if (API_KEY) {
    const { data } = await api.get(`/tv/${tvId}/season/${seasonNumber}`, { params: getParams() });
    return validateData(data);
  }
  const { data } = await api.get(`/tv/${tvId}/season/${seasonNumber}`);
  return validateData(data);
};

export const getImageUrl = (path: string | null, size: 'w500' | 'original' = 'w500') => {
  if (!path) return 'https://via.placeholder.com/500x750?text=No+Image';
  if (path.startsWith('http')) return path;
  return `https://image.tmdb.org/t/p/${size}${path}`;
};
