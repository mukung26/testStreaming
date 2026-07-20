import React from 'react';
import { Link } from 'react-router-dom';
import type { MediaItem } from '../types';
import { getImageUrl } from '../lib/api';
import { motion } from 'motion/react';

interface MediaCardProps {
  item: MediaItem;
  type?: 'movie' | 'tv';
}

export function MediaCard({ item, type }: MediaCardProps) {
  const actualType = item.media_type || type || 'movie';
  const title = 'title' in item ? item.title : item.name;

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="flex flex-col gap-2 group cursor-pointer"
    >
      <Link to={`/details/${actualType}/${item.id}`} className="block relative aspect-[2/3] bg-[#1A1A1C] overflow-hidden border border-white/5 group-hover:border-blue-500/50 transition-all">
        <img
          src={getImageUrl(item.poster_path)}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 opacity-80 group-hover:opacity-100"
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/500x750?text=No+Image';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
        <div className="absolute bottom-3 left-3 right-3">
          <div className="text-[10px] font-bold bg-yellow-500 text-black px-1.5 py-0.5 rounded-sm mb-1.5 inline-block uppercase">IMDb {item.vote_average?.toFixed(1) || 'N/A'}</div>
          <div className="text-xs font-bold uppercase truncate text-white">{title}</div>
        </div>
      </Link>
    </motion.div>
  );
}
