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
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 px-4 py-4 md:px-8">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Brand Logo */}
        <div 
          className="flex items-center gap-3 cursor-pointer group" 
          onClick={() => onNavigate('hero')}
        >
          <Compass className="h-5 w-5 text-slate-600 group-hover:text-slate-900 transition-colors" />
          <span className="text-lg font-display font-medium tracking-tight text-slate-900">
            ECA Group
          </span>
        </div>

        {/* Minimal Navigation Details */}
        <div className="hidden md:flex items-center gap-6 text-xs font-sans text-slate-500">
          <button
            onClick={() => onNavigate('hero')}
            className={`transition-colors ${activeSection === 'hero' ? 'text-slate-900' : 'hover:text-slate-900'}`}
          >
            Overview
          </button>
          <button
            onClick={() => onNavigate('scroller')}
            className={`transition-colors ${activeSection === 'scroller' ? 'text-slate-900' : 'hover:text-slate-900'}`}
          >
            Experience
          </button>
        </div>

      </div>
    </nav>
  );
}
