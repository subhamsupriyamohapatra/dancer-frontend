# DANCEONE — Comprehensive Architecture & Codebase Context

> **Version:** 1.0.0 (Production Core)  
> **Target Audience:** Autonomous Coding Agents, Engineers, and System Architects  
> **Tech Stack:** React 19, TypeScript (~5.8), Vite 6, Tailwind CSS v4, Motion (Framer Motion v12), Lucide Icons, Canvas Confetti, Google GenAI SDK  
> **Primary Geospatial Focus:** Odisha Twin Cities (Bhubaneswar & Cuttack), expandable pan-India.

---

## 1. Executive Summary & Purpose

**DanceOne** is a full-stack multi-sided dance marketplace, studio operating system (SaaS), and event management platform. It unites five distinct ecosystem participants into one integrated web application:

1. **Dancers / Students / Customers**: Discover local studios, book drop-in classes, enter battles, book wedding choreographers, shop dance-certified gear, and track booking passes.
2. **Instructors / Choreographers**: Manage teaching schedules, accept/reject private 1-on-1 coaching requests, host independent classes, view earnings, and apply for commercial/wedding gigs.
3. **Studio Owners / Academies**: Complete studio ERP (batch cohort management, student CRM with DanceOne ID linking, digital attendance roll calls, GST-compliant invoicing, settlements, and staff rosters).
4. **Event Organizers**: Full event lifecycle engine for tournaments, street dance battles (1v1, 2v2, crew vs crew brackets), stage showcases (cues & run-sheets), workshops, live judging portals, and MC live control.
5. **Platform Administrators**: Partner verification, Bhubaneswar/Cuttack studio import and curation pipeline with duplicate merging, dance-friendly brands moderation, fee commissions, and tamper-evident audit logs.

---

## 2. Repository Structure & File Map

```text
e:/danceone/
├── index.html                           # App shell with Google Fonts & responsive viewport
├── metadata.json                        # App capabilities & descriptor
├── package.json                         # Dependencies & npm scripts
├── tsconfig.json                        # TypeScript strict compiler config
├── vite.config.ts                       # Vite bundler config with Tailwind & React plugins
├── .env.example                         # Environment variable template
│
└── src/
    ├── main.tsx                         # React 19 root mounting
    ├── App.tsx                          # Root orchestration: Screen state, role state, RBAC routing
    ├── index.css                        # Design system: #060608 theme, glassmorphism, scrollbars
    ├── types.ts                         # Core global domain types (ScreenType, UserRole, DanceClass, Studio, Booking)
    │
    ├── types/
    │   ├── brand.ts                     # BrandRecord, BrandApprovalStatus, SuggestBrandPayload
    │   ├── organizer.ts                 # OrganizerEventRecord, BattleMatchup, CompetitionParticipant, ScoringCriterion
    │   └── studioImport.ts              # ImportedStudioRecord, ImportedStudioStatus
    │
    ├── utils/
    │   ├── rbac.ts                      # Strict Role-Based Access Control engine & validation rules
    │   └── adminAuth.ts                 # Cryptographic token validation, whitelist & 2FA simulator
    │
    ├── data/
    │   ├── danceData.ts                 # Mock database: classes, studios, instructors, presets, bookings
    │   ├── brandsData.ts                # Curated dancer brands (Bloch, Sansha, Kryolan, etc.)
    │   ├── importedStudiosData.ts       # Bhubaneswar & Cuttack imported studio registry with duplicates
    │   ├── organizerData.ts             # Initial organizer templates, judges & financial ledger
    │   └── platformEventsData.ts        # Published platform events store
    │
    └── components/
        ├── App Navigation & Shell:
        │   ├── Navigation.tsx           # TopAppBar, DesktopSidebar, MobileBottomNav (Role-aware)
        │   ├── SplashScreen.tsx         # Initial launch screen with branded typography & enter CTA
        │   ├── AuthScreen.tsx           # Multi-role authentication & onboarding with KYC document verify
        │   └── QuickActionModal.tsx     # Centered raised (+) action modal tailored per active role
        │
        ├── Marketplace & Dancer Discovery:
        │   ├── HomeScreen.tsx           # Discovery feed, running hero banners, styles, nearby studios
        │   ├── ExploreScreen.tsx        # Style-by-style exploration & faculty showcase
        │   ├── SearchResultsScreen.tsx  # Global search across classes, events, studios, faculty
        │   ├── StudioMapView.tsx        # Interactive geolocation map with twin-city studio markers
        │   ├── StudioProfileScreen.tsx  # Studio public view: bio, amenities, schedule, pass booking
        │   ├── InstructorProfileScreen.tsx # Instructor portfolio: bio, achievements, private bookings
        │   ├── ChallengesScreen.tsx     # Community cyphers, video challenge voting, reward XP
        │   └── EventsScreen.tsx         # Platform-wide published events, masterclasses, and passes
        │
        ├── Booking & Checkout Flow:
        │   ├── SlotSelectionScreen.tsx  # Date, time slot, and attendee details configuration
        │   ├── PaymentScreen.tsx        # Simulated checkout gateway (UPI, Card, NetBanking, Cash)
        │   ├── BookingConfirmationScreen.tsx # Digital pass with QR code, calendar sync, instructions
        │   └── BookingsScreen.tsx       # Pass wallet & history with attendance-gated review unlocking
        │
        ├── Wedding Choreography Services:
        │   ├── WeddingLandingScreen.tsx # Sangeet, bride/groom solo packages, testimonials
        │   ├── WeddingChoreographersScreen.tsx # Curated wedding choreographers directory
        │   └── WeddingRequestModal.tsx  # Multi-step quote request wizard for couples/families
        │
        ├── Role Dashboards:
        │   ├── InstructorDashboardView.tsx # Teaching schedule, private requests, earnings, gigs board
        │   ├── StudioDashboardScreen.tsx   # Studio ERP shell managing the 6 studio tabs
        │   ├── OrganizerDashboardScreen.tsx # Organizer hub shell managing event workspaces
        │   ├── AdminDashboardScreen.tsx    # Governance hub: curation, approvals, brands, audit log
        │   └── ProfileScreen.tsx           # User settings, dance streak, role switching
        │
        ├── Studio Subcomponents (`src/components/studio/`):
        │   ├── StudioDashboardTab.tsx   # Studio KPIs, daily schedule, quick actions
        │   ├── StudioBatchesTab.tsx     # Batches & cohorts management, capacity, rooms
        │   ├── StudioStudentsTab.tsx    # Student CRM, DanceOne ID linking, fee tracking
        │   ├── StudioAttendanceTab.tsx  # Digital roll call & QR scanner check-in terminal
        │   ├── StudioFinanceTab.tsx     # 18% GST invoices, printable receipts, bank settlements
        │   ├── StudioTeachersTab.tsx    # Faculty roster, schedules, compensation models
        │   └── StudioModals.tsx         # Add Student (3 modes), Create Batch modal
        │
        ├── Organizer Subcomponents (`src/components/organizer/`):
        │   ├── BattleWorkspace.tsx      # 1v1, 2v2, crew battles, dynamic tournament brackets
        │   ├── CompetitionWorkspace.tsx # Weighted criteria scoring, bib numbers, music checking
        │   ├── CreateEventModal.tsx     # Comprehensive event creation wizard (all event types)
        │   ├── EventManagementWorkspace.tsx # Master event control center
        │   ├── JudgePortalModal.tsx     # Real-time judge numerical scoring & battle deliberation
        │   ├── MCPortalModal.tsx        # Emcee live stage run-sheet & dancer announcer view
        │   ├── LiveControlCenter.tsx    # Stage manager live control
        │   ├── OrganizerFinanceView.tsx # Ticket tiers, gate sales, gross revenue, net payout
        │   ├── OrganizerParticipantsView.tsx # Master attendee roster, bib numbers, check-in desk
        │   ├── ParticipantManagementView.tsx # Per-event heat & round assignments
        │   ├── PostEventManagementView.tsx   # Results publish privacy & certificate dispatch
        │   ├── ShowWorkspace.tsx        # Showcase run-sheet, lighting & audio cues, green rooms
        │   ├── StaffAndPermissionsView.tsx # Staff assignment with granular capability toggles
        │   ├── WorkshopCampWorkspace.tsx # Masterclasses, camps, instructor payout splits
        │   ├── CommunicationBroadcastModal.tsx # Mass WhatsApp/SMS/Push broadcast dispatcher
        │   ├── FeedbackSystemView.tsx   # Attendee, dancer & judge feedback analytics
        │   └── JudgeDirectoryView.tsx   # Verified judges roster & judging fees
        │
        ├── Brand Subcomponents (`src/components/brands/`):
        │   └── BrandsMarketplaceScreen.tsx # Public vetted brands marketplace & suggestion wizard
        │
        ├── Admin Subcomponents (`src/components/admin/`):
        │   └── AdminLoginScreen.tsx     # Isolated high-security 2FA login for platform administrators
        │
        └── Common & Utility Subcomponents (`src/components/common/`):
            ├── AccessDeniedGuard.tsx    # 403 Forbidden screen with RBAC policy explanation
            ├── EventDetailModal.tsx     # Public event summary & quick pass purchase modal
            ├── LocationSelectorModal.tsx # Dynamic geolocation & twin-city selector modal
            └── PremiumLogo.tsx          # Consistent vector logo & animated brand mark
```

---

## 3. Technology Stack & Key Dependencies

| Dependency | Version | Purpose |
| :--- | :--- | :--- |
| **react** / **react-dom** | `^19.0.1` | Core UI engine, functional components, hooks |
| **vite** | `^6.2.3` | High-speed dev server (`port 3000`) & production bundler |
| **typescript** | `~5.8.2` | Strict type safety across all domain models |
| **tailwindcss** | `^4.1.14` | Styling engine using the modern `@tailwindcss/vite` plugin |
| **motion** | `^12.23.24` | Modern Framer Motion animations, transitions, modals |
| **lucide-react** | `^0.546.0` | Comprehensive icons across all screens and dashboards |
| **canvas-confetti** | `^1.9.4` | Celebration effects for bookings, tournament wins, verifications |
| **@google/genai** | `^2.4.0` | Server-side Gemini API client integration readiness |

---

## 4. Architectural Patterns & Core Concepts

### 4.1 State Management & Single Page Architecture
The app functions as a sophisticated Single Page Application (SPA) driven by stateful screen switching in [src/App.tsx](file:///e:/danceone/src/App.tsx):
- `currentScreen`: Controls the active view (`ScreenType`).
- `currentRole`: Active persona (`dancer` | `instructor` | `studio` | `organizer` | `admin`).
- `userProfile`: Active profile data (`UserProfile`) including verification badges, streaks, and contact info.
- `platformEvents`: Global published events array, shared between Organizer publishing actions and public Marketplace discovery.
- `platformBrands`: Global vetted brand catalog, updated when users suggest brands and admins approve them.
- `importedStudios`: Twin-city imported studio directory, updated via admin approvals, rejections, and duplicate merges.
- Full-bleed screens (`studio-profile`, `instructor-profile`, `slot-selection`, `payment`, `booking-confirmation`) suppress the standard `TopAppBar` and `DesktopSidebar` to present immersive hero banners.

### 4.2 Role-Based Access Control (RBAC) Engine ([src/utils/rbac.ts](file:///e:/danceone/src/utils/rbac.ts))
Access to screens and actions is strictly governed by `checkScreenAccess()` and `hasPermission()`. If an unauthorized role attempts to access a restricted route (e.g. a student navigating to `studio-finances` or `organizer-dashboard`), the app renders [AccessDeniedGuard.tsx](file:///e:/danceone/src/components/common/AccessDeniedGuard.tsx) with clear justification and role-switch options.

#### Role Capability Matrix:
```
+------------------------------------+--------+------------+--------+-----------+-------+
| Feature / Screen                   | Dancer | Instructor | Studio | Organizer | Admin |
+------------------------------------+--------+------------+--------+-----------+-------+
| Browse Classes & Marketplace       |   OK   |     OK     |   OK   |    OK     |  OK   |
| Book Classes & Passes              |   OK   |     OK     |   OK   |    OK     |  OK   |
| Browse Approved Brands             |   OK   |     OK     |   OK   |    OK     |  OK   |
| Suggest New Brand                  |   OK   |     OK     |   OK   |    OK     |  OK   |
| Review After Attendance            |   OK   |     OK     |   OK   |    OK     |  OK   |
| Instructor Schedule & Gigs Board   |   --   |     OK     |   --   |    --     |  OK   |
| Private Coaching Booking Requests  |   --   |     OK     |   --   |    --     |  OK   |
| Studio Batches & Student CRM       |   --   |     --     |   OK   |    --     |  OK   |
| Studio Invoicing & 18% GST Ledger  |   --   |     --     |   OK   |    --     |  OK   |
| Create Public Events & Tournaments |   --   |     --     |   OK   |    OK     |  OK   |
| Battle Brackets & MC / Judge Desk  |   --   |     --     |   --   |    OK     |  OK   |
| Platform Governance & Audit Logs   |   --   |     --     |   --   |    --     |  OK   |
| Studio Import & Duplicate Merging  |   --   |     --     |   --   |    --     |  OK   |
| Moderate Brands & Set Commissions  |   --   |     --     |   --   |    --     |  OK   |
+------------------------------------+--------+------------+--------+-----------+-------+
```

### 4.3 Key Business Rules Built into the Codebase

1. **Brand Visibility Rule (Rule 1)**:
   - Only brands where `approvalStatus === 'APPROVED'` are rendered on the public [BrandsMarketplaceScreen.tsx](file:///e:/danceone/src/components/brands/BrandsMarketplaceScreen.tsx).
   - Any brand suggested via `handleSuggestBrand()` enters `PENDING_APPROVAL` and is routed to the Admin Approval Queue.

2. **Twin-City Studio Import & Duplicate Curation (Rule 2)**:
   - Imported studio listings for Bhubaneswar and Cuttack have statuses: `IMPORTED`, `PENDING_VERIFICATION`, `APPROVED`, `REJECTED`, `MERGED_DUPLICATE`.
   - Admin can merge duplicate entries (`onMergeDuplicateStudio`), marking the duplicate as `MERGED_DUPLICATE` while preserving references.

3. **Isolated Administrator Authentication (Rule 3)**:
   - Admin access is **never** presented in the public user login modal.
   - Accessed exclusively via `/admin-login` ([AdminLoginScreen.tsx](file:///e:/danceone/src/components/admin/AdminLoginScreen.tsx)).
   - Enforces a permanent, constant credential set via `ADMIN_MASTER_CONFIG` in [adminAuth.ts](file:///e:/danceone/src/utils/adminAuth.ts): email whitelist (`admin@danceone.in`, `superadmin@danceone.in`, `director@danceone.odisha.gov.in`), fixed passkey `danceone-odisha-secure-2026`, and fixed 6-digit OTP `918273`. Validation is strict equality. Keep in sync with `backend/src/controllers/authController.ts`.
   - Generates a cryptographically signed token (`d1_sec_adm_<timestamp>_<random>`) stored in `sessionStorage` with a 4-hour hard expiry window, verified by [validateAdminSession()](file:///e:/danceone/src/utils/adminAuth.ts#L30).

4. **Class Ownership Separation (Rule 3 in RBAC)**:
   - **Studio-Owned Class**: Studio controls maximum hall capacity, pricing, student CRM, and collects the primary fee share (e.g., 70% studio / 30% teacher).
   - **Instructor-Owned Independent Class**: Choreographer controls routine, cap, and retains 100% faculty share minus platform fee.

5. **Public Event Creation Rule (Rule 9 in RBAC)**:
   - Only **Studio Owners**, **Event Organizers**, and **Platform Admins** can create and publish public events.
   - Regular instructors cannot unilaterally publish public ticketed events without studio or organizer credentials.

6. **Verified Review Integrity (Rule 10 in RBAC)**:
   - Students can only leave a review if their booking pass is in `'completed'` status (`canStudentReviewBooking()` in [rbac.ts](file:///e:/danceone/src/utils/rbac.ts#L426)).
   - Cancelled or un-attended confirmed bookings cannot submit reviews to eliminate fake or malicious reviews.

7. **Dynamic Location Policy**:
   - The platform never forces a rigid hardcoded default location upon users.
   - Users can type any freeform locality (e.g., "Patia, Bhubaneswar", "CDA Sector 7, Cuttack", "Bandra, Mumbai") or activate browser GPS. All listings filter dynamically based on text match.

---

## 5. Detailed Component & Feature Reference

### 5.1 Root Orchestration & App Lifecycle ([src/App.tsx](file:///e:/danceone/src/App.tsx))
- **Entry Gate**: Checks `isAuthenticated`. Unauthenticated users start at `auth` ([AuthScreen.tsx](file:///e:/danceone/src/components/AuthScreen.tsx)), with an option to skip as a guest dancer.
- **Top-Level Entities in React State**:
  - `platformEvents`: Master event record list; new events created in the Organizer wizard immediately propagate to `HomeScreen` and `EventsScreen`.
  - `platformBrands`: Master brand records list.
  - `importedStudios`: Directory of crawled/imported studios undergoing verification.
  - `allClasses` & `studioData`: Live studio schedule and catalog.
  - `studioPayments`: Real-time ledger of studio tuition payments and GST records.
  - `userBookings`: Local pass wallet populated upon completing checkout.

### 5.2 Authentication & Persona Onboarding ([src/components/AuthScreen.tsx](file:///e:/danceone/src/components/AuthScreen.tsx))
- **Public Roles**: Presents 4 personas (Dancer, Instructor, Studio Owner, Organizer).
- **Authentication Methods**: Phone OTP (simulated 6-digit code with resend timer) or Email/Password.
- **Verification Workflow (KYC)**:
  - Organizers provide entity name, GSTIN/Govt Reg, and event portfolio link.
  - Instructors provide stage name, dance styles, experience years, and showreel/certifications.
  - Studio owners provide trade name, registered address, GSTIN, and settlement UPI ID.
  - Displays a celebration badge screen on onboarding completion with confetti.

### 5.3 Admin Governance Hub ([src/components/AdminDashboardScreen.tsx](file:///e:/danceone/src/components/AdminDashboardScreen.tsx))
Consists of 6 major operational tabs:
1. `approval_centre`: Unified inbox to approve/reject studios, instructors, brands, and duplicate flags.
2. `studio_import`: Dedicated directory of imported academies across Bhubaneswar & Cuttack; duplicate matching action.
3. `brands_moderation`: Review queue for community-suggested brands; edit affiliate discount codes.
4. `studios`: Live roster of onboarded partner studios with badge status toggles.
5. `audit_logs`: Immutable, searchable table logging admin decisions, timestamps, IP addresses, previous/new states, and reasons.
6. `commissions`: Platform fee settings (standard 10%), dispute resolution notes, and settlement ledger.

### 5.4 Studio Operations & Operating System ([src/components/StudioDashboardScreen.tsx](file:///e:/danceone/src/components/StudioDashboardScreen.tsx))
Organized into 6 comprehensive tabs:
- **`DASHBOARD`**: Total active students, monthly gross revenue, daily attendance percentage, quick actions.
- **`BATCHES`**: Active cohorts with teacher assignment, days of week, time window, hall capacity, enrollment gauge, and announcements.
- **`STUDENTS`**: Database with **DanceOne ID** linking, membership pass status, attendance streak counter, and medical/emergency notes.
  - *Add Student Modal*: 3 distinct onboarding methods:
    1. Search existing DanceOne ID
    2. Send digital invite via WhatsApp/SMS
    3. Quick manual guest record entry
- **`ATTENDANCE`**: Real-time roll call check-in interface, streak bonuses, and digital QR attendance scanner.
- **`FINANCE`**: Revenue breakdown, GST-compliant tax invoices (18% split into CGST 9% + SGST 9%), downloadable printable receipts, and bank payout settlements with UTR tracking.
- **`TEACHERS`**: Faculty directory with compensation settings (`Fixed Per Class`, `Commission %`, or `Monthly Retainer`), assigned batches, and student ratings.

### 5.5 Event Organizer Hub ([src/components/OrganizerDashboardScreen.tsx](file:///e:/danceone/src/components/OrganizerDashboardScreen.tsx))
Handles the full lifecycle of complex live events:
- **`CreateEventModal.tsx`**: Multi-step wizard supporting 7 event formats:
  - Workshop / Masterclass
  - Dance Battle (1v1, 2v2, Crew)
  - Dance Competition
  - Dance Showcase
  - Dance Camp / Festival
  - Audition
  - Social / Jam
- **`BattleWorkspace.tsx`**: Dynamic bracket generator (Pre-selection, Round of 16, QF, SF, Finals). Includes live judging tallies, tie-break rounds, and optional audience vote toggling.
- **`CompetitionWorkspace.tsx`**: Numerical judging system based on weighted criteria (e.g. Execution 30%, Musicality 25%, Choreography 25%, Stage Presence 20%). Automates bib number assignment, track upload tracking, and live audit logging.
- **`ShowWorkspace.tsx`**: Theatrical run-sheet with stage acts, scheduled duration, lighting cues, sound cues, and green room management.
- **`JudgePortalModal.tsx`**: Mobile-optimized dedicated interface for judges to score dancers directly from their phones or tablets.
- **`MCPortalModal.tsx`**: Dedicated stage emcee interface for match callouts and live status tracking.
- **`LiveControlCenter.tsx`**: Stage manager cockpit showing who is performing, who is on deck, and active timers.
- **`OrganizerFinanceView.tsx`**: Tier-by-tier ticket sales tracking, gate revenue vs online sales, expense receipts, and net profit ledger.
- **`CommunicationBroadcastModal.tsx`**: Multi-channel mass messaging (WhatsApp, SMS, Push Notification) targeting specific segments (all participants, judges only, category-specific dancers).

### 5.6 Instructor Workspace ([src/components/InstructorDashboardView.tsx](file:///e:/danceone/src/components/InstructorDashboardView.tsx))
- **Schedule**: View assigned studio classes alongside independent classes with explicit ownership badges.
- **Private Requests**: Direct inbound requests from students for wedding choreography or battle training with full details (hours, proposed dates, offered fee) and one-click Accept/Reject.
- **Earnings Ledger**: Transparent monthly earnings breakdown showing studio splits versus private lesson revenue.
- **Gigs Board**: Direct job board for commercial shoots, corporate workshops, and wedding choreography intensives.

### 5.7 Brands Marketplace ([src/components/brands/BrandsMarketplaceScreen.tsx](file:///e:/danceone/src/components/brands/BrandsMarketplaceScreen.tsx))
- Displays curated brands with categorized tabs (Footwear, Apparel, Stage Makeup, Audio, Recovery, etc.).
- Feature cards with 1-click discount code copy.
- "Suggest a Brand" interactive modal that allows users and instructors to submit new brands directly into the admin review pipeline.

### 5.8 Booking, Payment & Pass Wallet Flow
- **`SlotSelectionScreen.tsx`**: Select date, morning/evening batch, attendee contact details.
- **`PaymentScreen.tsx`**: Simulated checkout with payment method selection (UPI, Credit/Debit Cards, NetBanking, Cash at Front Desk), platform fee breakdown, and payment confirmation.
- **`BookingConfirmationScreen.tsx`**: Renders a high-resolution digital pass complete with scannable QR code, entry code, venue address, and calendar export.
- **`BookingsScreen.tsx`**: Pass holder wallet storing active and past tickets. Enforces review verification: only sessions marked as completed by studio check-in allow the user to write a review.

### 5.9 Wedding Choreography Services
- **`WeddingLandingScreen.tsx`**: Dedicated vertical for Indian wedding dance services (Sangeet couple dances, family medleys, flashmobs).
- **`WeddingChoreographersScreen.tsx`**: Filterable directory of wedding choreographers sorted by rating, weddings completed, and starting rates.
- **`WeddingRequestModal.tsx`**: Structured quote wizard collecting event date, city, number of songs, number of family members, and style preferences.

---

## 6. Complete Data Models & Type Definitions

### 6.1 User & Core Types ([src/types.ts](file:///e:/danceone/src/types.ts))
```typescript
export type ScreenType =
  | 'splash' | 'auth' | 'home' | 'events' | 'explore' | 'search'
  | 'studio-profile' | 'instructor-profile' | 'slot-selection' | 'payment'
  | 'booking-confirmed' | 'booking-confirmation'
  | 'wedding-landing' | 'wedding-choreographers' | 'wedding-request'
  | 'studio-dashboard' | 'studio-batches' | 'studio-finances'
  | 'studio-students' | 'studio-attendance' | 'studio-teachers'
  | 'instructor-dashboard' | 'instructor-gigs'
  | 'organizer-dashboard' | 'organizer-events' | 'organizer-guests'
  | 'organizer-finances' | 'organizer-more'
  | 'bookings' | 'challenges' | 'profile' | 'map'
  | 'admin' | 'admin-dashboard' | 'admin-login'
  | 'brands-marketplace';

export type UserRole = 'dancer' | 'instructor' | 'studio' | 'organizer' | 'admin';

export interface UserProfile {
  name: string;
  location: string;
  email: string;
  avatar: string;
  danceStreakDays: number;
  weeklyGoalCompleted: number;
  weeklyGoalTotal: number;
  savedFavorites: string[];
  role: UserRole;
  phone?: string;
  bio?: string;
  studioName?: string;
  instructorTitle?: string;
  organizationName?: string;
  isVerified?: boolean;
  verificationBadge?: string;
  verificationDetails?: VerificationDetails;
}
```

### 6.2 Brand Types ([src/types/brand.ts](file:///e:/danceone/src/types/brand.ts))
```typescript
export type BrandApprovalStatus =
  | 'PENDING_APPROVAL' | 'UNDER_REVIEW' | 'APPROVED'
  | 'REJECTED' | 'CHANGES_REQUESTED' | 'SUSPENDED';

export type BrandCategory =
  | 'all' | 'apparel' | 'footwear' | 'makeup' | 'hydration_nutrition'
  | 'audio_sound' | 'flooring_protection' | 'recovery' | 'accessories';

export interface BrandRecord {
  id: string;
  name: string;
  tagline: string;
  description: string;
  category: BrandCategory;
  logoUrl: string;
  heroImageUrl: string;
  websiteUrl: string;
  instagramHandle?: string;
  featuredProducts: BrandFeaturedProduct[];
  discountCode?: string;
  discountPercent?: number;
  danceStylesSupported: string[];
  approvalStatus: BrandApprovalStatus;
  isFeatured: boolean;
  cityAvailability?: string;
}
```

### 6.3 Imported Studio Types ([src/types/studioImport.ts](file:///e:/danceone/src/types/studioImport.ts))
```typescript
export type ImportedStudioStatus =
  | 'IMPORTED' | 'PENDING_VERIFICATION' | 'APPROVED'
  | 'REJECTED' | 'MERGED_DUPLICATE';

export interface ImportedStudioRecord {
  id: string;
  name: string;
  city: 'Bhubaneswar' | 'Cuttack';
  address: string;
  phone: string;
  website: string;
  socialLinks: { instagram?: string; facebook?: string; youtube?: string };
  danceStyles: string[];
  publicRatings: number;
  reviewCounts: number;
  openingHours: string;
  photos: string[];
  sourceReference: string;
  verificationStatus: ImportedStudioStatus;
  importedAt: string;
  isCurated: boolean;
  hallCapacityEstimate?: number;
}
```

### 6.4 Organizer & Event Types ([src/types/organizer.ts](file:///e:/danceone/src/types/organizer.ts))
```typescript
export type EventType =
  | 'workshop' | 'competition' | 'dance_show' | 'show'
  | 'dance_battle' | 'battle' | 'masterclass' | 'dance_camp'
  | 'festival' | 'audition' | 'showcase' | 'social' | 'jam' | 'other';

export interface OrganizerEventRecord {
  id: string;
  title: string;
  type: EventType;
  status: 'draft' | 'published' | 'registration_open' | 'live' | 'completed' | 'archived';
  coverImage: string;
  description: string;
  startDate: string;
  time: string;
  venue: string;
  address: string;
  city: string;
  capacity: number;
  registeredCount: number;
  revenue: number;
  expenses: number;
  ticketPricing: { tier: string; price: number; capacity: number; sold: number }[];
  scoringCriteria: ScoringCriterion[];
  participants: CompetitionParticipant[];
  battleMatchups?: BattleMatchup[];
  showPerformances?: ShowPerformance[];
  staff: EventStaffMember[];
  scoreAuditLogs: ScoreAuditLog[];
}
```

---

## 7. Development & Operational Commands

```powershell
# Install all dependencies
npm install

# Run Vite development server (accessible at http://localhost:3000 and network host)
npm run dev

# Run TypeScript compiler type-check (zero emitted code, strict type validation)
npm run lint

# Build production bundle to /dist
npm run build

# Preview production build locally
npm run preview
```

---

## 8. Guidance for Future AI Agents & Developers

When modifying or expanding this codebase, strictly observe these rules:

1. **Maintain Role Boundaries (RBAC)**: If adding new screens or actions, update [src/types.ts](file:///e:/danceone/src/types.ts) (`ScreenType`), [src/utils/rbac.ts](file:///e:/danceone/src/utils/rbac.ts) (`SCREEN_ACCESS_POLICY` & `ROLE_PERMISSIONS`), and provide fallback handling in [src/components/common/AccessDeniedGuard.tsx](file:///e:/danceone/src/components/common/AccessDeniedGuard.tsx).
2. **Never Merge Admin into Public Auth**: Platform administration must remain isolated behind [AdminLoginScreen.tsx](file:///e:/danceone/src/components/admin/AdminLoginScreen.tsx) and [adminAuth.ts](file:///e:/danceone/src/utils/adminAuth.ts) session token validation.
3. **Keep Studio Financials Confidential**: Invoices, gross settlements, and student databases belong strictly to `studio` and `admin` roles. Dancers and instructors must never see raw studio income.
4. **Preserve Twin-City Geography**: Bhubaneswar and Cuttack are the anchor markets for real dance academies and cyphers (Patia, Saheed Nagar, Khandagiri, CDA Sector 7, Barabati). Keep local directory data accurate and relevant.
5. **No Forced Hardcoded Locations**: Maintain the dynamic location filter in [HomeScreen.tsx](file:///e:/danceone/src/components/HomeScreen.tsx) and [LocationSelectorModal.tsx](file:///e:/danceone/src/components/common/LocationSelectorModal.tsx) so users can freely explore any region.
6. **Ensure Review Authenticity**: Reviews must remain strictly gated behind verified front-desk attendance completion (`status === 'completed'`).
