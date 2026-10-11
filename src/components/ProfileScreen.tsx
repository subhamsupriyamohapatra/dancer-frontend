import React, { useState } from 'react';
import {
  User,
  Flame,
  Award,
  ChevronRight,
  ShieldCheck,
  Building2,
  Calendar,
  LogOut,
  Edit2,
  CheckCircle2,
  Briefcase,
  Trophy,
  Shield,
  Lock,
  Check,
} from 'lucide-react';
import { ScreenType, UserProfile, UserRole } from '../types';
import { validateAdminSession } from '../utils/adminAuth';

interface ProfileScreenProps {
  userProfile: UserProfile;
  currentRole: UserRole;
  onNavigate: (screen: ScreenType) => void;
  onRoleChange: (role: UserRole) => void;
  onLogout: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  userProfile,
  currentRole,
  onNavigate,
  onRoleChange,
  onLogout,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [nameInput, setNameInput] = useState(userProfile.name);
  const [locationInput, setLocationInput] = useState(userProfile.location);

  const isAdminAuthenticated = validateAdminSession().isValid || currentRole === 'admin';

  const BADGES = [
    { title: '12-Day Streak', desc: 'Consistent Floor Time', icon: Flame, color: 'text-amber-400' },
    { title: 'Masterclass Star', desc: '8+ Intensives Completed', icon: Award, color: 'text-sky-400' },
    { title: 'Verified Dancer', desc: 'Studio Certified Member', icon: ShieldCheck, color: 'text-amber-300' },
  ];

  return (
    <div className="w-full max-w-[1600px] mx-auto px-3 sm:px-6 py-4 space-y-6 pb-20 text-[#fafafa] font-sans">
      
      {/* 1. PROFILE OVERVIEW CARD */}
      <div className="p-6 rounded-3xl bg-zinc-900 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-5 shadow-2xl">
        <div className="flex items-center gap-4 text-left w-full sm:w-auto">
          <div className="relative shrink-0">
            <img
              src={userProfile.avatar}
              alt={userProfile.name}
              referrerPolicy="no-referrer"
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-white/20 shadow-md"
            />
            <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-purple-600 border-2 border-[#060608] flex items-center justify-center text-white">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-bold text-white leading-tight">
                {userProfile.name}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-mono uppercase font-bold">
                {currentRole === 'dancer' ? 'Student / Customer' : currentRole}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-zinc-400">{userProfile.location} • {userProfile.email}</p>
            <p className="text-xs text-zinc-500 font-mono">{userProfile.bio || 'DANCEONE Platform Member'}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-center">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-4 py-2 rounded-xl bg-white/[0.08] hover:bg-white text-white hover:text-black text-xs font-bold flex items-center gap-1.5 border border-white/10 transition-all shadow-sm"
          >
            <Edit2 className="w-3.5 h-3.5" />
            <span>{isEditing ? 'Close Edit' : 'Edit Profile'}</span>
          </button>
          <button
            onClick={onLogout}
            className="px-4 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 text-xs font-bold flex items-center gap-1.5 transition-all"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Edit Form (if toggled) */}
      {isEditing && (
        <div className="p-5 rounded-2xl bg-zinc-900 border border-white/10 space-y-3 text-xs shadow-xl">
          <span className="text-xs font-mono uppercase tracking-widest text-zinc-400 font-bold block">
            EDIT PROFILE DETAILS
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-mono text-zinc-400 block mb-1">Full Name</label>
              <input
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                className="w-full px-3 py-2 bg-zinc-950 border border-white/10 rounded-xl text-white text-xs outline-none focus:border-purple-500"
              />
            </div>
            <div>
              <label className="text-xs font-mono text-zinc-400 block mb-1">Location / City</label>
              <input
                type="text"
                value={locationInput}
                onChange={(e) => setLocationInput(e.target.value)}
                className="w-full px-3 py-2 bg-zinc-950 border border-white/10 rounded-xl text-white text-xs outline-none focus:border-purple-500"
              />
            </div>
          </div>
          <button
            onClick={() => setIsEditing(false)}
            className="px-4 py-2 rounded-xl bg-white text-black font-bold text-xs shadow-md"
          >
            Save Changes
          </button>
        </div>
      )}

      {/* 2. MULTI-ROLE SWITCHER (Rule 13: Switching roles must not bypass permissions) */}
      <div className="p-5 rounded-3xl bg-zinc-900 border border-white/10 space-y-4 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-white/10 pb-3">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-zinc-400 font-bold block">
              MULTI-ROLE PERSONA SWITCHER (RULE 13)
            </span>
            <p className="text-xs text-zinc-400">
              Switching your persona isolates dashboard data & permissions strictly per role.
            </p>
          </div>
          <span className="text-xs font-mono text-purple-400 font-bold px-2.5 py-1 rounded-lg bg-purple-500/10 border border-purple-500/20 self-start sm:self-auto">
            Active: {currentRole.toUpperCase()}
          </span>
        </div>

        <div className={`grid grid-cols-1 sm:grid-cols-2 ${isAdminAuthenticated ? 'lg:grid-cols-5' : 'lg:grid-cols-4'} gap-2.5`}>
          {(
            [
              { role: 'dancer' as UserRole, label: 'Student / Customer', icon: User, desc: 'Discover, book & review' },
              { role: 'instructor' as UserRole, label: 'Instructor', icon: Briefcase, desc: 'Teaching, schedule & gigs' },
              { role: 'studio' as UserRole, label: 'Studio Owner', icon: Building2, desc: 'Batches, CRM & ERP' },
              { role: 'organizer' as UserRole, label: 'Event Organizer', icon: Trophy, desc: 'Battles & tournaments' },
              ...(isAdminAuthenticated
                ? [{ role: 'admin' as UserRole, label: 'DanceOne Admin', icon: Shield, desc: 'Governance & audit' }]
                : []),
            ]
          ).map((r) => {
            const Icon = r.icon;
            const isCurrent = currentRole === r.role;
            return (
              <button
                key={r.role}
                onClick={() => onRoleChange(r.role)}
                className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition-all duration-200 cursor-pointer ${
                  isCurrent
                    ? 'bg-white text-black border-white shadow-lg shadow-white/10 font-bold ring-2 ring-purple-500/30'
                    : 'bg-zinc-950 border-white/5 text-zinc-400 hover:text-white hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-2">
                  <Icon className={`w-5 h-5 ${isCurrent ? 'text-black' : 'text-purple-400'}`} />
                  {isCurrent && (
                    <span className="text-[10px] font-mono uppercase bg-black text-white px-2 py-0.5 rounded-full font-bold">
                      Active
                    </span>
                  )}
                </div>
                <div>
                  <span className={`text-xs font-bold block truncate leading-tight ${isCurrent ? 'text-black' : 'text-white'}`}>
                    {r.label}
                  </span>
                  <span className={`text-[11px] font-mono block mt-0.5 truncate ${isCurrent ? 'text-zinc-600' : 'text-zinc-500'}`}>
                    {r.desc}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Admin Portal Entrance (Rule 3) */}
        {!isAdminAuthenticated && (
          <div className="pt-2 flex items-center justify-between text-xs border-t border-white/5">
            <span className="text-zinc-500 text-[11px]">Protected Platform Governance</span>
            <button
              onClick={() => onNavigate('admin-login')}
              className="text-amber-300 hover:text-amber-200 font-mono text-[11px] flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Lock className="w-3 h-3 text-amber-400" />
              <span>Enter Protected Admin Portal →</span>
            </button>
          </div>
        )}

        {/* Dynamic RBAC Permissions Transparency Box */}
        <div className="p-4 rounded-2xl bg-zinc-950 border border-white/5 space-y-3 text-xs">
          <div className="flex items-center justify-between border-b border-white/5 pb-2">
            <span className="font-mono text-zinc-400 font-bold uppercase tracking-wider text-[11px]">
              Active Role Permissions & Governance
            </span>
            <span className="text-zinc-500 text-[11px] font-mono">DanceOne RBAC Rules 2-6</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            {/* CAN section */}
            <div className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/20 space-y-1.5">
              <span className="font-bold text-amber-300 flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5" />
                What You CAN Do ({currentRole.toUpperCase()})
              </span>
              <ul className="text-zinc-300 text-[11px] space-y-1 pl-1">
                {currentRole === 'dancer' && (
                  <>
                    <li>• Browse verified studios, classes, workshops, styles & battles</li>
                    <li>• Book drop-ins & buy event tickets via DanceOne Gateway</li>
                    <li>• Access digital QR tickets and check-in to sessions</li>
                    <li>• Earn DanceOne credits & rewards</li>
                    <li>• Leave verified reviews after verified attendance (Rule 10)</li>
                  </>
                )}
                {currentRole === 'instructor' && (
                  <>
                    <li>• Manage instructor portfolio, dance styles & videos/photos</li>
                    <li>• Set teaching availability & personal calendar</li>
                    <li>• Create independent instructor-owned classes (Rule 3)</li>
                    <li>• Accept / reject private booking requests</li>
                    <li>• View students & attendance for assigned classes only (Rule 12)</li>
                    <li>• View personal teaching earnings & payout history</li>
                  </>
                )}
                {currentRole === 'studio' && (
                  <>
                    <li>• Operate studio profile, locations & practice rooms</li>
                    <li>• Create recurring batches & assign instructors</li>
                    <li>• Set room capacity, pricing, schedules & memberships</li>
                    <li>• Manage studio students, trials & attendance roll call</li>
                    <li>• View studio revenue, tax invoices & settlements</li>
                    <li>• Create studio-specific workshops & promote classes</li>
                  </>
                )}
                {currentRole === 'organizer' && (
                  <>
                    <li>• Create standalone workshops, masterclasses, battles & festivals</li>
                    <li>• Configure ticket tiers, pricing, capacity & promo codes</li>
                    <li>• Manage participant rosters & scan entry tickets</li>
                    <li>• Direct judge scoresheet portals & stage run orders</li>
                    <li>• View ticket sales revenue & platform settlements</li>
                  </>
                )}
                {currentRole === 'admin' && (
                  <>
                    <li>• Full platform governance across all 5 roles</li>
                    <li>• Verify studio owners, instructors & event organizers</li>
                    <li>• Approve / reject studios and public events</li>
                    <li>• Manage platform commissions & payment gateways</li>
                    <li>• View immutable system audit logs & security events</li>
                  </>
                )}
              </ul>
            </div>

            {/* CANNOT section */}
            <div className="p-3 rounded-xl bg-rose-500/5 border border-rose-500/20 space-y-1.5">
              <span className="font-bold text-rose-400 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5" />
                What You CANNOT Do (Enforced)
              </span>
              <ul className="text-zinc-400 text-[11px] space-y-1 pl-1">
                {currentRole === 'dancer' && (
                  <>
                    <li>✕ Cannot create studio, classes or recurring batches</li>
                    <li>✕ Cannot mark attendance for other users</li>
                    <li>✕ Cannot create public events or sell tickets (Rule 9)</li>
                    <li>✕ Cannot access studio finances or instructor earnings</li>
                    <li>✕ Cannot approve studios or leave unverified reviews</li>
                  </>
                )}
                {currentRole === 'instructor' && (
                  <>
                    <li>✕ Cannot create a studio or modify another studio's profile</li>
                    <li>✕ Cannot access studio finances or other instructors' earnings</li>
                    <li>✕ Cannot view students outside your assigned classes (Rule 12)</li>
                    <li>✕ Cannot create platform-wide events without authorization</li>
                    <li>✕ Cannot approve other instructors or alter platform settings</li>
                  </>
                )}
                {currentRole === 'studio' && (
                  <>
                    <li>✕ Cannot modify or access another studio's finances or students</li>
                    <li>✕ Cannot change DanceOne platform commission rates</li>
                    <li>✕ Cannot alter platform-wide settings or approve external events</li>
                    <li>✕ Cannot access another organizer's events or attendees</li>
                  </>
                )}
                {currentRole === 'organizer' && (
                  <>
                    <li>✕ Cannot create regular studio classes (unless verified studio)</li>
                    <li>✕ Cannot manage studio students or faculty</li>
                    <li>✕ Cannot modify another organizer's events</li>
                    <li>✕ Cannot access studio finances or change platform commissions</li>
                    <li>✕ Cannot approve own events (must pass Admin review)</li>
                  </>
                )}
                {currentRole === 'admin' && (
                  <>
                    <li>✕ All sensitive admin actions are logged to the audit trail</li>
                    <li>✕ Completed financial ledger entries cannot be manually edited</li>
                  </>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* 3. DANCE PASSPORT METRICS */}
      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-zinc-900 border border-white/10 space-y-1 text-center shadow-md">
          <span className="text-xs font-mono uppercase tracking-wider text-zinc-400 block">
            DANCE STREAK
          </span>
          <div className="text-xl sm:text-2xl font-extrabold text-white flex items-center justify-center gap-1.5">
            12 <span className="text-xs font-normal text-zinc-400">Days</span>
            <Flame className="w-5 h-5 text-amber-400 fill-amber-400" />
          </div>
          <p className="text-xs text-amber-300 font-mono font-medium">Personal Best: 18d</p>
        </div>

        <div className="p-4 rounded-2xl bg-zinc-900 border border-white/10 space-y-1 text-center shadow-md">
          <span className="text-xs font-mono uppercase tracking-wider text-zinc-400 block">
            FLOOR HOURS
          </span>
          <div className="text-xl sm:text-2xl font-extrabold text-white">
            38.5 <span className="text-xs font-normal text-zinc-400">Hrs</span>
          </div>
          <p className="text-xs text-zinc-400 font-mono">24 studio sessions</p>
        </div>

        <div className="p-4 rounded-2xl bg-zinc-900 border border-white/10 space-y-1 text-center shadow-md">
          <span className="text-xs font-mono uppercase tracking-wider text-zinc-400 block">
            PASS CREDITS
          </span>
          <div className="text-xl sm:text-2xl font-extrabold text-sky-400">
            4 <span className="text-xs font-normal text-zinc-400">Credits</span>
          </div>
          <p className="text-xs text-zinc-400 font-mono">Active across studios</p>
        </div>
      </div>

      {/* 4. EARNED BADGES & MILESTONES */}
      <div className="p-5 rounded-3xl bg-zinc-900 border border-white/10 space-y-3 shadow-md">
        <span className="text-xs font-mono uppercase tracking-widest text-zinc-400 block font-bold">
          EARNED BADGES & ACHIEVEMENTS
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {BADGES.map((b, idx) => {
            const Icon = b.icon;
            return (
              <div
                key={idx}
                className="p-3 rounded-2xl bg-zinc-950 border border-white/5 flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0 border border-white/5">
                  <Icon className={`w-5 h-5 ${b.color}`} />
                </div>
                <div className="truncate">
                  <h3 className="text-xs font-bold text-white truncate leading-tight">{b.title}</h3>
                  <p className="text-xs text-zinc-400 truncate mt-0.5">{b.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. QUICK NAVIGATION LINKS */}
      <div className="rounded-3xl bg-zinc-900 border border-white/10 divide-y divide-white/5 overflow-hidden shadow-lg">
        <div
          onClick={() => onNavigate('bookings')}
          className="p-4 flex items-center justify-between cursor-pointer hover:bg-white/[0.04] transition-colors"
        >
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-sky-400" />
            <div>
              <h4 className="text-sm font-bold text-white leading-tight">My Passes & QR Tickets</h4>
              <p className="text-xs text-zinc-400">View confirmed admission passes and check-in QR codes</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-zinc-400" />
        </div>

        <div
          onClick={() => onNavigate('challenges')}
          className="p-4 flex items-center justify-between cursor-pointer hover:bg-white/[0.04] transition-colors"
        >
          <div className="flex items-center gap-3">
            <Trophy className="w-5 h-5 text-amber-400" />
            <div>
              <h4 className="text-sm font-bold text-white leading-tight">Battle Arena & 7-Day Streaks</h4>
              <p className="text-xs text-zinc-400">Compete in habit challenges and check your community XP rank</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-zinc-400" />
        </div>
      </div>
    </div>
  );
};

