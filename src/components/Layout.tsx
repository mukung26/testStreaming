import React from 'react';
import { Navbar } from './Navbar';
import { Outlet } from 'react-router-dom';

export function Layout() {
  return (
    <div className="min-h-screen bg-[#0A0A0B] text-white font-sans flex flex-col selection:bg-blue-500/30">
      <Navbar />
      <main className="flex-1 pb-16">
        <Outlet />
      </main>
      {/* Footer bar */}
      <footer className="h-10 bg-[#0D0D0E] border-t border-white/5 flex items-center justify-between px-8 text-[10px] uppercase tracking-widest text-gray-500 font-bold fixed bottom-0 w-full z-50">
        <div className="flex gap-6">
          <span>Current Region: United States</span>
          <span className="hidden sm:inline">Streaming Quality: 4K Ultra HD</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-500"></span>
          <span>Servers Operational</span>
        </div>
      </footer>
    </div>
  );
}
