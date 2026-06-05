import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';

export default function AboutSection() {
  return (
    <section id="about" className="py-24 px-6 md:px-12 lg:px-24 bg-slate-950 text-white relative overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 w-[50vw] h-[50vw] bg-orange-500/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/4 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-5xl md:text-7xl font-sans font-black tracking-tighter mb-6 leading-none">
              SHAPING THE <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">
                FUTURE OF
              </span><br/>
              MOBILITY
            </h2>
            <p className="text-slate-400 text-lg md:text-xl max-w-lg mb-8 leading-relaxed font-light">
              ECA Group is an integrated ecosystem merging deep automotive experience with cutting-edge software architecture. From consumer vehicle rentals to enterprise fleet management systems.
            </p>
            
            <button className="flex items-center gap-3 font-semibold text-white group pb-2 border-b-2 border-orange-500 w-fit">
              <span>Read Our Story</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform text-orange-500" />
            </button>
          </motion.div>

          {/* Stats Grid */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid grid-cols-2 gap-4 md:gap-8"
          >
            <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 p-8 rounded-3xl">
              <div className="text-4xl md:text-5xl font-black text-white mb-2">500+</div>
              <div className="text-sm font-medium text-slate-500 uppercase tracking-wider">Vehicles in Fleet</div>
            </div>
            <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 p-8 rounded-3xl">
              <div className="text-4xl md:text-5xl font-black text-white mb-2">50k</div>
              <div className="text-sm font-medium text-slate-500 uppercase tracking-wider">Active Users</div>
            </div>
            <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 p-8 rounded-3xl">
              <div className="text-4xl md:text-5xl font-black text-white mb-2">99.9%</div>
              <div className="text-sm font-medium text-slate-500 uppercase tracking-wider">SaaS Uptime</div>
            </div>
            <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 p-8 rounded-3xl">
              <div className="text-4xl md:text-5xl font-black text-orange-500 mb-2">24/7</div>
              <div className="text-sm font-medium text-slate-500 uppercase tracking-wider">Support Operation</div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
