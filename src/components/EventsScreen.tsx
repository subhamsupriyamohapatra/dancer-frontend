import React, { useState } from 'react';
import {
  Calendar,
  MapPin,
  Plus,
  ArrowRight,
  Search,
  Sparkles,
  Users,
} from 'lucide-react';
import { ScreenType } from '../types';
import { OrganizerEventRecord, EventType } from '../types/organizer';
import { EventDetailModal } from './common/EventDetailModal';

interface EventsScreenProps {
  onNavigate: (screen: ScreenType) => void;
  platformEvents?: OrganizerEventRecord[];
  userLocation?: string;
  onOpenCreateEvent?: () => void;
  onBookPass?: (eventId: string, tierIndex?: number) => void;
}

const EVENT_FORMAT_FILTERS: { label: string; type: EventType | 'all' }[] = [
  { label: 'All Formats', type: 'all' },
  { label: 'Workshops', type: 'workshop' },
  { label: 'Competitions', type: 'competition' },
  { label: 'Shows', type: 'dance_show' },
  { label: 'Battles', type: 'dance_battle' },
  { label: 'Masterclasses', type: 'masterclass' },
  { label: 'Dance Camps', type: 'dance_camp' },
  { label: 'Festivals', type: 'festival' },
  { label: 'Auditions', type: 'audition' },
  { label: 'Showcase', type: 'showcase' },
  { label: 'Socials', type: 'social' },
  { label: 'Jams', type: 'jam' },
  { label: 'Other', type: 'other' },
];

export const EventsScreen: React.FC<EventsScreenProps> = ({
  onNavigate,
  platformEvents = [],
  userLocation = '',
  onOpenCreateEvent,
  onBookPass,
}) => {
  const [selectedFormat, setSelectedFormat] = useState<EventType | 'all'>('all');
  const [selectedEventForModal, setSelectedEventForModal] = useState<OrganizerEventRecord | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [filterQuery, setFilterQuery] = useState('');

  const handleOpenDetail = (ev: OrganizerEventRecord) => {
    setSelectedEventForModal(ev);
    setIsDetailModalOpen(true);
  };

  const filteredEvents = platformEvents.filter((ev) => {
    const matchesFormat =
      selectedFormat === 'all' ||
      ev.type === selectedFormat ||
      (selectedFormat === 'dance_show' && ev.type === 'show') ||
      (selectedFormat === 'dance_battle' && ev.type === 'battle');

    const matchesLocation =
      !userLocation ||
      userLocation.toLowerCase().includes('global') ||
      userLocation.toLowerCase().includes('current') ||
      (ev.city && ev.city.toLowerCase().includes(userLocation.toLowerCase().split(',')[0].trim())) ||
      (ev.venue && ev.venue.toLowerCase().includes(userLocation.toLowerCase().split(',')[0].trim()));

    const matchesQuery =
      !filterQuery.trim() ||
      ev.title.toLowerCase().includes(filterQuery.toLowerCase()) ||
      ev.city.toLowerCase().includes(filterQuery.toLowerCase()) ||
      ev.venue.toLowerCase().includes(filterQuery.toLowerCase()) ||
      (ev.judges && ev.judges.some((j) => j.toLowerCase().includes(filterQuery.toLowerCase())));

    return matchesFormat && matchesLocation && matchesQuery;
  });

  return (
    <div className="w-full max-w-[1600px] mx-auto px-3 sm:px-6 py-4 space-y-6 pb-20 text-[#fafafa] font-sans">
      
      {/* 1. TOP HEADER & SEARCH */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
        <div className="flex items-center gap-2.5">
          <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Calendar className="w-5 h-5" />
          </span>
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-white tracking-tight">
              Platform Events & Gatherings
            </h1>
            <p className="text-xs text-zinc-400">
              Discover official championships, masterclasses, and open cyphers
            </p>
          </div>
          {userLocation && (
            <span className="text-xs font-mono text-[#10b981] hidden sm:inline bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20 ml-2">
              📍 {userLocation}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <div className="relative w-full sm:w-64 md:w-72 flex items-center">
            <Search className="absolute left-3 w-4 h-4 text-zinc-400" />
            <input
              type="text"
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              placeholder="Search gatherings & venues..."
              className="w-full pl-9 pr-4 py-2 bg-zinc-900 border border-white/10 focus:border-emerald-500 rounded-xl text-xs sm:text-sm text-white placeholder:text-zinc-500 outline-none transition-all shadow-inner"
            />
          </div>

          {onOpenCreateEvent && (
            <button
              onClick={onOpenCreateEvent}
              className="px-4 py-2 rounded-xl bg-white hover:bg-zinc-200 text-black text-xs font-bold flex items-center gap-1.5 shadow-md transition-all active:scale-95 shrink-0"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Host Event</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. HORIZONTALLY SCROLLABLE EVENT FORMAT TABS */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 border-b border-white/10 pb-3">
        {EVENT_FORMAT_FILTERS.map((f) => {
          const isSelected = selectedFormat === f.type;
          return (
            <button
              key={f.label}
              onClick={() => setSelectedFormat(f.type)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-200 ${
                isSelected
                  ? 'bg-emerald-500 text-black font-extrabold shadow-lg shadow-emerald-500/25'
                  : 'bg-zinc-900/80 text-zinc-400 hover:text-white hover:bg-zinc-800 border border-white/5'
              }`}
            >
              {f.label}
            </button>
          );
        })}
      </div>

      {/* 3. MAIN EVENTS GRID (READABLE & SPACIOUS) */}
      {filteredEvents.length === 0 ? (
        <div className="py-16 px-4 rounded-3xl bg-zinc-900/40 border border-dashed border-white/10 text-center max-w-md mx-auto space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-white/5 text-zinc-400 flex items-center justify-center mx-auto">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">
              {selectedFormat === 'all' ? 'No events found' : `No ${selectedFormat}s found`}
            </h3>
            <p className="text-xs text-zinc-400 mt-1">Try selecting another category or clear your search query.</p>
          </div>
          {onOpenCreateEvent && (
            <button
              onClick={onOpenCreateEvent}
              className="px-4 py-2 rounded-xl bg-white text-black text-xs font-bold inline-flex items-center gap-1.5 shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>Create Event</span>
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {filteredEvents.map((event) => {
            const guests = event.judges && event.judges.length > 0 ? event.judges : ['Faculty'];
            const capacity = event.capacity || 100;
            const sold = event.registeredCount || 0;
            const revenue = event.revenue || 0;
            const lowestPrice = event.ticketPricing?.[0]?.price ?? 499;

            return (
              <div
                key={event.id}
                onClick={() => handleOpenDetail(event)}
                className="group cursor-pointer rounded-2xl bg-zinc-900 border border-white/10 hover:border-emerald-500/60 overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/10 flex flex-col justify-between"
              >
                <div>
                  {/* Event Cover Image */}
                  <div className="relative h-44 w-full overflow-hidden bg-zinc-950">
                    <img
                      src={event.coverImage}
                      alt={event.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                    <div className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full bg-emerald-500 text-black text-xs font-mono tracking-wider uppercase font-extrabold shadow">
                      {event.type.replace('_', ' ')}
                    </div>

                    <div className="absolute bottom-2 left-2.5 flex items-center gap-1 text-xs font-medium text-white/90 drop-shadow">
                      <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{event.startDate}</span>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-4 space-y-2">
                    <h3 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors leading-tight line-clamp-1">
                      {event.title}
                    </h3>

                    <p className="text-xs text-zinc-400 flex items-center gap-1 line-clamp-1">
                      <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{event.venue || event.city}</span>
                    </p>

                    {/* Metrics Row */}
                    <div className="pt-2 border-t border-white/5 grid grid-cols-3 gap-1 text-center text-xs font-mono">
                      <div className="p-1.5 rounded-lg bg-white/[0.03]">
                        <span className="text-zinc-500 text-xs block leading-none">GUESTS</span>
                        <span className="text-white font-bold block mt-1">{guests.length}</span>
                      </div>
                      <div className="p-1.5 rounded-lg bg-white/[0.03]">
                        <span className="text-zinc-500 text-xs block leading-none">PASSES</span>
                        <span className="text-emerald-400 font-bold block mt-1">{sold}/{capacity}</span>
                      </div>
                      <div className="p-1.5 rounded-lg bg-white/[0.03]">
                        <span className="text-zinc-500 text-xs block leading-none">REVENUE</span>
                        <span className="text-amber-400 font-bold block mt-1">₹{revenue > 1000 ? `${(revenue/1000).toFixed(0)}k` : revenue}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer Pricing & CTA */}
                <div className="p-4 pt-2 border-t border-white/10 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-zinc-400 block">Pass From</span>
                    <span className="text-base font-extrabold text-white">₹{lowestPrice}</span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenDetail(event);
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-zinc-200 text-black text-xs font-bold transition-all flex items-center gap-1 shadow"
                  >
                    <span>View Pass</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Event Details Modal */}
      <EventDetailModal
        event={selectedEventForModal}
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        onBookPass={onBookPass}
      />
    </div>
  );
};

