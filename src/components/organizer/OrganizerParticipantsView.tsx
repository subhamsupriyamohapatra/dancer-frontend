import React, { useState } from 'react';
import {
  Users,
  Search,
  CheckCircle2,
  Lock,
  Unlock,
  Award,
  Sparkles,
  Download,
  Shield,
  UserCheck,
  QrCode,
  Plus,
  Star,
  Music,
  GraduationCap,
  Heart,
  ChevronRight,
  Filter,
  UserPlus,
} from 'lucide-react';
import { OrganizerEventRecord } from '../../types/organizer';

interface OrganizerParticipantsViewProps {
  events: OrganizerEventRecord[];
  onUpdateEvent?: (updatedEvent: OrganizerEventRecord) => void;
}

export const OrganizerParticipantsView: React.FC<OrganizerParticipantsViewProps> = ({
  events,
  onUpdateEvent,
}) => {
  // Segregated Participant Subtabs
  const [subTab, setSubTab] = useState<
    'dancers' | 'teams' | 'crews' | 'performers' | 'judges' | 'instructors' | 'guests' | 'check_in'
  >('dancers');

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEventId, setSelectedEventId] = useState<string>(events[0]?.id || '');

  // Local state for registered teams/crews/performers/faculty/guests
  const [teams, setTeams] = useState<Array<{ id: string; name: string; city: string; members: number; captain: string }>>([]);
  const [crews, setCrews] = useState<Array<{ id: string; name: string; style: string; members: number; bracket: string }>>([]);
  const [performers, setPerformers] = useState<Array<{ id: string; name: string; role: string; cueTime: string }>>([]);
  const [instructors, setInstructors] = useState<Array<{ id: string; name: string; style: string; fee: string }>>([]);
  const [guests, setGuests] = useState<Array<{ id: string; name: string; badge: string; wristband: string }>>([]);

  const activeEvent = events.find((e) => e.id === selectedEventId) || events[0];
  const participants = activeEvent?.participants || [];

  const filteredParticipants = participants.filter(
    (p) =>
      !searchQuery.trim() ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.bibNumber?.toString().includes(searchQuery) ||
      p.danceOneId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (events.length === 0 || !activeEvent) {
    return (
      <div className="p-12 text-center bg-[#141417] border border-[#27272a] rounded-2xl space-y-4 text-white">
        <div className="w-12 h-12 rounded-2xl bg-[#eab308]/10 text-[#eab308] flex items-center justify-center mx-auto border border-[#eab308]/20">
          <Users className="w-6 h-6" />
        </div>
        <div className="max-w-md mx-auto space-y-1.5">
          <h3 className="text-base font-bold text-white">No Event Participants</h3>
          <p className="text-xs text-[#a1a1aa] leading-relaxed">
            Create an event first to manage athlete registrations, battle brackets, judge rosters, and gate QR check-ins.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* 1. Header with Event Selector & Search */}
      <div className="bg-[#141417] border border-[#27272a] rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
        <div>
          <h2 className="text-sm sm:text-base font-bold text-white tracking-tight flex items-center gap-1.5">
            <Users className="w-4 h-4 text-[#eab308]" />
            <span>Participants & Talent Directory</span>
          </h2>
          <p className="text-xs text-[#a1a1aa]">
            Comprehensive athlete profiles, crew rosters, judge panels, faculty, and gate check-in status.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <select
            value={selectedEventId || activeEvent.id}
            onChange={(e) => setSelectedEventId(e.target.value)}
            className="px-2.5 py-1.5 bg-[#18181b] border border-[#27272a] rounded-xl text-xs font-bold text-white outline-none"
          >
            {events.map((ev) => (
              <option key={ev.id} value={ev.id}>
                {ev.title} ({ev.registeredCount || ev.participants?.length || 0})
              </option>
            ))}
          </select>

          <div className="relative">
            <Search className="absolute left-2.5 top-2 w-3 h-3 text-[#71717a]" />
            <input
              type="text"
              placeholder="Search talent, bib, ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-7 pr-3 py-1.5 bg-[#18181b] border border-[#27272a] rounded-xl text-xs text-white outline-none w-44"
            />
          </div>
        </div>
      </div>

      {/* 2. Segregated Sub-Navigation Tabs */}
      <div className="flex items-center bg-[#141417] p-1 rounded-xl border border-[#27272a] overflow-x-auto no-scrollbar gap-1">
        {[
          { id: 'dancers', label: 'Dancers', count: participants.length },
          { id: 'teams', label: 'Teams', count: teams.length },
          { id: 'crews', label: 'Crews', count: crews.length },
          { id: 'performers', label: 'Performers', count: performers.length },
          { id: 'judges', label: 'Judges', count: activeEvent.judges?.length || 0 },
          { id: 'instructors', label: 'Instructors', count: instructors.length },
          { id: 'guests', label: 'Guests / VIPs', count: guests.length },
          { id: 'check_in', label: 'Gate Check-in', count: `${participants.filter((p) => p.checkedIn).length}/${participants.length}` },
        ].map((tab) => {
          const isActive = subTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setSubTab(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap flex items-center gap-1.5 transition-all ${
                isActive
                  ? 'bg-[#27272a] text-white font-bold border border-[#3f3f46]'
                  : 'text-[#a1a1aa] hover:text-white hover:bg-[#18181b]'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`text-xs px-1.5 py-0.2 rounded-full font-mono ${
                  isActive ? 'bg-[#eab308] text-black font-bold' : 'bg-[#202024] text-[#71717a]'
                }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* 3. Sub-View Contents */}
      {/* 3.1 DANCERS */}
      {subTab === 'dancers' && (
        <div className="p-4 rounded-xl bg-[#141417] border border-[#27272a] space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white">Registered Individual Athletes ({filteredParticipants.length})</span>
            {filteredParticipants.length > 0 && (
              <button
                onClick={() => alert('Batch issued merit certificates to all checked-in athletes!')}
                className="px-2.5 py-1 bg-[#27272a] hover:bg-[#3f3f46] text-white text-xs font-medium rounded-lg flex items-center gap-1"
              >
                <Award className="w-3 h-3 text-[#eab308]" />
                <span>Batch Issue Merit Certs</span>
              </button>
            )}
          </div>

          {filteredParticipants.length === 0 ? (
            <div className="p-8 text-center bg-[#18181b] border border-[#27272a] rounded-xl space-y-2">
              <Users className="w-6 h-6 text-[#71717a] mx-auto opacity-60" />
              <p className="text-xs text-[#a1a1aa]">No athletes registered yet for this event.</p>
              <p className="text-xs text-[#71717a]">
                Athletes who register online through DanceOne or are added on-spot will appear in this roster.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto border border-[#27272a] rounded-lg">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#18181b] text-xs text-[#a1a1aa] uppercase font-bold border-b border-[#27272a]">
                  <tr>
                    <th className="p-2.5">Bib</th>
                    <th className="p-2.5">Athlete</th>
                    <th className="p-2.5">DanceOne ID</th>
                    <th className="p-2.5">Category</th>
                    <th className="p-2.5">Check-In</th>
                    <th className="p-2.5">Cert Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#27272a]">
                  {filteredParticipants.map((p) => (
                    <tr key={p.id} className="hover:bg-[#18181b]/50">
                      <td className="p-2.5 font-mono text-[#eab308] font-bold">#{p.bibNumber}</td>
                      <td className="p-2.5 font-bold text-white">{p.name}</td>
                      <td className="p-2.5 font-mono text-xs text-[#a1a1aa]">{p.danceOneId || '—'}</td>
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
                      <td className="p-2.5 text-xs text-[#a1a1aa]">
                        {p.certificateIssued ? 'Issued' : 'Ready'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* 3.2 TEAMS */}
      {subTab === 'teams' && (
        <div className="p-4 rounded-xl bg-[#141417] border border-[#27272a] space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white">Registered Studio & Academy Teams ({teams.length})</span>
            <button
              onClick={() => {
                const name = prompt('Enter Studio / Academy Team Name:');
                if (name) {
                  const city = prompt('Enter City:', 'Mumbai') || 'Local';
                  const captain = prompt('Enter Captain Name:', '') || 'TBD';
                  setTeams([...teams, { id: `team-${Date.now()}`, name, city, members: 10, captain }]);
                }
              }}
              className="px-2.5 py-1 bg-[#eab308] hover:bg-[#facc15] text-black text-xs font-bold rounded-lg flex items-center gap-1"
            >
              <Plus className="w-3 h-3" />
              <span>Register Team</span>
            </button>
          </div>

          {teams.length === 0 ? (
            <div className="p-8 text-center bg-[#18181b] border border-[#27272a] rounded-xl space-y-2">
              <Users className="w-6 h-6 text-[#71717a] mx-auto opacity-60" />
              <p className="text-xs text-[#a1a1aa]">No studio or academy teams registered yet.</p>
              <p className="text-xs text-[#71717a]">
                Click "+ Register Team" to register a dance academy or troupe roster.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {teams.map((t) => (
                <div key={t.id} className="p-3 rounded-lg bg-[#18181b] border border-[#27272a] space-y-1.5">
                  <span className="text-xs font-bold text-white block">{t.name}</span>
                  <span className="text-xs text-[#a1a1aa] block">{t.city} • Captain: {t.captain}</span>
                  <div className="flex items-center justify-between text-xs pt-1 border-t border-[#27272a]">
                    <span className="text-[#eab308] font-bold">{t.members} Dancers</span>
                    <span className="text-[#22c55e]">Registered</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 3.3 CREWS */}
      {subTab === 'crews' && (
        <div className="p-4 rounded-xl bg-[#141417] border border-[#27272a] space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white">Battle & Showcase Crews ({crews.length})</span>
            <button
              onClick={() => {
                const name = prompt('Enter Crew Name:');
                if (name) {
                  const style = prompt('Enter Dance Style (e.g. Breaking, Hip-Hop, All-Styles):', 'Breaking') || 'All-Styles';
                  setCrews([...crews, { id: `crew-${Date.now()}`, name, style, members: 5, bracket: 'Open' }]);
                }
              }}
              className="px-2.5 py-1 bg-[#eab308] hover:bg-[#facc15] text-black text-xs font-bold rounded-lg flex items-center gap-1"
            >
              <Plus className="w-3 h-3" />
              <span>Add Crew</span>
            </button>
          </div>

          {crews.length === 0 ? (
            <div className="p-8 text-center bg-[#18181b] border border-[#27272a] rounded-xl space-y-2">
              <Users className="w-6 h-6 text-[#71717a] mx-auto opacity-60" />
              <p className="text-xs text-[#a1a1aa]">No crews entered yet.</p>
              <p className="text-xs text-[#71717a]">
                Register battle squads and mega-crews to configure bracket seeding.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {crews.map((c) => (
                <div key={c.id} className="p-3 rounded-lg bg-[#18181b] border border-[#27272a] space-y-1">
                  <span className="text-xs font-bold text-white block">{c.name}</span>
                  <span className="text-xs text-[#a1a1aa] block">{c.style} • {c.members} Members</span>
                  <span className="text-xs font-bold bg-[#202024] px-1.5 py-0.5 rounded text-[#eab308]">
                    Bracket: {c.bracket}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 3.4 PERFORMERS */}
      {subTab === 'performers' && (
        <div className="p-4 rounded-xl bg-[#141417] border border-[#27272a] space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white">Guest Acts & Special Performers ({performers.length})</span>
            <button
              onClick={() => {
                const name = prompt('Enter Performer or Showcase Act Name:');
                if (name) {
                  const role = prompt('Enter Role / Act Type (e.g. Opening Act, Halftime):', 'Showcase Act') || 'Showcase';
                  const cueTime = prompt('Enter Cue Time (e.g. 07:30 PM):', '08:00 PM') || '08:00 PM';
                  setPerformers([...performers, { id: `perf-${Date.now()}`, name, role, cueTime }]);
                }
              }}
              className="px-2.5 py-1 bg-[#eab308] hover:bg-[#facc15] text-black text-xs font-bold rounded-lg flex items-center gap-1"
            >
              <Plus className="w-3 h-3" />
              <span>Add Performer</span>
            </button>
          </div>

          {performers.length === 0 ? (
            <div className="p-8 text-center bg-[#18181b] border border-[#27272a] rounded-xl space-y-2">
              <Sparkles className="w-6 h-6 text-[#71717a] mx-auto opacity-60" />
              <p className="text-xs text-[#a1a1aa]">No guest performers or showcase acts added yet.</p>
              <p className="text-xs text-[#71717a]">
                Schedule interval performances, opening numbers, and judge exhibition cyphers.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {performers.map((perf) => (
                <div key={perf.id} className="p-3 rounded-lg bg-[#18181b] border border-[#27272a] flex items-center justify-between">
                  <div>
                    <span className="font-bold text-white block">{perf.name}</span>
                    <span className="text-xs text-[#a1a1aa]">{perf.role}</span>
                  </div>
                  <span className="text-xs font-mono text-[#eab308]">{perf.cueTime}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 3.5 JUDGES */}
      {subTab === 'judges' && (
        <div className="p-4 rounded-xl bg-[#141417] border border-[#27272a] space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white">Official Adjudicator Panel</span>
          </div>

          {!activeEvent.judges || activeEvent.judges.length === 0 ? (
            <div className="p-8 text-center bg-[#18181b] border border-[#27272a] rounded-xl space-y-2">
              <Shield className="w-6 h-6 text-[#71717a] mx-auto opacity-60" />
              <p className="text-xs text-[#a1a1aa]">No judges assigned to this event yet.</p>
              <p className="text-xs text-[#71717a]">
                Assign verified adjudicators from the Staff & Permissions view or event settings.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {activeEvent.judges.map((jId, idx) => (
                <div key={idx} className="p-3 rounded-lg bg-[#18181b] border border-[#27272a] space-y-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-[#27272a] flex items-center justify-center text-xs font-bold text-[#eab308]">
                      J{idx + 1}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">Judge #{idx + 1}</h4>
                      <span className="text-xs font-mono text-[#a1a1aa]">{jId}</span>
                    </div>
                  </div>
                  <div className="text-xs text-[#a1a1aa] flex justify-between border-t border-[#27272a] pt-1">
                    <span>Scoring Portal</span>
                    <span className="text-[#22c55e]">Active</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 3.6 INSTRUCTORS */}
      {subTab === 'instructors' && (
        <div className="p-4 rounded-xl bg-[#141417] border border-[#27272a] space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white">Masterclass Faculty & Workshop Teachers ({instructors.length})</span>
            <button
              onClick={() => {
                const name = prompt('Enter Instructor / Faculty Name:');
                if (name) {
                  const style = prompt('Enter Dance Style / Topic:', 'Choreography') || 'Dance';
                  const fee = prompt('Enter Agreed Payout / Fee (e.g. ₹20,000):', '₹20,000') || '₹0';
                  setInstructors([...instructors, { id: `inst-${Date.now()}`, name, style, fee }]);
                }
              }}
              className="px-2.5 py-1 bg-[#eab308] hover:bg-[#facc15] text-black text-xs font-bold rounded-lg flex items-center gap-1"
            >
              <Plus className="w-3 h-3" />
              <span>Add Instructor</span>
            </button>
          </div>

          {instructors.length === 0 ? (
            <div className="p-8 text-center bg-[#18181b] border border-[#27272a] rounded-xl space-y-2">
              <GraduationCap className="w-6 h-6 text-[#71717a] mx-auto opacity-60" />
              <p className="text-xs text-[#a1a1aa]">No workshop instructors added yet.</p>
              <p className="text-xs text-[#71717a]">
                Add faculty members and configure their masterclass sessions.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {instructors.map((inst) => (
                <div key={inst.id} className="p-3 rounded-lg bg-[#18181b] border border-[#27272a] flex items-center justify-between">
                  <div>
                    <span className="font-bold text-white block">{inst.name}</span>
                    <span className="text-xs text-[#a1a1aa]">{inst.style}</span>
                  </div>
                  <span className="text-xs font-mono font-bold text-[#22c55e]">{inst.fee}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 3.7 GUESTS */}
      {subTab === 'guests' && (
        <div className="p-4 rounded-xl bg-[#141417] border border-[#27272a] space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white">VIP Guests, Brand Sponsors & Press ({guests.length})</span>
            <button
              onClick={() => {
                const name = prompt('Enter VIP Guest / Organization Name:');
                if (name) {
                  const badge = prompt('Enter Badge Type (e.g. VIP All-Access, Sponsor, Press):', 'VIP All-Access') || 'VIP';
                  const wristband = `#VIP-${guests.length + 1}`;
                  setGuests([...guests, { id: `guest-${Date.now()}`, name, badge, wristband }]);
                }
              }}
              className="px-2.5 py-1 bg-[#eab308] hover:bg-[#facc15] text-black text-xs font-bold rounded-lg flex items-center gap-1"
            >
              <Plus className="w-3 h-3" />
              <span>Add VIP Guest</span>
            </button>
          </div>

          {guests.length === 0 ? (
            <div className="p-8 text-center bg-[#18181b] border border-[#27272a] rounded-xl space-y-2">
              <Star className="w-6 h-6 text-[#71717a] mx-auto opacity-60" />
              <p className="text-xs text-[#a1a1aa]">No VIP guests or press credentials issued yet.</p>
              <p className="text-xs text-[#71717a]">
                Issue personalized passes and wristbands for sponsors and special guests.
              </p>
            </div>
          ) : (
            <div className="space-y-2 text-xs">
              {guests.map((g) => (
                <div key={g.id} className="p-2.5 rounded-lg bg-[#18181b] border border-[#27272a] flex items-center justify-between">
                  <span className="font-bold text-white">{g.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs bg-[#202024] px-2 py-0.5 rounded text-[#a1a1aa]">{g.badge}</span>
                    <span className="text-xs font-mono text-[#eab308]">{g.wristband}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 3.8 CHECK-IN */}
      {subTab === 'check_in' && (
        <div className="p-4 rounded-xl bg-[#141417] border border-[#27272a] space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs font-bold text-white">Live Gate Scanner & QR Check-in Terminal</h3>
              <p className="text-xs text-[#a1a1aa]">Scan digital ticket QR code or manually verify attendee check-ins.</p>
            </div>
            <button
              onClick={() => alert('Camera scanner active for gate wristbands!')}
              className="px-2.5 py-1 bg-[#eab308] text-black text-xs font-bold rounded-lg flex items-center gap-1"
            >
              <QrCode className="w-3 h-3" />
              <span>Launch Camera Scanner</span>
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-2.5 rounded-lg bg-[#18181b] border border-[#27272a]">
              <span className="text-xs text-[#71717a] block">Total Registered</span>
              <span className="text-lg font-bold text-white">{participants.length}</span>
            </div>
            <div className="p-2.5 rounded-lg bg-[#18181b] border border-[#27272a]">
              <span className="text-xs text-[#71717a] block">Checked In</span>
              <span className="text-lg font-bold text-[#22c55e]">
                {participants.filter((p) => p.checkedIn).length}
              </span>
            </div>
            <div className="p-2.5 rounded-lg bg-[#18181b] border border-[#27272a]">
              <span className="text-xs text-[#71717a] block">Remaining at Gate</span>
              <span className="text-lg font-bold text-amber-400">
                {participants.filter((p) => !p.checkedIn).length}
              </span>
            </div>
            <div className="p-2.5 rounded-lg bg-[#18181b] border border-[#27272a]">
              <span className="text-xs text-[#71717a] block">Gate Flow Status</span>
              <span className="text-lg font-bold text-cyan-400">
                {participants.length > 0 ? 'Ready' : 'Idle'}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

