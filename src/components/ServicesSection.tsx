import React from 'react';
import { motion } from 'motion/react';
import { Shield, Smartphone, Zap, Globe } from 'lucide-react';

const features = [
  {
    icon: Shield,
    title: 'Secure Fleet Management',
    description: 'Enterprise-grade security protocols for all mobility assets.',
  },
  {
    icon: Smartphone,
    title: 'Native Applications',
    description: 'Seamless booking and management through our dedicated mobile apps.',
  },
  {
    icon: Zap,
    title: 'Real-time Telemetry',
    description: 'Live tracking and vehicle diagnostic data instantly synced to the cloud.',
  },
  {
    icon: Globe,
    title: 'Unified Authorization',
    description: 'Single sign-on architecture across the entire ECA ecosystem.',
  },
];

export default function ServicesSection() {
  return (
    <section id="services" className="py-24 px-6 md:px-12 lg:px-24 bg-white relative">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <div className="max-w-2xl">
            <h2 className="text-sm font-bold tracking-widest text-orange-500 uppercase mb-4">
              Our Capabilities
            </h2>
            <h3 className="text-4xl md:text-5xl font-sans font-black text-slate-950 tracking-tight leading-tight">
              A comprehensive suite of mobility solutions.
            </h3>
          </div>
          <p className="text-slate-500 max-w-sm text-lg">
            We provide end-to-end services ranging from direct-to-consumer rentals to B2B fleet SaaS platforms.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:border-orange-200 transition-colors group"
              >
                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center mb-6 shadow-sm text-slate-900 group-hover:text-orange-500 group-hover:scale-110 transition-all">
                  <Icon className="w-5 h-5" />
                </div>
                <h4 className="text-lg font-bold text-slate-900 mb-2">{feature.title}</h4>
                <p className="text-sm text-slate-500 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
