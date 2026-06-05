import React from 'react';
import { Compass } from 'lucide-react';

interface NavbarProps {
  currentVideo: string;
  setCurrentVideo: (url: string) => void;
  isMuted: boolean;
  toggleMute: () => void;
  activeSection: string;
  onNavigate: (sectionId: string) => void;
}

export default function Navbar({
  activeSection,
  onNavigate,
}: NavbarProps) {
  return (
    <nav className="fixed top-8 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-[600px] h-14 bg-white shadow-lg border border-slate-100 rounded-full px-6 py-2 flex items-center justify-between">
      {/* Brand Logo */}
      <div 
        className="flex items-center gap-3 cursor-pointer group" 
        onClick={() => onNavigate('hero')}
      >
        <span className="text-lg font-sans font-bold tracking-tight text-slate-900 hidden sm:block">
          ECA Group
        </span>
      </div>

      {/* Minimal Navigation Details */}
      <div className="flex items-center gap-6 text-sm font-sans text-slate-500 font-medium tracking-wide flex-1 justify-center">
        <button
          onClick={() => onNavigate('hero')}
          className={`transition-colors hidden sm:block ${activeSection === 'hero' ? 'text-slate-900' : 'hover:text-slate-900'}`}
        >
          Overview
        </button>
        <button
          onClick={() => onNavigate('scroller')}
          className={`transition-colors ${activeSection === 'scroller' ? 'text-slate-900' : 'hover:text-slate-900'}`}
        >
          Ecosystem
        </button>
        <button
          onClick={() => onNavigate('about')}
          className={`transition-colors max-sm:text-xs ${activeSection === 'about' ? 'text-slate-900' : 'hover:text-slate-900'}`}
        >
          About
        </button>
        <button
          onClick={() => onNavigate('services')}
          className={`transition-colors max-sm:text-xs ${activeSection === 'services' ? 'text-slate-900' : 'hover:text-slate-900'}`}
        >
          Services
        </button>
      </div>
      
      {/* Search Icon Placeholder */}
      <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center cursor-pointer hover:bg-slate-200 transition-colors">
         <span className="text-slate-400 text-[10px] sm:hidden">...</span>
      </div>
    </nav>
  );
}
