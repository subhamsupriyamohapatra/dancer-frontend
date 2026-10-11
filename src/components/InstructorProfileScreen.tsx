import React, { useState } from 'react';
import {
  ArrowLeft,
  Share2,
  Heart,
  Star,
  Award,
  Users,
  Calendar,
  Sparkles,
  ChevronRight,
  MessageCircle,
  Video,
} from 'lucide-react';
import { RIYA_SHARMA_INSTRUCTOR, CONTEMPORARY_SEARCH_RESULTS } from '../data/danceData';
import { DanceClass, Instructor, ScreenType } from '../types';

interface InstructorProfileScreenProps {
  instructor?: Instructor;
  onBack: () => void;
  onNavigate: (screen: ScreenType) => void;
  onSelectClass: (danceClass: DanceClass) => void;
}

export const InstructorProfileScreen: React.FC<InstructorProfileScreenProps> = ({
  instructor = RIYA_SHARMA_INSTRUCTOR,
  onBack,
  onNavigate,
  onSelectClass,
}) => {
  const [isSaved, setIsSaved] = useState(false);
  const [showDirectContact, setShowDirectContact] = useState(false);

  return (
    <div className="min-h-screen bg-[#09090b] text-[#fafafa] pb-24">
      {/* Hero Header Banner */}
      <div className="relative h-72 sm:h-96 w-full overflow-hidden bg-[#121215]">
        <img
          src={instructor.coverImage || instructor.avatar}
          alt={instructor.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 scrim-bottom" />

        {/* Floating Top Actions */}
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
              onClick={() => setIsSaved(!isSaved)}
              className="w-10 h-10 rounded-full bg-[#18181b]/80 backdrop-blur-md border border-[#27272a] flex items-center justify-center text-white hover:scale-105 transition-all shadow-md"
            >
              <Heart className={`w-5 h-5 ${isSaved ? 'fill-[#ef4444] text-[#ef4444]' : 'text-white'}`} />
            </button>
            <button
              onClick={() => {
                if (navigator.share) {
                  navigator.share({ title: instructor.name, url: window.location.href });
                }
              }}
              className="w-10 h-10 rounded-full bg-[#18181b]/80 backdrop-blur-md border border-[#27272a] flex items-center justify-center text-white hover:scale-105 transition-all shadow-md"
            >
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Profile Card Overlay */}
        <div className="absolute bottom-6 left-4 sm:left-10 right-4 max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-end gap-5">
          <img
            src={instructor.avatar}
            alt={instructor.name}
            referrerPolicy="no-referrer"
            className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl object-cover border-4 border-[#18181b] shadow-2xl shrink-0"
          />

          <div className="space-y-1 text-white flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3 py-0.5 rounded-full bg-[#3b82f6] text-white text-xs font-black uppercase tracking-wider">
                {instructor.specialty}
              </span>
              <span className="px-3 py-0.5 rounded-full bg-[#18181b]/90 border border-[#27272a] text-white text-xs font-bold flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-[#f59e0b] text-[#f59e0b]" />
                {instructor.rating} ({instructor.reviewCount} reviews)
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black tracking-tight">{instructor.name}</h1>
            <p className="text-xs sm:text-sm text-white/80">{instructor.title}</p>
          </div>
        </div>
      </div>

      {/* Main Profile Body Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10 py-8 space-y-8">
        {/* Metric Cards (3-column grid matching Elegant Dark theme) */}
        <div className="grid grid-cols-3 gap-3 sm:gap-4">
          <div className="p-4 sm:p-5 rounded-3xl bg-[#18181b] border border-[#27272a] text-center space-y-1">
            <span className="text-xs uppercase font-bold text-[#71717a] tracking-wider block">
              Years Teaching
            </span>
            <span className="text-xl sm:text-2xl font-black text-[#fafafa]">{instructor.experience}</span>
          </div>

          <div className="p-4 sm:p-5 rounded-3xl bg-[#18181b] border border-[#27272a] text-center space-y-1">
            <span className="text-xs uppercase font-bold text-[#71717a] tracking-wider block">
              Dancers Taught
            </span>
            <span className="text-xl sm:text-2xl font-black text-[#fafafa]">
              {instructor.studentsTaught ? instructor.studentsTaught.toLocaleString() : '3,500+'}
            </span>
          </div>

          <div className="p-4 sm:p-5 rounded-3xl bg-[#18181b] border border-[#27272a] text-center space-y-1">
            <span className="text-xs uppercase font-bold text-[#71717a] tracking-wider block">
              Weekly Drop-Ins
            </span>
            <span className="text-xl sm:text-2xl font-black text-[#fafafa]">{instructor.classesCount} Classes</span>
          </div>
        </div>

        {/* Artist Bio */}
        <div className="bg-[#18181b] rounded-3xl p-6 sm:p-8 border border-[#27272a] space-y-3">
          <h2 className="text-xs font-black uppercase tracking-widest text-[#a1a1aa]">
            Biography & Movement Ethos
          </h2>
          <p className="text-sm text-[#a1a1aa] leading-relaxed">{instructor.bio}</p>
        </div>

        {/* Private 1-on-1 Mentorship Inquiry Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#18181b] border border-[#27272a] flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1.5 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <Sparkles className="w-4 h-4 text-[#3b82f6]" />
              <span className="text-xs font-bold uppercase tracking-widest text-[#3b82f6]">
                Private Training & Solo Choreography
              </span>
            </div>
            <h3 className="text-xl font-black text-[#fafafa]">Book Private 1-on-1 Mentorship</h3>
            <p className="text-xs text-[#a1a1aa] max-w-md">
              Tailored auditions coaching, technique correction, or custom competitive routine development.
            </p>
          </div>

          <button
            onClick={() => setShowDirectContact(true)}
            className="px-6 py-3.5 rounded-full bg-[#3b82f6] hover:bg-[#2563eb] text-white text-xs font-black uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(59,130,246,0.3)] shrink-0"
          >
            Inquire for Private Slot
          </button>
        </div>

        {/* Upcoming Classes with this Mentor */}
        <div className="space-y-4 pt-2">
          <div>
            <h2 className="text-xl font-black text-[#fafafa] tracking-tight">
              Upcoming Classes with {instructor.name}
            </h2>
            <p className="text-xs text-[#71717a] mt-0.5">
              Select any session to choose a date and reserve your studio pass
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {CONTEMPORARY_SEARCH_RESULTS.map((cls) => (
              <div
                key={cls.id}
                onClick={() => onSelectClass(cls)}
                className="p-5 rounded-3xl bg-[#18181b] border border-[#27272a] hover:border-[#3b82f6]/50 transition-all flex flex-col justify-between gap-3 cursor-pointer group shadow-sm"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="px-2.5 py-0.5 rounded-full bg-[#27272a] text-[#fafafa] border border-[#3f3f46] text-xs font-extrabold uppercase">
                      {cls.category}
                    </span>
                    <h3 className="text-base font-extrabold text-[#fafafa] group-hover:text-[#3b82f6] transition-colors mt-1.5">
                      {cls.title}
                    </h3>
                  </div>
                  <span className="text-base font-black text-[#fafafa]">
                    {cls.currency}{cls.price}
                  </span>
                </div>

                <div className="pt-2 border-t border-[#27272a] flex items-center justify-between text-xs">
                  <span className="text-[#a1a1aa] font-medium">{cls.dayTime}</span>
                  <span className="text-[#3b82f6] font-bold group-hover:translate-x-1 transition-transform">
                    Reserve →
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Private Session Inquire Modal */}
      {showDirectContact && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#18181b] border border-[#27272a] rounded-3xl max-w-md w-full p-6 space-y-4 animate-in fade-in zoom-in-95">
            <h3 className="text-lg font-black text-[#fafafa]">Inquire with {instructor.name}</h3>
            <p className="text-xs text-[#a1a1aa]">
              Send your preferred dates, studio location preference, and dance goals directly to {instructor.name}'s booking team.
            </p>
            <textarea
              placeholder="Tell us about your requirements (e.g. 2-hour contemporary solo for college festival competition)..."
              rows={3}
              className="w-full p-3 bg-[#121215] border border-[#27272a] focus:border-[#3b82f6] text-xs text-[#fafafa] placeholder:text-[#71717a] rounded-2xl outline-none"
            />
            <div className="flex gap-2">
              <button
                onClick={() => setShowDirectContact(false)}
                className="flex-1 py-3 rounded-xl bg-[#27272a] text-[#fafafa] text-xs font-bold"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  alert("Inquiry submitted! The studio team will contact you shortly.");
                  setShowDirectContact(false);
                }}
                className="flex-1 py-3 rounded-xl bg-[#3b82f6] text-white text-xs font-bold"
              >
                Send Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

