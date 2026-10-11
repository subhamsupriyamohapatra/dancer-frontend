import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  TrendingUp,
  DollarSign,
  Users,
  Star,
  CheckCircle2,
  Briefcase,
  Sparkles,
  Building2,
  ArrowRight,
} from 'lucide-react';
import { ScreenType, DanceClass } from '../types';
import { INSTRUCTOR_GIGS_DATA, WORKSHOPS_DATA, NEAREST_STUDIOS_DATA } from '../data/danceData';

interface InstructorDashboardViewProps {
  onNavigate: (screen: ScreenType) => void;
  onSelectClass: (danceClass: DanceClass) => void;
}

export const InstructorDashboardView: React.FC<InstructorDashboardViewProps> = ({
  onNavigate,
  onSelectClass,
}) => {
  const [activeTab, setActiveTab] = useState<'schedule' | 'private_requests' | 'earnings' | 'gigs' | 'explore'>('schedule');
  const [appliedGigs, setAppliedGigs] = useState<string[]>([]);
  const [checkedInBatches, setCheckedInBatches] = useState<string[]>([]);

  interface PrivateBookingRequest {
    id: string;
    studentName: string;
    requestType: 'Wedding Sangeet Coaching' | '1-on-1 Battle Training' | 'Contemporary Solo Choreography';
    hours: number;
    proposedDate: string;
    proposedTime: string;
    location: string;
    offeredFee: number;
    status: 'pending' | 'accepted' | 'rejected';
    notes: string;
  }

  const [privateRequests, setPrivateRequests] = useState<PrivateBookingRequest[]>([
    {
      id: 'req-1',
      studentName: 'Priya Mohanty & Rahul Sen',
      requestType: 'Wedding Sangeet Coaching',
      hours: 6,
      proposedDate: 'Oct 24, 2026',
      proposedTime: '06:00 PM',
      location: 'Home Studio / Patia, Bhubaneswar',
      offeredFee: 15000,
      status: 'pending',
      notes: 'Need 3 Bollywood couple medley tracks choreographed before our Nov sangeet in Cuttack.',
    },
    {
      id: 'req-2',
      studentName: 'Debabrata Nayak',
      requestType: '1-on-1 Battle Training',
      hours: 4,
      proposedDate: 'Oct 22, 2026',
      proposedTime: '04:00 PM',
      location: 'Squad of Revolution Studio, CDA Sector 7',
      offeredFee: 4000,
      status: 'accepted',
      notes: 'Prep for Kalinga Cypher 2026 quarterfinals. Footwork speed and musicality drills.',
    },
  ]);

  const TODAY_BATCHES: Array<{
    id: string;
    time: string;
    title: string;
    studio: string;
    location: string;
    enrolled: number;
    capacity: number;
    status: string;
    ownership: 'studio_owned' | 'instructor_owned';
    ownershipLabel: string;
  }> = [
    {
      id: 'batch-1',
      time: '05:00 PM - 06:30 PM',
      title: 'Advanced Popping & Gliding Routine',
      studio: 'Squad of Revolution (SOR Crew)',
      location: 'CDA Sector 7, Cuttack',
      enrolled: 18,
      capacity: 20,
      status: 'Ongoing',
      ownership: 'studio_owned',
      ownershipLabel: 'Studio-Owned Class (Studio controls room & enrollment)',
    },
    {
      id: 'batch-2',
      time: '07:00 PM - 08:30 PM',
      title: 'Freestyle Cypher Battle Intensive',
      studio: 'Independent Faculty Session',
      location: 'Patia / Infocity, Bhubaneswar',
      enrolled: 12,
      capacity: 15,
      status: 'Scheduled',
      ownership: 'instructor_owned',
      ownershipLabel: 'Instructor-Owned Independent Class (Full faculty control)',
    },
  ];

  const handleApplyGig = (gigId: string) => {
    if (!appliedGigs.includes(gigId)) {
      setAppliedGigs([...appliedGigs, gigId]);
    }
  };

  const handleCheckIn = (batchId: string) => {
    setCheckedInBatches([...checkedInBatches, batchId]);
  };

  const handleAcceptRequest = (id: string) => {
    setPrivateRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'accepted' } : r))
    );
  };

  const handleRejectRequest = (id: string) => {
    setPrivateRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'rejected' } : r))
    );
  };

  return (
    <div className="w-full max-w-[1600px] mx-auto px-3 sm:px-6 py-4 space-y-6 pb-20 text-[#fafafa] font-sans">
      
      {/* 1. INSTRUCTOR HEADER & TABS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
        <div className="flex items-center gap-2.5">
          <span className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <Briefcase className="w-5 h-5" />
          </span>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                Abhilash Panda Choreography
              </h1>
              <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[10px] font-mono font-bold">
                VERIFIED FACULTY
              </span>
            </div>
            <p className="text-xs text-zinc-400">
              Instructor Suite • Hip-Hop & Battle Cypher Lead
            </p>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          {(
            [
              { id: 'schedule', label: "📅 Assigned Schedule" },
              { id: 'private_requests', label: `📩 Private Requests (${privateRequests.filter(r => r.status === 'pending').length})` },
              { id: 'earnings', label: '💰 Personal Earnings' },
              { id: 'gigs', label: `💼 Gigs (${INSTRUCTOR_GIGS_DATA.length})` },
              { id: 'explore', label: '✨ Upskill & Studios' },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                  : 'bg-zinc-900/80 text-zinc-400 hover:text-white hover:bg-zinc-800 border border-white/5'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 2. METRICS ROW */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-zinc-900 border border-white/10 space-y-1 shadow-md">
          <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
            <span>MONTHLY PAYOUT</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-bold text-white font-mono">₹0</p>
          <span className="text-xs font-mono text-emerald-400 block">0 payouts processed</span>
        </div>

        <div className="p-4 rounded-2xl bg-zinc-900 border border-white/10 space-y-1 shadow-md">
          <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
            <span>TEACHING HOURS</span>
            <Clock className="w-4 h-4 text-sky-400" />
          </div>
          <p className="text-2xl font-bold text-white font-mono">0.0 hrs</p>
          <span className="text-xs font-mono text-sky-400 block">0 batches scheduled</span>
        </div>

        <div className="p-4 rounded-2xl bg-zinc-900 border border-white/10 space-y-1 shadow-md">
          <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
            <span>STUDENTS TAUGHT</span>
            <Users className="w-4 h-4 text-purple-400" />
          </div>
          <p className="text-2xl font-bold text-white font-mono">0</p>
          <span className="text-xs font-mono text-purple-400 block">0 enrolled dancers</span>
        </div>

        <div className="p-4 rounded-2xl bg-zinc-900 border border-white/10 space-y-1 shadow-md">
          <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
            <span>STUDENT RATING</span>
            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
          </div>
          <p className="text-2xl font-bold text-white font-mono">New Faculty</p>
          <span className="text-xs font-mono text-zinc-400 block">Awaiting first reviews</span>
        </div>
      </div>

      {/* 3. TAB 1: DAILY SCHEDULE */}
      {activeTab === 'schedule' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white">Today's Batch Schedule & Check-ins</h3>
              <p className="text-xs text-zinc-400">Manage studio attendance and confirm on-site student rosters</p>
            </div>
            <span className="text-xs font-mono text-purple-400 font-bold">{TODAY_BATCHES.length} Sessions Today</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {TODAY_BATCHES.length === 0 ? (
              <div className="col-span-full py-16 text-center rounded-3xl bg-zinc-900/60 border border-dashed border-white/10 p-6 space-y-2">
                <p className="text-base font-bold text-white">No batches scheduled today</p>
                <p className="text-xs text-zinc-400 max-w-sm mx-auto">When dance studios assign cohorts to your faculty profile or you host a workshop, your daily schedule and roll-call will appear here.</p>
                <button
                  onClick={() => setActiveTab('gigs')}
                  className="mt-2 px-4 py-2 rounded-xl bg-purple-600 text-white text-xs font-bold hover:bg-purple-500 transition-colors"
                >
                  Explore Open Gigs
                </button>
              </div>
            ) : (
              TODAY_BATCHES.map((batch) => {
                const isCheckedIn = checkedInBatches.includes(batch.id);
                return (
                  <div
                    key={batch.id}
                    className="p-5 rounded-2xl bg-zinc-900 border border-white/10 hover:border-purple-500/60 transition-all duration-300 hover:shadow-xl flex flex-col justify-between space-y-3"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-bold text-purple-300 bg-purple-500/10 px-2.5 py-1 rounded-full border border-purple-500/30">
                          {batch.time}
                        </span>
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded-md font-bold ${
                          batch.ownership === 'studio_owned'
                            ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                            : 'bg-purple-500/15 text-purple-300 border border-purple-500/30'
                        }`}>
                          {batch.ownership === 'studio_owned' ? '🏢 Studio-Owned' : '🎓 Independent'}
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-white leading-snug">{batch.title}</h3>
                      <p className="text-xs text-zinc-400 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                        <span>{batch.studio}, {batch.location}</span>
                      </p>
                      <div className="p-2 rounded-xl bg-zinc-950/70 border border-white/5 text-[11px] text-zinc-400">
                        {batch.ownershipLabel}
                      </div>
                    </div>

                    <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs font-mono">
                      <span className="text-zinc-400 font-medium">Status: {batch.status}</span>
                      {batch.status === 'Completed' ? (
                        <span className="text-zinc-500 font-bold">Done ✓</span>
                      ) : isCheckedIn ? (
                        <span className="text-emerald-400 font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4" />
                          Checked-In
                        </span>
                      ) : (
                        <button
                          onClick={() => handleCheckIn(batch.id)}
                          className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-zinc-200 text-black font-bold flex items-center gap-1.5 shadow"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Check-in Roster
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* TAB: PRIVATE BOOKING REQUESTS (Rule 8: Student -> Request -> Instructor -> Accept/Reject -> Payment -> Confirmed) */}
      {activeTab === 'private_requests' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white">Private Coaching & Wedding Choreography Requests</h3>
              <p className="text-xs text-zinc-400">Rule 8: Student initiates request → Instructor accepts/rejects → Payment confirmed</p>
            </div>
            <span className="text-xs font-mono text-purple-400 font-bold">
              {privateRequests.length} Total Requests
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {privateRequests.map((req) => (
              <div
                key={req.id}
                className="p-5 rounded-2xl bg-zinc-900 border border-white/10 space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-purple-300 bg-purple-500/15 px-2.5 py-0.5 rounded-full border border-purple-500/30">
                      {req.requestType}
                    </span>
                    <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded-full ${
                      req.status === 'accepted'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : req.status === 'rejected'
                        ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                        : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    }`}>
                      {req.status.toUpperCase()}
                    </span>
                  </div>

                  <h4 className="text-base font-bold text-white">{req.studentName}</h4>
                  <p className="text-xs text-zinc-300 bg-zinc-950 p-2.5 rounded-xl border border-white/5">
                    "{req.notes}"
                  </p>

                  <div className="grid grid-cols-2 gap-2 text-xs text-zinc-400 pt-1 font-mono">
                    <div>
                      <span className="text-zinc-500 block">Proposed Time</span>
                      <span className="text-white">{req.proposedDate} • {req.proposedTime}</span>
                    </div>
                    <div>
                      <span className="text-zinc-500 block">Duration / Hours</span>
                      <span className="text-white">{req.hours} Hours Package</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-zinc-500 block font-mono text-[10px]">Offered Fee</span>
                    <span className="text-base font-extrabold text-emerald-400 font-mono">₹{req.offeredFee.toLocaleString()}</span>
                  </div>

                  {req.status === 'pending' ? (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleRejectRequest(req.id)}
                        className="px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 font-bold transition-colors"
                      >
                        Decline
                      </button>
                      <button
                        onClick={() => handleAcceptRequest(req.id)}
                        className="px-4 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold transition-colors shadow-md"
                      >
                        Accept & Schedule
                      </button>
                    </div>
                  ) : req.status === 'accepted' ? (
                    <span className="text-emerald-400 text-xs font-mono font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" />
                      Awaiting Student Payment
                    </span>
                  ) : (
                    <span className="text-zinc-500 text-xs font-mono">Request Declined</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. TAB 2: EARNINGS & HOURS */}
      {activeTab === 'earnings' && (
        <div className="p-6 rounded-3xl bg-zinc-900 border border-white/10 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-zinc-400 flex items-center gap-1.5 font-bold">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                EARNINGS BREAKDOWN
              </span>
              <h3 className="text-base sm:text-lg font-bold text-white mt-0.5">Faculty Payroll & Direct Bank Payouts</h3>
            </div>
            <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
              Direct IMPS Settled
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-zinc-950 border border-white/5 space-y-1">
              <span className="text-xs font-mono text-zinc-400 block">Regular Studio Batches</span>
              <p className="text-2xl font-bold text-white font-mono">₹0</p>
              <span className="text-xs text-zinc-400 block">0 enrolled dancers</span>
            </div>
            <div className="p-4 rounded-2xl bg-zinc-950 border border-white/5 space-y-1">
              <span className="text-xs font-mono text-zinc-400 block">Wedding & Private Choreography</span>
              <p className="text-2xl font-bold text-white font-mono">₹0</p>
              <span className="text-xs text-zinc-400 block">0 active coaching assignments</span>
            </div>
            <div className="p-4 rounded-2xl bg-zinc-950 border border-white/5 space-y-1">
              <span className="text-xs font-mono text-zinc-400 block">Special Masterclasses</span>
              <p className="text-2xl font-bold text-white font-mono">₹0</p>
              <span className="text-xs text-zinc-400 block">0 masterclass passes</span>
            </div>
          </div>
        </div>
      )}

      {/* 5. TAB 3: GIGS MARKETPLACE */}
      {activeTab === 'gigs' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white">Choreography & Teaching Opportunities</h3>
              <p className="text-xs text-zinc-400">Apply for high-budget commercial shoots, wedding sangeets, and masterclasses</p>
            </div>
            <span className="text-xs font-mono text-purple-400 font-bold">{INSTRUCTOR_GIGS_DATA.length} Open Gigs</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {INSTRUCTOR_GIGS_DATA.length === 0 ? (
              <div className="col-span-full py-16 text-center rounded-3xl bg-zinc-900/60 border border-dashed border-white/10 p-6 space-y-2">
                <p className="text-base font-bold text-white">No open gigs at this moment</p>
                <p className="text-xs text-zinc-400 max-w-sm mx-auto">Studios, event organizers, and wedding clients will list choreography opportunities here.</p>
              </div>
            ) : (
              INSTRUCTOR_GIGS_DATA.map((gig) => {
                const hasApplied = appliedGigs.includes(gig.id);
                return (
                  <div
                    key={gig.id}
                    className="p-5 rounded-2xl bg-zinc-900 border border-white/10 hover:border-purple-500/60 transition-all duration-300 hover:shadow-xl space-y-3 flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono uppercase px-2.5 py-1 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/30 font-semibold">
                          {gig.gigType}
                        </span>
                        {gig.urgent && (
                          <span className="text-xs font-bold text-rose-400 flex items-center gap-1">
                            ⚡ Urgent
                          </span>
                        )}
                      </div>
                      <h3 className="text-base font-bold text-white leading-snug">{gig.title}</h3>
                      <p className="text-xs text-zinc-300">Client: {gig.clientOrStudio}</p>
                      <p className="text-xs text-zinc-400 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                        <span>{gig.location} • {gig.date}</span>
                      </p>
                    </div>

                    <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs font-mono">
                      <div>
                        <span className="text-xs text-zinc-400 block">Budget</span>
                        <span className="text-base font-extrabold text-emerald-400 font-mono">
                          {gig.currency}{gig.budget.toLocaleString()}
                        </span>
                      </div>
                      <button
                        onClick={() => handleApplyGig(gig.id)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md ${
                          hasApplied
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : 'bg-white hover:bg-zinc-200 text-black'
                        }`}
                      >
                        {hasApplied ? 'Applied ✓' : 'Apply for Gig'}
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* 6. TAB 4: EXPLORE & UPSKILL */}
      {activeTab === 'explore' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="p-6 rounded-3xl bg-zinc-900 border border-white/10 space-y-4 shadow-xl">
            <span className="text-xs font-mono uppercase tracking-widest text-sky-400 flex items-center gap-2 font-bold">
              <Sparkles className="w-4 h-4" />
              Guest Masterclasses to Attend
            </span>
            <div className="space-y-3">
              {WORKSHOPS_DATA.length === 0 ? (
                <p className="text-xs text-zinc-400 py-6 text-center">No upcoming workshops scheduled yet.</p>
              ) : (
                WORKSHOPS_DATA.slice(0, 3).map((ws) => (
                  <div
                    key={ws.id}
                    onClick={() => onSelectClass(ws)}
                    className="p-3 rounded-2xl bg-zinc-950 border border-white/5 flex items-center gap-3 cursor-pointer hover:border-sky-500/40 transition-colors"
                  >
                    <img src={ws.image} alt={ws.title} className="w-14 h-14 rounded-xl object-cover" referrerPolicy="no-referrer" />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold text-white truncate">{ws.title}</h4>
                      <span className="text-xs text-zinc-400">Taught by {ws.instructor} • ₹{ws.price}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-zinc-900 border border-white/10 space-y-4 shadow-xl">
            <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 flex items-center gap-2 font-bold">
              <Building2 className="w-4 h-4" />
              Dance Studios for Rehearsal Rent
            </span>
            <div className="space-y-3">
              {NEAREST_STUDIOS_DATA.length === 0 ? (
                <p className="text-xs text-zinc-400 py-6 text-center">No studios listed for rehearsal rental yet.</p>
              ) : (
                NEAREST_STUDIOS_DATA.slice(0, 3).map((st) => (
                  <div
                    key={st.id}
                    onClick={() => onNavigate('studio-profile')}
                    className="p-3 rounded-2xl bg-zinc-950 border border-white/5 flex items-center gap-3 cursor-pointer hover:border-emerald-500/40 transition-colors"
                  >
                    <img src={st.heroImage} alt={st.name} className="w-14 h-14 rounded-xl object-cover" referrerPolicy="no-referrer" />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold text-white truncate">{st.name}</h4>
                      <span className="text-xs text-zinc-400">{st.neighborhood} • {st.priceRange}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

