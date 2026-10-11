# DANCEONE — Comprehensive Architecture & Codebase Context

> **Note:** This file is also available as [context.md](file:///e:/danceone/context.md).

Please refer to [context.md](file:///e:/danceone/context.md) for the complete, canonical architecture, data models, RBAC rules, and codebase guide.
The full content is replicated below for direct agent reading:

---

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
The app functions as a Single Page Application (SPA) driven by stateful screen switching in [src/App.tsx](file:///e:/danceone/src/App.tsx):
- `currentScreen`: Controls the active view (`ScreenType`).
- `currentRole`: Active persona (`dancer` | `instructor` | `studio` | `organizer` | `admin`).
- `userProfile`: Active profile data (`UserProfile`) including verification badges, streaks, and contact info.
- `platformEvents`: Global published events array, shared between Organizer publishing actions and public Marketplace discovery.
- `platformBrands`: Global vetted brand catalog, updated when users suggest brands and admins approve them.
- `importedStudios`: Twin-city imported studio directory, updated via admin approvals, rejections, and duplicate merges.
- Full-bleed screens (`studio-profile`, `instructor-profile`, `slot-selection`, `payment`, `booking-confirmation`) suppress the standard `TopAppBar` and `DesktopSidebar` to present immersive hero banners.

### 4.2 Role-Based Access Control (RBAC) Engine ([src/utils/rbac.ts](file:///e:/danceone/src/utils/rbac.ts))
Access to screens and actions is strictly governed by `checkScreenAccess()` and `hasPermission()`. If an unauthorized role attempts to access a restricted route (e.g. a student navigating to `studio-finances` or `organizer-dashboard`), the app renders [AccessDeniedGuard.tsx](file:///e:/danceone/src/components/common/AccessDeniedGuard.tsx) with clear justification and role-switch options.

---

## 5. Development & Operational Commands

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
