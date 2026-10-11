import React, { useState } from 'react';
import {
  Users,
  Search,
  Filter,
  CheckCircle2,
  Lock,
  Unlock,
  Award,
  Sparkles,
  Download,
  Eye,
  EyeOff,
  UserCheck,
  Shield,
  FileSpreadsheet,
} from 'lucide-react';
import { OrganizerEventRecord, CompetitionParticipant, DancerResultPublishPrivacy } from '../../types/organizer';

interface ParticipantManagementViewProps {
  events: OrganizerEventRecord[];
  onUpdateEvent: (updatedEvent: OrganizerEventRecord) => void;
}

export const ParticipantManagementView: React.FC<ParticipantManagementViewProps> = ({
  events,
  onUpdateEvent,
}) => {
  const [selectedEventId, setSelectedEventId] = useState<string>(events[0]?.id || 'org-ev-1');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPrivacy, setFilterPrivacy] = useState<string>('all');

  const currentEvent = events.find((e) => e.id === selectedEventId) || events[0];
  const participants = currentEvent?.participants || [];

  const filteredParticipants = participants.filter((p) => {
    const matchSearch =
      !searchQuery ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.danceOneId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.bibNumber.toString().includes(searchQuery);

    const matchPrivacy = filterPrivacy === 'all' || p.privacy === filterPrivacy;
    return matchSearch && matchPrivacy;
  });

  const handleUpdatePrivacy = (pId: string, privacy: DancerResultPublishPrivacy) => {
    if (!currentEvent) return;
    const updated = participants.map((p) => (p.id === pId ? { ...p, privacy } : p));
    onUpdateEvent({ ...currentEvent, participants: updated });
  };

  const handleBatchIssueCerts = () => {
    if (!currentEvent) return;
    const updated = participants.map((p) => ({ ...p, certificateIssued: true }));
    onUpdateEvent({ ...currentEvent, participants: updated });
    alert('Issued verified digital certificates to all filtered participants!');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-3xl bg-[#18181b] border border-[#27272a]">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white">Participants & Dancer Profiles</h2>
          <p className="text-xs text-[#a1a1aa]">
            Universal DanceOne athlete profiles, result privacy controls, and digital certificate issuances.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={selectedEventId}
            onChange={(e) => setSelectedEventId(e.target.value)}
            className="px-3.5 py-2 bg-[#27272a] border border-[#3f3f46] rounded-2xl text-xs font-bold text-white outline-none"
          >
            {events.map((ev) => (
              <option key={ev.id} value={ev.id}>
                {ev.title}
              </option>
            ))}
          </select>

          <button
            onClick={handleBatchIssueCerts}
            className="px-4 py-2 bg-[#eab308] hover:bg-[#facc15] text-black text-xs font-black rounded-2xl flex items-center gap-2 shadow-md whitespace-nowrap"
          >
            <Award className="w-4 h-4" />
            <span>Issue Certificates</span>
          </button>
        </div>
      </div>

      {/* Search & Filter Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-[#18181b]/60 border border-[#27272a]">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-[#71717a]" />
          <input
            type="text"
            placeholder="Search by Name, Bib #, or DanceOne ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[#18181b] border border-[#27272a] rounded-2xl text-xs text-white outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-[#71717a] font-bold">Privacy Filter:</span>
          <select
            value={filterPrivacy}
            onChange={(e) => setFilterPrivacy(e.target.value)}
            className="px-3 py-1.5 bg-[#27272a] border border-[#3f3f46] rounded-xl text-xs font-bold text-white outline-none"
          >
            <option value="all">All Privacy States</option>
            <option value="public">Public on DanceOne</option>
            <option value="published_to_dancer">Dancer Profile Only</option>
            <option value="organizer_only">Organizer Only</option>
            <option value="private">Private</option>
          </select>
        </div>
      </div>

      {/* Participants Table */}
      <div className="rounded-3xl border border-[#27272a] overflow-hidden bg-[#18181b]">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#202024] text-[#a1a1aa] font-bold uppercase text-xs tracking-wider border-b border-[#27272a]">
            <tr>
              <th className="py-3.5 px-4">Bib #</th>
              <th className="py-3.5 px-4">Dancer & DanceOne ID</th>
              <th className="py-3.5 px-4">Category & Format</th>
              <th className="py-3.5 px-4">Score & Rank</th>
              <th className="py-3.5 px-4">Result Privacy</th>
              <th className="py-3.5 px-4">Certificate</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#27272a]">
            {filteredParticipants.map((p) => (
              <tr key={p.id} className="hover:bg-[#202024]/60 transition-colors">
                <td className="py-3.5 px-4 font-mono font-bold text-[#eab308]">#{p.bibNumber}</td>
                <td className="py-3.5 px-4">
                  <div>
                    <span className="font-bold text-white block">{p.name}</span>
                    <span className="text-xs text-[#71717a] font-mono">
                      {p.danceOneId} • {p.crewOrStudio || 'Soloist'}
                    </span>
                  </div>
                </td>
                <td className="py-3.5 px-4">
                  <span className="text-white font-bold block">{p.category}</span>
                  <span className="text-xs text-[#a1a1aa]">{p.format}</span>
                </td>
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-black text-[#eab308]">
                      {p.weightedTotal > 0 ? p.weightedTotal.toFixed(2) : '—'}
                    </span>
                    {p.rank && (
                      <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-[#27272a] text-[#a1a1aa]">
                        Rank #{p.rank}
                      </span>
                    )}
                  </div>
                </td>
                <td className="py-3.5 px-4">
                  <select
                    value={p.privacy}
                    onChange={(e) =>
                      handleUpdatePrivacy(p.id, e.target.value as DancerResultPublishPrivacy)
                    }
                    className="px-2.5 py-1 bg-[#27272a] border border-[#3f3f46] rounded-xl text-xs font-bold text-white outline-none"
                  >
                    <option value="public">Public</option>
                    <option value="published_to_dancer">Dancer Only</option>
                    <option value="organizer_only">Organizer Only</option>
                    <option value="private">Private</option>
                  </select>
                </td>
                <td className="py-3.5 px-4">
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1 ${
                      p.certificateIssued
                        ? 'bg-[#22c55e]/20 text-[#22c55e] border border-[#22c55e]/40'
                        : 'bg-zinc-800 text-zinc-500'
                    }`}
                  >
                    <Award className="w-3 h-3" />
                    {p.certificateIssued ? 'Issued' : 'Pending'}
                  </span>
                </td>
                <td className="py-3.5 px-4 text-right">
                  <button
                    onClick={() => {
                      const updated = participants.map((item) =>
                        item.id === p.id ? { ...item, certificateIssued: true } : item
                      );
                      onUpdateEvent({ ...currentEvent, participants: updated });
                      alert(`Certificate issued to ${p.name}`);
                    }}
                    className="px-3 py-1 bg-[#27272a] hover:bg-[#3f3f46] text-[#eab308] text-xs font-bold rounded-xl"
                  >
                    {p.certificateIssued ? 'Re-Issue' : 'Issue'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

