import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  User,
  GraduationCap,
  Building2,
  Trophy,
  ArrowRight,
  ArrowLeft,
  Lock,
  Mail,
  Phone,
  CheckCircle2,
  ShieldCheck,
  Zap,
  Sparkles,
  FileText,
  BadgeCheck,
  RefreshCw,
  Award,
  KeyRound,
  Check,
  ExternalLink,
} from 'lucide-react';
import { UserRole, UserProfile, VerificationDetails } from '../types';
import { ROLE_USER_PRESETS } from '../data/danceData';
import { api } from '../services/api';
import { PremiumLogo } from './common/PremiumLogo';

interface AuthScreenProps {
  onAuthSuccess?: (userProfile: UserProfile) => void;
  onLoginSuccess?: (role: UserRole, userProfile: UserProfile) => void;
  onSkipAsDancer?: () => void;
  onOpenAdminPortal?: () => void;
}

type AuthFlowStep =
  | 'role-select'
  | 'auth-form'
  | 'signup-verify-docs'
  | 'signup-otp'
  | 'verified-badge-success';

export const AuthScreen: React.FC<AuthScreenProps> = ({
  onAuthSuccess,
  onLoginSuccess,
  onSkipAsDancer,
  onOpenAdminPortal,
}) => {
  // Flow State
  const [authStep, setAuthStep] = useState<AuthFlowStep>('role-select');
  const [selectedRole, setSelectedRole] = useState<UserRole>('dancer');
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');

  // Account Credentials
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [noticeMessage, setNoticeMessage] = useState<string | null>(null);

  // Role-Specific Professional Verification Fields (Sign Up)
  // 1. Organizer
  const [orgEntityName, setOrgEntityName] = useState('');
  const [orgGovtRegOrGstin, setOrgGovtRegOrGstin] = useState('');
  const [orgPortfolioLink, setOrgPortfolioLink] = useState('');
  const [orgEventTypes, setOrgEventTypes] = useState('');

  // 2. Choreographer / Instructor
  const [choreoStageTitle, setChoreoStageTitle] = useState('');
  const [choreoStyles, setChoreoStyles] = useState('');
  const [choreoExpYears, setChoreoExpYears] = useState('');
  const [choreoCertOrShowreel, setChoreoCertOrShowreel] = useState('');
  const [choreoAffiliation, setChoreoAffiliation] = useState('Freelance Choreographer');

  // 3. Studio Owner
  const [studioTradeName, setStudioTradeName] = useState('');
  const [studioAddressCity, setStudioAddressCity] = useState('');
  const [studioRegOrGstin, setStudioRegOrGstin] = useState('');
  const [studioFloorFacility, setStudioFloorFacility] = useState('');
  const [studioSettlementUpi, setStudioSettlementUpi] = useState('');

  // Google & Phone OTP Login State
  const [authMethod, setAuthMethod] = useState<'phone' | 'email'>('phone');
  const [phoneStep, setPhoneStep] = useState<'input' | 'otp'>('input');
  const [phoneInput, setPhoneInput] = useState('');
  const [phoneOtpDigits, setPhoneOtpDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [phoneGeneratedOtp, setPhoneGeneratedOtp] = useState('684920');
  const [phoneTimer, setPhoneTimer] = useState(45);
  const phoneOtpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // 6-digit OTP Code Input State
  const [otpDigits, setOtpDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [otpTimer, setOtpTimer] = useState(45);
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Verified Profile to persist on completion
  const [verifiedProfilePending, setVerifiedProfilePending] = useState<UserProfile | null>(null);

  // Countdown timer for OTP
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (authStep === 'signup-otp' && otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [authStep, otpTimer]);

  // Countdown timer for Phone OTP
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (authStep === 'auth-form' && authMethod === 'phone' && phoneStep === 'otp' && phoneTimer > 0) {
      interval = setInterval(() => {
        setPhoneTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [authStep, authMethod, phoneStep, phoneTimer]);

  const triggerAuth = (role: UserRole, profile: UserProfile) => {
    if (onAuthSuccess) {
      onAuthSuccess(profile);
    } else if (onLoginSuccess) {
      onLoginSuccess(role, profile);
    }
  };

  const ROLE_CONFIGS: {
    role: UserRole;
    displayTitle: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    tagline: string;
    badge: string;
    color: string;
    accentBg: string;
    pillColor: string;
    badgeTitle: string;
    requiresVerification: boolean;
  }[] = [
    {
      role: 'dancer',
      displayTitle: '🎓 Student / Dancer',
      label: 'Student / Dancer',
      icon: User,
      tagline: 'Book classes, join battles & explore dance studios',
      badge: 'Student / Dancer',
      color: 'border-[#3b82f6] text-[#3b82f6]',
      accentBg: 'bg-[#3b82f6]/10',
      pillColor: 'bg-[#3b82f6] text-white',
      badgeTitle: 'Student / Dancer',
      requiresVerification: false,
    },
    {
      role: 'instructor',
      displayTitle: '🕺 Choreographer / Faculty',
      label: 'Choreographer / Faculty',
      icon: GraduationCap,
      tagline: 'Manage batches, teach masterclasses & accept bookings',
      badge: 'Choreographer / Faculty',
      color: 'border-[#a855f7] text-[#a855f7]',
      accentBg: 'bg-[#a855f7]/10',
      pillColor: 'bg-[#a855f7] text-white',
      badgeTitle: 'Choreographer / Faculty',
      requiresVerification: true,
    },
    {
      role: 'studio',
      displayTitle: '🏢 Studio Owner',
      label: 'Studio Owner',
      icon: Building2,
      tagline: 'Manage halls, flooring slots, batches & settlements',
      badge: 'Studio Owner',
      color: 'border-amber-500/40 text-amber-300',
      accentBg: 'bg-amber-500/10',
      pillColor: 'bg-amber-400 text-black',
      badgeTitle: 'Studio Owner',
      requiresVerification: true,
    },
    {
      role: 'organizer',
      displayTitle: '🏆 Organizer',
      label: 'Organizer',
      icon: Trophy,
      tagline: 'Publish workshops, battles, cyphers & ticketed events',
      badge: 'Organizer',
      color: 'border-amber-500 text-amber-400',
      accentBg: 'bg-amber-500/10',
      pillColor: 'bg-amber-500 text-black',
      badgeTitle: 'Organizer',
      requiresVerification: true,
    },
  ];

  const activeConfig = ROLE_CONFIGS.find((c) => c.role === selectedRole) || ROLE_CONFIGS[0];

  const handleSelectRole = (role: UserRole) => {
    setSelectedRole(role);
    setAuthStep('auth-form');
    setPhoneStep('input');
    setErrorMessage(null);
  };

  // Google Sign-In Handler
  const handleGoogleSignIn = () => {
    setIsLoading(true);
    setErrorMessage(null);

    setTimeout(() => {
      setIsLoading(false);
      if (selectedRole === 'admin') {
        triggerAuth('admin', ROLE_USER_PRESETS.admin);
        return;
      }
      if (selectedRole === 'dancer') {
        const googleDancer: UserProfile = {
          name: fullName.trim() || 'Google Dancer User',
          email: email.trim() || 'dancer.user@gmail.com',
          phone: phone.trim() || '+91 94370 12345',
          location: 'Bhubaneswar, Odisha',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
          danceStreakDays: 5,
          weeklyGoalCompleted: 2,
          weeklyGoalTotal: 3,
          savedFavorites: ['ws-bbsr-1'],
          role: 'dancer',
          isVerified: true,
        };
        triggerAuth('dancer', googleDancer);
        return;
      }

      // Professional role signing in with Google
      if (authMode === 'signup') {
        setEmail(email.trim() || 'partner.odisha@gmail.com');
        setFullName(fullName.trim() || `${activeConfig.label} Lead`);
        setAuthStep('signup-verify-docs');
      } else {
        // 2FA removed: professional roles log in directly
        const preset = ROLE_USER_PRESETS[selectedRole];
        triggerAuth(selectedRole, {
          ...preset,
          name: fullName.trim() || preset.name,
          email: email.trim() || preset.email,
        });
      }
    }, 550);
  };

  // Phone OTP Flow Handlers
  const handleSendPhoneOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanNumber = phoneInput.replace(/\D/g, '');
    if (cleanNumber.length < 10) {
      setErrorMessage('Please enter a valid 10-digit mobile number.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    setTimeout(() => {
      setIsLoading(false);
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      setPhoneGeneratedOtp(code);
      setPhoneOtpDigits(['', '', '', '', '', '']);
      setPhoneTimer(45);
      setPhoneStep('otp');
    }, 400);
  };

  const handlePhoneOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newDigits = [...phoneOtpDigits];
    newDigits[index] = value.slice(-1);
    setPhoneOtpDigits(newDigits);

    if (value && index < 5) {
      phoneOtpInputRefs.current[index + 1]?.focus();
    }
  };

  const handlePhoneOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !phoneOtpDigits[index] && index > 0) {
      phoneOtpInputRefs.current[index - 1]?.focus();
    }
  };

  const handleAutoFillPhoneOtp = (code: string) => {
    const chars = code.split('').slice(0, 6);
    setPhoneOtpDigits(chars);
    setErrorMessage(null);
  };

  const handleResendPhoneOtp = () => {
    const freshOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setPhoneGeneratedOtp(freshOtp);
    setPhoneOtpDigits(['', '', '', '', '', '']);
    setPhoneTimer(45);
    setErrorMessage(`New SMS OTP sent: ${freshOtp}`);
  };

  const handleVerifyPhoneOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const entered = phoneOtpDigits.join('');
    if (entered.length < 6) {
      setErrorMessage('Please enter the complete 6-digit OTP code.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    setTimeout(() => {
      setIsLoading(false);
      const clean10 = phoneInput.replace(/\D/g, '').slice(-10);

      if (selectedRole === 'admin') {
        triggerAuth('admin', ROLE_USER_PRESETS.admin);
        return;
      }

      if (selectedRole === 'dancer') {
        const phoneDancer: UserProfile = {
          name: fullName.trim() || 'Odisha Dancer',
          email: `${clean10}@mobile.danceone.io`,
          phone: `+91 ${clean10}`,
          location: 'Bhubaneswar, Odisha',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
          danceStreakDays: 1,
          weeklyGoalCompleted: 0,
          weeklyGoalTotal: 3,
          savedFavorites: [],
          role: 'dancer',
          isVerified: true,
        };
        triggerAuth('dancer', phoneDancer);
        return;
      }

      // Professional role via Phone OTP
      if (authMode === 'signup') {
        setPhone(`+91 ${clean10}`);
        setAuthStep('signup-verify-docs');
      } else {
        const preset = ROLE_USER_PRESETS[selectedRole];
        triggerAuth(selectedRole, {
          ...preset,
          phone: `+91 ${clean10}`,
        });
      }
    }, 450);
  };

  // Helper to handle OTP digit changes
  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newDigits = [...otpDigits];
    newDigits[index] = value.slice(-1);
    setOtpDigits(newDigits);

    // Auto-advance to next cell
    if (value && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  // Ask the backend to emit the (hardcoded) verification code to its console,
  // then move the user to the code-entry step.
  const beginVerification = async (purpose: 'signup' | 'login' = 'signup') => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      await api.auth.sendCode({
        email: email.trim() || `${selectedRole}@danceone.io`,
        role: selectedRole,
        purpose,
      });
      setOtpDigits(['', '', '', '', '', '']);
      setOtpTimer(60);
      setAuthStep('signup-otp');
    } catch (err: any) {
      setErrorMessage(
        err?.message || 'Unable to reach the verification service. Make sure the backend is running.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = () => {
    beginVerification('signup');
  };

  // After a successful signup for any module, do NOT auto-login — send the
  // user to the Sign In tab instead.
  const promptSignInAfterSignup = () => {
    setVerifiedProfilePending(null);
    setPassword('');
    setOtpDigits(['', '', '', '', '', '']);
    setErrorMessage(null);
    setNoticeMessage('Account created successfully. Please sign in to continue.');
    setAuthMode('signin');
    setAuthStep('auth-form');
  };

  // Form submission handler
  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setNoticeMessage(null);
    setIsLoading(true);

    if (authMode === 'signup') {
      // Create the account up-front so we can detect an existing user.
      try {
        await api.auth.register({
          name: fullName.trim() || activeConfig.label,
          email: email.trim(),
          password: password || undefined,
          role: selectedRole,
          phone: phone.trim() || undefined,
          location: 'Bhubaneswar, Odisha',
        });
      } catch (err: any) {
        const msg = String(err?.message || '');
        const isDuplicate = /already exist/i.test(msg) || /409/.test(msg);
        const isUnreachable = /failed to fetch|network|load failed/i.test(msg);

        if (isDuplicate) {
          setIsLoading(false);
          setErrorMessage('An account with this email already exists. Please sign in instead.');
          setAuthMode('signin');
          return;
        }
        if (!isUnreachable) {
          setIsLoading(false);
          setErrorMessage(msg || 'Could not create the account. Please try again.');
          return;
        }
        // Backend unreachable → continue in local-first mode.
      }

      if (selectedRole === 'studio') {
        // Studio Owner: skip the KYC document step, but still require the
        // backend-printed verification code before completing signup.
        beginVerification('signup');
        return;
      }
      if (activeConfig.requiresVerification) {
        // Professional role: proceed to verification-details step.
        setIsLoading(false);
        setAuthStep('signup-verify-docs');
        return;
      }
      // Dancer: account created → prompt sign in.
      setIsLoading(false);
      promptSignInAfterSignup();
      return;
    }

    // Sign In Flow — everyone logs in directly.
    const preset = ROLE_USER_PRESETS[selectedRole] || ROLE_USER_PRESETS.dancer;
    const userProfile: UserProfile = {
      ...preset,
      name: fullName.trim() || preset.name,
      email: email.trim() || preset.email,
      phone: phone.trim() || preset.phone || '+91 98201 00000',
      role: selectedRole,
      isVerified: true,
      verificationBadge: activeConfig.badgeTitle,
    };
    setIsLoading(false);
    triggerAuth(selectedRole, userProfile);
  };

  // Submit professional verification documents (Step 2 of Signup)
  const handleVerificationDocsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    beginVerification('signup');
  };

  // Verify OTP for Sign Up
  const handleVerifySignUpOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const enteredOtp = otpDigits.join('');
    if (enteredOtp.length < 6) {
      setErrorMessage('Please enter the full 6-digit verification code.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    api.auth
      .verifyCode({ email: email.trim() || `${selectedRole}@danceone.io`, code: enteredOtp })
      .then(() => {
        // Build Verified Details
      let verDetails: VerificationDetails = {
        status: 'verified',
        verifiedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        badgeTitle: activeConfig.badgeTitle,
        otpVerified: true,
      };

      let newProfile: UserProfile = {
        name: fullName.trim() || `${activeConfig.label} Professional`,
        email: email.trim() || `${selectedRole}@danceone.io`,
        phone: phone.trim() || '+91 98201 00000',
        location: 'Mumbai, IND',
        avatar:
          selectedRole === 'instructor'
            ? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80'
            : selectedRole === 'studio'
            ? 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80'
            : 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80',
        danceStreakDays: 0,
        weeklyGoalCompleted: 0,
        weeklyGoalTotal: 0,
        savedFavorites: [],
        role: selectedRole,
        isVerified: true,
        verificationBadge: activeConfig.badgeTitle,
      };

      if (selectedRole === 'organizer') {
        verDetails = {
          ...verDetails,
          businessOrEntityName: orgEntityName.trim() || 'Dance Productions Hub',
          documentNumberOrLink: orgGovtRegOrGstin.trim() || 'GSTIN27AABB1234F1Z9',
          documentType: 'GSTIN / Event License',
        };
        newProfile.organizationName = orgEntityName.trim() || 'Dance Productions Hub';
      } else if (selectedRole === 'instructor') {
        verDetails = {
          ...verDetails,
          businessOrEntityName: choreoStageTitle.trim() || 'Lead Faculty',
          yearsOfExperience: choreoExpYears.trim() || '5+ Years',
          documentNumberOrLink: choreoCertOrShowreel.trim() || 'Certified Dance Graduate',
          documentType: 'Certification & Reel',
        };
        newProfile.instructorTitle = choreoStageTitle.trim() || 'Certified Faculty';
      } else if (selectedRole === 'studio') {
        verDetails = {
          ...verDetails,
          businessOrEntityName: studioTradeName.trim() || 'My Dance Studio',
          studioAddress: studioAddressCity.trim() || 'Mumbai, IND',
          documentNumberOrLink: studioRegOrGstin.trim() || 'COMM-REG-2026-991',
          documentType: 'Commercial Lease & GSTIN',
        };
        newProfile.studioName = studioTradeName.trim() || 'My Dance Studio';
      }

      newProfile.verificationDetails = verDetails;
      setVerifiedProfilePending(newProfile);
      setIsLoading(false);
      setAuthStep('verified-badge-success');
      })
      .catch((err: any) => {
        setIsLoading(false);
        setErrorMessage(err?.message || 'Invalid verification code. Check the backend console.');
      });
  };

  return (
    <div className="min-h-screen w-full bg-[#060608] text-[#fafafa] flex flex-col items-center justify-center p-3 sm:p-6 md:p-10 relative overflow-hidden font-sans">
      {/* Background Ambience */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-purple-600/[0.04] rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-emerald-500/[0.04] rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-lg relative z-10">
        <AnimatePresence mode="wait">
          {/* ============================================================== */}
          {/* STEP 1: MINIMALIST ROLE SELECTION */}
          {/* ============================================================== */}
          {authStep === 'role-select' && (
            <motion.div
              key="role-select"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.2 }}
              className="w-full bg-[#0c0d12] border border-white/[0.08] rounded-3xl p-5 sm:p-7 shadow-2xl space-y-5"
            >
              <div className="text-center flex flex-col items-center space-y-2">
                <PremiumLogo size="md" showWordmark={true} showTagline={false} />
                <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  Select Platform Profile
                </h1>
                <p className="text-xs text-zinc-400">
                  Choose your role to get started with DanceOne.
                </p>
              </div>

              {/* Roles List */}
              <div className="space-y-2.5">
                {ROLE_CONFIGS.map((cfg) => {
                  const Icon = cfg.icon;
                  const isSelected = selectedRole === cfg.role;
                  return (
                    <button
                      key={cfg.role}
                      type="button"
                      onClick={() => setSelectedRole(cfg.role)}
                      className={`w-full p-3.5 rounded-2xl border text-left transition-all duration-150 flex items-center justify-between group ${
                        isSelected
                          ? `bg-[#09090b] ${cfg.color} border-white/40 shadow-sm ring-1 ring-white/20`
                          : 'bg-[#09090b]/60 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:bg-[#09090b]'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center border shrink-0 transition-all ${
                            isSelected
                              ? `${cfg.accentBg} ${cfg.color}`
                              : 'bg-zinc-900 border-zinc-800 text-zinc-300 group-hover:text-white'
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-white block leading-tight">
                              {cfg.displayTitle}
                            </span>
                          </div>
                          <span className="text-xs text-zinc-500 block truncate mt-0.5">
                            {cfg.tagline}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 ml-2">
                        {isSelected && <Check className="w-4 h-4 text-white shrink-0" />}
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-bold tracking-wider ${
                            isSelected ? cfg.pillColor : 'bg-zinc-800 text-zinc-400'
                          }`}
                        >
                          {isSelected ? 'Active' : 'Select'}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-2">
                <button
                  type="button"
                  onClick={() => handleSelectRole(selectedRole)}
                  className="w-full py-3.5 px-4 rounded-xl bg-white hover:bg-zinc-200 text-black font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg active:scale-[0.99]"
                >
                  <span>Continue as {activeConfig.label}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <div className="flex items-center justify-between text-xs text-zinc-400 pt-1">
                  <button
                    type="button"
                    onClick={() => onSkipAsDancer && onSkipAsDancer()}
                    className="hover:text-white transition-colors"
                  >
                    Skip as Guest Dancer
                  </button>
                  {onOpenAdminPortal && (
                    <button
                      type="button"
                      onClick={onOpenAdminPortal}
                      className="inline-flex items-center gap-1 text-zinc-500 hover:text-amber-300 font-mono text-[11px] transition-colors"
                    >
                      <Lock className="w-3 h-3 text-amber-500/70" />
                      <span>Admin Portal</span>
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* ============================================================== */}
          {/* STEP 2: ACCOUNT CREDENTIALS FORM */}
          {/* ============================================================== */}
          {authStep === 'auth-form' && (
            <motion.div
              key="auth-form"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="bg-[#0c0d12] border border-white/[0.08] rounded-3xl p-5 sm:p-7 shadow-2xl space-y-6"
            >
              {/* Back to role selection */}
              <div className="flex items-center justify-between gap-3 border-b border-white/[0.08] pb-4">
                <button
                  type="button"
                  onClick={() => setAuthStep('role-select')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-zinc-300 hover:text-white text-xs font-semibold transition-all"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Change Role</span>
                </button>

                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs font-bold text-white">
                  <activeConfig.icon className="w-3.5 h-3.5 text-purple-400" />
                  <span>{activeConfig.label}</span>
                  {activeConfig.requiresVerification && (
                    <span className="text-amber-400/80 text-[10px] font-mono">• Verified Onboarding</span>
                  )}
                </div>
              </div>

              {/* Title & Mode Switcher */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                    {authMode === 'signin'
                      ? `${activeConfig.label} Sign In`
                      : `Create ${activeConfig.label} Account`}
                  </h2>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    {authMode === 'signin'
                      ? 'Sign in to access your bookings and dashboard.'
                      : selectedRole === 'studio'
                      ? 'Enter your email and password, then verify the code printed in the backend console.'
                      : activeConfig.requiresVerification
                      ? 'Step 1 of 3: Account info followed by professional credentials & OTP.'
                      : 'Join Dance One instantly to discover and book classes.'}
                  </p>
                </div>

                <div className="flex p-1 bg-zinc-950 border border-white/10 rounded-xl shrink-0 self-start sm:self-auto">
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode('signin');
                      setErrorMessage(null);
                      setNoticeMessage(null);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      authMode === 'signin'
                        ? 'bg-white text-black shadow'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    Sign In
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode('signup');
                      setErrorMessage(null);
                      setNoticeMessage(null);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      authMode === 'signup'
                        ? 'bg-white text-black shadow'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    Sign Up
                  </button>
                </div>
              </div>

              {/* Success notice banner (e.g. after signup → sign in) */}
              {noticeMessage && (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
                  {noticeMessage}
                </div>
              )}

              {/* Error banner */}
              {errorMessage && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold">
                  {errorMessage}
                </div>
              )}

              {/* 1. Continue with Google */}
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                className="w-full py-3 px-4 rounded-xl bg-white hover:bg-zinc-100 text-zinc-900 font-bold text-xs sm:text-sm flex items-center justify-center gap-3 border border-zinc-200 shadow-md transition-all active:scale-[0.99] disabled:opacity-50"
              >
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Continue with Google</span>
              </button>

              {/* 2. Divider */}
              <div className="flex items-center gap-3 my-1">
                <div className="h-px flex-1 bg-white/10" />
                <span className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider">or sign in with</span>
                <div className="h-px flex-1 bg-white/10" />
              </div>

              {/* 3. Auth Method Tabs */}
              <div className="grid grid-cols-2 p-1 bg-zinc-950 border border-white/10 rounded-xl gap-1">
                <button
                  type="button"
                  onClick={() => {
                    setAuthMethod('phone');
                    setErrorMessage(null);
                  }}
                  className={`py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                    authMethod === 'phone'
                      ? 'bg-zinc-800 text-white shadow'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Phone Number OTP</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAuthMethod('email');
                    setErrorMessage(null);
                  }}
                  className={`py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                    authMethod === 'email'
                      ? 'bg-zinc-800 text-white shadow'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Email & Password</span>
                </button>
              </div>

              {/* 4A. PHONE NUMBER OTP FORM */}
              {authMethod === 'phone' && (
                <div className="space-y-4">
                  {phoneStep === 'input' ? (
                    <form onSubmit={handleSendPhoneOtp} className="space-y-4">
                      {authMode === 'signup' && (
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-zinc-300">Legal / Stage Name</label>
                          <div className="relative">
                            <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                            <input
                              type="text"
                              required
                              value={fullName}
                              onChange={(e) => setFullName(e.target.value)}
                              placeholder={selectedRole === 'dancer' ? 'e.g. Maya Rao' : 'e.g. Master Alex / Production Name'}
                              className="w-full pl-9 pr-3 py-2.5 bg-zinc-950 border border-zinc-800 focus:border-white text-xs sm:text-sm text-white placeholder:text-zinc-600 rounded-xl outline-none transition-all"
                            />
                          </div>
                        </div>
                      )}

                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-zinc-300">
                          {activeConfig.label} Mobile Number
                        </label>
                        <div className="flex items-center gap-2">
                          <span className="px-3 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-xs sm:text-sm font-mono font-bold text-zinc-300 shrink-0">
                            🇮🇳 +91
                          </span>
                          <div className="relative flex-1">
                            <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                            <input
                              type="tel"
                              required
                              maxLength={10}
                              value={phoneInput}
                              onChange={(e) => setPhoneInput(e.target.value.replace(/\D/g, ''))}
                              placeholder="98201 00000"
                              className="w-full pl-9 pr-3 py-2.5 bg-zinc-950 border border-zinc-800 focus:border-white text-xs sm:text-sm text-white placeholder:text-zinc-600 rounded-xl outline-none transition-all font-mono tracking-wider"
                            />
                          </div>
                        </div>
                        <span className="text-[11px] text-zinc-500">
                          A 6-digit verification code will be sent via SMS to this number.
                        </span>
                      </div>

                      <button
                        type="submit"
                        disabled={isLoading || phoneInput.length < 10}
                        className="w-full py-3.5 rounded-xl bg-white hover:bg-zinc-200 text-black font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all disabled:opacity-50"
                      >
                        {isLoading ? (
                          <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <>
                            <span>Get Verification Code</span>
                            <ArrowRight className="w-4 h-4" />
                          </>
                        )}
                      </button>
                    </form>
                  ) : (
                    /* OTP VERIFICATION STEP */
                    <form onSubmit={handleVerifyPhoneOtp} className="space-y-4">
                      <div className="p-3 rounded-xl bg-zinc-950/80 border border-white/10 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-purple-400" />
                          <span>Code sent to <strong className="text-white font-mono">+91 {phoneInput}</strong></span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setPhoneStep('input')}
                          className="text-purple-400 hover:underline font-semibold"
                        >
                          Change
                        </button>
                      </div>

                      {/* Demo Quick auto-fill button */}
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-zinc-400">Enter 6-digit OTP code</span>
                        <button
                          type="button"
                          onClick={() => handleAutoFillPhoneOtp(phoneGeneratedOtp)}
                          className="px-2 py-0.5 rounded-md bg-purple-500/10 border border-purple-500/30 text-purple-300 font-mono text-[11px] hover:bg-purple-500/20"
                        >
                          Auto-fill: {phoneGeneratedOtp}
                        </button>
                      </div>

                      {/* 6 Digit Inputs */}
                      <div className="grid grid-cols-6 gap-2">
                        {phoneOtpDigits.map((digit, index) => (
                          <input
                            key={index}
                            ref={(el) => (phoneOtpInputRefs.current[index] = el)}
                            type="text"
                            inputMode="numeric"
                            maxLength={1}
                            value={digit}
                            onChange={(e) => handlePhoneOtpChange(index, e.target.value)}
                            onKeyDown={(e) => handlePhoneOtpKeyDown(index, e)}
                            className="w-full h-12 text-center text-lg font-mono font-bold bg-zinc-950 border border-zinc-800 focus:border-white text-white rounded-xl outline-none"
                          />
                        ))}
                      </div>

                      {/* Resend & Timer */}
                      <div className="flex items-center justify-between text-xs text-zinc-400">
                        {phoneTimer > 0 ? (
                          <span>Resend OTP in <strong className="text-white font-mono">{phoneTimer}s</strong></span>
                        ) : (
                          <button
                            type="button"
                            onClick={handleResendPhoneOtp}
                            className="text-purple-400 hover:underline font-semibold"
                          >
                            Resend OTP Code
                          </button>
                        )}
                        <span className="text-zinc-500 font-mono text-[11px]">Secure SMS Gateway</span>
                      </div>

                      <button
                        type="submit"
                        disabled={isLoading || phoneOtpDigits.join('').length < 6}
                        className="w-full py-3.5 rounded-xl bg-white hover:bg-zinc-200 text-black font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all disabled:opacity-50"
                      >
                        {isLoading ? (
                          <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <span>Verify & Sign In</span>
                        )}
                      </button>
                    </form>
                  )}
                </div>
              )}

              {/* 4B. EMAIL & PASSWORD FORM */}
              {authMethod === 'email' && (
                <form onSubmit={handleCredentialsSubmit} className="space-y-4">
                  {authMode === 'signup' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-zinc-300">Legal / Stage Name</label>
                        <div className="relative">
                          <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                          <input
                            type="text"
                            required
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            placeholder={selectedRole === 'dancer' ? 'e.g. Maya Rao' : 'e.g. Master Alex / Production Name'}
                            className="w-full pl-9 pr-3 py-2.5 bg-zinc-950 border border-zinc-800 focus:border-white text-xs sm:text-sm text-white placeholder:text-zinc-600 rounded-xl outline-none transition-all"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-zinc-300">Contact Mobile</label>
                        <div className="relative">
                          <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                          <input
                            type="tel"
                            required
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="+91 98201 00000"
                            className="w-full pl-9 pr-3 py-2.5 bg-zinc-950 border border-zinc-800 focus:border-white text-xs sm:text-sm text-white placeholder:text-zinc-600 rounded-xl outline-none transition-all"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-zinc-300">
                      {activeConfig.label} Email Address
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder={`${selectedRole}@danceone.io`}
                        className="w-full pl-9 pr-3 py-2.5 bg-zinc-950 border border-zinc-800 focus:border-white text-xs sm:text-sm text-white placeholder:text-zinc-600 rounded-xl outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold text-zinc-300">Password</label>
                      {authMode === 'signin' && (
                        <span className="text-xs text-purple-400 font-medium">Forgot password?</span>
                      )}
                    </div>
                    <div className="relative">
                      <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                      <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••••••"
                        className="w-full pl-9 pr-3 py-2.5 bg-zinc-950 border border-zinc-800 focus:border-white text-xs sm:text-sm text-white placeholder:text-zinc-600 rounded-xl outline-none transition-all"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3.5 rounded-xl bg-white hover:bg-zinc-200 text-black font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all disabled:opacity-50 mt-2"
                  >
                    {isLoading ? (
                      <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <span>
                          {authMode === 'signup'
                            ? selectedRole === 'studio'
                              ? 'Create Studio Account'
                              : activeConfig.requiresVerification
                              ? 'Continue to Verification Details (Step 2/3) →'
                              : 'Create Dancer Account'
                            : `Sign In as ${activeConfig.label}`}
                        </span>
                      </>
                    )}
                  </button>
                </form>
              )}

              {/* Security info note & Admin Portal entrance */}
              <div className="pt-3 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-zinc-400">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                  <span>
                    {selectedRole === 'studio'
                      ? 'Studio owners verify via the code printed in the backend console'
                      : authMode === 'signin'
                      ? 'End-to-end encrypted secure sign-in'
                      : activeConfig.requiresVerification
                      ? 'Professional verification enforced during partner onboarding'
                      : 'End-to-end encrypted booking authentication'}
                  </span>
                </div>

                {onOpenAdminPortal && (
                  <button
                    type="button"
                    onClick={onOpenAdminPortal}
                    className="text-xs font-semibold text-zinc-400 hover:text-amber-300 underline transition-colors"
                  >
                    Platform Admin Portal Access →
                  </button>
                )}
              </div>
            </motion.div>
          )}

          {/* ============================================================== */}
          {/* STEP 3A: PROFESSIONAL VERIFICATION CREDENTIALS (SIGNUP STEP 2) */}
          {/* ============================================================== */}
          {authStep === 'signup-verify-docs' && (
            <motion.div
              key="signup-verify-docs"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="bg-[#0c0d12] border border-white/[0.08] rounded-3xl p-5 sm:p-7 shadow-2xl space-y-6"
            >
              <div className="flex items-center justify-between gap-3 border-b border-white/[0.08] pb-4">
                <button
                  type="button"
                  onClick={() => setAuthStep('auth-form')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-zinc-300 hover:text-white text-xs font-semibold transition-all"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>

                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Verification Step 2 of 3</span>
                </div>
              </div>

              <div>
                <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  {activeConfig.label} Professional Verification
                </h2>
                <p className="text-xs text-zinc-400 mt-1">
                  To safeguard tickets, payments, and masterclasses, please provide your professional registration credentials.
                </p>
              </div>

              <form onSubmit={handleVerificationDocsSubmit} className="space-y-4">
                {/* 1. ORGANIZER FIELDS */}
                {selectedRole === 'organizer' && (
                  <div className="space-y-3.5">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-zinc-300">
                        Registered Entity / Production Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={orgEntityName}
                        onChange={(e) => setOrgEntityName(e.target.value)}
                        placeholder="e.g. Red Bull Dance India / Urban Cypher Hub"
                        className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 focus:border-amber-400 text-xs sm:text-sm text-white rounded-xl outline-none transition-all"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-zinc-300">
                        GSTIN / Govt Registration / Event License Number *
                      </label>
                      <input
                        type="text"
                        required
                        value={orgGovtRegOrGstin}
                        onChange={(e) => setOrgGovtRegOrGstin(e.target.value)}
                        placeholder="e.g. 27AADCE2918Q1Z4 or REG-EVT-2026-90"
                        className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 focus:border-amber-400 text-xs sm:text-sm text-white rounded-xl outline-none transition-all font-mono"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-zinc-300">
                        Official Portfolio / Social Media Showcase Link *
                      </label>
                      <input
                        type="url"
                        required
                        value={orgPortfolioLink}
                        onChange={(e) => setOrgPortfolioLink(e.target.value)}
                        placeholder="https://instagram.com/dancebattle_india"
                        className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 focus:border-amber-400 text-xs sm:text-sm text-white rounded-xl outline-none transition-all"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-zinc-300">
                        Primary Event Formats Hosted
                      </label>
                      <input
                        type="text"
                        value={orgEventTypes}
                        onChange={(e) => setOrgEventTypes(e.target.value)}
                        placeholder="e.g. 1v1 Street Battles, Workshops, Dance Camps, Mega Showcases"
                        className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 focus:border-amber-400 text-xs sm:text-sm text-white rounded-xl outline-none transition-all"
                      />
                    </div>
                  </div>
                )}

                {/* 2. CHOREOGRAPHER FIELDS */}
                {selectedRole === 'instructor' && (
                  <div className="space-y-3.5">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-zinc-300">
                        Choreographer / Faculty Title *
                      </label>
                      <input
                        type="text"
                        required
                        value={choreoStageTitle}
                        onChange={(e) => setChoreoStageTitle(e.target.value)}
                        placeholder="e.g. Lead Urban Choreography & Contemporary Faculty"
                        className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 focus:border-purple-500 text-xs sm:text-sm text-white rounded-xl outline-none transition-all"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-zinc-300">
                          Dance Disciplines & Styles *
                        </label>
                        <input
                          type="text"
                          required
                          value={choreoStyles}
                          onChange={(e) => setChoreoStyles(e.target.value)}
                          placeholder="e.g. Contemporary, Hip-Hop, Popping"
                          className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 focus:border-purple-500 text-xs sm:text-sm text-white rounded-xl outline-none transition-all"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-zinc-300">
                          Years of Teaching Experience *
                        </label>
                        <input
                          type="text"
                          required
                          value={choreoExpYears}
                          onChange={(e) => setChoreoExpYears(e.target.value)}
                          placeholder="e.g. 5+ Years"
                          className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 focus:border-purple-500 text-xs sm:text-sm text-white rounded-xl outline-none transition-all"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-zinc-300">
                        Dance Degree / Certification or Video Showreel Link *
                      </label>
                      <input
                        type="text"
                        required
                        value={choreoCertOrShowreel}
                        onChange={(e) => setChoreoCertOrShowreel(e.target.value)}
                        placeholder="https://youtube.com/watch?v=showreel2026 or Certified Shiamak Graduate"
                        className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 focus:border-purple-500 text-xs sm:text-sm text-white rounded-xl outline-none transition-all"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-zinc-300">
                        Representation / Affiliation Status
                      </label>
                      <select
                        value={choreoAffiliation}
                        onChange={(e) => setChoreoAffiliation(e.target.value)}
                        className="w-full px-3 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-xs sm:text-sm text-white outline-none"
                      >
                        <option value="Freelance Choreographer">Freelance Masterclass Artist</option>
                        <option value="Resident Studio Faculty">Resident Studio Faculty</option>
                        <option value="Agency Represented">Agency Represented Choreographer</option>
                      </select>
                    </div>
                  </div>
                )}

                {/* 3. STUDIO OWNER FIELDS */}
                {selectedRole === 'studio' && (
                  <div className="space-y-3.5">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-zinc-300">
                        Registered Studio Trade Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={studioTradeName}
                        onChange={(e) => setStudioTradeName(e.target.value)}
                        placeholder="e.g. The Movement Sanctuary"
                        className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 focus:border-amber-400 text-xs sm:text-sm text-white rounded-xl outline-none transition-all"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-zinc-300">
                        Studio Physical Address & City *
                      </label>
                      <input
                        type="text"
                        required
                        value={studioAddressCity}
                        onChange={(e) => setStudioAddressCity(e.target.value)}
                        placeholder="e.g. 14th Road, Off Khar-Danda, Bandra West, Mumbai"
                        className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 focus:border-amber-400 text-xs sm:text-sm text-white rounded-xl outline-none transition-all"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-zinc-300">
                          GSTIN / Commercial Reg ID *
                        </label>
                        <input
                          type="text"
                          required
                          value={studioRegOrGstin}
                          onChange={(e) => setStudioRegOrGstin(e.target.value)}
                          placeholder="e.g. GSTIN27AABB1234F1Z9"
                          className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 focus:border-amber-400 text-xs sm:text-sm text-white rounded-xl outline-none transition-all font-mono"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-zinc-300">
                          Settlement UPI / Bank Account *
                        </label>
                        <input
                          type="text"
                          required
                          value={studioSettlementUpi}
                          onChange={(e) => setStudioSettlementUpi(e.target.value)}
                          placeholder="e.g. studio@hdfcbank"
                          className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 focus:border-amber-400 text-xs sm:text-sm text-white rounded-xl outline-none transition-all font-mono"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-zinc-300">
                        Flooring & Hall Specifications
                      </label>
                      <input
                        type="text"
                        value={studioFloorFacility}
                        onChange={(e) => setStudioFloorFacility(e.target.value)}
                        placeholder="e.g. 3 Halls, Harlequin Sprung Hardwood, Full Mirrors"
                        className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 focus:border-amber-400 text-xs sm:text-sm text-white rounded-xl outline-none transition-all"
                      />
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 rounded-xl bg-white hover:bg-zinc-200 text-black font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all disabled:opacity-50 mt-3"
                >
                  {isLoading ? (
                    <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Continue to 6-Digit OTP Verification (Step 3/3)</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          )}

          {/* ============================================================== */}
          {/* STEP 3B: SIGN UP 6-DIGIT OTP VERIFICATION */}
          {/* ============================================================== */}
          {authStep === 'signup-otp' && (
            <motion.div
              key="signup-otp"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="bg-[#0c0d12] border border-white/[0.08] rounded-3xl p-5 sm:p-7 shadow-2xl space-y-6"
            >
              <div className="flex items-center justify-between gap-3 border-b border-white/[0.08] pb-4">
                <button
                  type="button"
                  onClick={() => setAuthStep(selectedRole === 'studio' ? 'auth-form' : 'signup-verify-docs')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-zinc-300 hover:text-white text-xs font-semibold transition-all"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>

                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400 text-xs font-bold">
                  <KeyRound className="w-3.5 h-3.5" />
                  <span>Verification Code</span>
                </div>
              </div>

              <div className="text-center space-y-1">
                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-emerald-400">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight pt-2">
                  Verify {activeConfig.label} Contact
                </h2>
                <p className="text-xs text-zinc-400 max-w-sm mx-auto">
                  A 6-digit verification code has been printed to the backend console. Copy it from there and enter it below.
                </p>
              </div>

              {/* Error or Notice */}
              {errorMessage && (
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs font-semibold text-center">
                  {errorMessage}
                </div>
              )}

              {/* 6 OTP Cells */}
              <form onSubmit={handleVerifySignUpOtp} className="space-y-5">
                <div className="flex items-center justify-center gap-2 sm:gap-3">
                  {otpDigits.map((digit, idx) => (
                    <input
                      key={idx}
                      ref={(el) => {
                        otpInputRefs.current[idx] = el;
                      }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(idx, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                      className="w-11 h-14 sm:w-12 sm:h-16 text-center text-lg sm:text-xl font-mono font-bold bg-zinc-950 border border-zinc-700 focus:border-amber-400 text-white rounded-xl outline-none shadow-inner transition-all"
                    />
                  ))}
                </div>

                {/* Backend console hint + resend */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-1 text-xs">
                  <div className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-amber-500/30 text-amber-300 font-mono font-semibold flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5" />
                    <span>Code printed in the backend console</span>
                  </div>

                  <div className="text-zinc-400 font-mono">
                    {otpTimer > 0 ? (
                      <span>Resend in {otpTimer}s</span>
                    ) : (
                      <button
                        type="button"
                        onClick={handleResendOtp}
                        className="text-white hover:underline font-semibold flex items-center gap-1"
                      >
                        <RefreshCw className="w-3 h-3" />
                        <span>Resend Code</span>
                      </button>
                    )}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 rounded-xl bg-white hover:bg-zinc-200 text-black font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-white/10 transition-all disabled:opacity-50"
                >
                  {isLoading ? (
                    <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Check className="w-4 h-4 stroke-[3]" />
                      <span>Verify Code & Issue Badge</span>
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          )}

          {/* ============================================================== */}
          {/* STEP 5: VERIFIED BADGE CELEBRATION MODAL */}
          {/* ============================================================== */}
          {authStep === 'verified-badge-success' && verifiedProfilePending && (
            <motion.div
              key="verified-badge-success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.25 }}
              className="bg-[#0c0d12] border border-amber-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 text-center"
            >
              <div className="relative mx-auto w-20 h-20 rounded-3xl bg-amber-500/10 border border-amber-500/40 flex items-center justify-center text-amber-300 shadow-xl shadow-amber-500/10">
                <ShieldCheck className="w-10 h-10" />
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-amber-400 text-black flex items-center justify-center text-xs font-bold">
                  ✓
                </span>
              </div>

              <div className="space-y-1.5">
                <span className="inline-block px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-mono font-bold uppercase tracking-wider border border-amber-500/30">
                  Verification Approved
                </span>
                <h2 className="text-2xl font-black text-white">
                  Welcome to Dance One!
                </h2>
                <p className="text-xs sm:text-sm text-zinc-300 max-w-sm mx-auto">
                  Your credentials have been validated. You are officially certified on the platform.
                </p>
              </div>

              {/* Badge Preview Card */}
              <div className="p-4 rounded-2xl bg-zinc-950 border border-white/10 text-left space-y-2">
                <div className="flex items-center gap-3">
                  <img
                    src={verifiedProfilePending.avatar}
                    alt={verifiedProfilePending.name}
                    className="w-12 h-12 rounded-xl object-cover border border-white/20"
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-sm font-bold text-white">
                        {verifiedProfilePending.name}
                      </h4>
                      <BadgeCheck className="w-4 h-4 text-amber-300" />
                    </div>
                    <span className="text-xs text-amber-300 font-semibold block">
                      {verifiedProfilePending.verificationBadge}
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-white/5 grid grid-cols-2 gap-2 text-xs font-mono text-zinc-400">
                  <div>
                    <span className="text-zinc-500 block text-[10px]">VERIFIED AT</span>
                    <span className="text-white">
                      {verifiedProfilePending.verificationDetails?.verifiedAt}
                    </span>
                  </div>
                  <div>
                    <span className="text-zinc-500 block text-[10px]">STATUS</span>
                    <span className="text-amber-300">Verified Partner</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={promptSignInAfterSignup}
                className="w-full py-4 rounded-xl bg-white hover:bg-zinc-200 text-black font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-white/10 transition-all cursor-pointer"
              >
                <span>Continue to Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
