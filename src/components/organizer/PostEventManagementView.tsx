import React, { useState } from 'react';
import {
  CheckCircle2,
  Lock,
  Award,
  Send,
  DollarSign,
  FileSpreadsheet,
  Archive,
  Download,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Building2,
} from 'lucide-react';
import { OrganizerEventRecord } from '../../types/organizer';

interface PostEventManagementViewProps {
  events: OrganizerEventRecord[];
  onUpdateEvent: (updatedEvent: OrganizerEventRecord) => void;
}

export const PostEventManagementView: React.FC<PostEventManagementViewProps> = ({
  events,
  onUpdateEvent,
}) => {
  const [selectedEventId, setSelectedEventId] = useState<string>(events[0]?.id || 'org-ev-1');
  const event = events.find((e) => e.id === selectedEventId) || events[0];

  const [stepsCompleted, setStepsCompleted] = useState<Record<string, boolean>>({
    finalize_scores: true,
    publish_rankings: true,
    issue_certificates: true,
    send_feedback: false,
    payout_faculty: true,
    settle_finances: false,
    archive_event: false,
  });

  const toggleStep = (stepKey: string) => {
    setStepsCompleted((prev) => ({ ...prev, [stepKey]: !prev[stepKey] }));
  };

  const handleArchive = () => {
    if (!event) return;
    onUpdateEvent({ ...event, status: 'archived' });
    setStepsCompleted((prev) => ({ ...prev, archive_event: true }));
    alert(`Event "${event.title}" has been successfully archived in immutable read-only state.`);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-3xl bg-[#18181b] border border-[#27272a]">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-black uppercase tracking-wider bg-[#22c55e]/20 text-[#22c55e]">
              POST-EVENT CLOSEOUT & ARCHIVE
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
            Championship Finalization Checklist
          </h2>
          <p className="text-xs text-[#a1a1aa]">
            Sequential 9-step audit workflow to finalize rankings, issue certificates, disburse honorariums, and archive.
          </p>
        </div>

        <select
          value={selectedEventId}
          onChange={(e) => setSelectedEventId(e.target.value)}
          className="px-3.5 py-2 bg-[#27272a] border border-[#3f3f46] rounded-2xl text-xs font-bold text-white outline-none"
        >
          {events.map((ev) => (
            <option key={ev.id} value={ev.id}>
              {ev.title} ({ev.status.toUpperCase()})
            </option>
          ))}
        </select>
      </div>

      {/* 9-Step Closeout Wizard */}
      <div className="p-6 rounded-3xl bg-[#18181b] border border-[#27272a] space-y-4">
        <h3 className="text-base font-black text-white">Sequential Closeout Protocol</h3>

        <div className="space-y-3">
          {[
            {
              id: 'finalize_scores',
              title: '1. Finalize & Seal Judge Score Sheets',
              desc: 'Locks all criteria points, audits judge overrides, and computes final weighted totals.',
              action: 'Audit Locked',
            },
            {
              id: 'publish_rankings',
              title: '2. Publish Official Rankings to DanceOne Ecosystem',
              desc: 'Pushes podium finishes, ranks, and medals to athlete verified profiles.',
              action: 'Publish Rankings',
            },
            {
              id: 'issue_certificates',
              title: '3. Batch Dispatch Digital Certificates of Merit',
              desc: 'Issues cryptographically signed participation and winner certificates to registered dancers.',
              action: 'Dispatch Certificates',
            },
            {
              id: 'send_feedback',
              title: '4. Broadcast Post-Event Survey & Feedback Forms',
              desc: 'Collects anonymous and public judging fairness reviews from dancers, judges, and spectators.',
              action: 'Send Survey Link',
            },
            {
              id: 'payout_faculty',
              title: '5. Disburse Judge Honorariums & Staff Payouts',
              desc: 'Reconciles judge per diems, MC/DJ fees, and stage crew disbursements.',
              action: 'Record Payouts',
            },
            {
              id: 'settle_finances',
              title: '6. Generate Final P&L & Settle Platform Balance',
              desc: 'Reconciles box office revenue, DanceOne platform fees (5%), and bank UTR transfers.',
              action: 'Reconcile UTR',
            },
            {
              id: 'archive_event',
              title: '7. Archive Event (Read-Only Mode)',
              desc: 'Moves event into historical archive. Preserves scores, certificates, and media records.',
              action: 'Archive Event',
            },
          ].map((step) => {
            const isDone = stepsCompleted[step.id];
            return (
              <div
                key={step.id}
                className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  isDone ? 'bg-[#202024]/60 border-[#22c55e]/30' : 'bg-[#18181b] border-[#27272a]'
                }`}
              >
                <div className="flex items-start gap-3">
                  <button
                    onClick={() => toggleStep(step.id)}
                    className={`p-1.5 rounded-lg text-xs font-bold transition-all ${
                      isDone ? 'bg-[#22c55e] text-black' : 'bg-[#27272a] text-[#71717a]'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                  </button>
                  <div>
                    <h4
                      className={`text-sm font-bold ${
                        isDone ? 'text-white line-through opacity-80' : 'text-white'
                      }`}
                    >
                      {step.title}
                    </h4>
                    <p className="text-xs text-[#a1a1aa]">{step.desc}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <button
                    onClick={() => {
                      if (step.id === 'archive_event') {
                        handleArchive();
                      } else {
                        toggleStep(step.id);
                      }
                    }}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all ${
                      isDone
                        ? 'bg-[#27272a] text-[#a1a1aa]'
                        : 'bg-[#eab308] hover:bg-[#facc15] text-black shadow-md'
                    }`}
                  >
                    {isDone ? 'Completed' : step.action}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Export & Download Hub */}
      <div className="p-6 rounded-3xl bg-[#18181b] border border-[#27272a] space-y-4">
        <h3 className="text-base font-black text-white">Event Records & Data Export Hub</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => alert('Downloading Official Judging Score Matrix (CSV)...')}
            className="p-4 rounded-2xl bg-[#202024] hover:bg-[#27272a] border border-[#27272a] text-left space-y-2 transition-all"
          >
            <FileSpreadsheet className="w-5 h-5 text-[#eab308]" />
            <span className="font-bold text-white text-xs block">Official Score Matrix (CSV)</span>
            <span className="text-xs text-[#a1a1aa] block">
              Individual judge scores, criteria breakdowns, and rankings.
            </span>
          </button>

          <button
            onClick={() => alert('Downloading Box Office & Ticketing Reconciliation (PDF)...')}
            className="p-4 rounded-2xl bg-[#202024] hover:bg-[#27272a] border border-[#27272a] text-left space-y-2 transition-all"
          >
            <Download className="w-5 h-5 text-[#22c55e]" />
            <span className="font-bold text-white text-xs block">Financial Ledger & P&L (PDF)</span>
            <span className="text-xs text-[#a1a1aa] block">
              Audited gross inflow, expense receipts, and net profit statement.
            </span>
          </button>

          <button
            onClick={() => alert('Downloading Participant Gate Check-In Manifest...')}
            className="p-4 rounded-2xl bg-[#202024] hover:bg-[#27272a] border border-[#27272a] text-left space-y-2 transition-all"
          >
            <ShieldCheck className="w-5 h-5 text-cyan-400" />
            <span className="font-bold text-white text-xs block">Gate & Attendance Logs (CSV)</span>
            <span className="text-xs text-[#a1a1aa] block">
              QR scan timestamps and check-in verifications.
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

