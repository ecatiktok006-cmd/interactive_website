import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import VideoScroller from './components/VideoScroller';
import { Compass } from 'lucide-react';
import Lenis from 'lenis';

export default function App() {
  // Try to use a local video if available, fallback to mixkit
  const [currentVideo, setCurrentVideo] = useState(
    '/bgVideo.mp4' // Update this filename if you upload a differently named file into the public/ folder
  );
  
  // Fallback if local video isn't found
  const fallbackVideo = 'https://assets.mixkit.co/videos/preview/mixkit-details-of-a-red-sports-car-40751-large.mp4';
  const displayVideo = currentVideo || fallbackVideo;

  const [isMuted, setIsMuted] = useState(true);
  const [activeSection, setActiveSection] = useState('hero');

  // Initialize Lenis for buttery smooth scrolling
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // smooth exponential easing
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      touchMultiplier: 2,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      if (scrollY < 100) {
        setActiveSection('hero');
      } else {
        setActiveSection('scroller');
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavigation = (sectionId: string) => {
    // If clicking hero, just scroll to top. Video scroller handles the rest.
    if (sectionId === 'hero') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setActiveSection('hero');
    } else if (sectionId === 'scroller') {
      const element = document.getElementById(sectionId);
      if (element) {
        // Scroll slightly down to trigger the scroller logic
        const y = element.getBoundingClientRect().top + window.scrollY + 100;
        window.scrollTo({ top: y, behavior: 'smooth' });
        setActiveSection('scroller');
      }
    }
  };

  return (
    <div className="bg-slate-50 text-slate-900 min-h-screen font-sans selection:bg-slate-900 selection:text-white">
      <Navbar
        currentVideo={displayVideo}
        setCurrentVideo={setCurrentVideo}
        isMuted={isMuted}
        toggleMute={() => setIsMuted(!isMuted)}
        activeSection={activeSection}
        onNavigate={handleNavigation}
      />

      {/* --- TIMELINE ROOT SCROLL ELEMENT (Contains the Hero as Segment 0) --- */}
      <VideoScroller videoUrl={displayVideo} isMuted={isMuted} />

      {/* --- MINIMAL FOOTER --- */}
      <footer className="bg-slate-50 py-16 px-4 md:px-8 border-t border-slate-200">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          
          <div className="flex items-center gap-3">
            <Compass className="h-5 w-5 text-slate-600" />
            <span className="text-lg font-display font-medium text-slate-950 tracking-tight">
              ECA Group
            </span>
          </div>

          <p className="text-slate-500 text-sm font-sans">
            © {new Date().getFullYear()} ECA Group. All rights reserved.
          </p>

        </div>
      </footer>
    </div>
  );
}
