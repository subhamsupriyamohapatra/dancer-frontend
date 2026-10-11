/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * DanceOne Role-Based Access Control (RBAC) & Permission Engine
 * Enforces strict permission boundaries across the 5 platform roles:
 * 1. Student / Customer ('dancer' | 'student')
 * 2. Instructor ('instructor')
 * 3. Studio ('studio')
 * 4. Event Organizer ('organizer')
 * 5. DanceOne Admin ('admin')
 */

import { UserRole, ScreenType, Booking } from '../types';
import { validateAdminSession } from './adminAuth';

export type Permission =
  // Student permissions
  | 'browse_marketplace'
  | 'browse_brands'
  | 'suggest_brand'
  | 'book_classes'
  | 'buy_event_tickets'
  | 'view_own_passes'
  | 'cancel_own_booking'
  | 'review_after_attendance'
  | 'earn_credits'
  
  // Instructor permissions
  | 'manage_instructor_profile'
  | 'manage_instructor_availability'
  | 'manage_instructor_classes'
  | 'manage_instructor_workshops'
  | 'accept_reject_private_booking'
  | 'view_assigned_students_only'
  | 'view_assigned_attendance_only'
  | 'view_instructor_earnings_only'
  | 'apply_to_gigs'
  
  // Studio permissions
  | 'manage_studio_profile'
  | 'manage_studio_rooms'
  | 'manage_studio_classes'
  | 'manage_studio_batches'
  | 'manage_studio_students'
  | 'manage_studio_attendance'
  | 'manage_studio_finances'
  | 'manage_studio_settlements'
  | 'manage_studio_staff'
  | 'invite_studio_teachers'
  
  // Event Organizer permissions
  | 'create_public_events'
  | 'create_workshops'
  | 'create_competitions'
  | 'manage_ticket_tiers'
  | 'view_event_attendees'
  | 'scan_event_tickets'
  | 'manage_organizer_finances'
  | 'manage_organizer_settlements'
  
  // Platform Admin permissions
  | 'admin_full_access'
  | 'verify_partners'
  | 'approve_reject_studios'
  | 'import_curate_studios'
  | 'moderate_brands'
  | 'approve_reject_events'
  | 'manage_platform_commissions'
  | 'manage_platform_content'
  | 'view_system_audit_logs';

/**
 * Strict role-to-permission mapping according to DanceOne Rules
 */
export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  dancer: [
    'browse_marketplace',
    'browse_brands',
    'suggest_brand',
    'book_classes',
    'buy_event_tickets',
    'view_own_passes',
    'cancel_own_booking',
    'review_after_attendance',
    'earn_credits',
  ],
  instructor: [
    'browse_marketplace',
    'browse_brands',
    'suggest_brand',
    'manage_instructor_profile',
    'manage_instructor_availability',
    'manage_instructor_classes',
    'manage_instructor_workshops',
    'accept_reject_private_booking',
    'view_assigned_students_only',
    'view_assigned_attendance_only',
    'view_instructor_earnings_only',
    'apply_to_gigs',
  ],
  studio: [
    'browse_marketplace',
    'browse_brands',
    'suggest_brand',
    'manage_studio_profile',
    'manage_studio_rooms',
    'manage_studio_classes',
    'manage_studio_batches',
    'manage_studio_students',
    'manage_studio_attendance',
    'manage_studio_finances',
    'manage_studio_settlements',
    'manage_studio_staff',
    'invite_studio_teachers',
    'create_public_events', // Studios can create studio-specific workshops & events (Rule 4, 9)
  ],
  organizer: [
    'browse_marketplace',
    'browse_brands',
    'suggest_brand',
    'create_public_events',
    'create_workshops',
    'create_competitions',
    'manage_ticket_tiers',
    'view_event_attendees',
    'scan_event_tickets',
    'manage_organizer_finances',
    'manage_organizer_settlements',
  ],
  admin: [
    'admin_full_access',
    'browse_marketplace',
    'browse_brands',
    'moderate_brands',
    'import_curate_studios',
    'verify_partners',
    'approve_reject_studios',
    'approve_reject_events',
    'manage_platform_commissions',
    'manage_platform_content',
    'view_system_audit_logs',
    'create_public_events',
    'manage_studio_finances',
    'manage_organizer_finances',
  ],
};

/**
 * Screen RBAC configuration: Which roles are permitted on each ScreenType
 */
export const SCREEN_ACCESS_POLICY: Record<
  ScreenType,
  {
    allowedRoles: UserRole[];
    description: string;
    unauthorizedReason: string;
  }
> = {
  splash: {
    allowedRoles: ['dancer', 'instructor', 'studio', 'organizer', 'admin'],
    description: 'Splash Screen',
    unauthorizedReason: 'Public view',
  },
  auth: {
    allowedRoles: ['dancer', 'instructor', 'studio', 'organizer', 'admin'],
    description: 'Authentication Portal',
    unauthorizedReason: 'Public view',
  },
  home: {
    allowedRoles: ['dancer', 'instructor', 'studio', 'organizer', 'admin'],
    description: 'DanceOne Marketplace Home',
    unauthorizedReason: 'All registered platform roles may browse the marketplace home.',
  },
  events: {
    allowedRoles: ['dancer', 'instructor', 'studio', 'organizer', 'admin'],
    description: 'Public Events & Masterclasses',
    unauthorizedReason: 'All registered platform roles may view public events.',
  },
  explore: {
    allowedRoles: ['dancer', 'instructor', 'studio', 'organizer', 'admin'],
    description: 'Dance Styles & Faculty Discovery',
    unauthorizedReason: 'All registered platform roles may explore classes.',
  },
  search: {
    allowedRoles: ['dancer', 'instructor', 'studio', 'organizer', 'admin'],
    description: 'Search & Directory',
    unauthorizedReason: 'All registered platform roles may search.',
  },
  'studio-profile': {
    allowedRoles: ['dancer', 'instructor', 'studio', 'organizer', 'admin'],
    description: 'Public Studio Profile',
    unauthorizedReason: 'Public studio profile can be viewed by all roles.',
  },
  'instructor-profile': {
    allowedRoles: ['dancer', 'instructor', 'studio', 'organizer', 'admin'],
    description: 'Public Instructor Portfolio',
    unauthorizedReason: 'Public instructor profile can be viewed by all roles.',
  },
  'slot-selection': {
    allowedRoles: ['dancer', 'instructor', 'studio', 'organizer', 'admin'],
    description: 'Class Slot Booking',
    unauthorizedReason: 'Drop-in class pass selection is available to dancers and students.',
  },
  payment: {
    allowedRoles: ['dancer', 'instructor', 'studio', 'organizer', 'admin'],
    description: 'DanceOne Central Payment Gateway',
    unauthorizedReason: 'Secure checkout portal.',
  },
  'booking-confirmed': {
    allowedRoles: ['dancer', 'instructor', 'studio', 'organizer', 'admin'],
    description: 'Booking Receipt',
    unauthorizedReason: 'Public booking confirmation.',
  },
  'booking-confirmation': {
    allowedRoles: ['dancer', 'instructor', 'studio', 'organizer', 'admin'],
    description: 'Digital QR Ticket Pass',
    unauthorizedReason: 'Pass confirmation view.',
  },
  'wedding-landing': {
    allowedRoles: ['dancer', 'instructor', 'studio', 'organizer', 'admin'],
    description: 'Wedding & Sangeet Services',
    unauthorizedReason: 'Public wedding choreography view.',
  },
  'wedding-choreographers': {
    allowedRoles: ['dancer', 'instructor', 'studio', 'organizer', 'admin'],
    description: 'Curated Wedding Choreographers',
    unauthorizedReason: 'Public wedding choreographers directory.',
  },
  'wedding-request': {
    allowedRoles: ['dancer', 'instructor', 'studio', 'organizer', 'admin'],
    description: 'Wedding Quote Request Wizard',
    unauthorizedReason: 'Quote request flow.',
  },
  bookings: {
    allowedRoles: ['dancer', 'instructor', 'studio', 'organizer', 'admin'],
    description: 'My Passes & Booking History',
    unauthorizedReason: 'Ticket & pass holder view.',
  },
  challenges: {
    allowedRoles: ['dancer', 'instructor', 'studio', 'organizer', 'admin'],
    description: 'Dance Battles & Cyphers',
    unauthorizedReason: 'Public battle brackets and submissions.',
  },
  map: {
    allowedRoles: ['dancer', 'instructor', 'studio', 'organizer', 'admin'],
    description: 'Twin-City Studio Geolocation Map',
    unauthorizedReason: 'Interactive map is available to all users.',
  },
  profile: {
    allowedRoles: ['dancer', 'instructor', 'studio', 'organizer', 'admin'],
    description: 'User Profile & Role Switcher',
    unauthorizedReason: 'All users can access their own profile.',
  },

  // --- RESTRICTED: INSTRUCTOR ONLY ---
  'instructor-dashboard': {
    allowedRoles: ['instructor', 'admin'],
    description: 'Instructor Teaching Schedule & Assigned Roster',
    unauthorizedReason:
      'Only registered Instructors can manage their teaching schedule, assigned students, and personal availability.',
  },
  'instructor-gigs': {
    allowedRoles: ['instructor', 'admin'],
    description: 'Instructor Gigs & Auditions Board',
    unauthorizedReason:
      'Instructor-only opportunities board for wedding choreography, commercial shoots, and guest intensives.',
  },

  // --- RESTRICTED: STUDIO OWNER ONLY ---
  'studio-dashboard': {
    allowedRoles: ['studio', 'admin'],
    description: 'Dance Studio Command Center',
    unauthorizedReason:
      'Studio Owner role is required to manage studio profile, room capacities, and staff.',
  },
  'studio-batches': {
    allowedRoles: ['studio', 'admin'],
    description: 'Studio Batches & Cohorts Management',
    unauthorizedReason:
      'Only Studio Owners can create and manage recurring batches, assign teachers, and set room capacities.',
  },
  'studio-finances': {
    allowedRoles: ['studio', 'admin'],
    description: 'Studio Revenue, Tax Invoices & Settlements',
    unauthorizedReason:
      'Confidential Studio Financials: Students, instructors, and organizers cannot access studio revenue or settlements.',
  },
  'studio-students': {
    allowedRoles: ['studio', 'admin'],
    description: 'Studio Student Directory & CRM',
    unauthorizedReason:
      'Student database is private to the Studio. Other roles cannot view another studio\'s student roster.',
  },
  'studio-attendance': {
    allowedRoles: ['studio', 'admin'],
    description: 'Studio Attendance Roll Call & QR Terminal',
    unauthorizedReason:
      'Only authorized Studio administrators may mark studio-wide student attendance.',
  },
  'studio-teachers': {
    allowedRoles: ['studio', 'admin'],
    description: 'Studio Faculty & Staff Roster',
    unauthorizedReason:
      'Studio personnel management is restricted to Studio Owners and Platform Admins.',
  },

  // --- RESTRICTED: EVENT ORGANIZER ONLY ---
  'organizer-dashboard': {
    allowedRoles: ['organizer', 'admin'],
    description: 'Event Organizer Command Hub',
    unauthorizedReason:
      'Only verified Event Organizers can create and manage public dance shows, battles, and masterclasses.',
  },
  'organizer-events': {
    allowedRoles: ['organizer', 'admin'],
    description: 'Event Creation & Bracket Workspace',
    unauthorizedReason:
      'Students and regular instructors cannot create public events. Event Organizer credentials required.',
  },
  'organizer-guests': {
    allowedRoles: ['organizer', 'admin'],
    description: 'Event Attendees & Check-in Desk',
    unauthorizedReason:
      'Attendee lists and ticket scanning portals are restricted to the Event Organizer.',
  },
  'organizer-finances': {
    allowedRoles: ['organizer', 'admin'],
    description: 'Event Ticket Sales & Gate Revenue',
    unauthorizedReason:
      'Event financial settlements and ticket revenues are private to the Event Organizer.',
  },
  'organizer-more': {
    allowedRoles: ['organizer', 'admin'],
    description: 'Event Judging & MC Portals',
    unauthorizedReason:
      'Adjudication and stage run-sheets are managed exclusively by the Event Organizer.',
  },

  // --- RESTRICTED: DANCEONE PLATFORM ADMIN ONLY ---
  admin: {
    allowedRoles: ['admin'],
    description: 'DanceOne Platform Administration Portal',
    unauthorizedReason:
      'Platform Admin clearance required. Partners, instructors, and students cannot access platform governance or audit logs.',
  },
  'admin-dashboard': {
    allowedRoles: ['admin'],
    description: 'DanceOne Platform Administration Portal',
    unauthorizedReason:
      'Platform Admin clearance required. Partners, instructors, and students cannot access platform governance or audit logs.',
  },
  'admin-login': {
    allowedRoles: ['dancer', 'instructor', 'studio', 'organizer', 'admin'],
    description: 'Protected Admin Authentication Gateway',
    unauthorizedReason: 'Public admin portal challenge gateway.',
  },

  // --- DANCE-FRIENDLY BRANDS MARKETPLACE ---
  'brands-marketplace': {
    allowedRoles: ['dancer', 'instructor', 'studio', 'organizer', 'admin'],
    description: 'Dance-Friendly Brands Discovery Marketplace',
    unauthorizedReason: 'All registered platform roles may browse approved brands.',
  },
};

/**
 * Check if a role possesses a specific permission
 */
export function hasPermission(role: UserRole, permission: Permission): boolean {
  const permissions = ROLE_PERMISSIONS[role] || [];
  return permissions.includes(permission) || permissions.includes('admin_full_access');
}

/**
 * Check if a role is permitted to navigate to a screen
 */
export function checkScreenAccess(
  role: UserRole,
  screen: ScreenType
): { allowed: boolean; reason?: string; requiredRoles?: UserRole[] } {
  const policy = SCREEN_ACCESS_POLICY[screen];
  if (!policy) {
    return { allowed: true };
  }

  // Non-negotiable Rule 3: Server-side admin authorization enforcement
  // Access to platform administration requires active cryptographic token
  if (screen === 'admin' || screen === 'admin-dashboard') {
    if (role !== 'admin') {
      return {
        allowed: false,
        reason: 'Restricted to Platform Administrators. Students, studios and organizers cannot access platform governance.',
        requiredRoles: ['admin'],
      };
    }

    const sessionCheck = validateAdminSession();
    if (!sessionCheck.isValid) {
      return {
        allowed: false,
        reason: sessionCheck.reason || 'DanceOne Protected Admin session token required. Please sign in via the dedicated Admin Portal.',
        requiredRoles: ['admin'],
      };
    }

    return { allowed: true };
  }

  const isAllowed = policy.allowedRoles.includes(role);
  if (isAllowed) {
    return { allowed: true };
  }

  return {
    allowed: false,
    reason: policy.unauthorizedReason,
    requiredRoles: policy.allowedRoles,
  };
}

/**
 * Review Rule Enforcer (Rule 10)
 * "Students can review something only after participation (e.g. Booked Class -> Attended -> Review unlocked)."
 */
export function canStudentReviewBooking(booking: Booking): {
  allowed: boolean;
  reason: string;
} {
  if (booking.status === 'completed') {
    return {
      allowed: true,
      reason: 'Participation verified: attendance completed at studio front-desk.',
    };
  }

  if (booking.status === 'cancelled') {
    return {
      allowed: false,
      reason: 'Review locked: cancelled bookings cannot be reviewed to ensure review authenticity.',
    };
  }

  // Booking is confirmed but not yet attended
  return {
    allowed: false,
    reason: 'Review locked: You must attend and check-in to this session before leaving a verified review.',
  };
}

/**
 * Event Creation Rule Enforcer (Rule 9)
 * "Only Studio + Event Organizer + Admin can create public events. An instructor cannot automatically create an event."
 */
export function canCreatePublicEvent(role: UserRole): boolean {
  return role === 'studio' || role === 'organizer' || role === 'admin';
}

/**
 * Class Ownership Rule (Rule 3)
 * Distinguishes between Studio Class vs Instructor-Owned Independent Class
 */
export type ClassOwnershipType = 'studio_owned' | 'instructor_owned';

export interface ClassOwnershipDetails {
  ownershipType: ClassOwnershipType;
  ownerId: string;
  ownerName: string;
  studioControlsCapacity: boolean;
  instructorCanEditRoutine: boolean;
  isRevenueShared: boolean;
  studioSharePercentage?: number;
  instructorSharePercentage?: number;
}

export function getClassOwnership(
  danceClassId: string,
  studioName?: string,
  instructorName?: string
): ClassOwnershipDetails {
  // If attached to a recognized studio, studio owns and controls the batch
  const isStudioClass = Boolean(studioName && studioName !== 'Independent Choreographer Studio');

  if (isStudioClass) {
    return {
      ownershipType: 'studio_owned',
      ownerId: 'studio-owner',
      ownerName: studioName || 'Studio Partner',
      studioControlsCapacity: true,
      instructorCanEditRoutine: true,
      isRevenueShared: true,
      studioSharePercentage: 70,
      instructorSharePercentage: 30,
    };
  }

  return {
    ownershipType: 'instructor_owned',
    ownerId: 'instructor-owner',
    ownerName: instructorName || 'Independent Instructor',
    studioControlsCapacity: false,
    instructorCanEditRoutine: true,
    isRevenueShared: false,
    instructorSharePercentage: 100,
  };
}
