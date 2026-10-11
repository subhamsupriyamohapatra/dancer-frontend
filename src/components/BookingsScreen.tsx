import React, { useState } from 'react';
import {
  Calendar,
  MapPin,
  Clock,
  QrCode,
  Star,
  CheckCircle2,
  X,
  Ticket,
  Lock,
  ShieldCheck,
} from 'lucide-react';
import { Booking, ScreenType } from '../types';
import { canStudentReviewBooking } from '../utils/rbac';

interface BookingsScreenProps {
  bookings: Booking[];
  onNavigate: (screen: ScreenType) => void;
  onSelectBookingPass: (booking: Booking) => void;
}

export const BookingsScreen: React.FC<BookingsScreenProps> = ({
  bookings,
  onNavigate,
  onSelectBookingPass,
}) => {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
  const [reviewBooking, setReviewBooking] = useState<Booking | null>(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');

  const upcomingBookings = bookings.filter((b) => b.status === 'confirmed');
  const pastBookings = bookings.filter((b) => b.status === 'completed' || b.status === 'cancelled');

  return (
    <div className="w-full max-w-[1600px] mx-auto px-3 sm:px-6 py-4 space-y-6 pb-20 text-[#fafafa] font-sans">
      
      {/* 1. HEADER & TABS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
        <div className="flex items-center gap-2.5">
          <span className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <Ticket className="w-5 h-5" />
          </span>
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-white tracking-tight">
              My Passes & Bookings
            </h1>
            <p className="text-xs text-zinc-400">
              Access digital QR check-in passes for studio sessions & workshops
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              activeTab === 'upcoming'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                : 'bg-zinc-900 text-zinc-400 hover:text-white border border-white/5'
            }`}
          >
            Upcoming Passes ({upcomingBookings.length})
          </button>
          <button
            onClick={() => setActiveTab('past')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              activeTab === 'past'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                : 'bg-zinc-900 text-zinc-400 hover:text-white border border-white/5'
            }`}
          >
            Past Sessions ({pastBookings.length})
          </button>
        </div>
      </div>

      {/* 2. PASSES GRID */}
      {activeTab === 'upcoming' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {upcomingBookings.map((b) => (
            <div
              key={b.id}
              onClick={() => onSelectBookingPass(b)}
              className="p-5 rounded-2xl bg-zinc-900 border border-white/10 hover:border-purple-500/60 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/10 cursor-pointer flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-purple-300 bg-purple-500/15 px-2.5 py-1 rounded-full border border-purple-500/30 font-bold">
                    CONFIRMED PASS
                  </span>
                  <span className="text-xs font-mono text-zinc-400 font-semibold">{b.bookingCode}</span>
                </div>

                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-purple-300 transition-colors leading-snug">
                    {b.classTitle}
                  </h3>
                  <p className="text-xs text-zinc-400 mt-0.5">Instructor: {b.instructorName}</p>
                </div>

                <div className="space-y-1.5 text-xs text-zinc-300 pt-3 border-t border-white/5">
                  <div className="flex items-center gap-2 text-white">
                    <Calendar className="w-4 h-4 text-sky-400 shrink-0" />
                    <span>{b.date} • {b.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-purple-400 shrink-0" />
                    <span className="truncate">{b.studioName} ({b.room})</span>
                  </div>
                </div>

                {/* Rule 10 Notice for upcoming uncompleted pass */}
                <div className="p-2 rounded-xl bg-zinc-950/80 border border-white/5 flex items-center gap-2 text-[11px] text-zinc-400">
                  <Lock className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                  <span>Review unlocked after studio attendance check-in (Rule 10)</span>
                </div>
              </div>

              <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                <div>
                  <span className="text-xs text-zinc-400 block">Status</span>
                  <span className="text-base font-extrabold text-white">{b.currency}{b.price} Paid</span>
                </div>
                <span className="px-3.5 py-1.5 rounded-xl bg-white text-black font-bold flex items-center gap-1.5 text-xs shadow-md">
                  <QrCode className="w-4 h-4" />
                  <span>Show QR</span>
                </span>
              </div>
            </div>
          ))}

          {upcomingBookings.length === 0 && (
            <div className="col-span-full py-16 text-center rounded-3xl bg-zinc-900/40 border border-dashed border-white/10 p-6 space-y-3">
              <p className="text-base font-bold text-white">No active passes found</p>
              <p className="text-xs text-zinc-400 max-w-sm mx-auto">Browse workshops or studio batches to book your pass.</p>
              <button
                onClick={() => onNavigate('home')}
                className="px-5 py-2.5 rounded-xl bg-white text-black text-xs font-bold shadow-md hover:bg-zinc-200 transition-colors"
              >
                Explore Dance Batches
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {pastBookings.length === 0 ? (
            <div className="col-span-full py-16 text-center rounded-3xl bg-zinc-900/40 border border-dashed border-white/10 p-6 space-y-3">
              <p className="text-base font-bold text-white">No past dance sessions</p>
              <p className="text-xs text-zinc-400 max-w-sm mx-auto">Your completed class passes and workshop records will appear here.</p>
              <button
                onClick={() => onNavigate('home')}
                className="px-5 py-2.5 rounded-xl bg-purple-600 text-white text-xs font-bold shadow-md hover:bg-purple-500 transition-colors"
              >
                Find Classes to Join
              </button>
            </div>
          ) : (
            pastBookings.map((b) => {
              const reviewPermission = canStudentReviewBooking(b);
              return (
                <div
                  key={b.id}
                  className="p-5 rounded-2xl bg-zinc-900 border border-white/10 space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-mono px-2.5 py-1 rounded-full font-bold flex items-center gap-1 ${
                        b.status === 'completed'
                          ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                          : 'bg-zinc-800 text-zinc-400'
                      }`}>
                        {b.status === 'completed' ? (
                          <>
                            <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
                            <span>ATTENDED SESSION</span>
                          </>
                        ) : (
                          b.status.toUpperCase()
                        )}
                      </span>
                      <span className="text-xs font-mono text-zinc-400">{b.bookingCode}</span>
                    </div>
                    <h3 className="text-base font-bold text-white leading-snug">{b.classTitle}</h3>
                    <p className="text-xs text-zinc-400">Instructor: {b.instructorName}</p>
                    <p className="text-xs text-zinc-500 font-mono">{b.date} • {b.studioName}</p>

                    {reviewPermission.allowed && (
                      <p className="text-[11px] text-purple-300 font-mono flex items-center gap-1 mt-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-purple-400" />
                        <span>Verified Attendance: Review Unlocked</span>
                      </p>
                    )}
                  </div>

                  <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                    <span className="text-base font-bold text-zinc-300">{b.currency}{b.price}</span>
                    {reviewPermission.allowed ? (
                      <button
                        onClick={() => setReviewBooking(b as unknown as Booking)}
                        className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold flex items-center gap-1.5 transition-colors shadow-md shadow-purple-600/20"
                      >
                        <Star className="w-3.5 h-3.5 fill-current text-amber-300" />
                        <span>Leave Verified Review</span>
                      </button>
                    ) : (
                      <span className="text-[11px] text-zinc-500 font-mono flex items-center gap-1">
                        <Lock className="w-3.5 h-3.5" />
                        <span>Review Disabled</span>
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Review Modal */}
      {reviewBooking && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm rounded-2xl bg-zinc-900 border border-white/10 p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <h3 className="text-sm sm:text-base font-bold text-white">Rate Class Experience</h3>
              <button
                onClick={() => setReviewBooking(null)}
                className="text-zinc-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2">
              <p className="text-xs text-zinc-300">{reviewBooking.classTitle}</p>
              <div className="flex items-center gap-1.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setReviewRating(star)}
                    className="p-1 text-amber-400"
                  >
                    <Star
                      className={`w-5 h-5 ${
                        star <= reviewRating ? 'fill-current' : 'text-zinc-700'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <textarea
              value={reviewComment}
              onChange={(e) => setReviewComment(e.target.value)}
              placeholder="Leave feedback on studio floor, acoustics & instruction..."
              className="w-full p-3 bg-zinc-950 border border-white/10 rounded-xl text-xs text-white outline-none h-24 resize-none focus:border-purple-500"
            />

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setReviewBooking(null)}
                className="px-3 py-1.5 rounded-lg text-xs text-zinc-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={() => setReviewBooking(null)}
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-colors"
              >
                Submit Review
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

