import React, { useState } from 'react';
import {
  X,
  Plus,
  Zap,
  Calendar,
  Building2,
  Trophy,
  Briefcase,
  Flame,
  CheckCircle2,
  Sparkles,
  MapPin,
  Clock,
  ArrowRight,
  Users,
  Layers,
  DollarSign,
  Shield,
} from 'lucide-react';
import { UserRole, ScreenType } from '../types';

interface QuickActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentRole: UserRole;
  onNavigate: (screen: ScreenType) => void;
  onOpenCreateEvent?: () => void;
}

export const QuickActionModal: React.FC<QuickActionModalProps> = ({
  isOpen,
  onClose,
  currentRole,
  onNavigate,
  onOpenCreateEvent,
}) => {
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleAction = (label: string, destination?: ScreenType) => {
    setActionSuccess(label);
    setTimeout(() => {
      setActionSuccess(null);
      onClose();
      if (destination) {
        onNavigate(destination);
      }
    }, 800);
  };

  const renderRoleActions = () => {
    switch (currentRole) {
      case 'instructor':
        return [
          {
            title: '+ Independent Class',
            desc: 'Create instructor-owned masterclass or private coaching session (Rule 3)',
            icon: Calendar,
            badge: 'Instructor Owned',
            color: 'text-[#3b82f6] border-[#3b82f6]/30',
            action: () => handleAction('Creating independent class...', 'instructor-dashboard'),
          },
          {
            title: 'Update Availability & Bio',
            desc: 'Set weekly open hours and accept private dance requests',
            icon: Briefcase,
            badge: 'Booking Availability',
            color: 'text-[#a855f7] border-[#a855f7]/30',
            action: () => handleAction('Opening availability calendar...', 'instructor-dashboard'),
          },
          {
            title: 'Browse Commercial & Wedding Gigs',
            desc: 'Apply for sangeet choreography, commercial ads, and guest intensive faculty',
            icon: Sparkles,
            badge: 'Hire Me',
            color: 'text-[#eab308] border-[#eab308]/30',
            action: () => handleAction('Opening gigs board...', 'instructor-gigs'),
          },
        ];

      case 'studio':
        return [
          {
            title: '+ Add Student',
            desc: 'Add existing DanceOne user by ID/phone, send invite, or create record',
            icon: Users,
            badge: 'Student Onboarding',
            color: 'text-[#3b82f6] border-[#3b82f6]/30',
            action: () => handleAction('Opening Add Student Wizard...', 'studio-students'),
          },
          {
            title: '+ Create Batch',
            desc: 'Launch new cohort with teacher, room, schedule & capacity',
            icon: Layers,
            badge: 'Cohort Creation',
            color: 'text-amber-400 border-amber-500/30',
            action: () => handleAction('Opening Batch Creator...', 'studio-batches'),
          },
          {
            title: '+ Mark Attendance',
            desc: 'Live roll call, QR scanner check-in & auto activity sync',
            icon: CheckCircle2,
            badge: 'Live Attendance',
            color: 'text-[#eab308] border-[#eab308]/30',
            action: () => handleAction('Loading Attendance Sheet...', 'studio-attendance'),
          },
          {
            title: '+ Record Payment',
            desc: 'Generate branded GST tax invoice & record UPI/Card/Cash fee',
            icon: DollarSign,
            badge: 'Fee Collection',
            color: 'text-amber-400 border-amber-500/30',
            action: () => handleAction('Opening Invoice Generator...', 'studio-finances'),
          },
        ];

      case 'organizer':
        return [
          {
            title: 'Create Event',
            desc: 'Workshops, Competitions, Shows, Battles, Camps & more',
            icon: Trophy,
            badge: 'New Event',
            color: 'text-[#eab308] border-[#eab308]/30',
            action: () => {
              onClose();
              if (onOpenCreateEvent) {
                onOpenCreateEvent();
              } else {
                onNavigate('organizer-events');
              }
            },
          },
          {
            title: 'Manage Guests & Rosters',
            desc: 'Check-in athletes, crews, VIPs & faculty',
            icon: Users,
            badge: 'Guests',
            color: 'text-[#3b82f6] border-[#3b82f6]/30',
            action: () => handleAction('Opening Guests Roster...', 'organizer-guests'),
          },
          {
            title: 'View Revenue & Payouts',
            desc: 'Real-time ticket collections & judge fees',
            icon: DollarSign,
            badge: 'Finances',
            color: 'text-amber-400 border-amber-500/30',
            action: () => handleAction('Opening Finances...', 'organizer-finances'),
          },
        ];

      case 'admin':
        return [
          {
            title: 'Verify Partner Applications',
            desc: 'Review pending studio, instructor & organizer verification dossiers',
            icon: Shield,
            badge: 'Governance',
            color: 'text-[#f43f5e] border-[#f43f5e]/30',
            action: () => handleAction('Opening Verification Queue...', 'admin-dashboard'),
          },
          {
            title: 'Register Dance Studio',
            desc: 'Onboard new studio with location, amenities & room dimensions',
            icon: Building2,
            badge: 'Studio Directory',
            color: 'text-amber-400 border-amber-500/30',
            action: () => handleAction('Opening Studio Registry...', 'admin-dashboard'),
          },
          {
            title: 'Audit System Log',
            desc: 'View timestamped security trail for commission and user status changes',
            icon: CheckCircle2,
            badge: 'Audit Trail',
            color: 'text-[#3b82f6] border-[#3b82f6]/30',
            action: () => handleAction('Opening Audit Trail...', 'admin-dashboard'),
          },
        ];

      case 'dancer':
      default:
        return [
          {
            title: 'Book a Drop-in Class',
            desc: 'Find nearest available studio batch starting today',
            icon: Calendar,
            badge: 'Instant Pass',
            color: 'text-[#3b82f6] border-[#3b82f6]/30',
            action: () => handleAction('Finding nearest drop-ins...', 'search'),
          },
          {
            title: 'Join Dance Battle & Challenges',
            desc: 'Compete in 7-day streaks, submit videos & win cash credits',
            icon: Trophy,
            badge: 'Active Battles',
            color: 'text-[#eab308] border-[#eab308]/30',
            action: () => handleAction('Opening active challenges...', 'challenges'),
          },
          {
            title: 'Explore Dance Brands',
            desc: 'Dancewear, shoes, stage makeup & member discounts',
            icon: Sparkles,
            badge: 'Marketplace',
            color: 'text-amber-300 border-amber-500/30',
            action: () => handleAction('Opening brands directory...', 'brands-marketplace'),
          },
          {
            title: 'Book Wedding Choreographer',
            desc: 'Request custom quote & Sangeet choreography package',
            icon: Sparkles,
            badge: 'Sangeet Choreo',
            color: 'text-[#ec4899] border-[#ec4899]/30',
            action: () => handleAction('Opening wedding packages...', 'wedding-landing'),
          },
        ];
    }
  };

  const actions = renderRoleActions();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="bg-[#18181b] border border-[#27272a] rounded-2xl w-full max-w-md overflow-hidden shadow-2xl relative">
        {/* Header */}
        <div className="p-3.5 border-b border-[#27272a] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#eab308] text-black flex items-center justify-center shadow-sm font-black text-xs">
              <Plus className="w-4 h-4 stroke-[3]" />
            </div>
            <div>
              <h2 className="text-xs font-bold text-white leading-none">Quick Actions</h2>
              <p className="text-xs text-[#a1a1aa] capitalize mt-0.5">{currentRole} Mode</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-6 h-6 rounded-lg bg-[#27272a] hover:bg-[#3f3f46] text-[#a1a1aa] hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Success Alert */}
        {actionSuccess && (
          <div className="m-3 p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center gap-2 text-xs font-bold text-amber-300 animate-in zoom-in-95">
            <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
            <span>{actionSuccess}</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="p-3 space-y-2">
          {actions.map((act, idx) => {
            const Icon = act.icon;
            return (
              <button
                key={idx}
                onClick={act.action}
                className="w-full p-2.5 rounded-xl bg-[#09090b] border border-[#27272a] hover:border-[#eab308] transition-all text-left flex items-center justify-between group hover:bg-[#18181b]"
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-7 h-7 rounded-lg bg-[#18181b] border flex items-center justify-center shrink-0 ${act.color}`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-xs font-bold text-white group-hover:text-[#eab308] transition-colors leading-tight">
                        {act.title}
                      </h4>
                      <span className="text-xs font-black uppercase px-1.5 py-0.2 rounded bg-[#27272a] text-[#a1a1aa]">
                        {act.badge}
                      </span>
                    </div>
                    <p className="text-xs text-[#71717a] mt-0.5 line-clamp-1">{act.desc}</p>
                  </div>
                </div>
                <ArrowRight className="w-3 h-3 text-[#71717a] group-hover:text-[#eab308] group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

