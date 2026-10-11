import React, { useState } from 'react';
import {
  Sparkles,
  Heart,
  Users,
  Video,
  Star,
  ChevronRight,
  ArrowRight,
  ShieldCheck,
  Music,
  CheckCircle2,
  Play,
  Clock,
} from 'lucide-react';
import { WEDDING_SERVICES, REAL_WEDDING_GALLERY, WEDDING_TESTIMONIALS } from '../data/danceData';
import { ScreenType } from '../types';

interface WeddingLandingScreenProps {
  onNavigate: (screen: ScreenType) => void;
  onRequestQuote: () => void;
}

export const WeddingLandingScreen: React.FC<WeddingLandingScreenProps> = ({
  onNavigate,
  onRequestQuote,
}) => {
  const [selectedVideoUrl, setSelectedVideoUrl] = useState<string | null>(null);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-10 py-6 space-y-12 pb-24 lg:pb-12 text-[#fafafa]">
      {/* Wedding Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-[#18181b] border border-[#27272a] p-6 sm:p-12 shadow-xl">
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#1e293b] border border-[#3b82f6]/40 text-[#93c5fd] text-xs font-black uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-[#3b82f6]" />
            <span>Luxury Wedding Choreography</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
            Make Your Sangeet & First Dance Unforgettable
          </h1>

          <p className="text-sm sm:text-base text-[#a1a1aa] leading-relaxed">
            Curated certified choreographers, bespoke song edits, beginner-friendly rehearsals, and hybrid online-offline practice for couples and families worldwide.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <button
              onClick={onRequestQuote}
              className="px-8 py-4 rounded-2xl bg-[#3b82f6] hover:bg-[#2563eb] text-white font-black text-xs uppercase tracking-wider transition-all shadow-[0_0_25px_rgba(59,130,246,0.35)] flex items-center justify-center gap-2 active:scale-98"
            >
              <span>Get Custom Choreography Quote</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onNavigate('wedding-choreographers')}
              className="px-6 py-4 rounded-2xl bg-[#18181b] hover:bg-[#27272a] text-[#fafafa] border border-[#27272a] font-bold text-xs uppercase tracking-wider transition-all"
            >
              Browse Choreographers
            </button>
          </div>
        </div>

        {/* Decorative ambient background */}
        <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-30 pointer-events-none hidden md:block">
          <div className="w-full h-full bg-gradient-to-l from-[#3b82f6]/20 to-transparent" />
        </div>
      </div>

      {/* Choreography Formats Bento Grid */}
      <div className="space-y-4">
        <div>
          <span className="text-xs font-black uppercase tracking-widest text-[#3b82f6] block">
            Bespoke Formats
          </span>
          <h2 className="text-2xl font-black text-[#fafafa] tracking-tight">
            Tailored Experiences for Every Stage of the Wedding
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {WEDDING_SERVICES.map((srv) => (
            <div
              key={srv.id}
              onClick={onRequestQuote}
              className="p-6 rounded-3xl bg-[#18181b] border border-[#27272a] hover:border-[#3b82f6]/50 transition-all flex flex-col justify-between space-y-4 cursor-pointer group shadow-sm"
            >
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-[#27272a] border border-[#3f3f46] text-[#3b82f6] flex items-center justify-center font-black text-lg group-hover:scale-105 transition-transform">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-black text-[#fafafa] group-hover:text-[#3b82f6] transition-colors">
                  {srv.title}
                </h3>
                <p className="text-xs text-[#a1a1aa] leading-relaxed">{srv.description}</p>
              </div>

              <div className="pt-3 border-t border-[#27272a] flex items-center justify-between text-xs">
                <span className="text-[#71717a]">Starting from <strong className="text-[#fafafa]">{srv.startingRate}</strong></span>
                <span className="text-[#3b82f6] font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Plan →
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4-Step Effortless Process Cards */}
      <div className="space-y-6">
        <div>
          <span className="text-xs font-black uppercase tracking-widest text-[#3b82f6] block">
            How It Works
          </span>
          <h2 className="text-2xl font-black text-[#fafafa] tracking-tight">
            From Vision to Standing Ovation in 4 Steps
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { step: '01', title: 'Share Songs & Dates', desc: 'Tell us your couple vibe, tracks, and performance dates in 2 minutes.' },
            { step: '02', title: 'Matched with Choreographer', desc: 'Handpicked mentor specialized in your chosen dance style and crowd energy.' },
            { step: '03', title: 'Hybrid Rehearsals', desc: 'Flexible studio sessions + video breakdown recordings to practice anytime.' },
            { step: '04', title: 'Stage Day Magic', desc: 'Final polish and stage coordination for an unforgettable celebration.' },
          ].map((item) => (
            <div key={item.step} className="p-6 rounded-3xl bg-[#18181b] border border-[#27272a] space-y-2">
              <span className="text-2xl font-black text-[#3b82f6] font-mono block">{item.step}</span>
              <h3 className="text-base font-black text-[#fafafa]">{item.title}</h3>
              <p className="text-xs text-[#a1a1aa] leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Real Wedding Gallery & Video Performances */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black text-[#fafafa] tracking-tight">
              Real Couple & Sangeet Performances
            </h2>
            <p className="text-xs text-[#71717a] mt-0.5">Watch routines choreographed by our mentors</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {REAL_WEDDING_GALLERY.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedVideoUrl(item.videoUrl)}
              className="group relative rounded-3xl overflow-hidden bg-[#18181b] border border-[#27272a] hover:border-[#3b82f6]/50 aspect-16/10 cursor-pointer shadow-md"
            >
              <img
                src={item.thumbnail}
                alt={item.coupleName}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80"
              />
              <div className="absolute inset-0 scrim-bottom" />

              {/* Play Button Overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-[#3b82f6] text-white flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.6)] group-hover:scale-110 transition-transform">
                  <Play className="w-5 h-5 fill-white ml-0.5" />
                </div>
              </div>

              <div className="absolute bottom-3 left-4 right-4 text-white space-y-0.5">
                <span className="text-xs uppercase font-bold tracking-widest text-[#3b82f6] block">
                  {item.routineType}
                </span>
                <h3 className="text-base font-black">{item.coupleName}</h3>
                <p className="text-xs text-white/80">{item.songTitle}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Video Modal Preview */}
      {selectedVideoUrl && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#18181b] border border-[#27272a] rounded-3xl max-w-2xl w-full p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-black text-[#fafafa]">Wedding Performance Preview</h3>
              <button
                onClick={() => setSelectedVideoUrl(null)}
                className="p-2 rounded-full bg-[#27272a] text-[#fafafa] text-xs"
              >
                ✕
              </button>
            </div>
            <div className="aspect-16/9 rounded-2xl overflow-hidden bg-black flex items-center justify-center border border-[#27272a]">
              <div className="text-center space-y-2 p-6">
                <Play className="w-12 h-12 text-[#3b82f6] mx-auto animate-pulse" />
                <p className="text-xs text-[#a1a1aa]">
                  Simulated High-Definition Rehearsal Clip Stream
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

