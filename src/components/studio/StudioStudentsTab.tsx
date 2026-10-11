import React, { useState } from 'react';
import {
  Users,
  Search,
  UserPlus,
  Mail,
  Phone,
  Sparkles,
  CheckCircle2,
  Clock,
  Send,
  Building2,
  Layers,
  ChevronRight,
  ShieldCheck,
  Check,
  Flame,
  Award,
  CircleDot,
} from 'lucide-react';
import { StudioStudent, StudioBatch } from '../../types';

interface StudioStudentsTabProps {
  students: StudioStudent[];
  batches: StudioBatch[];
  onOpenAddStudentModal: (defaultOption?: 1 | 2 | 3) => void;
  onGenerateInvoice: (studentName: string, amount: number, batch: string) => void;
}

type StudentsSubTab = 'All Students' | 'Active' | 'Pending Invites' | 'Trials' | 'Memberships';

export const StudioStudentsTab: React.FC<StudioStudentsTabProps> = ({
  students,
  batches,
  onOpenAddStudentModal,
  onGenerateInvoice,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<StudentsSubTab>('All Students');
  const [searchQuery, setSearchQuery] = useState('');

  // Trials data
  const TRIALS_DATA: Array<{ id: string; name: string; phone: string; email: string; danceOneId: string; classTitle: string; slot: string; status: string; fee: string }> = [];

  // Pending Invites data
  const PENDING_INVITES_DATA: Array<{ id: string; name: string; phone: string; email: string; batch: string; sentDate: string; inviteLink: string }> = [];

  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.phone.includes(searchQuery) ||
      s.danceOneId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.batchName.toLowerCase().includes(searchQuery.toLowerCase());

    if (activeSubTab === 'Active') return matchesSearch && s.status === 'Active';
    if (activeSubTab === 'Memberships') return matchesSearch && s.membershipType !== 'None';
    return matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* 1. DanceOne Ecosystem Identity Architecture Banner */}
      <div className="bg-[#18181b] p-5 rounded-3xl border border-[#27272a] relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 relative z-10">
          <div className="space-y-1.5 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider text-[#3b82f6] px-2 py-0.5 rounded-full bg-[#3b82f6]/15 border border-[#3b82f6]/30">
                UNIVERSAL DANCEONE IDENTITY
              </span>
              <span className="text-xs text-[#22c55e] font-semibold">● Zero Duplicate Profiles</span>
            </div>
            <h3 className="text-lg font-black text-white">One Universal Dancer Profile Across Studios</h3>
            <p className="text-xs text-[#a1a1aa] leading-relaxed">
              When a dancer attends batches at multiple studios, workshops, or competitions on DanceOne, they retain one single Dancer ID. Attendance, streak, achievements, and invoices sync automatically to their DanceOne app.
            </p>
          </div>

          {/* Visual Architecture Tree Diagram */}
          <div className="bg-[#09090b] p-3.5 rounded-2xl border border-[#27272a] text-xs font-mono text-[#a1a1aa] shrink-0">
            <div className="text-[#3b82f6] font-bold text-center pb-1 border-b border-[#27272a]">DANCEONE ACCOUNT</div>
            <div className="text-center text-[#71717a] py-0.5">│  ▼</div>
            <div className="text-white font-bold text-center bg-[#18181b] py-0.5 px-2 rounded">DANCER PROFILE</div>
            <div className="text-xs pt-1.5 space-y-0.5 text-[#71717a]">
              <div>├── Studio A <span className="text-[#10b981] font-semibold">(Batch 1)</span></div>
              <div>├── Studio B <span className="text-[#3b82f6] font-semibold">(Batch 3)</span></div>
              <div>└── Workshops <span className="text-[#a855f7] font-semibold">(Dance Passes)</span></div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Three Student Addition Options Quick Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div
          onClick={() => onOpenAddStudentModal(1)}
          className="p-4 rounded-2xl bg-[#18181b] border border-[#27272a] hover:border-[#3b82f6] cursor-pointer transition-all space-y-1.5 group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#3b82f6] uppercase tracking-wider">Option 1</span>
            <Search className="w-4 h-4 text-[#3b82f6] group-hover:scale-110 transition-transform" />
          </div>
          <h4 className="font-bold text-white text-sm">Add Existing Dancer</h4>
          <p className="text-xs text-[#a1a1aa]">
            Search by Name, Phone, Email, or DanceOne ID (e.g. <code>DO-89211</code>) and add to cohort.
          </p>
        </div>

        <div
          onClick={() => onOpenAddStudentModal(2)}
          className="p-4 rounded-2xl bg-[#18181b] border border-[#27272a] hover:border-[#10b981] cursor-pointer transition-all space-y-1.5 group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#10b981] uppercase tracking-wider">Option 2</span>
            <Mail className="w-4 h-4 text-[#10b981] group-hover:scale-110 transition-transform" />
          </div>
          <h4 className="font-bold text-white text-sm">Invite New Student</h4>
          <p className="text-xs text-[#a1a1aa]">
            Send an instant DanceOne invitation link via WhatsApp/SMS to join your studio.
          </p>
        </div>

        <div
          onClick={() => onOpenAddStudentModal(3)}
          className="p-4 rounded-2xl bg-[#18181b] border border-[#27272a] hover:border-[#a855f7] cursor-pointer transition-all space-y-1.5 group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#a855f7] uppercase tracking-wider">Option 3</span>
            <UserPlus className="w-4 h-4 text-[#a855f7] group-hover:scale-110 transition-transform" />
          </div>
          <h4 className="font-bold text-white text-sm">Add Student Manually</h4>
          <p className="text-xs text-[#a1a1aa]">
            Create a linked provisional record; automatically associates when student joins DanceOne.
          </p>
        </div>
      </div>

      {/* 3. Sub-Navigation Tabs & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#18181b] p-3 rounded-2xl border border-[#27272a]">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {(['All Students', 'Active', 'Pending Invites', 'Trials', 'Memberships'] as StudentsSubTab[]).map((tab) => {
            const isActive = activeSubTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveSubTab(tab)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  isActive ? 'bg-[#10b981] text-white shadow-md' : 'text-[#a1a1aa] hover:text-white hover:bg-[#27272a]'
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-[#71717a] absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Name, Phone, ID..."
            className="w-full pl-8 pr-3 py-1.5 bg-[#09090b] border border-[#27272a] rounded-xl text-xs text-white placeholder-[#71717a] outline-none focus:border-[#10b981]"
          />
        </div>
      </div>

      {/* 4. Sub-Tab Views */}
      {/* TABS: ALL STUDENTS & ACTIVE & MEMBERSHIPS */}
      {(activeSubTab === 'All Students' || activeSubTab === 'Active' || activeSubTab === 'Memberships') && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredStudents.length === 0 ? (
            <div className="col-span-full py-16 text-center rounded-3xl bg-[#18181b] border border-dashed border-[#27272a] p-8 space-y-3">
              <p className="text-base font-bold text-white">No enrolled dancers found</p>
              <p className="text-xs text-[#a1a1aa] max-w-sm mx-auto">Add dancers using their universal DanceOne ID, share a batch invite link, or register walk-in students.</p>
              <button
                onClick={() => onOpenAddStudentModal(1)}
                className="px-5 py-2.5 rounded-xl bg-[#3b82f6] hover:bg-[#2563eb] text-white font-bold text-xs shadow-lg transition-all"
              >
                + Add First Dancer
              </button>
            </div>
          ) : (
            filteredStudents.map((st) => (
              <div
                key={st.id}
                className="p-5 rounded-3xl bg-[#18181b] border border-[#27272a] hover:border-[#3b82f6]/50 transition-all space-y-3.5"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={st.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                      alt={st.name}
                      referrerPolicy="no-referrer"
                      className="w-12 h-12 rounded-2xl object-cover border border-[#27272a]"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-white text-base">{st.name}</h4>
                        <span className="text-xs font-mono text-[#3b82f6] px-2 py-0.5 rounded-md bg-[#3b82f6]/15 border border-[#3b82f6]/30 font-bold">
                          {st.danceOneId}
                        </span>
                      </div>
                      <span className="text-xs text-[#a1a1aa] block">{st.phone} • {st.email}</span>
                    </div>
                  </div>

                  <span className="px-2.5 py-0.5 rounded-full bg-[#10b981]/20 text-[#10b981] text-xs font-bold">
                    {st.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-[#09090b] border border-[#27272a] space-y-0.5">
                    <span className="text-[#71717a] text-xs">Enrolled Batch</span>
                    <p className="font-bold text-white truncate">{st.batchName}</p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#09090b] border border-[#27272a] space-y-0.5">
                    <span className="text-[#71717a] text-xs">Practice Streak</span>
                    <p className="font-bold text-[#eab308] flex items-center gap-1">
                      <Flame className="w-3.5 h-3.5 text-[#eab308]" />
                      <span>{st.attendanceStreak} Sessions</span>
                    </p>
                  </div>
                </div>

                {/* Ecosystem cross-enrollment details */}
                <div className="pt-2 border-t border-[#27272a] flex items-center justify-between text-xs">
                  <div className="text-[#71717a] text-xs">
                    Membership: <strong className="text-white">{st.membershipType}</strong>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                      st.feeStatus === 'Paid' ? 'bg-[#22c55e]/20 text-[#22c55e]' : 'bg-[#ef4444]/20 text-[#ef4444]'
                    }`}>
                      Fee: {st.feeStatus}
                    </span>
                    <button
                      onClick={() => onGenerateInvoice(st.name, 6500, st.batchName)}
                      className="px-2.5 py-1 rounded-lg bg-[#27272a] hover:bg-[#3f3f46] text-[#3b82f6] text-xs font-bold"
                    >
                      Invoice
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* TAB: PENDING INVITES */}
      {activeSubTab === 'Pending Invites' && (
        <div className="p-5 rounded-3xl bg-[#18181b] border border-[#27272a] space-y-4">
          <div className="flex items-center justify-between border-b border-[#27272a] pb-3">
            <h3 className="text-sm font-black text-white">Pending DanceOne Studio Invites</h3>
            <span className="text-xs text-[#a855f7] font-bold">{PENDING_INVITES_DATA.length} Pending</span>
          </div>

          <div className="space-y-3">
            {PENDING_INVITES_DATA.length === 0 ? (
              <div className="py-12 text-center rounded-2xl bg-[#09090b] border border-dashed border-[#27272a] p-6 space-y-2">
                <p className="text-sm font-bold text-white">No pending invitations</p>
                <p className="text-xs text-[#71717a] max-w-sm mx-auto">When you invite dancers to cohorts via phone or SMS link, invite tracking will appear here.</p>
                <button onClick={() => onOpenAddStudentModal(2)} className="mt-2 px-4 py-2 rounded-xl bg-[#a855f7]/20 text-[#a855f7] border border-[#a855f7]/30 text-xs font-bold">+ Send Invite Link</button>
              </div>
            ) : (
              PENDING_INVITES_DATA.map((inv) => (
                <div key={inv.id} className="p-4 rounded-2xl bg-[#09090b] border border-[#27272a] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div>
                    <h4 className="font-bold text-white text-sm">{inv.name}</h4>
                    <p className="text-[#a1a1aa]">{inv.phone} • {inv.email}</p>
                    <p className="text-xs text-[#71717a] mt-1">Batch: <strong className="text-white">{inv.batch}</strong> • Sent {inv.sentDate}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => alert(`Invite link copied: https://${inv.inviteLink}`)}
                      className="px-3 py-1.5 rounded-xl bg-[#27272a] text-white font-bold text-xs hover:bg-[#3f3f46]"
                    >
                      Copy Link
                    </button>
                    <button
                      onClick={() => alert(`Re-sent invitation SMS to ${inv.phone}`)}
                      className="px-3.5 py-1.5 rounded-xl bg-[#10b981] text-white font-bold text-xs hover:bg-[#059669]"
                    >
                      Resend Invite
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB: TRIALS */}
      {activeSubTab === 'Trials' && (
        <div className="p-5 rounded-3xl bg-[#18181b] border border-[#27272a] space-y-4">
          <div className="flex items-center justify-between border-b border-[#27272a] pb-3">
            <h3 className="text-sm font-black text-white">Trial Bookings & Conversion Pipeline</h3>
            <span className="text-xs text-[#eab308] font-bold">{TRIALS_DATA.length} Trial Students</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {TRIALS_DATA.length === 0 ? (
              <div className="col-span-full py-12 text-center rounded-2xl bg-[#09090b] border border-dashed border-[#27272a] p-6 space-y-2">
                <p className="text-sm font-bold text-white">No active trial requests</p>
                <p className="text-xs text-[#71717a] max-w-sm mx-auto">Prospective dancers booking trial classes through the DanceOne app will appear here for follow-up.</p>
              </div>
            ) : (
              TRIALS_DATA.map((trl) => (
                <div key={trl.id} className="p-4 rounded-2xl bg-[#09090b] border border-[#27272a] space-y-2 flex flex-col justify-between text-xs">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono text-[#3b82f6] px-1.5 py-0.5 rounded bg-[#3b82f6]/15 font-bold">
                        {trl.danceOneId}
                      </span>
                      <span className="text-xs text-[#22c55e] font-bold">{trl.fee}</span>
                    </div>
                    <h4 className="font-bold text-white text-sm">{trl.name}</h4>
                    <p className="text-[#a1a1aa]">{trl.phone}</p>
                    <p className="text-xs text-[#71717a]">Class: <strong className="text-white">{trl.classTitle}</strong></p>
                    <p className="text-xs text-[#eab308] font-medium">{trl.slot}</p>
                  </div>

                  <div className="pt-2 border-t border-[#27272a]">
                    <button
                      onClick={() => onOpenAddStudentModal(1)}
                      className="w-full py-1.5 rounded-xl bg-[#10b981] hover:bg-[#059669] text-white font-bold text-xs"
                    >
                      Convert to Batch →
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

