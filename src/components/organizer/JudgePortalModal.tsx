import React, { useState } from 'react';
import {
  Shield,
  Trophy,
  CheckCircle2,
  Lock,
  Unlock,
  Sparkles,
  Sliders,
  Send,
  X,
  UserCheck,
  Flame,
} from 'lucide-react';
import {
  OrganizerEventRecord,
  ScoringCriterion,
  CompetitionParticipant,
  JudgeScoreRecord,
} from '../../types/organizer';
import { ORGANIZER_JUDGES_DATA } from '../../data/organizerData';

interface JudgePortalModalProps {
  event: OrganizerEventRecord;
  onClose: () => void;
  onUpdateEvent: (updatedEvent: OrganizerEventRecord) => void;
}

export const JudgePortalModal: React.FC<JudgePortalModalProps> = ({
  event,
  onClose,
  onUpdateEvent,
}) => {
  const [selectedJudgeId, setSelectedJudgeId] = useState<string>(ORGANIZER_JUDGES_DATA[0].id);
  const activeJudge =
    ORGANIZER_JUDGES_DATA.find((j) => j.id === selectedJudgeId) || ORGANIZER_JUDGES_DATA[0];

  const participants = event.participants || [];
  const [selectedParticipantId, setSelectedParticipantId] = useState<string>(
    participants[0]?.id || 'part-1'
  );
  const activeParticipant =
    participants.find((p) => p.id === selectedParticipantId) || participants[0];

  // Local criteria score values (0.0 to 10.0)
  const [scores, setScores] = useState<Record<string, number>>({
    'crit-tech': 9.0,
    'crit-musi': 8.8,
    'crit-crea': 9.2,
    'crit-perf': 9.0,
    'crit-stag': 9.5,
  });

  const [notes, setNotes] = useState(
    'Incredible dynamic transitions, footwork speed was immaculate in the break section.'
  );
  const [isLocked, setIsLocked] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);

  // Calculate weighted score sum
  const criteria = event.scoringCriteria || [];
  const calculatedTotal = criteria.reduce((sum, crit) => {
    const rawVal = scores[crit.id] ?? 8.0;
    return sum + rawVal * (crit.weight / 100);
  }, 0);

  const handleScoreChange = (critId: string, val: number) => {
    if (isLocked) return;
    setScores((prev) => ({ ...prev, [critId]: val }));
  };

  const handleSubmitScore = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeParticipant) return;

    const newJudgeScore: JudgeScoreRecord = {
      judgeId: activeJudge.id,
      judgeName: activeJudge.name,
      criteriaScores: { ...scores },
      totalScore: Number(calculatedTotal.toFixed(2)),
      notes,
      submittedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isFinalized: true,
    };

    // Update participant scores
    const updatedParticipants = participants.map((p) => {
      if (p.id === activeParticipant.id) {
        const otherScores = p.scores.filter((s) => s.judgeId !== activeJudge.id);
        const allNewScores = [...otherScores, newJudgeScore];
        const newWeightedTotal =
          allNewScores.reduce((acc, curr) => acc + curr.totalScore, 0) / (allNewScores.length || 1);

        return {
          ...p,
          scores: allNewScores,
          weightedTotal: Number(newWeightedTotal.toFixed(2)),
        };
      }
      return p;
    });

    // Add to Audit Log
    const newAuditLog = {
      id: `audit-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString(),
      participantId: activeParticipant.id,
      participantName: activeParticipant.name,
      judgeId: activeJudge.id,
      judgeName: activeJudge.name,
      action: 'score_submitted' as const,
      newScore: Number(calculatedTotal.toFixed(2)),
      reason: `Submitted via Judge Tablet Portal by ${activeJudge.name}`,
    };

    onUpdateEvent({
      ...event,
      participants: updatedParticipants,
      scoreAuditLogs: [newAuditLog, ...(event.scoreAuditLogs || [])],
    });

    setIsLocked(true);
    setSubmissionSuccess(true);
    setTimeout(() => setSubmissionSuccess(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-lg overflow-y-auto">
      <div className="bg-[#121215] border-2 border-[#eab308]/60 rounded-3xl w-full max-w-4xl max-h-[94vh] flex flex-col shadow-[0_0_50px_rgba(234,179,8,0.2)] overflow-hidden my-4">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#27272a] bg-[#18181b]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#eab308]/20 text-[#eab308] flex items-center justify-center border border-[#eab308]/40">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-black uppercase tracking-widest text-[#eab308]">
                OFFICIAL JUDGE SCORING TERMINAL
              </span>
              <h2 className="text-lg font-black text-white">{event.title}</h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Judge Persona Selector */}
            <select
              value={selectedJudgeId}
              onChange={(e) => {
                setSelectedJudgeId(e.target.value);
                setIsLocked(false);
              }}
              className="px-3 py-1.5 bg-[#27272a] border border-[#3f3f46] rounded-xl text-xs font-bold text-white outline-none"
            >
              {ORGANIZER_JUDGES_DATA.map((j) => (
                <option key={j.id} value={j.id}>
                  👤 {j.name} ({j.styles[0]})
                </option>
              ))}
            </select>

            <button
              onClick={onClose}
              className="p-2 rounded-2xl bg-[#27272a] hover:bg-[#3f3f46] text-[#a1a1aa] hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Competitor Selector Strip */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-[#71717a]">Select On-Stage Competitor:</span>
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
              {participants.map((p) => {
                const isSelected = p.id === activeParticipant?.id;
                const hasScored = p.scores.some((s) => s.judgeId === activeJudge.id);

                return (
                  <button
                    key={p.id}
                    onClick={() => {
                      setSelectedParticipantId(p.id);
                      setIsLocked(hasScored);
                    }}
                    className={`px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all border flex items-center gap-2 ${
                      isSelected
                        ? 'bg-[#eab308] text-black border-[#eab308] font-black shadow-md'
                        : 'bg-[#18181b] text-white border-[#27272a] hover:border-[#3f3f46]'
                    }`}
                  >
                    <span>#{p.bibNumber} {p.name}</span>
                    {hasScored && (
                      <span className="w-2 h-2 rounded-full bg-[#22c55e]" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Competitor Details Card */}
          {activeParticipant && (
            <div className="p-5 rounded-3xl bg-[#18181b] border border-[#27272a] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-[#eab308] text-black font-black text-2xl flex items-center justify-center shadow-lg">
                  #{activeParticipant.bibNumber}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-blue-500/20 text-blue-400">
                      {activeParticipant.category}
                    </span>
                    <span className="text-xs text-[#a1a1aa]">{activeParticipant.format}</span>
                  </div>
                  <h3 className="text-xl font-black text-white">{activeParticipant.name}</h3>
                  <p className="text-xs text-[#71717a]">
                    Crew: {activeParticipant.crewOrStudio || 'Independent'} • ID: {activeParticipant.danceOneId}
                  </p>
                </div>
              </div>

              <div className="text-right p-3 rounded-2xl bg-[#202024] border border-[#27272a]">
                <span className="text-xs uppercase font-bold text-[#71717a] block">
                  Weighted Score Total
                </span>
                <span className="text-3xl font-black text-[#eab308]">
                  {calculatedTotal.toFixed(2)}
                  <span className="text-xs text-[#71717a] font-normal"> / 10.0</span>
                </span>
              </div>
            </div>
          )}

          {/* Criteria Sliders Form */}
          <form onSubmit={handleSubmitScore} className="space-y-5">
            <div className="space-y-4">
              {criteria.map((crit) => {
                const currentVal = scores[crit.id] ?? 8.0;
                return (
                  <div
                    key={crit.id}
                    className="p-4 rounded-2xl bg-[#18181b] border border-[#27272a] space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-sm font-bold text-white block">{crit.name}</span>
                        <span className="text-xs text-[#71717a]">{crit.description}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-[#eab308] font-bold">({crit.weight}%)</span>
                        <span className="text-lg font-black text-white font-mono">
                          {currentVal.toFixed(1)}
                        </span>
                      </div>
                    </div>

                    <input
                      type="range"
                      min="1.0"
                      max="10.0"
                      step="0.1"
                      disabled={isLocked}
                      value={currentVal}
                      onChange={(e) => handleScoreChange(crit.id, parseFloat(e.target.value))}
                      className="w-full h-2 bg-[#27272a] rounded-lg appearance-none cursor-pointer accent-[#eab308]"
                    />
                  </div>
                );
              })}
            </div>

            {/* Critique & Notes */}
            <div className="p-4 rounded-2xl bg-[#18181b] border border-[#27272a] space-y-2">
              <label className="text-xs font-bold text-white block">
                Official Judge Feedback & Critique (Shared with Dancer Profile)
              </label>
              <textarea
                rows={3}
                disabled={isLocked}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Give constructive feedback on musicality, dynamics, cleanliness, originality..."
                className="w-full p-3 bg-[#121215] border border-[#27272a] rounded-xl text-xs text-white outline-none focus:border-[#eab308]"
              />
            </div>

            {/* Action Bar */}
            <div className="flex items-center justify-between pt-2">
              {isLocked ? (
                <button
                  type="button"
                  onClick={() => setIsLocked(false)}
                  className="px-4 py-2 rounded-xl bg-[#27272a] hover:bg-[#3f3f46] text-amber-400 text-xs font-bold flex items-center gap-2"
                >
                  <Unlock className="w-4 h-4" />
                  <span>Unlock to Modify</span>
                </button>
              ) : (
                <span className="text-xs text-[#71717a]">
                  Changes are auto-validated against weighting matrix.
                </span>
              )}

              <button
                type="submit"
                disabled={isLocked}
                className={`px-6 py-3 rounded-2xl text-xs font-black flex items-center gap-2 shadow-lg transition-all ${
                  isLocked
                    ? 'bg-[#22c55e]/20 text-[#22c55e] border border-[#22c55e]/40'
                    : 'bg-[#eab308] hover:bg-[#facc15] text-black'
                }`}
              >
                <Lock className="w-4 h-4" />
                <span>{isLocked ? 'Score Finalized & Locked' : 'Lock & Submit Score'}</span>
              </button>
            </div>

            {submissionSuccess && (
              <div className="p-3 rounded-2xl bg-[#22c55e]/20 border border-[#22c55e]/40 text-[#22c55e] text-xs font-bold text-center">
                ✓ Score recorded to immutable audit ledger and synced to Master Leaderboard!
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

