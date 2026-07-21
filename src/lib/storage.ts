import { MediaItem } from '../types';

export interface HistoryItem {
  id: number;
  title: string;
  poster_path: string | null;
  type: 'movie' | 'tv' | 'anime';
  timestamp: number;
  vote_average?: number;
}

const HISTORY_KEY = 'vidsphere_history';

export const getHistory = (): HistoryItem[] => {
  try {
    const data = localStorage.getItem(HISTORY_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const addToHistory = (item: HistoryItem) => {
  try {
    const history = getHistory();
    const existingIndex = history.findIndex((h) => h.id === item.id && h.type === item.type);
    
    if (existingIndex >= 0) {
      history.splice(existingIndex, 1);
    }
    
    history.unshift(item);
    
    if (history.length > 20) {
      history.pop();
    }
    
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  } catch (error) {
    console.error('Failed to save history', error);
  }
};
