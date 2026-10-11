import React, { useState } from 'react';
import {
  Shield,
  Star,
  Award,
  Calendar,
  CheckCircle2,
  Plus,
  Mail,
  Search,
} from 'lucide-react';
import { OrganizerJudgeRecord } from '../../types/organizer';
import { ORGANIZER_JUDGES_DATA } from '../../data/organizerData';

export const JudgeDirectoryView: React.FC = () => {
  const [judges, setJudges] = useState<OrganizerJudgeRecord[]>(ORGANIZER_JUDGES_DATA);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredJudges = judges.filter(
    (j) =>
      j.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      j.danceOneId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (j.styles || []).some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-3xl bg-[#18181b] border border-[#27272a]">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-black uppercase tracking-wider bg-[#eab308]/20 text-[#eab308]">
              OFFICIAL JUDGE DIRECTORY & ROSTER
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
            Verified Adjudicators & Scrutineers
          </h2>
          <p className="text-xs text-[#a1a1aa]">
            Vetted world-class judges, category assignments, past judging track record, and verified DanceOne adjudicator IDs.
          </p>
        </div>

        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-[#71717a]" />
          <input
            type="text"
            placeholder="Search style, name, ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[#27272a] border border-[#3f3f46] rounded-2xl text-xs text-white outline-none"
          />
        </div>
      </div>

      {/* Judges Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredJudges.map((judge) => (
          <div
            key={judge.id}
            className="p-5 rounded-3xl bg-[#18181b] border border-[#27272a] space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center gap-3.5">
                <img
                  src={judge.avatar}
                  alt={judge.name}
                  className="w-14 h-14 rounded-2xl object-cover border-2 border-[#eab308]/40 shadow-md"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-base font-black text-white">{judge.name}</h3>
                    <CheckCircle2 className="w-4 h-4 text-[#22c55e]" />
                  </div>
                  <span className="text-xs font-mono text-[#eab308] block">{judge.danceOneId}</span>
                  <span className="text-xs text-[#a1a1aa]">{judge.cityCountry}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5 pt-1">
                {(judge.styles || []).map((s, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#27272a] text-[#d4d4d8]"
                  >
                    {s}
                  </span>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#27272a] text-xs">
                <div className="p-2.5 rounded-xl bg-[#202024]">
                  <span className="text-xs text-[#71717a] block">Events Judged</span>
                  <span className="text-sm font-black text-white">{judge.eventsJudgedCount} Events</span>
                </div>
                <div className="p-2.5 rounded-xl bg-[#202024]">
                  <span className="text-xs text-[#71717a] block">Organizer Rating</span>
                  <span className="text-sm font-black text-[#eab308] flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-current" /> {judge.rating} / 5.0
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => alert(`Assigned ${judge.name} to upcoming championship category!`)}
              className="w-full py-2 bg-[#27272a] hover:bg-[#3f3f46] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2"
            >
              <Shield className="w-4 h-4 text-[#eab308]" />
              <span>Assign to Event Category</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

