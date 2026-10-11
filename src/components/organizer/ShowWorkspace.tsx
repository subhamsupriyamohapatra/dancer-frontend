import React, { useState } from 'react';
import {
  Film,
  Users,
  Ticket,
  Clock,
  Sparkles,
  Sliders,
  DollarSign,
  QrCode,
  CheckCircle2,
  AlertCircle,
  Plus,
  Tv,
  Music,
  Radio,
  Share2,
} from 'lucide-react';
import {
  OrganizerEventRecord,
  ShowPerformance,
  TicketCategory,
} from '../../types/organizer';

interface ShowWorkspaceProps {
  event: OrganizerEventRecord;
  onUpdateEvent: (updatedEvent: OrganizerEventRecord) => void;
  onOpenControlCenter: () => void;
}

export const ShowWorkspace: React.FC<ShowWorkspaceProps> = ({
  event,
  onUpdateEvent,
  onOpenControlCenter,
}) => {
  const [activeTab, setActiveTab] = useState<
    'running_order' | 'backstage_greenroom' | 'technical_cues' | 'audience_ticketing'
  >('running_order');

  const [selectedPerformance, setSelectedPerformance] = useState<ShowPerformance | null>(
    event.showPerformances?.[0] || null
  );

  const performances = event.showPerformances || [];
  const ticketCategories = event.ticketCategories || [];

  // Calculate ticketing stats
  const totalTicketsCapacity = ticketCategories.reduce((acc, t) => acc + t.totalCapacity, 0);
  const totalTicketsSold = ticketCategories.reduce((acc, t) => acc + t.soldCount, 0);
  const totalTicketRevenue = ticketCategories.reduce((acc, t) => acc + t.soldCount * t.price, 0);

  // Update Performance Status (e.g. In Green Room -> On Deck -> Performing -> Completed)
  const handleUpdatePerformanceStatus = (
    id: string,
    status: 'standby' | 'in_green_room' | 'on_deck' | 'performing' | 'completed'
  ) => {
    const updated = performances.map((p) => (p.id === id ? { ...p, status } : p));
    onUpdateEvent({ ...event, showPerformances: updated });
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-5 rounded-3xl bg-[#18181b] border border-[#27272a] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-black uppercase tracking-wider bg-purple-500/20 text-purple-400 border border-purple-500/40">
              SHOWCASE PRODUCTION & RUNNING ORDER
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e] animate-pulse" />
            <span className="text-xs font-bold text-[#22c55e]">
              Stage Manager Console Active
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">{event.title}</h2>
          <p className="text-xs text-[#a1a1aa]">
            Cue sheets, lighting/sound automation, green room allocations, and tiered audience ticketing.
          </p>
        </div>

        <button
          onClick={onOpenControlCenter}
          className="px-5 py-2.5 rounded-2xl bg-[#eab308] hover:bg-[#facc15] text-black text-xs font-black shadow-lg flex items-center gap-2 transition-all self-start sm:self-auto"
        >
          <Radio className="w-4 h-4 animate-pulse" />
          <span>Stage Control Center</span>
        </button>
      </div>

      {/* Sub Tabs */}
      <div className="flex items-center gap-2 bg-[#18181b] p-1.5 rounded-2xl border border-[#27272a] overflow-x-auto no-scrollbar">
        {[
          { id: 'running_order', label: 'Stage Running Order & Acts', icon: Film },
          { id: 'backstage_greenroom', label: 'Green Room & Backstage Hub', icon: Users },
          { id: 'technical_cues', label: 'Lighting & Sound Cues', icon: Sliders },
          { id: 'audience_ticketing', label: 'Audience Ticketing & Seating', icon: Ticket },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-[#eab308] text-black font-black shadow-md'
                  : 'text-[#a1a1aa] hover:text-white hover:bg-[#27272a]'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: STAGE RUNNING ORDER */}
      {activeTab === 'running_order' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-black text-white">Live Running Order Timetable</h3>
            <span className="text-xs text-[#a1a1aa]">{performances.length} Scheduled Acts</span>
          </div>

          <div className="space-y-3">
            {performances.map((perf) => (
              <div
                key={perf.id}
                className={`p-4 rounded-3xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  perf.status === 'performing'
                    ? 'bg-purple-950/30 border-purple-500/80 shadow-[0_0_20px_rgba(168,85,247,0.2)]'
                    : 'bg-[#18181b] border-[#27272a]'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-2xl bg-[#27272a] text-white font-black text-sm flex items-center justify-center flex-shrink-0">
                    #{perf.actNumber}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-black text-white">{perf.title}</span>
                      <span className="text-xs text-[#eab308] font-bold">({perf.danceStyle})</span>
                    </div>
                    <p className="text-xs text-[#a1a1aa]">
                      Choreo: <span className="text-white">{perf.choreographer}</span> • Ensemble:{' '}
                      <span className="text-white">{perf.artistOrCrew}</span> ({perf.dancersCount} Dancers)
                    </p>
                    <p className="text-xs text-[#71717a] mt-1">
                      Time: {perf.scheduledTime} ({perf.durationMinutes} mins) • Room: {perf.greenRoomAssigned}
                    </p>
                  </div>
                </div>

                {/* Status Switcher */}
                <div className="flex items-center gap-2 self-end sm:self-center">
                  <select
                    value={perf.status}
                    onChange={(e) =>
                      handleUpdatePerformanceStatus(perf.id, e.target.value as any)
                    }
                    className={`px-3 py-1.5 rounded-xl text-xs font-black outline-none border ${
                      perf.status === 'performing'
                        ? 'bg-rose-500 text-white border-rose-400'
                        : perf.status === 'on_deck'
                        ? 'bg-amber-500 text-black border-amber-400'
                        : perf.status === 'completed'
                        ? 'bg-[#22c55e]/20 text-[#22c55e] border-[#22c55e]/40'
                        : 'bg-[#27272a] text-[#a1a1aa] border-[#3f3f46]'
                    }`}
                  >
                    <option value="standby">Standby</option>
                    <option value="in_green_room">In Green Room</option>
                    <option value="on_deck">On Deck (Wings)</option>
                    <option value="performing">Performing On Stage</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: GREEN ROOM & BACKSTAGE HUB */}
      {activeTab === 'backstage_greenroom' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {['Green Room A (Main Troupe)', 'Green Room B (Soloists)', 'Green Room C (Company)'].map(
            (room, idx) => (
              <div key={idx} className="p-5 rounded-3xl bg-[#18181b] border border-[#27272a] space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-black text-white">{room}</h4>
                  <span className="w-2 h-2 rounded-full bg-[#22c55e]" />
                </div>
                <div className="space-y-2 text-xs">
                  {performances
                    .filter((p) => p.greenRoomAssigned.includes(room.split(' ')[2]))
                    .map((p) => (
                      <div
                        key={p.id}
                        className="p-3 rounded-2xl bg-[#202024] border border-[#27272a] space-y-1"
                      >
                        <span className="font-bold text-white block">{p.artistOrCrew}</span>
                        <span className="text-xs text-[#a1a1aa] block">{p.title}</span>
                        <span className="text-xs text-[#eab308] font-mono">
                          Call Time: {p.scheduledTime}
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            )
          )}
        </div>
      )}

      {/* TAB 3: TECHNICAL CUES */}
      {activeTab === 'technical_cues' && (
        <div className="space-y-4">
          <div className="p-5 rounded-3xl bg-[#18181b] border border-[#27272a] space-y-4">
            <h3 className="text-base font-black text-white">Lighting & Audio Automation Cue Sheets</h3>

            <div className="space-y-3">
              {performances.map((perf) => (
                <div
                  key={perf.id}
                  className="p-4 rounded-2xl bg-[#202024] border border-[#27272a] space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-black text-white text-sm">
                      Act #{perf.actNumber}: {perf.title} ({perf.artistOrCrew})
                    </span>
                    <span className="text-xs text-[#eab308] font-mono">{perf.musicTrack}</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    <div className="p-3 rounded-xl bg-[#18181b] border border-[#27272a] space-y-1">
                      <span className="font-bold text-amber-400 block">💡 Lighting Cue:</span>
                      <p className="text-[#d4d4d8]">{perf.lightingCue}</p>
                    </div>

                    <div className="p-3 rounded-xl bg-[#18181b] border border-[#27272a] space-y-1">
                      <span className="font-bold text-cyan-400 block">🔊 Sound & FX Cue:</span>
                      <p className="text-[#d4d4d8]">{perf.soundCue}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: AUDIENCE TICKETING & SEATING */}
      {activeTab === 'audience_ticketing' && (
        <div className="space-y-6">
          {/* Ticketing KPI Overview */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-3xl bg-[#18181b] border border-[#27272a] space-y-1">
              <span className="text-xs text-[#a1a1aa]">Total Tickets Sold</span>
              <p className="text-xl sm:text-2xl font-black text-white">
                {totalTicketsSold} / {totalTicketsCapacity}
              </p>
              <span className="text-xs text-[#22c55e] font-bold">
                {Math.round((totalTicketsSold / (totalTicketsCapacity || 1)) * 100)}% Occupancy
              </span>
            </div>

            <div className="p-4 rounded-3xl bg-[#18181b] border border-[#27272a] space-y-1">
              <span className="text-xs text-[#a1a1aa]">Box Office Revenue</span>
              <p className="text-xl sm:text-2xl font-black text-[#eab308]">
                ₹{totalTicketRevenue.toLocaleString()}
              </p>
              <span className="text-xs text-[#eab308] font-bold">Verified via Gateway</span>
            </div>

            <div className="p-4 rounded-3xl bg-[#18181b] border border-[#27272a] space-y-1">
              <span className="text-xs text-[#a1a1aa]">Gate Scans Completed</span>
              <p className="text-xl sm:text-2xl font-black text-white">680 Checked In</p>
              <span className="text-xs text-[#3b82f6] font-bold">QR Fast Gate Active</span>
            </div>

            <div className="p-4 rounded-3xl bg-[#18181b] border border-[#27272a] space-y-1">
              <span className="text-xs text-[#a1a1aa]">Remaining Available</span>
              <p className="text-xl sm:text-2xl font-black text-white">
                {totalTicketsCapacity - totalTicketsSold} Spots
              </p>
              <span className="text-xs text-[#71717a] font-bold">At Box Office</span>
            </div>
          </div>

          {/* Tiered Ticket Categories */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {ticketCategories.map((cat) => (
              <div
                key={cat.id}
                className="p-5 rounded-3xl bg-[#18181b] border border-[#27272a] flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-base font-black text-white">{cat.name}</span>
                    <span className="text-base font-black text-[#eab308]">₹{cat.price}</span>
                  </div>
                  <p className="text-xs text-[#a1a1aa] mt-1">
                    Sold: {cat.soldCount} of {cat.totalCapacity} ({cat.reservedCount} Reserved)
                  </p>

                  {/* Progress Bar */}
                  <div className="w-full bg-[#27272a] h-2 rounded-full mt-3 overflow-hidden">
                    <div
                      className="bg-[#eab308] h-full rounded-full"
                      style={{ width: `${(cat.soldCount / cat.totalCapacity) * 100}%` }}
                    />
                  </div>

                  <div className="mt-4 space-y-1">
                    {cat.perks.map((p, i) => (
                      <span key={i} className="text-xs text-[#d4d4d8] block">
                        ✓ {p}
                      </span>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => alert(`Issued VIP Pass for ${cat.name}`)}
                  className="w-full py-2 bg-[#27272a] hover:bg-[#3f3f46] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2"
                >
                  <QrCode className="w-4 h-4 text-[#eab308]" />
                  <span>Issue Complimentary Pass</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

