import React, { useState } from 'react';
import {
  Star,
  ChevronRight,
  Layers,
} from 'lucide-react';
import { StudioTeacher, StudioBatch } from '../../types';

interface StudioTeachersTabProps {
  teachers: StudioTeacher[];
  batches: StudioBatch[];
  onSelectBatch: (batchId: string) => void;
}

export const StudioTeachersTab: React.FC<StudioTeachersTabProps> = ({
  teachers,
  batches,
  onSelectBatch,
}) => {
  const [selectedTeacherId, setSelectedTeacherId] = useState<string>(teachers[0]?.id || 'teach-1');

  const activeTeacher = teachers.find((t) => t.id === selectedTeacherId) || teachers[0];

  const getTeacherStyles = (t: StudioTeacher): string[] => {
    return t.styles || t.danceStyles || ['Contemporary', 'Choreography'];
  };

  const getTeacherBatches = (t: StudioTeacher): string[] => {
    return t.batchesAssigned || t.assignedBatches || ['General Batches'];
  };

  const getTeacherRating = (t: StudioTeacher): number => {
    return t.rating ?? t.reviewsRating ?? 4.9;
  };

  const getTeacherEarnings = (t: StudioTeacher): number => {
    return t.monthlyEarnings ?? (t.sessionRate ? t.sessionRate * 18 : 32400);
  };

  const getTeacherEarningsModel = (t: StudioTeacher): string => {
    return t.earningsModel ?? t.earningsType ?? 'Fixed Per Class';
  };

  if (!activeTeacher) {
    return (
      <div className="p-4 rounded-xl bg-[#0c0d12] border border-white/[0.08] text-center text-xs text-[#71717a]">
        No teachers registered yet.
      </div>
    );
  }

  const activeStyles = getTeacherStyles(activeTeacher);
  const activeBatches = getTeacherBatches(activeTeacher);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#0c0d12] p-4 sm:p-5 rounded-2xl border border-white/[0.1] shadow-md">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase tracking-wider text-[#10b981] font-bold">
              STUDIO FACULTY & TEACHERS
            </span>
            <span className="text-xs font-mono text-[#22c55e]">● {teachers.length} Active Faculty</span>
          </div>
          <h2 className="text-base sm:text-lg font-bold text-white leading-snug mt-0.5">Faculty Directory & Assignments</h2>
          <p className="text-xs text-[#a1a1aa]">
            Manage teacher cohorts, payout rates, reviews, and teaching cadences
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left: Teachers Directory List */}
        <div className="space-y-2">
          <h3 className="text-xs font-mono uppercase tracking-wider text-[#a1a1aa] font-semibold px-1">Faculty Roster</h3>
          <div className="space-y-2">
            {teachers.map((t) => {
              const isSelected = t.id === selectedTeacherId;
              const stylesList = getTeacherStyles(t);
              const batchCount = getTeacherBatches(t).length;
              const rating = getTeacherRating(t);

              return (
                <div
                  key={t.id}
                  onClick={() => setSelectedTeacherId(t.id)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    isSelected
                      ? 'bg-white text-black border-white shadow-md'
                      : 'bg-[#0c0d12] border-white/[0.08] text-[#a1a1aa] hover:border-white/20 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={t.avatar}
                      alt={t.name}
                      referrerPolicy="no-referrer"
                      className="w-12 h-12 rounded-xl object-cover shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className={`font-bold text-sm truncate leading-snug ${isSelected ? 'text-black' : 'text-white'}`}>
                          {t.name}
                        </h4>
                        <span className={`text-xs font-mono font-bold px-1.5 py-0.5 rounded ${
                          t.availability === 'Available'
                            ? isSelected ? 'bg-emerald-100 text-emerald-800' : 'bg-[#22c55e]/20 text-[#22c55e]'
                            : t.availability === 'In Class'
                            ? isSelected ? 'bg-amber-100 text-amber-800' : 'bg-[#eab308]/20 text-[#eab308]'
                            : isSelected ? 'bg-rose-100 text-rose-800' : 'bg-[#ef4444]/20 text-[#ef4444]'
                        }`}>
                          {t.availability}
                        </span>
                      </div>
                      <p className={`text-xs font-mono truncate max-w-[160px] mt-0.5 ${isSelected ? 'text-zinc-600' : 'text-[#71717a]'}`}>
                        {stylesList.join(', ')}
                      </p>
                      <div className="flex items-center gap-2 text-xs font-mono mt-1">
                        <span className="flex items-center gap-1 text-[#eab308]">
                          <Star className="w-3.5 h-3.5 fill-current" />
                          <span className="font-bold">{rating}</span>
                        </span>
                        <span>•</span>
                        <span>{batchCount} Batches</span>
                      </div>
                    </div>
                  </div>

                  <ChevronRight className={`w-4 h-4 shrink-0 ${isSelected ? 'text-black' : 'text-[#71717a]'}`} />
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Detailed Teacher Profile */}
        <div className="lg:col-span-2 space-y-3">
          <div className="p-4 sm:p-5 rounded-2xl bg-[#0c0d12] border border-white/[0.08] space-y-4 shadow-md">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 border-b border-white/[0.08] pb-4">
              <div className="flex items-center gap-3.5">
                <img
                  src={activeTeacher.avatar}
                  alt={activeTeacher.name}
                  referrerPolicy="no-referrer"
                  className="w-16 h-16 rounded-2xl object-cover border border-white/20 shrink-0"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base sm:text-lg font-bold text-white">{activeTeacher.name}</h3>
                    <span className="px-2 py-0.5 rounded-full bg-[#10b981]/20 text-[#10b981] text-xs font-mono font-bold">
                      {activeTeacher.availability}
                    </span>
                  </div>
                  <p className="text-xs text-[#a1a1aa] mt-0.5">{activeTeacher.phone} · {activeTeacher.email}</p>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {activeStyles.map((st) => (
                      <span key={st} className="px-2.5 py-0.5 rounded-lg bg-white/[0.06] text-xs font-mono text-white">
                        {st}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="text-left sm:text-right space-y-1">
                <span className="text-xs font-mono text-[#71717a] block">Monthly Earnings Model</span>
                <span className="text-sm font-bold text-[#10b981] block">{getTeacherEarningsModel(activeTeacher)}</span>
                <span className="text-base font-mono text-white font-bold">₹{getTeacherEarnings(activeTeacher).toLocaleString()}</span>
              </div>
            </div>

            {/* Performance KPIs */}
            <div className="grid grid-cols-3 gap-2.5 text-center">
              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] space-y-1">
                <span className="text-xs font-mono text-[#71717a] uppercase block font-semibold">Attendance</span>
                <p className="text-base sm:text-lg font-bold text-[#10b981] font-mono">{activeTeacher.attendanceRate}%</p>
                <span className="text-xs text-[#71717a] block">Punctual</span>
              </div>

              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] space-y-1">
                <span className="text-xs font-mono text-[#71717a] uppercase block font-semibold">Rating</span>
                <p className="text-base sm:text-lg font-bold text-[#eab308] font-mono flex items-center justify-center gap-1">
                  <Star className="w-4 h-4 fill-current" />
                  <span>{getTeacherRating(activeTeacher)}</span>
                </p>
                <span className="text-xs text-[#71717a] block">{activeTeacher.reviewsCount} Reviews</span>
              </div>

              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] space-y-1">
                <span className="text-xs font-mono text-[#71717a] uppercase block font-semibold">Active Batches</span>
                <p className="text-base sm:text-lg font-bold text-[#38bdf8] font-mono">{activeBatches.length}</p>
                <span className="text-xs text-[#71717a] block">Cadence</span>
              </div>
            </div>

            {/* Assigned Batches */}
            <div className="space-y-2">
              <h4 className="text-xs font-mono uppercase tracking-wider text-[#a1a1aa] font-semibold">Assigned Cohorts</h4>
              <div className="space-y-1.5">
                {activeBatches.map((bName, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-between text-xs sm:text-sm">
                    <div className="flex items-center gap-2">
                      <Layers className="w-4 h-4 text-[#10b981]" />
                      <span className="font-bold text-white">{bName}</span>
                    </div>
                    <span className="text-[#a1a1aa] text-xs font-mono">Main Hall</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Weekly Schedule */}
            <div className="space-y-2">
              <h4 className="text-xs font-mono uppercase tracking-wider text-[#a1a1aa] font-semibold">Timetable</h4>
              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] text-xs sm:text-sm text-white">
                <p className="font-mono text-[#10b981] font-semibold">{activeTeacher.schedule}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

