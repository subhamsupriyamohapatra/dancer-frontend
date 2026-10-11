import React, { useState, useEffect } from 'react';
import {
  Compass,
  ChevronRight,
  ChevronLeft,
  Building2,
  Flame,
  Percent,
  Calendar,
  Trophy,
  Crown,
  MapPin,
  Star,
  Search,
  Activity,
  Heart,
  ArrowRight,
  Layers,
  Sparkles,
} from 'lucide-react';
import {
  RUNNING_FEATURED_BANNERS,
  NEAREST_STUDIOS_DATA,
  WORKSHOPS_DATA,
  WEDDING_OFFERS_DATA,
  REGULAR_CLASSES_DATA,
  DANCE_STYLE_ICONS_DATA,
  COMPETITIONS_DATA,
  CHOREOGRAPHERS_DATA,
  DANCE_FITNESS_CLASSES_DATA,
} from '../data/danceData';
import { DanceClass, ScreenType } from '../types';

interface ExploreScreenProps {
  onNavigate: (screen: ScreenType) => void;
  onSelectClass: (danceClass: DanceClass) => void;
  onSelectCategory: (category: string) => void;
}

type ExploreTab = 'all' | 'styles' | 'studios' | 'workshops' | 'fitness' | 'classes' | 'battles' | 'choreographers' | 'wedding';

export const ExploreScreen: React.FC<ExploreScreenProps> = ({
  onNavigate,
  onSelectClass,
  onSelectCategory,
}) => {
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<ExploreTab>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (RUNNING_FEATURED_BANNERS.length === 0) return;
    const timer = setInterval(() => {
      setCurrentBannerIndex((prev) => (prev + 1) % RUNNING_FEATURED_BANNERS.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const scrollContainer = (id: string, direction: 'left' | 'right') => {
    const container = document.getElementById(id);
    if (container) {
      const scrollOffset = direction === 'left' ? -380 : 380;
      container.scrollBy({ left: scrollOffset, behavior: 'smooth' });
    }
  };

  const activeBanner = RUNNING_FEATURED_BANNERS.length > 0 ? RUNNING_FEATURED_BANNERS[currentBannerIndex] : null;

  return (
    <div className="w-full max-w-[1600px] mx-auto px-3 sm:px-6 py-3 space-y-6 pb-20 text-[#fafafa] font-sans">
      
      {/* 1. HEADER & SEARCH */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
        <div className="flex items-center gap-2.5">
          <span className="p-2 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20">
            <Compass className="w-5 h-5" />
          </span>
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-white tracking-tight">
              Explore Dance Directory
            </h1>
            <p className="text-xs text-zinc-400">
              Browse categories, academies, workshops, and verified faculty
            </p>
          </div>
        </div>

        <div className="relative sm:w-72 md:w-80 flex items-center">
          <Search className="absolute left-3 w-4 h-4 text-zinc-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search styles, studios, workshops..."
            className="w-full pl-9 pr-4 py-2 bg-zinc-900 border border-white/10 focus:border-purple-500 text-xs sm:text-sm text-white placeholder:text-zinc-500 rounded-xl outline-none transition-all shadow-inner"
          />
        </div>
      </div>

      {/* 2. HORIZONTALLY SCROLLABLE EXPLORE CATEGORY PILLS */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 border-b border-white/10 pb-3">
        {[
          { id: 'all', label: '⚡ All Modules' },
          { id: 'styles', label: `💃 Dance Styles (${DANCE_STYLE_ICONS_DATA.length})` },
          { id: 'studios', label: `🏢 Academies (${NEAREST_STUDIOS_DATA.length})` },
          { id: 'workshops', label: `✨ Workshops (${WORKSHOPS_DATA.length})` },
          { id: 'fitness', label: `🔥 Fitness (${DANCE_FITNESS_CLASSES_DATA.length})` },
          { id: 'classes', label: `📅 Daily Batches (${REGULAR_CLASSES_DATA.length})` },
          { id: 'battles', label: `🏆 Battles (${COMPETITIONS_DATA.length})` },
          { id: 'choreographers', label: `⭐ Faculty (${CHOREOGRAPHERS_DATA.length})` },
          { id: 'wedding', label: '💍 Wedding Offers' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as ExploreTab)}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-200 ${
              activeTab === tab.id
                ? 'bg-sky-500 text-black font-extrabold shadow-lg shadow-sky-500/25'
                : 'bg-zinc-900/80 text-zinc-400 hover:text-white hover:bg-zinc-800 border border-white/5'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 3. HORIZONTAL CATEGORY SCROLL RAILS */}
      {(activeTab === 'all' || activeTab === 'styles') && (
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                <Layers className="w-4 h-4" />
              </span>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-white tracking-wide">
                  Browse by Dance Style & Genre
                </h3>
                <p className="text-xs text-zinc-400">
                  Swipe through genres to view curated batches & masterclasses
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => scrollContainer('explore-styles-scroll', 'left')}
                className="w-8 h-8 rounded-full bg-zinc-900 hover:bg-zinc-800 border border-white/10 flex items-center justify-center text-zinc-300 hover:text-white transition-all shadow-sm"
                aria-label="Scroll styles left"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => scrollContainer('explore-styles-scroll', 'right')}
                className="w-8 h-8 rounded-full bg-zinc-900 hover:bg-zinc-800 border border-white/10 flex items-center justify-center text-zinc-300 hover:text-white transition-all shadow-sm"
                aria-label="Scroll styles right"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div
            id="explore-styles-scroll"
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

                <div className="relative z-10">
                  <span className="inline-block px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-xs font-semibold text-purple-300 border border-purple-400/30 shadow-sm">
                    {style.count}
                  </span>
                </div>

                <div className="relative z-10">
                  <h4 className="text-base sm:text-lg font-extrabold text-white group-hover:text-purple-200 transition-colors drop-shadow">
                    {style.name}
                  </h4>
                  <span className="text-xs text-zinc-400 flex items-center gap-1 group-hover:text-white transition-colors mt-0.5 font-medium">
                    Filter classes <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </button>
            ))}
          </div>
        </section>
      )}

      {(activeTab === 'all' || activeTab === 'studios') && (
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20">
                <Building2 className="w-4 h-4" />
              </span>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-white tracking-wide">
                  Dance Studios & Academies
                </h3>
                <p className="text-xs text-zinc-400">
                  Certified studio spaces equipped for professional dance training
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => scrollContainer('explore-studios-scroll', 'left')}
                className="w-8 h-8 rounded-full bg-zinc-900 hover:bg-zinc-800 border border-white/10 flex items-center justify-center text-zinc-300 hover:text-white transition-all shadow-sm"
                aria-label="Scroll studios left"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => scrollContainer('explore-studios-scroll', 'right')}
                className="w-8 h-8 rounded-full bg-zinc-900 hover:bg-zinc-800 border border-white/10 flex items-center justify-center text-zinc-300 hover:text-white transition-all shadow-sm"
                aria-label="Scroll studios right"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div
            id="explore-studios-scroll"
            className="flex items-stretch gap-4 overflow-x-auto no-scrollbar scroll-smooth snap-x snap-mandatory py-2 px-0.5"
          >
            {NEAREST_STUDIOS_DATA.length === 0 ? (
              <div className="w-full py-8 px-6 rounded-2xl bg-zinc-900/60 border border-dashed border-white/10 text-center flex flex-col items-center justify-center space-y-2">
                <p className="text-sm font-semibold text-zinc-300">No studios listed yet</p>
                <p className="text-xs text-zinc-500 max-w-md">Studio owners can list spaces with sprung wooden floors and mirror-equipped halls.</p>
                <button onClick={() => onNavigate('studio-dashboard')} className="mt-1 px-4 py-2 rounded-xl bg-sky-500/20 text-sky-400 border border-sky-500/30 text-xs font-bold">+ Register Studio</button>
              </div>
            ) : (
              NEAREST_STUDIOS_DATA.map((studio) => (
                <div
                  key={studio.id}
                  onClick={() => onNavigate('studio-profile')}
                  className="group flex-shrink-0 snap-start w-72 sm:w-80 rounded-2xl bg-zinc-900/90 border border-white/10 hover:border-sky-500/60 overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-sky-500/10 cursor-pointer flex flex-col justify-between"
                >
                  <div>
                    <div className="relative h-40 w-full overflow-hidden bg-zinc-950">
                      <img
                        src={studio.heroImage}
                        alt={studio.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                      <span className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md text-xs text-amber-400 font-bold border border-amber-400/30">
                        ★ {studio.rating}
                      </span>
                      <span className="absolute bottom-2 left-2.5 text-xs font-medium text-white/90 drop-shadow">
                        {studio.distance} • {studio.neighborhood}
                      </span>
                    </div>

                    <div className="p-4 space-y-2">
                      <h4 className="text-sm sm:text-base font-bold text-white group-hover:text-sky-300 transition-colors line-clamp-1">
                        {studio.name}
                      </h4>
                      <p className="text-xs text-zinc-400 line-clamp-2">
                        {studio.about}
                      </p>
                    </div>
                  </div>

                  <div className="p-4 pt-2 border-t border-white/10 flex items-center justify-between text-xs">
                    <span className="text-xs font-bold text-white">{studio.priceRange}</span>
                    <span className="text-xs font-semibold text-sky-400">View Details →</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      )}

      {(activeTab === 'all' || activeTab === 'workshops') && (
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-xl bg-orange-500/10 text-orange-400 border border-orange-500/20">
                <Flame className="w-4 h-4" />
              </span>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-white tracking-wide">
                  Upcoming Masterclasses & Workshops
                </h3>
                <p className="text-xs text-zinc-400">
                  Intensive multi-day workshops taught by industry masters
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => scrollContainer('explore-workshops-scroll', 'left')}
                className="w-8 h-8 rounded-full bg-zinc-900 hover:bg-zinc-800 border border-white/10 flex items-center justify-center text-zinc-300 hover:text-white transition-all shadow-sm"
                aria-label="Scroll workshops left"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => scrollContainer('explore-workshops-scroll', 'right')}
                className="w-8 h-8 rounded-full bg-zinc-900 hover:bg-zinc-800 border border-white/10 flex items-center justify-center text-zinc-300 hover:text-white transition-all shadow-sm"
                aria-label="Scroll workshops right"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div
            id="explore-workshops-scroll"
            className="flex items-stretch gap-4 overflow-x-auto no-scrollbar scroll-smooth snap-x snap-mandatory py-2 px-0.5"
          >
            {WORKSHOPS_DATA.length === 0 ? (
              <div className="w-full py-8 px-6 rounded-2xl bg-zinc-900/60 border border-dashed border-white/10 text-center flex flex-col items-center justify-center space-y-2">
                <p className="text-sm font-semibold text-zinc-300">No workshops scheduled yet</p>
                <p className="text-xs text-zinc-500 max-w-md">Certified choreographers can list masterclasses, technique intensives, and bootcamps.</p>
                <button onClick={() => onNavigate('instructor-dashboard')} className="mt-1 px-4 py-2 rounded-xl bg-orange-500/20 text-orange-400 border border-orange-500/30 text-xs font-bold">+ List Workshop</button>
              </div>
            ) : (
              WORKSHOPS_DATA.map((ws) => (
                <div
                  key={ws.id}
                  onClick={() => onSelectClass(ws)}
                  className="group flex-shrink-0 snap-start w-72 sm:w-80 rounded-2xl bg-zinc-900/90 border border-white/10 hover:border-orange-500/60 overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-orange-500/10 cursor-pointer flex flex-col justify-between"
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
                      <span className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full bg-orange-600 text-white text-xs font-mono uppercase font-bold shadow">
                        {ws.category}
                      </span>
                      <span className="absolute bottom-2 left-2.5 text-xs font-medium text-white/90 drop-shadow">
                        {ws.dayTime}
                      </span>
                    </div>

                    <div className="p-4 space-y-1">
                      <h4 className="text-sm sm:text-base font-bold text-white group-hover:text-orange-300 transition-colors line-clamp-1">
                        {ws.title}
                      </h4>
                      <p className="text-xs text-zinc-400 line-clamp-1">
                        Instructor: {ws.instructor}
                      </p>
                      <p className="text-xs text-zinc-500 line-clamp-1">
                        {ws.studio}
                      </p>
                    </div>
                  </div>

                  <div className="p-4 pt-2 border-t border-white/10 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-xs text-zinc-400 block">Tuition</span>
                      <span className="text-base font-bold text-white">₹{ws.price}</span>
                    </div>
                    <button className="px-3.5 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-500 text-white font-semibold text-xs transition-colors">
                      Enroll Now →
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      )}

      {(activeTab === 'all' || activeTab === 'fitness') && (
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
                <Activity className="w-4 h-4" />
              </span>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-white tracking-wide">
                  Dance Fitness & Cardio Workouts
                </h3>
                <p className="text-xs text-zinc-400">
                  HIIT dance sessions, Zumba, and Bollywood Cardio
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => scrollContainer('explore-fitness-scroll', 'left')}
                className="w-8 h-8 rounded-full bg-zinc-900 hover:bg-zinc-800 border border-white/10 flex items-center justify-center text-zinc-300 hover:text-white transition-all shadow-sm"
                aria-label="Scroll fitness left"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => scrollContainer('explore-fitness-scroll', 'right')}
                className="w-8 h-8 rounded-full bg-zinc-900 hover:bg-zinc-800 border border-white/10 flex items-center justify-center text-zinc-300 hover:text-white transition-all shadow-sm"
                aria-label="Scroll fitness right"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div
            id="explore-fitness-scroll"
            className="flex items-stretch gap-4 overflow-x-auto no-scrollbar scroll-smooth snap-x snap-mandatory py-2 px-0.5"
          >
            {DANCE_FITNESS_CLASSES_DATA.length === 0 ? (
              <div className="w-full py-8 px-6 rounded-2xl bg-zinc-900/60 border border-dashed border-white/10 text-center flex flex-col items-center justify-center space-y-2">
                <p className="text-sm font-semibold text-zinc-300">No fitness batches active yet</p>
                <p className="text-xs text-zinc-500 max-w-md">Join HIIT cardio, Zumba, and Bollywood workout sessions once studios publish daily slots.</p>
                <button onClick={() => onNavigate('search')} className="mt-1 px-4 py-2 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-bold">Search Dance Styles</button>
              </div>
            ) : (
              DANCE_FITNESS_CLASSES_DATA.map((fit) => (
                <div
                  key={fit.id}
                  onClick={() =>
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
                    })
                  }
                  className="group flex-shrink-0 snap-start w-64 sm:w-72 rounded-2xl bg-zinc-900/90 border border-white/10 hover:border-rose-500/60 overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-rose-500/10 cursor-pointer flex flex-col justify-between"
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
                        {fit.instructor} • {fit.bpm} BPM
                      </p>
                    </div>
                  </div>

                  <div className="p-4 pt-2 border-t border-white/10 flex items-center justify-between text-xs">
                    <span className="text-base font-bold text-white">₹{fit.price}</span>
                    <span className="text-xs font-semibold text-rose-400">Join Workout →</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      )}

      {(activeTab === 'all' || activeTab === 'battles') && (
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <Trophy className="w-4 h-4" />
              </span>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-white tracking-wide">
                  Dance Battles & Tournament Arenas
                </h3>
                <p className="text-xs text-zinc-400">
                  National cyphers with prizes and live scoring
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => scrollContainer('explore-battles-scroll', 'left')}
                className="w-8 h-8 rounded-full bg-zinc-900 hover:bg-zinc-800 border border-white/10 flex items-center justify-center text-zinc-300 hover:text-white transition-all shadow-sm"
                aria-label="Scroll battles left"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => scrollContainer('explore-battles-scroll', 'right')}
                className="w-8 h-8 rounded-full bg-zinc-900 hover:bg-zinc-800 border border-white/10 flex items-center justify-center text-zinc-300 hover:text-white transition-all shadow-sm"
                aria-label="Scroll battles right"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div
            id="explore-battles-scroll"
            className="flex items-stretch gap-4 overflow-x-auto no-scrollbar scroll-smooth snap-x snap-mandatory py-2 px-0.5"
          >
            {COMPETITIONS_DATA.length === 0 ? (
              <div className="w-full py-8 px-6 rounded-2xl bg-zinc-900/60 border border-dashed border-white/10 text-center flex flex-col items-center justify-center space-y-2">
                <p className="text-sm font-semibold text-zinc-300">No active dance battles scheduled</p>
                <p className="text-xs text-zinc-500 max-w-md">Certified organizers can launch 1v1 cyphers, crew championships, and choreo showcases.</p>
                <button onClick={() => onNavigate('organizer-dashboard')} className="mt-1 px-4 py-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold">+ Create Competition</button>
              </div>
            ) : (
              COMPETITIONS_DATA.map((comp) => (
                <div
                  key={comp.id}
                  onClick={() => onNavigate('challenges')}
                  className="group flex-shrink-0 snap-start w-72 sm:w-80 rounded-2xl bg-zinc-900/90 border border-white/10 hover:border-emerald-500/60 overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/10 cursor-pointer flex flex-col justify-between"
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
                      <span className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full bg-emerald-500 text-black text-xs font-mono uppercase font-extrabold shadow">
                        {comp.badge || comp.format}
                      </span>
                      <span className="absolute bottom-2 left-2.5 text-xs font-bold text-emerald-400 bg-black/70 px-2 py-0.5 rounded-lg border border-emerald-400/30">
                        Prize: {comp.prizePool}
                      </span>
                    </div>

                    <div className="p-4 space-y-1">
                      <h4 className="text-sm sm:text-base font-bold text-white group-hover:text-emerald-300 transition-colors line-clamp-1">
                        {comp.title}
                      </h4>
                      <p className="text-xs text-zinc-400 line-clamp-1">
                        {comp.date}
                      </p>
                    </div>
                  </div>

                  <div className="p-4 pt-2 border-t border-white/10 flex items-center justify-between text-xs">
                    <span className="text-base font-bold text-white">Entry: ₹{comp.entryFee}</span>
                    <span className="text-xs font-semibold text-emerald-400">View Battle →</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      )}

    </div>
  );
};

