import React, { useState } from 'react';
import {
  Layers,
  Users,
  Calendar,
  CheckCircle2,
  DollarSign,
  Plus,
  Bell,
  Clock,
  MapPin,
  ChevronRight,
  Send,
  ArrowLeft,
  Search,
  Check,
  AlertCircle,
  FileText,
} from 'lucide-react';
import { StudioBatch, StudioStudent } from '../../types';

interface StudioBatchesTabProps {
  batches: StudioBatch[];
  students: StudioStudent[];
  selectedBatchId: string;
  onSelectBatchId: (id: string) => void;
  onOpenCreateBatch: () => void;
  onGenerateInvoiceForStudent: (studentName: string, amount: number, batchName: string) => void;
}

type InsideBatchTab = 'Overview' | 'Students' | 'Attendance' | 'Schedule' | 'Payments';

export const StudioBatchesTab: React.FC<StudioBatchesTabProps> = ({
  batches,
  students,
  selectedBatchId,
  onSelectBatchId,
  onOpenCreateBatch,
  onGenerateInvoiceForStudent,
}) => {
  const [viewMode, setViewMode] = useState<'all' | 'inside'>('all');
  const [insideTab, setInsideTab] = useState<InsideBatchTab>('Overview');
  const [announcementText, setAnnouncementText] = useState('');
  const [announcements, setAnnouncements] = useState<Record<string, string[]>>({});

  // Roll call states for inside-batch attendance
  const [batchAttendance, setBatchAttendance] = useState<Record<string, 'present' | 'absent' | 'late'>>({});

  const [attendanceSyncNotice, setAttendanceSyncNotice] = useState<string | null>(null);

  const activeBatch = batches.find((b) => b.id === selectedBatchId) || batches[0] || null;

  const handleSendAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeBatch || !announcementText.trim()) return;

    setAnnouncements((prev) => ({
      ...prev,
      [activeBatch.id]: [announcementText.trim(), ...(prev[activeBatch.id] || [])],
    }));
    setAnnouncementText('');
  };

  const handleToggleAttendance = (studentId: string, studentName: string) => {
    setBatchAttendance((prev) => {
      const current = prev[studentId] || 'present';
      const next = current === 'present' ? 'late' : current === 'late' ? 'absent' : 'present';
      return { ...prev, [studentId]: next };
    });

    setAttendanceSyncNotice(`⚡ DanceOne Activity Updated: ${studentName}'s streak & log refreshed!`);
    setTimeout(() => {
      setAttendanceSyncNotice(null);
    }, 2500);
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#18181b] p-4 sm:p-5 rounded-3xl border border-[#27272a]">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-black uppercase tracking-wider text-[#10b981]">
              COHORT & BATCH MANAGEMENT
            </span>
            <span className="text-xs text-[#71717a]">• {batches.length} Active Batches</span>
          </div>
          <h2 className="text-xl font-black text-white">
            {viewMode === 'inside' ? (activeBatch?.name || 'Batch Details') : 'All Studio Batches'}
          </h2>
          <p className="text-xs text-[#a1a1aa]">
            {viewMode === 'inside'
              ? `Manage schedule, students, fees & roll-call in one place for this batch`
              : `Overview of all dance cohorts, faculty, schedules & room capacities`}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {viewMode === 'inside' ? (
            <button
              onClick={() => setViewMode('all')}
              className="px-3.5 py-2 rounded-xl bg-[#27272a] hover:bg-[#3f3f46] text-white font-bold text-xs flex items-center gap-1.5 transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to All Batches</span>
            </button>
          ) : null}

          <button
            onClick={onOpenCreateBatch}
            className="px-4 py-2 rounded-xl bg-[#10b981] hover:bg-[#059669] text-white font-bold text-xs flex items-center gap-1.5 shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>+ Create Batch</span>
          </button>
        </div>
      </div>

      {/* Sync Toast Feedback */}
      {attendanceSyncNotice && (
        <div className="p-3 rounded-2xl bg-[#10b981]/20 border border-[#10b981]/50 text-white text-xs font-bold flex items-center justify-between animate-fadeIn">
          <span>{attendanceSyncNotice}</span>
          <span className="text-xs text-[#10b981] uppercase tracking-wider">Sync Active</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1. ALL BATCHES OVERVIEW LIST/CARDS */}
      {/* ========================================================================= */}
      {viewMode === 'all' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {batches.length === 0 ? (
            <div className="col-span-full py-16 text-center rounded-3xl bg-[#18181b] border border-dashed border-[#27272a] p-8 space-y-3">
              <p className="text-base font-bold text-white">No cohorts or batches created yet</p>
              <p className="text-xs text-[#a1a1aa] max-w-sm mx-auto">Create your first dance batch to start scheduling faculty, room allocation and enrolling students.</p>
              <button
                onClick={onOpenCreateBatch}
                className="px-5 py-2.5 rounded-xl bg-[#10b981] hover:bg-[#059669] text-white font-bold text-xs shadow-lg transition-all"
              >
                + Create First Batch
              </button>
            </div>
          ) : (
            batches.map((b) => {
              const batchAnnounceCount = announcements[b.id]?.length || 0;
              return (
                <div
                  key={b.id}
                  className="p-5 rounded-3xl bg-[#18181b] border border-[#27272a] hover:border-[#10b981]/60 transition-all flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-full bg-[#10b981]/20 text-[#10b981] text-xs font-bold uppercase">
                        {b.style}
                      </span>
                      <span className="text-base font-black text-white">₹{b.fee.toLocaleString()}</span>
                    </div>

                    <h3 className="font-bold text-white text-base leading-snug">{b.name}</h3>

                    <div className="space-y-1 text-xs text-[#a1a1aa]">
                      <p className="flex items-center gap-1.5">
                        <span className="text-[#71717a]">Faculty:</span>
                        <strong className="text-white">{b.instructor}</strong>
                      </p>
                      <p className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-[#71717a]" />
                        <span>{b.room}</span>
                      </p>
                      <p className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-[#71717a]" />
                        <span>{b.days} ({b.time})</span>
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs text-[#71717a]">
                      <span>Capacity Fill</span>
                      <span className="font-bold text-white">{b.enrolled} / {b.capacity} Seats</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-[#09090b] overflow-hidden">
                      <div
                        className="h-full bg-[#10b981] rounded-full transition-all"
                        style={{ width: `${Math.min(100, (b.enrolled / b.capacity) * 100)}%` }}
                      />
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#27272a] flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 text-xs text-[#71717a]">
                      {batchAnnounceCount > 0 ? (
                        <span className="flex items-center gap-1 text-[#eab308]">
                          <Bell className="w-3 h-3" />
                          <span>{batchAnnounceCount} Note{batchAnnounceCount > 1 ? 's' : ''}</span>
                        </span>
                      ) : (
                        <span>No notes</span>
                      )}
                    </div>

                    <button
                      onClick={() => {
                        onSelectBatchId(b.id);
                        setViewMode('inside');
                        setInsideTab('Overview');
                      }}
                      className="px-3 py-1.5 rounded-xl bg-[#27272a] hover:bg-[#10b981] text-white font-bold text-xs flex items-center gap-1 transition-all"
                    >
                      <span>Manage Cohort</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. DEEP "INSIDE THE BATCH" ALL-IN-ONE VIEW */}
      {/* ========================================================================= */}
      {viewMode === 'inside' && activeBatch && (
        <div className="space-y-5">
          {/* Sub-Navigation for Inside the Batch */}
          <div className="bg-[#18181b] p-1.5 rounded-2xl border border-[#27272a]">
            <div className="grid grid-cols-5 gap-1 text-center">
              {(['Overview', 'Students', 'Attendance', 'Schedule', 'Payments'] as InsideBatchTab[]).map((tab) => {
                const isActive = insideTab === tab;
                return (
                  <button
                    key={tab}
                    onClick={() => setInsideTab(tab)}
                    className={`py-2 px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                      isActive ? 'bg-[#10b981] text-white shadow-md' : 'text-[#a1a1aa] hover:text-white hover:bg-[#27272a]'
                    }`}
                  >
                    {tab === 'Overview' && <Layers className="w-3.5 h-3.5" />}
                    {tab === 'Students' && <Users className="w-3.5 h-3.5" />}
                    {tab === 'Attendance' && <CheckCircle2 className="w-3.5 h-3.5" />}
                    {tab === 'Schedule' && <Calendar className="w-3.5 h-3.5" />}
                    {tab === 'Payments' && <DollarSign className="w-3.5 h-3.5" />}
                    <span className="hidden sm:inline">{tab}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* INSIDE TAB 1: OVERVIEW */}
          {insideTab === 'Overview' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2 p-5 rounded-3xl bg-[#18181b] border border-[#27272a] space-y-4">
                <div className="flex items-center justify-between border-b border-[#27272a] pb-3">
                  <h3 className="text-sm font-black text-white">Cohort Specifications</h3>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#10b981]/20 text-[#10b981] text-xs font-bold uppercase">
                    {activeBatch.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-2xl bg-[#09090b] border border-[#27272a] space-y-1">
                    <span className="text-[#71717a]">Assigned Faculty</span>
                    <p className="font-bold text-white text-sm">{activeBatch.instructor}</p>
                    <span className="text-xs text-[#3b82f6]">Lead Choreographer</span>
                  </div>

                  <div className="p-3 rounded-2xl bg-[#09090b] border border-[#27272a] space-y-1">
                    <span className="text-[#71717a]">Studio Room</span>
                    <p className="font-bold text-white text-sm">{activeBatch.room}</p>
                    <span className="text-xs text-[#10b981]">Sprung Hardwood Floor</span>
                  </div>

                  <div className="p-3 rounded-2xl bg-[#09090b] border border-[#27272a] space-y-1">
                    <span className="text-[#71717a]">Cohort Timetable</span>
                    <p className="font-bold text-white">{activeBatch.days}</p>
                    <span className="text-xs text-[#a1a1aa]">{activeBatch.time}</span>
                  </div>

                  <div className="p-3 rounded-2xl bg-[#09090b] border border-[#27272a] space-y-1">
                    <span className="text-[#71717a]">Monthly Fee per Dancer</span>
                    <p className="font-bold text-[#22c55e] text-base">₹{activeBatch.fee.toLocaleString()}</p>
                    <span className="text-xs text-[#71717a]">Includes 8 sessions + Tax</span>
                  </div>
                </div>

                {/* Announcement Board */}
                <div className="space-y-3 pt-2">
                  <h4 className="text-xs font-black uppercase tracking-wider text-[#a1a1aa] flex items-center gap-1.5">
                    <Bell className="w-3.5 h-3.5 text-[#eab308]" />
                    <span>Batch Announcements Board (Visible to Dancers)</span>
                  </h4>

                  <form onSubmit={handleSendAnnouncement} className="flex gap-2">
                    <input
                      type="text"
                      value={announcementText}
                      onChange={(e) => setAnnouncementText(e.target.value)}
                      placeholder={`Post announcement for ${activeBatch.name}...`}
                      className="flex-1 bg-[#09090b] border border-[#27272a] rounded-xl px-3 py-2 text-xs text-white placeholder-[#71717a] outline-none focus:border-[#10b981]"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-[#10b981] hover:bg-[#059669] text-white text-xs font-bold flex items-center gap-1"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Post</span>
                    </button>
                  </form>

                  <div className="space-y-2">
                    {(announcements[activeBatch.id] || []).map((msg, idx) => (
                      <div key={idx} className="p-3 rounded-2xl bg-[#09090b] border border-[#27272a] text-xs text-white flex items-start gap-2">
                        <span className="w-2 h-2 rounded-full bg-[#eab308] mt-1.5 shrink-0" />
                        <p className="flex-1">{msg}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Side Metric Card */}
              <div className="p-5 rounded-3xl bg-[#18181b] border border-[#27272a] space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <h3 className="text-sm font-black text-white">Cohort Health Summary</h3>

                  <div className="p-3.5 rounded-2xl bg-[#09090b] border border-[#27272a] space-y-1">
                    <span className="text-xs text-[#71717a]">Total Enrolled</span>
                    <p className="text-xl font-black text-white">{activeBatch.enrolled} / {activeBatch.capacity}</p>
                    <span className="text-xs text-[#10b981] font-semibold">{activeBatch.capacity - activeBatch.enrolled} Spots Available</span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-[#09090b] border border-[#27272a] space-y-1">
                    <span className="text-xs text-[#71717a]">Average Attendance</span>
                    <p className="text-xl font-black text-[#eab308]">96.4%</p>
                    <span className="text-xs text-[#eab308] font-semibold">Consistent cohort streak</span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-[#09090b] border border-[#27272a] space-y-1">
                    <span className="text-xs text-[#71717a]">Batch Revenue Realized</span>
                    <p className="text-xl font-black text-[#22c55e]">₹{(activeBatch.enrolled * activeBatch.fee).toLocaleString()}</p>
                    <span className="text-xs text-[#22c55e] font-semibold">100% Invoiced</span>
                  </div>
                </div>

                <button
                  onClick={() => setInsideTab('Attendance')}
                  className="w-full py-2.5 rounded-xl bg-[#10b981] text-white text-xs font-bold flex items-center justify-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Launch Roll-Call Sheet</span>
                </button>
              </div>
            </div>
          )}

          {/* INSIDE TAB 2: STUDENTS */}
          {insideTab === 'Students' && (
            <div className="p-5 rounded-3xl bg-[#18181b] border border-[#27272a] space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#27272a] pb-3">
                <div>
                  <h3 className="text-sm font-black text-white">Enrolled Dancers in {activeBatch.name}</h3>
                  <p className="text-xs text-[#a1a1aa]">{activeBatch.enrolled} Active Students • Universal DanceOne Identity</p>
                </div>
                <span className="text-xs text-[#10b981] font-bold">Capacity: {activeBatch.capacity} Max</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {students.map((st) => (
                  <div
                    key={st.id}
                    className="p-3.5 rounded-2xl bg-[#09090b] border border-[#27272a] flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={st.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                        alt={st.name}
                        referrerPolicy="no-referrer"
                        className="w-10 h-10 rounded-full object-cover border border-[#27272a]"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-white">{st.name}</h4>
                          <span className="text-xs font-mono text-[#3b82f6] px-1.5 py-0.2 rounded bg-[#3b82f6]/15">
                            {st.danceOneId}
                          </span>
                        </div>
                        <span className="text-xs text-[#a1a1aa] block">{st.phone}</span>
                        <span className="text-xs text-[#10b981] font-semibold">Streak: {st.attendanceStreak} Sessions</span>
                      </div>
                    </div>

                    <div className="text-right space-y-1">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                        st.feeStatus === 'Paid' ? 'bg-[#22c55e]/20 text-[#22c55e]' : 'bg-[#ef4444]/20 text-[#ef4444]'
                      }`}>
                        {st.feeStatus}
                      </span>
                      {st.feeStatus === 'Due' && (
                        <button
                          onClick={() => onGenerateInvoiceForStudent(st.name, activeBatch.fee, activeBatch.name)}
                          className="block text-xs text-[#3b82f6] hover:underline font-bold"
                        >
                          Invoice Now →
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* INSIDE TAB 3: ATTENDANCE */}
          {insideTab === 'Attendance' && (
            <div className="p-5 rounded-3xl bg-[#18181b] border border-[#27272a] space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#27272a] pb-3">
                <div>
                  <h3 className="text-sm font-black text-white">Live Attendance Roll Call: {activeBatch.name}</h3>
                  <p className="text-xs text-[#a1a1aa]">1-Click toggle status: Present / Late / Absent</p>
                </div>
                <span className="text-xs text-[#10b981] font-bold">Today's Class Sheet</span>
              </div>

              <div className="space-y-2.5">
                {students.map((st) => {
                  const status = batchAttendance[st.id] || 'present';
                  return (
                    <div
                      key={st.id}
                      className="p-3.5 rounded-2xl bg-[#09090b] border border-[#27272a] flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#18181b] flex items-center justify-center font-bold text-white">
                          {st.name[0]}
                        </div>
                        <div>
                          <p className="font-bold text-white">{st.name}</p>
                          <span className="text-xs text-[#71717a]">{st.danceOneId} • {st.phone}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleToggleAttendance(st.id, st.name)}
                          className={`px-3 py-1.5 rounded-xl font-black text-xs transition-all flex items-center gap-1.5 ${
                            status === 'present'
                              ? 'bg-[#22c55e] text-white shadow-md'
                              : status === 'late'
                              ? 'bg-[#eab308] text-black font-bold'
                              : 'bg-[#ef4444] text-white'
                          }`}
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span className="capitalize">{status}</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* INSIDE TAB 4: SCHEDULE */}
          {insideTab === 'Schedule' && (
            <div className="p-5 rounded-3xl bg-[#18181b] border border-[#27272a] space-y-4">
              <h3 className="text-sm font-black text-white border-b border-[#27272a] pb-3">
                Timetable Slots & Room Allocations
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="p-4 rounded-2xl bg-[#09090b] border border-[#27272a] space-y-2">
                  <span className="text-[#71717a]">Weekly Cadence</span>
                  <p className="text-sm font-bold text-white">{activeBatch.days}</p>
                  <p className="text-xs text-[#10b981] font-medium">{activeBatch.time}</p>
                </div>

                <div className="p-4 rounded-2xl bg-[#09090b] border border-[#27272a] space-y-2">
                  <span className="text-[#71717a]">Studio Room Reservation</span>
                  <p className="text-sm font-bold text-white">{activeBatch.room}</p>
                  <p className="text-xs text-[#a1a1aa]">Mirrored Studio with PA system</p>
                </div>
              </div>
            </div>
          )}

          {/* INSIDE TAB 5: PAYMENTS */}
          {insideTab === 'Payments' && (
            <div className="p-5 rounded-3xl bg-[#18181b] border border-[#27272a] space-y-4">
              <div className="flex items-center justify-between border-b border-[#27272a] pb-3">
                <h3 className="text-sm font-black text-white">Batch Fee Realization & Dues</h3>
                <span className="text-xs text-[#22c55e] font-bold">₹{activeBatch.fee.toLocaleString()} / Student</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {students.map((st) => (
                  <div key={st.id} className="p-3.5 rounded-2xl bg-[#09090b] border border-[#27272a] flex items-center justify-between text-xs">
                    <div>
                      <h4 className="font-bold text-white">{st.name}</h4>
                      <span className="text-xs text-[#71717a]">{st.danceOneId}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                        st.feeStatus === 'Paid' ? 'bg-[#22c55e]/20 text-[#22c55e]' : 'bg-[#ef4444]/20 text-[#ef4444]'
                      }`}>
                        {st.feeStatus}
                      </span>
                      <button
                        onClick={() => onGenerateInvoiceForStudent(st.name, activeBatch.fee, activeBatch.name)}
                        className="px-2.5 py-1 rounded-lg bg-[#27272a] hover:bg-[#3f3f46] text-white font-bold text-xs flex items-center gap-1"
                      >
                        <FileText className="w-3 h-3 text-[#10b981]" />
                        <span>Invoice</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

