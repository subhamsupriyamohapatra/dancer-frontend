import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { PremiumLogo } from './common/PremiumLogo';

interface SplashScreenProps {
  onEnter?: () => void;
  onEnterApp?: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onEnter, onEnterApp }) => {
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });

  const handleEnter = () => {
    if (onEnterApp) onEnterApp();
    else if (onEnter) onEnter();
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      handleEnter();
    }, 2200);
    return () => clearTimeout(timer);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePos({ x, y });
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      className="relative w-full min-h-screen bg-[#060608] text-[#fafafa] flex flex-col items-center justify-center overflow-hidden select-none cursor-pointer transition-colors duration-500 font-sans"
      style={{
        background: `radial-gradient(circle at ${mousePos.x}% ${mousePos.y}%, rgba(255,255,255,0.04) 0%, #060608 70%)`,
      }}
      onClick={handleEnter}
    >
      {/* Background kinetic ambient grid */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage:
            'radial-gradient(circle, #ffffff 1px, transparent 1px), linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)',
          backgroundSize: '40px 40px, 80px 80px, 80px 80px',
        }}
      />

      <div className="absolute top-8 right-8 z-20">
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleEnter();
          }}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] hover:border-white/30 text-white text-xs font-mono uppercase tracking-wider backdrop-blur-md transition-all shadow-md"
        >
          <span>Enter Platform</span>
          <ArrowRight className="w-3.5 h-3.5 text-amber-300" />
        </button>
      </div>

      {/* Brand Centerpiece - CRED Architectural Minimalism */}
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        className="text-center z-10 flex flex-col items-center justify-center space-y-5 px-6"
      >
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-white/[0.03] border border-white/[0.08] text-xs font-mono tracking-[0.25em] text-amber-300 uppercase font-bold"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
          ALL ABOUT DANCE
        </motion.div>

        {/* Large Bespoke Emblem */}
        <div className="my-2">
          <PremiumLogo size="xl" showWordmark={false} />
        </div>

        <div className="space-y-1">
          <h1 className="font-black text-[38px] sm:text-[54px] md:text-[64px] tracking-[0.22em] text-white uppercase leading-none font-sans">
            DANCE<span className="text-[#a1a1aa] font-medium">ONE</span>
          </h1>
          <p className="text-xs sm:text-sm font-mono text-[#71717a] tracking-[0.3em] uppercase">
            THE PLATFORM FOR DANCERS & CREATORS
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="pt-6"
        >
          <button
            onClick={handleEnter}
            className="px-8 py-3.5 rounded-xl bg-white hover:bg-zinc-200 text-black font-black text-xs sm:text-sm tracking-[0.15em] uppercase shadow-[0_4px_30px_rgba(255,255,255,0.25)] active:scale-95 transition-all flex items-center gap-2.5"
          >
            <span>Explore Experience</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
};

