import React, { useState } from 'react';
import {
  Trophy,
  Shield,
  Users,
  Award,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  Sliders,
  History,
  Eye,
  EyeOff,
  Radio,
  Lock,
  Unlock,
  Sparkles,
  Download,
  Plus,
  Play,
  Volume2,
  Music,
  Share2,
  Printer,
  ChevronRight,
  Search,
} from 'lucide-react';
import {
  OrganizerEventRecord,
  CompetitionParticipant,
  ScoreAuditLog,
  DancerResultPublishPrivacy,
  ScorePublishPolicy,
} from '../../types/organizer';
import { ORGANIZER_JUDGES_DATA } from '../../data/organizerData';

interface CompetitionWorkspaceProps {
  event: OrganizerEventRecord;
  onUpdateEvent: (updatedEvent: OrganizerEventRecord) => void;
  onOpenJudgePortal: () => void;
  onOpenControlCenter: () => void;
}

export const CompetitionWorkspace: React.FC<CompetitionWorkspaceProps> = ({
  event,
  onUpdateEvent,
  onOpenJudgePortal,
  onOpenControlCenter,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<
    'participants' | 'live_scoring' | 'criteria' | 'rankings' | 'audit_trail'
  >('live_scoring');

  const [selectedCategory, setSelectedCategory] = useState(
    event.categories[0] || 'Solo Hip-Hop Pro'
  );
  const [selectedRound, setSelectedRound] = useState('Semi-Finals');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCertificateModal, setShowCertificateModal] = useState<CompetitionParticipant | null>(
    null
  );
  const [showAddParticipantModal, setShowAddParticipantModal] = useState(false);

  // New Participant Form
  const [newBib, setNewBib] = useState(105);
  const [newName, setNewName] = useState('');
  const [newCrew, setNewCrew] = useState('');
  const [newDanceOneId, setNewDanceOneId] = useState('DO-91823');
  const [newFormat, setNewFormat] = useState<'Solo' | 'Duo' | 'Group' | 'Crew'>('Solo');

  // Filtered Participants
  const participants = event.participants || [];
  const filteredParticipants = participants.filter((p) => {
    const matchCat = !selectedCategory || p.category === selectedCategory;
    const matchSearch =
      !searchQuery ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.bibNumber.toString().includes(searchQuery) ||
      p.danceOneId.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  // Calculate live ranking
  const rankedParticipants = [...filteredParticipants].sort(
    (a, b) => b.weightedTotal - a.weightedTotal
  );

  // Toggle Check-in status
  const handleToggleCheckIn = (participantId: string) => {
    const updated = participants.map((p) => {
      if (p.id === participantId) {
        return {
          ...p,
          checkedIn: !p.checkedIn,
          checkInTime: !p.checkedIn
            ? new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            : undefined,
        };
      }
      return p;
    });
    onUpdateEvent({ ...event, participants: updated });
  };

  // Toggle Dancer Privacy
  const handleUpdatePrivacy = (
    participantId: string,
    privacy: DancerResultPublishPrivacy
  ) => {
    const updated = participants.map((p) =>
      p.id === participantId ? { ...p, privacy } : p
    );
    onUpdateEvent({ ...event, participants: updated });
  };

  // Toggle Live Scoring Policy
  const handleSetScorePolicy = (policy: ScorePublishPolicy) => {
    onUpdateEvent({ ...event, scorePublishPolicy: policy });
  };

  // Toggle Live Scoring Ticker
  const handleToggleLiveScoring = () => {
    onUpdateEvent({ ...event, isLiveScoringEnabled: !event.isLiveScoringEnabled });
  };

  // Add Participant
  const handleAddParticipant = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const newP: CompetitionParticipant = {
      id: `part-${Date.now()}`,
      bibNumber: newBib,
      name: newName.trim(),
      crewOrStudio: newCrew || undefined,
      danceOneId: newDanceOneId || `DO-${Math.floor(10000 + Math.random() * 90000)}`,
      category: selectedCategory,
      ageGroup: 'Open (16-29)',
      format: newFormat,
      performanceOrder: participants.length + 1,
      heat: 'Heat 1 - Prelims',
      round: selectedRound,
      checkedIn: true,
      checkInTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      musicStatus: 'Verified',
      scores: [],
      weightedTotal: 0,
      privacy: 'published_to_dancer',
      certificateIssued: false,
    };

    onUpdateEvent({
      ...event,
      participants: [...participants, newP],
      registeredCount: (event.registeredCount || 0) + 1,
    });

    setNewName('');
    setNewCrew('');
    setNewBib(newBib + 1);
    setShowAddParticipantModal(false);
  };

  // Issue Certificate
  const handleIssueCertificate = (p: CompetitionParticipant) => {
    const updated = participants.map((item) =>
      item.id === p.id ? { ...item, certificateIssued: true } : item
    );
    onUpdateEvent({ ...event, participants: updated });
    setShowCertificateModal(p);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Live Status Header */}
      <div className="p-5 rounded-3xl bg-[#18181b] border border-[#27272a] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-black uppercase tracking-wider bg-[#eab308]/20 text-[#eab308] border border-[#eab308]/40">
              COMPETITION WORKSPACE
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e] animate-pulse" />
            <span className="text-xs font-bold text-[#22c55e]">
              {event.status.toUpperCase()} • {participants.length} Registered Competitors
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">{event.title}</h2>
          <p className="text-xs text-[#a1a1aa]">
            Custom weighted judging, bib allocation, live scoreboard, and tamper-proof audit trails.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={onOpenJudgePortal}
            className="px-4 py-2.5 rounded-2xl bg-[#27272a] hover:bg-[#3f3f46] text-white text-xs font-bold flex items-center gap-2 border border-[#3f3f46] transition-all"
          >
            <Shield className="w-4 h-4 text-[#eab308]" />
            <span>Launch Judge Portal</span>
          </button>
          <button
            onClick={onOpenControlCenter}
            className="px-5 py-2.5 rounded-2xl bg-[#eab308] hover:bg-[#facc15] text-black text-xs font-black shadow-lg flex items-center gap-2 transition-all"
          >
            <Radio className="w-4 h-4 animate-pulse" />
            <span>Live Control Center</span>
          </button>
        </div>
      </div>

      {/* Sub-Tabs Navigation */}
      <div className="flex items-center gap-2 bg-[#18181b] p-1.5 rounded-2xl border border-[#27272a] overflow-x-auto no-scrollbar">
        {[
          { id: 'live_scoring', label: 'Live Scoring Ticker & Leaderboard', icon: Trophy },
          { id: 'participants', label: 'Competitors & Bibs', icon: Users },
          { id: 'criteria', label: 'Scoring Criteria Matrix (100%)', icon: Sliders },
          { id: 'rankings', label: 'Final Rankings & Certificates', icon: Award },
          { id: 'audit_trail', label: 'Score Audit Trail', icon: History },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
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

      {/* Category & Round Selector Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-[#18181b]/60 border border-[#27272a]">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          <span className="text-xs font-bold text-[#71717a] whitespace-nowrap">Category:</span>
          {event.categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-[#27272a] text-white border border-[#eab308]'
                  : 'text-[#a1a1aa] hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-[#71717a]">Round:</span>
          <select
            value={selectedRound}
            onChange={(e) => setSelectedRound(e.target.value)}
            className="px-3 py-1.5 bg-[#27272a] border border-[#3f3f46] rounded-xl text-xs font-bold text-white outline-none"
          >
            <option value="Prelims">Prelims (Heat 1)</option>
            <option value="Round of 16">Round of 16</option>
            <option value="Quarter-Finals">Quarter-Finals</option>
            <option value="Semi-Finals">Semi-Finals</option>
            <option value="Finals">Finals</option>
          </select>
        </div>
      </div>

      {/* SUB-TAB 1: LIVE SCORING TICKER & LEADERBOARD */}
      {activeSubTab === 'live_scoring' && (
        <div className="space-y-6">
          {/* Live Scoring Controls Card */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-3xl bg-[#18181b] border border-[#27272a] space-y-2 md:col-span-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#22c55e] animate-ping" />
                  <h3 className="text-sm font-bold text-white">Live Public Scoreboard Broadcast</h3>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-[#a1a1aa]">Policy:</span>
                  <select
                    value={event.scorePublishPolicy}
                    onChange={(e) => handleSetScorePolicy(e.target.value as ScorePublishPolicy)}
                    className="px-2.5 py-1 bg-[#27272a] border border-[#3f3f46] rounded-xl text-xs font-bold text-[#eab308] outline-none"
                  >
                    <option value="visible_after_event">Visible After Event</option>
                    <option value="published_live">Published Live</option>
                    <option value="published_manually">Manual Release Only</option>
                    <option value="private">Strictly Private</option>
                  </select>
                </div>
              </div>
              <p className="text-xs text-[#a1a1aa]">
                Control what is shown on the big screen stage display and participant mobile screens.
                Judge names and individual criteria points can be kept private until finalization.
              </p>
            </div>

            <div className="p-4 rounded-3xl bg-[#18181b] border border-[#27272a] flex flex-col justify-between">
              <span className="text-xs font-bold text-[#71717a]">Scoring Mode</span>
              <div className="flex items-center justify-between pt-2">
                <span className="text-sm font-black text-white">
                  {event.isLiveScoringEnabled ? 'LIVE SCORING ACTIVE' : 'SCORING PAUSED'}
                </span>
                <button
                  onClick={handleToggleLiveScoring}
                  className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
                    event.isLiveScoringEnabled
                      ? 'bg-[#22c55e]/20 text-[#22c55e] border border-[#22c55e]/40'
                      : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
                  }`}
                >
                  {event.isLiveScoringEnabled ? 'Active' : 'Enable'}
                </button>
              </div>
            </div>
          </div>

          {/* Active On-Stage Competitor Scoring Sheet */}
          <div className="p-5 rounded-3xl bg-[#18181b] border border-[#eab308]/40 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#27272a] pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#eab308] text-black font-black text-xl flex items-center justify-center shadow-lg">
                  #101
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full text-xs font-black uppercase bg-[#22c55e]/20 text-[#22c55e]">
                      ON STAGE NOW
                    </span>
                    <span className="text-xs text-[#a1a1aa]">Performance Order: 1 of 4</span>
                  </div>
                  <h3 className="text-lg font-black text-white">Aryan "Viper" Shetty</h3>
                  <p className="text-xs text-[#a1a1aa]">Desi Hopperz Crew • DO-88219 • Solo Hip-Hop Pro</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <span className="text-xs uppercase font-bold text-[#71717a] block">Weighted Avg</span>
                  <span className="text-2xl font-black text-[#eab308]">9.04 / 10.0</span>
                </div>
                <div className="w-10 h-10 rounded-2xl bg-[#eab308]/20 border border-[#eab308]/40 flex items-center justify-center text-[#eab308]">
                  <Trophy className="w-5 h-5" />
                </div>
              </div>
            </div>

            {/* Judges Breakdown Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {ORGANIZER_JUDGES_DATA.map((judge) => {
                const participant1 = participants.find((p) => p.bibNumber === 101);
                const score = participant1?.scores.find((s) => s.judgeId === judge.id);

                return (
                  <div
                    key={judge.id}
                    className="p-4 rounded-2xl bg-[#202024] border border-[#27272a] space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={judge.avatar}
                          alt={judge.name}
                          className="w-8 h-8 rounded-full object-cover border border-[#eab308]/40"
                        />
                        <div>
                          <p className="text-xs font-bold text-white">{judge.name}</p>
                          <p className="text-xs text-[#71717a]">{judge.styles[0]} Specialist</p>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-[#22c55e]/20 text-[#22c55e] flex items-center gap-1">
                        <Lock className="w-2.5 h-2.5" /> Finalized
                      </span>
                    </div>

                    {/* Breakdown */}
                    {score ? (
                      <div className="space-y-1.5 text-xs">
                        <div className="flex justify-between text-[#a1a1aa]">
                          <span>Technique (30%):</span>
                          <span className="font-bold text-white">
                            {score.criteriaScores['crit-tech'] || 9.0}/10
                          </span>
                        </div>
                        <div className="flex justify-between text-[#a1a1aa]">
                          <span>Musicality (20%):</span>
                          <span className="font-bold text-white">
                            {score.criteriaScores['crit-musi'] || 8.8}/10
                          </span>
                        </div>
                        <div className="flex justify-between text-[#a1a1aa]">
                          <span>Creativity (20%):</span>
                          <span className="font-bold text-white">
                            {score.criteriaScores['crit-crea'] || 9.0}/10
                          </span>
                        </div>
                        <div className="flex justify-between text-[#a1a1aa]">
                          <span>Performance (20%):</span>
                          <span className="font-bold text-white">
                            {score.criteriaScores['crit-perf'] || 9.2}/10
                          </span>
                        </div>
                        <div className="flex justify-between text-[#a1a1aa]">
                          <span>Stage Presence (10%):</span>
                          <span className="font-bold text-white">
                            {score.criteriaScores['crit-stag'] || 9.0}/10
                          </span>
                        </div>
                        <div className="pt-2 border-t border-[#27272a] flex justify-between font-black text-sm">
                          <span className="text-[#eab308]">Total Score:</span>
                          <span className="text-[#eab308]">{score.totalScore.toFixed(2)}</span>
                        </div>
                        {score.notes && (
                          <p className="text-xs text-[#71717a] italic mt-1 bg-[#18181b] p-2 rounded-xl">
                            "{score.notes}"
                          </p>
                        )}
                      </div>
                    ) : (
                      <div className="py-6 text-center text-xs text-[#71717a]">
                        Awaiting Judge Scoring Input...
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Live Standings Leaderboard Table */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <Trophy className="w-4 h-4 text-[#eab308]" />
                <span>Current Leaderboard Standings ({selectedCategory})</span>
              </h3>
              <span className="text-xs text-[#a1a1aa]">Sorted by Weighted Average Score</span>
            </div>

            <div className="rounded-2xl border border-[#27272a] overflow-hidden bg-[#18181b]">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#202024] text-[#a1a1aa] font-bold uppercase text-xs tracking-wider border-b border-[#27272a]">
                  <tr>
                    <th className="py-3 px-4">Rank</th>
                    <th className="py-3 px-4">Bib & Dancer</th>
                    <th className="py-3 px-4">Crew / Studio</th>
                    <th className="py-3 px-4">Judge Tally</th>
                    <th className="py-3 px-4">Weighted Score</th>
                    <th className="py-3 px-4">Round Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#27272a]">
                  {rankedParticipants.map((p, idx) => (
                    <tr key={p.id} className="hover:bg-[#202024]/60 transition-colors">
                      <td className="py-3 px-4 font-black">
                        <span
                          className={`w-6 h-6 rounded-full inline-flex items-center justify-center text-xs ${
                            idx === 0
                              ? 'bg-[#eab308] text-black font-black'
                              : idx === 1
                              ? 'bg-zinc-300 text-black font-black'
                              : idx === 2
                              ? 'bg-amber-700 text-white font-bold'
                              : 'text-[#71717a]'
                          }`}
                        >
                          {idx + 1}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-[#eab308]">#{p.bibNumber}</span>
                          <div>
                            <span className="font-bold text-white block">{p.name}</span>
                            <span className="text-xs text-[#71717a] font-mono">{p.danceOneId}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-[#d4d4d8]">{p.crewOrStudio || 'Independent'}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-[#27272a] text-[#a1a1aa]">
                          {p.scores.length} / 3 Submitted
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-sm font-black text-[#eab308]">
                          {p.weightedTotal > 0 ? p.weightedTotal.toFixed(2) : '—'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#3b82f6]/20 text-[#3b82f6]">
                          {p.round}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => handleIssueCertificate(p)}
                          className="px-3 py-1 rounded-xl bg-[#27272a] hover:bg-[#3f3f46] text-[#eab308] text-xs font-bold"
                        >
                          Certificate
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: COMPETITORS & BIBS */}
      {activeSubTab === 'participants' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-[#71717a]" />
              <input
                type="text"
                placeholder="Search by Bib #, Name, or DanceOne ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-[#18181b] border border-[#27272a] rounded-2xl text-xs text-white outline-none"
              />
            </div>

            <button
              onClick={() => setShowAddParticipantModal(true)}
              className="px-4 py-2 bg-[#eab308] hover:bg-[#facc15] text-black text-xs font-black rounded-2xl flex items-center gap-2 self-start sm:self-auto shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>+ Register Competitor</span>
            </button>
          </div>

          {/* Competitors Table */}
          <div className="rounded-2xl border border-[#27272a] overflow-hidden bg-[#18181b]">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#202024] text-[#a1a1aa] font-bold uppercase text-xs tracking-wider border-b border-[#27272a]">
                <tr>
                  <th className="py-3 px-4">Bib #</th>
                  <th className="py-3 px-4">Competitor</th>
                  <th className="py-3 px-4">Order</th>
                  <th className="py-3 px-4">Check-In</th>
                  <th className="py-3 px-4">Music Track</th>
                  <th className="py-3 px-4">Result Privacy</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#27272a]">
                {filteredParticipants.map((p) => (
                  <tr key={p.id} className="hover:bg-[#202024]/60 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-[#eab308]">#{p.bibNumber}</td>
                    <td className="py-3 px-4">
                      <div>
                        <span className="font-bold text-white block">{p.name}</span>
                        <span className="text-xs text-[#71717a]">
                          {p.danceOneId} • {p.crewOrStudio || 'Solo'}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-white font-bold">Slot {p.performanceOrder}</td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => handleToggleCheckIn(p.id)}
                        className={`px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all ${
                          p.checkedIn
                            ? 'bg-[#22c55e]/20 text-[#22c55e] border border-[#22c55e]/40'
                            : 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                        }`}
                      >
                        <CheckCircle2 className="w-3 h-3" />
                        <span>{p.checkedIn ? `Checked (${p.checkInTime || 'Gate 1'})` : 'Pending'}</span>
                      </button>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-[#10b981]/20 text-[#10b981] flex items-center gap-1 inline-flex">
                        <Music className="w-3 h-3" /> {p.musicStatus}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <select
                        value={p.privacy}
                        onChange={(e) =>
                          handleUpdatePrivacy(p.id, e.target.value as DancerResultPublishPrivacy)
                        }
                        className="px-2.5 py-1 bg-[#27272a] border border-[#3f3f46] rounded-xl text-xs font-bold text-white outline-none"
                      >
                        <option value="public">Public on DanceOne</option>
                        <option value="published_to_dancer">Dancer Profile Only</option>
                        <option value="organizer_only">Organizer Only</option>
                        <option value="private">Private</option>
                      </select>
                    </td>
                    <td className="py-3 px-4 text-right space-x-2">
                      <button
                        onClick={() => handleIssueCertificate(p)}
                        className="px-2.5 py-1 rounded-xl bg-[#27272a] hover:bg-[#3f3f46] text-[#eab308] text-xs font-bold"
                      >
                        Cert
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: SCORING CRITERIA MATRIX */}
      {activeSubTab === 'criteria' && (
        <div className="space-y-4">
          <div className="p-5 rounded-3xl bg-[#18181b] border border-[#27272a] space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-black text-white">Active Scoring Criteria & Percentage Weights</h3>
                <p className="text-xs text-[#a1a1aa]">
                  Weights are strictly enforced across all judge portals to ensure uniform mathematical tabulation.
                </p>
              </div>
              <div className="px-3 py-1 rounded-full bg-[#22c55e]/20 text-[#22c55e] border border-[#22c55e]/40 text-xs font-black">
                100% Normalized Weight
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {event.scoringCriteria.map((c) => (
                <div
                  key={c.id}
                  className="p-4 rounded-2xl bg-[#202024] border border-[#27272a] space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-sm">{c.name}</span>
                    <span className="text-xs font-black text-[#eab308] bg-[#eab308]/10 px-2 py-0.5 rounded-full border border-[#eab308]/40">
                      {c.weight}% Weight
                    </span>
                  </div>
                  <p className="text-xs text-[#71717a]">{c.description}</p>
                  <div className="w-full bg-[#27272a] h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-[#eab308] h-full rounded-full"
                      style={{ width: `${c.weight}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Tie-breaking Rules */}
            <div className="p-4 rounded-2xl bg-[#18181b] border border-[#27272a] space-y-2">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                Automated Tie-Breaking Rules
              </h4>
              <p className="text-xs text-[#a1a1aa]">
                1. Higher Technique score takes precedence in identical weighted totals.
                <br />
                2. If Technique is also tied, a 1-minute sudden death overtime cypher is triggered by the Head Judge.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 4: FINAL RANKINGS & CERTIFICATES */}
      {activeSubTab === 'rankings' && (
        <div className="space-y-6">
          <div className="p-5 rounded-3xl bg-[#18181b] border border-[#27272a] flex items-center justify-between flex-wrap gap-4">
            <div>
              <h3 className="text-base font-black text-white">Championship Final Awards & Rankings</h3>
              <p className="text-xs text-[#a1a1aa]">
                Official finalization and instant certificate issuance to participants' verified DanceOne profiles.
              </p>
            </div>
            <button
              onClick={() => {
                const updated = participants.map((p) => ({ ...p, certificateIssued: true }));
                onUpdateEvent({ ...event, participants: updated });
                alert('All digital certificates issued and synced to DanceOne profiles!');
              }}
              className="px-4 py-2 bg-[#22c55e] hover:bg-[#16a34a] text-black text-xs font-black rounded-2xl flex items-center gap-2 shadow-lg"
            >
              <Sparkles className="w-4 h-4" />
              <span>Batch Issue All Certificates</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {rankedParticipants.slice(0, 3).map((p, idx) => (
              <div
                key={p.id}
                className={`p-5 rounded-3xl border flex flex-col justify-between space-y-4 ${
                  idx === 0
                    ? 'bg-[#eab308]/10 border-[#eab308] shadow-[0_0_25px_rgba(234,179,8,0.2)]'
                    : 'bg-[#18181b] border-[#27272a]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-black uppercase ${
                      idx === 0
                        ? 'bg-[#eab308] text-black'
                        : idx === 1
                        ? 'bg-zinc-300 text-black'
                        : 'bg-amber-700 text-white'
                    }`}
                  >
                    {idx === 0 ? '🏆 CHAMPION / 1ST PLACE' : idx === 1 ? '🥈 1ST RUNNER UP' : '🥉 2ND RUNNER UP'}
                  </span>
                  <span className="text-xs font-mono font-bold text-[#a1a1aa]">#{p.bibNumber}</span>
                </div>

                <div>
                  <h4 className="text-lg font-black text-white">{p.name}</h4>
                  <p className="text-xs text-[#a1a1aa]">{p.crewOrStudio || 'Independent'}</p>
                  <p className="text-sm font-black text-[#eab308] mt-2">
                    Final Score: {p.weightedTotal.toFixed(2)} / 10.0
                  </p>
                </div>

                <button
                  onClick={() => setShowCertificateModal(p)}
                  className="w-full py-2 bg-[#27272a] hover:bg-[#3f3f46] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2"
                >
                  <Award className="w-4 h-4 text-[#eab308]" />
                  <span>View Official Certificate</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB 5: SCORE AUDIT TRAIL */}
      {activeSubTab === 'audit_trail' && (
        <div className="space-y-4">
          <div className="p-4 rounded-3xl bg-[#18181b] border border-[#27272a] flex items-center justify-between">
            <div>
              <h3 className="text-sm font-black text-white">Immutable Judging Score Audit Logs</h3>
              <p className="text-xs text-[#a1a1aa]">
                Every score submission, judge modification, and organizer override is permanently logged with timestamps.
              </p>
            </div>
            <span className="px-3 py-1 rounded-full bg-[#10b981]/20 text-[#10b981] border border-[#10b981]/40 text-xs font-bold">
              Audit Verified
            </span>
          </div>

          <div className="rounded-2xl border border-[#27272a] overflow-hidden bg-[#18181b]">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#202024] text-[#a1a1aa] font-bold uppercase text-xs tracking-wider border-b border-[#27272a]">
                <tr>
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4">Competitor</th>
                  <th className="py-3 px-4">Judge</th>
                  <th className="py-3 px-4">Action</th>
                  <th className="py-3 px-4">Score</th>
                  <th className="py-3 px-4">Reason / Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#27272a]">
                {event.scoreAuditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-[#202024]/60 transition-colors">
                    <td className="py-3 px-4 font-mono text-[#71717a]">{log.timestamp}</td>
                    <td className="py-3 px-4 font-bold text-white">{log.participantName}</td>
                    <td className="py-3 px-4 text-[#d4d4d8]">{log.judgeName}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                          log.action === 'score_modified'
                            ? 'bg-amber-500/20 text-amber-400'
                            : 'bg-emerald-500/20 text-emerald-400'
                        }`}
                      >
                        {log.action.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-black text-[#eab308]">
                      {log.previousScore ? `${log.previousScore} → ` : ''}
                      {log.newScore}
                    </td>
                    <td className="py-3 px-4 text-[#71717a] italic">
                      {log.reason || 'Direct judge portal submission'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ADD PARTICIPANT MODAL */}
      {showAddParticipantModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-[#121215] border border-[#27272a] rounded-3xl w-full max-w-md p-6 space-y-5 shadow-2xl">
            <h3 className="text-lg font-black text-white">Register Competitor / Soloist</h3>

            <form onSubmit={handleAddParticipant} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#d4d4d8]">Bib Number</label>
                <input
                  type="number"
                  required
                  value={newBib}
                  onChange={(e) => setNewBib(Number(e.target.value))}
                  className="w-full px-3.5 py-2 bg-[#18181b] border border-[#27272a] rounded-xl text-xs text-white outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#d4d4d8]">Dancer / Crew Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul 'Lockstar' Deshmukh"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-3.5 py-2 bg-[#18181b] border border-[#27272a] rounded-xl text-xs text-white outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#d4d4d8]">Crew / Studio</label>
                <input
                  type="text"
                  placeholder="e.g. Beast Mode Crew"
                  value={newCrew}
                  onChange={(e) => setNewCrew(e.target.value)}
                  className="w-full px-3.5 py-2 bg-[#18181b] border border-[#27272a] rounded-xl text-xs text-white outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#d4d4d8]">DanceOne Universal ID</label>
                <input
                  type="text"
                  value={newDanceOneId}
                  onChange={(e) => setNewDanceOneId(e.target.value)}
                  className="w-full px-3.5 py-2 bg-[#18181b] border border-[#27272a] rounded-xl text-xs text-white outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddParticipantModal(false)}
                  className="px-4 py-2 rounded-xl bg-[#27272a] text-xs font-bold text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#eab308] text-black text-xs font-black"
                >
                  + Add to Roster
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* OFFICIAL DIGITAL CERTIFICATE MODAL */}
      {showCertificateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="bg-[#121215] border-2 border-[#eab308]/60 rounded-3xl w-full max-w-2xl p-8 space-y-6 shadow-2xl relative text-center">
            <button
              onClick={() => setShowCertificateModal(null)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white p-2"
            >
              ✕
            </button>

            <div className="flex items-center justify-center gap-2">
              <Trophy className="w-8 h-8 text-[#eab308]" />
              <span className="text-xs font-black uppercase tracking-widest text-[#eab308]">
                DANCEONE OFFICIAL CERTIFICATE OF MERIT
              </span>
            </div>

            <div className="space-y-2 border-y border-[#eab308]/30 py-6">
              <p className="text-xs text-[#a1a1aa] uppercase tracking-wider">This is proudly presented to</p>
              <h2 className="text-3xl font-black text-white tracking-tight">{showCertificateModal.name}</h2>
              <p className="text-xs text-[#eab308] font-mono">DanceOne ID: {showCertificateModal.danceOneId}</p>

              <p className="text-xs text-[#d4d4d8] max-w-lg mx-auto mt-4 leading-relaxed">
                For securing <span className="font-bold text-[#eab308]">Rank #{showCertificateModal.rank || 1}</span> in the{' '}
                <span className="font-bold text-white">{showCertificateModal.category}</span> category at the{' '}
                <span className="font-bold text-white">{event.title}</span> with a verified score of{' '}
                <span className="font-bold text-[#eab308]">{showCertificateModal.weightedTotal.toFixed(2)}/10.0</span>.
              </p>
            </div>

            <div className="flex items-center justify-between text-left text-xs text-[#a1a1aa] px-4">
              <div>
                <span className="block font-bold text-white">B-Boy Tornado</span>
                <span className="text-xs">Head Judge & WDSF Scorer</span>
              </div>
              <div className="text-center">
                <span className="w-12 h-12 rounded-full border border-[#eab308]/60 inline-flex items-center justify-center text-xs font-black text-[#eab308]">
                  VERIFIED
                </span>
              </div>
              <div className="text-right">
                <span className="block font-bold text-white">Mumbai Org Team</span>
                <span className="text-xs">Championship Director</span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => {
                  alert('Certificate downloaded in high-resolution PDF with verifiable cryptographic hash.');
                }}
                className="px-5 py-2.5 rounded-2xl bg-[#eab308] text-black text-xs font-black flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span>Download High-Res PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

