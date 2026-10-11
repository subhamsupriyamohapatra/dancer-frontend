/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { api } from './services/api';
import { SplashScreen } from './components/SplashScreen';
import { AuthScreen } from './components/AuthScreen';
import { TopAppBar, DesktopSidebar, MobileBottomNav } from './components/Navigation';
import { HomeScreen } from './components/HomeScreen';
import { StudioMapView } from './components/StudioMapView';
import { ExploreScreen } from './components/ExploreScreen';
import { SearchResultsScreen } from './components/SearchResultsScreen';
import { StudioProfileScreen } from './components/StudioProfileScreen';
import { InstructorProfileScreen } from './components/InstructorProfileScreen';
import { SlotSelectionScreen } from './components/SlotSelectionScreen';
import { PaymentScreen } from './components/PaymentScreen';
import { BookingConfirmationScreen } from './components/BookingConfirmationScreen';
import { WeddingLandingScreen } from './components/WeddingLandingScreen';
import { WeddingChoreographersScreen } from './components/WeddingChoreographersScreen';
import { WeddingRequestModal } from './components/WeddingRequestModal';
import { StudioDashboardScreen } from './components/StudioDashboardScreen';
import { BookingsScreen } from './components/BookingsScreen';
import { ProfileScreen } from './components/ProfileScreen';
import { EventsScreen } from './components/EventsScreen';
import { ChallengesScreen } from './components/ChallengesScreen';
import { InstructorDashboardView } from './components/InstructorDashboardView';
import { OrganizerDashboardScreen } from './components/OrganizerDashboardScreen';
import { AdminDashboardScreen } from './components/AdminDashboardScreen';
import { QuickActionModal } from './components/QuickActionModal';
import { CreateEventModal } from './components/organizer/CreateEventModal';
import { AccessDeniedGuard } from './components/common/AccessDeniedGuard';
import { checkScreenAccess, canCreatePublicEvent } from './utils/rbac';
import { BrandsMarketplaceScreen } from './components/brands/BrandsMarketplaceScreen';
import { AdminLoginScreen } from './components/admin/AdminLoginScreen';
import { INITIAL_BRANDS_DATA } from './data/brandsData';
import { INITIAL_IMPORTED_STUDIOS_DATA } from './data/importedStudiosData';
import { BrandRecord, BrandApprovalStatus, SuggestBrandPayload } from './types/brand';
import { ImportedStudioRecord, ImportedStudioStatus } from './types/studioImport';
import { clearAdminSession } from './utils/adminAuth';

import {
  DanceClass,
  ScreenType,
  Booking,
  WeddingChoreographer,
  UserRole,
  UserProfile,
  Studio,
  StudioPaymentRecord,
} from './types';
import { OrganizerEventRecord } from './types/organizer';
import {
  ALL_CLASSES,
  INITIAL_BOOKINGS,
  ROLE_USER_PRESETS,
  FLOW_STUDIO_DATA,
  STUDIO_PAYMENTS_DATA,
} from './data/danceData';
import { INITIAL_PLATFORM_EVENTS } from './data/platformEventsData';

export default function App() {
  // Authentication & Persona Role State - Role-Based Login Screen as default entrypoint
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentRole, setCurrentRole] = useState<UserRole>('dancer');
  const [userProfile, setUserProfile] = useState<UserProfile>(ROLE_USER_PRESETS.dancer);

  // Platform-wide Published Events State - "Since it is a platform. All the publishing that takes place should be visible with the relevant datas which is being search for and published."
  const [platformEvents, setPlatformEvents] = useState<OrganizerEventRecord[]>(INITIAL_PLATFORM_EVENTS);

  // Rule 1: Dance-Friendly Brands Marketplace state
  const [platformBrands, setPlatformBrands] = useState<BrandRecord[]>(INITIAL_BRANDS_DATA);

  // Rule 2: Bhubaneswar & Cuttack Imported Studios curation pipeline state
  const [importedStudios, setImportedStudios] = useState<ImportedStudioRecord[]>(INITIAL_IMPORTED_STUDIOS_DATA);

  // Platform Geolocation State - "Location can be entered don't give default Location. It can be current location too."
  const [userLocation, setUserLocation] = useState<string>('');
  const [isCurrentLocation, setIsCurrentLocation] = useState<boolean>(false);

  // Live Backend Data Synchronization Hook
  useEffect(() => {
    // 1. Fetch live classes from backend
    api.classes.list().then((res) => {
      if (res.classes && res.classes.length > 0) setAllClasses(res.classes);
    }).catch(() => {});

    // 2. Fetch live published events
    api.events.list().then((res) => {
      if (res.events && res.events.length > 0) setPlatformEvents(res.events);
    }).catch(() => {});

    // 3. Fetch live approved brands
    api.brands.list().then((res) => {
      if (res.brands && res.brands.length > 0) setPlatformBrands(res.brands);
    }).catch(() => {});

    // 4. Fetch imported studios directory
    api.admin.listImportedStudios().then((res) => {
      if (res.studios && res.studios.length > 0) setImportedStudios(res.studios);
    }).catch(() => {});

    // 5. Fetch studio invoices
    api.studios.listInvoices('studio-1').then((res) => {
      if (res.invoices && res.invoices.length > 0) setStudioPayments(res.invoices);
    }).catch(() => {});

    // 6. Fetch user passes
    api.bookings.getMyPasses().then((res) => {
      if (res.passes) setUserBookings(res.passes);
    }).catch(() => {});
  }, []);

  const handleSelectLocation = (loc: string, isGPS: boolean = false) => {
    setUserLocation(loc);
    setIsCurrentLocation(isGPS);
  };

  const handleClearLocation = () => {
    setUserLocation('');
    setIsCurrentLocation(false);
  };

  const handlePublishPlatformEvent = (newEvent: OrganizerEventRecord) => {
    const published: OrganizerEventRecord = {
      ...newEvent,
      status: 'published',
    };
    setPlatformEvents((prev) => [published, ...prev]);

    // Live backend persistence
    api.events.create(published).then((res) => {
      if (res.event) {
        setPlatformEvents((prev) => [res.event, ...prev.filter((e) => e.id !== res.event.id && e.id !== published.id)]);
      }
    }).catch((err) => console.log('Event stored locally (API fallback):', err.message));
  };

  const handleUpdatePlatformEvent = (updated: OrganizerEventRecord) => {
    setPlatformEvents((prev) => prev.map((ev) => (ev.id === updated.id ? updated : ev)));
    api.events.update(updated.id, updated).catch(() => {});
  };

  const handleBookEventPass = (eventId: string, tierIndex: number = 0) => {
    setPlatformEvents((prev) =>
      prev.map((ev) => {
        if (ev.id !== eventId) return ev;
        const currentTier =
          ev.ticketPricing && ev.ticketPricing[tierIndex]
            ? ev.ticketPricing[tierIndex]
            : { tier: 'General Pass', price: 499, capacity: ev.capacity || 100, sold: 0 };
        const tierPrice = currentTier.price || 499;

        const updatedPricing = ev.ticketPricing
          ? ev.ticketPricing.map((tp, idx) =>
              idx === tierIndex ? { ...tp, sold: (tp.sold || 0) + 1 } : tp
            )
          : [{ tier: 'General Pass', price: tierPrice, capacity: ev.capacity || 100, sold: 1 }];

        return {
          ...ev,
          registeredCount: (ev.registeredCount || 0) + 1,
          revenue: (ev.revenue || 0) + tierPrice,
          ticketPricing: updatedPricing,
        };
      })
    );

    // Call live backend to record ticket pass sale
    api.events.bookPass(eventId, tierIndex).catch(() => {});
  };

  // Dynamic Studio Management & Main Portal Sync State
  const [studioData, setStudioData] = useState<Studio>(FLOW_STUDIO_DATA);
  const [allClasses, setAllClasses] = useState<DanceClass[]>(ALL_CLASSES);
  const [studioPayments, setStudioPayments] = useState<StudioPaymentRecord[]>(STUDIO_PAYMENTS_DATA);

  // Screen and Flow Navigation State
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('auth');
  const [previousScreen, setPreviousScreen] = useState<ScreenType>('auth');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Contemporary');

  // Quick Action Modal for Centered Raised Round Button (+)
  const [showQuickActionModal, setShowQuickActionModal] = useState(false);
  const [showOrganizerCreateModal, setShowOrganizerCreateModal] = useState(false);

  const handleOpenQuickAction = () => {
    if (currentRole === 'organizer') {
      setShowOrganizerCreateModal(true);
    } else {
      setShowQuickActionModal(true);
    }
  };

  // Selected Data for Sub-flows
  const [selectedClass, setSelectedClass] = useState<DanceClass | null>(null);
  const [activeBookingDetails, setActiveBookingDetails] = useState<{
    danceClass: DanceClass;
    selectedDate: string;
    selectedTime: string;
    totalAmount: number;
  } | null>(null);
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);
  const [userBookings, setUserBookings] = useState<Booking[]>([]);

  // Wedding Flow State
  const [showWeddingModal, setShowWeddingModal] = useState(false);
  const [weddingChoreographer, setWeddingChoreographer] = useState<WeddingChoreographer | null>(null);

  // Dynamic Studio Update Handlers
  const handleUpdateStudioProfile = (updated: Partial<Studio>) => {
    setStudioData((prev) => ({
      ...prev,
      ...updated,
    }));
    if (updated.name) {
      setUserProfile((prev) => ({
        ...prev,
        studioName: updated.name,
      }));
    }
  };

  const handleAddClass = (newClass: DanceClass) => {
    setAllClasses((prev) => [newClass, ...prev]);
    api.classes.create(newClass).catch(() => {});
  };

  const handleAddWorkshop = (newWorkshop: DanceClass) => {
    setAllClasses((prev) => [newWorkshop, ...prev]);
    api.classes.create(newWorkshop).catch(() => {});
  };

  const handleAddPaymentRecord = (newPayment: StudioPaymentRecord) => {
    setStudioPayments((prev) => [newPayment, ...prev]);
    api.studios.createInvoice('studio-1', newPayment).catch(() => {});
  };

  // Navigation Handler
  const navigateTo = (screen: ScreenType) => {
    setPreviousScreen(currentScreen);
    setCurrentScreen(screen);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Role Login & Auth Handlers
  const handleAuthSuccess = (profile: UserProfile) => {
    setUserProfile(profile);
    setCurrentRole(profile.role);
    setIsAuthenticated(true);
    if (profile.role === 'instructor') {
      navigateTo('instructor-dashboard');
    } else if (profile.role === 'studio') {
      navigateTo('studio-dashboard');
    } else if (profile.role === 'organizer') {
      navigateTo('organizer-dashboard');
    } else if (profile.role === 'admin') {
      navigateTo('admin-dashboard');
    } else {
      navigateTo('home');
    }
  };

  const handleRoleChange = (role: UserRole) => {
    setCurrentRole(role);
    setUserProfile(ROLE_USER_PRESETS[role]);
    api.auth.switchRole(role).catch(() => {});
    if (role === 'instructor') {
      navigateTo('instructor-dashboard');
    } else if (role === 'studio') {
      navigateTo('studio-dashboard');
    } else if (role === 'organizer') {
      navigateTo('organizer-dashboard');
    } else if (role === 'admin') {
      navigateTo('admin-dashboard');
    } else {
      navigateTo('home');
    }
  };

  const handleSuggestBrand = (payload: SuggestBrandPayload) => {
    const newBrand: BrandRecord = {
      id: `brand-${Date.now()}`,
      name: payload.name,
      tagline: payload.tagline,
      description: payload.description,
      category: payload.category,
      websiteUrl: payload.websiteUrl,
      instagramHandle: payload.instagramHandle,
      logoUrl: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400',
      heroImageUrl: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=1200',
      featuredProducts: [],
      discountPercent: 10,
      discountCode: 'DANCEONE10',
      approvalStatus: 'PENDING_APPROVAL',
      isFeatured: false,
      danceStylesSupported: payload.danceStylesSupported || ['Contemporary'],
      suggestedByUserName: userProfile.name,
      suggestedAt: new Date().toISOString(),
    };
    setPlatformBrands((prev) => [newBrand, ...prev]);

    // Live API persistence
    api.brands.suggest(payload).then((res) => {
      if (res.brand) {
        setPlatformBrands((prev) => [res.brand, ...prev.filter((b) => b.id !== res.brand.id && b.id !== newBrand.id)]);
      }
    }).catch(() => {});
  };

  const handleUpdateBrandStatus = (brandId: string, status: BrandApprovalStatus, notes?: string) => {
    setPlatformBrands((prev) =>
      prev.map((b) => (b.id === brandId ? { ...b, approvalStatus: status } : b))
    );
    api.brands.updateStatus(brandId, status, notes).catch(() => {});
  };

  const handleUpdateImportedStudioStatus = (
    studioId: string,
    status: ImportedStudioStatus,
    notes?: string
  ) => {
    setImportedStudios((prev) =>
      prev.map((s) => (s.id === studioId ? { ...s, verificationStatus: status } : s))
    );
    api.admin.updateImportedStudioStatus(studioId, status, notes).catch(() => {});
  };

  const handleMergeDuplicateStudio = (sourceId: string, targetId: string) => {
    setImportedStudios((prev) =>
      prev.map((s) => {
        if (s.id === sourceId) {
          return {
            ...s,
            verificationStatus: 'MERGED_DUPLICATE',
            isDuplicateOf: targetId,
            duplicateNotes: `Merged into ${targetId} on ${new Date().toISOString().split('T')[0]}`,
          };
        }
        return s;
      })
    );
    api.admin.mergeDuplicateStudios(sourceId, targetId).catch(() => {});
  };

  const handleAdminLoginSuccess = (adminProfile: UserProfile) => {
    setUserProfile(adminProfile);
    setCurrentRole('admin');
    setIsAuthenticated(true);
    navigateTo('admin-dashboard');
  };

  const handleLogout = () => {
    api.auth.logout();
    if (currentRole === 'admin') {
      clearAdminSession();
    }
    setIsAuthenticated(false);
    navigateTo('auth');
  };

  const handleSelectClass = (danceClass: DanceClass) => {
    setSelectedClass(danceClass);
    navigateTo('slot-selection');
  };

  const handleContinueToPayment = (details: {
    danceClass: DanceClass;
    selectedDate: string;
    selectedTime: string;
    totalAmount: number;
  }) => {
    setActiveBookingDetails(details);
    navigateTo('payment');
  };

  const handlePaymentSuccess = (newBooking: Booking) => {
    setUserBookings((prev) => [newBooking, ...prev]);
    setConfirmedBooking(newBooking);
    navigateTo('booking-confirmation');

    // Save booking to live backend
    api.bookings.checkout(newBooking).catch(() => {});
  };

  const handleSearchSubmit = (query: string) => {
    setSearchQuery(query);
    navigateTo('search');
  };

  const handleSelectCategory = (cat: string) => {
    setSelectedCategory(cat);
    navigateTo('search');
  };

  const handleRequestQuoteWithChoreographer = (choreo: WeddingChoreographer) => {
    setWeddingChoreographer(choreo);
    setShowWeddingModal(true);
  };

  // 1. Initial Splash Screen
  if (currentScreen === 'splash') {
    return <SplashScreen onEnterApp={() => navigateTo(isAuthenticated ? 'home' : 'auth')} />;
  }

  // Dedicated Protected Admin Portal Authentication (Rule 3: Separate Admin Login)
  if (currentScreen === 'admin-login') {
    return (
      <AdminLoginScreen
        onAdminLoginSuccess={handleAdminLoginSuccess}
        onNavigate={navigateTo}
      />
    );
  }

  // 2. Role-Based Login & Signup Screen (Exposes only 4 public roles: Dancer, Instructor, Studio, Organizer)
  if (currentScreen === 'auth' || (!isAuthenticated && currentScreen !== 'splash')) {
    return (
      <AuthScreen
        onAuthSuccess={handleAuthSuccess}
        onLoginSuccess={(_role, profile) => handleAuthSuccess(profile)}
        onOpenAdminPortal={() => navigateTo('admin-login')}
        onSkipAsDancer={() => {
          handleAuthSuccess(ROLE_USER_PRESETS.dancer);
        }}
      />
    );
  }

  // Screens that have their own custom full-bleed hero headers (don't show top app bar)
  const isFullBleedScreen =
    currentScreen === 'studio-profile' ||
    currentScreen === 'instructor-profile' ||
    currentScreen === 'slot-selection' ||
    currentScreen === 'payment' ||
    currentScreen === 'booking-confirmation';

  // RBAC Permission Check (Rule 14: Enforce permissions across UI & routing)
  const screenAccess = checkScreenAccess(currentRole, currentScreen);

  return (
    <div className="min-h-screen bg-[#060608] text-[#fafafa] flex flex-col font-sans selection:bg-white/20 selection:text-white antialiased">
      {/* Top Application Bar - CRED Minimalist & Dynamic Location */}
      {!isFullBleedScreen && (
        <TopAppBar
          currentScreen={currentScreen}
          currentRole={currentRole}
          userProfile={userProfile}
          userLocation={userLocation}
          isCurrentLocation={isCurrentLocation}
          onNavigate={navigateTo}
          onSearchSubmit={handleSearchSubmit}
          onOpenQuickAction={handleOpenQuickAction}
          onSelectLocation={handleSelectLocation}
          onClearLocation={handleClearLocation}
          onLogout={handleLogout}
        />
      )}

      {/* Main Content Layout with Desktop Sidebar */}
      <div className="flex-1 flex w-full">
        {/* Desktop Sidebar */}
        {!isFullBleedScreen && (
          <DesktopSidebar
            currentScreen={currentScreen}
            currentRole={currentRole}
            onNavigate={navigateTo}
            onOpenQuickAction={handleOpenQuickAction}
          />
        )}

        {/* Dynamic Screen View Content with RBAC Access Guard */}
        <main className="flex-1 overflow-x-hidden bg-[#060608]">
          {!screenAccess.allowed ? (
            <AccessDeniedGuard
              currentRole={currentRole}
              attemptedScreen={currentScreen}
              reason={screenAccess.reason}
              requiredRoles={screenAccess.requiredRoles}
              onNavigate={navigateTo}
              onRoleChange={handleRoleChange}
            />
          ) : (
            <>
              {currentScreen === 'home' && (
                <HomeScreen
              onNavigate={navigateTo}
              onSelectClass={handleSelectClass}
              onSearchSubmit={handleSearchSubmit}
              onSelectCategory={handleSelectCategory}
              platformEvents={platformEvents}
              userLocation={userLocation}
              onBookPass={handleBookEventPass}
            />
          )}

          {currentScreen === 'events' && (
            <EventsScreen
              onNavigate={navigateTo}
              platformEvents={platformEvents}
              userLocation={userLocation}
              onOpenCreateEvent={() => setShowOrganizerCreateModal(true)}
              onBookPass={handleBookEventPass}
            />
          )}

          {currentScreen === 'challenges' && (
            <ChallengesScreen onNavigate={navigateTo} />
          )}

          {currentScreen === 'map' && (
            <StudioMapView
              onNavigate={navigateTo}
              onSelectStudio={() => navigateTo('studio-profile')}
            />
          )}

          {currentScreen === 'explore' && (
            <ExploreScreen
              onNavigate={navigateTo}
              onSelectClass={handleSelectClass}
              onSelectCategory={handleSelectCategory}
            />
          )}

          {currentScreen === 'search' && (
            <SearchResultsScreen
              initialQuery={searchQuery}
              initialCategory={selectedCategory}
              platformEvents={platformEvents}
              userLocation={userLocation}
              onNavigate={navigateTo}
              onSelectClass={handleSelectClass}
              onBookPass={handleBookEventPass}
            />
          )}

          {currentScreen === 'instructor-dashboard' && (
            <InstructorDashboardView
              onNavigate={navigateTo}
              onSelectClass={handleSelectClass}
            />
          )}

          {currentScreen === 'instructor-gigs' && (
            <InstructorDashboardView
              onNavigate={navigateTo}
              onSelectClass={handleSelectClass}
            />
          )}

          {(currentScreen === 'studio-dashboard' ||
            currentScreen === 'studio-batches' ||
            currentScreen === 'studio-finances' ||
            currentScreen === 'studio-students' ||
            currentScreen === 'studio-attendance' ||
            currentScreen === 'studio-teachers') && (
            <StudioDashboardScreen
              onNavigate={navigateTo}
              initialSection={
                currentScreen === 'studio-batches'
                  ? 'BATCHES'
                  : currentScreen === 'studio-finances'
                  ? 'FINANCE'
                  : currentScreen === 'studio-students'
                  ? 'STUDENTS'
                  : currentScreen === 'studio-attendance'
                  ? 'ATTENDANCE'
                  : currentScreen === 'studio-teachers'
                  ? 'TEACHERS'
                  : 'DASHBOARD'
              }
              studioData={studioData}
              onUpdateStudioProfile={handleUpdateStudioProfile}
              allClasses={allClasses}
              onAddClass={handleAddClass}
              onAddWorkshop={handleAddWorkshop}
              payments={studioPayments}
              onAddPaymentRecord={handleAddPaymentRecord}
            />
          )}

          {(currentScreen === 'organizer-dashboard' ||
            currentScreen === 'organizer-events' ||
            currentScreen === 'organizer-guests' ||
            currentScreen === 'organizer-finances' ||
            currentScreen === 'organizer-more') && (
            <OrganizerDashboardScreen
              onNavigate={navigateTo}
              isCreateModalOpen={showOrganizerCreateModal}
              onOpenCreateModal={() => setShowOrganizerCreateModal(true)}
              onCloseCreateModal={() => setShowOrganizerCreateModal(false)}
              platformEvents={platformEvents}
              onPublishEvent={handlePublishPlatformEvent}
              onUpdatePlatformEvent={handleUpdatePlatformEvent}
              initialTab={
                currentScreen === 'organizer-guests'
                  ? 'participants'
                  : currentScreen === 'organizer-finances'
                  ? 'finance'
                  : currentScreen === 'organizer-more'
                  ? 'more'
                  : 'events'
              }
            />
          )}

          {currentScreen === 'brands-marketplace' && (
            <BrandsMarketplaceScreen
              brands={platformBrands}
              onSuggestBrand={handleSuggestBrand}
              onNavigate={navigateTo}
            />
          )}

          {(currentScreen === 'admin-dashboard' || currentScreen === 'admin') && (
            <AdminDashboardScreen
              onNavigate={navigateTo}
              onSelectStudio={(s) => {
                setStudioData(s);
                navigateTo('studio-profile');
              }}
              onSelectClass={handleSelectClass}
              brands={platformBrands}
              onUpdateBrandStatus={handleUpdateBrandStatus}
              importedStudios={importedStudios}
              onUpdateImportedStudioStatus={handleUpdateImportedStudioStatus}
              onMergeDuplicateStudio={handleMergeDuplicateStudio}
            />
          )}

          {currentScreen === 'studio-profile' && (
            <StudioProfileScreen
              studio={studioData}
              onBack={() => navigateTo(previousScreen === 'studio-profile' ? 'home' : previousScreen)}
              onNavigate={navigateTo}
              onSelectClass={handleSelectClass}
            />
          )}

          {currentScreen === 'instructor-profile' && (
            <InstructorProfileScreen
              onBack={() => navigateTo(previousScreen === 'instructor-profile' ? 'home' : previousScreen)}
              onNavigate={navigateTo}
              onSelectClass={handleSelectClass}
            />
          )}

          {currentScreen === 'slot-selection' && selectedClass && (
            <SlotSelectionScreen
              danceClass={selectedClass}
              onBack={() => navigateTo(previousScreen)}
              onContinueToPayment={handleContinueToPayment}
            />
          )}

          {currentScreen === 'payment' && activeBookingDetails && (
            <PaymentScreen
              bookingDetails={activeBookingDetails}
              onBack={() => navigateTo('slot-selection')}
              onPaymentSuccess={handlePaymentSuccess}
            />
          )}

          {currentScreen === 'booking-confirmation' && confirmedBooking && (
            <BookingConfirmationScreen
              booking={confirmedBooking}
              onNavigate={navigateTo}
            />
          )}

          {currentScreen === 'wedding-landing' && (
            <WeddingLandingScreen
              onNavigate={navigateTo}
              onRequestQuote={() => setShowWeddingModal(true)}
            />
          )}

          {currentScreen === 'wedding-choreographers' && (
            <WeddingChoreographersScreen
              onNavigate={navigateTo}
              onRequestQuoteWithChoreographer={handleRequestQuoteWithChoreographer}
            />
          )}

          {currentScreen === 'wedding-request' && (
            <WeddingLandingScreen
              onNavigate={navigateTo}
              onRequestQuote={() => setShowWeddingModal(true)}
            />
          )}

          {currentScreen === 'bookings' && (
            <BookingsScreen
              bookings={userBookings}
              onNavigate={navigateTo}
              onSelectBookingPass={(b) => {
                setConfirmedBooking(b);
                navigateTo('booking-confirmation');
              }}
            />
          )}

          {currentScreen === 'profile' && (
            <ProfileScreen
              userProfile={userProfile}
              currentRole={currentRole}
              onNavigate={navigateTo}
              onRoleChange={handleRoleChange}
              onLogout={handleLogout}
            />
          )}
            </>
          )}
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar (5 buttons per role with centered raised (+) button) */}
      {!isFullBleedScreen && (
        <MobileBottomNav
          currentScreen={currentScreen}
          currentRole={currentRole}
          onNavigate={navigateTo}
          onOpenQuickAction={handleOpenQuickAction}
        />
      )}

      {/* Centered Raised (+) Quick Action Modal */}
      <QuickActionModal
        isOpen={showQuickActionModal}
        onClose={() => setShowQuickActionModal(false)}
        currentRole={currentRole}
        onNavigate={navigateTo}
        onOpenCreateEvent={() => setShowOrganizerCreateModal(true)}
      />

      {/* Root Create Event Wizard Modal - Can be opened from anywhere on platform */}
      {showOrganizerCreateModal && (
        <CreateEventModal
          isOpen={showOrganizerCreateModal}
          onClose={() => setShowOrganizerCreateModal(false)}
          onCreateEvent={handlePublishPlatformEvent}
        />
      )}

      {/* Global Wedding Request Wizard Modal */}
      {showWeddingModal && (
        <WeddingRequestModal
          initialChoreographer={weddingChoreographer}
          onClose={() => {
            setShowWeddingModal(false);
            setWeddingChoreographer(null);
          }}
          onSuccess={() => {
            setShowWeddingModal(false);
            setWeddingChoreographer(null);
          }}
        />
      )}
    </div>
  );
}
