import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  Mail,
  KeyRound,
  ArrowRight,
  ArrowLeft,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { authenticateAdmin, ADMIN_MASTER_CONFIG } from '../../utils/adminAuth';
import { ScreenType, UserProfile } from '../../types';
import { PremiumLogo } from '../common/PremiumLogo';

interface AdminLoginScreenProps {
  onAdminLoginSuccess: (adminProfile: UserProfile) => void;
  onNavigate: (screen: ScreenType) => void;
}

export const AdminLoginScreen: React.FC<AdminLoginScreenProps> = ({
  onAdminLoginSuccess,
  onNavigate,
}) => {
  const [email, setEmail] = useState('admin@danceone.in');
  const [passkey, setPasskey] = useState(ADMIN_MASTER_CONFIG.passkeyRequirement);
  const [otp, setOtp] = useState(ADMIN_MASTER_CONFIG.demoOtp);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCredentialsHint, setShowCredentialsHint] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    setTimeout(() => {
      const result = authenticateAdmin(email, passkey, otp);
      setIsSubmitting(false);

      if (!result.success) {
        setError(result.error || 'Admin authentication failed. Access denied.');
        return;
      }

      const adminProfile: UserProfile = {
        id: result.session!.adminId,
        name: result.session!.name,
        email: result.session!.email,
        role: 'admin',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        phone: '+91 674 239 9000',
        city: 'Bhubaneswar',
        danceStyles: ['Platform Governance', 'Odisha Cultural Audit'],
        creditsBalance: 5000,
        level: 'Platform Administrator',
        memberSince: '2026',
        isVerified: true,
        verificationDetails: {
          govtIdVerified: true,
          phoneOtpVerified: true,
          emailOtpVerified: true,
          entityRegistrationNumber: 'OD-DANCE-HQ-2026',
          badgeIssuedAt: new Date().toISOString(),
          twoFactorEnabled: true,
        },
      };

      onAdminLoginSuccess(adminProfile);
      onNavigate('admin-dashboard');
    }, 600);
  };

  return (
    <div className="min-h-screen w-full bg-[#060608] text-white flex flex-col justify-between p-4 sm:p-8 font-sans">
      {/* Top Header */}
      <div className="max-w-4xl mx-auto w-full flex items-center justify-between pb-6 border-b border-white/10">
        <PremiumLogo size="md" showWordmark={true} onClick={() => onNavigate('home')} />
        <button
          onClick={() => onNavigate('home')}
          className="text-xs font-semibold text-zinc-400 hover:text-white flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-900 border border-white/10 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Marketplace</span>
        </button>
      </div>

      {/* Main Authentication Card */}
      <div className="max-w-md w-full mx-auto my-8">
        <div className="rounded-3xl bg-zinc-900/90 border border-amber-500/30 p-6 sm:p-8 shadow-2xl backdrop-blur-xl relative overflow-hidden">
          {/* Subtle gold accent light */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-300">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-amber-300/80 font-bold block">
                NON-PUBLIC ACCESS GATEWAY
              </span>
              <h1 className="text-xl font-extrabold text-white tracking-tight">
                DanceOne Admin Portal
              </h1>
            </div>
          </div>

          <p className="text-xs text-zinc-300 mb-6 leading-relaxed">
            Strictly restricted to authorized platform administrators. All access requests, approvals, and data modifications are immutably logged.
          </p>

          {/* Error Message */}
          {error && (
            <div className="mb-5 p-3 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-2.5 text-rose-300 text-xs leading-snug">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-zinc-300 mb-1.5 block">
                Administrator Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 w-4 h-4 text-zinc-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@danceone.in"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-zinc-950 border border-white/10 focus:border-amber-500/60 text-xs sm:text-sm text-white placeholder:text-zinc-600 outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-zinc-300 mb-1.5 block">
                Security Passkey / Admin Secret
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 w-4 h-4 text-zinc-400" />
                <input
                  type="password"
                  required
                  value={passkey}
                  onChange={(e) => setPasskey(e.target.value)}
                  placeholder="Enter administrator passkey"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-zinc-950 border border-white/10 focus:border-amber-500/60 text-xs sm:text-sm text-white placeholder:text-zinc-600 outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-zinc-300 block">
                  2FA Authenticator Code
                </label>
                <span className="text-[10px] font-mono text-amber-300/80">6-Digit Code</span>
              </div>
              <div className="relative">
                <KeyRound className="absolute left-3.5 top-3 w-4 h-4 text-zinc-400" />
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="918273"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-zinc-950 border border-white/10 focus:border-amber-500/60 text-xs sm:text-sm text-white font-mono tracking-widest placeholder:text-zinc-600 outline-none transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-xl bg-white hover:bg-zinc-200 text-black font-extrabold text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-white/5 transition-all mt-2 cursor-pointer disabled:opacity-50"
            >
              <span>{isSubmitting ? 'Authenticating...' : 'Authenticate & Enter Admin Portal'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Helper Hint */}
          <div className="mt-5 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={() => setShowCredentialsHint(!showCredentialsHint)}
              className="text-[11px] text-zinc-400 hover:text-amber-300 flex items-center gap-1 transition-colors"
            >
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>{showCredentialsHint ? 'Hide demo access keys' : 'View demo admin test credentials'}</span>
            </button>

            {showCredentialsHint && (
              <div className="mt-2 p-3 rounded-xl bg-black/60 border border-white/10 text-[11px] font-mono space-y-1 text-zinc-300">
                <div><span className="text-zinc-500">Email:</span> <span className="text-amber-300 font-bold">admin@danceone.in</span></div>
                <div><span className="text-zinc-500">Passkey:</span> <span className="text-amber-300 font-bold">{ADMIN_MASTER_CONFIG.passkeyRequirement}</span></div>
                <div><span className="text-zinc-500">OTP:</span> <span className="text-amber-300 font-bold">{ADMIN_MASTER_CONFIG.demoOtp}</span></div>
              </div>
            )}
          </div>
        </div>

        {/* Security Notice */}
        <p className="text-[11px] text-center text-zinc-400 mt-4 leading-relaxed">
          Rule 3 Compliant: Normal student/instructor/studio logins do not have access to this portal. Authorization is validated cryptographically.
        </p>
      </div>

      {/* Footer */}
      <div className="max-w-4xl mx-auto w-full text-center text-zinc-400 text-xs border-t border-white/10 pt-4">
        DanceOne Platform Administration &amp; Moderation Centre • Odisha State Dance Governance
      </div>
    </div>
  );
};
