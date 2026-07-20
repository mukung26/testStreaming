import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { searchMedia } from '../lib/api';
import type { MediaItem } from '../types';
import { MediaCard } from '../components/MediaCard';
import { motion, AnimatePresence } from 'motion/react';
import { Loader2 } from 'lucide-react';

export function Search() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!query) return;

    let mounted = true;
    
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [moviesRes, tvRes] = await Promise.all([
            searchMedia(query, 'movie').catch(() => ({ results: [] })),
            searchMedia(query, 'tv').catch(() => ({ results: [] }))
        ]);
        
        if (mounted) {
          const combined = [
            ...(Array.isArray(moviesRes?.results) ? moviesRes.results : []).map((m: any) => ({ ...m, media_type: 'movie' })),
            ...(Array.isArray(tvRes?.results) ? tvRes.results : []).map((t: any) => ({ ...t, media_type: 'tv' }))
          ];
          
          combined.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
          
          setItems(combined);
        }
      } catch (err: any) {
        if (mounted) {
          setError(err.message || 'Failed to search');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchData();
    return () => { mounted = false; };
  }, [query]);

  return (
    <div className="p-8 pt-8 flex flex-col gap-6 min-h-screen bg-[#0A0A0B]">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold uppercase tracking-widest flex items-center gap-3 text-white">
          <span className="w-1 h-6 bg-blue-600"></span>
          Search Results for "{query}"
        </h2>
      </div>

      {!query ? (
        <div className="text-center text-gray-500 py-12 text-sm font-bold uppercase tracking-widest">
            Enter a search term above to find movies and TV shows.
        </div>
      ) : loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        </div>
      ) : error ? (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-sm text-sm font-bold uppercase">
          {error}
        </div>
      ) : items.length === 0 ? (
        <div className="text-center text-gray-500 py-12 text-sm font-bold uppercase tracking-widest">
            No results found for "{query}".
        </div>
      ) : (
        <motion.div 
          layout
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4"
        >
          <AnimatePresence mode="popLayout">
            {items.map((item) => (
              <MediaCard key={`${item.media_type}-${item.id}`} item={item} type={item.media_type as 'movie'|'tv'} />
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}
