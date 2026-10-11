import React from 'react';
import {
  Mic,
  Volume2,
  Clock,
  Flame,
  Award,
  Users,
  Sparkles,
  Radio,
  X,
  ChevronRight,
  Disc3,
} from 'lucide-react';
import { OrganizerEventRecord } from '../../types/organizer';

interface MCPortalModalProps {
  event: OrganizerEventRecord;
  onClose: () => void;
}

export const MCPortalModal: React.FC<MCPortalModalProps> = ({ event, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-lg overflow-y-auto">
      <div className="bg-[#121215] border-2 border-cyan-500/60 rounded-3xl w-full max-w-4xl max-h-[94vh] flex flex-col shadow-[0_0_50px_rgba(6,182,212,0.2)] overflow-hidden my-4">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#27272a] bg-[#18181b]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center border border-cyan-500/40">
              <Mic className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-black uppercase tracking-widest text-cyan-400">
                MC & STAGE HOST LIVE PROMPTER
              </span>
              <h2 className="text-lg font-black text-white">{event.title}</h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-2xl bg-[#27272a] hover:bg-[#3f3f46] text-[#a1a1aa] hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Active Callout Teleprompter Box */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-cyan-950/30 via-[#18181b] to-[#18181b] border-2 border-cyan-500/40 space-y-4">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full text-xs font-black uppercase bg-cyan-500 text-black">
                🔴 LIVE ON STAGE PROMPT
              </span>
              <span className="text-xs font-mono text-cyan-400">Session: Semi-Final 1v1</span>
            </div>

            <div className="space-y-3">
              <h3 className="text-2xl sm:text-3xl font-black text-white leading-tight">
                "Mumbai make some noise! In the Red Corner, repping Desi Hopperz, Bib #101 Aryan 'Viper' Shetty!"
              </h3>
              <p className="text-sm text-[#d4d4d8] leading-relaxed">
                Key Bio Points to mention:
                <br />
                • 2024 Red Bull BC One Cypher India Finalist
                <br />
                • Style: Threading, Power-moves, and signature Corkscrew freeze
                <br />
                • 5 Years rep in underground popping & breaking
              </p>
            </div>
          </div>

          {/* Versus Lineup Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-[#18181b] border border-rose-500/40 space-y-2">
              <span className="text-xs font-black text-rose-400 uppercase">🔴 Red Corner</span>
              <h4 className="text-base font-black text-white">Aryan "Viper" Shetty (#101)</h4>
              <p className="text-xs text-[#a1a1aa]">Desi Hopperz Crew • Mumbai</p>
              <div className="pt-2 text-xs text-[#71717a]">
                Round 1 Score: <span className="text-[#eab308] font-bold">9.04</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#18181b] border border-blue-500/40 space-y-2">
              <span className="text-xs font-black text-blue-400 uppercase">🔵 Blue Corner</span>
              <h4 className="text-base font-black text-white">Poppin Neil (#102)</h4>
              <p className="text-xs text-[#a1a1aa]">Freak Funk Crew • Pune</p>
              <div className="pt-2 text-xs text-[#71717a]">
                Round 1 Score: <span className="text-[#eab308] font-bold">8.92</span>
              </div>
            </div>
          </div>

          {/* Sponsor & Partner Readouts */}
          <div className="p-4 rounded-2xl bg-[#18181b] border border-[#27272a] space-y-2">
            <span className="text-xs font-bold text-[#eab308] uppercase tracking-wider block">
              ⭐ Mandatory Sponsor Shoutouts
            </span>
            <div className="space-y-1.5 text-xs text-[#d4d4d8]">
              <p className="bg-[#202024] p-2.5 rounded-xl">
                "Big love to <strong className="text-white">Red Bull India</strong> for fueling today's battles, and <strong className="text-white">Monster Energy</strong> for keeping the cyphers alive all night!"
              </p>
              <p className="bg-[#202024] p-2.5 rounded-xl">
                "Special shoutout to <strong className="text-white">DanceOne Ecosystem</strong> powering real-time scoreboards and instant dancer verification."
              </p>
            </div>
          </div>

          {/* Action Row */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              onClick={() => alert('Cue sent to DJ: Drop Round 2 Breakbeat!')}
              className="px-4 py-2 bg-[#27272a] hover:bg-[#3f3f46] text-white text-xs font-bold rounded-xl flex items-center gap-2"
            >
              <Disc3 className="w-4 h-4 text-[#eab308]" />
              <span>Signal DJ Drop</span>
            </button>
            <button
              onClick={() => alert('Stage lighting cue signaled to control board')}
              className="px-4 py-2 bg-cyan-500 text-black text-xs font-black rounded-xl"
            >
              Signal Spotlight Red Corner
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

