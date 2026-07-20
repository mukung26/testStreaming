import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getDetails, getImageUrl } from '../lib/api';
import { motion } from 'motion/react';

export function Details() {
  const { type, id } = useParams<{ type: 'movie' | 'tv'; id: string }>();
  const [details, setDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!type || !id) return;
    
    let mounted = true;
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getDetails(type, id);
        if (mounted) {
          setDetails(data);
        }
      } catch (err: any) {
        if (mounted) {
          setError(err.message || 'Failed to load details');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchData();
    window.scrollTo(0, 0);
    return () => { mounted = false; };
  }, [type, id]);

  if (loading) {
    return (
      <div className="min-h-[80vh] flex justify-center items-center bg-[#0A0A0B]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !details) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 bg-[#0A0A0B]">
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-sm text-sm font-bold uppercase text-center">
          {error || 'Not found'}
        </div>
      </div>
    );
  }

  const title = type === 'movie' ? details.title : details.name;
  const releaseDate = type === 'movie' ? details.release_date : details.first_air_date;
  const year = releaseDate ? new Date(releaseDate).getFullYear() : '';
  const runtime = type === 'movie' ? details.runtime : (details.episode_run_time?.[0] || 0);

  return (
    <div className="relative min-h-[calc(100vh-104px)] bg-[#0A0A0B] text-white flex flex-col">
      {/* Backdrop */}
      <div className="absolute inset-0 h-[60vh] w-full z-0 flex-shrink-0">
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0B] via-[#0A0A0B]/60 to-transparent z-10" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0B] via-[#0A0A0B]/80 to-transparent z-10" />
        <img
          src={getImageUrl(details.backdrop_path, 'original')}
          alt={title}
          className="w-full h-full object-cover opacity-50 grayscale mix-blend-overlay"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?auto=format&fit=crop&q=80&w=1024';
          }}
        />
      </div>

      <div className="relative z-20 flex-1 px-8 pt-32 pb-12 flex flex-col md:flex-row gap-8 lg:gap-12 items-start">
        
        {/* Poster */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-64 flex-shrink-0 aspect-[2/3] bg-[#1A1A1C] border border-white/5 relative mx-auto md:mx-0 overflow-hidden shadow-2xl"
        >
          <img
            src={getImageUrl(details.poster_path)}
            alt={title}
            className="w-full h-auto object-cover opacity-90"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://via.placeholder.com/500x750?text=No+Image';
            }}
          />
          <div className="absolute top-3 left-3">
             <div className="text-[10px] font-bold bg-yellow-500 text-black px-1.5 py-0.5 rounded-sm inline-block uppercase">IMDb {details.vote_average.toFixed(1)}</div>
          </div>
        </motion.div>

        {/* Info */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex-1 flex flex-col gap-4 mt-4 md:mt-0 max-w-3xl"
        >
          <div className="flex items-center gap-2 text-blue-400 font-bold text-xs uppercase tracking-[0.3em]">
            <span className="bg-blue-400/10 px-2 py-0.5 border border-blue-400/20">{type === 'movie' ? 'Movie' : 'TV Show'}</span>
            {year && <span>• {year}</span>}
            {runtime > 0 && <span>• {runtime} MIN</span>}
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black uppercase leading-tight text-white mb-2">
            {title}
          </h1>
          
          {details.tagline && (
            <p className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-2 border-l-2 border-blue-600 pl-3">
              "{details.tagline}"
            </p>
          )}

          <div className="mb-4 flex flex-wrap gap-2">
            {details.genres?.map((g: any) => (
              <span key={g.id} className="px-2 py-1 bg-white/5 border border-white/10 text-gray-300 text-[10px] font-bold uppercase tracking-widest">
                {g.name}
              </span>
            ))}
          </div>

          <div className="mb-6">
            <h3 className="text-xs font-bold uppercase tracking-widest text-blue-500 mb-2">Overview</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              {details.overview || 'No overview available.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 mt-2">
              {type === 'movie' ? (
                <Link
                  to={`/player/movie/${id}`}
                  className="bg-white text-black px-8 py-3 rounded-sm font-bold uppercase text-xs flex items-center gap-2 hover:bg-blue-500 hover:text-white transition-all"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                  Watch Movie
                </Link>
              ) : (
                  <Link
                  to={`/player/tv/${id}/1/1`}
                  className="bg-white text-black px-8 py-3 rounded-sm font-bold uppercase text-xs flex items-center gap-2 hover:bg-blue-500 hover:text-white transition-all"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                  Watch S1 E1
                </Link>
              )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
