import React, { useState } from 'react';
import {
  GraduationCap,
  Tent,
  Users,
  Calendar,
  Clock,
  MapPin,
  DollarSign,
  Award,
  CheckCircle2,
  AlertCircle,
  Plus,
  BedDouble,
  FileSpreadsheet,
  Share2,
  Sparkles,
} from 'lucide-react';
import {
  OrganizerEventRecord,
  WorkshopSession,
  CampPass,
} from '../../types/organizer';

interface WorkshopCampWorkspaceProps {
  event: OrganizerEventRecord;
  onUpdateEvent: (updatedEvent: OrganizerEventRecord) => void;
  onOpenControlCenter: () => void;
}

export const WorkshopCampWorkspace: React.FC<WorkshopCampWorkspaceProps> = ({
  event,
  onUpdateEvent,
  onOpenControlCenter,
}) => {
  const [activeTab, setActiveTab] = useState<'sessions_timetable' | 'faculty_payouts' | 'passes_lodging' | 'certificates'>(
    'sessions_timetable'
  );

  const sessions = event.workshopSessions || [];
  const campPasses = event.campPasses || [];

  // Toggle Payout status for instructor
  const handleTogglePayout = (sessionId: string) => {
    const updated = sessions.map((s) => {
      if (s.id === sessionId) {
        return {
          ...s,
          payoutStatus: s.payoutStatus === 'Paid' ? ('Pending' as const) : ('Paid' as const),
        };
      }
      return s;
    });
    onUpdateEvent({ ...event, workshopSessions: updated });
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-5 rounded-3xl bg-[#18181b] border border-[#27272a] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-black uppercase tracking-wider bg-blue-500/20 text-blue-400 border border-blue-500/40">
              {event.type === 'dance_camp' ? 'RESIDENTIAL DANCE CAMP & FESTIVAL' : 'MASTERCLASS & WORKSHOP SERIES'}
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e] animate-pulse" />
            <span className="text-xs font-bold text-[#22c55e]">
              Enrollment & Attendance Sync Active
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">{event.title}</h2>
          <p className="text-xs text-[#a1a1aa]">
            Timetable matrix, faculty remuneration, camp pass allocations, and automated certificate issuance.
          </p>
        </div>

        <button
          onClick={onOpenControlCenter}
          className="px-5 py-2.5 rounded-2xl bg-[#eab308] hover:bg-[#facc15] text-black text-xs font-black shadow-lg flex items-center gap-2 transition-all self-start sm:self-auto"
        >
          <span>Control Center</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 bg-[#18181b] p-1.5 rounded-2xl border border-[#27272a] overflow-x-auto no-scrollbar">
        {[
          { id: 'sessions_timetable', label: 'Sessions & Timetable Matrix', icon: Calendar },
          { id: 'faculty_payouts', label: 'Master Instructors & Payouts', icon: DollarSign },
          ...(event.type === 'dance_camp' || event.type === 'festival'
            ? [{ id: 'passes_lodging', label: 'Camp Passes & Lodging', icon: BedDouble }]
            : []),
          { id: 'certificates', label: 'Workshop Attendance & Certificates', icon: Award },
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

      {/* TAB 1: SESSIONS & TIMETABLE MATRIX */}
      {activeTab === 'sessions_timetable' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-black text-white">Masterclass Timetable & Capacity</h3>
            <span className="text-xs text-[#a1a1aa]">{sessions.length} Scheduled Masterclasses</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sessions.map((ws) => (
              <div
                key={ws.id}
                className="p-5 rounded-3xl bg-[#18181b] border border-[#27272a] space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-500/20 text-blue-400">
                      {ws.level}
                    </span>
                    <span className="text-xs font-bold text-[#eab308]">₹{ws.price} / Dancer</span>
                  </div>

                  <h4 className="text-base font-black text-white">{ws.title}</h4>

                  <div className="flex items-center gap-3 pt-1">
                    <img
                      src={ws.instructorAvatar}
                      alt={ws.instructorName}
                      className="w-10 h-10 rounded-full object-cover border border-[#3f3f46]"
                    />
                    <div>
                      <span className="text-xs font-bold text-white block">{ws.instructorName}</span>
                      <span className="text-xs text-[#71717a]">{ws.danceStyle}</span>
                    </div>
                  </div>

                  <div className="text-xs text-[#a1a1aa] space-y-1 pt-2">
                    <p>📅 {ws.date} • ⏰ {ws.timeRange}</p>
                    <p>📍 {ws.venueRoom}</p>
                  </div>
                </div>

                {/* Capacity Gauge */}
                <div className="space-y-1.5 pt-2 border-t border-[#27272a]">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#a1a1aa]">Capacity: {ws.bookedCount} / {ws.capacity} Booked</span>
                    <span className="text-amber-400 font-bold">
                      {ws.waitlistCount > 0 ? `${ws.waitlistCount} On Waitlist` : 'Spots Available'}
                    </span>
                  </div>
                  <div className="w-full bg-[#27272a] h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-blue-500 h-full rounded-full"
                      style={{ width: `${(ws.bookedCount / ws.capacity) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: FACULTY & PAYOUTS */}
      {activeTab === 'faculty_payouts' && (
        <div className="space-y-4">
          <div className="p-5 rounded-3xl bg-[#18181b] border border-[#27272a] space-y-4">
            <h3 className="text-base font-black text-white">Master Instructor Remuneration Ledger</h3>

            <div className="rounded-2xl border border-[#27272a] overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#202024] text-[#a1a1aa] font-bold uppercase text-xs tracking-wider border-b border-[#27272a]">
                  <tr>
                    <th className="py-3 px-4">Instructor</th>
                    <th className="py-3 px-4">Masterclass</th>
                    <th className="py-3 px-4">Payout Model</th>
                    <th className="py-3 px-4">Total Remuneration</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#27272a]">
                  {sessions.map((ws) => (
                    <tr key={ws.id} className="hover:bg-[#202024]/60 transition-colors">
                      <td className="py-3 px-4 font-bold text-white">{ws.instructorName}</td>
                      <td className="py-3 px-4 text-[#d4d4d8]">{ws.title}</td>
                      <td className="py-3 px-4 text-[#a1a1aa]">{ws.instructorPayoutModel}</td>
                      <td className="py-3 px-4 font-black text-[#eab308]">
                        ₹{ws.instructorPayoutAmount.toLocaleString()}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                            ws.payoutStatus === 'Paid'
                              ? 'bg-[#22c55e]/20 text-[#22c55e]'
                              : 'bg-amber-500/20 text-amber-400'
                          }`}
                        >
                          {ws.payoutStatus}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => handleTogglePayout(ws.id)}
                          className="px-3 py-1 bg-[#27272a] hover:bg-[#3f3f46] text-white text-xs font-bold rounded-xl"
                        >
                          {ws.payoutStatus === 'Paid' ? 'Mark Pending' : 'Record Payout'}
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

      {/* TAB 3: CAMP PASSES & LODGING */}
      {activeTab === 'passes_lodging' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {campPasses.map((pass) => (
              <div
                key={pass.id}
                className="p-5 rounded-3xl bg-[#18181b] border border-[#27272a] space-y-3 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-base font-black text-white">{pass.name}</span>
                    <span className="text-lg font-black text-[#eab308]">₹{pass.price.toLocaleString()}</span>
                  </div>
                  <span className="text-xs text-[#a1a1aa] block mt-1">📅 {pass.validDays}</span>

                  <div className="mt-3 space-y-1">
                    {pass.inclusions.map((inc, i) => (
                      <span key={i} className="text-xs text-[#d4d4d8] block">
                        ✓ {inc}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-[#27272a] flex items-center justify-between text-xs">
                  <span className="text-[#a1a1aa]">Sold: {pass.sold} of {pass.capacity} Passes</span>
                  <span className="text-[#22c55e] font-bold">
                    {pass.accommodationIncluded ? 'Villa Stay Included' : 'Workshop Only'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: CERTIFICATES */}
      {activeTab === 'certificates' && (
        <div className="p-6 rounded-3xl bg-[#18181b] border border-[#27272a] text-center space-y-4">
          <Award className="w-10 h-10 text-[#eab308] mx-auto" />
          <h3 className="text-lg font-black text-white">Workshop Participation Certificates</h3>
          <p className="text-xs text-[#a1a1aa] max-w-md mx-auto">
            1-Click automated distribution of verified DanceOne Masterclass Completion Certificates with instructor digital signatures.
          </p>
          <button
            onClick={() => alert('Dispatched digital certificates to all 98 registered workshop attendees!')}
            className="px-6 py-2.5 rounded-2xl bg-[#eab308] text-black text-xs font-black shadow-lg"
          >
            Dispatch All Workshop Certificates
          </button>
        </div>
      )}
    </div>
  );
};

