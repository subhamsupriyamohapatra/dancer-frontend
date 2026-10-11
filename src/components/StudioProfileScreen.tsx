import React, { useState } from 'react';
import {
  ArrowLeft,
  Share2,
  Heart,
  Star,
  MapPin,
  Clock,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  Users,
  Compass,
} from 'lucide-react';
import { ALL_CLASSES, FLOW_STUDIO_DATA, RIYA_SHARMA_INSTRUCTOR } from '../data/danceData';
import { DanceClass, Instructor, ScreenType, Studio } from '../types';

interface StudioProfileScreenProps {
  studio?: Studio;
  onBack: () => void;
  onNavigate: (screen: ScreenType) => void;
  onSelectClass: (danceClass: DanceClass) => void;
  onSelectInstructor?: (instructor: Instructor) => void;
}

export const StudioProfileScreen: React.FC<StudioProfileScreenProps> = ({
  studio = FLOW_STUDIO_DATA,
  onBack,
  onNavigate,
  onSelectClass,
  onSelectInstructor = (_inst: Instructor) => {},
}) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeDayIndex, setActiveDayIndex] = useState(0);

  const DAYS = studio.schedule.map((s) => `${s.day} ${s.dateNum}`);
  const currentDaySchedule = studio.schedule[activeDayIndex] || studio.schedule[0];

  return (
    <div className="min-h-screen bg-[#09090b] text-[#fafafa] pb-24">
      {/* Studio Cover Banner */}
      <div className="relative h-72 sm:h-96 w-full overflow-hidden bg-[#121215]">
        <img
          src={studio.heroImage}
          alt={studio.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 scrim-bottom" />

        {/* Top Control Bar */}
        <div className="absolute top-4 left-4 right-4 max-w-7xl mx-auto flex items-center justify-between z-20">
          <button
            onClick={onBack}
            className="w-10 h-10 rounded-full bg-[#18181b]/80 backdrop-blur-md border border-[#27272a] flex items-center justify-center text-white hover:border-[#3b82f6] transition-all shadow-md"
            aria-label="Back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsFavorite(!isFavorite)}
              className="w-10 h-10 rounded-full bg-[#18181b]/80 backdrop-blur-md border border-[#27272a] flex items-center justify-center text-white hover:scale-105 transition-all shadow-md"
            >
              <Heart className={`w-5 h-5 ${isFavorite ? 'fill-[#ef4444] text-[#ef4444]' : 'text-white'}`} />
            </button>
            <button
              onClick={() => {
                if (navigator.share) {
                  navigator.share({ title: studio.name, url: window.location.href });
                }
              }}
              className="w-10 h-10 rounded-full bg-[#18181b]/80 backdrop-blur-md border border-[#27272a] flex items-center justify-center text-white hover:scale-105 transition-all shadow-md"
            >
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Overlay Studio Info */}
        <div className="absolute bottom-6 left-4 sm:left-10 right-4 max-w-7xl mx-auto space-y-2 text-white">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-3 py-0.5 rounded-full bg-[#3b82f6] text-white text-xs font-black uppercase tracking-wider">
              Verified Partner Studio
            </span>
            <span className="px-3 py-0.5 rounded-full bg-[#18181b]/90 border border-[#27272a] text-white text-xs font-bold flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-[#f59e0b] text-[#f59e0b]" />
              {studio.rating} ({studio.reviewCount} reviews)
            </span>
          </div>

          <div className="flex items-center gap-4">
            {studio.logo && (
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-[#18181b] border-2 border-white/20 overflow-hidden shrink-0 shadow-lg p-0.5">
                <img
                  src={studio.logo}
                  alt={studio.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover rounded-xl"
                />
              </div>
            )}
            <div>
              <h1 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight">{studio.name}</h1>
              <p className="text-xs sm:text-sm text-white/80 flex items-center gap-1.5 mt-0.5">
                <MapPin className="w-4 h-4 text-[#3b82f6]" />
                <span>{studio.address || `${studio.neighborhood}, ${studio.city}`}</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Studio Body Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10 py-8 space-y-10">
        {/* Style Chips & Studio Amenities */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* About The Studio */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-[#18181b] rounded-3xl p-6 sm:p-8 border border-[#27272a] space-y-4">
              <h2 className="text-xs font-black uppercase tracking-widest text-[#a1a1aa]">
                About The Space & Philosophy
              </h2>
              <p className="text-sm text-[#a1a1aa] leading-relaxed">{studio.about}</p>

              <div className="pt-2 flex flex-wrap gap-2">
                {(studio.styles || []).map((style) => (
                  <span
                    key={style}
                    className="px-3 py-1 rounded-full bg-[#27272a] text-[#fafafa] border border-[#3f3f46] text-xs font-bold uppercase tracking-wider"
                  >
                    {style}
                  </span>
                ))}
              </div>
            </div>

            {/* Studio Amenities */}
            <div className="space-y-3">
              <h3 className="text-xs font-black uppercase tracking-widest text-[#a1a1aa]">
                Studio Infrastructure & Amenities
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {studio.amenities.map((amenity) => (
                  <div
                    key={amenity.id}
                    className="p-4 rounded-2xl bg-[#18181b] border border-[#27272a] flex items-center gap-3 text-xs font-semibold text-[#fafafa]"
                  >
                    <CheckCircle2 className="w-4 h-4 text-[#3b82f6] shrink-0" />
                    <span>{amenity.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Resident Instructors Column */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-black uppercase tracking-widest text-[#a1a1aa]">
                Resident Faculty
              </h2>
              <span className="text-xs text-[#3b82f6] font-bold">
                {studio.instructors.length} Mentors
              </span>
            </div>

            <div className="space-y-3">
              {studio.instructors.map((inst) => (
                <div
                  key={inst.id}
                  onClick={() => onSelectInstructor(RIYA_SHARMA_INSTRUCTOR)}
                  className="p-4 rounded-2xl bg-[#18181b] border border-[#27272a] hover:border-[#3b82f6]/50 transition-all flex items-center justify-between cursor-pointer group shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={inst.avatar}
                      alt={inst.name}
                      referrerPolicy="no-referrer"
                      className="w-12 h-12 rounded-xl object-cover border border-[#27272a] group-hover:scale-105 transition-transform"
                    />
                    <div>
                      <h4 className="text-sm font-black text-[#fafafa] group-hover:text-[#3b82f6] transition-colors">
                        {inst.name}
                      </h4>
                      <p className="text-xs text-[#a1a1aa]">{inst.role}</p>
                      <p className="text-xs text-[#71717a]">{inst.specialty || 'Master Mentor'}</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#71717a] group-hover:text-[#3b82f6] group-hover:translate-x-0.5 transition-all" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Live Studio Timetable & Drop-In Pass Booking */}
        <div className="space-y-6 pt-4 border-t border-[#27272a]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-black text-[#fafafa] tracking-tight">
                Daily Class Schedule & Passes
              </h2>
              <p className="text-xs text-[#71717a] mt-0.5">
                Reserve your spot in upcoming open drop-ins and masterclasses
              </p>
            </div>

            {/* Day Switcher */}
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
              {DAYS.map((day, idx) => (
                <button
                  key={day}
                  onClick={() => setActiveDayIndex(idx)}
                  className={`px-4 py-2 rounded-2xl text-xs font-black uppercase tracking-wider transition-all border whitespace-nowrap ${
                    activeDayIndex === idx
                      ? 'bg-[#3b82f6] text-white border-[#3b82f6] shadow-[0_0_15px_rgba(59,130,246,0.3)]'
                      : 'bg-[#18181b] text-[#a1a1aa] border-[#27272a] hover:border-[#3f3f46]'
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>

          {/* Schedule List for the Active Day */}
          <div className="space-y-3">
            {currentDaySchedule.classes.map((cls) => (
              <div
                key={cls.id}
                onClick={() => {
                  const matchedClass = ALL_CLASSES.find((c) => c.title.includes(cls.title)) || {
                    id: cls.id,
                    title: cls.title,
                    category: cls.category || 'Contemporary',
                    instructor: cls.instructor,
                    studio: studio.name,
                    location: `${studio.name}, ${studio.neighborhood}`,
                    city: studio.city,
                    dayTime: `${DAYS[activeDayIndex]} • ${cls.timeRange}`,
                    date: DAYS[activeDayIndex],
                    time: cls.timeRange,
                    price: cls.price,
                    currency: '₹',
                    image: studio.heroImage,
                    imageAlt: cls.title,
                    level: (cls.level || 'All Levels') as any,
                    spotsLeft: cls.spotsLeft,
                  };
                  onSelectClass(matchedClass);
                }}
                className="p-5 rounded-3xl bg-[#18181b] border border-[#27272a] hover:border-[#3b82f6]/50 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer group shadow-sm"
              >
                <div className="flex items-start sm:items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#27272a] text-[#3b82f6] border border-[#3f3f46] flex flex-col items-center justify-center shrink-0">
                    <Clock className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase mt-0.5">
                      {cls.timeRange.split(' ')[0]}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-[#27272a] text-[#fafafa] border border-[#3f3f46] text-xs font-extrabold uppercase">
                        {cls.category || 'Drop-In'}
                      </span>
                      <span className="text-xs text-[#a1a1aa] font-semibold">{cls.level || 'All Levels'}</span>
                    </div>

                    <h3 className="text-base font-extrabold text-[#fafafa] group-hover:text-[#3b82f6] transition-colors">
                      {cls.title}
                    </h3>
                    <p className="text-xs text-[#a1a1aa]">
                      With <strong className="text-[#fafafa]">{cls.instructor}</strong> • {cls.timeRange}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4 pt-3 sm:pt-0 border-t sm:border-t-0 border-[#27272a]">
                  <div className="text-left sm:text-right">
                    <span className="text-xs font-bold text-[#ef4444] block">
                      {cls.spotsLeft} spots left
                    </span>
                    <span className="text-lg font-black text-[#fafafa]">
                      ₹{cls.price}
                    </span>
                  </div>

                  <button className="px-5 py-2.5 rounded-xl bg-[#3b82f6] hover:bg-[#2563eb] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(59,130,246,0.25)]">
                    Book Slot
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

