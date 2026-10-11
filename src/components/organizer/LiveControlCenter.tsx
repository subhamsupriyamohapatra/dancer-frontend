import React, { useState } from 'react';
import {
  Radio,
  Clock,
  Users,
  Trophy,
  AlertTriangle,
  Bell,
  Megaphone,
  CheckCircle2,
  Lock,
  Play,
  Pause,
  RefreshCw,
  Send,
  X,
  Volume2,
} from 'lucide-react';
import { OrganizerEventRecord } from '../../types/organizer';

interface LiveControlCenterProps {
  event: OrganizerEventRecord;
  onClose: () => void;
  onUpdateEvent: (updatedEvent: OrganizerEventRecord) => void;
  onOpenJudgePortal: () => void;
  onOpenMCPortal: () => void;
}

export const LiveControlCenter: React.FC<LiveControlCenterProps> = ({
  event,
  onClose,
  onUpdateEvent,
  onOpenJudgePortal,
  onOpenMCPortal,
}) => {
  const [announcementText, setAnnouncementText] = useState('');
  const [announcements, setAnnouncements] = useState<string[]>(event.announcements || []);
  const [isLiveAlertSent, setIsLiveAlertSent] = useState(false);

  const handleSendAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!announcementText.trim()) return;

    const newAnn = announcementText.trim();
    const updated = [newAnn, ...announcements];
    setAnnouncements(updated);
    onUpdateEvent({ ...event, announcements: updated });
    setAnnouncementText('');
    setIsLiveAlertSent(true);
    setTimeout(() => setIsLiveAlertSent(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-lg overflow-y-auto">
      <div className="bg-[#121215] border-2 border-rose-500/50 rounded-3xl w-full max-w-6xl max-h-[94vh] flex flex-col shadow-[0_0_50px_rgba(244,63,94,0.2)] overflow-hidden my-4">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#27272a] bg-[#18181b]/90">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-500/20 border border-rose-500 text-rose-500 flex items-center justify-center">
              <Radio className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-widest text-rose-500">
                  LIVE EVENT WAR-ROOM & COMMAND CENTER
                </span>
                <span className="w-2 h-2 rounded-full bg-[#22c55e] animate-ping" />
              </div>
              <h2 className="text-xl font-black text-white">{event.title}</h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onOpenJudgePortal}
              className="px-3.5 py-1.5 rounded-xl bg-[#27272a] hover:bg-[#3f3f46] text-white text-xs font-bold"
            >
              Judge Pad
            </button>
            <button
              onClick={onOpenMCPortal}
              className="px-3.5 py-1.5 rounded-xl bg-[#27272a] hover:bg-[#3f3f46] text-white text-xs font-bold"
            >
              MC Screen
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-2xl bg-[#27272a] hover:bg-[#3f3f46] text-[#a1a1aa] hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Command Center Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Top Live Pulse Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-[#18181b] border border-[#27272a] space-y-1">
              <span className="text-xs text-[#71717a] font-bold">CURRENT SESSION</span>
              <p className="text-sm sm:text-base font-black text-white">Heat 1: Solo Hip-Hop</p>
              <span className="text-xs text-[#22c55e] font-semibold">On Schedule (0 mins delay)</span>
            </div>

            <div className="p-4 rounded-2xl bg-[#18181b] border border-[#27272a] space-y-1">
              <span className="text-xs text-[#71717a] font-bold">GATE CHECK-INS</span>
              <p className="text-sm sm:text-base font-black text-white">
                {event.registeredCount || 142} / {event.capacity}
              </p>
              <span className="text-xs text-[#3b82f6] font-semibold">78% Venue Capacity</span>
            </div>

            <div className="p-4 rounded-2xl bg-[#18181b] border border-[#27272a] space-y-1">
              <span className="text-xs text-[#71717a] font-bold">JUDGES ONLINE</span>
              <p className="text-sm sm:text-base font-black text-white">3 of 3 Connected</p>
              <span className="text-xs text-[#22c55e] font-semibold">Latency &lt; 20ms</span>
            </div>

            <div className="p-4 rounded-2xl bg-[#18181b] border border-[#27272a] space-y-1">
              <span className="text-xs text-[#71717a] font-bold">NEXT UP ON STAGE</span>
              <p className="text-sm sm:text-base font-black text-white">#102 Kabir & Rhea Duo</p>
              <span className="text-xs text-amber-400 font-semibold">In Green Room B</span>
            </div>
          </div>

          {/* Active Live Operations Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Live On-Stage Box */}
            <div className="md:col-span-2 p-5 rounded-3xl bg-[#18181b] border border-[#27272a] space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <Play className="w-4 h-4 text-[#eab308]" />
                  <span>Real-Time Stage Operations</span>
                </h3>
                <span className="px-2.5 py-1 rounded-full text-xs font-black uppercase bg-[#22c55e]/20 text-[#22c55e]">
                  Active Performance
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-[#202024] border border-[#27272a] flex items-center justify-between">
                <div>
                  <span className="text-xs font-mono text-[#eab308] uppercase font-bold">
                    Now Performing (Bib #101)
                  </span>
                  <h4 className="text-lg font-black text-white">Aryan "Viper" Shetty</h4>
                  <p className="text-xs text-[#a1a1aa]">Desi Hopperz Crew • Solo Hip-Hop Pro</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => alert('Dispatched cue: Calling Next Performer to Wings Stage Left')}
                    className="px-3 py-1.5 rounded-xl bg-[#27272a] hover:bg-[#3f3f46] text-white text-xs font-bold"
                  >
                    Call Next to Wings
                  </button>
                  <button
                    onClick={() => alert('Score finalized and synced across display screens')}
                    className="px-4 py-1.5 rounded-xl bg-[#eab308] text-black text-xs font-black"
                  >
                    Lock & Next
                  </button>
                </div>
              </div>

              {/* Fast Emergency Broadcast Form */}
              <form onSubmit={handleSendAnnouncement} className="space-y-2 pt-2">
                <label className="text-xs font-bold text-[#d4d4d8] flex items-center gap-2">
                  <Megaphone className="w-4 h-4 text-rose-400" />
                  <span>Instant War-Room Announcement Dispatch</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Broadcast urgent alert to MC, Judge Tablets, and Attendee screens..."
                    value={announcementText}
                    onChange={(e) => setAnnouncementText(e.target.value)}
                    className="flex-1 px-4 py-2.5 bg-[#141417] border border-[#27272a] focus:border-rose-500 rounded-2xl text-xs text-white outline-none"
                  />
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-black flex items-center gap-1.5 shadow-lg"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Broadcast</span>
                  </button>
                </div>
                {isLiveAlertSent && (
                  <p className="text-xs text-[#22c55e] font-bold">
                    ✓ Announcement broadcasted instantly to all stage and portal clients!
                  </p>
                )}
              </form>
            </div>

            {/* Broadcast History & System Status */}
            <div className="p-5 rounded-3xl bg-[#18181b] border border-[#27272a] space-y-4">
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <Bell className="w-4 h-4 text-amber-400" />
                <span>Live Feed & Announcements</span>
              </h3>

              <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
                {announcements.map((ann, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-2xl bg-[#202024] border border-[#27272a] text-xs text-[#d4d4d8] space-y-1"
                  >
                    <span className="text-xs text-[#71717a] font-mono">Broadcast #{idx + 1}</span>
                    <p className="leading-snug">{ann}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

