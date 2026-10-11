import React, { useState } from 'react';
import {
  Trophy,
  Calendar,
  Users,
  DollarSign,
  Plus,
  Shield,
  MoreHorizontal,
  MapPin,
  Clock,
  ArrowRight,
  Sparkles,
  Search,
  Copy,
  ChevronDown,
  Megaphone,
} from 'lucide-react';
import { ScreenType } from '../types';
import {
  OrganizerEventRecord,
} from '../types/organizer';

// Subcomponents
import { CreateEventModal } from './organizer/CreateEventModal';
import { EventManagementWorkspace } from './organizer/EventManagementWorkspace';
import { OrganizerParticipantsView } from './organizer/OrganizerParticipantsView';
import { OrganizerFinanceView } from './organizer/OrganizerFinanceView';
import { OrganizerMoreView } from './organizer/OrganizerMoreView';
import { JudgePortalModal } from './organizer/JudgePortalModal';
import { MCPortalModal } from './organizer/MCPortalModal';
import { CommunicationBroadcastModal } from './organizer/CommunicationBroadcastModal';

interface OrganizerDashboardScreenProps {
  onNavigate?: (screen: ScreenType) => void;
  initialTab?: 'events' | 'participants' | 'finance' | 'more';
  isCreateModalOpen?: boolean;
  onCloseCreateModal?: () => void;
  onOpenCreateModal?: () => void;
  platformEvents?: OrganizerEventRecord[];
  onPublishEvent?: (event: OrganizerEventRecord) => void;
  onUpdatePlatformEvent?: (event: OrganizerEventRecord) => void;
}

export const OrganizerDashboardScreen: React.FC<OrganizerDashboardScreenProps> = ({
  onNavigate,
  initialTab,
  isCreateModalOpen,
  onCloseCreateModal,
  onOpenCreateModal,
  platformEvents = [],
  onPublishEvent,
  onUpdatePlatformEvent,
}) => {
  // Main Top-level Navigation: Focused on My Events, Guests, Finances, Organizer
  const [mainTab, setMainTab] = useState<'events' | 'participants' | 'finance' | 'more'>(
    initialTab || 'events'
  );

  React.useEffect(() => {
    if (initialTab) {
      setMainTab(initialTab);
    }
  }, [initialTab]);

  // Events State: Initialized with platform events
  const [events, setEvents] = useState<OrganizerEventRecord[]>(platformEvents);

  React.useEffect(() => {
    if (platformEvents && platformEvents.length > 0) {
      setEvents(platformEvents);
    }
  }, [platformEvents]);

  const [selectedEventId, setSelectedEventId] = useState<string>(
    platformEvents.length > 0 ? platformEvents[0].id : ''
  );
  const [eventViewMode, setEventViewMode] = useState<'blank_or_list' | 'workspace'>('blank_or_list');

  // Internal Create Modal State (fallback if not controlled from parent)
  const [internalCreateModal, setInternalCreateModal] = useState(false);
  const showCreateModal = isCreateModalOpen !== undefined ? isCreateModalOpen : internalCreateModal;
  const handleOpenCreateModal = () => {
    if (onOpenCreateModal) onOpenCreateModal();
    else setInternalCreateModal(true);
  };
  const handleCloseCreateModal = () => {
    if (onCloseCreateModal) onCloseCreateModal();
    else setInternalCreateModal(false);
  };

  // Additional Modals
  const [showJudgePortal, setShowJudgePortal] = useState(false);
  const [showMCPortal, setShowMCPortal] = useState(false);
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);

  // Current selected active event
  const activeEvent = events.find((e) => e.id === selectedEventId) || null;

  // Handlers
  const handleUpdateEvent = (updated: OrganizerEventRecord) => {
    setEvents((prev) => prev.map((ev) => (ev.id === updated.id ? updated : ev)));
    if (onUpdatePlatformEvent) {
      onUpdatePlatformEvent(updated);
    }
  };

  const handleCreateEvent = (newEvent: OrganizerEventRecord) => {
    const publishedEvent: OrganizerEventRecord = {
      ...newEvent,
      status: 'published',
    };
    setEvents([publishedEvent, ...events]);
    if (onPublishEvent) {
      onPublishEvent(publishedEvent);
    }
    setSelectedEventId(publishedEvent.id);
    setMainTab('events');
    setEventViewMode('workspace');
    handleCloseCreateModal();
  };

  const handleDuplicateEvent = (e: React.MouseEvent, evToDuplicate: OrganizerEventRecord) => {
    e.stopPropagation();
    const duplicated: OrganizerEventRecord = {
      ...evToDuplicate,
      id: `evt-${Date.now()}`,
      title: `${evToDuplicate.title} (Copy)`,
      status: 'draft',
      registeredCount: 0,
      revenue: 0,
    };
    setEvents([duplicated, ...events]);
    setSelectedEventId(duplicated.id);
    setEventViewMode('workspace');
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-3.5 sm:px-6 py-4 space-y-4 pb-20 text-[#fafafa]">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#27272a] pb-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#eab308] text-black font-black text-sm flex items-center justify-center shadow-md">
            D1
          </div>
          <div>
            <h1 className="text-base sm:text-xl font-bold text-white tracking-tight leading-snug">
              Organizer Hub
            </h1>
            <p className="text-xs text-[#a1a1aa] mt-0.5">
              Workshops, Competitions, Shows, Battles, Masterclasses, Camps & Gatherings
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {events.length > 0 && (
            <button
              onClick={() => setShowBroadcastModal(true)}
              className="px-3.5 py-2 rounded-xl bg-[#18181b] hover:bg-[#27272a] text-white text-xs font-medium flex items-center gap-1.5 border border-[#27272a] transition-all"
              title="Broadcast announcement"
            >
              <Megaphone className="w-3.5 h-3.5 text-rose-400" />
              <span>Broadcast</span>
            </button>
          )}

          <button
            onClick={handleOpenCreateModal}
            className="px-4 py-2 rounded-xl bg-[#eab308] hover:bg-[#facc15] text-black text-xs sm:text-sm font-bold flex items-center gap-1.5 shadow-md transition-all active:scale-95"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Create Event</span>
          </button>
        </div>
      </div>

      {/* ======================================================================= */}
      {/* EVENTS TAB CONTENT */}
      {/* ======================================================================= */}
      {mainTab === 'events' && (
        <div className="space-y-4">
          {/* If an active event is opened in workspace view */}
          {eventViewMode === 'workspace' && activeEvent ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between bg-[#141417] p-3 rounded-xl border border-[#27272a]">
                <button
                  onClick={() => setEventViewMode('blank_or_list')}
                  className="text-xs sm:text-sm text-[#eab308] hover:underline font-bold flex items-center gap-1"
                >
                  ← Back to Events List
                </button>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-[#a1a1aa] truncate max-w-xs">
                    Managing: <strong className="text-white">{activeEvent.title}</strong>
                  </span>
                  <button
                    onClick={handleOpenCreateModal}
                    className="px-3 py-1 bg-[#eab308] text-black text-xs font-bold rounded-lg flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> New Event
                  </button>
                </div>
              </div>
              <EventManagementWorkspace
                event={activeEvent}
                onUpdateEvent={handleUpdateEvent}
                onBackToList={() => setEventViewMode('blank_or_list')}
              />
            </div>
          ) : events.length === 0 ? (
            /* BLANK EVENTS PAGE: Kept clean and blank with just Create Event */
            <div className="py-24 text-center bg-[#141417]/50 border border-dashed border-[#27272a] rounded-2xl p-6 flex flex-col items-center justify-center space-y-4 min-h-[340px]">
              <div className="w-12 h-12 rounded-2xl bg-[#eab308]/10 text-[#eab308] flex items-center justify-center border border-[#eab308]/20">
                <Plus className="w-6 h-6 stroke-[2.5]" />
              </div>
              <div className="space-y-1.5 max-w-sm">
                <h3 className="text-base font-bold text-white">No Events Created Yet</h3>
                <p className="text-xs text-[#71717a] leading-relaxed">
                  Start by creating your first workshop, competition, battle, show, camp or gathering.
                </p>
              </div>
              <button
                onClick={handleOpenCreateModal}
                className="px-5 py-2.5 bg-[#eab308] hover:bg-[#facc15] text-black font-bold text-sm rounded-xl inline-flex items-center gap-2 shadow-md transition-all active:scale-95"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>Create Event</span>
              </button>
            </div>
          ) : (
            /* List of Created Events with Guests, Tickets Sold, and Revenue */
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs sm:text-sm text-[#a1a1aa] px-1 font-medium">
                <span>Created Events ({events.length})</span>
                <button
                  onClick={handleOpenCreateModal}
                  className="text-[#eab308] font-bold hover:underline flex items-center gap-1 text-xs sm:text-sm"
                >
                  <Plus className="w-4 h-4" /> Create Another Event
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
                {events.map((ev) => {
                  const guestsCount = ev.registeredCount || (ev.participants ? ev.participants.length : 0);
                  const ticketsSoldCount = ev.ticketPricing?.reduce((acc, t) => acc + (t.sold || 0), 0) || guestsCount;
                  const revenueAmount = ev.revenue || 0;

                  return (
                    <div
                      key={ev.id}
                      onClick={() => {
                        setSelectedEventId(ev.id);
                        setEventViewMode('workspace');
                      }}
                      className="p-4 sm:p-5 rounded-2xl bg-[#0c0d12] border border-white/[0.08] hover:border-white/30 cursor-pointer transition-all flex flex-col justify-between group shadow-md"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-mono font-bold uppercase px-2 py-0.5 rounded bg-[#eab308]/10 text-[#eab308] border border-[#eab308]/20">
                            {ev.type.replace(/_/g, ' ')}
                          </span>
                          <span className="text-xs font-mono uppercase px-2 py-0.5 bg-white/[0.06] text-[#a1a1aa] rounded">
                            {ev.status}
                          </span>
                        </div>

                        <div>
                          <h4 className="text-base font-bold text-white group-hover:text-[#38bdf8] transition-colors line-clamp-1 leading-snug">
                            {ev.title}
                          </h4>
                          <p className="text-xs text-[#71717a] flex items-center gap-1.5 mt-1 truncate">
                            <span>{ev.startDate}</span>
                            {ev.venue && <span>· {ev.venue}</span>}
                          </p>
                        </div>

                        {/* Three Primary Event Metrics: Guests, Tickets Sold, Revenue */}
                        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/[0.06] text-center">
                          <div className="p-2 rounded-xl bg-white/[0.03]">
                            <span className="text-xs font-mono text-[#71717a] block uppercase font-medium">Guests</span>
                            <span className="text-xs sm:text-sm font-bold text-white block mt-0.5">
                              {guestsCount}
                              <span className="text-xs text-[#71717a]">/{ev.capacity || 100}</span>
                            </span>
                          </div>

                          <div className="p-2 rounded-xl bg-white/[0.03]">
                            <span className="text-xs font-mono text-[#71717a] block uppercase font-medium">Sold</span>
                            <span className="text-xs sm:text-sm font-bold text-cyan-400 block mt-0.5">
                              {ticketsSoldCount}
                            </span>
                          </div>

                          <div className="p-2 rounded-xl bg-white/[0.03]">
                            <span className="text-xs font-mono text-[#71717a] block uppercase font-medium">Rev</span>
                            <span className="text-xs sm:text-sm font-bold text-[#10b981] block truncate mt-0.5">
                              ₹{revenueAmount > 1000 ? `${(revenueAmount/1000).toFixed(0)}k` : revenueAmount}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="pt-3 mt-3 border-t border-white/[0.06] flex items-center justify-between text-xs font-mono">
                        <button
                          onClick={(e) => handleDuplicateEvent(e, ev)}
                          className="px-2 py-1 rounded text-[#71717a] hover:text-white flex items-center gap-1 transition-colors"
                          title="Duplicate"
                        >
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy</span>
                        </button>

                        <span className="text-[#eab308] group-hover:underline font-bold text-xs">
                          Manage →
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ======================================================================= */}
      {/* GUESTS TAB CONTENT */}
      {/* ======================================================================= */}
      {mainTab === 'participants' && (
        <OrganizerParticipantsView events={events} onUpdateEvent={handleUpdateEvent} />
      )}

      {/* ======================================================================= */}
      {/* FINANCES TAB CONTENT */}
      {/* ======================================================================= */}
      {mainTab === 'finance' && <OrganizerFinanceView events={events} />}

      {/* ======================================================================= */}
      {/* ORGANIZER TAB CONTENT */}
      {/* ======================================================================= */}
      {mainTab === 'more' && (
        <OrganizerMoreView events={events} onUpdateEvent={handleUpdateEvent} />
      )}

      {/* Minimalist Create Event Modal */}
      {showCreateModal && (
        <CreateEventModal
          isOpen={showCreateModal}
          onClose={handleCloseCreateModal}
          onCreateEvent={handleCreateEvent}
        />
      )}

      {/* Sub-portals */}
      {showJudgePortal && activeEvent && (
        <JudgePortalModal
          event={activeEvent}
          onClose={() => setShowJudgePortal(false)}
          onUpdateEvent={handleUpdateEvent}
        />
      )}

      {showMCPortal && activeEvent && (
        <MCPortalModal event={activeEvent} onClose={() => setShowMCPortal(false)} />
      )}

      {showBroadcastModal && activeEvent && (
        <CommunicationBroadcastModal
          event={activeEvent}
          onClose={() => setShowBroadcastModal(false)}
          onUpdateEvent={handleUpdateEvent}
        />
      )}
    </div>
  );
};

