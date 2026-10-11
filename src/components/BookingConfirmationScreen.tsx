import React from 'react';
import {
  CheckCircle2,
  Calendar,
  MapPin,
  Clock,
  QrCode,
  Download,
  Share2,
  Home,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { Booking, ScreenType } from '../types';

interface BookingConfirmationScreenProps {
  booking: Booking;
  onNavigate: (screen: ScreenType) => void;
}

export const BookingConfirmationScreen: React.FC<BookingConfirmationScreenProps> = ({
  booking,
  onNavigate,
}) => {
  return (
    <div className="min-h-screen bg-[#09090b] text-[#fafafa] pb-24 px-4 sm:px-6 md:px-10 py-10">
      <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in zoom-in-95">
        {/* Celebration Header */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 flex items-center justify-center mx-auto shadow-[0_0_25px_rgba(245,158,11,0.2)]">
            <CheckCircle2 className="w-9 h-9" />
          </div>
          <span className="text-xs uppercase font-black tracking-widest text-[#3b82f6] block">
            Reservation Confirmed
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-[#fafafa]">
            You're On The Dance Floor!
          </h1>
          <p className="text-xs text-[#a1a1aa]">
            Your admission pass and digital check-in QR code are ready below.
          </p>
        </div>

        {/* Digital Ticket Pass Card */}
        <div className="rounded-3xl bg-[#18181b] border border-[#27272a] overflow-hidden shadow-2xl">
          {/* Top Pass Brand Banner */}
          <div className="bg-[#1e293b] border-b border-[#27272a] p-5 flex items-center justify-between text-white">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#3b82f6] text-white flex items-center justify-center font-black text-xs shadow-[0_0_12px_rgba(59,130,246,0.5)]">
                D1
              </div>
              <span className="text-sm font-black tracking-tight">DANCEONE ADMISSION PASS</span>
            </div>
            <span className="text-xs font-mono font-bold bg-[#18181b] px-3 py-1 rounded-full border border-[#3f3f46]">
              {booking.bookingCode}
            </span>
          </div>

          {/* Pass Body Content */}
          <div className="p-6 sm:p-8 space-y-6">
            <div className="space-y-1">
              <span className="px-2.5 py-0.5 rounded-full bg-[#27272a] text-[#fafafa] border border-[#3f3f46] text-xs font-extrabold uppercase">
                {booking.category} Masterclass
              </span>
              <h2 className="text-2xl font-black text-[#fafafa]">{booking.classTitle}</h2>
              <p className="text-xs text-[#a1a1aa]">
                Instructor: <strong className="text-[#fafafa]">{booking.instructorName}</strong>
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4 border-y border-[#27272a] text-xs">
              <div className="space-y-1">
                <span className="text-[#71717a] uppercase font-bold text-xs block">
                  Date & Time
                </span>
                <p className="font-bold text-[#fafafa] flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#3b82f6]" />
                  <span>{booking.date}</span>
                </p>
                <p className="text-[#a1a1aa]">{booking.time}</p>
              </div>

              <div className="space-y-1">
                <span className="text-[#71717a] uppercase font-bold text-xs block">
                  Studio Venue & Room
                </span>
                <p className="font-bold text-[#fafafa] flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#3b82f6]" />
                  <span>{booking.studioName}</span>
                </p>
                <p className="text-[#a1a1aa]">{booking.room || 'Room B Floor'}</p>
              </div>
            </div>

            {/* Scannable Admission QR Section */}
            <div className="p-6 rounded-2xl bg-[#121215] border border-[#27272a] flex flex-col sm:flex-row items-center justify-between gap-5">
              <div className="space-y-1 text-center sm:text-left">
                <span className="text-xs uppercase font-extrabold text-amber-300 tracking-wider flex items-center justify-center sm:justify-start gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  Live QR Check-in Ready
                </span>
                <h3 className="text-sm font-black text-[#fafafa]">Scan at Reception Kiosk</h3>
                <p className="text-xs text-[#a1a1aa] max-w-xs">
                  Display this screen upon arrival to unlock turnstile access.
                </p>
              </div>

              <div className="w-28 h-28 p-2 rounded-xl bg-white border border-[#27272a] shadow-inner flex items-center justify-center shrink-0">
                <img
                  src={booking.qrCodeUrl}
                  alt="Check-in QR Pass"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
          </div>

          {/* Ticket Footer Action Strip */}
          <div className="bg-[#121215] border-t border-[#27272a] p-4 flex items-center justify-between">
            <span className="text-xs font-bold text-[#71717a]">
              Paid via {booking.paymentMethod} • {booking.currency}{booking.price}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => alert("Added to Apple Wallet / Google Calendar!")}
                className="px-3.5 py-1.5 rounded-xl bg-[#27272a] hover:bg-[#3f3f46] text-xs font-bold text-[#fafafa] flex items-center gap-1.5 transition-colors"
              >
                <Calendar className="w-3.5 h-3.5 text-[#3b82f6]" />
                <span>Add to Calendar</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Navigation Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => onNavigate('bookings')}
            className="flex-1 py-4 rounded-2xl bg-[#18181b] border border-[#27272a] hover:border-[#3b82f6] text-[#fafafa] text-xs font-black uppercase tracking-wider transition-all"
          >
            View in My Passes
          </button>
          <button
            onClick={() => onNavigate('home')}
            className="flex-1 py-4 rounded-2xl bg-[#3b82f6] hover:bg-[#2563eb] text-white text-xs font-black uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(59,130,246,0.35)] flex items-center justify-center gap-2"
          >
            <span>Explore More Classes</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

