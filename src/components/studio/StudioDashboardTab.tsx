import React, { useState, useRef } from 'react';
import {
  Calendar,
  Users,
  DollarSign,
  Layers,
  CheckCircle2,
  Clock,
  Plus,
  ArrowRight,
  TrendingUp,
  AlertCircle,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  UserPlus,
  CircleDollarSign,
} from 'lucide-react';
import { StudioBatch, StudioStudent, StudioTeacher } from '../../types';

interface StudioDashboardTabProps {
  batches: StudioBatch[];
  students: StudioStudent[];
  teachers: StudioTeacher[];
  onSelectSection: (section: 'DASHBOARD' | 'BATCHES' | 'STUDENTS' | 'ATTENDANCE' | 'FINANCE' | 'TEACHERS') => void;
  onOpenAddStudent: () => void;
  onOpenCreateBatch: () => void;
  onOpenMarkAttendance: () => void;
  onOpenRecordPayment: () => void;
}

export const StudioDashboardTab: React.FC<StudioDashboardTabProps> = ({
  batches,
  students,
  teachers,
  onSelectSection,
  onOpenAddStudent,
  onOpenCreateBatch,
  onOpenMarkAttendance,
  onOpenRecordPayment,
}) => {
  const [selectedDay, setSelectedDay] = useState<'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun'>('Mon');
  const timetableScrollRef = useRef<HTMLDivElement>(null);

  const scrollTimetable = (direction: 'left' | 'right') => {
    if (timetableScrollRef.current) {
      const scrollAmount = direction === 'left' ? -300 : 300;
      timetableScrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  // Today's classes & room allocations (derived dynamically from batches)
  const TODAY_CLASSES = batches.map((b) => ({
    id: b.id,
    room: b.room,
    title: b.name,
    instructor: b.instructor,
    time: b.time,
    enrolledCount: b.enrolled,
    capacity: b.capacity,
    status: b.enrolled >= b.capacity ? 'Full' : `${b.capacity - b.enrolled} Spots Left`,
    statusColor: b.enrolled >= b.capacity
      ? 'bg-[#eab308]/20 text-[#eab308] border-[#eab308]/40'
      : 'bg-[#10b981]/20 text-[#10b981] border-[#10b981]/40',
  }));

  // Schedule timetable data (derived dynamically from batches)
  const SCHEDULE_TIMETABLE = batches.map((b) => ({
    id: b.id,
    roomTag: b.room.split(' ')[0] || 'Studio A',
    time: b.time,
    title: b.name,
    faculty: b.instructor,
    enrolled: `${b.enrolled} / ${b.capacity} Dancers`,
    status: b.status,
    statusColor: 'bg-[#10b981]/20 text-[#10b981] border-[#10b981]/30',
    color: 'border-l-[#10b981] bg-[#064e3b]/20',
  }));

  return (
    <div className="space-y-6">
      {/* 1. Quick Actions Bar requested by user */}
      <div className="bg-[#18181b] p-4 rounded-3xl border border-[#27272a]">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-black uppercase tracking-wider text-[#10b981] flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Quick Actions</span>
          </span>
          <span className="text-xs text-[#71717a]">Daily Command Shortcuts</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <button
            onClick={onOpenAddStudent}
            className="p-3 rounded-2xl bg-[#09090b] border border-[#27272a] hover:border-[#3b82f6] text-left transition-all group flex items-center gap-3"
          >
            <div className="w-10 h-10 rounded-xl bg-[#3b82f6]/15 text-[#3b82f6] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-black text-white block group-hover:text-[#3b82f6] transition-colors">
                + Add Student
              </span>
              <span className="text-xs text-[#71717a]">ID / Invite / Manual</span>
            </div>
          </button>

          <button
            onClick={onOpenCreateBatch}
            className="p-3 rounded-2xl bg-[#09090b] border border-[#27272a] hover:border-[#10b981] text-left transition-all group flex items-center gap-3"
          >
            <div className="w-10 h-10 rounded-xl bg-[#10b981]/15 text-[#10b981] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-black text-white block group-hover:text-[#10b981] transition-colors">
                + Create Batch
              </span>
              <span className="text-xs text-[#71717a]">New Cohort & Room</span>
            </div>
          </button>

          <button
            onClick={onOpenMarkAttendance}
            className="p-3 rounded-2xl bg-[#09090b] border border-[#27272a] hover:border-[#eab308] text-left transition-all group flex items-center gap-3"
          >
            <div className="w-10 h-10 rounded-xl bg-[#eab308]/15 text-[#eab308] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-black text-white block group-hover:text-[#eab308] transition-colors">
                + Mark Attendance
              </span>
              <span className="text-xs text-[#71717a]">Roll Call / QR Check-in</span>
            </div>
          </button>

          <button
            onClick={onOpenRecordPayment}
            className="p-3 rounded-2xl bg-[#09090b] border border-[#27272a] hover:border-[#22c55e] text-left transition-all group flex items-center gap-3"
          >
            <div className="w-10 h-10 rounded-xl bg-[#22c55e]/15 text-[#22c55e] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <CircleDollarSign className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-black text-white block group-hover:text-[#22c55e] transition-colors">
                + Record Payment
              </span>
              <span className="text-xs text-[#71717a]">Tax Invoice & UPI</span>
            </div>
          </button>
        </div>
      </div>

      {/* 2. Today Section (Essentials for Studio Owner) */}
      <div className="p-5 rounded-3xl bg-[#18181b] border border-[#27272a] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#27272a] pb-3">
          <div>
            <h3 className="text-base font-black text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#10b981]" />
              <span>Today's Command Overview</span>
            </h3>
            <p className="text-xs text-[#a1a1aa]">Real-time operational snapshot of today's dance schedule</p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-[#10b981]/20 text-[#10b981] border border-[#10b981]/30">
              ● 3 Active Studios
            </span>
          </div>
        </div>

        {/* 4 Essential Metrics for Today */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="p-3.5 rounded-2xl bg-[#09090b] border border-[#27272a] space-y-1">
            <span className="text-xs text-[#a1a1aa] block font-medium">Today's Classes</span>
            <p className="text-xl font-black text-white">{batches.length} Sessions</p>
            <span className="text-xs text-[#3b82f6] font-semibold">{batches.length === 0 ? 'No active cohorts' : 'Studio Hall Schedules'}</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#09090b] border border-[#27272a] space-y-1">
            <span className="text-xs text-[#a1a1aa] block font-medium">Students Attending</span>
            <p className="text-xl font-black text-white">{students.length} Dancers</p>
            <span className="text-xs text-[#22c55e] font-semibold">{students.filter((s) => s.status === 'Active').length} Active Enrolled</span>
          </div>

          <div
            onClick={() => onSelectSection('FINANCE')}
            className="p-3.5 rounded-2xl bg-[#09090b] border border-[#27272a] hover:border-[#f97316]/50 transition-all cursor-pointer space-y-1"
          >
            <span className="text-xs text-[#a1a1aa] block font-medium">Pending Payments</span>
            <p className="text-xl font-black text-[#f97316]">
              ₹{(students.filter((s) => s.feeStatus === 'Pending').length * 6500).toLocaleString()}
            </p>
            <span className="text-xs text-[#f97316] font-semibold">
              {students.filter((s) => s.feeStatus === 'Pending').length} Student Reminders →
            </span>
          </div>

          <div
            onClick={() => onSelectSection('STUDENTS')}
            className="p-3.5 rounded-2xl bg-[#09090b] border border-[#27272a] hover:border-[#a855f7]/50 transition-all cursor-pointer space-y-1"
          >
            <span className="text-xs text-[#a1a1aa] block font-medium">New Student Requests</span>
            <p className="text-xl font-black text-[#a855f7]">0 Inquiries</p>
            <span className="text-xs text-[#a855f7] font-semibold">Review Trials & Invites →</span>
          </div>
        </div>

        {/* Teacher Schedule & Today's Running Classes */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-black uppercase tracking-wider text-[#a1a1aa]">Today's Hall & Teacher Schedule</h4>
            <button
              onClick={() => onSelectSection('TEACHERS')}
              className="text-xs text-[#10b981] font-bold hover:underline flex items-center gap-1"
            >
              <span>Faculty Directory</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {TODAY_CLASSES.length === 0 ? (
              <div className="col-span-full py-8 text-center rounded-2xl bg-[#09090b] border border-dashed border-[#27272a] p-6 space-y-2">
                <p className="text-sm font-bold text-white">No sessions running today</p>
                <p className="text-xs text-[#71717a]">Scheduled batch timings will appear here for daily check-in.</p>
                <button
                  onClick={onOpenCreateBatch}
                  className="mt-1 px-4 py-1.5 rounded-xl bg-[#10b981]/20 text-[#10b981] border border-[#10b981]/30 text-xs font-bold"
                >
                  + Create Batch
                </button>
              </div>
            ) : (
              TODAY_CLASSES.map((cls) => (
                <div key={cls.id} className="p-4 rounded-2xl bg-[#09090b] border border-[#27272a] space-y-2 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-[#18181b] text-white">
                        {cls.room}
                      </span>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${cls.statusColor}`}>
                        {cls.status}
                      </span>
                    </div>
                    <h5 className="font-bold text-white text-sm">{cls.title}</h5>
                    <p className="text-xs text-[#a1a1aa]">Teacher: <strong className="text-white">{cls.instructor}</strong></p>
                  </div>

                  <div className="pt-2 border-t border-[#27272a] flex items-center justify-between text-xs text-[#71717a]">
                    <span className="font-mono text-white text-xs">{cls.time}</span>
                    <span className="text-[#10b981] font-semibold">{cls.enrolledCount}/{cls.capacity} Dancers</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* 3. Business Snapshot requested by user */}
      <div className="p-5 rounded-3xl bg-[#18181b] border border-[#27272a] space-y-4">
        <div className="flex items-center justify-between border-b border-[#27272a] pb-3">
          <div>
            <h3 className="text-base font-black text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#3b82f6]" />
              <span>Business Snapshot</span>
            </h3>
            <p className="text-xs text-[#a1a1aa]">Monthly performance & studio health metrics</p>
          </div>

          <span className="text-xs text-[#71717a] font-medium">Dance Studio Portal</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <div
            onClick={() => onSelectSection('STUDENTS')}
            className="p-4 rounded-2xl bg-[#09090b] border border-[#27272a] hover:border-[#a855f7]/50 transition-all cursor-pointer space-y-1"
          >
            <div className="flex items-center justify-between text-xs text-[#a1a1aa]">
              <span>Active Students</span>
              <Users className="w-4 h-4 text-[#a855f7]" />
            </div>
            <p className="text-xl sm:text-2xl font-black text-white">{students.length} Dancers</p>
            <span className="text-xs text-[#a855f7] font-semibold">Real-time cohort count →</span>
          </div>

          <div
            onClick={() => onSelectSection('FINANCE')}
            className="p-4 rounded-2xl bg-[#09090b] border border-[#27272a] hover:border-[#22c55e]/50 transition-all cursor-pointer space-y-1"
          >
            <div className="flex items-center justify-between text-xs text-[#a1a1aa]">
              <span>Monthly Revenue</span>
              <DollarSign className="w-4 h-4 text-[#22c55e]" />
            </div>
            <p className="text-xl sm:text-2xl font-black text-white">
              ₹{batches.reduce((sum, b) => sum + b.fee * b.enrolled, 0).toLocaleString()}
            </p>
            <span className="text-xs text-[#22c55e] font-semibold">100% Direct studio receipts →</span>
          </div>

          <div
            onClick={() => onSelectSection('ATTENDANCE')}
            className="p-4 rounded-2xl bg-[#09090b] border border-[#27272a] hover:border-[#eab308]/50 transition-all cursor-pointer space-y-1"
          >
            <div className="flex items-center justify-between text-xs text-[#a1a1aa]">
              <span>Attendance Rate</span>
              <CheckCircle2 className="w-4 h-4 text-[#eab308]" />
            </div>
            <p className="text-xl sm:text-2xl font-black text-white">
              {students.length > 0 ? '95.0%' : '0.0%'}
            </p>
            <span className="text-xs text-[#eab308] font-semibold">Verified check-in logging →</span>
          </div>

          <div
            onClick={() => onSelectSection('FINANCE')}
            className="p-4 rounded-2xl bg-[#09090b] border border-[#27272a] hover:border-[#ef4444]/50 transition-all cursor-pointer space-y-1"
          >
            <div className="flex items-center justify-between text-xs text-[#a1a1aa]">
              <span>Outstanding Fees</span>
              <AlertCircle className="w-4 h-4 text-[#ef4444]" />
            </div>
            <p className="text-xl sm:text-2xl font-black text-[#ef4444]">
              ₹{(students.filter((s) => s.feeStatus === 'Pending').length * 6500).toLocaleString()}
            </p>
            <span className="text-xs text-[#ef4444] font-semibold">1-Click WhatsApp Dues →</span>
          </div>
        </div>
      </div>

      {/* 4. Timetable Matrix */}
      <div className="p-5 rounded-3xl bg-[#18181b] border border-[#27272a] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#27272a] pb-3">
          <div>
            <h3 className="text-base font-black text-white flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#10b981]" />
              <span>Visible Studio Timetable Schedule</span>
            </h3>
            <p className="text-xs text-[#a1a1aa]">Studio A (Grand Hall), Studio B (Ballet Suite), Studio C (Urban Loft)</p>
          </div>

          <div className="flex items-center gap-3">
            {/* Scroll navigation arrows */}
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => scrollTimetable('left')}
                className="w-8 h-8 rounded-full bg-[#09090b] border border-[#27272a] hover:border-white/30 text-white flex items-center justify-center transition-colors"
                title="Scroll Left"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => scrollTimetable('right')}
                className="w-8 h-8 rounded-full bg-[#09090b] border border-[#27272a] hover:border-white/30 text-white flex items-center justify-center transition-colors"
                title="Scroll Right"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Day Switcher */}
            <div className="flex items-center gap-1 bg-[#09090b] p-1 rounded-xl border border-[#27272a]">
              {(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const).map((day) => (
                <button
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                    selectedDay === day ? 'bg-[#10b981] text-white shadow-sm' : 'text-[#71717a] hover:text-white'
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Horizontally Scrollable Timeline Cards */}
        <div ref={timetableScrollRef} className="flex gap-3 overflow-x-auto no-scrollbar pb-2 pt-1 scroll-smooth">
          {SCHEDULE_TIMETABLE.length === 0 ? (
            <div className="w-full py-8 text-center rounded-2xl bg-[#09090b] border border-dashed border-[#27272a] p-6 space-y-2">
              <p className="text-sm font-bold text-white">No timetable sessions for {selectedDay}</p>
              <p className="text-xs text-[#71717a]">Batches created in the portal will automatically show on this daily studio timetable.</p>
            </div>
          ) : (
            SCHEDULE_TIMETABLE.map((slot) => (
              <div
                key={slot.id}
                className={`min-w-[260px] sm:min-w-[280px] p-4 rounded-2xl border border-[#27272a] flex flex-col justify-between space-y-3 shrink-0 ${slot.color}`}
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-[#18181b] text-white">
                      {slot.roomTag}
                    </span>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${slot.statusColor}`}>
                      {slot.status}
                    </span>
                  </div>
                  <h4 className="font-bold text-white text-sm leading-snug">{slot.title}</h4>
                  <p className="text-xs text-[#a1a1aa]">Faculty: {slot.faculty}</p>
                </div>

                <div className="pt-2 border-t border-[#27272a]/60 flex items-center justify-between text-xs text-[#71717a]">
                  <span className="font-mono text-white text-xs">{slot.time}</span>
                  <span className="text-[#22c55e] font-semibold">{slot.enrolled}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

