import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getDetails, getSeasonDetails } from '../lib/api';

export function Player() {
  const { type, id, season = '1', episode = '1' } = useParams<{ type: 'movie' | 'tv'; id: string; season?: string; episode?: string }>();
  const navigate = useNavigate();
  
  const [details, setDetails] = useState<any>(null);
  const [seasonData, setSeasonData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [server, setServer] = useState<'vidlink' | 'embedsu' | 'vidsrc'>('vidlink');

  useEffect(() => {
    if (!type || !id) return;
    
    let mounted = true;
    const fetchInfo = async () => {
      setLoading(true);
      try {
        const data = await getDetails(type, id);
        if (mounted) setDetails(data);

        if (type === 'tv' && data) {
           const sData = await getSeasonDetails(id, season);
           if (mounted) setSeasonData(sData);
        }
      } catch (e) {
        console.error("Failed to load details for player", e);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    
    fetchInfo();
    return () => { mounted = false; };
  }, [type, id, season]);

  // Using different servers to bypass ads and errors
  const getEmbedUrl = () => {
    if (server === 'vidlink') {
      if (type === 'movie') return `https://vidlink.pro/movie/${id}`;
      return `https://vidlink.pro/tv/${id}/${season}/${episode}`;
    } else if (server === 'embedsu') {
      if (type === 'movie') return `https://embed.su/embed/movie/${id}`;
      return `https://embed.su/embed/tv/${id}/${season}/${episode}`;
    } else {
      // Fallback
      if (type === 'movie') return `https://vidsrc.to/embed/movie/${id}`;
      return `https://vidsrc.to/embed/tv/${id}/${season}/${episode}`;
    }
  };

  const title = details ? (type === 'movie' ? details.title : details.name) : 'Loading...';

  return (
    <div className="h-screen bg-[#0A0A0B] text-white flex flex-col font-sans overflow-hidden">
      {/* Top Navigation */}
      <nav className="h-16 flex-shrink-0 flex items-center justify-between px-8 border-b border-white/5 bg-[#0D0D0E]">
        <div className="flex items-center gap-10">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors uppercase font-bold text-xs tracking-widest"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
            Back
          </button>
        </div>
        <div className="flex items-center gap-2 font-bold text-sm tracking-widest uppercase text-white truncate max-w-xl">
           <span className="w-1 h-4 bg-blue-600 mr-2 inline-block"></span>
           {title}
           {type === 'tv' && (
             <span className="text-blue-500 ml-2">
               S{season} E{episode}
             </span>
           )}
        </div>
        <div className="flex items-center gap-4">
          <select 
            value={server}
            onChange={(e) => setServer(e.target.value as 'vidlink' | 'embedsu' | 'vidsrc')}
            className="bg-[#1A1A1C] text-[10px] font-bold uppercase tracking-widest text-white px-3 py-1.5 border border-white/10 outline-none focus:border-blue-500 cursor-pointer"
          >
            <option value="vidlink">Server 1 (Ad-Free)</option>
            <option value="embedsu">Server 2 (Backup)</option>
            <option value="vidsrc">Server 3 (Vidsrc)</option>
          </select>
        </div> {/* Spacer */}
      </nav>

      {/* Content Area */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        <div className="flex-1 bg-black relative flex items-center justify-center border-r border-white/5">
          <iframe
            src={getEmbedUrl()}
            className="w-full h-full border-0"
            allowFullScreen
            allow="autoplay; fullscreen"
            title="Video Player"
          ></iframe>
        </div>

        {/* TV Show Episodes Sidebar */}
        {type === 'tv' && details && (
          <div className="w-full lg:w-[320px] bg-[#0D0D0E] flex flex-col h-[40vh] lg:h-auto overflow-hidden">
            <div className="p-4 border-b border-white/5 flex flex-col gap-3">
              <h3 className="text-xs font-bold uppercase tracking-widest flex items-center gap-2 text-gray-400">
                 <span className="w-1 h-3 bg-blue-600"></span>
                 Episodes
              </h3>
              <select 
                value={season}
                onChange={(e) => navigate(`/player/tv/${id}/${e.target.value}/1`)}
                className="bg-[#1A1A1C] text-xs font-bold uppercase tracking-widest text-white px-3 py-2 border border-white/10 outline-none focus:border-blue-500 w-full"
              >
                {details.seasons?.filter((s: any) => s.season_number > 0).map((s: any) => (
                  <option key={s.id} value={s.season_number}>
                    Season {s.season_number}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="flex-1 overflow-y-auto p-2 custom-scrollbar bg-[#0A0A0B]">
              {loading ? (
                <div className="flex justify-center p-8">
                  <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : seasonData?.episodes ? (
                <div className="flex flex-col gap-1">
                  {seasonData.episodes.map((ep: any) => {
                    const isCurrent = ep.episode_number.toString() === episode;
                    return (
                      <button
                        key={ep.id}
                        onClick={() => navigate(`/player/tv/${id}/${season}/${ep.episode_number}`)}
                        className={`flex items-center text-left gap-3 p-3 transition-colors border-l-2 ${
                          isCurrent 
                            ? 'bg-[#1A1A1C] border-blue-600' 
                            : 'border-transparent hover:bg-white/5'
                        }`}
                      >
                        <div className={`w-6 h-6 flex items-center justify-center flex-shrink-0 text-[10px] font-bold ${
                          isCurrent ? 'bg-blue-600 text-white' : 'bg-white/10 text-gray-400'
                        }`}>
                          {ep.episode_number}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className={`text-xs font-bold uppercase tracking-wide truncate ${isCurrent ? 'text-white' : 'text-gray-400'}`}>
                            {ep.name}
                          </h4>
                        </div>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center text-gray-500 p-8 text-xs font-bold uppercase tracking-widest">
                  No episodes found.
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      
      {/* Bottom Status Bar */}
      <footer className="h-10 bg-[#0D0D0E] border-t border-white/5 flex items-center justify-between px-8 text-[10px] uppercase tracking-widest text-gray-500 font-bold flex-shrink-0">
        <div className="flex gap-6">
          <span>Source: Third-Party</span>
          <span className="hidden sm:inline">Use Adblocker for best experience</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-blue-500"></span>
          <span>Player Ready</span>
        </div>
      </footer>
    </div>
  );
}
