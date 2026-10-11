import React, { useState } from 'react';
import {
  MapPin,
  Navigation,
  Star,
  Clock,
  Compass,
  ArrowRight,
  Sparkles,
  Layers,
  ChevronRight,
} from 'lucide-react';
import { MAP_STUDIOS, FLOW_STUDIO_DATA } from '../data/danceData';
import { ScreenType, Studio } from '../types';

interface StudioMapViewProps {
  onNavigate: (screen: ScreenType) => void;
  onSelectStudio: (studio: Studio) => void;
}

export const StudioMapView: React.FC<StudioMapViewProps> = ({
  onNavigate,
  onSelectStudio,
}) => {
  const [selectedStudio, setSelectedStudio] = useState<Studio>(FLOW_STUDIO_DATA);
  const [activeAreaFilter, setActiveAreaFilter] = useState('All');

  const filteredStudios = MAP_STUDIOS.filter((s) => {
    if (activeAreaFilter === 'All') return true;
    return s.address.toLowerCase().includes(activeAreaFilter.toLowerCase());
  });

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-10 py-6 space-y-6 pb-24 lg:pb-12 text-[#fafafa]">
      {/* Header & Area Filter Pills */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#3b82f6]">
            <Compass className="w-3.5 h-3.5" />
            Studio Navigator
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#fafafa] tracking-tight">
            Dance Studio Map
          </h1>
          <p className="text-xs text-[#a1a1aa] mt-0.5">
            Discover verified sprung hardwood spaces and live drop-in classes
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar text-xs font-bold uppercase tracking-wider">
          {['All', 'Patia', 'CDA Sector', 'Chandrasekharpur', 'Saheed Nagar', 'Nayapalli'].map((area) => {
            const isSelected = activeAreaFilter === area;
            return (
              <button
                key={area}
                onClick={() => setActiveAreaFilter(area)}
                className={`px-4 py-2 rounded-full whitespace-nowrap transition-all border ${
                  isSelected
                    ? 'bg-[#3b82f6] text-white border-[#3b82f6] shadow-[0_0_15px_rgba(59,130,246,0.35)]'
                    : 'bg-[#18181b] text-[#a1a1aa] border-[#27272a] hover:border-[#3f3f46] hover:text-[#fafafa]'
                }`}
              >
                {area}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Map Container */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Visual Map Canvas (2 Cols on desktop) */}
        <div className="lg:col-span-2 relative h-[420px] sm:h-[500px] rounded-3xl overflow-hidden bg-[#121215] border border-[#27272a] shadow-inner flex items-center justify-center">
          {/* Stylized Dark Grid Lines for Map */}
          <div
            className="absolute inset-0 opacity-20 pointer-events-none"
            style={{
              backgroundImage:
                'radial-gradient(circle, #3b82f6 1px, transparent 1px), linear-gradient(to right, #27272a 1px, transparent 1px), linear-gradient(to bottom, #27272a 1px, transparent 1px)',
              backgroundSize: '40px 40px, 80px 80px, 80px 80px',
            }}
          />

          {/* Map Landmarks / Roads Stylized SVG */}
          <svg className="absolute inset-0 w-full h-full opacity-30 pointer-events-none">
            <path
              d="M -50 200 Q 200 150 400 350 T 900 300"
              fill="none"
              stroke="#3f3f46"
              strokeWidth="12"
            />
            <path
              d="M 150 -50 Q 250 250 300 600"
              fill="none"
              stroke="#27272a"
              strokeWidth="8"
            />
            <path
              d="M 500 -50 Q 400 300 700 600"
              fill="none"
              stroke="#27272a"
              strokeWidth="6"
            />
            <circle cx="350" cy="220" r="180" fill="#3b82f6" fillOpacity="0.05" />
          </svg>

          {/* Studio Map Pins */}
          <div className="relative w-full h-full">
            {filteredStudios.map((studio, idx) => {
              const isSelected = selectedStudio.id === studio.id;
              // Spread pins across the canvas
              const positions = [
                { top: '38%', left: '42%' },
                { top: '25%', left: '68%' },
                { top: '65%', left: '30%' },
                { top: '72%', left: '60%' },
                { top: '48%', left: '80%' },
              ];
              const pos = positions[idx % positions.length];

              return (
                <div
                  key={studio.id}
                  style={{ top: pos.top, left: pos.left }}
                  onClick={() => setSelectedStudio(studio)}
                  className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer z-20 group"
                >
                  <div
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full shadow-lg transition-all border ${
                      isSelected
                        ? 'bg-[#3b82f6] text-white border-white scale-110 shadow-[0_0_20px_rgba(59,130,246,0.6)]'
                        : 'bg-[#18181b] text-[#fafafa] border-[#27272a] hover:border-[#3b82f6] hover:scale-105'
                    }`}
                  >
                    <MapPin className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-[#3b82f6]'}`} />
                    <span className="text-xs font-black tracking-tight">{studio.name}</span>
                  </div>

                  {/* Pulsing beacon underneath pin */}
                  {isSelected && (
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-[#3b82f6]/30 animate-ping pointer-events-none" />
                  )}
                </div>
              );
            })}
          </div>

          {/* Floating Map Controls */}
          <div className="absolute bottom-4 right-4 flex flex-col gap-2 z-20">
            <button
              onClick={() => setActiveAreaFilter('All')}
              className="p-3 rounded-2xl bg-[#18181b]/90 backdrop-blur-md border border-[#27272a] text-[#fafafa] hover:border-[#3b82f6] transition-colors shadow-md"
              title="Recenter Map"
            >
              <Navigation className="w-4 h-4 text-[#3b82f6]" />
            </button>
          </div>
        </div>

        {/* Selected Studio Details Card (1 Col on desktop) */}
        <div className="bg-[#18181b] rounded-3xl p-6 border border-[#27272a] shadow-md flex flex-col justify-between space-y-5">
          <div className="space-y-4">
            <div className="relative aspect-16/10 rounded-2xl overflow-hidden bg-[#121215] border border-[#27272a]">
              <img
                src={selectedStudio.heroImage}
                alt={selectedStudio.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 scrim-bottom" />
              <div className="absolute bottom-3 left-3 right-3 text-white flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-black">{selectedStudio.name}</h3>
                  <p className="text-xs text-white/80">{selectedStudio.neighborhood}</p>
                </div>
                <div className="flex items-center gap-1 bg-[#3b82f6] px-2.5 py-1 rounded-full text-xs font-black">
                  <Star className="w-3.5 h-3.5 fill-white text-white" />
                  <span>{selectedStudio.rating}</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-xs uppercase font-bold tracking-widest text-[#71717a]">
                Available Disciplines
              </span>
              <div className="flex items-center gap-1.5 flex-wrap">
                {(selectedStudio.styles || []).map((style) => (
                  <span
                    key={style}
                    className="px-2.5 py-1 rounded-full bg-[#27272a] text-[#fafafa] border border-[#3f3f46] text-xs font-extrabold uppercase tracking-wider"
                  >
                    {style}
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-1 text-xs text-[#a1a1aa]">
              <p className="line-clamp-3 leading-relaxed">{selectedStudio.about}</p>
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-[#27272a]">
            <button
              onClick={() => {
                onSelectStudio(selectedStudio);
                onNavigate('studio-profile');
              }}
              className="w-full py-3.5 rounded-2xl bg-[#3b82f6] hover:bg-[#2563eb] text-white text-xs font-black uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(59,130,246,0.3)] active:scale-98 flex items-center justify-center gap-2"
            >
              <span>View Full Studio Profile</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

