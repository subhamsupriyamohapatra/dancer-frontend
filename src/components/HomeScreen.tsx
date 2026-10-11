import React, { useState, useEffect } from 'react';
import {
  Search,
  MapPin,
  ChevronRight,
  ChevronLeft,
  Building2,
  Trophy,
  Zap,
  Percent,
  Activity,
  ArrowRight,
  Sparkles,
  Flame,
  Calendar,
  Layers,
  ShoppingBag,
  Tag,
} from 'lucide-react';
import {
  RUNNING_FEATURED_BANNERS,
  NEAREST_STUDIOS_DATA,
  WORKSHOPS_DATA,
  WEDDING_OFFERS_DATA,
  DANCE_STYLE_ICONS_DATA,
  COMPETITIONS_DATA,
  DANCE_FITNESS_CLASSES_DATA,
} from '../data/danceData';
import { INITIAL_BRANDS_DATA } from '../data/brandsData';
import { DanceClass, ScreenType } from '../types';
import { OrganizerEventRecord } from '../types/organizer';
import { EventDetailModal } from './common/EventDetailModal';
import { LocationSelectorModal } from './common/LocationSelectorModal';

interface HomeScreenProps {
  onNavigate: (screen: ScreenType) => void;
  onSelectClass: (danceClass: DanceClass) => void;
  onSearchSubmit: (query: string) => void;
  onSelectCategory: (category: string) => void;
  platformEvents?: OrganizerEventRecord[];
  userLocation?: string;
  onBookPass?: (eventId: string, tierIndex?: number) => void;
  onSelectLocation?: (location: string, isGPS?: boolean) => void;
  onClearLocation?: () => void;
}

type HomeViewTab = 'all' | 'gatherings' | 'studios' | 'fitness' | 'styles' | 'battles' | 'offers' | 'brands';

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onNavigate,
  onSelectClass,
  onSearchSubmit,
  onSelectCategory,
  platformEvents = [],
  userLocation = '',
  onBookPass,
  onSelectLocation,
  onClearLocation,
}) => {
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<HomeViewTab>('all');
  const [searchInput, setSearchInput] = useState('');
  const [selectedEventModal, setSelectedEventModal] = useState<OrganizerEventRecord | null>(null);
  const [showLocationModal, setShowLocationModal] = useState(false);

  // Dynamic Filtering based on entered location (no preset choices)
  const displayStudios = NEAREST_STUDIOS_DATA.filter((s) => {
    if (!userLocation) return true;
    const q = userLocation.toLowerCase().trim();
    return (
      s.city.toLowerCase().includes(q) ||
      s.neighborhood.toLowerCase().includes(q) ||
      s.location.toLowerCase().includes(q) ||
      (s.address && s.address.toLowerCase().includes(q))
    );
  });

  const displayWorkshops = WORKSHOPS_DATA.filter((w) => {
    if (!userLocation) return true;
    const q = userLocation.toLowerCase().trim();
    return (
      w.city.toLowerCase().includes(q) ||
      w.venue.toLowerCase().includes(q) ||
      w.location.toLowerCase().includes(q)
    );
  });

  // Auto-slide running hero banner
  useEffect(() => {
    if (RUNNING_FEATURED_BANNERS.length === 0) return;
    const timer = setInterval(() => {
      setCurrentBannerIndex((prev) => (prev + 1) % RUNNING_FEATURED_BANNERS.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      onSearchSubmit(searchInput.trim());
    }
  };

  const scrollContainer = (id: string, direction: 'left' | 'right') => {
    const container = document.getElementById(id);
    if (container) {
      const scrollOffset = direction === 'left' ? -380 : 380;
      container.scrollBy({ left: scrollOffset, behavior: 'smooth' });
    }
  };

  const activeBanner = RUNNING_FEATURED_BANNERS.length > 0 ? RUNNING_FEATURED_BANNERS[currentBannerIndex] : null;

  // Helper to map fitness class to dance class
  const handleFitnessSelect = (fit: (typeof DANCE_FITNESS_CLASSES_DATA)[0]) => {
    onSelectClass({
      id: fit.id,
      title: fit.title,
      category: fit.type,
      instructor: fit.instructor,
      instructorAvatar: fit.instructorAvatar,
      studio: fit.studio,
      location: fit.location,
      city: 'Mumbai',
      dayTime: fit.dayTime,
      date: 'Daily Batch',
      time: fit.dayTime.split('•')[1] || '07:30 AM',
      price: fit.price,
      currency: fit.currency,
      image: fit.image,
      level: `${fit.intensity} Intensity`,
      spotsLeft: fit.spotsLeft,
      description: `High-energy dance workout burning approx ${fit.caloriesBurned} kcal at ${fit.bpm} BPM.`,
    });
  };

  return (
    <div className="w-full max-w-[1600px] mx-auto px-3 sm:px-6 py-3 space-y-6 pb-20 text-[#fafafa] font-sans">
      
      {/* 1. TOP HEADER & CITY SELECTOR */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center shrink-0">
            <MapPin className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm sm:text-base font-bold text-white tracking-tight truncate">
                {userLocation ? userLocation : 'Dance Discovery Network'}
              </h1>
              {userLocation && (
                <span className="px-2 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 font-mono text-[10px] font-bold uppercase hidden sm:inline">
                  Active
                </span>
              )}
            </div>
            <p className="text-xs text-zinc-400 hidden sm:block">
              Discover verified academies, masterclasses, battles & certified choreographers
            </p>
          </div>
        </div>

        {/* Dynamic Location Prompt Trigger & Map View Button */}
        <div className="flex items-center gap-2 shrink-0">
          {userLocation ? (
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/10 border border-amber-500/30 rounded-2xl text-xs font-mono text-amber-300 shadow-sm">
              <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="font-semibold max-w-[130px] truncate">{userLocation}</span>
              <button
                type="button"
                onClick={() => {
                  if (onClearLocation) onClearLocation();
                }}
                className="ml-1 text-zinc-400 hover:text-white transition-colors"
                title="Clear location filter"
              >
                ✕
              </button>
              <button
                type="button"
                onClick={() => setShowLocationModal(true)}
                className="ml-1 text-amber-300 underline text-[11px] hover:text-amber-200"
              >
                Change
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setShowLocationModal(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-white/20 rounded-2xl text-xs font-mono text-zinc-300 hover:text-white transition-all shadow-sm"
              title="Enter your location to prompt nearby experiences"
            >
              <MapPin className="w-3.5 h-3.5 text-purple-400" />
              <span>Enter Location →</span>
            </button>
          )}

          <button
            onClick={() => onNavigate('map')}
            className="px-3.5 py-2 rounded-xl bg-purple-600/10 hover:bg-purple-600/20 border border-purple-500/30 text-xs font-bold text-purple-300 flex items-center gap-1.5 shrink-0 transition-all"
            title="Open Interactive Map"
          >
            <MapPin className="w-3.5 h-3.5 text-purple-400" />
            <span className="hidden sm:inline">Map</span>
          </button>
        </div>
      </div>

      {/* 2. PROMINENT HERO CAROUSEL */}
      {/* 2. PROMINENT FULL-WIDTH HERO CAROUSEL (DASHBOARD REMOVED FOR PURE DANCER DISCOVERY) */}
      <div className="w-full">
        {activeBanner ? (
          <div className="relative rounded-3xl overflow-hidden bg-zinc-950 border border-white/10 shadow-2xl flex flex-col justify-between p-5 sm:p-8 min-h-[220px] sm:min-h-[280px]">
            <img
              src={activeBanner.image}
              alt={activeBanner.title}
              className="absolute inset-0 w-full h-full object-cover brightness-[0.4] transition-all duration-700 hover:scale-105"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/60 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent" />

            {/* Top Tag & Controls */}
            <div className="relative z-10 flex items-center justify-between">
              <span className="px-3.5 py-1 rounded-full bg-purple-600/80 backdrop-blur-md text-xs font-mono tracking-wider uppercase text-white font-bold border border-purple-400/30">
                {activeBanner.tag}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-zinc-300 bg-black/70 px-3 py-1 rounded-lg border border-white/10">
                  {activeBanner.timeHighlight}
                </span>
                <button
                  onClick={() =>
                    setCurrentBannerIndex((prev) =>
                      prev === 0 ? RUNNING_FEATURED_BANNERS.length - 1 : prev - 1
                    )
                  }
                  className="w-8 h-8 rounded-full bg-black/70 hover:bg-black text-white flex items-center justify-center transition-colors border border-white/10 cursor-pointer"
                  aria-label="Previous banner"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() =>
                    setCurrentBannerIndex((prev) => (prev + 1) % RUNNING_FEATURED_BANNERS.length)
                  }
                  className="w-8 h-8 rounded-full bg-black/70 hover:bg-black text-white flex items-center justify-center transition-colors border border-white/10 cursor-pointer"
                  aria-label="Next banner"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Headline & Action CTA */}
            <div className="relative z-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4 mt-8">
              <div className="max-w-2xl">
                <h2 className="text-xl sm:text-3xl md:text-4xl font-extrabold text-white leading-tight drop-shadow">
                  {activeBanner.title}
                </h2>
                <p className="text-xs sm:text-sm text-zinc-300 mt-2 leading-relaxed drop-shadow max-w-xl">
                  {activeBanner.subtitle}
                </p>
              </div>
              <button
                onClick={() => {
                  if (activeBanner.actionType === 'wedding') onNavigate('wedding-landing');
                  else if (activeBanner.actionType === 'competition') onNavigate('search');
                  else if (WORKSHOPS_DATA.length > 0) onSelectClass(WORKSHOPS_DATA[0]);
                  else onNavigate('explore');
                }}
                className="px-6 py-3 rounded-xl bg-white hover:bg-zinc-200 text-black text-xs sm:text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 shrink-0 shadow-lg shadow-white/10 transition-transform hover:scale-105 cursor-pointer"
              >
                <span>{activeBanner.ctaText}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#120e2e] via-zinc-950 to-black border border-white/10 shadow-2xl flex flex-col justify-between p-6 sm:p-8 min-h-[220px] sm:min-h-[280px]">
            <div className="relative z-10 flex items-center justify-between">
              <span className="px-3.5 py-1 rounded-full bg-purple-600/30 text-purple-300 text-xs font-mono tracking-wider uppercase font-bold border border-purple-500/30">
                Verified Platform Ecosystem
              </span>
              <span className="text-xs font-mono text-purple-300 bg-purple-500/10 px-3 py-1 rounded-lg border border-purple-500/20 font-bold">
                Platform Network
              </span>
            </div>

            <div className="relative z-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4 mt-8">
              <div className="max-w-2xl">
                <h2 className="text-xl sm:text-3xl md:text-4xl font-extrabold text-white leading-tight drop-shadow">
                  The Complete Dance Platform
                </h2>
                <p className="text-xs sm:text-sm text-zinc-300 mt-2 leading-relaxed drop-shadow">
                  Connecting verified dance academies, certified choreographers, and battle organizers with verified authentication.
                </p>
              </div>
              <button
                onClick={() => onNavigate('explore')}
                className="px-6 py-3 rounded-xl bg-white hover:bg-zinc-200 text-black text-xs sm:text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 shrink-0 shadow-lg transition-transform hover:scale-105 cursor-pointer"
              >
                <span>Explore Disciplines</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 3. HORIZONTALLY SCROLLABLE NAVIGATION FILTER PILLS */}
      <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-3">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          {[
            { id: 'all', label: '⚡ All Modules' },
            { id: 'styles', label: `💃 Dance Styles (${DANCE_STYLE_ICONS_DATA.length})` },
            { id: 'gatherings', label: `🎫 Gatherings (${platformEvents.length})` },
            { id: 'studios', label: `🏢 Academies (${NEAREST_STUDIOS_DATA.length})` },
            { id: 'fitness', label: `🔥 Fitness (${DANCE_FITNESS_CLASSES_DATA.length})` },
            { id: 'battles', label: `🏆 Battles (${COMPETITIONS_DATA.length})` },
            { id: 'offers', label: '💍 Wedding Offers' },
            { id: 'brands', label: '🛍️ Dance Brands' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as HomeViewTab)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                  : 'bg-zinc-900/80 text-zinc-400 hover:text-white hover:bg-zinc-800 border border-white/5'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <button
          onClick={() => onNavigate('events')}
          className="text-xs font-mono text-purple-400 hover:text-purple-300 flex items-center gap-1 shrink-0 hidden md:flex font-semibold"
        >
          <span>All Events</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 4. MAIN BROWSING CONTENT */}
      {activeTab === 'all' && (
        <div className="space-y-10">

          {/* ============================================================== */}
          {/* GROUP 1: DANCE STYLES & DISCIPLINES (HORIZONTALLY SCROLLABLE) */}
          {/* ============================================================== */}
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                  <Layers className="w-4 h-4" />
                </span>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white tracking-wide">
                    Dance Styles & Genres
                  </h3>
                  <p className="text-xs text-zinc-400">
                    Scroll horizontally to browse 8 disciplines and over 130 active classes
                  </p>
                </div>
              </div>

              {/* Scroll controls */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => scrollContainer('styles-scroll-row', 'left')}
                  className="w-8 h-8 rounded-full bg-zinc-900 hover:bg-zinc-800 border border-white/10 flex items-center justify-center text-zinc-300 hover:text-white transition-all shadow-sm"
                  aria-label="Scroll styles left"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => scrollContainer('styles-scroll-row', 'right')}
                  className="w-8 h-8 rounded-full bg-zinc-900 hover:bg-zinc-800 border border-white/10 flex items-center justify-center text-zinc-300 hover:text-white transition-all shadow-sm"
                  aria-label="Scroll styles right"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onNavigate('explore')}
                  className="text-xs font-semibold text-purple-400 hover:text-purple-300 ml-2 hidden sm:inline"
                >
                  View All Styles →
                </button>
              </div>
            </div>

            {/* Horizontal Track of Large, Legible Category Cards */}
            <div
              id="styles-scroll-row"
              className="flex items-center gap-4 overflow-x-auto no-scrollbar scroll-smooth snap-x snap-mandatory py-2 px-0.5"
            >
              {DANCE_STYLE_ICONS_DATA.map((style) => (
                <button
                  key={style.id}
                  onClick={() => {
                    onSelectCategory(style.name);
                    onNavigate('search');
                  }}
                  className="group relative flex-shrink-0 snap-start w-48 sm:w-56 h-36 sm:h-40 rounded-2xl overflow-hidden border border-white/10 hover:border-purple-500/70 p-4 flex flex-col justify-between text-left transition-all duration-300 hover:shadow-xl hover:shadow-purple-600/20 hover:-translate-y-1"
                >
                  <img
                    src={style.image}
                    alt={style.name}
                    className="absolute inset-0 w-full h-full object-cover brightness-[0.4] group-hover:brightness-[0.55] group-hover:scale-110 transition-all duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent" />

                  {/* Top Badge: Class Count */}
                  <div className="relative z-10">
                    <span className="inline-block px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-xs font-semibold text-purple-300 border border-purple-400/30 shadow-sm">
                      {style.count}
                    </span>
                  </div>

                  {/* Bottom: Genre Name & Action Hint */}
                  <div className="relative z-10">
                    <h4 className="text-base sm:text-lg font-extrabold text-white group-hover:text-purple-200 transition-colors drop-shadow">
                      {style.name}
                    </h4>
                    <span className="text-xs text-zinc-400 flex items-center gap-1 group-hover:text-white transition-colors mt-0.5 font-medium">
                      Browse classes <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </section>

          {/* ============================================================== */}
          {/* GROUP 2: UPCOMING MASTERCLASSES & WORKSHOPS (HORIZONTALLY SCROLLABLE) */}
          {/* ============================================================== */}
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                  <Zap className="w-4 h-4" />
                </span>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white tracking-wide">
                    Upcoming Masterclasses & Workshops
                  </h3>
                  <p className="text-xs text-zinc-400">
                    Technique intensives and guest choreographies across verified studios & stages
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => scrollContainer('gatherings-scroll-row', 'left')}
                  className="w-8 h-8 rounded-full bg-zinc-900 hover:bg-zinc-800 border border-white/10 flex items-center justify-center text-zinc-300 hover:text-white transition-all shadow-sm"
                  aria-label="Scroll masterclasses left"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => scrollContainer('gatherings-scroll-row', 'right')}
                  className="w-8 h-8 rounded-full bg-zinc-900 hover:bg-zinc-800 border border-white/10 flex items-center justify-center text-zinc-300 hover:text-white transition-all shadow-sm"
                  aria-label="Scroll masterclasses right"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onNavigate('events')}
                  className="text-xs font-semibold text-purple-400 hover:text-purple-300 ml-2 hidden sm:inline"
                >
                  All ({displayWorkshops.length}) →
                </button>
              </div>
            </div>

            <div
              id="gatherings-scroll-row"
              className="flex items-stretch gap-4 overflow-x-auto no-scrollbar scroll-smooth snap-x snap-mandatory py-2 px-0.5"
            >
              {displayWorkshops.length === 0 ? (
                <div className="w-full py-8 px-6 rounded-2xl bg-zinc-900/60 border border-dashed border-white/10 text-center flex flex-col items-center justify-center space-y-2">
                  <p className="text-sm font-semibold text-zinc-300">No masterclasses found for this filter</p>
                  <p className="text-xs text-zinc-500 max-w-md">
                    Switch filters to see all available workshops and masterclasses.
                  </p>
                </div>
              ) : (
                displayWorkshops.map((ws) => (
                  <div
                    key={ws.id}
                    onClick={() => onSelectClass(ws)}
                    className="group flex-shrink-0 snap-start w-72 sm:w-80 rounded-2xl bg-zinc-900/90 border border-white/10 hover:border-purple-500/50 overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/10 cursor-pointer flex flex-col justify-between"
                  >
                    <div>
                      <div className="relative h-40 w-full overflow-hidden bg-zinc-950">
                        <img
                          src={ws.image}
                          alt={ws.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                        <span className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full bg-purple-600 text-white text-xs font-mono uppercase font-extrabold shadow">
                          {ws.category}
                        </span>
                        <span className="absolute bottom-2 left-2.5 text-xs font-medium text-white/90 drop-shadow flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-purple-400" />
                          {ws.date} • {ws.time}
                        </span>
                      </div>

                      <div className="p-4 space-y-1.5">
                        <h4 className="text-sm sm:text-base font-bold text-white group-hover:text-purple-300 transition-colors line-clamp-1">
                          {ws.title}
                        </h4>
                        <p className="text-xs text-zinc-400 line-clamp-1">
                          By {ws.instructor} • {ws.studio}
                        </p>
                        <p className="text-xs text-zinc-500 line-clamp-1">
                          📍 {ws.location}, {ws.city}
                        </p>
                      </div>
                    </div>

                    <div className="p-4 pt-2 border-t border-white/10 flex items-center justify-between text-xs">
                      <div>
                        <span className="text-xs text-zinc-400 block">Pass From</span>
                        <span className="text-base font-extrabold text-white">₹{ws.price}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-semibold text-purple-400 block">
                          {ws.spotsLeft} spots remaining
                        </span>
                        <span className="text-xs text-zinc-400 group-hover:underline">Reserve Pass →</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>

          {/* ============================================================== */}
          {/* GROUP 3: NEAREST DANCE STUDIOS & ACADEMIES (HORIZONTALLY SCROLLABLE) */}
          {/* ============================================================== */}
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20">
                  <Building2 className="w-4 h-4" />
                </span>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white tracking-wide">
                    Top Studios & Academies
                  </h3>
                  <p className="text-xs text-zinc-400">
                    State-of-the-art facilities with sprung wooden floors and acoustic sound
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => scrollContainer('studios-scroll-row', 'left')}
                  className="w-8 h-8 rounded-full bg-zinc-900 hover:bg-zinc-800 border border-white/10 flex items-center justify-center text-zinc-300 hover:text-white transition-all shadow-sm"
                  aria-label="Scroll studios left"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => scrollContainer('studios-scroll-row', 'right')}
                  className="w-8 h-8 rounded-full bg-zinc-900 hover:bg-zinc-800 border border-white/10 flex items-center justify-center text-zinc-300 hover:text-white transition-all shadow-sm"
                  aria-label="Scroll studios right"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onNavigate('map')}
                  className="text-xs font-semibold text-sky-400 hover:text-sky-300 ml-2 hidden sm:inline"
                >
                  View on Map →
                </button>
              </div>
            </div>

            <div
              id="studios-scroll-row"
              className="flex items-stretch gap-4 overflow-x-auto no-scrollbar scroll-smooth snap-x snap-mandatory py-2 px-0.5"
            >
              {displayStudios.length === 0 ? (
                <div className="w-full py-8 px-6 rounded-2xl bg-zinc-900/60 border border-dashed border-white/10 text-center flex flex-col items-center justify-center space-y-2">
                  <p className="text-sm font-semibold text-zinc-300">No studios found for this filter</p>
                  <p className="text-xs text-zinc-500 max-w-md">
                    Switch filters to explore all partner dance studios.
                  </p>
                </div>
              ) : (
                displayStudios.map((std) => (
                  <div
                    key={std.id}
                    onClick={() => onNavigate('studio-profile')}
                    className="group flex-shrink-0 snap-start w-72 sm:w-80 rounded-2xl bg-zinc-900/90 border border-white/10 hover:border-sky-500/50 overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-sky-500/10 cursor-pointer flex flex-col justify-between"
                  >
                    <div>
                      <div className="relative h-40 w-full overflow-hidden bg-zinc-950">
                        <img
                          src={std.heroImage}
                          alt={std.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                        <span className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md text-xs text-amber-400 font-bold border border-amber-400/30">
                          ★ {std.rating} ({std.reviewCount})
                        </span>
                        <span className="absolute bottom-2 left-2.5 text-xs font-medium text-white/90 drop-shadow flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-sky-400" />
                          {std.distance} • {std.neighborhood}
                        </span>
                      </div>

                      <div className="p-4 space-y-2">
                        <h4 className="text-sm sm:text-base font-bold text-white group-hover:text-sky-300 transition-colors line-clamp-1">
                          {std.name}
                        </h4>
                        <div className="flex flex-wrap gap-1.5">
                          {(std.styles || []).slice(0, 3).map((sty, i) => (
                            <span
                              key={i}
                              className="px-2 py-0.5 rounded-md bg-white/5 text-xs text-zinc-300 font-medium"
                            >
                              {sty}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="p-4 pt-2 border-t border-white/10 flex items-center justify-between text-xs">
                      <div>
                        <span className="text-xs text-zinc-400 block">Class Pricing</span>
                        <span className="text-xs font-bold text-white">{std.priceRange}</span>
                      </div>
                      <span className="text-xs font-semibold text-sky-400 group-hover:underline">
                        View Batches →
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>

          {/* ============================================================== */}
          {/* GROUP 4: DANCE FITNESS & HIGH-ENERGY WORKOUTS (HORIZONTALLY SCROLLABLE) */}
          {/* ============================================================== */}
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
                  <Activity className="w-4 h-4" />
                </span>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white tracking-wide">
                    Dance Fitness & Calorie Burners
                  </h3>
                  <p className="text-xs text-zinc-400">
                    High-tempo cardio sessions burning up to 600 kcal with energizing beats
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => scrollContainer('fitness-scroll-row', 'left')}
                  className="w-8 h-8 rounded-full bg-zinc-900 hover:bg-zinc-800 border border-white/10 flex items-center justify-center text-zinc-300 hover:text-white transition-all shadow-sm"
                  aria-label="Scroll fitness left"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => scrollContainer('fitness-scroll-row', 'right')}
                  className="w-8 h-8 rounded-full bg-zinc-900 hover:bg-zinc-800 border border-white/10 flex items-center justify-center text-zinc-300 hover:text-white transition-all shadow-sm"
                  aria-label="Scroll fitness right"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div
              id="fitness-scroll-row"
              className="flex items-stretch gap-4 overflow-x-auto no-scrollbar scroll-smooth snap-x snap-mandatory py-2 px-0.5"
            >
              {DANCE_FITNESS_CLASSES_DATA.length === 0 ? (
                <div className="w-full py-8 px-6 rounded-2xl bg-zinc-900/60 border border-dashed border-white/10 text-center flex flex-col items-center justify-center space-y-2">
                  <p className="text-sm font-semibold text-zinc-300">No fitness batches scheduled yet</p>
                  <p className="text-xs text-zinc-500 max-w-md">
                    Instructors and studios can publish high-energy dance cardio, Zumba, and HIIT dance classes with BPM tracking.
                  </p>
                </div>
              ) : (
                DANCE_FITNESS_CLASSES_DATA.map((fit) => (
                  <div
                    key={fit.id}
                    onClick={() => handleFitnessSelect(fit)}
                    className="group flex-shrink-0 snap-start w-64 sm:w-72 rounded-2xl bg-zinc-900/90 border border-white/10 hover:border-rose-500/50 overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-rose-500/10 cursor-pointer flex flex-col justify-between"
                  >
                    <div>
                      <div className="relative h-36 w-full overflow-hidden bg-zinc-950">
                        <img
                          src={fit.image}
                          alt={fit.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                        <span className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full bg-rose-600 text-white text-xs font-mono uppercase font-bold shadow">
                          {fit.type}
                        </span>
                        <span className="absolute bottom-2 right-2.5 text-xs font-bold text-amber-400 bg-black/70 px-2 py-0.5 rounded-lg border border-amber-400/30">
                          🔥 {fit.caloriesBurned} kcal
                        </span>
                      </div>

                      <div className="p-4 space-y-1">
                        <h4 className="text-sm sm:text-base font-bold text-white group-hover:text-rose-300 transition-colors line-clamp-1">
                          {fit.title}
                        </h4>
                        <p className="text-xs text-zinc-400 line-clamp-1">
                          Instructor: {fit.instructor} • {fit.bpm} BPM
                        </p>
                        <p className="text-xs text-zinc-500 line-clamp-1">
                          {fit.studio}
                        </p>
                      </div>
                    </div>

                    <div className="p-4 pt-2 border-t border-white/10 flex items-center justify-between text-xs">
                      <div>
                        <span className="text-xs text-zinc-400 block">Per Session</span>
                        <span className="text-base font-bold text-white">₹{fit.price}</span>
                      </div>
                      <button className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs transition-colors">
                        Book Slot
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>

          {/* ============================================================== */}
          {/* GROUP 5: COMPETITIONS & BATTLES (HORIZONTALLY SCROLLABLE) */}
          {/* ============================================================== */}
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  <Trophy className="w-4 h-4" />
                </span>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white tracking-wide">
                    Tournaments & Battle Cyphers
                  </h3>
                  <p className="text-xs text-zinc-400">
                    All-style battles, breaking cyphers, and crew championships in Odisha
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => scrollContainer('battles-scroll-row', 'left')}
                  className="w-8 h-8 rounded-full bg-zinc-900 hover:bg-zinc-800 border border-white/10 flex items-center justify-center text-zinc-300 hover:text-white transition-all shadow-sm"
                  aria-label="Scroll battles left"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => scrollContainer('battles-scroll-row', 'right')}
                  className="w-8 h-8 rounded-full bg-zinc-900 hover:bg-zinc-800 border border-white/10 flex items-center justify-center text-zinc-300 hover:text-white transition-all shadow-sm"
                  aria-label="Scroll battles right"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div
              id="battles-scroll-row"
              className="flex items-stretch gap-4 overflow-x-auto no-scrollbar scroll-smooth snap-x snap-mandatory py-2 px-0.5"
            >
              {COMPETITIONS_DATA.length === 0 ? (
                <div className="w-full py-8 px-6 rounded-2xl bg-zinc-900/60 border border-dashed border-white/10 text-center flex flex-col items-center justify-center space-y-2">
                  <p className="text-sm font-semibold text-zinc-300">No active battles or cyphers yet</p>
                  <p className="text-xs text-zinc-500 max-w-md">
                    Tournament directors and street dance crews can launch cyphers, battle brackets, and judge scoring suites.
                  </p>
                  <button
                    onClick={() => onNavigate('organizer-dashboard')}
                    className="mt-1 px-4 py-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 hover:bg-amber-500/30 text-xs font-bold transition-all"
                  >
                    + Launch Cypher Battle
                  </button>
                </div>
              ) : (
                COMPETITIONS_DATA.map((comp) => (
                  <div
                    key={comp.id}
                    onClick={() => onNavigate('challenges')}
                    className="group flex-shrink-0 snap-start w-72 sm:w-80 rounded-2xl bg-zinc-900/90 border border-white/10 hover:border-amber-500/50 overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-amber-500/10 cursor-pointer flex flex-col justify-between"
                  >
                    <div>
                      <div className="relative h-40 w-full overflow-hidden bg-zinc-950">
                        <img
                          src={comp.image}
                          alt={comp.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                        <span className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full bg-amber-500 text-black text-xs font-mono uppercase font-extrabold shadow">
                          {comp.badge || comp.format}
                        </span>
                        <span className="absolute bottom-2 left-2.5 text-xs font-bold text-emerald-400 bg-black/70 px-2 py-0.5 rounded-lg border border-emerald-400/30">
                          Prize: {comp.prizePool}
                        </span>
                      </div>

                      <div className="p-4 space-y-1">
                        <h4 className="text-sm sm:text-base font-bold text-white group-hover:text-amber-300 transition-colors line-clamp-1">
                          {comp.title}
                        </h4>
                        <p className="text-xs text-zinc-400 line-clamp-1">
                          {comp.venue} • {comp.city}
                        </p>
                        <p className="text-xs text-zinc-500 font-mono">
                          {comp.date}
                        </p>
                      </div>
                    </div>

                    <div className="p-4 pt-2 border-t border-white/10 flex items-center justify-between text-xs">
                      <div>
                        <span className="text-xs text-zinc-400 block">Entry Fee</span>
                        <span className="text-base font-bold text-white">₹{comp.entryFee}</span>
                      </div>
                      <span className="text-xs font-semibold text-amber-400 group-hover:underline">
                        Enter Battle →
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>

          {/* ============================================================== */}
          {/* GROUP 6: WEDDING SPECIALS & PACKAGES (HORIZONTALLY SCROLLABLE) */}
          {/* ============================================================== */}
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-xl bg-pink-500/10 text-pink-400 border border-pink-500/20">
                  <Percent className="w-4 h-4" />
                </span>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white tracking-wide">
                    Wedding & Sangeet Choreography
                  </h3>
                  <p className="text-xs text-zinc-400">
                    Couple first dances, bridal solos, and family sangeet medleys by verified choreographers
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => scrollContainer('wedding-scroll-row', 'left')}
                  className="w-8 h-8 rounded-full bg-zinc-900 hover:bg-zinc-800 border border-white/10 flex items-center justify-center text-zinc-300 hover:text-white transition-all shadow-sm"
                  aria-label="Scroll wedding offers left"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => scrollContainer('wedding-scroll-row', 'right')}
                  className="w-8 h-8 rounded-full bg-zinc-900 hover:bg-zinc-800 border border-white/10 flex items-center justify-center text-zinc-300 hover:text-white transition-all shadow-sm"
                  aria-label="Scroll wedding offers right"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onNavigate('wedding-landing')}
                  className="text-xs font-semibold text-pink-400 hover:text-pink-300 ml-2 hidden sm:inline"
                >
                  View Packages →
                </button>
              </div>
            </div>

            <div
              id="wedding-scroll-row"
              className="flex items-stretch gap-4 overflow-x-auto no-scrollbar scroll-smooth snap-x snap-mandatory py-2 px-0.5"
            >
              {WEDDING_OFFERS_DATA.length === 0 ? (
                <div className="w-full py-8 px-6 rounded-2xl bg-zinc-900/60 border border-dashed border-white/10 text-center flex flex-col items-center justify-center space-y-2">
                  <p className="text-sm font-semibold text-zinc-300">Custom Sangeet & Couple Choreography</p>
                  <p className="text-xs text-zinc-500 max-w-md">
                    Connect with celebrity and regional choreographers for bespoke bridal entries, groom squads, and family flashmobs.
                  </p>
                  <button
                    onClick={() => onNavigate('wedding-landing')}
                    className="mt-1 px-4 py-2 rounded-xl bg-pink-500/20 text-pink-400 border border-pink-500/30 hover:bg-pink-500/30 text-xs font-bold transition-all"
                  >
                    Request Wedding Quote
                  </button>
                </div>
              ) : (
                WEDDING_OFFERS_DATA.map((offer) => (
                  <div
                    key={offer.id}
                    onClick={() => onNavigate('wedding-landing')}
                    className="group flex-shrink-0 snap-start w-80 sm:w-96 rounded-2xl bg-gradient-to-br from-zinc-900 via-zinc-900 to-pink-950/30 border border-white/10 hover:border-pink-500/60 p-4 transition-all duration-300 hover:shadow-xl hover:shadow-pink-500/10 cursor-pointer flex gap-4 items-center"
                  >
                    <img
                      src={offer.image}
                      alt={offer.title}
                      className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl object-cover shrink-0 border border-white/10 group-hover:scale-105 transition-transform"
                      referrerPolicy="no-referrer"
                    />
                    <div className="flex-1 min-w-0 space-y-1">
                      <span className="px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-400 text-xs font-bold uppercase inline-block border border-pink-500/30">
                        {offer.badge}
                      </span>
                      <h4 className="text-sm sm:text-base font-bold text-white group-hover:text-pink-300 transition-colors line-clamp-1">
                        {offer.title}
                      </h4>
                      <p className="text-xs text-zinc-400 line-clamp-1">
                        {offer.subtitle}
                      </p>
                      <div className="flex items-baseline gap-2 pt-1">
                        <span className="text-base font-extrabold text-amber-300 font-mono">
                          {offer.currency}{offer.offerPrice}
                        </span>
                        <span className="text-xs text-zinc-500 line-through">
                          {offer.currency}{offer.originalPrice}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>

          {/* ============================================================== */}
          {/* GROUP 7: DANCE-FRIENDLY BRANDS MARKETPLACE (HORIZONTALLY SCROLLABLE) */}
          {/* ============================================================== */}
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-xl bg-amber-500/10 text-amber-300 border border-amber-500/20">
                  <ShoppingBag className="w-4 h-4" />
                </span>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white tracking-wide">
                    Dance-Friendly Brands Marketplace
                  </h3>
                  <p className="text-xs text-zinc-400">
                    Vetted shoes, performance apparel, stage makeup, and recovery tools
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => scrollContainer('brands-scroll-row', 'left')}
                  className="w-8 h-8 rounded-full bg-zinc-900 hover:bg-zinc-800 border border-white/10 flex items-center justify-center text-zinc-300 hover:text-white transition-all shadow-sm cursor-pointer"
                  aria-label="Scroll brands left"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => scrollContainer('brands-scroll-row', 'right')}
                  className="w-8 h-8 rounded-full bg-zinc-900 hover:bg-zinc-800 border border-white/10 flex items-center justify-center text-zinc-300 hover:text-white transition-all shadow-sm cursor-pointer"
                  aria-label="Scroll brands right"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onNavigate('brands-marketplace')}
                  className="text-xs font-semibold text-amber-300 hover:text-amber-200 ml-2 hidden sm:inline cursor-pointer"
                >
                  View Marketplace →
                </button>
              </div>
            </div>

            <div
              id="brands-scroll-row"
              className="flex items-stretch gap-4 overflow-x-auto no-scrollbar scroll-smooth snap-x snap-mandatory py-2 px-0.5"
            >
              {INITIAL_BRANDS_DATA.filter((b) => b.approvalStatus === 'APPROVED').map((brand) => (
                <div
                  key={brand.id}
                  onClick={() => onNavigate('brands-marketplace')}
                  className="group flex-shrink-0 snap-start w-72 sm:w-80 rounded-2xl bg-zinc-900/90 border border-white/10 hover:border-amber-500/50 overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-amber-500/10 cursor-pointer flex flex-col justify-between"
                >
                  <div>
                    <div className="relative h-36 w-full overflow-hidden bg-zinc-950">
                      <img
                        src={brand.heroImageUrl}
                        alt={brand.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 brightness-75"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                      <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-lg bg-black/80 backdrop-blur-md text-[10px] font-mono uppercase tracking-wider text-amber-300 border border-amber-500/30">
                        {brand.category.replace('_', ' ')}
                      </span>
                      {brand.discountPercent && (
                        <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-lg bg-amber-400 text-black text-xs font-mono font-extrabold">
                          {brand.discountPercent}% OFF
                        </span>
                      )}
                      <span className="absolute bottom-2 left-2.5 text-xs font-semibold text-white truncate max-w-[85%] drop-shadow">
                        {brand.tagline}
                      </span>
                    </div>

                    <div className="p-4 space-y-2">
                      <div className="flex items-center gap-2">
                        <img
                          src={brand.logoUrl}
                          alt={brand.name}
                          className="w-6 h-6 rounded-lg object-cover bg-black border border-white/10 shrink-0"
                        />
                        <h4 className="text-sm sm:text-base font-bold text-white group-hover:text-amber-200 transition-colors line-clamp-1">
                          {brand.name}
                        </h4>
                      </div>
                      <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                        {brand.description}
                      </p>
                    </div>
                  </div>

                  <div className="p-4 pt-2 border-t border-white/10 flex items-center justify-between text-xs">
                    <span className="text-[11px] font-mono text-zinc-400">
                      {brand.discountCode ? `Code: ${brand.discountCode}` : 'Verified Partner'}
                    </span>
                    <span className="text-xs font-bold text-amber-300 group-hover:underline flex items-center gap-1">
                      Browse Gear →
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>

        </div>
      )}

      {/* 5. INDIVIDUAL TAB VIEWS (READABLE, SPACIOUS GRID / HORIZONTAL FLOWS) */}
      {activeTab === 'styles' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <div>
              <h3 className="text-lg font-bold text-white">All Dance Disciplines & Genres</h3>
              <p className="text-xs text-zinc-400">Choose a style to filter masterclasses, certified academies, and teachers</p>
            </div>
            <span className="text-xs font-mono text-purple-400 font-bold">{DANCE_STYLE_ICONS_DATA.length} Genres</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {DANCE_STYLE_ICONS_DATA.map((style) => (
              <button
                key={style.id}
                onClick={() => {
                  onSelectCategory(style.name);
                  onNavigate('search');
                }}
                className="group relative h-44 rounded-2xl overflow-hidden border border-white/10 hover:border-purple-500/70 p-4 flex flex-col justify-between text-left transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/20 hover:-translate-y-1"
              >
                <img
                  src={style.image}
                  alt={style.name}
                  className="absolute inset-0 w-full h-full object-cover brightness-[0.4] group-hover:brightness-[0.55] group-hover:scale-110 transition-all duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent" />

                <div className="relative z-10">
                  <span className="inline-block px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-xs font-semibold text-purple-300 border border-purple-400/30">
                    {style.count}
                  </span>
                </div>

                <div className="relative z-10">
                  <h4 className="text-base sm:text-lg font-extrabold text-white group-hover:text-purple-200 transition-colors drop-shadow">
                    {style.name}
                  </h4>
                  <span className="text-xs text-zinc-400 flex items-center gap-1 group-hover:text-white transition-colors mt-0.5 font-medium">
                    Explore batches →
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'gatherings' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <div>
              <h3 className="text-lg font-bold text-white">All Platform Gatherings</h3>
              <p className="text-xs text-zinc-400">Battles, masterclasses, and intensive bootcamps</p>
            </div>
            <span className="text-xs font-mono text-emerald-400 font-bold">{platformEvents.length} Events</span>
          </div>

          {platformEvents.length === 0 ? (
            <div className="py-14 px-4 rounded-3xl bg-zinc-900/40 border border-dashed border-white/10 text-center max-w-md mx-auto space-y-3">
              <Calendar className="w-8 h-8 text-zinc-500 mx-auto" />
              <h4 className="text-base font-bold text-white">No platform events published</h4>
              <p className="text-xs text-zinc-400">Workshops, intensives, and battles published by organizers will appear here.</p>
              <button onClick={() => onNavigate('organizer-dashboard')} className="px-4 py-2 rounded-xl bg-white text-black font-bold text-xs">+ Host an Event</button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {platformEvents.map((ev) => (
                <div
                  key={ev.id}
                  onClick={() => setSelectedEventModal(ev)}
                  className="group rounded-2xl bg-zinc-900 border border-white/10 hover:border-emerald-500/60 overflow-hidden transition-all duration-300 hover:shadow-xl cursor-pointer flex flex-col justify-between"
                >
                  <div>
                    <div className="relative h-44 w-full overflow-hidden bg-zinc-950">
                      <img
                        src={ev.coverImage}
                        alt={ev.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                      <span className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full bg-emerald-500 text-black text-xs font-mono uppercase font-extrabold shadow">
                        {ev.type.replace('_', ' ')}
                      </span>
                      <span className="absolute bottom-2 left-2.5 text-xs font-medium text-white/90 drop-shadow">
                        {ev.startDate}
                      </span>
                    </div>

                    <div className="p-4 space-y-1">
                      <h4 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors line-clamp-1">
                        {ev.title}
                      </h4>
                      <p className="text-xs text-zinc-400 line-clamp-1">
                        {ev.venue || ev.city}
                      </p>
                    </div>
                  </div>

                  <div className="p-4 pt-2 border-t border-white/10 flex items-center justify-between text-xs">
                    <span className="text-base font-extrabold text-white">
                      ₹{ev.ticketPricing?.[0]?.price ?? 499}
                    </span>
                    <span className="text-xs font-semibold text-emerald-400">
                      {ev.registeredCount || 0}/{ev.capacity || 100} Registered
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'studios' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <div>
              <h3 className="text-lg font-bold text-white">Verified Dance Studios</h3>
              <p className="text-xs text-zinc-400">Certified studios with professional flooring, sound and AC</p>
            </div>
            <span className="text-xs font-mono text-sky-400 font-bold">{NEAREST_STUDIOS_DATA.length} Studios</span>
          </div>

          {NEAREST_STUDIOS_DATA.length === 0 ? (
            <div className="py-14 px-4 rounded-3xl bg-zinc-900/40 border border-dashed border-white/10 text-center max-w-md mx-auto space-y-3">
              <Building2 className="w-8 h-8 text-zinc-500 mx-auto" />
              <h4 className="text-base font-bold text-white">No dance studios registered yet</h4>
              <p className="text-xs text-zinc-400">Studio owners can complete verified onboarding to list halls and equipment.</p>
              <button onClick={() => onNavigate('studio-dashboard')} className="px-4 py-2 rounded-xl bg-white text-black font-bold text-xs">+ Register Studio</button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {NEAREST_STUDIOS_DATA.map((std) => (
                <div
                  key={std.id}
                  onClick={() => onNavigate('studio-profile')}
                  className="group rounded-2xl bg-zinc-900 border border-white/10 hover:border-sky-500/60 overflow-hidden transition-all duration-300 hover:shadow-xl cursor-pointer flex flex-col justify-between"
                >
                  <div>
                    <div className="relative h-44 w-full overflow-hidden bg-zinc-950">
                      <img
                        src={std.heroImage}
                        alt={std.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                      <span className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md text-xs text-amber-400 font-bold border border-amber-400/30">
                        ★ {std.rating}
                      </span>
                      <span className="absolute bottom-2 left-2.5 text-xs font-medium text-white/90 drop-shadow">
                        {std.distance} • {std.neighborhood}
                      </span>
                    </div>

                    <div className="p-4 space-y-2">
                      <h4 className="text-base font-bold text-white group-hover:text-sky-300 transition-colors line-clamp-1">
                        {std.name}
                      </h4>
                      <p className="text-xs text-zinc-400 line-clamp-2">
                        {std.about}
                      </p>
                    </div>
                  </div>

                  <div className="p-4 pt-2 border-t border-white/10 flex items-center justify-between text-xs">
                    <span className="text-xs font-bold text-white">{std.priceRange}</span>
                    <span className="text-xs font-semibold text-sky-400">View Batches →</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'fitness' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <div>
              <h3 className="text-lg font-bold text-white">Dance Fitness & High-Energy Cardio</h3>
              <p className="text-xs text-zinc-400">Burn calories with high-tempo choreographies</p>
            </div>
            <span className="text-xs font-mono text-rose-400 font-bold">{DANCE_FITNESS_CLASSES_DATA.length} Workouts</span>
          </div>

          {DANCE_FITNESS_CLASSES_DATA.length === 0 ? (
            <div className="py-14 px-4 rounded-3xl bg-zinc-900/40 border border-dashed border-white/10 text-center max-w-md mx-auto space-y-3">
              <Activity className="w-8 h-8 text-zinc-500 mx-auto" />
              <h4 className="text-base font-bold text-white">No fitness workouts scheduled</h4>
              <p className="text-xs text-zinc-400">High-calorie burn batches (Bollywood cardio, Zumba, HIIT) will appear here once scheduled.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {DANCE_FITNESS_CLASSES_DATA.map((fit) => (
                <div
                  key={fit.id}
                  onClick={() => handleFitnessSelect(fit)}
                  className="group rounded-2xl bg-zinc-900 border border-white/10 hover:border-rose-500/60 overflow-hidden transition-all duration-300 hover:shadow-xl cursor-pointer flex flex-col justify-between"
                >
                  <div>
                    <div className="relative h-44 w-full overflow-hidden bg-zinc-950">
                      <img
                        src={fit.image}
                        alt={fit.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                      <span className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full bg-rose-600 text-white text-xs font-mono uppercase font-bold shadow">
                        {fit.type}
                      </span>
                      <span className="absolute bottom-2 right-2.5 text-xs font-bold text-amber-400 bg-black/70 px-2 py-0.5 rounded-lg border border-amber-400/30">
                        🔥 {fit.caloriesBurned} kcal
                      </span>
                    </div>

                    <div className="p-4 space-y-1">
                      <h4 className="text-base font-bold text-white group-hover:text-rose-300 transition-colors line-clamp-1">
                        {fit.title}
                      </h4>
                      <p className="text-xs text-zinc-400 line-clamp-1">
                        {fit.instructor} • {fit.bpm} BPM
                      </p>
                    </div>
                  </div>

                  <div className="p-4 pt-2 border-t border-white/10 flex items-center justify-between text-xs">
                    <span className="text-base font-bold text-white">₹{fit.price}</span>
                    <span className="text-xs font-semibold text-rose-400">Book Session →</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'battles' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <div>
              <h3 className="text-lg font-bold text-white">Competitive Dance Cyphers & Battles</h3>
              <p className="text-xs text-zinc-400">1v1 All-Styles, Crew battles, and stage championships</p>
            </div>
            <span className="text-xs font-mono text-amber-400 font-bold">{COMPETITIONS_DATA.length} Competitions</span>
          </div>

          {COMPETITIONS_DATA.length === 0 ? (
            <div className="py-14 px-4 rounded-3xl bg-zinc-900/40 border border-dashed border-white/10 text-center max-w-md mx-auto space-y-3">
              <Trophy className="w-8 h-8 text-zinc-500 mx-auto" />
              <h4 className="text-base font-bold text-white">No active battles or cyphers</h4>
              <p className="text-xs text-zinc-400">Tournament organizers can launch street cyphers, crew brackets, and live judge scoring.</p>
              <button onClick={() => onNavigate('organizer-dashboard')} className="px-4 py-2 rounded-xl bg-white text-black font-bold text-xs">+ Launch Battle</button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {COMPETITIONS_DATA.map((comp) => (
                <div
                  key={comp.id}
                  onClick={() => onNavigate('challenges')}
                  className="group rounded-2xl bg-zinc-900 border border-white/10 hover:border-amber-500/60 overflow-hidden transition-all duration-300 hover:shadow-xl cursor-pointer flex flex-col justify-between"
                >
                  <div>
                    <div className="relative h-44 w-full overflow-hidden bg-zinc-950">
                      <img
                        src={comp.image}
                        alt={comp.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                      <span className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full bg-amber-500 text-black text-xs font-mono uppercase font-extrabold shadow">
                        {comp.badge || comp.format}
                      </span>
                      <span className="absolute bottom-2 left-2.5 text-xs font-bold text-emerald-400 bg-black/70 px-2 py-0.5 rounded-lg border border-emerald-400/30">
                        Prize: {comp.prizePool}
                      </span>
                    </div>

                    <div className="p-4 space-y-1">
                      <h4 className="text-base font-bold text-white group-hover:text-amber-300 transition-colors line-clamp-1">
                        {comp.title}
                      </h4>
                      <p className="text-xs text-zinc-400 line-clamp-1">
                        {comp.venue} • {comp.city}
                      </p>
                    </div>
                  </div>

                  <div className="p-4 pt-2 border-t border-white/10 flex items-center justify-between text-xs">
                    <span className="text-base font-bold text-white">Entry: ₹{comp.entryFee}</span>
                    <span className="text-xs font-semibold text-amber-400">Enter Battle →</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'offers' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <div>
              <h3 className="text-lg font-bold text-white">Wedding Sangeet & Choreography Packages</h3>
              <p className="text-xs text-zinc-400">Exclusive wedding choreography packages with custom audio mashups</p>
            </div>
            <span className="text-xs font-mono text-pink-400 font-bold">{WEDDING_OFFERS_DATA.length} Offers</span>
          </div>

          {WEDDING_OFFERS_DATA.length === 0 ? (
            <div className="py-14 px-4 rounded-3xl bg-zinc-900/40 border border-dashed border-white/10 text-center max-w-md mx-auto space-y-3">
              <Percent className="w-8 h-8 text-zinc-500 mx-auto" />
              <h4 className="text-base font-bold text-white">No promotional packages active</h4>
              <p className="text-xs text-zinc-400">Custom bridal entries, couple duets, and family Sangeet packages can be requested anytime.</p>
              <button onClick={() => onNavigate('wedding-landing')} className="px-4 py-2 rounded-xl bg-white text-black font-bold text-xs">Request Wedding Quote</button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {WEDDING_OFFERS_DATA.map((offer) => (
                <div
                  key={offer.id}
                  onClick={() => onNavigate('wedding-landing')}
                  className="group rounded-2xl bg-zinc-900 border border-white/10 hover:border-pink-500/60 overflow-hidden p-4 transition-all duration-300 hover:shadow-xl cursor-pointer flex gap-4 items-center"
                >
                  <img
                    src={offer.image}
                    alt={offer.title}
                    className="w-24 h-24 rounded-xl object-cover shrink-0 border border-white/10 group-hover:scale-105 transition-transform"
                    referrerPolicy="no-referrer"
                  />
                  <div className="flex-1 min-w-0 space-y-1">
                    <span className="px-2.5 py-0.5 rounded-full bg-pink-500/20 text-pink-400 text-xs font-bold uppercase inline-block border border-pink-500/30">
                      {offer.badge}
                    </span>
                    <h4 className="text-base font-bold text-white group-hover:text-pink-300 transition-colors line-clamp-1">
                      {offer.title}
                    </h4>
                    <p className="text-xs text-zinc-400 line-clamp-1">
                      {offer.subtitle}
                    </p>
                    <div className="flex items-baseline gap-2 pt-1">
                      <span className="text-base font-extrabold text-amber-300 font-mono">
                        {offer.currency}{offer.offerPrice}
                      </span>
                      <span className="text-xs text-zinc-500 line-through">
                        {offer.currency}{offer.originalPrice}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Brands Tab View */}
      {activeTab === 'brands' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-amber-400" />
                <span>Dance-Friendly Brands Directory</span>
              </h3>
              <p className="text-xs text-zinc-400">
                Performance apparel, footwear, stage makeup, and recovery tools
              </p>
            </div>
            <button
              onClick={() => onNavigate('brands-marketplace')}
              className="px-4 py-2 rounded-xl bg-white hover:bg-zinc-200 text-black text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
            >
              <span>Open Full Marketplace</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {INITIAL_BRANDS_DATA.filter((b) => b.approvalStatus === 'APPROVED').map((brand) => (
              <div
                key={brand.id}
                onClick={() => onNavigate('brands-marketplace')}
                className="group rounded-2xl bg-zinc-900 border border-white/10 hover:border-amber-500/50 p-4 transition-all duration-300 hover:shadow-xl cursor-pointer flex flex-col justify-between space-y-3"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={brand.logoUrl}
                    alt={brand.name}
                    className="w-12 h-12 rounded-xl object-cover bg-black border border-white/10 shrink-0"
                  />
                  <div className="min-w-0">
                    <h4 className="text-sm font-bold text-white group-hover:text-amber-200 transition-colors truncate">
                      {brand.name}
                    </h4>
                    <span className="text-[11px] text-amber-300 font-mono block">
                      {brand.tagline}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                  {brand.description}
                </p>

                <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs">
                  <span className="text-zinc-500 font-mono text-[11px]">
                    {brand.discountPercent ? `${brand.discountPercent}% OFF Code` : 'Certified Brand'}
                  </span>
                  <span className="font-semibold text-amber-300 flex items-center gap-1">
                    Explore →
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Published Event Details Modal */}
      <EventDetailModal
        event={selectedEventModal}
        isOpen={!!selectedEventModal}
        onClose={() => setSelectedEventModal(null)}
        onBookPass={onBookPass}
      />

      {/* Location Entry & Prompt Modal */}
      <LocationSelectorModal
        isOpen={showLocationModal}
        onClose={() => setShowLocationModal(false)}
        currentLocation={userLocation}
        isCurrentLocation={false}
        onSelectLocation={(loc, isGPS) => {
          if (onSelectLocation) onSelectLocation(loc, isGPS);
          setShowLocationModal(false);
        }}
        onClearLocation={() => {
          if (onClearLocation) onClearLocation();
          setShowLocationModal(false);
        }}
      />
    </div>
  );
};

