import React, { useState } from 'react';
import {
  Sparkles,
  Star,
  ArrowRight,
  ShieldCheck,
  Search,
  SlidersHorizontal,
  ChevronRight,
  Heart,
} from 'lucide-react';
import { WEDDING_CHOREOGRAPHERS } from '../data/danceData';
import { ScreenType, WeddingChoreographer } from '../types';

interface WeddingChoreographersScreenProps {
  onNavigate: (screen: ScreenType) => void;
  onRequestQuoteWithChoreographer: (choreographer: WeddingChoreographer) => void;
}

export const WeddingChoreographersScreen: React.FC<WeddingChoreographersScreenProps> = ({
  onNavigate,
  onRequestQuoteWithChoreographer,
}) => {
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredChoreographers = WEDDING_CHOREOGRAPHERS.filter((c) => {
    const matchesSearch =
      searchQuery === '' ||
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.location.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesGenre =
      selectedGenre === 'All' ||
      c.specialty.toLowerCase().includes(selectedGenre.toLowerCase()) ||
      c.genres.some((g) => g.toLowerCase().includes(selectedGenre.toLowerCase()));

    return matchesSearch && matchesGenre;
  });

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-10 py-6 space-y-8 pb-24 lg:pb-12 text-[#fafafa]">
      {/* Header */}
      <div className="space-y-1">
        <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#3b82f6]">
          <Sparkles className="w-3.5 h-3.5" />
          Certified Wedding Directory
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-[#fafafa] tracking-tight">
          Wedding Choreographers & Stage Directors
        </h1>
        <p className="text-xs text-[#a1a1aa]">
          Book top-tier mentors for couples, medleys, flashmobs, and bridal entries
        </p>
      </div>

      {/* Search & Genre Filter Bar */}
      <div className="space-y-3">
        <div className="relative flex items-center">
          <Search className="absolute left-4 w-4 h-4 text-[#71717a]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search choreographers by name, city, or style..."
            className="w-full pl-11 pr-10 py-3 bg-[#18181b] border border-[#27272a] focus:border-[#3b82f6] text-sm text-[#fafafa] placeholder:text-[#71717a] rounded-2xl outline-none shadow-inner"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-1">
          {['All', 'Bollywood', 'Contemporary', 'Semi-Classical', 'Hip-Hop Fusion', 'Salsa Couple'].map(
            (genre) => (
              <button
                key={genre}
                onClick={() => setSelectedGenre(genre)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all border ${
                  selectedGenre === genre
                    ? 'bg-[#3b82f6] text-white border-[#3b82f6] shadow-[0_0_12px_rgba(59,130,246,0.3)]'
                    : 'bg-[#18181b] text-[#a1a1aa] border-[#27272a] hover:border-[#3f3f46] hover:text-[#fafafa]'
                }`}
              >
                {genre}
              </button>
            )
          )}
        </div>
      </div>

      {/* Choreographers Directory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredChoreographers.length === 0 ? (
          <div className="col-span-full py-16 text-center rounded-3xl bg-[#18181b] border border-dashed border-[#27272a] p-8 space-y-3">
            <p className="text-base font-bold text-white">No wedding choreographers listed yet</p>
            <p className="text-xs text-[#a1a1aa] max-w-sm mx-auto">Choreographers and stage mentors can register to offer couples coaching, sangeet medleys, and flashmob packages.</p>
            <button
              onClick={() => onNavigate('instructor-dashboard')}
              className="px-5 py-2.5 rounded-xl bg-[#3b82f6] hover:bg-[#2563eb] text-white font-bold text-xs shadow-lg transition-all"
            >
              + Join as Choreographer
            </button>
          </div>
        ) : (
          filteredChoreographers.map((choreo) => (
            <div
              key={choreo.id}
              className="p-6 rounded-3xl bg-[#18181b] border border-[#27272a] hover:border-[#3b82f6]/50 transition-all flex flex-col justify-between space-y-5 shadow-sm group"
            >
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <img
                    src={choreo.avatar}
                    alt={choreo.name}
                    referrerPolicy="no-referrer"
                    className="w-16 h-16 rounded-2xl object-cover border border-[#27272a] shrink-0 group-hover:scale-105 transition-transform"
                  />
                  <div className="space-y-1">
                    <div className="flex items-center gap-1 bg-[#1e293b] px-2 py-0.5 rounded-md text-xs font-black text-[#93c5fd] inline-flex">
                      <Star className="w-3 h-3 fill-[#f59e0b] text-[#f59e0b]" />
                      <span>{choreo.rating} ({choreo.weddingsCompleted}+ Sangeets)</span>
                    </div>
                    <h3 className="text-lg font-black text-[#fafafa] group-hover:text-[#3b82f6] transition-colors">
                      {choreo.name}
                    </h3>
                    <p className="text-xs text-[#a1a1aa]">{choreo.location}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {choreo.genres.map((g) => (
                    <span
                      key={g}
                      className="px-2.5 py-0.5 rounded-full bg-[#27272a] text-[#fafafa] border border-[#3f3f46] text-xs font-extrabold uppercase"
                    >
                      {g}
                    </span>
                  ))}
                </div>

                <p className="text-xs text-[#a1a1aa] leading-relaxed line-clamp-3">
                  {choreo.bio}
                </p>
              </div>

              <div className="pt-4 border-t border-[#27272a] flex items-center justify-between">
                <div>
                  <span className="text-xs text-[#71717a] uppercase font-bold block">Packages From</span>
                  <span className="text-base font-black text-[#fafafa]">{choreo.startingRate}</span>
                </div>

                <button
                  onClick={() => onRequestQuoteWithChoreographer(choreo)}
                  className="px-4 py-2.5 rounded-xl bg-[#3b82f6] hover:bg-[#2563eb] text-white text-xs font-black uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(59,130,246,0.25)]"
                >
                  Request Quote
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

