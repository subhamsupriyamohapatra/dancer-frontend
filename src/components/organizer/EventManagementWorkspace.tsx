import React, { useState } from 'react';
import {
  Trophy,
  Calendar,
  Clock,
  MapPin,
  Users,
  DollarSign,
  Shield,
  FileText,
  Radio,
  Mic,
  Sliders,
  CheckCircle2,
  AlertCircle,
  Megaphone,
  Sparkles,
  Download,
  Share2,
  Trash2,
  Edit,
  Plus,
  ArrowRight,
  TrendingUp,
  Award,
  Film,
  Music,
  Video,
  Ticket,
  Eye,
  EyeOff,
  UserCheck,
  Search,
  Filter,
  BarChart2,
  Settings,
  HelpCircle,
  Camera,
  Layers,
  ChevronRight,
  Flame,
  Volume2,
  Tv,
} from 'lucide-react';
import {
  OrganizerEventRecord,
  EventType,
  EventStatus,
  CompetitionCategory,
  ScoringCriterion,
  CompetitionParticipant,
  DancerResultPublishPrivacy,
} from '../../types/organizer';
import { JudgePortalModal } from './JudgePortalModal';
import { MCPortalModal } from './MCPortalModal';
import { CommunicationBroadcastModal } from './CommunicationBroadcastModal';

interface EventManagementWorkspaceProps {
  event: OrganizerEventRecord;
  onUpdateEvent: (updated: OrganizerEventRecord) => void;
  onBackToList?: () => void;
}

export const EventManagementWorkspace: React.FC<EventManagementWorkspaceProps> = ({
  event,
  onUpdateEvent,
  onBackToList,
}) => {
  // Navigation tabs for the event workspace
  const isComp = event.type === 'competition';
  const isBattle = event.type === 'dance_battle' || event.type === 'battle';
  const isShow = event.type === 'dance_show' || event.type === 'show' || event.type === 'showcase';
  const isWorkshop =
    event.type === 'workshop' ||
    event.type === 'masterclass' ||
    event.type === 'dance_camp' ||
    event.type === 'festival' ||
    event.type === 'audition' ||
    event.type === 'other';

  // Active section category: 'general' (12 core modules) or 'specialized' (type-specific engine)
  const [activeCategory, setActiveCategory] = useState<'general' | 'specialized'>('general');

  // General sub-tabs (Universal to all event types)
  const [generalTab, setGeneralTab] = useState<
    | 'overview'
    | 'details'
    | 'registration'
    | 'participants'
    | 'schedule'
    | 'staff'
    | 'communication'
    | 'finance'
    | 'media'
    | 'feedback'
    | 'analytics'
    | 'settings'
  >('overview');

  // Specialized sub-tabs
  const [specializedTab, setSpecializedTab] = useState<string>(() => {
    if (isComp) return 'categories';
    if (isBattle) return 'brackets';
    if (isShow) return 'running_order';
    return 'instructor';
  });

  // Modal triggers
  const [showJudgePortal, setShowJudgePortal] = useState(false);
  const [showMCPortal, setShowMCPortal] = useState(false);
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);

  // Status handler
  const handleStatusChange = (newStatus: EventStatus) => {
    onUpdateEvent({ ...event, status: newStatus });
  };

  // Participant search in participants tab
  const [partSearch, setPartSearch] = useState('');
  const [partPrivacyFilter, setPartPrivacyFilter] = useState('all');

  const participants = event.participants || [];
  const filteredParticipants = participants.filter((p) => {
    const matchSearch =
      !partSearch ||
      p.name.toLowerCase().includes(partSearch.toLowerCase()) ||
      p.danceOneId.toLowerCase().includes(partSearch.toLowerCase()) ||
      p.bibNumber.toString().includes(partSearch);
    const matchPrivacy = partPrivacyFilter === 'all' || p.privacy === partPrivacyFilter;
    return matchSearch && matchPrivacy;
  });

  return (
    <div className="space-y-4">
      {/* 1. Minimalist Event Top Bar */}
      <div className="bg-[#141417] border border-[#27272a] rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-sm">
        <div className="flex items-start sm:items-center gap-3">
          {onBackToList && (
            <button
              onClick={onBackToList}
              className="px-2.5 py-1 rounded-lg bg-[#202024] hover:bg-[#27272a] text-[#a1a1aa] hover:text-white text-xs font-medium transition-all"
            >
              ← Back
            </button>
          )}

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2 py-0.5 rounded-md text-xs font-bold uppercase tracking-wider bg-[#eab308]/15 text-[#eab308] border border-[#eab308]/30">
                {event.type.replace(/_/g, ' ')}
              </span>

              {/* Status Selector Dropdown */}
              <select
                value={event.status}
                onChange={(e) => handleStatusChange(e.target.value as EventStatus)}
                className={`text-xs font-bold uppercase px-2 py-0.5 rounded-md border outline-none cursor-pointer ${
                  event.status === 'live'
                    ? 'bg-rose-500/20 text-rose-400 border-rose-500/40 animate-pulse'
                    : event.status === 'published' || event.status === 'registration_open'
                    ? 'bg-[#22c55e]/20 text-[#22c55e] border-[#22c55e]/40'
                    : event.status === 'completed'
                    ? 'bg-blue-500/20 text-blue-400 border-blue-500/40'
                    : 'bg-zinc-800 text-zinc-400 border-zinc-700'
                }`}
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="registration_open">Registration Open</option>
                <option value="live">🔴 Live Now</option>
                <option value="completed">Completed</option>
                <option value="archived">Archived</option>
              </select>

              <span className="text-xs text-[#71717a] hidden sm:inline">
                ID: {event.id}
              </span>
            </div>

            <h1 className="text-base sm:text-lg font-bold text-white mt-0.5 tracking-tight">
              {event.title}
            </h1>

            <div className="flex items-center gap-3 text-xs text-[#a1a1aa] mt-0.5 flex-wrap">
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3 text-[#71717a]" />
                {event.date} • {event.time}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3 text-[#71717a]" />
                {event.venue}, {event.location}
              </span>
              <span className="flex items-center gap-1 font-semibold text-white">
                <Users className="w-3 h-3 text-[#eab308]" />
                {event.registeredCount || 0} / {event.capacity || 100} Registered
              </span>
            </div>
          </div>
        </div>

        {/* Quick Launch Buttons (Small & Compact) */}
        <div className="flex items-center gap-1.5 flex-wrap self-end md:self-center">
          <button
            onClick={() => setShowBroadcastModal(true)}
            className="px-2.5 py-1.5 rounded-xl bg-[#202024] hover:bg-[#27272a] text-white text-xs font-medium flex items-center gap-1 border border-[#27272a] transition-all"
            title="Dispatch targeted announcements to dancers or audience"
          >
            <Megaphone className="w-3.5 h-3.5 text-rose-400" />
            <span>Broadcast</span>
          </button>

          {(isComp || isBattle) && (
            <button
              onClick={() => setShowJudgePortal(true)}
              className="px-2.5 py-1.5 rounded-xl bg-[#202024] hover:bg-[#27272a] text-white text-xs font-medium flex items-center gap-1 border border-[#27272a] transition-all"
              title="Open tablet scoring console for adjudicators"
            >
              <Shield className="w-3.5 h-3.5 text-[#eab308]" />
              <span>Judge Tablet</span>
            </button>
          )}

          {isBattle && (
            <button
              onClick={() => setShowMCPortal(true)}
              className="px-2.5 py-1.5 rounded-xl bg-[#202024] hover:bg-[#27272a] text-white text-xs font-medium flex items-center gap-1 border border-[#27272a] transition-all"
              title="Open live battle prompt & cue screen for Host/MC"
            >
              <Mic className="w-3.5 h-3.5 text-cyan-400" />
              <span>MC Prompter</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. Segregated Workspace Mode Switcher (General vs Specialized Engine) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#27272a] pb-2">
        <div className="flex items-center gap-1.5 bg-[#141417] p-1 rounded-xl border border-[#27272a] self-start">
          <button
            onClick={() => setActiveCategory('general')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
              activeCategory === 'general'
                ? 'bg-[#27272a] text-white shadow-sm'
                : 'text-[#a1a1aa] hover:text-white'
            }`}
          >
            Event Management (12 Modules)
          </button>
          <button
            onClick={() => setActiveCategory('specialized')}
            className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
              activeCategory === 'specialized'
                ? 'bg-[#eab308] text-black shadow-sm font-black'
                : 'text-[#eab308] hover:text-white'
            }`}
          >
            <Sparkles className="w-3 h-3" />
            <span className="capitalize">{event.type.replace(/_/g, ' ')} Engine</span>
          </button>
        </div>

        <span className="text-xs text-[#71717a]">
          {activeCategory === 'general'
            ? 'Core operational workflows & logistics'
            : `Type-specific scoring, brackets & format tools`}
        </span>
      </div>

      {/* 3. Sub-Navigation Bar for General Management (12 modules) */}
      {activeCategory === 'general' && (
        <div className="flex items-center gap-1.5 bg-[#141417] p-2 rounded-2xl border border-[#27272a] overflow-x-auto no-scrollbar">
          {[
            { id: 'overview', label: 'Event Overview', icon: TrendingUp },
            { id: 'details', label: 'Event Details', icon: FileText },
            { id: 'registration', label: 'Registration', icon: Ticket },
            { id: 'participants', label: 'Participants', icon: Users },
            { id: 'schedule', label: 'Schedule', icon: Clock },
            { id: 'staff', label: 'Staff', icon: Shield },
            { id: 'communication', label: 'Communication', icon: Megaphone },
            { id: 'finance', label: 'Finance', icon: DollarSign },
            { id: 'media', label: 'Media', icon: Camera },
            { id: 'feedback', label: 'Feedback', icon: Award },
            { id: 'analytics', label: 'Analytics', icon: BarChart2 },
            { id: 'settings', label: 'Settings', icon: Settings },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = generalTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setGeneralTab(tab.id as any)}
                className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-[#27272a] text-white font-bold border border-[#3f3f46] shadow-sm'
                    : 'text-[#a1a1aa] hover:text-white hover:bg-[#18181b]'
                }`}
              >
                <Icon className="w-3.5 h-3.5 text-[#a1a1aa]" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* 4. Sub-Navigation Bar for Specialized Event Engine */}
      {activeCategory === 'specialized' && (
        <div className="flex items-center gap-1.5 bg-[#141417] p-2 rounded-2xl border border-[#27272a] overflow-x-auto no-scrollbar">
          {/* If Competition */}
          {isComp &&
            [
              { id: 'categories', label: 'Categories' },
              { id: 'rounds_heats', label: 'Rounds & Heats' },
              { id: 'judges', label: 'Judges' },
              { id: 'custom_scoring', label: 'Custom Scoring' },
              { id: 'score_sheets', label: 'Score Sheets' },
              { id: 'live_scoring', label: 'Live Scoring' },
              { id: 'results', label: 'Results' },
              { id: 'rankings', label: 'Rankings' },
              { id: 'certificates', label: 'Certificates' },
              { id: 'awards', label: 'Awards' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSpecializedTab(tab.id)}
                className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
                  specializedTab === tab.id
                    ? 'bg-[#eab308] text-black font-bold shadow-md'
                    : 'text-[#a1a1aa] hover:text-white hover:bg-[#18181b]'
                }`}
              >
                {tab.label}
              </button>
            ))}

          {/* If Battle */}
          {isBattle &&
            [
              { id: 'battle_format', label: 'Battle Format' },
              { id: 'brackets', label: 'Brackets' },
              { id: 'matchups', label: 'Matchups' },
              { id: 'judges', label: 'Judges' },
              { id: 'mc', label: 'MC' },
              { id: 'dj', label: 'DJ' },
              { id: 'rounds', label: 'Rounds' },
              { id: 'judge_decisions', label: 'Judge Decisions' },
              { id: 'results', label: 'Results' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSpecializedTab(tab.id)}
                className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
                  specializedTab === tab.id
                    ? 'bg-[#eab308] text-black font-bold shadow-md'
                    : 'text-[#a1a1aa] hover:text-white hover:bg-[#18181b]'
                }`}
              >
                {tab.label}
              </button>
            ))}

          {/* If Show / Showcase */}
          {isShow &&
            [
              { id: 'performers', label: 'Performers' },
              { id: 'running_order', label: 'Running Order' },
              { id: 'rehearsals', label: 'Rehearsals' },
              { id: 'stage_management', label: 'Stage Management' },
              { id: 'backstage', label: 'Backstage' },
              { id: 'audience', label: 'Audience' },
              { id: 'tickets', label: 'Tickets' },
              { id: 'seating', label: 'Seating' },
              { id: 'check_in', label: 'Check-in' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSpecializedTab(tab.id)}
                className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
                  specializedTab === tab.id
                    ? 'bg-[#eab308] text-black font-bold shadow-md'
                    : 'text-[#a1a1aa] hover:text-white hover:bg-[#18181b]'
                }`}
              >
                {tab.label}
              </button>
            ))}

          {/* If Workshop / Masterclass / Dance Camp */}
          {isWorkshop &&
            [
              { id: 'instructor', label: 'Instructor' },
              { id: 'sessions', label: 'Sessions' },
              { id: 'capacity', label: 'Capacity' },
              { id: 'registration', label: 'Registration' },
              { id: 'attendance', label: 'Attendance' },
              { id: 'feedback', label: 'Feedback' },
              { id: 'certificates', label: 'Certificates' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSpecializedTab(tab.id)}
                className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
                  specializedTab === tab.id
                    ? 'bg-[#eab308] text-black font-bold shadow-md'
                    : 'text-[#a1a1aa] hover:text-white hover:bg-[#18181b]'
                }`}
              >
                {tab.label}
              </button>
            ))}
        </div>
      )}

      {/* ======================================================================= */}
      {/* 5. CONTENT PANELS: GENERAL EVENT MANAGEMENT */}
      {/* ======================================================================= */}
      {activeCategory === 'general' && (
        <div className="space-y-4">
          {/* --- 5.1 EVENT OVERVIEW --- */}
          {generalTab === 'overview' && (
            <div className="space-y-4">
              {/* Metric Chips */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                <div className="p-4 rounded-2xl bg-[#141417] border border-[#27272a] space-y-1">
                  <span className="text-xs font-mono font-semibold text-[#a1a1aa] uppercase tracking-wider block">
                    Registrations & Passes
                  </span>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-2xl font-bold font-mono text-white">
                      {event.registeredCount || 0}
                    </span>
                    <span className="text-xs text-[#a1a1aa]">/ {event.capacity || 100}</span>
                  </div>
                  <div className="w-full h-1.5 bg-[#27272a] rounded-full mt-2.5 overflow-hidden">
                    <div
                      className="h-full bg-[#eab308]"
                      style={{
                        width: `${Math.min(
                          100,
                          ((event.registeredCount || 0) / (event.capacity || 100)) * 100
                        )}%`,
                      }}
                    />
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#141417] border border-[#27272a] space-y-1">
                  <span className="text-xs font-mono font-semibold text-[#a1a1aa] uppercase tracking-wider block">
                    Gross Inflow
                  </span>
                  <p className="text-2xl font-bold font-mono text-[#22c55e] mt-1">
                    ₹{event.revenue ? event.revenue.toLocaleString() : 0}
                  </p>
                  <span className="text-xs text-[#71717a]">Razorpay & Box Office</span>
                </div>

                <div className="p-4 rounded-2xl bg-[#141417] border border-[#27272a] space-y-1">
                  <span className="text-xs font-mono font-semibold text-[#a1a1aa] uppercase tracking-wider block">
                    Check-in Rate
                  </span>
                  <p className="text-2xl font-bold font-mono text-white mt-1">84%</p>
                  <span className="text-xs text-[#22c55e] font-medium">142 Verified at Gate</span>
                </div>

                <div className="p-4 rounded-2xl bg-[#141417] border border-[#27272a] space-y-1">
                  <span className="text-xs font-mono font-semibold text-[#a1a1aa] uppercase tracking-wider block">
                    Stage Delay
                  </span>
                  <p className="text-2xl font-bold font-mono text-emerald-400 mt-1">On Time (+0m)</p>
                  <span className="text-xs text-[#71717a]">Stage Manager Synced</span>
                </div>
              </div>

              {/* Quick Actions & Live Summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2 p-4 sm:p-5 rounded-2xl bg-[#141417] border border-[#27272a] space-y-3.5 shadow-md">
                  <div className="flex items-center justify-between border-b border-[#27272a] pb-2.5">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <Clock className="w-4 h-4 text-[#eab308]" />
                      <span>Live Stage Timeline & Next Up</span>
                    </h3>
                    <span className="text-xs text-[#71717a]">Stage 1 - Main Auditorium</span>
                  </div>

                  <div className="space-y-2.5">
                    {[
                      { time: '10:00 AM', label: 'Participant Gate Check-in & Bib Handout', status: 'completed' },
                      { time: '11:30 AM', label: 'Judges Briefing & Scrutineer Tablet Test', status: 'completed' },
                      { time: '01:00 PM', label: 'Solo Hip Hop Preliminaries (Heats 1-4)', status: 'live' },
                      { time: '03:30 PM', label: 'MegaCrew Showcase & Technical Rehearsals', status: 'upcoming' },
                      { time: '06:00 PM', label: 'Grand Finals, Podium Ceremony & Certificates', status: 'upcoming' },
                    ].map((item, idx) => (
                      <div
                        key={idx}
                        className={`p-3 rounded-xl border text-xs sm:text-sm flex items-center justify-between gap-3 ${
                          item.status === 'live'
                            ? 'bg-rose-950/30 border-rose-500/40 text-rose-200'
                            : item.status === 'completed'
                            ? 'bg-[#18181b] border-[#27272a] text-[#71717a]'
                            : 'bg-[#18181b] border-[#27272a] text-[#d4d4d8]'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="font-mono text-xs text-[#a1a1aa] font-medium">{item.time}</span>
                          <span className="font-semibold text-white">{item.label}</span>
                        </div>
                        <span
                          className={`text-xs font-bold uppercase px-2 py-0.5 rounded ${
                            item.status === 'live'
                              ? 'bg-rose-500 text-white animate-pulse'
                              : item.status === 'completed'
                              ? 'bg-zinc-800 text-zinc-400'
                              : 'bg-[#27272a] text-zinc-300'
                          }`}
                        >
                          {item.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Info Sidebar */}
                <div className="p-4 rounded-xl bg-[#141417] border border-[#27272a] space-y-3 flex flex-col justify-between">
                  <div className="space-y-2.5">
                    <h4 className="text-xs font-bold text-white">Event Highlights</h4>
                    <p className="text-xs text-[#a1a1aa] leading-relaxed">
                      {event.description || 'No description entered yet.'}
                    </p>

                    <div className="pt-2 border-t border-[#27272a] space-y-1.5 text-xs">
                      <div className="flex justify-between text-[#a1a1aa]">
                        <span>Venue:</span>
                        <strong className="text-white">{event.venue}</strong>
                      </div>
                      <div className="flex justify-between text-[#a1a1aa]">
                        <span>Address:</span>
                        <strong className="text-white">{event.location}</strong>
                      </div>
                      <div className="flex justify-between text-[#a1a1aa]">
                        <span>Published:</span>
                        <strong className="text-white">{event.isPublic ? 'Public' : 'Unlisted'}</strong>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setActiveCategory('specialized');
                    }}
                    className="w-full py-1.5 bg-[#eab308] hover:bg-[#facc15] text-black text-xs font-bold rounded-lg flex items-center justify-center gap-1 shadow-sm transition-all"
                  >
                    <span>Launch {event.type.replace(/_/g, ' ')} Tools</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* --- 5.2 EVENT DETAILS --- */}
          {generalTab === 'details' && (
            <div className="p-4 rounded-xl bg-[#141417] border border-[#27272a] space-y-4">
              <h3 className="text-xs font-bold text-white">Event Details & Specifications</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#a1a1aa] uppercase">Event Title</label>
                  <input
                    type="text"
                    value={event.title}
                    onChange={(e) => onUpdateEvent({ ...event, title: e.target.value })}
                    className="w-full px-3 py-1.5 bg-[#18181b] border border-[#27272a] rounded-lg text-xs text-white outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#a1a1aa] uppercase">Event Type</label>
                  <input
                    type="text"
                    disabled
                    value={event.type.toUpperCase()}
                    className="w-full px-3 py-1.5 bg-[#202024] border border-[#27272a] rounded-lg text-xs text-[#a1a1aa] outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#a1a1aa] uppercase">Date & Time</label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={event.date}
                      onChange={(e) => onUpdateEvent({ ...event, date: e.target.value })}
                      className="w-full px-3 py-1.5 bg-[#18181b] border border-[#27272a] rounded-lg text-xs text-white outline-none"
                    />
                    <input
                      type="text"
                      value={event.time}
                      onChange={(e) => onUpdateEvent({ ...event, time: e.target.value })}
                      className="w-full px-3 py-1.5 bg-[#18181b] border border-[#27272a] rounded-lg text-xs text-white outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#a1a1aa] uppercase">Venue & City</label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={event.venue}
                      onChange={(e) => onUpdateEvent({ ...event, venue: e.target.value })}
                      className="w-full px-3 py-1.5 bg-[#18181b] border border-[#27272a] rounded-lg text-xs text-white outline-none"
                    />
                    <input
                      type="text"
                      value={event.location}
                      onChange={(e) => onUpdateEvent({ ...event, location: e.target.value })}
                      className="w-full px-3 py-1.5 bg-[#18181b] border border-[#27272a] rounded-lg text-xs text-white outline-none"
                    />
                  </div>
                </div>

                <div className="md:col-span-2 space-y-1">
                  <label className="text-xs font-bold text-[#a1a1aa] uppercase">Description & Rules</label>
                  <textarea
                    rows={3}
                    value={event.description}
                    onChange={(e) => onUpdateEvent({ ...event, description: e.target.value })}
                    className="w-full p-2.5 bg-[#18181b] border border-[#27272a] rounded-lg text-xs text-white outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* --- 5.3 REGISTRATION --- */}
          {generalTab === 'registration' && (
            <div className="p-4 rounded-xl bg-[#141417] border border-[#27272a] space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold text-white">Registration & Ticketing Tiers</h3>
                  <p className="text-xs text-[#a1a1aa]">Configure participant entry fees, spectator passes, and cutoff dates.</p>
                </div>
                <button
                  onClick={() => alert('New ticket / entry tier added!')}
                  className="px-2.5 py-1 bg-[#27272a] hover:bg-[#3f3f46] text-white text-xs font-medium rounded-lg flex items-center gap-1"
                >
                  <Plus className="w-3 h-3 text-[#eab308]" />
                  <span>+ Add Tier</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {[
                  { name: 'Solo Competitor Entry', price: 999, capacity: 60, sold: 48, status: 'Active' },
                  { name: 'Duo / Trio Crew Entry', price: 1499, capacity: 40, sold: 35, status: 'Active' },
                  { name: 'MegaCrew (8+ Dancers)', price: 3999, capacity: 15, sold: 12, status: 'Almost Full' },
                  { name: 'Spectator VIP Front Row', price: 499, capacity: 100, sold: 85, status: 'Active' },
                  { name: 'General Audience Pass', price: 299, capacity: 300, sold: 160, status: 'Active' },
                ].map((tier, idx) => (
                  <div key={idx} className="p-3 rounded-lg bg-[#18181b] border border-[#27272a] space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white">{tier.name}</span>
                      <span className="text-xs font-bold text-[#22c55e]">₹{tier.price}</span>
                    </div>
                    <div className="text-xs text-[#a1a1aa] flex justify-between">
                      <span>Sold: <strong>{tier.sold} / {tier.capacity}</strong></span>
                      <span className="text-[#eab308]">{tier.status}</span>
                    </div>
                    <div className="w-full h-1 bg-[#27272a] rounded-full overflow-hidden">
                      <div className="h-full bg-[#22c55e]" style={{ width: `${(tier.sold / tier.capacity) * 100}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* --- 5.4 PARTICIPANTS --- */}
          {generalTab === 'participants' && (
            <div className="p-4 rounded-xl bg-[#141417] border border-[#27272a] space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-xs font-bold text-white">Registered Participants Roster</h3>
                  <p className="text-xs text-[#a1a1aa]">
                    Manage bib assignments, verified DanceOne IDs, check-ins, and merit certs.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2 w-3 h-3 text-[#71717a]" />
                    <input
                      type="text"
                      placeholder="Search bib, name, ID..."
                      value={partSearch}
                      onChange={(e) => setPartSearch(e.target.value)}
                      className="pl-7 pr-3 py-1 bg-[#18181b] border border-[#27272a] rounded-lg text-xs text-white outline-none w-48"
                    />
                  </div>

                  <button
                    onClick={() => alert('Exporting participant roster (CSV)...')}
                    className="px-2.5 py-1 bg-[#27272a] text-white text-xs font-medium rounded-lg flex items-center gap-1"
                  >
                    <Download className="w-3 h-3" />
                    <span>CSV</span>
                  </button>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto border border-[#27272a] rounded-lg">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#18181b] text-xs text-[#a1a1aa] uppercase font-bold border-b border-[#27272a]">
                    <tr>
                      <th className="p-2.5">Bib</th>
                      <th className="p-2.5">Dancer / Team</th>
                      <th className="p-2.5">DanceOne ID</th>
                      <th className="p-2.5">Category</th>
                      <th className="p-2.5">Gate Status</th>
                      <th className="p-2.5">Cert</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#27272a]">
                    {filteredParticipants.map((p) => (
                      <tr key={p.id} className="hover:bg-[#18181b]/50">
                        <td className="p-2.5 font-mono text-[#eab308] font-bold">#{p.bibNumber}</td>
                        <td className="p-2.5 font-bold text-white">{p.name}</td>
                        <td className="p-2.5 font-mono text-xs text-[#a1a1aa]">{p.danceOneId}</td>
                        <td className="p-2.5 text-[#d4d4d8]">{p.category}</td>
                        <td className="p-2.5">
                          <span
                            className={`px-1.5 py-0.5 rounded text-xs font-bold ${
                              p.checkedIn
                                ? 'bg-[#22c55e]/20 text-[#22c55e]'
                                : 'bg-zinc-800 text-zinc-400'
                            }`}
                          >
                            {p.checkedIn ? 'Checked In' : 'Pending'}
                          </span>
                        </td>
                        <td className="p-2.5">
                          <span className="text-xs text-[#a1a1aa]">
                            {p.certificateIssued ? 'Issued' : 'Ready'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* --- 5.5 SCHEDULE --- */}
          {generalTab === 'schedule' && (
            <div className="p-4 rounded-xl bg-[#141417] border border-[#27272a] space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold text-white">Event Schedule & Stage Run-Sheets</h3>
                  <p className="text-xs text-[#a1a1aa]">Live time blocks, cue markers, and delays.</p>
                </div>
                <button
                  onClick={() => alert('New timeline block created!')}
                  className="px-2.5 py-1 bg-[#27272a] text-white text-xs font-medium rounded-lg flex items-center gap-1"
                >
                  <Plus className="w-3 h-3 text-[#eab308]" />
                  <span>+ Add Time Slot</span>
                </button>
              </div>

              <div className="space-y-2">
                {[
                  { time: '09:00 - 10:30 AM', title: 'Registration Desk Opens & Competitor Bib Dispatch', stage: 'Foyer / Gate A' },
                  { time: '10:30 - 11:30 AM', title: 'Stage Soundcheck & DJ Warmup Session', stage: 'Main Stage' },
                  { time: '11:30 - 02:00 PM', title: 'Preliminary Rounds - Heats 1 through 6', stage: 'Main Stage' },
                  { time: '02:00 - 03:00 PM', title: 'Lunch Break & Guest Showcase Rehearsal', stage: 'Backstage' },
                  { time: '03:00 - 05:30 PM', title: 'Semi-Finals & Category Cypher Showdowns', stage: 'Main Stage' },
                  { time: '05:30 - 07:30 PM', title: 'Grand Finals & Award Ceremony', stage: 'Main Stage' },
                ].map((item, idx) => (
                  <div key={idx} className="p-2.5 rounded-lg bg-[#18181b] border border-[#27272a] flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs text-[#eab308] font-bold">{item.time}</span>
                      <span className="font-bold text-white">{item.title}</span>
                    </div>
                    <span className="text-xs text-[#a1a1aa] bg-[#202024] px-2 py-0.5 rounded">{item.stage}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* --- 5.6 STAFF --- */}
          {generalTab === 'staff' && (
            <div className="p-4 rounded-xl bg-[#141417] border border-[#27272a] space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold text-white">Event Staff & Operations Crew</h3>
                  <p className="text-xs text-[#a1a1aa]">Designated roles across Stage, Gate, Audio, MC, and Scrutineers.</p>
                </div>
                <button
                  onClick={() => alert('Assigned staff member!')}
                  className="px-2.5 py-1 bg-[#27272a] text-white text-xs font-medium rounded-lg flex items-center gap-1"
                >
                  <Plus className="w-3 h-3 text-[#eab308]" />
                  <span>+ Assign Staff</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                {[
                  { name: 'Karan Sharma', role: 'Event Director', phone: '+91 98201 12345', status: 'Checked In' },
                  { name: 'Rohan Mehra', role: 'Head Judge / Scrutineer', phone: '+91 98112 33445', status: 'Checked In' },
                  { name: 'MC Flash (Vikram)', role: 'Battle MC / Host', phone: '+91 98770 12891', status: 'Checked In' },
                  { name: 'DJ BeatCrafter', role: 'Stage DJ / Audio', phone: '+91 98223 99881', status: 'Checked In' },
                  { name: 'Sneha Patel', role: 'Stage Manager', phone: '+91 98440 22119', status: 'Checked In' },
                  { name: 'Pooja Nair', role: 'Gate / Bib Check-in', phone: '+91 98200 44332', status: 'Checked In' },
                ].map((s, idx) => (
                  <div key={idx} className="p-2.5 rounded-lg bg-[#18181b] border border-[#27272a] flex items-center justify-between text-xs">
                    <div>
                      <h4 className="font-bold text-white">{s.name}</h4>
                      <span className="text-xs text-[#eab308] block">{s.role}</span>
                      <span className="text-xs text-[#71717a] font-mono">{s.phone}</span>
                    </div>
                    <span className="text-xs px-1.5 py-0.5 rounded font-bold bg-[#22c55e]/20 text-[#22c55e]">
                      {s.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* --- 5.7 COMMUNICATION --- */}
          {generalTab === 'communication' && (
            <div className="p-4 rounded-xl bg-[#141417] border border-[#27272a] space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold text-white">Broadcast Alerts & Stage Prompts</h3>
                  <p className="text-xs text-[#a1a1aa]">Push notifications to dancer apps, SMS blasts, and stage displays.</p>
                </div>
                <button
                  onClick={() => setShowBroadcastModal(true)}
                  className="px-2.5 py-1 bg-[#eab308] text-black text-xs font-bold rounded-lg flex items-center gap-1"
                >
                  <Megaphone className="w-3 h-3" />
                  <span>+ New Broadcast</span>
                </button>
              </div>

              <div className="space-y-2">
                {(event.announcements || [
                  '[ALL DANCERS] Report to Stage Left for Heat 3 check-in immediately.',
                  '[JUDGES] Please confirm score matrix submission on your scoring tablets.',
                ]).map((ann, idx) => (
                  <div key={idx} className="p-2.5 rounded-lg bg-[#18181b] border border-[#27272a] text-xs flex items-center justify-between">
                    <span className="text-[#d4d4d8] font-medium">{ann}</span>
                    <span className="text-xs text-[#71717a] whitespace-nowrap ml-2">Sent</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* --- 5.8 FINANCE --- */}
          {generalTab === 'finance' && (
            <div className="p-4 rounded-xl bg-[#141417] border border-[#27272a] space-y-3">
              <h3 className="text-xs font-bold text-white">Event Budget & Cashflow P&L</h3>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3 rounded-lg bg-[#18181b] border border-[#27272a]">
                  <span className="text-xs text-[#71717a] block">Gross Inflow</span>
                  <span className="text-base font-bold text-[#22c55e]">₹{event.revenue ? event.revenue.toLocaleString() : 0}</span>
                </div>
                <div className="p-3 rounded-lg bg-[#18181b] border border-[#27272a]">
                  <span className="text-xs text-[#71717a] block">Venue & AV Expenses</span>
                  <span className="text-base font-bold text-rose-400">₹2,05,000</span>
                </div>
                <div className="p-3 rounded-lg bg-[#18181b] border border-[#27272a]">
                  <span className="text-xs text-[#71717a] block">Judge & Staff Payouts</span>
                  <span className="text-base font-bold text-rose-400">₹95,000</span>
                </div>
                <div className="p-3 rounded-lg bg-[#18181b] border border-[#27272a]">
                  <span className="text-xs text-[#71717a] block">Estimated Net Profit</span>
                  <span className="text-base font-bold text-[#eab308]">₹5,65,000</span>
                </div>
              </div>
            </div>
          )}

          {/* --- 5.9 MEDIA --- */}
          {generalTab === 'media' && (
            <div className="p-4 rounded-xl bg-[#141417] border border-[#27272a] space-y-3">
              <h3 className="text-xs font-bold text-white">Live Stream & Official Photo Albums</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-lg bg-[#18181b] border border-[#27272a] space-y-2">
                  <span className="font-bold text-white block">Official YouTube / Twitch Stream</span>
                  <input
                    type="text"
                    defaultValue="https://youtube.com/live/danceone-national-championship"
                    className="w-full px-2.5 py-1 bg-[#202024] border border-[#27272a] rounded text-xs text-white outline-none"
                  />
                  <span className="text-xs text-[#22c55e]">Live Feed Connected</span>
                </div>
                <div className="p-3 rounded-lg bg-[#18181b] border border-[#27272a] space-y-2">
                  <span className="font-bold text-white block">Official Photography Google Drive / DropBox</span>
                  <input
                    type="text"
                    defaultValue="https://drive.google.com/drive/folders/danceone-finals-photos"
                    className="w-full px-2.5 py-1 bg-[#202024] border border-[#27272a] rounded text-xs text-white outline-none"
                  />
                  <span className="text-xs text-[#a1a1aa]">Shared with all athletes</span>
                </div>
              </div>
            </div>
          )}

          {/* --- 5.10 FEEDBACK --- */}
          {generalTab === 'feedback' && (
            <div className="p-4 rounded-xl bg-[#141417] border border-[#27272a] space-y-3">
              <h3 className="text-xs font-bold text-white">Post-Event Feedback & Fairness Audits</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 rounded-lg bg-[#18181b] border border-[#27272a] text-center">
                  <span className="text-xs text-[#71717a] block">Judging Fairness</span>
                  <span className="text-lg font-bold text-[#eab308]">4.9 / 5.0</span>
                </div>
                <div className="p-3 rounded-lg bg-[#18181b] border border-[#27272a] text-center">
                  <span className="text-xs text-[#71717a] block">Venue & Stage Setup</span>
                  <span className="text-lg font-bold text-[#eab308]">4.8 / 5.0</span>
                </div>
                <div className="p-3 rounded-lg bg-[#18181b] border border-[#27272a] text-center">
                  <span className="text-xs text-[#71717a] block">Sound & DJ Experience</span>
                  <span className="text-lg font-bold text-[#eab308]">4.9 / 5.0</span>
                </div>
              </div>
            </div>
          )}

          {/* --- 5.11 ANALYTICS --- */}
          {generalTab === 'analytics' && (
            <div className="p-4 rounded-xl bg-[#141417] border border-[#27272a] space-y-3">
              <h3 className="text-xs font-bold text-white">Attendee Demographics & Conversion Velocity</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 rounded-lg bg-[#18181b] border border-[#27272a]">
                  <span className="text-xs text-[#71717a] block">Peak Registration Velocity</span>
                  <span className="text-sm font-bold text-white block mt-1">42 passes / hour</span>
                  <span className="text-xs text-[#22c55e]">During Early-Bird Window</span>
                </div>
                <div className="p-3 rounded-lg bg-[#18181b] border border-[#27272a]">
                  <span className="text-xs text-[#71717a] block">Top Dancer Cities</span>
                  <span className="text-sm font-bold text-white block mt-1">Mumbai (52%), Pune (28%)</span>
                </div>
                <div className="p-3 rounded-lg bg-[#18181b] border border-[#27272a]">
                  <span className="text-xs text-[#71717a] block">Age Split</span>
                  <span className="text-sm font-bold text-white block mt-1">16-24 (68%), 25-34 (32%)</span>
                </div>
              </div>
            </div>
          )}

          {/* --- 5.12 SETTINGS --- */}
          {generalTab === 'settings' && (
            <div className="p-4 rounded-xl bg-[#141417] border border-[#27272a] space-y-3">
              <h3 className="text-xs font-bold text-white">Event Governance & Visibility Controls</h3>
              <div className="space-y-2 text-xs">
                <div className="p-3 rounded-lg bg-[#18181b] border border-[#27272a] flex items-center justify-between">
                  <div>
                    <span className="font-bold text-white block">Public Discovery</span>
                    <span className="text-xs text-[#a1a1aa]">Show event on DanceOne homepage and explore feeds.</span>
                  </div>
                  <input
                    type="checkbox"
                    defaultChecked={event.isPublic}
                    onChange={(e) => onUpdateEvent({ ...event, isPublic: e.target.checked })}
                    className="w-4 h-4 accent-[#eab308]"
                  />
                </div>

                <div className="p-3 rounded-lg bg-[#18181b] border border-[#27272a] flex items-center justify-between">
                  <div>
                    <span className="font-bold text-white block">Automated Participant Certificate Generation</span>
                    <span className="text-xs text-[#a1a1aa]">Generate digital certificate on gate check-in.</span>
                  </div>
                  <input type="checkbox" defaultChecked className="w-4 h-4 accent-[#eab308]" />
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ======================================================================= */}
      {/* 6. CONTENT PANELS: SPECIALIZED EVENT ENGINE */}
      {/* ======================================================================= */}
      {activeCategory === 'specialized' && (
        <div className="space-y-4">
          {/* COMPETITION SPECIALIZED SUBSECTIONS */}
          {isComp && (
            <div className="p-4 rounded-xl bg-[#141417] border border-[#27272a] space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold text-white capitalize">
                    Competition Engine: {specializedTab.replace(/_/g, ' ')}
                  </h3>
                  <p className="text-xs text-[#a1a1aa]">
                    Category divisions, judge scoring criteria, live point matrices, and podium rankings.
                  </p>
                </div>
                <button
                  onClick={() => setShowJudgePortal(true)}
                  className="px-2.5 py-1 bg-[#eab308] text-black text-xs font-bold rounded-lg flex items-center gap-1"
                >
                  <Shield className="w-3 h-3" />
                  <span>Open Judge Pad</span>
                </button>
              </div>

              {/* RENDER DEDICATED VIEW ACCORDING TO SPECIALIZED TAB */}
              {specializedTab === 'categories' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                  {(event.categories || [
                    { id: 'cat-1', name: 'Solo Hip Hop Open', dancersCount: 45, status: 'Live' },
                    { id: 'cat-2', name: 'Duo All Styles', dancersCount: 24, status: 'Upcoming' },
                    { id: 'cat-3', name: 'MegaCrew Championship', dancersCount: 12, status: 'Upcoming' },
                    { id: 'cat-4', name: 'Popping 1v1 Division', dancersCount: 32, status: 'Completed' },
                  ]).map((cat: any) => (
                    <div key={cat.id} className="p-3 rounded-lg bg-[#18181b] border border-[#27272a] space-y-1">
                      <span className="text-xs font-bold text-white block">{cat.name}</span>
                      <span className="text-xs text-[#a1a1aa] block">{cat.dancersCount || 30} Registered Entries</span>
                      <span className="text-xs font-bold text-[#eab308] bg-[#202024] px-1.5 py-0.5 rounded">
                        {cat.status || 'Active'}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {specializedTab === 'custom_scoring' && (
                <div className="space-y-2 text-xs">
                  {[
                    { name: 'Technique & Body Mechanics', weight: '30%', max: '10 pts' },
                    { name: 'Musicality & Rhythm Sync', weight: '25%', max: '10 pts' },
                    { name: 'Choreography & Creativity', weight: '20%', max: '10 pts' },
                    { name: 'Stage Presence & Projection', weight: '15%', max: '10 pts' },
                    { name: 'Costume & Neatness', weight: '10%', max: '10 pts' },
                  ].map((crit, idx) => (
                    <div key={idx} className="p-2.5 rounded-lg bg-[#18181b] border border-[#27272a] flex items-center justify-between">
                      <span className="font-bold text-white">{crit.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-[#eab308] font-bold bg-[#202024] px-2 py-0.5 rounded">{crit.weight}</span>
                        <span className="text-xs text-[#a1a1aa]">{crit.max}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {(specializedTab === 'live_scoring' ||
                specializedTab === 'score_sheets' ||
                specializedTab === 'rounds_heats' ||
                specializedTab === 'judges' ||
                specializedTab === 'results' ||
                specializedTab === 'rankings' ||
                specializedTab === 'certificates' ||
                specializedTab === 'awards') && (
                <div className="p-3 rounded-lg bg-[#18181b] border border-[#27272a] space-y-2">
                  <span className="text-xs font-bold text-white block">
                    {specializedTab.replace(/_/g, ' ').toUpperCase()} Live Table
                  </span>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-[#202024] text-xs text-[#a1a1aa] uppercase font-bold">
                        <tr>
                          <th className="p-2">Rank</th>
                          <th className="p-2">Dancer</th>
                          <th className="p-2">Bib</th>
                          <th className="p-2">Score</th>
                          <th className="p-2">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#27272a]">
                        <tr className="hover:bg-[#202024]/50">
                          <td className="p-2 font-bold text-[#eab308]">🥇 1st Place</td>
                          <td className="p-2 font-bold text-white">Aryan 'Flash' Verma</td>
                          <td className="p-2 font-mono text-[#a1a1aa]">#12</td>
                          <td className="p-2 font-bold text-[#22c55e]">94.50</td>
                          <td className="p-2 text-xs text-[#22c55e]">Podium Confirmed</td>
                        </tr>
                        <tr className="hover:bg-[#202024]/50">
                          <td className="p-2 font-bold text-zinc-300">🥈 2nd Place</td>
                          <td className="p-2 font-bold text-white">Sneha 'Flow' Kapoor</td>
                          <td className="p-2 font-mono text-[#a1a1aa]">#07</td>
                          <td className="p-2 font-bold text-[#22c55e]">92.80</td>
                          <td className="p-2 text-xs text-[#22c55e]">Podium Confirmed</td>
                        </tr>
                        <tr className="hover:bg-[#202024]/50">
                          <td className="p-2 font-bold text-amber-600">🥉 3rd Place</td>
                          <td className="p-2 font-bold text-white">Rohan 'Wave' Rao</td>
                          <td className="p-2 font-mono text-[#a1a1aa]">#19</td>
                          <td className="p-2 font-bold text-[#22c55e]">89.20</td>
                          <td className="p-2 text-xs text-[#22c55e]">Podium Confirmed</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* BATTLE SPECIALIZED SUBSECTIONS */}
          {isBattle && (
            <div className="p-4 rounded-xl bg-[#141417] border border-[#27272a] space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold text-white capitalize">
                    Battle Engine: {specializedTab.replace(/_/g, ' ')}
                  </h3>
                  <p className="text-xs text-[#a1a1aa]">
                    1v1 / 2v2 Tournament brackets, live timer gong, DJ music markers, and MC cues.
                  </p>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setShowMCPortal(true)}
                    className="px-2.5 py-1 bg-[#27272a] text-white text-xs font-bold rounded-lg flex items-center gap-1"
                  >
                    <Mic className="w-3 h-3 text-cyan-400" />
                    <span>MC Screen</span>
                  </button>
                  <button
                    onClick={() => setShowJudgePortal(true)}
                    className="px-2.5 py-1 bg-[#eab308] text-black text-xs font-bold rounded-lg flex items-center gap-1"
                  >
                    <Shield className="w-3 h-3" />
                    <span>Judge Votes</span>
                  </button>
                </div>
              </div>

              {/* Tournament Bracket Preview */}
              <div className="p-3 rounded-lg bg-[#18181b] border border-[#27272a] space-y-3">
                <div className="flex items-center justify-between border-b border-[#27272a] pb-2">
                  <span className="text-xs font-bold text-white">Active Matchup (Quarter-Final 1)</span>
                  <span className="text-xs text-rose-400 font-bold uppercase bg-rose-500/20 px-2 py-0.5 rounded">
                    🔴 Live on Floor
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-lg bg-[#202024] border border-blue-500/40 space-y-1">
                    <span className="text-xs font-bold text-blue-400 uppercase">Blue Corner</span>
                    <h4 className="text-sm font-bold text-white">B-Boy Tornado (Bib #14)</h4>
                    <span className="text-xs text-[#a1a1aa]">Crew: Underground Breakers</span>
                    <div className="pt-2 flex items-center gap-2">
                      <span className="text-xs font-bold text-[#eab308]">Judge Votes: 2</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-[#202024] border border-rose-500/40 space-y-1">
                    <span className="text-xs font-bold text-rose-400 uppercase">Red Corner</span>
                    <h4 className="text-sm font-bold text-white">Lil C (Bib #09)</h4>
                    <span className="text-xs text-[#a1a1aa]">Crew: Raw Krump Squad</span>
                    <div className="pt-2 flex items-center gap-2">
                      <span className="text-xs font-bold text-[#eab308]">Judge Votes: 1</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SHOW SPECIALIZED SUBSECTIONS */}
          {isShow && (
            <div className="p-4 rounded-xl bg-[#141417] border border-[#27272a] space-y-3">
              <h3 className="text-xs font-bold text-white capitalize">
                Show & Showcase Engine: {specializedTab.replace(/_/g, ' ')}
              </h3>
              <div className="p-3 rounded-lg bg-[#18181b] border border-[#27272a] space-y-2 text-xs">
                {[
                  { act: 'Act 1: Opening Contemporary Ensemble', time: '07:00 PM', duration: '6 mins', status: 'Completed' },
                  { act: 'Act 2: Hip Hop MegaCrew Invitational', time: '07:15 PM', duration: '8 mins', status: 'On Stage' },
                  { act: 'Act 3: Classical Fusion Solo by Priya', time: '07:30 PM', duration: '5 mins', status: 'In Green Room' },
                  { act: 'Act 4: Grand Finale Troupe', time: '08:00 PM', duration: '12 mins', status: 'Standby' },
                ].map((a, idx) => (
                  <div key={idx} className="p-2.5 rounded-lg bg-[#202024] flex items-center justify-between">
                    <div>
                      <span className="font-bold text-white block">{a.act}</span>
                      <span className="text-xs text-[#a1a1aa]">{a.time} • {a.duration}</span>
                    </div>
                    <span className="text-xs font-bold px-1.5 py-0.5 rounded bg-[#27272a] text-[#eab308]">
                      {a.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* WORKSHOP / MASTERCLASS SPECIALIZED SUBSECTIONS */}
          {isWorkshop && (
            <div className="p-4 rounded-xl bg-[#141417] border border-[#27272a] space-y-3">
              <h3 className="text-xs font-bold text-white capitalize">
                Workshop & Intensive Engine: {specializedTab.replace(/_/g, ' ')}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-lg bg-[#18181b] border border-[#27272a] space-y-2">
                  <span className="text-xs font-bold text-[#eab308] uppercase">Master Faculty</span>
                  <h4 className="text-sm font-bold text-white">Suresh Mukund (Kings United)</h4>
                  <span className="text-xs text-[#a1a1aa] block">Hip Hop Urban Choreography Intensive</span>
                  <span className="text-xs text-[#22c55e]">Capacity: 50 / 50 (Sold Out)</span>
                </div>
                <div className="p-3 rounded-lg bg-[#18181b] border border-[#27272a] space-y-2">
                  <span className="text-xs font-bold text-[#eab308] uppercase">Master Faculty</span>
                  <h4 className="text-sm font-bold text-white">Riya Sen</h4>
                  <span className="text-xs text-[#a1a1aa] block">Heels Commercial & Floorwork Masterclass</span>
                  <span className="text-xs text-[#22c55e]">Capacity: 38 / 45 Enrolled</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ======================================================================= */}
      {/* 7. GLOBAL MODALS FOR THE WORKSPACE */}
      {/* ======================================================================= */}
      {showJudgePortal && (
        <JudgePortalModal
          event={event}
          onClose={() => setShowJudgePortal(false)}
          onUpdateEvent={onUpdateEvent}
        />
      )}

      {showMCPortal && (
        <MCPortalModal event={event} onClose={() => setShowMCPortal(false)} />
      )}

      {showBroadcastModal && (
        <CommunicationBroadcastModal
          event={event}
          onClose={() => setShowBroadcastModal(false)}
          onUpdateEvent={onUpdateEvent}
        />
      )}
    </div>
  );
};

