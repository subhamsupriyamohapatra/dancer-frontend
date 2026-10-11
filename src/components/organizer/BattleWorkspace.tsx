import React, { useState, useEffect } from 'react';
import {
  Flame,
  Trophy,
  Users,
  Clock,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  Mic,
  Disc3,
  Award,
  CheckCircle2,
  ChevronRight,
  Shield,
  Radio,
  Vote,
  Sparkles,
  Zap,
} from 'lucide-react';
import { OrganizerEventRecord, BattleMatchup } from '../../types/organizer';
import { ORGANIZER_JUDGES_DATA } from '../../data/organizerData';

interface BattleWorkspaceProps {
  event: OrganizerEventRecord;
  onUpdateEvent: (updatedEvent: OrganizerEventRecord) => void;
  onOpenJudgePortal: () => void;
  onOpenMCPortal: () => void;
  onOpenControlCenter: () => void;
}

export const BattleWorkspace: React.FC<BattleWorkspaceProps> = ({
  event,
  onUpdateEvent,
  onOpenJudgePortal,
  onOpenMCPortal,
  onOpenControlCenter,
}) => {
  const [activeTab, setActiveTab] = useState<'live_arena' | 'brackets' | 'mc_dj_cues' | 'results'>('live_arena');
  const [selectedFormat, setSelectedFormat] = useState<'1v1' | '2v2' | 'Crew vs Crew'>('1v1');

  // Battle Timer State
  const [timerSeconds, setTimerSeconds] = useState(45);
  const [presetDuration, setPresetDuration] = useState(45);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [currentRound, setCurrentRound] = useState(1);
  const [totalRounds, setTotalRounds] = useState(2);

  const matchups = event.battleMatchups || [];
  const activeMatchup = matchups.find((m) => m.status === 'live') || matchups[0];

  // Timer interval
  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0 && isTimerRunning) {
      setIsTimerRunning(false);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerSeconds]);

  const handleStartTimer = () => setIsTimerRunning(true);
  const handlePauseTimer = () => setIsTimerRunning(false);
  const handleResetTimer = (seconds?: number) => {
    setIsTimerRunning(false);
    setTimerSeconds(seconds || presetDuration);
  };

  // Vote for a dancer in active matchup
  const handleJudgeVote = (winner: 'dancer1' | 'dancer2') => {
    if (!activeMatchup) return;

    const winnerId = winner === 'dancer1' ? activeMatchup.dancer1.id : activeMatchup.dancer2.id;
    const updatedMatchups = matchups.map((m) => {
      if (m.id === activeMatchup.id) {
        return {
          ...m,
          status: 'completed' as const,
          winnerId,
          judgeVotes: [
            { judgeId: 'judge-1', judgeName: 'B-Boy Tornado', votedForDancerId: winnerId },
            { judgeId: 'judge-3', judgeName: 'Lil C', votedForDancerId: winnerId },
          ],
        };
      }
      // If there's an upcoming semi-final matchup, advance winner into it
      if (m.roundName === 'Semi-Final' && m.dancer2.danceOneId === 'TBD') {
        const winningDancer = winner === 'dancer1' ? activeMatchup.dancer1 : activeMatchup.dancer2;
        return {
          ...m,
          dancer2: {
            id: winningDancer.id,
            name: winningDancer.name,
            bib: winningDancer.bib,
            danceOneId: winningDancer.danceOneId,
            crew: winningDancer.crew,
            avatar: winningDancer.avatar,
            votes: 0,
          },
        };
      }
      return m;
    });

    onUpdateEvent({ ...event, battleMatchups: updatedMatchups });
  };

  // Audience hype vote simulation
  const handleAudienceVote = (side: 'd1' | 'd2') => {
    if (!activeMatchup) return;
    const currentVotes = activeMatchup.audienceVotes || { d1: 100, d2: 100 };
    const updatedMatchups = matchups.map((m) =>
      m.id === activeMatchup.id
        ? {
            ...m,
            audienceVotes: {
              d1: side === 'd1' ? currentVotes.d1 + 5 : currentVotes.d1,
              d2: side === 'd2' ? currentVotes.d2 + 5 : currentVotes.d2,
            },
          }
        : m
    );
    onUpdateEvent({ ...event, battleMatchups: updatedMatchups });
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-5 rounded-3xl bg-[#18181b] border border-[#27272a] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-black uppercase tracking-wider bg-rose-500/20 text-rose-400 border border-rose-500/40">
              DANCE BATTLE ARENA & CYPHER ENGINE
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e] animate-pulse" />
            <span className="text-xs font-bold text-[#22c55e]">Live Cypher In Progress</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">{event.title}</h2>
          <p className="text-xs text-[#a1a1aa]">
            Real-time battle timer, visual tournament brackets, live DJ audio cues, and MC prompter.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={onOpenJudgePortal}
            className="px-4 py-2.5 rounded-2xl bg-[#27272a] hover:bg-[#3f3f46] text-white text-xs font-bold flex items-center gap-2 border border-[#3f3f46] transition-all"
          >
            <Shield className="w-4 h-4 text-[#eab308]" />
            <span>Judge Voting Pad</span>
          </button>
          <button
            onClick={onOpenMCPortal}
            className="px-4 py-2.5 rounded-2xl bg-[#27272a] hover:bg-[#3f3f46] text-white text-xs font-bold flex items-center gap-2 border border-[#3f3f46] transition-all"
          >
            <Mic className="w-4 h-4 text-cyan-400" />
            <span>Host / MC Screen</span>
          </button>
          <button
            onClick={onOpenControlCenter}
            className="px-5 py-2.5 rounded-2xl bg-[#eab308] hover:bg-[#facc15] text-black text-xs font-black shadow-lg flex items-center gap-2 transition-all"
          >
            <Radio className="w-4 h-4 animate-pulse" />
            <span>Control Center</span>
          </button>
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="flex items-center gap-2 bg-[#18181b] p-1.5 rounded-2xl border border-[#27272a] overflow-x-auto no-scrollbar">
        {[
          { id: 'live_arena', label: 'Live Battle Arena & Timer', icon: Flame },
          { id: 'brackets', label: 'Interactive Tournament Bracket', icon: Trophy },
          { id: 'mc_dj_cues', label: 'DJ & MC Cues Console', icon: Disc3 },
          { id: 'results', label: 'Battle Standings & Winners', icon: Award },
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

      {/* TAB 1: LIVE BATTLE ARENA & TIMER */}
      {activeTab === 'live_arena' && (
        <div className="space-y-6">
          {/* Main Battle Matchup Visual Stage */}
          {activeMatchup ? (
            <div className="p-6 rounded-3xl bg-[#141417] border-2 border-[#27272a] space-y-6 relative overflow-hidden">
              {/* Top Battle Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#27272a] pb-4">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full text-xs font-black uppercase bg-rose-500/20 text-rose-400 border border-rose-500/40 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                    LIVE MATCHUP #{activeMatchup.matchNumber} ({activeMatchup.roundName})
                  </span>
                  <span className="text-xs text-[#a1a1aa] font-medium">
                    Round {currentRound} of {totalRounds}
                  </span>
                </div>

                {/* Live Music Track Track Display */}
                <div className="flex items-center gap-2 bg-[#18181b] px-3.5 py-1.5 rounded-full border border-[#27272a]">
                  <Disc3 className="w-4 h-4 text-[#eab308] animate-spin" />
                  <span className="text-xs font-bold text-white truncate max-w-xs">
                    {activeMatchup.musicTrackTitle || 'DJ SpinLock - Funk Groove In Cypher'}
                  </span>
                </div>
              </div>

              {/* DANCER 1 (RED) vs DANCER 2 (BLUE) ARENA */}
              <div className="grid grid-cols-1 md:grid-cols-7 gap-4 items-center">
                {/* RED CORNER */}
                <div className="md:col-span-3 p-5 rounded-3xl bg-gradient-to-br from-rose-950/40 via-[#18181b] to-[#18181b] border border-rose-500/40 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-full text-xs font-black uppercase bg-rose-500 text-white">
                      🔴 RED CORNER
                    </span>
                    <span className="text-xs font-mono font-bold text-rose-400">
                      Bib #{activeMatchup.dancer1.bib}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <img
                      src={activeMatchup.dancer1.avatar}
                      alt={activeMatchup.dancer1.name}
                      className="w-14 h-14 rounded-2xl object-cover border-2 border-rose-500 shadow-lg"
                    />
                    <div>
                      <h3 className="text-lg font-black text-white">{activeMatchup.dancer1.name}</h3>
                      <p className="text-xs text-[#a1a1aa]">{activeMatchup.dancer1.crew || 'Independent'}</p>
                      <p className="text-xs font-mono text-rose-400">{activeMatchup.dancer1.danceOneId}</p>
                    </div>
                  </div>

                  {/* Red Corner Actions */}
                  <div className="space-y-2 pt-2 border-t border-rose-500/20">
                    <button
                      onClick={() => handleJudgeVote('dancer1')}
                      className="w-full py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-black shadow-lg transition-all flex items-center justify-center gap-2"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Vote RED Winner (Dancer 1)</span>
                    </button>
                    <button
                      onClick={() => handleAudienceVote('d1')}
                      className="w-full py-1.5 rounded-xl bg-[#27272a] hover:bg-[#3f3f46] text-[#a1a1aa] hover:text-white text-xs font-bold"
                    >
                      + Hype Red Corner ({activeMatchup.audienceVotes?.d1 || 142} Votes)
                    </button>
                  </div>
                </div>

                {/* CENTER TIMER & VERSUS BADGE */}
                <div className="md:col-span-1 flex flex-col items-center justify-center space-y-3 py-2">
                  <div className="w-10 h-10 rounded-full bg-[#27272a] border border-[#3f3f46] flex items-center justify-center text-xs font-black text-white">
                    VS
                  </div>

                  {/* Battle Clock */}
                  <div className="text-center p-3 rounded-2xl bg-[#18181b] border border-[#27272a] w-full">
                    <span className="text-xs uppercase font-bold text-[#71717a] block">Round Clock</span>
                    <span
                      className={`text-3xl sm:text-4xl font-mono font-black block tracking-tighter ${
                        timerSeconds <= 10 ? 'text-rose-500 animate-pulse' : 'text-white'
                      }`}
                    >
                      00:{timerSeconds.toString().padStart(2, '0')}
                    </span>

                    {/* Timer Controls */}
                    <div className="flex items-center justify-center gap-1.5 mt-2">
                      {!isTimerRunning ? (
                        <button
                          onClick={handleStartTimer}
                          className="p-2 rounded-xl bg-[#22c55e] text-black hover:bg-[#16a34a] transition-all"
                        >
                          <Play className="w-3.5 h-3.5 fill-current" />
                        </button>
                      ) : (
                        <button
                          onClick={handlePauseTimer}
                          className="p-2 rounded-xl bg-amber-500 text-black hover:bg-amber-400 transition-all"
                        >
                          <Pause className="w-3.5 h-3.5 fill-current" />
                        </button>
                      )}
                      <button
                        onClick={() => handleResetTimer()}
                        className="p-2 rounded-xl bg-[#27272a] text-zinc-300 hover:text-white transition-all"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Quick Presets */}
                    <div className="flex justify-center gap-1 mt-2">
                      {[30, 45, 60].map((sec) => (
                        <button
                          key={sec}
                          onClick={() => {
                            setPresetDuration(sec);
                            handleResetTimer(sec);
                          }}
                          className={`px-2 py-0.5 rounded text-xs font-bold ${
                            presetDuration === sec
                              ? 'bg-[#eab308] text-black'
                              : 'bg-[#27272a] text-[#71717a]'
                          }`}
                        >
                          {sec}s
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* BLUE CORNER */}
                <div className="md:col-span-3 p-5 rounded-3xl bg-gradient-to-br from-blue-950/40 via-[#18181b] to-[#18181b] border border-blue-500/40 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-full text-xs font-black uppercase bg-blue-600 text-white">
                      🔵 BLUE CORNER
                    </span>
                    <span className="text-xs font-mono font-bold text-blue-400">
                      Bib #{activeMatchup.dancer2.bib}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <img
                      src={activeMatchup.dancer2.avatar}
                      alt={activeMatchup.dancer2.name}
                      className="w-14 h-14 rounded-2xl object-cover border-2 border-blue-500 shadow-lg"
                    />
                    <div>
                      <h3 className="text-lg font-black text-white">{activeMatchup.dancer2.name}</h3>
                      <p className="text-xs text-[#a1a1aa]">{activeMatchup.dancer2.crew || 'Independent'}</p>
                      <p className="text-xs font-mono text-blue-400">{activeMatchup.dancer2.danceOneId}</p>
                    </div>
                  </div>

                  {/* Blue Corner Actions */}
                  <div className="space-y-2 pt-2 border-t border-blue-500/20">
                    <button
                      onClick={() => handleJudgeVote('dancer2')}
                      className="w-full py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-black shadow-lg transition-all flex items-center justify-center gap-2"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Vote BLUE Winner (Dancer 2)</span>
                    </button>
                    <button
                      onClick={() => handleAudienceVote('d2')}
                      className="w-full py-1.5 rounded-xl bg-[#27272a] hover:bg-[#3f3f46] text-[#a1a1aa] hover:text-white text-xs font-bold"
                    >
                      + Hype Blue Corner ({activeMatchup.audienceVotes?.d2 || 98} Votes)
                    </button>
                  </div>
                </div>
              </div>

              {/* Audience Live Hype Bar */}
              {activeMatchup.audienceVotingEnabled && (
                <div className="space-y-1.5 pt-2 border-t border-[#27272a]">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-rose-400">
                      Red Hype: {activeMatchup.audienceVotes?.d1 || 142} Votes
                    </span>
                    <span className="text-[#a1a1aa] uppercase text-xs">Live Audience Hype Meter</span>
                    <span className="text-blue-400">
                      Blue Hype: {activeMatchup.audienceVotes?.d2 || 98} Votes
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-[#27272a] rounded-full overflow-hidden flex">
                    <div
                      className="bg-rose-500 h-full transition-all duration-500"
                      style={{
                        width: `${
                          ((activeMatchup.audienceVotes?.d1 || 142) /
                            ((activeMatchup.audienceVotes?.d1 || 142) +
                              (activeMatchup.audienceVotes?.d2 || 98))) *
                          100
                        }%`,
                      }}
                    />
                    <div
                      className="bg-blue-500 h-full transition-all duration-500"
                      style={{
                        width: `${
                          ((activeMatchup.audienceVotes?.d2 || 98) /
                            ((activeMatchup.audienceVotes?.d1 || 142) +
                              (activeMatchup.audienceVotes?.d2 || 98))) *
                          100
                        }%`,
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="p-8 text-center rounded-3xl bg-[#18181b] border border-[#27272a] text-xs text-[#a1a1aa]">
              No active matchups found. Seed brackets to launch battles.
            </div>
          )}
        </div>
      )}

      {/* TAB 2: INTERACTIVE TOURNAMENT BRACKET */}
      {activeTab === 'brackets' && (
        <div className="space-y-6">
          <div className="p-5 rounded-3xl bg-[#18181b] border border-[#27272a] flex items-center justify-between flex-wrap gap-4">
            <div>
              <h3 className="text-base font-black text-white">Visual Battle Tournament Bracket</h3>
              <p className="text-xs text-[#a1a1aa]">
                Interactive bracket tree automatically advances victorious battlers to subsequent rounds.
              </p>
            </div>
            <span className="px-3 py-1 rounded-full bg-[#eab308]/20 text-[#eab308] border border-[#eab308]/40 text-xs font-bold">
              Single-Elimination (Top 8)
            </span>
          </div>

          {/* Visual Bracket Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 rounded-3xl bg-[#141417] border border-[#27272a] overflow-x-auto">
            {/* COLUMN 1: QUARTER-FINALS */}
            <div className="space-y-4">
              <div className="px-3 py-1.5 rounded-xl bg-[#202024] text-xs font-black text-white text-center border border-[#27272a]">
                QUARTER-FINALS (TOP 8)
              </div>

              {matchups
                .filter((m) => m.roundName === 'Quarter-Final')
                .map((m) => (
                  <div
                    key={m.id}
                    className="p-4 rounded-2xl bg-[#18181b] border border-[#27272a] space-y-2 relative"
                  >
                    <span className="text-xs font-bold text-[#71717a] block">Match #{m.matchNumber}</span>
                    <div
                      className={`p-2 rounded-xl flex items-center justify-between text-xs ${
                        m.winnerId === m.dancer1.id
                          ? 'bg-[#22c55e]/20 text-white font-black border border-[#22c55e]/40'
                          : 'bg-[#202024] text-[#d4d4d8]'
                      }`}
                    >
                      <span>#{m.dancer1.bib} {m.dancer1.name}</span>
                      {m.winnerId === m.dancer1.id && <Trophy className="w-3.5 h-3.5 text-[#eab308]" />}
                    </div>

                    <div
                      className={`p-2 rounded-xl flex items-center justify-between text-xs ${
                        m.winnerId === m.dancer2.id
                          ? 'bg-[#22c55e]/20 text-white font-black border border-[#22c55e]/40'
                          : 'bg-[#202024] text-[#d4d4d8]'
                      }`}
                    >
                      <span>#{m.dancer2.bib} {m.dancer2.name}</span>
                      {m.winnerId === m.dancer2.id && <Trophy className="w-3.5 h-3.5 text-[#eab308]" />}
                    </div>
                  </div>
                ))}
            </div>

            {/* COLUMN 2: SEMI-FINALS */}
            <div className="space-y-4">
              <div className="px-3 py-1.5 rounded-xl bg-[#202024] text-xs font-black text-white text-center border border-[#27272a]">
                SEMI-FINALS (TOP 4)
              </div>

              {matchups
                .filter((m) => m.roundName === 'Semi-Final')
                .map((m) => (
                  <div
                    key={m.id}
                    className="p-4 rounded-2xl bg-[#18181b] border border-[#27272a] space-y-2 my-auto"
                  >
                    <span className="text-xs font-bold text-[#71717a] block">Semi Match #{m.matchNumber}</span>
                    <div className="p-2 rounded-xl bg-[#202024] text-xs font-bold text-white flex items-center justify-between">
                      <span>#{m.dancer1.bib} {m.dancer1.name}</span>
                    </div>
                    <div className="p-2 rounded-xl bg-[#202024] text-xs font-bold text-[#71717a] flex items-center justify-between">
                      <span>{m.dancer2.name}</span>
                    </div>
                  </div>
                ))}
            </div>

            {/* COLUMN 3: FINALS */}
            <div className="space-y-4">
              <div className="px-3 py-1.5 rounded-xl bg-[#eab308] text-xs font-black text-black text-center shadow-lg">
                CHAMPIONSHIP FINAL
              </div>

              <div className="p-5 rounded-2xl bg-gradient-to-br from-[#18181b] to-[#202024] border-2 border-[#eab308]/60 space-y-3">
                <div className="flex items-center justify-center gap-2">
                  <Trophy className="w-5 h-5 text-[#eab308]" />
                  <span className="text-xs font-black text-[#eab308]">GOLD MEDAL MATCH</span>
                </div>
                <div className="p-2.5 rounded-xl bg-[#27272a] text-xs text-center font-bold text-[#a1a1aa]">
                  Winner Semi 1 vs Winner Semi 2
                </div>
                <p className="text-xs text-center text-[#71717a]">
                  3 Rounds • 60s per round • Red Bull Cash Prize & Trophy
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: DJ & MC CUES CONSOLE */}
      {activeTab === 'mc_dj_cues' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* DJ Cue Panel */}
          <div className="p-5 rounded-3xl bg-[#18181b] border border-[#27272a] space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#eab308]/20 text-[#eab308] flex items-center justify-center font-bold">
                <Disc3 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-white">DJ Audio & Track Cue Station</h3>
                <p className="text-xs text-[#a1a1aa]">BPM matching, round horns, and battle stings.</p>
              </div>
            </div>

            <div className="space-y-2">
              {[
                { title: 'James Brown - Give It Up Or Turnit A Loose (B-Boy Edit)', bpm: '118 BPM', duration: '3:45' },
                { title: 'The Incredible Bongo Band - Apache (Original Break)', bpm: '115 BPM', duration: '4:10' },
                { title: 'KRS-One - Sound of da Police (Cypher Instrumental)', bpm: '94 BPM', duration: '3:30' },
              ].map((t, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-2xl bg-[#202024] border border-[#27272a] flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <Play className="w-4 h-4 text-[#eab308] cursor-pointer" />
                    <div>
                      <span className="font-bold text-white block">{t.title}</span>
                      <span className="text-xs text-[#71717a]">{t.bpm} • {t.duration}</span>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-[#27272a] text-[#a1a1aa]">
                    Ready
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* MC Prompter Panel */}
          <div className="p-5 rounded-3xl bg-[#18181b] border border-[#27272a] space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold">
                <Mic className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-white">MC Stage Callouts & Ad-Libs</h3>
                <p className="text-xs text-[#a1a1aa]">Live teleprompter for host announcements.</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#202024] border border-[#27272a] space-y-2 text-xs text-[#d4d4d8]">
              <p className="font-bold text-white">📢 Next Stage Callout:</p>
              <p className="bg-[#18181b] p-3 rounded-xl border border-[#27272a] italic leading-relaxed">
                "Make some noise for our Quarter-Finalists! In the Red Corner, repping Mumbai B-Boyz, it's Kid Venom! And in the Blue Corner, popping straight out of Pune, Pop Master Neil! DJ drop the needle!"
              </p>
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  onClick={() => alert('Callout pushed to Stage Teleprompter screen.')}
                  className="px-3.5 py-1.5 rounded-xl bg-cyan-500 text-black text-xs font-black"
                >
                  Push to Stage Screen
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: RESULTS */}
      {activeTab === 'results' && (
        <div className="p-6 rounded-3xl bg-[#18181b] border border-[#27272a] space-y-4">
          <h3 className="text-base font-black text-white">Battle Hall of Fame & Results</h3>
          <p className="text-xs text-[#a1a1aa]">
            All completed matchups and judge vote logs for this tournament session.
          </p>

          <div className="space-y-3">
            {matchups
              .filter((m) => m.status === 'completed')
              .map((m) => (
                <div
                  key={m.id}
                  className="p-4 rounded-2xl bg-[#202024] border border-[#27272a] flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="font-bold text-[#eab308] uppercase text-xs block">
                      {m.roundName} #{m.matchNumber} Completed
                    </span>
                    <span className="font-bold text-white text-sm">
                      Winner: {m.winnerId === m.dancer1.id ? m.dancer1.name : m.dancer2.name}
                    </span>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-[#22c55e]/20 text-[#22c55e] border border-[#22c55e]/40 font-bold">
                    Official Decision
                  </span>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

