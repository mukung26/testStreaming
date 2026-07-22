import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, Menu, X, Coffee } from 'lucide-react';
import { cn } from '../lib/utils';

export function Navbar() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isKofiModalOpen, setIsKofiModalOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (isMobileMenuOpen || isKofiModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen, isKofiModalOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setIsMobileMenuOpen(false);
    }
  };
  
  const searchParams = new URLSearchParams(location.search);
  const type = searchParams.get('type') || 'movie';

  return (
    <>
      <nav className="h-16 flex items-center justify-between px-4 md:px-8 border-b border-white/5 bg-[#0D0D0E] sticky top-0 z-50">
        <div className="flex items-center gap-4 md:gap-10">
          <Link to="/" className="flex items-center gap-2 group flex-shrink-0" onClick={() => setIsMobileMenuOpen(false)}>
            <div className="w-8 h-8 bg-blue-600 rounded-sm flex items-center justify-center font-bold text-xl text-white">V</div>
            <span className="inline text-xl font-bold tracking-tight uppercase text-white">VidSphere</span>
          </Link>
          
          <div className="hidden md:flex gap-4 md:gap-8 text-xs md:text-sm font-medium text-gray-400 uppercase tracking-widest">
             <Link to="/?type=movie" className={`transition-colors whitespace-nowrap ${type === 'movie' && location.pathname === '/' ? 'text-white border-b-2 border-blue-600 pb-1' : 'hover:text-white'}`}>
               Movies
             </Link>
             <Link to="/?type=tv" className={`transition-colors whitespace-nowrap ${type === 'tv' && location.pathname === '/' ? 'text-white border-b-2 border-blue-600 pb-1' : 'hover:text-white'}`}>
               TV Shows
             </Link>
             <Link to="/?type=anime" className={`transition-colors whitespace-nowrap ${type === 'anime' && location.pathname === '/' ? 'text-white border-b-2 border-blue-600 pb-1' : 'hover:text-white'}`}>
               Anime
             </Link>
          </div>
        </div>

        <div className="flex flex-1 max-w-md ml-2 md:ml-4 items-center justify-end gap-2 md:gap-6">
          <form onSubmit={handleSearch} className="relative w-full max-w-[240px] hidden md:block">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-500" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-[#1A1A1C] border border-white/10 rounded-full py-1.5 pl-10 pr-4 text-sm w-full md:w-48 md:focus:w-64 transition-all focus:outline-none focus:border-blue-500 text-white placeholder-gray-500"
              placeholder="Search titles..."
            />
          </form>
          <button
            onClick={() => setIsKofiModalOpen(true)}
            className="hidden md:flex items-center gap-2 bg-[#13C3FF] text-white px-4 py-1.5 rounded-full font-bold text-xs uppercase tracking-wider hover:bg-[#2DD0FF] transition-colors flex-shrink-0"
          >
            <Coffee className="w-4 h-4" />
            <span>Support on Ko-fi</span>
          </button>
          
          <button 
            className="md:hidden text-gray-300 hover:text-white p-2 ml-auto"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-16 bg-[#0D0D0E] z-40 p-4 flex flex-col gap-6 overflow-y-auto">
          <form onSubmit={handleSearch} className="relative w-full">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-500" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-[#1A1A1C] border border-white/10 rounded-full py-3 pl-10 pr-4 text-sm w-full transition-all focus:outline-none focus:border-blue-500 text-white placeholder-gray-500"
              placeholder="Search movies, tv shows, anime..."
              autoFocus
            />
          </form>
          <div className="flex flex-col gap-4 text-sm font-bold text-gray-400 uppercase tracking-widest mt-2">
             <Link onClick={() => setIsMobileMenuOpen(false)} to="/?type=movie" className={`transition-colors py-3 px-4 rounded-md ${type === 'movie' && location.pathname === '/' ? 'text-white bg-[#1A1A1C] border-l-2 border-blue-600' : 'hover:text-white hover:bg-[#1A1A1C] border-l-2 border-transparent'}`}>
               Movies
             </Link>
             <Link onClick={() => setIsMobileMenuOpen(false)} to="/?type=tv" className={`transition-colors py-3 px-4 rounded-md ${type === 'tv' && location.pathname === '/' ? 'text-white bg-[#1A1A1C] border-l-2 border-blue-600' : 'hover:text-white hover:bg-[#1A1A1C] border-l-2 border-transparent'}`}>
               TV Shows
             </Link>
             <Link onClick={() => setIsMobileMenuOpen(false)} to="/?type=anime" className={`transition-colors py-3 px-4 rounded-md ${type === 'anime' && location.pathname === '/' ? 'text-white bg-[#1A1A1C] border-l-2 border-blue-600' : 'hover:text-white hover:bg-[#1A1A1C] border-l-2 border-transparent'}`}>
               Anime
             </Link>
             <button
               onClick={() => {
                 setIsMobileMenuOpen(false);
                 setIsKofiModalOpen(true);
               }}
               className="flex items-center justify-center gap-2 bg-[#13C3FF] text-white py-3 px-4 rounded-md font-bold uppercase tracking-wider hover:bg-[#2DD0FF] transition-colors mt-2 w-full"
             >
               <Coffee className="w-5 h-5" />
               <span>Support on Ko-fi</span>
             </button>
          </div>
        </div>
      )}

      {/* Ko-fi Modal */}
      {isKofiModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-md bg-[#F5F5F5] rounded-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setIsKofiModalOpen(false)}
              className="absolute top-3 right-3 z-10 p-1.5 bg-black/10 hover:bg-black/20 text-gray-800 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <iframe
              src="https://ko-fi.com/mu_kong/?hidefeed=true&widget=true&embed=true&preview=true"
              className="w-full border-none h-[700px] max-h-[95dvh] bg-[#F5F5F5]"
              title="Support on Ko-fi"
            />
          </div>
        </div>
      )}
    </>
  );
}
