import React, { useState } from 'react';
import {
  X,
  Calendar,
  Clock,
  MapPin,
  Users,
  DollarSign,
  Ticket,
  CheckCircle2,
  Share2,
  ShieldCheck,
} from 'lucide-react';
import { OrganizerEventRecord } from '../../types/organizer';

interface EventDetailModalProps {
  event: OrganizerEventRecord | null;
  isOpen: boolean;
  onClose: () => void;
  onBookPass?: (eventId: string, ticketTierIndex?: number) => void;
}

export const EventDetailModal: React.FC<EventDetailModalProps> = ({
  event,
  isOpen,
  onClose,
  onBookPass,
}) => {
  const [selectedTierIndex, setSelectedTierIndex] = useState(0);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  if (!isOpen || !event) return null;

  const handleBook = () => {
    if (onBookPass) {
      onBookPass(event.id, selectedTierIndex);
    }
    setBookingConfirmed(true);
    setTimeout(() => {
      setBookingConfirmed(false);
    }, 3000);
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const guests = event.judges && event.judges.length > 0
    ? event.judges
    : ['Sarah Jenkins (UK Master)', 'Guest Choreographers'];

  const capacity = event.capacity || 100;
  const sold = event.registeredCount || 0;
  const percentSold = Math.min(100, Math.round((sold / capacity) * 100));
  const remaining = Math.max(0, capacity - sold);
  const revenue = event.revenue || 0;

  const currentTier = event.ticketPricing && event.ticketPricing[selectedTierIndex]
    ? event.ticketPricing[selectedTierIndex]
    : { tier: 'General Pass', price: 499, capacity: 100, sold: sold };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in">
      <div className="bg-[#0c0d12] border border-white/[0.12] rounded-2xl w-full max-w-lg flex flex-col shadow-2xl overflow-hidden my-auto animate-in zoom-in-95 max-h-[90vh]">
        {/* Cover Banner */}
        <div className="relative h-44 sm:h-52 w-full overflow-hidden shrink-0 bg-[#14151b]">
          <img
            src={event.coverImage}
            alt={event.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover opacity-75"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0c0d12] via-[#0c0d12]/50 to-transparent" />

          {/* Close & Share buttons */}
          <div className="absolute top-3 right-3 flex items-center gap-2">
            <button
              onClick={handleShare}
              className="px-3 py-1.5 rounded-full bg-black/75 backdrop-blur-md border border-white/20 text-xs font-mono text-white hover:bg-black flex items-center gap-1.5 transition-colors shadow-md"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{copiedLink ? 'Copied' : 'Share'}</span>
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-black/75 backdrop-blur-md border border-white/20 text-white hover:bg-black flex items-center justify-center transition-colors shadow-md"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Format Badge & Title Over Scrim */}
          <div className="absolute bottom-3 left-4 right-4">
            <div className="flex items-center gap-2 leading-none mb-1.5">
              <span className="text-xs font-mono tracking-wider text-[#10b981] font-bold uppercase bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                {event.type.replace('_', ' ')}
              </span>
              <span className="text-white/40 text-xs">·</span>
              <span className="text-xs font-mono text-[#9e9ea7] uppercase truncate">
                {event.city || 'Global Location'}
              </span>
            </div>
            <h1 className="text-lg sm:text-xl font-bold text-white tracking-tight leading-snug">
              {event.title}
            </h1>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 text-[#fafafa] font-sans">
          {/* THREE MANDATORY CRED METRICS: GUESTS, TICKETS SOLD, REVENUE */}
          <div className="grid grid-cols-3 gap-2.5">
            {/* 1. GUESTS & FACULTY */}
            <div className="p-3 rounded-xl bg-[#121319] border border-white/[0.08]">
              <span className="text-xs font-mono uppercase tracking-wider text-[#a1a1aa] block leading-none font-semibold">
                GUESTS
              </span>
              <span className="text-sm sm:text-base font-bold text-white tabular-nums block mt-1.5 leading-none">
                {guests.length} Artists
              </span>
              <span className="text-xs text-[#9e9ea7] mt-1 block truncate">
                {guests[0]}
              </span>
            </div>

            {/* 2. TICKETS SOLD */}
            <div className="p-3 rounded-xl bg-[#121319] border border-white/[0.08]">
              <span className="text-xs font-mono uppercase tracking-wider text-[#a1a1aa] block leading-none font-semibold">
                PASSES
              </span>
              <div className="flex items-baseline gap-1 mt-1.5 leading-none">
                <span className="text-sm sm:text-base font-bold text-[#10b981] tabular-nums">
                  {sold}
                </span>
                <span className="text-xs text-[#71717a] font-mono">/ {capacity}</span>
              </div>
              <div className="w-full h-1.5 bg-white/[0.08] rounded-full mt-2 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#10b981] to-[#38bdf8]"
                  style={{ width: `${percentSold}%` }}
                />
              </div>
            </div>

            {/* 3. REVENUE GENERATED */}
            <div className="p-3 rounded-xl bg-[#121319] border border-white/[0.08]">
              <span className="text-xs font-mono uppercase tracking-wider text-[#a1a1aa] block leading-none font-semibold">
                REVENUE
              </span>
              <span className="text-sm sm:text-base font-bold text-[#eab308] tabular-nums block mt-1.5 leading-none">
                ₹{revenue.toLocaleString()}
              </span>
              <span className="text-xs text-[#10b981] mt-1 block font-mono font-medium">
                Gross Inflow
              </span>
            </div>
          </div>

          {/* Schedule & Venue Metadata */}
          <div className="p-3.5 rounded-xl bg-[#121319] border border-white/[0.08] grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#38bdf8] shrink-0" />
              <span className="truncate text-white font-medium">
                {event.startDate}
                {event.endDate && event.endDate !== event.startDate ? ` - ${event.endDate}` : ''}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#eab308] shrink-0" />
              <span className="truncate text-white font-medium">{event.time || '10:00 AM - 06:00 PM'}</span>
            </div>

            <div className="flex items-center gap-2 sm:col-span-2">
              <MapPin className="w-4 h-4 text-[#10b981] shrink-0" />
              <span className="truncate text-white font-medium">
                {event.venue || 'Dance Studio'}, {event.city}
              </span>
            </div>
          </div>

          {/* Description */}
          {event.description && (
            <p className="text-xs sm:text-sm text-[#9e9ea7] leading-relaxed">
              {event.description}
            </p>
          )}

          {/* Ticket Tier Selection */}
          {event.ticketPricing && event.ticketPricing.length > 0 && (
            <div className="space-y-2">
              <span className="text-xs font-mono uppercase tracking-wider text-[#a1a1aa] font-semibold block">
                PASS TIER
              </span>
              <div className="flex gap-2.5 overflow-x-auto pb-1 no-scrollbar">
                {event.ticketPricing.map((tier, idx) => {
                  const isSelected = selectedTierIndex === idx;
                  return (
                    <button
                      key={idx}
                      onClick={() => setSelectedTierIndex(idx)}
                      className={`flex-1 min-w-[130px] p-2.5 rounded-xl border text-left transition-all ${
                        isSelected
                          ? 'bg-white/[0.12] border-white/50 text-white ring-1 ring-white/30'
                          : 'bg-[#121319] border-white/[0.08] text-[#9e9ea7] hover:border-white/20'
                      }`}
                    >
                      <span className="text-xs font-bold block truncate leading-tight text-white">
                        {tier.tier}
                      </span>
                      <span className="text-sm font-black text-white font-mono block leading-none mt-1">
                        ₹{tier.price}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Action */}
        <div className="p-3.5 px-4 sm:px-5 border-t border-white/[0.08] bg-[#0c0d12] flex items-center justify-between gap-4 shrink-0">
          <div>
            <span className="text-xs font-mono uppercase text-[#71717a] block leading-none">
              Total
            </span>
            <span className="text-lg font-black text-white font-mono leading-tight">
              ₹{currentTier.price}
            </span>
          </div>

          <button
            onClick={handleBook}
            className="px-5 py-2.5 rounded-xl bg-white hover:bg-zinc-200 text-black text-xs sm:text-sm font-bold tracking-tight flex items-center gap-2 shadow-md transition-all active:scale-[0.98]"
          >
            {bookingConfirmed ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-[#10b981]" />
                <span>Pass Confirmed</span>
              </>
            ) : (
              <>
                <Ticket className="w-4 h-4" />
                <span>Get Pass</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

