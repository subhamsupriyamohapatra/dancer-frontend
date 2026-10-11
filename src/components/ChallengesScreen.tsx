import React, { useState } from 'react';
import {
  Trophy,
  Flame,
  MapPin,
  Calendar,
  CheckCircle2,
  Award,
} from 'lucide-react';
import { ScreenType } from '../types';
import { COMPETITIONS_DATA, CHALLENGES_DATA } from '../data/danceData';

interface ChallengesScreenProps {
  onNavigate: (screen: ScreenType) => void;
}

export const ChallengesScreen: React.FC<ChallengesScreenProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'battles' | 'streaks' | 'leaderboard'>('battles');
  const [joinedChallenges, setJoinedChallenges] = useState<string[]>(['ch-1']);
  const [registeredBattles, setRegisteredBattles] = useState<string[]>([]);
  const [completedDays, setCompletedDays] = useState<{ [key: string]: number }>({ 'ch-1': 4 });

  const handleJoinChallenge = (id: string) => {
    if (!joinedChallenges.includes(id)) {
      setJoinedChallenges([...joinedChallenges, id]);
      setCompletedDays({ ...completedDays, [id]: 1 });
    }
  };

  const handleCheckInDay = (id: string) => {
    const current = completedDays[id] || 0;
    if (current < 7) {
      setCompletedDays({ ...completedDays, [id]: current + 1 });
    }
  };

  const handleRegisterBattle = (id: string) => {
    if (!registeredBattles.includes(id)) {
      setRegisteredBattles([...registeredBattles, id]);
    }
  };

  const LEADERBOARD = [
    { rank: 1, name: 'Aarav Mehta', xp: '14,800 XP', badges: 'Street King', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150' },
    { rank: 2, name: 'Ananya Roy', xp: '12,450 XP', badges: 'Floor Master', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150' },
    { rank: 3, name: 'Kavya Pillai', xp: '11,900 XP', badges: 'Waacking Queen', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150' },
    { rank: 4, name: 'Rohan Deshmukh', xp: '10,200 XP', badges: 'Cypher Legend', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150' },
  ];

  return (
    <div className="w-full max-w-[1600px] mx-auto px-3 sm:px-6 py-4 space-y-6 pb-20 text-[#fafafa] font-sans">
      
      {/* 1. HEADER & TABS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
        <div className="flex items-center gap-2.5">
          <span className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Trophy className="w-5 h-5" />
          </span>
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-white tracking-tight">
              Battles & Challenges
            </h1>
            <p className="text-xs text-zinc-400">
              National tournament arenas, 7-day dance streaks & XP leaderboard
            </p>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          {(
            [
              { id: 'battles', label: `🏆 Battles (${COMPETITIONS_DATA.length})` },
              { id: 'streaks', label: `🔥 7-Day Streaks (${CHALLENGES_DATA.length})` },
              { id: 'leaderboard', label: '⭐ XP Leaderboard' },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-amber-500 text-black font-extrabold shadow-lg shadow-amber-500/25'
                  : 'bg-zinc-900/80 text-zinc-400 hover:text-white hover:bg-zinc-800 border border-white/5'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 2. TAB 1: BATTLES */}
      {activeTab === 'battles' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {COMPETITIONS_DATA.map((comp) => {
            const isRegistered = registeredBattles.includes(comp.id);
            return (
              <div
                key={comp.id}
                className="group rounded-2xl bg-zinc-900 border border-white/10 hover:border-amber-500/60 overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-amber-500/10 flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-44 w-full overflow-hidden bg-zinc-950">
                    <img
                      src={comp.image}
                      alt={comp.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    <span className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full bg-amber-500 text-black text-xs font-mono uppercase font-extrabold shadow">
                      {comp.badge || comp.format}
                    </span>
                    <span className="absolute bottom-2 right-2.5 text-xs font-mono text-white bg-black/70 px-2 py-0.5 rounded-lg border border-white/10">
                      {comp.date}
                    </span>
                  </div>

                  <div className="p-4 space-y-2">
                    <h3 className="text-base font-bold text-white group-hover:text-amber-300 transition-colors line-clamp-1">
                      {comp.title}
                    </h3>
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-amber-300 font-bold">🏆 {comp.prizePool}</span>
                      <span className="text-zinc-400">{comp.registeredTeams} Reg</span>
                    </div>
                    <p className="text-xs text-zinc-400 flex items-center gap-1 line-clamp-1">
                      <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>{comp.venue}, {comp.city}</span>
                    </p>
                  </div>
                </div>

                <div className="p-4 pt-2 border-t border-white/10 flex items-center justify-between text-xs font-mono">
                  <span className="text-sm font-bold text-white">Fee: ₹{comp.entryFee}</span>
                  <button
                    onClick={() => handleRegisterBattle(comp.id)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shadow-md ${
                      isRegistered
                        ? 'bg-amber-500/10 text-amber-300 border border-amber-500/30'
                        : 'bg-white hover:bg-zinc-200 text-black'
                    }`}
                  >
                    {isRegistered ? 'Registered ✓' : 'Register Crew'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 3. TAB 2: 7-DAY STREAKS */}
      {activeTab === 'streaks' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {CHALLENGES_DATA.map((ch) => {
            const isJoined = joinedChallenges.includes(ch.id);
            const day = completedDays[ch.id] || 0;
            return (
              <div
                key={ch.id}
                className="p-5 rounded-2xl bg-zinc-900 border border-white/10 hover:border-purple-500/60 transition-all duration-300 hover:shadow-xl space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono uppercase px-2.5 py-1 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20 font-semibold">
                      {ch.category}
                    </span>
                    <span className="text-xs font-bold text-amber-400 flex items-center gap-1">
                      <Flame className="w-3.5 h-3.5 fill-current" />
                      <span>{ch.rewardText}</span>
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-white leading-snug">{ch.title}</h3>
                    <p className="text-xs text-zinc-400 mt-0.5">Difficulty: {ch.difficulty} • +{ch.xpPoints} XP</p>
                  </div>

                  {/* 7-Day Dots Indicator */}
                  <div className="space-y-1.5 pt-2 border-t border-white/5">
                    <div className="flex justify-between text-xs font-mono text-zinc-400">
                      <span>Completion Streak</span>
                      <span className="font-bold text-white">{day}/7 Days</span>
                    </div>
                    <div className="flex gap-1.5">
                      {[1, 2, 3, 4, 5, 6, 7].map((d) => (
                        <div
                          key={d}
                          className={`h-2 flex-1 rounded-full transition-all ${
                            d <= day ? 'bg-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.4)]' : 'bg-white/10'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                  <span className="text-zinc-400">{ch.participantsCount} enrolled</span>
                  {isJoined ? (
                    <button
                      onClick={() => handleCheckInDay(ch.id)}
                      disabled={day >= 7}
                      className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-black text-xs font-bold transition-all disabled:opacity-50 shadow-md"
                    >
                      {day >= 7 ? 'Completed 🎉' : `Check-in Day ${day + 1}`}
                    </button>
                  ) : (
                    <button
                      onClick={() => handleJoinChallenge(ch.id)}
                      className="px-4 py-2 rounded-xl bg-white hover:bg-zinc-200 text-black text-xs font-bold transition-all shadow-md"
                    >
                      Join Challenge
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 4. TAB 3: LEADERBOARD */}
      {activeTab === 'leaderboard' && (
        <div className="p-6 rounded-3xl bg-zinc-900 border border-white/10 space-y-4 max-w-3xl mx-auto shadow-2xl">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-zinc-400">
                COMMUNITY XP LEADERBOARD
              </span>
              <h3 className="text-base sm:text-lg font-bold text-white mt-0.5">Top Dancers This Season</h3>
            </div>
            <span className="text-xs font-mono text-zinc-300 bg-white/5 px-2.5 py-1 rounded-full border border-white/10">
              ● Live Sync
            </span>
          </div>

          <div className="divide-y divide-white/5">
            {LEADERBOARD.map((dancer) => (
              <div key={dancer.rank} className="py-3.5 flex items-center justify-between">
                <div className="flex items-center gap-3.5">
                  <span
                    className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs font-mono shadow-sm ${
                      dancer.rank === 1
                        ? 'bg-amber-400 text-black shadow-amber-400/20'
                        : dancer.rank === 2
                        ? 'bg-zinc-300 text-black'
                        : dancer.rank === 3
                        ? 'bg-amber-700 text-white'
                        : 'bg-white/10 text-zinc-400'
                    }`}
                  >
                    #{dancer.rank}
                  </span>
                  <img
                    src={dancer.avatar}
                    alt={dancer.name}
                    className="w-10 h-10 rounded-xl object-cover border border-white/10"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <h4 className="text-sm font-bold text-white leading-tight">{dancer.name}</h4>
                    <span className="text-xs text-zinc-400">{dancer.badges}</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-sm font-mono font-extrabold text-amber-300">{dancer.xp}</span>
                  <span className="text-xs text-zinc-500 block">All-Styles Rank</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
