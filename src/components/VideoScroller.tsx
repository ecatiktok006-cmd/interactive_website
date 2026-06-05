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

  const targetTime = useRef(0);
  const debugRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isVideoReady) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isVideoReady]);

  // Track scroll and update target time instantly
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const containerTop = window.scrollY + rect.top; // Absolute top of the container
      const containerHeight = containerRef.current.offsetHeight - window.innerHeight; // Total scrollable distance
      
      let progress = 0;
      if (containerHeight > 0) {
        progress = (window.scrollY - containerTop) / containerHeight;
        progress = Math.max(0, Math.min(1, progress));
      }
      
      // Store where the video *should* be
      targetTime.current = progress * totalDuration;

      // Update UI segments
      if (progress < 0.25) {
        setActiveSegment(0);
      } else if (progress >= 0.25 && progress < 0.6) {
        setActiveSegment(1);
      } else {
        setActiveSegment(2);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [totalDuration]);

  // Continuous smooth render loop for the video decoder
  useEffect(() => {
    let animationFrameId: number;
    let virtualTime = 0;
    let hasForceSynced = false;
    let lastRenderedTime = -1;

    const renderLoop = () => {
      if (videoRef.current && isVideoReady) {
        const target = targetTime.current;
        
        // Force the absolute first frame sync to 0.0s to ensure a clean start
        if (!hasForceSynced) {
           videoRef.current.currentTime = 0;
           virtualTime = 0;
           lastRenderedTime = 0;
           hasForceSynced = true;
        }

        // Linear Interpolation (Lerp) - smoothly glide towards the target timestamp
        const diff = target - virtualTime;
        if (Math.abs(diff) > 0.005) {
          // Quick glide
          virtualTime += diff * 0.1;
          
          // Throttling MP4 updates:
          // Browsers choke if you set currentTime 60 times a second on an MP4.
          // We only write to currentTime if the virtualTime has moved by at least 0.03s (~30fps)
          if (Math.abs(virtualTime - lastRenderedTime) > 0.03) {
            videoRef.current.currentTime = virtualTime;
            lastRenderedTime = virtualTime;
          }
        } else if (virtualTime !== target) {
          // Snap perfectly to target
          virtualTime = target;
          if (Math.abs(virtualTime - lastRenderedTime) > 0) {
            videoRef.current.currentTime = target;
            lastRenderedTime = target;
          }
        }

        const current = virtualTime;

        if (debugRef.current) {
           const progressPercent = totalDuration > 0 ? (target / totalDuration) * 100 : 0;
           debugRef.current.innerHTML = `
             <div class="text-[10px] text-slate-500 mb-2 border-b border-slate-800 pb-1 uppercase tracking-widest font-bold">Diagnostic Visualizer</div>
             <div class="flex justify-between items-center py-0.5"><span>Scroll %:</span> <span class="text-white font-medium">${progressPercent.toFixed(2)}%</span></div>
             <div class="flex justify-between items-center py-0.5"><span>Target:</span> <span class="text-amber-400 font-medium">${target.toFixed(3)}s</span></div>
             <div class="flex justify-between items-center py-0.5"><span>Current Virtual:</span> <span class="text-emerald-400 font-medium">${current.toFixed(3)}s</span></div>
             <div class="flex justify-between items-center py-0.5"><span>Actual Video Time:</span> <span class="text-emerald-600 font-medium">${videoRef.current.currentTime.toFixed(3)}s</span></div>
             <div class="flex justify-between items-center py-0.5 pt-2 mt-1 border-t border-slate-800/50 text-[10px] text-slate-500"><span>Duration:</span> <span>${totalDuration.toFixed(3)}s</span></div>
           `;
        }
      }
      animationFrameId = requestAnimationFrame(renderLoop);
    };

    renderLoop();
    return () => cancelAnimationFrame(animationFrameId);
  }, [isVideoReady, totalDuration]);

  const handleVideoLoaded = () => {
    setIsVideoReady(true);
    if (videoRef.current && !isNaN(videoRef.current.duration) && videoRef.current.duration > 0) {
      if (videoRef.current.duration !== Infinity) {
        setTotalDuration(videoRef.current.duration);
      }

      // Instead of playing and pausing (which advances time forward unexpectedly and skips 0.0s),
      // we explicitly just set currentTime to 0 to initialize the first frame.
      videoRef.current.currentTime = 0;
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
      <div className="sticky top-0 left-0 w-full h-screen overflow-hidden flex flex-col items-start justify-start">
        
        {/* Background Video */}
        <div className="absolute inset-0 z-0 bg-slate-50 flex items-center justify-center pointer-events-none">
          <video
            ref={videoRef}
            src={videoUrl}
            className="w-full h-full object-cover"
            autoPlay={false}
            muted={true}
            playsInline={true}
            preload="auto"
            onLoadedMetadata={handleVideoLoaded}
            onLoadedData={handleVideoLoaded}
          />
          {/* Subtle overlay to guarantee text readability without losing the pure white studio feel */}
          <div className="absolute inset-0 bg-white/10" />

          {/* Fallback Loading State / Pre-loader */}
          <AnimatePresence>
            {!isVideoReady && (
              <motion.div 
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8 }}
                className="absolute inset-0 z-[200] bg-slate-50 flex flex-col items-center justify-center text-slate-900 gap-6"
              >
                <div className="relative flex items-center justify-center">
                  <div className="w-16 h-16 border-4 border-slate-200 rounded-full"></div>
                  <div className="w-16 h-16 border-4 border-slate-900 rounded-full border-t-transparent animate-spin absolute top-0 left-0"></div>
                </div>
                <p className="font-mono text-xs tracking-[0.2em] uppercase text-slate-500">Initializing Engine...</p>
              </motion.div>
            )}
          </AnimatePresence>
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
                <div className="absolute left-6 md:left-12 lg:left-24 top-32 lg:top-40 mt-safe">
                  <h1 className="text-7xl md:text-8xl lg:text-[10rem] font-sans font-black text-slate-950 uppercase tracking-tighter leading-[0.8] mix-blend-multiply flex flex-col">
                    <span>ECA</span>
                    <span>GROUP</span>
                  </h1>
                  <p className="text-sm md:text-base font-serif tracking-[0.15em] uppercase text-slate-900 mt-6 mix-blend-multiply font-semibold">
                    Integrated Ecosystem
                  </p>
                </div>

                {/* Scroll to Explore Mouse Icon */}
                <div className="absolute bottom-8 left-6 md:left-12 lg:left-24 flex flex-col gap-3">
                  <div className="w-[1px] h-16 bg-slate-300 relative overflow-hidden hidden sm:block">
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
                      <span className="text-slate-600 font-sans text-sm">1-Day Weekend Rate</span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-medium text-slate-400 line-through text-xs">RM 150</span>
                        <span className="font-mono font-bold text-orange-600">RM 160/day</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center border-b border-slate-200/60 pb-3">
                      <span className="text-slate-600 font-sans text-sm">Long-Term Lease</span>
                      <span className="font-mono font-bold text-orange-600">RM 120/day</span>
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
                {/* Node 1 (Top Left) */}
                <motion.div 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                  className="absolute left-6 md:left-24 lg:left-48 top-1/3 max-w-xs bg-white/70 backdrop-blur-2xl p-6 rounded-3xl border border-white/80 shadow-2xl hover:-translate-y-1 transition-transform"
                >
                  <div className="h-10 w-10 rounded-full bg-orange-500 flex items-center justify-center mb-4">
                    <div className="h-4 w-4 bg-white rounded-full shadow-sm" />
                  </div>
                  <h3 className="text-xl font-display font-bold text-slate-950 tracking-tight">Daily Car Rental</h3>
                  <p className="text-sm font-sans text-slate-600 mt-2 leading-relaxed">
                    Direct-to-consumer mobility with unified authorization nodes.
                  </p>
                </motion.div>

                {/* Connecting visual element (unchanged) */}
                <motion.div 
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.6, duration: 0.8 }}
                  className="hidden lg:block absolute top-[40%] left-[25%] right-[25%] h-px bg-gradient-to-r from-transparent via-slate-400 to-transparent origin-left opacity-60"
                />

                {/* Node 2 (Bottom Right) */}
                <motion.div 
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                  className="absolute right-6 md:right-24 lg:right-48 bottom-1/3 max-w-xs bg-white/70 backdrop-blur-2xl p-6 rounded-3xl border border-white/80 shadow-2xl hover:-translate-y-1 transition-transform"
                >
                  <div className="h-10 w-10 rounded-full bg-slate-950 flex items-center justify-center mb-4">
                    <div className="h-4 w-4 bg-white rounded-full" />
                  </div>
                  <h3 className="text-xl font-display font-bold text-slate-950 tracking-tight">SaaS Provider</h3>
                  <p className="text-sm font-sans text-slate-600 mt-2 leading-relaxed">
                    Cloud-native fleet management and enterprise telematics mapping.
                  </p>
                </motion.div>
                
              </motion.div>
            )}
            
          </AnimatePresence>
        </div>

        {/* Diagnostic Visualizer Overlay */}
        <div 
          ref={debugRef}
          className="fixed bottom-6 right-6 w-56 bg-slate-950/95 backdrop-blur-xl border border-slate-800 shadow-2xl p-4 rounded-xl z-[100] font-mono text-xs text-slate-400 pointer-events-none"
        >
          {/* Initial empty state before JS fills it */}
          <div className="text-[10px] text-slate-500 mb-2 border-b border-slate-800 pb-1 uppercase tracking-widest font-bold">Diagnostic Visualizer</div>
          <p className="text-center text-slate-500 py-2">Loading data...</p>
        </div>

      </div>
    </div>
  );
}
