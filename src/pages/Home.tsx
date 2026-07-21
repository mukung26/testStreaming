import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { getDiscover, getImageUrl } from '../lib/api';
import type { MediaItem } from '../types';
import { MediaCard } from '../components/MediaCard';
import { motion, AnimatePresence } from 'motion/react';
import { Loader2 } from 'lucide-react';

export function Home() {
  const [searchParams] = useSearchParams();
  const typeParam = searchParams.get('type') as 'movie' | 'tv' | 'anime' | null;
  const currentType = typeParam === 'tv' ? 'tv' : typeParam === 'anime' ? 'anime' : 'movie';
  
  const [items, setItems] = useState<MediaItem[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getDiscover(currentType, 1);
        if (mounted) {
          setItems(Array.isArray(data?.results) ? data.results : []);
          setPage(1);
        }
      } catch (err: any) {
        if (mounted) {
          setError(err.message || 'Failed to load items');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchData();
    return () => { mounted = false; };
  }, [currentType]);

  const loadMore = async () => {
    if (loadingMore) return;
    setLoadingMore(true);
    try {
      const nextPage = page + 1;
      const data = await getDiscover(currentType, nextPage);
      setItems(prev => [...(prev || []), ...(Array.isArray(data?.results) ? data.results : [])]);
      setPage(nextPage);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingMore(false);
    }
  };

  const heroItem = items && items.length > 0 ? items[0] : null;

  return (
    <div className="flex flex-col gap-6 bg-[#0A0A0B]">
      {/* Hero Section */}
      <div className="relative h-[65vh] sm:h-[450px] md:h-[550px] flex-shrink-0">
        {heroItem && (
          <>
            <img 
              src={getImageUrl(heroItem.backdrop_path || heroItem.poster_path, 'original')}
              alt={heroItem.title || heroItem.name}
              className="absolute inset-0 w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?auto=format&fit=crop&q=80&w=1024';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0B] via-[#0A0A0B]/80 to-transparent z-10" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0B] via-[#0A0A0B]/20 to-transparent z-10" />

            <div className="relative z-20 h-full flex flex-col justify-end pb-12 sm:justify-center sm:pb-0 px-4 sm:px-8 md:px-12 gap-3 sm:gap-4 max-w-3xl">
              <div className="flex flex-wrap items-center gap-2 text-blue-400 font-bold text-[10px] sm:text-xs uppercase tracking-[0.2em] sm:tracking-[0.3em]">
                <span className="bg-blue-400/10 px-2 py-0.5 border border-blue-400/20">Featured</span>
                <span>• {currentType === 'movie' ? 'Movie' : currentType === 'anime' ? 'Anime' : 'TV Series'}</span>
                <span className="text-yellow-500 bg-yellow-500/10 px-2 py-0.5 sm:ml-2 rounded-sm border border-yellow-500/20 text-[10px]">★ {heroItem.vote_average?.toFixed(1)}</span>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black uppercase leading-tight text-white drop-shadow-lg">
                {heroItem.title || heroItem.name}
              </h1>
              <p className="text-gray-300 max-w-xl leading-relaxed text-xs sm:text-sm hidden sm:block drop-shadow-md line-clamp-3">
                {heroItem.overview}
              </p>
              <div className="flex gap-4 mt-2 sm:mt-4">
                <Link to={`/details/${currentType === 'anime' ? 'tv' : currentType}/${heroItem.id}`} className="bg-white text-black px-4 sm:px-6 md:px-8 py-2.5 sm:py-3 rounded-sm font-bold uppercase text-[10px] sm:text-xs flex items-center gap-2 hover:bg-blue-500 hover:text-white transition-all">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                  Watch Now
                </Link>
              </div>
            </div>
          </>
        )}
      </div>

      <div className="p-4 sm:p-8 sm:pt-2 flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h2 className="text-base sm:text-lg font-bold uppercase tracking-widest flex items-center gap-3 text-white">
            <span className="w-1 h-5 sm:h-6 bg-blue-600"></span>
            Discover All {currentType === 'movie' ? 'Movies' : currentType === 'anime' ? 'Anime' : 'TV Shows'}
          </h2>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          </div>
        ) : error ? (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-sm text-sm font-bold uppercase">
            {error}
          </div>
        ) : (
          <>
            <motion.div 
              layout
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4"
            >
              <AnimatePresence mode="popLayout">
                {(items || []).slice(1).map((item, index) => (
                  <MediaCard key={`${item.id}-${index}`} item={item} type={currentType === 'anime' ? 'tv' : currentType} />
                ))}
              </AnimatePresence>
            </motion.div>
            
            <div className="flex justify-center mt-8">
              <button 
                onClick={loadMore}
                disabled={loadingMore}
                className="bg-white/5 border border-white/10 hover:bg-white/10 text-white px-8 py-3 rounded-sm font-bold uppercase tracking-widest text-xs transition-all flex items-center gap-2"
              >
                {loadingMore ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Load More'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
