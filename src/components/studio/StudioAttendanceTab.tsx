import React, { useState } from 'react';
import {
  CheckCircle2,
  QrCode,
  Users,
  Calendar,
  Sparkles,
  Search,
  Check,
  X,
  Clock,
  Flame,
  Download,
  AlertCircle,
  Zap,
} from 'lucide-react';
import { StudioBatch, StudioStudent } from '../../types';

interface StudioAttendanceTabProps {
  batches: StudioBatch[];
  students: StudioStudent[];
}

type AttendanceSubTab = "Today's Classes" | 'History' | 'Reports';

export const StudioAttendanceTab: React.FC<StudioAttendanceTabProps> = ({
  batches,
  students,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<AttendanceSubTab>("Today's Classes");
  const [selectedBatchId, setSelectedBatchId] = useState<string>(batches[0]?.id || 'batch-1');
  const [showQrModal, setShowQrModal] = useState(false);
  const [qrScanCode, setQrScanCode] = useState('');
  const [qrScanResult, setQrScanResult] = useState<string | null>(null);
  const [liveSyncToast, setLiveSyncToast] = useState<string | null>(null);

  // 4-state attendance mapping: Present | Late | Absent | No-Show
  const [rollCall, setRollCall] = useState<Record<string, 'present' | 'late' | 'absent' | 'no-show'>>({
    'stud-1': 'present',
    'stud-2': 'present',
    'stud-3': 'late',
    'stud-4': 'present',
    'stud-5': 'absent',
  });

  // History logs mock data
  const ATTENDANCE_HISTORY = [
    { id: 'ath-1', date: 'Yesterday (21 Aug 2026)', batch: 'Contemporary Floorwork Batch', instructor: 'Sarah Jenkins', present: 18, total: 20, rate: '90%' },
    { id: 'ath-2', date: '20 Aug 2026', batch: 'Urban Choreography Intensive', instructor: 'Marcus Thorne', present: 22, total: 22, rate: '100%' },
    { id: 'ath-3', date: '19 Aug 2026', batch: 'Morning Ballet Alignment', instructor: 'Elena Rostova', present: 13, total: 14, rate: '93%' },
    { id: 'ath-4', date: '18 Aug 2026', batch: 'Bollywood Cardio Blast', instructor: 'Rohan Mehra', present: 16, total: 18, rate: '88%' },
  ];

  const activeBatch = batches.find((b) => b.id === selectedBatchId) || batches[0];

  const handleUpdateStatus = (studentId: string, studentName: string, status: 'present' | 'late' | 'absent' | 'no-show') => {
    setRollCall((prev) => ({
      ...prev,
      [studentId]: status,
    }));

    if (status === 'present' || status === 'late') {
      setLiveSyncToast(`⚡ DanceOne Activity Synced: ${studentName} received +1 Streak count & session milestone!`);
    } else {
      setLiveSyncToast(`⚡ DanceOne Activity Updated: ${studentName} marked ${status}.`);
    }

    setTimeout(() => {
      setLiveSyncToast(null);
    }, 2800);
  };

  const handleSimulateQrScan = () => {
    if (!qrScanCode.trim()) {
      setQrScanResult('Please enter a DanceOne Pass code (e.g. DO-89211 or SCAN-D1).');
      return;
    }

    setQrScanResult(`✓ Pass Verified! Nehal Suna (DO-89211) checked into ${activeBatch.name}. Activity log synchronized!`);
    setLiveSyncToast(`⚡ QR Check-in Complete: Nehal Suna's Dance streak updated to 14 days!`);
    setTimeout(() => {
      setQrScanResult(null);
      setShowQrModal(false);
      setQrScanCode('');
      setLiveSyncToast(null);
    }, 2500);
  };

  return (
    <div className="space-y-6">
      {/* Header & Modes */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#18181b] p-4 sm:p-5 rounded-3xl border border-[#27272a]">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-black uppercase tracking-wider text-[#10b981]">
              ATTENDANCE & ACTIVITY SYNC
            </span>
            <span className="text-xs text-[#22c55e] font-semibold">● Real-time Dancer Network</span>
          </div>
          <h2 className="text-xl font-black text-white">Studio Attendance Command</h2>
          <p className="text-xs text-[#a1a1aa]">
            Mark roll call via Manual Click, QR Check-in, or Booking Auto-Sync
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowQrModal(true)}
            className="px-3.5 py-2 rounded-xl bg-[#3b82f6]/20 border border-[#3b82f6]/40 hover:bg-[#3b82f6] text-[#60a5fa] hover:text-white font-bold text-xs flex items-center gap-1.5 transition-all"
          >
            <QrCode className="w-4 h-4" />
            <span>QR Scanner Mode</span>
          </button>
        </div>
      </div>

      {/* Live Sync Toast Banner */}
      {liveSyncToast && (
        <div className="p-3.5 rounded-2xl bg-[#10b981]/20 border border-[#10b981]/50 text-white text-xs font-bold flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-[#10b981] animate-pulse" />
            <span>{liveSyncToast}</span>
          </div>
          <span className="text-xs text-[#10b981] uppercase tracking-wider">Sync Active</span>
        </div>
      )}

      {/* Sub-Navigation */}
      <div className="bg-[#18181b] p-1.5 rounded-2xl border border-[#27272a]">
        <div className="grid grid-cols-3 gap-1 text-center">
          {(["Today's Classes", 'History', 'Reports'] as AttendanceSubTab[]).map((tab) => {
            const isActive = activeSubTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveSubTab(tab)}
                className={`py-2 px-2 rounded-xl text-xs font-bold transition-all ${
                  isActive ? 'bg-[#10b981] text-white shadow-md' : 'text-[#a1a1aa] hover:text-white hover:bg-[#27272a]'
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>
      </div>

      {/* TAB 1: TODAY'S CLASSES ROLL CALL */}
      {activeSubTab === "Today's Classes" && (
        <div className="space-y-4">
          {/* Cohort Selector */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#18181b] p-4 rounded-2xl border border-[#27272a]">
            <div>
              <span className="text-xs font-bold text-[#71717a] uppercase">Active Session:</span>
              <h3 className="text-base font-bold text-white">{activeBatch.name}</h3>
              <p className="text-xs text-[#a1a1aa]">{activeBatch.days} • {activeBatch.room}</p>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-xs text-[#a1a1aa]">Switch Batch:</label>
              <select
                value={selectedBatchId}
                onChange={(e) => setSelectedBatchId(e.target.value)}
                className="bg-[#09090b] border border-[#27272a] text-xs font-bold text-white px-3 py-1.5 rounded-xl outline-none"
              >
                {batches.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Roll Call Student Roster */}
          <div className="p-5 rounded-3xl bg-[#18181b] border border-[#27272a] space-y-4">
            <div className="flex items-center justify-between border-b border-[#27272a] pb-3">
              <h4 className="text-sm font-black text-white">
                Roster Sheet ({students.length} Registered Dancers)
              </h4>
              <div className="flex items-center gap-3 text-xs">
                <span className="text-[#22c55e] font-bold">● Present</span>
                <span className="text-[#eab308] font-bold">● Late</span>
                <span className="text-[#ef4444] font-bold">● Absent</span>
              </div>
            </div>

            <div className="space-y-3">
              {students.map((st) => {
                const status = rollCall[st.id] || 'present';
                return (
                  <div
                    key={st.id}
                    className="p-4 rounded-2xl bg-[#09090b] border border-[#27272a] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={st.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                        alt={st.name}
                        referrerPolicy="no-referrer"
                        className="w-11 h-11 rounded-2xl object-cover border border-[#27272a]"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <h5 className="font-bold text-white text-sm">{st.name}</h5>
                          <span className="text-xs font-mono text-[#3b82f6] px-1.5 py-0.5 rounded bg-[#3b82f6]/15 font-bold">
                            {st.danceOneId}
                          </span>
                        </div>
                        <span className="text-xs text-[#a1a1aa] block">{st.phone}</span>
                        <span className="text-xs text-[#eab308] font-semibold">
                          🔥 {st.attendanceStreak} Class Streak on DanceOne
                        </span>
                      </div>
                    </div>

                    {/* 4 Status Buttons */}
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleUpdateStatus(st.id, st.name, 'present')}
                        className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all ${
                          status === 'present'
                            ? 'bg-[#22c55e] text-white shadow-md'
                            : 'bg-[#18181b] text-[#71717a] hover:text-white'
                        }`}
                      >
                        Present
                      </button>

                      <button
                        onClick={() => handleUpdateStatus(st.id, st.name, 'late')}
                        className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all ${
                          status === 'late'
                            ? 'bg-[#eab308] text-black shadow-md'
                            : 'bg-[#18181b] text-[#71717a] hover:text-white'
                        }`}
                      >
                        Late
                      </button>

                      <button
                        onClick={() => handleUpdateStatus(st.id, st.name, 'absent')}
                        className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all ${
                          status === 'absent'
                            ? 'bg-[#ef4444] text-white shadow-md'
                            : 'bg-[#18181b] text-[#71717a] hover:text-white'
                        }`}
                      >
                        Absent
                      </button>

                      <button
                        onClick={() => handleUpdateStatus(st.id, st.name, 'no-show')}
                        className={`px-2.5 py-1.5 rounded-xl font-bold text-xs transition-all ${
                          status === 'no-show'
                            ? 'bg-[#71717a] text-white shadow-md'
                            : 'bg-[#18181b] text-[#71717a] hover:text-white'
                        }`}
                      >
                        No-Show
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: HISTORY */}
      {activeSubTab === 'History' && (
        <div className="p-5 rounded-3xl bg-[#18181b] border border-[#27272a] space-y-4">
          <div className="flex items-center justify-between border-b border-[#27272a] pb-3">
            <h3 className="text-sm font-black text-white">Past Attendance Logs</h3>
            <span className="text-xs text-[#10b981] font-bold">Past 30 Days</span>
          </div>

          <div className="space-y-3">
            {ATTENDANCE_HISTORY.map((log) => (
              <div key={log.id} className="p-4 rounded-2xl bg-[#09090b] border border-[#27272a] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div>
                  <span className="text-xs text-[#71717a] block">{log.date}</span>
                  <h4 className="font-bold text-white text-sm">{log.batch}</h4>
                  <p className="text-[#a1a1aa]">Instructor: {log.instructor}</p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <span className="text-sm font-black text-[#10b981]">{log.rate}</span>
                    <span className="text-xs text-[#71717a] block">{log.present} / {log.total} Checked In</span>
                  </div>
                  <button className="px-3 py-1.5 rounded-xl bg-[#27272a] text-white font-bold text-xs hover:bg-[#3f3f46]">
                    View Sheet
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: REPORTS */}
      {activeSubTab === 'Reports' && (
        <div className="p-5 rounded-3xl bg-[#18181b] border border-[#27272a] space-y-4">
          <div className="flex items-center justify-between border-b border-[#27272a] pb-3">
            <div>
              <h3 className="text-sm font-black text-white">Attendance Analytics & Retention Report</h3>
              <p className="text-xs text-[#a1a1aa]">Export verified logs for faculty payouts and student certificates</p>
            </div>
            <button className="px-3.5 py-1.5 rounded-xl bg-[#10b981] text-white font-bold text-xs flex items-center gap-1.5">
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-4 rounded-2xl bg-[#09090b] border border-[#27272a] space-y-1">
              <span className="text-[#71717a]">Overall Punctuality Rate</span>
              <p className="text-2xl font-black text-white">94.2%</p>
              <span className="text-xs text-[#22c55e] font-semibold">+3.8% vs last month</span>
            </div>
            <div className="p-4 rounded-2xl bg-[#09090b] border border-[#27272a] space-y-1">
              <span className="text-[#71717a]">Most Consistent Cohort</span>
              <p className="text-base font-bold text-white">Urban Intensive</p>
              <span className="text-xs text-[#eab308] font-semibold">98.5% attendance avg</span>
            </div>
            <div className="p-4 rounded-2xl bg-[#09090b] border border-[#27272a] space-y-1">
              <span className="text-[#71717a]">Average Drop-out Rate</span>
              <p className="text-2xl font-black text-[#10b981]">1.4%</p>
              <span className="text-xs text-[#10b981] font-semibold">Industry leading retention</span>
            </div>
          </div>
        </div>
      )}

      {/* QR Scanner Simulation Modal */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#18181b] border border-[#27272a] rounded-3xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#27272a] pb-3">
              <div className="flex items-center gap-2">
                <QrCode className="w-5 h-5 text-[#3b82f6]" />
                <h3 className="font-black text-white text-base">Scan Dancer QR Pass</h3>
              </div>
              <button onClick={() => setShowQrModal(false)} className="text-[#71717a] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-[#09090b] border border-dashed border-[#3b82f6]/50 text-center space-y-3">
              <div className="w-16 h-16 rounded-2xl bg-[#3b82f6]/20 border border-[#3b82f6] mx-auto flex items-center justify-center">
                <QrCode className="w-8 h-8 text-[#3b82f6] animate-pulse" />
              </div>
              <p className="text-xs text-[#a1a1aa]">
                Point dancer's DanceOne Pass barcode at camera or enter Pass code below
              </p>
            </div>

            <div className="space-y-2 text-xs">
              <label className="text-[#a1a1aa] block font-medium">DanceOne Pass / ID Code</label>
              <input
                type="text"
                value={qrScanCode}
                onChange={(e) => setQrScanCode(e.target.value)}
                placeholder="e.g. DO-89211 or SCAN-D1"
                className="w-full px-3.5 py-2.5 bg-[#09090b] border border-[#27272a] rounded-xl text-white font-mono outline-none focus:border-[#3b82f6]"
              />
            </div>

            {qrScanResult && (
              <div className="p-3 rounded-xl bg-[#22c55e]/20 border border-[#22c55e]/50 text-[#22c55e] text-xs font-bold">
                {qrScanResult}
              </div>
            )}

            <div className="pt-2 flex items-center justify-end gap-2 text-xs">
              <button
                type="button"
                onClick={() => setShowQrModal(false)}
                className="px-4 py-2 rounded-xl bg-[#27272a] text-white font-bold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSimulateQrScan}
                className="px-5 py-2 rounded-xl bg-[#3b82f6] hover:bg-[#2563eb] text-white font-bold"
              >
                Verify & Check-in
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

