import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RefreshCw, MessageCircle } from 'lucide-react';

interface VideoScrollerProps {
  videoUrl: string;
  isMuted: boolean;
}

export default function VideoScroller({ videoUrl }: VideoScrollerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // States
  const [videoTime, setVideoTime] = useState(0);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [activeSegment, setActiveSegment] = useState<0 | 1 | 2>(0);
  const [totalDuration, setTotalDuration] = useState(6.0);

  // Handle standard viewport scroll tracking with requestAnimationFrame
  useEffect(() => {
    let animationFrameId: number;

    const handleScroll = () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      
      animationFrameId = requestAnimationFrame(() => {
        if (!containerRef.current) return;

        const rect = containerRef.current.getBoundingClientRect();
        const containerHeight = containerRef.current.scrollHeight - window.innerHeight;
        const progress = Math.max(0, Math.min(1, -rect.top / containerHeight));
        
        const computedTime = progress * totalDuration;
        setVideoTime(computedTime);

        // Map segments based on percentage of scroll
        if (progress < 0.25) {
          setActiveSegment(0);
        } else if (progress >= 0.25 && progress < 0.6) {
          setActiveSegment(1);
        } else {
          setActiveSegment(2);
        }

        if (videoRef.current && isVideoReady) {
          // Smoothly scrub the video to computedTime
          try {
            videoRef.current.currentTime = computedTime;
          } catch(e) {}
        }
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Run once on load to sync initial state
    handleScroll();
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [isVideoReady, totalDuration]);

  const handleVideoLoaded = () => {
    setIsVideoReady(true);
    if (videoRef.current && !isNaN(videoRef.current.duration) && videoRef.current.duration > 0) {
      // Avoid infinite durations that some streams report
      if (videoRef.current.duration !== Infinity) {
        setTotalDuration(videoRef.current.duration);
      }
    }
  };

  return (
    <div 
      id="scroller" 
      ref={containerRef} 
      className="relative w-full bg-slate-50" 
      style={{ height: '400vh' }}
    >
      {/* Sticky presentation screen */}
      <div className="sticky top-0 left-0 w-full h-screen overflow-hidden flex flex-col items-center justify-center">
        
        {/* Background Video */}
        <div className="absolute inset-0 z-0 bg-slate-50 flex items-center justify-center pointer-events-none">
          <video
            ref={videoRef}
            src={videoUrl}
            className="w-full h-full object-cover"
            muted={true}
            playsInline={true}
            preload="auto"
            onLoadedMetadata={handleVideoLoaded}
            onLoadedData={handleVideoLoaded}
          />
          {/* Subtle overlay to guarantee text readability without losing the pure white studio feel */}
          <div className="absolute inset-0 bg-white/10" />

          {/* Fallback Loading State */}
          {!isVideoReady && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-50 text-slate-600 gap-3 text-sm z-50">
              <RefreshCw className="h-5 w-5 animate-spin" />
              <p className="font-light tracking-wide uppercase font-sans">Buffering video layer...</p>
            </div>
          )}
        </div>

        {/* Minimal Information Overlay mapped to scrolling timeline */}
        <div className="absolute inset-0 z-10 pointer-events-none max-w-7xl mx-auto w-full">
          <AnimatePresence mode="wait">
            
            {/* Prompt 1: The Hero Section (Timestamp 0.0s) */}
            {activeSegment === 0 && (
              <motion.div
                key="seg0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8 }}
                className="absolute inset-0"
              >
                <div className="absolute left-6 md:left-12 lg:left-24 top-1/2 -translate-y-1/2">
                  <h1 className="text-6xl md:text-8xl font-display font-black text-slate-950 uppercase tracking-tighter leading-none mix-blend-multiply">
                    ECA GROUP
                  </h1>
                  <p className="text-lg md:text-2xl font-sans tracking-[0.25em] uppercase text-slate-800 mt-2 mix-blend-multiply font-medium">
                    Integrated Ecosystem
                  </p>
                </div>
                
                {/* Scroll to Explore Mouse Icon */}
                <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3">
                  <p className="text-[10px] font-mono tracking-[0.2em] uppercase text-slate-500">Scroll to Explore</p>
                  <div className="w-[1px] h-16 bg-slate-300 relative overflow-hidden">
                    <motion.div 
                      className="absolute top-0 left-0 w-full h-1/2 bg-slate-800"
                      animate={{ y: [0, 64] }}
                      transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Prompt 2: First Scroll Stop (Timestamp 1.0s - Services) */}
            {activeSegment === 1 && (
              <motion.div
                key="seg1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8 }}
                className="absolute inset-0 flex items-center justify-between px-6 md:px-12 lg:px-24"
              >
                {/* Frosted Glass UI Panel */}
                <motion.div 
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                  className="w-full max-w-sm bg-white/60 backdrop-blur-2xl p-8 rounded-[2rem] border border-white/80 shadow-[0_8px_32px_rgba(0,0,0,0.05)] pointer-events-auto"
                >
                  <h2 className="text-3xl font-display font-bold text-slate-950 mb-6">Daily Rentals</h2>
                  
                  <div className="space-y-4 mb-8">
                    <div className="flex justify-between items-center border-b border-slate-200/60 pb-3">
                      <span className="text-slate-600 font-sans text-sm">Weekend Getaway Rate</span>
                      <span className="font-mono font-bold text-orange-600">RM 150/day</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-slate-200/60 pb-3">
                      <span className="text-slate-600 font-sans text-sm">Long-Term Lease</span>
                      <span className="font-mono font-bold text-orange-600">RM 110/day</span>
                    </div>
                    <div className="flex justify-between items-center pb-2">
                      <span className="text-slate-600 font-sans text-sm">Keyless Entry</span>
                      <span className="font-mono font-bold text-green-600 text-xs bg-green-100 px-2 py-0.5 rounded-full">Included</span>
                    </div>
                  </div>

                  <button className="w-full bg-slate-950 hover:bg-slate-800 text-white font-sans text-sm font-medium rounded-full py-4 flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5">
                    <MessageCircle className="w-4 h-4" /> ECA Rental Customer Service
                  </button>
                </motion.div>

                {/* Typography Layer */}
                <motion.div 
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                  className="hidden md:block text-right mb-24 lg:mb-0"
                >
                  <h1 className="text-6xl lg:text-8xl font-display font-black text-slate-900 uppercase tracking-tighter leading-[0.8] mix-blend-multiply">
                    SERVICE<br/>
                    <span className="text-orange-500 mix-blend-normal">OFFERED</span>
                  </h1>
                </motion.div>
              </motion.div>
            )}

            {/* Prompt 3: Second Scroll Stop (Timestamp 2.4s - The Ecosystem) */}
            {activeSegment === 2 && (
              <motion.div
                key="seg2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8 }}
                className="absolute inset-0 flex items-center justify-center pointer-events-auto"
              >
                {/* Node 1: SaaS Provider */}
                <motion.div 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                  className="absolute left-6 md:left-24 lg:left-48 top-1/3 max-w-xs bg-white/70 backdrop-blur-2xl p-6 rounded-3xl border border-white/80 shadow-2xl hover:-translate-y-1 transition-transform"
                >
                  <div className="h-10 w-10 rounded-full bg-slate-950 flex items-center justify-center mb-4">
                    <div className="h-4 w-4 bg-white rounded-full" />
                  </div>
                  <h3 className="text-xl font-display font-bold text-slate-950 tracking-tight">SaaS Provider</h3>
                  <p className="text-sm font-sans text-slate-600 mt-2 leading-relaxed">
                    Cloud-native fleet management and enterprise telematics mapping.
                  </p>
                </motion.div>

                {/* Connecting visual element */}
                <motion.div 
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.6, duration: 0.8 }}
                  className="hidden lg:block absolute top-[40%] left-[25%] right-[25%] h-px bg-gradient-to-r from-transparent via-slate-400 to-transparent origin-left opacity-60"
                />

                {/* Node 2: Daily Car Rental */}
                <motion.div 
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                  className="absolute right-6 md:right-24 lg:right-48 bottom-1/3 max-w-xs bg-white/70 backdrop-blur-2xl p-6 rounded-3xl border border-white/80 shadow-2xl hover:-translate-y-1 transition-transform"
                >
                  <div className="h-10 w-10 rounded-full bg-orange-500 flex items-center justify-center mb-4">
                    <div className="h-4 w-4 bg-white rounded-full shadow-sm" />
                  </div>
                  <h3 className="text-xl font-display font-bold text-slate-950 tracking-tight">Daily Car Rental</h3>
                  <p className="text-sm font-sans text-slate-600 mt-2 leading-relaxed">
                    Direct-to-consumer mobility with unified authorization nodes.
                  </p>
                </motion.div>
                
              </motion.div>
            )}
            
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
