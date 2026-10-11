/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * DanceOne Access Denied / Permission Denied Screen Guard
 * Enforces Rule 14: Role-Based Access Control (RBAC)
 * Displays a clean, informative 403 Forbidden screen when an unauthorized role tries to access a restricted view.
 */

import React, { useState } from 'react';
import {
  ShieldAlert,
  Lock,
  ArrowLeft,
  RefreshCw,
  UserCheck,
  AlertTriangle,
  Info,
  ChevronDown,
  ChevronUp,
  Building2,
  Trophy,
  Briefcase,
  User,
  Shield,
} from 'lucide-react';
import { ScreenType, UserRole } from '../../types';

interface AccessDeniedGuardProps {
  currentRole: UserRole;
  attemptedScreen: ScreenType;
  reason?: string;
  requiredRoles?: UserRole[];
  onNavigate: (screen: ScreenType) => void;
  onRoleChange: (role: UserRole) => void;
}

export const AccessDeniedGuard: React.FC<AccessDeniedGuardProps> = ({
  currentRole,
  attemptedScreen,
  reason,
  requiredRoles = [],
  onNavigate,
  onRoleChange,
}) => {
  const [showRoleInfo, setShowRoleInfo] = useState(false);

  const getRoleDisplayName = (r: UserRole): string => {
    switch (r) {
      case 'admin':
        return 'DanceOne Admin';
      case 'instructor':
        return 'Instructor / Faculty';
      case 'studio':
        return 'Studio Owner';
      case 'organizer':
        return 'Event Organizer';
      case 'dancer':
      default:
        return 'Student / Customer';
    }
  };

  const getRoleDefaultScreen = (r: UserRole): ScreenType => {
    switch (r) {
      case 'admin':
        return 'admin-dashboard';
      case 'instructor':
        return 'instructor-dashboard';
      case 'studio':
        return 'studio-dashboard';
      case 'organizer':
        return 'organizer-dashboard';
      case 'dancer':
      default:
        return 'home';
    }
  };

  const primaryAllowedRole = requiredRoles.length > 0 ? requiredRoles[0] : null;

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4 sm:p-6 font-sans">
      <div className="w-full max-w-xl bg-zinc-900/90 border border-rose-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden backdrop-blur-xl text-center space-y-6">
        {/* Glow ambient background */}
        <div className="absolute -right-20 -top-20 w-56 h-56 bg-rose-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 w-56 h-56 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* 403 Forbidden Badge & Icon */}
        <div className="flex flex-col items-center space-y-3">
          <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 shadow-lg shadow-rose-500/10">
            <Lock className="w-8 h-8 stroke-[2.2]" />
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-mono font-bold uppercase tracking-wider">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>403 Access Denied • RBAC Enforced</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            Restricted Platform Feature
          </h1>
        </div>

        {/* Reason Explanation Box */}
        <div className="p-4 rounded-2xl bg-zinc-950/80 border border-white/10 text-left space-y-2 text-xs">
          <div className="flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-1 text-zinc-300 leading-relaxed">
              <p className="font-semibold text-white">
                {reason ||
                  'Your current persona does not have clearance to view or perform operations in this section.'}
              </p>
              <p className="text-zinc-400">
                DanceOne strictly enforces Role-Based Access Control (RBAC) to ensure customer data privacy,
                financial isolation, and governance.
              </p>
            </div>
          </div>

          <div className="pt-3 border-t border-white/5 grid grid-cols-2 gap-3 text-[11px] font-mono">
            <div>
              <span className="text-zinc-500 block uppercase">Current Persona</span>
              <span className="text-amber-400 font-bold">{getRoleDisplayName(currentRole)}</span>
            </div>
            <div>
              <span className="text-zinc-500 block uppercase">Authorized Roles</span>
              <span className="text-emerald-400 font-bold">
                {requiredRoles.map((r) => getRoleDisplayName(r)).join(' or ') || 'Platform Admin'}
              </span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row items-center gap-3 justify-center pt-2">
          {/* Safe Return Button */}
          <button
            onClick={() => onNavigate(getRoleDefaultScreen(currentRole))}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-white hover:bg-zinc-200 text-black font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to {getRoleDisplayName(currentRole)} Dashboard</span>
          </button>

          {/* Quick Role Switcher Button if appropriate */}
          {primaryAllowedRole && primaryAllowedRole !== currentRole && (
            <button
              onClick={() => onRoleChange(primaryAllowedRole)}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-purple-600/25 transition-all active:scale-95"
            >
              <UserCheck className="w-4 h-4" />
              <span>Switch to {getRoleDisplayName(primaryAllowedRole)}</span>
            </button>
          )}
        </div>

        {/* Role & Permission Rules Guide Collapsible */}
        <div className="pt-2 text-left">
          <button
            onClick={() => setShowRoleInfo(!showRoleInfo)}
            className="w-full py-2 flex items-center justify-between text-xs text-zinc-400 hover:text-zinc-200 font-mono transition-colors"
          >
            <span className="flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-purple-400" />
              <span>DanceOne Role & Permission Rules Guide</span>
            </span>
            {showRoleInfo ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {showRoleInfo && (
            <div className="mt-3 p-4 rounded-2xl bg-black/60 border border-white/5 space-y-3 text-xs text-zinc-300">
              <div className="space-y-1">
                <span className="text-white font-bold flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-sky-400" />
                  Student / Customer:
                </span>
                <p className="text-[11px] text-zinc-400">
                  Consumers only. Can browse studios/classes, book passes, check attendance, earn credits,
                  and leave verified reviews after participation. Cannot create classes, events, or view financials.
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-white font-bold flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-purple-400" />
                  Instructor:
                </span>
                <p className="text-[11px] text-zinc-400">
                  Teaching profile, availability, assigned students (for their own classes only), private booking
                  requests, and personal earnings. Cannot manage studio finances or platform events.
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-white font-bold flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-emerald-400" />
                  Studio:
                </span>
                <p className="text-[11px] text-zinc-400">
                  Studio business operations: batches, rooms, studio student CRM, attendance roll call,
                  settlements, and faculty management. Private to the studio owner.
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-white font-bold flex items-center gap-1.5">
                  <Trophy className="w-3.5 h-3.5 text-amber-400" />
                  Event Organizer:
                </span>
                <p className="text-[11px] text-zinc-400">
                  Standalone workshops, battles, competitions, and shows. Ticket tiers, QR scanners, and
                  attendee rosters. Does not manage studio batches.
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-white font-bold flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-rose-400" />
                  DanceOne Admin:
                </span>
                <p className="text-[11px] text-zinc-400">
                  Platform governance, partner verifications (studios, instructors, organizers), commissions,
                  and audit logging.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
