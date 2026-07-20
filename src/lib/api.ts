import axios from 'axios';
import type { TMDBResponse, MediaItem } from '../types';

export const api = axios.create({
  baseURL: '/api',
});

export const getTrending = async (type: 'movie' | 'tv' = 'movie', timeWindow: 'day' | 'week' = 'day') => {
  const { data } = await api.get<TMDBResponse<MediaItem>>(`/trending?type=${type}&timeWindow=${timeWindow}`);
  return data;
};

export const getDiscover = async (type: 'movie' | 'tv' = 'movie', page = 1) => {
  const { data } = await api.get<TMDBResponse<MediaItem>>(`/discover/${type}?page=${page}`);
  return data;
};

export const searchMedia = async (query: string, type: 'movie' | 'tv' = 'movie') => {
  const { data } = await api.get<TMDBResponse<MediaItem>>(`/search?q=${query}&type=${type}`);
  return data;
};

export const getDetails = async (type: 'movie' | 'tv', id: string) => {
  const { data } = await api.get(`/details/${type}/${id}`);
  return data;
};

export const getSeasonDetails = async (tvId: string, seasonNumber: string) => {
    const { data } = await api.get(`/tv/${tvId}/season/${seasonNumber}`);
    return data;
};

export const getImageUrl = (path: string | null, size: 'w500' | 'original' = 'w500') => {
  if (!path) return 'https://via.placeholder.com/500x750?text=No+Image';
  if (path.startsWith('http')) return path;
  return `https://image.tmdb.org/t/p/${size}${path}`;
};
