import React, { useState } from 'react';
import {
  Search,
  SlidersHorizontal,
  MapPin,
  Heart,
  ArrowRight,
  Calendar,
  Layers,
} from 'lucide-react';
import { ALL_CLASSES, DANCE_STYLE_ICONS_DATA } from '../data/danceData';
import { DanceClass, ScreenType } from '../types';
import { OrganizerEventRecord } from '../types/organizer';
import { EventDetailModal } from './common/EventDetailModal';

interface SearchResultsScreenProps {
  initialQuery?: string;
  initialCategory?: string;
  platformEvents?: OrganizerEventRecord[];
  userLocation?: string;
  onNavigate: (screen: ScreenType) => void;
  onSelectClass: (danceClass: DanceClass) => void;
  onBookPass?: (eventId: string, tierIndex?: number) => void;
}

export const SearchResultsScreen: React.FC<SearchResultsScreenProps> = ({
  initialQuery = '',
  initialCategory = 'All',
  platformEvents = [],
  userLocation = '',
  onNavigate,
  onSelectClass,
  onBookPass,
}) => {
  const [query, setQuery] = useState(initialQuery);
  const [activeTab, setActiveTab] = useState<'all' | 'events' | 'classes'>('all');
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedLevel, setSelectedLevel] = useState<string>('All');
  const [priceMax, setPriceMax] = useState<number>(5000);
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);
  const [selectedEventModal, setSelectedEventModal] = useState<OrganizerEventRecord | null>(null);

  // Filter Published Platform Events
  const matchedEvents = platformEvents.filter((item) => {
    const q = query.toLowerCase().trim();
    const matchesQuery =
      q === '' ||
      item.title.toLowerCase().includes(q) ||
      item.type.toLowerCase().includes(q) ||
      (item.city && item.city.toLowerCase().includes(q)) ||
      (item.venue && item.venue.toLowerCase().includes(q)) ||
      (item.danceStyles && item.danceStyles.some((s) => s.toLowerCase().includes(q)));

    const matchesCategory =
      selectedCategory === 'All' ||
      item.type.toLowerCase().includes(selectedCategory.toLowerCase()) ||
      (item.danceStyles && item.danceStyles.some((s) => s.toLowerCase().includes(selectedCategory.toLowerCase())));

    const lowestPrice = item.ticketPricing && item.ticketPricing[0] ? item.ticketPricing[0].price : 499;
    const matchesPrice = lowestPrice <= priceMax;

    return matchesQuery && matchesCategory && matchesPrice;
  });

  // Filter Regular Studio Classes
  const matchedClasses = ALL_CLASSES.filter((item) => {
    const q = query.toLowerCase().trim();
    const matchesQuery =
      q === '' ||
      item.title.toLowerCase().includes(q) ||
      item.instructor.toLowerCase().includes(q) ||
      item.studio.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q) ||
      (item.location && item.location.toLowerCase().includes(q));

    const matchesCategory =
      selectedCategory === 'All' ||
      item.category.toLowerCase().includes(selectedCategory.toLowerCase());

    const matchesLevel =
      selectedLevel === 'All' ||
      item.level.toLowerCase().includes(selectedLevel.toLowerCase());

    const matchesPrice = item.price <= priceMax;

    return matchesQuery && matchesCategory && matchesLevel && matchesPrice;
  });

  const totalResultsCount = matchedEvents.length + matchedClasses.length;

  return (
    <div className="w-full max-w-[1600px] mx-auto px-3 sm:px-6 py-3 space-y-6 pb-20 text-[#fafafa] font-sans">
      
      {/* 1. SEARCH HEADER */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
        <div className="flex-1 relative flex items-center max-w-lg">
          <Search className="absolute left-3 w-4 h-4 text-zinc-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search workshops, battles, studios, locality..."
            className="w-full pl-9 pr-8 py-2 bg-zinc-900 border border-white/10 focus:border-purple-500 text-xs sm:text-sm text-white placeholder:text-zinc-500 rounded-xl outline-none transition-all shadow-inner"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-3 text-xs text-zinc-400 hover:text-white"
            >
              ✕
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowFilterDrawer(!showFilterDrawer)}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl border text-xs font-semibold transition-all ${
              showFilterDrawer
                ? 'bg-white text-black border-white'
                : 'bg-zinc-900 text-zinc-200 border-white/10 hover:border-white/30'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filters</span>
          </button>
          {userLocation && (
            <span className="text-xs font-mono text-[#10b981] hidden sm:inline bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
              📍 {userLocation}
            </span>
          )}
        </div>
      </div>

      {/* 2. HORIZONTALLY SCROLLABLE GENRE / CATEGORY PILLS */}
      <div className="space-y-2">
        <div className="text-xs font-medium text-zinc-400">Filter by Style:</div>
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          {['All', 'Contemporary', 'Bollywood', 'Hip-Hop', 'Kathak', 'Ballet', 'Salsa & Bachata', 'Afrobeat & Amapiano', 'Heels & Commercial'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-200 ${
                selectedCategory.toLowerCase() === cat.toLowerCase()
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                  : 'bg-zinc-900/80 text-zinc-400 hover:text-white hover:bg-zinc-800 border border-white/5'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* 3. TABS: ALL / EVENTS / CLASSES */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-3">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            activeTab === 'all'
              ? 'bg-white text-black shadow-md'
              : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
          }`}
        >
          All Results ({totalResultsCount})
        </button>

        <button
          onClick={() => setActiveTab('events')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            activeTab === 'events'
              ? 'bg-white text-black shadow-md'
              : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
          }`}
        >
          Published Gatherings ({matchedEvents.length})
        </button>

        <button
          onClick={() => setActiveTab('classes')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            activeTab === 'classes'
              ? 'bg-white text-black shadow-md'
              : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
          }`}
        >
          Studio Classes ({matchedClasses.length})
        </button>
      </div>

      {/* FILTER DRAWER */}
      {showFilterDrawer && (
        <div className="p-4 rounded-2xl bg-zinc-900 border border-white/10 space-y-3">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-300">SEARCH FILTERS</span>
            <button
              onClick={() => setShowFilterDrawer(false)}
              className="text-xs text-zinc-400 hover:text-white"
            >
              Close ✕
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-zinc-400 block mb-1">Max Price: ₹{priceMax}</label>
              <input
                type="range"
                min={200}
                max={10000}
                step={200}
                value={priceMax}
                onChange={(e) => setPriceMax(Number(e.target.value))}
                className="w-full accent-purple-500 h-1.5 bg-zinc-800 rounded-lg cursor-pointer"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-zinc-400 block mb-1">Experience Level</label>
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="w-full px-3 py-2 bg-zinc-950 border border-white/10 rounded-xl text-xs text-white outline-none"
              >
                {['All', 'Beginner', 'Intermediate', 'Advanced', 'Open Level'].map((lvl) => (
                  <option key={lvl} value={lvl}>
                    {lvl}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 1: PUBLISHED EVENTS */}
      {(activeTab === 'all' || activeTab === 'events') && matchedEvents.length > 0 && (
        <section className="space-y-3">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <h3 className="text-base font-bold text-white uppercase tracking-wider">
              Published Gatherings & Battles ({matchedEvents.length})
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {matchedEvents.map((ev) => (
              <div
                key={ev.id}
                onClick={() => setSelectedEventModal(ev)}
                className="group rounded-2xl bg-zinc-900 border border-white/10 hover:border-emerald-500/60 overflow-hidden transition-all duration-300 hover:shadow-xl cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-40 w-full overflow-hidden bg-zinc-950">
                    <img
                      src={ev.coverImage}
                      alt={ev.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    <span className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full bg-emerald-500 text-black text-xs font-mono uppercase font-bold shadow">
                      {ev.type.replace('_', ' ')}
                    </span>
                    <span className="absolute bottom-2 left-2.5 text-xs font-medium text-white/90 drop-shadow">
                      {ev.startDate}
                    </span>
                  </div>

                  <div className="p-4 space-y-1">
                    <h4 className="text-sm sm:text-base font-bold text-white group-hover:text-emerald-300 transition-colors line-clamp-1">
                      {ev.title}
                    </h4>
                    <p className="text-xs text-zinc-400 flex items-center gap-1 line-clamp-1">
                      <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{ev.venue || ev.city}</span>
                    </p>
                  </div>
                </div>

                <div className="p-4 pt-2 border-t border-white/10 flex items-center justify-between text-xs">
                  <span className="text-base font-extrabold text-white">
                    ₹{ev.ticketPricing?.[0]?.price ?? 499}
                  </span>
                  <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                    Pass Details <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* SECTION 2: STUDIO CLASSES */}
      {(activeTab === 'all' || activeTab === 'classes') && matchedClasses.length > 0 && (
        <section className="space-y-3">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <h3 className="text-base font-bold text-white uppercase tracking-wider">
              Studio Classes & Batches ({matchedClasses.length})
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {matchedClasses.map((cls) => (
              <div
                key={cls.id}
                onClick={() => onSelectClass(cls)}
                className="group rounded-2xl bg-zinc-900 border border-white/10 hover:border-purple-500/60 overflow-hidden transition-all duration-300 hover:shadow-xl cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-40 w-full overflow-hidden bg-zinc-950">
                    <img
                      src={cls.image}
                      alt={cls.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    <span className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full bg-purple-600 text-white text-xs font-mono uppercase font-bold shadow">
                      {cls.category}
                    </span>
                    <span className="absolute bottom-2 left-2.5 text-xs font-medium text-white/90 drop-shadow">
                      {cls.dayTime}
                    </span>
                  </div>

                  <div className="p-4 space-y-1">
                    <h4 className="text-sm sm:text-base font-bold text-white group-hover:text-purple-300 transition-colors line-clamp-1">
                      {cls.title}
                    </h4>
                    <p className="text-xs text-zinc-400 line-clamp-1">
                      Instructor: {cls.instructor}
                    </p>
                    <p className="text-xs text-zinc-500 line-clamp-1">
                      {cls.studio} • {cls.location}
                    </p>
                  </div>
                </div>

                <div className="p-4 pt-2 border-t border-white/10 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-xs text-zinc-400 block">Class Fee</span>
                    <span className="text-base font-bold text-white">₹{cls.price}</span>
                  </div>
                  <button className="px-3.5 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs transition-colors">
                    Book Class →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* EMPTY STATE */}
      {totalResultsCount === 0 && (
        <div className="text-center py-16 bg-zinc-900/50 rounded-3xl border border-white/10 space-y-3">
          <p className="text-base font-bold text-white">No results matched your search</p>
          <p className="text-xs text-zinc-400 max-w-sm mx-auto">
            Try adjusting your search keywords, clearing your filters, or picking a different dance style.
          </p>
          <button
            onClick={() => {
              setQuery('');
              setSelectedCategory('All');
              setSelectedLevel('All');
              setPriceMax(5000);
            }}
            className="px-4 py-2 rounded-xl bg-purple-600 text-white text-xs font-semibold"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Event Detail Modal */}
      <EventDetailModal
        event={selectedEventModal}
        isOpen={!!selectedEventModal}
        onClose={() => setSelectedEventModal(null)}
        onBookPass={onBookPass}
      />
    </div>
  );
};

