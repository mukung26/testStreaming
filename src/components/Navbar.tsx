import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search } from 'lucide-react';
import { cn } from '../lib/utils';

export function Navbar() {
  const [searchQuery, setSearchQuery] = React.useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };
  
  const searchParams = new URLSearchParams(location.search);
  const type = searchParams.get('type') || 'movie';

  return (
    <nav className="h-16 flex items-center justify-between px-8 border-b border-white/5 bg-[#0D0D0E] sticky top-0 z-50">
      <div className="flex items-center gap-10">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-blue-600 rounded-sm flex items-center justify-center font-bold text-xl text-white">V</div>
          <span className="text-xl font-bold tracking-tight uppercase text-white">VidSphere</span>
        </Link>
        
        <div className="hidden md:flex gap-8 text-sm font-medium text-gray-400 uppercase tracking-widest">
           <Link to="/?type=movie" className={`transition-colors ${type === 'movie' && location.pathname === '/' ? 'text-white border-b-2 border-blue-600 pb-1' : 'hover:text-white'}`}>
             Movies
           </Link>
           <Link to="/?type=tv" className={`transition-colors ${type === 'tv' && location.pathname === '/' ? 'text-white border-b-2 border-blue-600 pb-1' : 'hover:text-white'}`}>
             TV Shows
           </Link>
        </div>
      </div>

      <div className="flex flex-1 max-w-md ml-4 items-center justify-end gap-6">
        <form onSubmit={handleSearch} className="relative">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-500" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-[#1A1A1C] border border-white/10 rounded-full py-1.5 pl-10 pr-4 text-sm w-48 focus:w-64 transition-all focus:outline-none focus:border-blue-500 text-white placeholder-gray-500"
            placeholder="Search titles..."
          />
        </form>
        <div className="hidden sm:block w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex-shrink-0"></div>
      </div>
    </nav>
  );
}
