import React, { useState } from 'react';
import {
  Compass,
  Home,
  MapPin,
  Search,
  Calendar,
  User,
  Sparkles,
  Building2,
  Bell,
  Heart,
  Plus,
  Zap,
  Trophy,
  Briefcase,
  Layers,
  TrendingUp,
  Ticket,
  Shield,
  BarChart3,
  Flame,
  LogOut,
  DollarSign,
  Users,
  Navigation as NavIcon,
  ShoppingBag,
} from 'lucide-react';
import { ScreenType, UserRole, UserProfile } from '../types';
import { PremiumLogo } from './common/PremiumLogo';
import { LocationSelectorModal } from './common/LocationSelectorModal';

interface TopAppBarProps {
  currentScreen: ScreenType;
  currentRole: UserRole;
  userProfile: UserProfile;
  userLocation?: string;
  isCurrentLocation?: boolean;
  onNavigate: (screen: ScreenType) => void;
  onSearchSubmit: (query: string) => void;
  onOpenQuickAction: () => void;
  onSelectLocation?: (loc: string, isGPS?: boolean) => void;
  onClearLocation?: () => void;
  onLogout: () => void;
}

export const TopAppBar: React.FC<TopAppBarProps> = ({
  currentScreen,
  currentRole,
  userProfile,
  userLocation = '',
  isCurrentLocation = false,
  onNavigate,
  onSearchSubmit,
  onOpenQuickAction,
  onSelectLocation,
  onClearLocation,
  onLogout,
}) => {
  const [searchValue, setSearchValue] = useState('');
  const [showLocationModal, setShowLocationModal] = useState(false);

  const handleSearchKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchValue.trim()) {
      onSearchSubmit(searchValue);
    }
  };

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return { label: 'DANCEONE ADMIN', color: 'border-rose-500/30 text-rose-400 bg-rose-500/10' };
      case 'instructor':
        return { label: 'INSTRUCTOR', color: 'border-purple-500/30 text-purple-400 bg-purple-500/10' };
      case 'studio':
        return { label: 'STUDIO OWNER', color: 'border-amber-500/30 text-amber-300 bg-amber-500/10' };
      case 'organizer':
        return { label: 'EVENT ORGANIZER', color: 'border-amber-500/30 text-amber-400 bg-amber-500/10' };
      default:
        return { label: 'STUDENT / CUSTOMER', color: 'border-sky-500/30 text-sky-400 bg-sky-500/10' };
    }
  };

  const roleBadge = getRoleBadge(currentRole);

  return (
    <header className="sticky top-0 z-40 w-full bg-[#060608]/95 backdrop-blur-md border-b border-white/10 px-3 sm:px-6 py-2.5 transition-colors font-sans shadow-md">
      <div className="max-w-[1600px] mx-auto flex items-center justify-between gap-4">
        {/* Brand & Location */}
        <div className="flex items-center gap-3 sm:gap-5">
          <PremiumLogo
            size="md"
            showWordmark={true}
            showTagline={false}
            onClick={() => onNavigate('home')}
          />

          {/* Role Pill */}
          <span
            className={`hidden sm:inline-block text-xs font-mono tracking-widest uppercase px-2.5 py-1 rounded-lg border ${roleBadge.color}`}
          >
            {roleBadge.label}
          </span>

          {/* Location Trigger */}
          <button
            onClick={() => setShowLocationModal(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/10 hover:border-white/30 text-xs font-mono transition-all text-white group"
            title="Configure dance discovery location"
          >
            <MapPin className="w-3.5 h-3.5 text-purple-400 group-hover:text-purple-300 transition-colors" />
            <span className="max-w-[130px] truncate font-semibold text-white text-xs">
              {userLocation || (isCurrentLocation ? 'Current Location' : 'Select Location')}
            </span>
          </button>
        </div>

        {/* Global Instant Search Bar */}
        <div className="flex-1 max-w-md hidden md:block">
          <div className="relative flex items-center">
            <Search className="absolute left-3.5 w-4 h-4 text-zinc-400" />
            <input
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyDown={handleSearchKey}
              placeholder={
                currentRole === 'instructor'
                  ? 'Search gigs, workshops, studios...'
                  : currentRole === 'studio'
                  ? 'Search room schedules, faculty...'
                  : currentRole === 'organizer'
                  ? 'Search tournaments, guest judges...'
                  : 'Search workshops, battles, studios...'
              }
              className="w-full pl-10 pr-9 py-2 bg-zinc-900 border border-white/10 focus:border-purple-500 text-xs sm:text-sm font-medium text-white placeholder:text-zinc-500 rounded-xl outline-none transition-all shadow-inner"
            />
            {searchValue && (
              <button
                onClick={() => {
                  setSearchValue('');
                  onSearchSubmit('');
                }}
                className="absolute right-3 text-xs text-zinc-400 hover:text-white"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Top Right Quick Actions */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Admin Portal Shortcut - Only visible to DanceOne Admin to uphold role boundaries */}
          {currentRole === 'admin' && (
            <button
              onClick={() => onNavigate('admin-dashboard')}
              className={`px-2.5 sm:px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all ${
                currentScreen === 'admin-dashboard' || currentScreen === 'admin'
                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 shadow-sm'
                  : 'bg-white/[0.04] border-white/10 hover:border-white/20 text-zinc-300 hover:text-white'
              }`}
              title="Dance One Platform Administration"
            >
              <Shield className="w-3.5 h-3.5 text-rose-400" />
              <span className="hidden sm:inline">Admin Hub</span>
            </button>
          )}

          <button
            onClick={() => onNavigate('search')}
            className="p-2 rounded-xl bg-white/[0.04] border border-white/10 hover:border-white/30 text-white md:hidden transition-colors"
            aria-label="Search"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Quick Add (+) Button for Desktop Top Bar */}
          <button
            onClick={onOpenQuickAction}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white hover:bg-zinc-200 text-black text-xs font-bold tracking-tight shadow-md transition-all active:scale-95"
            title="Quick Action"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span className="hidden sm:inline">
              {currentRole === 'instructor'
                ? '+ Class'
                : currentRole === 'studio'
                ? '+ Add Batch'
                : currentRole === 'organizer'
                ? '+ Host Event'
                : currentRole === 'admin'
                ? '+ Governance'
                : 'Book Pass'}
            </span>
          </button>

          <div
            onClick={() => onNavigate('profile')}
            className="w-9 h-9 rounded-xl overflow-hidden border border-white/20 hover:border-purple-400 cursor-pointer transition-colors shrink-0 shadow-sm"
            title="Profile & Settings"
          >
            <img
              src={userProfile.avatar}
              alt={userProfile.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* Location Selector Modal */}
      <LocationSelectorModal
        isOpen={showLocationModal}
        onClose={() => setShowLocationModal(false)}
        currentLocation={userLocation}
        isCurrentLocation={isCurrentLocation}
        onSelectLocation={(loc, isGPS) => {
          if (onSelectLocation) onSelectLocation(loc, isGPS);
          setShowLocationModal(false);
        }}
        onClearLocation={() => {
          if (onClearLocation) onClearLocation();
          setShowLocationModal(false);
        }}
      />
    </header>
  );
};

interface DesktopSidebarProps {
  currentScreen: ScreenType;
  currentRole: UserRole;
  onNavigate: (screen: ScreenType) => void;
  onOpenQuickAction: () => void;
}

export const DesktopSidebar: React.FC<DesktopSidebarProps> = ({
  currentScreen,
  currentRole,
  onNavigate,
  onOpenQuickAction,
}) => {
  const getNavItems = () => {
    switch (currentRole) {
      case 'admin':
        return [
          { id: 'admin-dashboard', label: 'Admin', icon: Shield },
          { id: 'home', label: 'Home', icon: Home },
          { id: 'map', label: 'Map', icon: MapPin },
          { id: 'events', label: 'Events', icon: Zap },
          { id: 'explore', label: 'Explore', icon: Compass },
          { id: 'profile', label: 'Profile', icon: User },
        ];
      case 'instructor':
        return [
          { id: 'instructor-dashboard', label: 'Schedule', icon: Calendar },
          { id: 'explore', label: 'Explore', icon: Compass },
          { id: 'instructor-gigs', label: 'Gigs', icon: Briefcase },
          { id: 'home', label: 'Home', icon: Home },
          { id: 'profile', label: 'Profile', icon: User },
        ];
      case 'studio':
        return [
          { id: 'studio-dashboard', label: 'Studio', icon: Building2 },
          { id: 'studio-batches', label: 'Batches', icon: Layers },
          { id: 'studio-students', label: 'Students', icon: Users },
          { id: 'studio-finances', label: 'Finances', icon: DollarSign },
          { id: 'profile', label: 'Profile', icon: User },
        ];
      case 'organizer':
        return [
          { id: 'organizer-dashboard', label: 'Events', icon: Trophy },
          { id: 'organizer-guests', label: 'Guests', icon: Users },
          { id: 'organizer-finances', label: 'Finances', icon: DollarSign },
          { id: 'organizer-more', label: 'Judge/MC', icon: Shield },
          { id: 'profile', label: 'Profile', icon: User },
        ];
      default:
        return [
          { id: 'home', label: 'Home', icon: Home },
          { id: 'events', label: 'Events', icon: Zap },
          { id: 'brands-marketplace', label: 'Brands', icon: ShoppingBag },
          { id: 'bookings', label: 'Passes', icon: Calendar },
          { id: 'challenges', label: 'Battles', icon: Trophy },
          { id: 'explore', label: 'Explore', icon: Compass },
          { id: 'profile', label: 'Profile', icon: User },
        ];
    }
  };

  const navItems = getNavItems();

  return (
    <aside className="hidden lg:flex flex-col items-center w-18 sm:w-20 bg-[#060608] border-r border-white/10 py-4 shrink-0 h-[calc(100vh-58px)] sticky top-[58px]">
      <nav className="flex-1 flex flex-col items-center gap-2 w-full px-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentScreen === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id as ScreenType)}
              className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center transition-all group relative border ${
                isActive
                  ? 'bg-white text-black border-white shadow-lg shadow-white/10'
                  : 'text-zinc-400 border-transparent hover:text-white hover:border-white/10 hover:bg-white/[0.06]'
              }`}
              title={item.label}
            >
              <Icon className="w-5 h-5 transition-transform group-hover:scale-110" />
              <span className="text-xs font-semibold mt-1 tracking-tight leading-none">
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>

      {/* Floating Add Button in Sidebar */}
      <button
        onClick={onOpenQuickAction}
        className="w-11 h-11 rounded-2xl bg-white hover:bg-zinc-200 text-black flex items-center justify-center shadow-lg transition-transform hover:scale-105 active:scale-95"
        title="Create or Quick Action"
      >
        <Plus className="w-5 h-5 stroke-[2.5]" />
      </button>
    </aside>
  );
};

interface MobileBottomNavProps {
  currentScreen: ScreenType;
  currentRole: UserRole;
  onNavigate: (screen: ScreenType) => void;
  onOpenQuickAction: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentScreen,
  currentRole,
  onNavigate,
  onOpenQuickAction,
}) => {
  const getRoleButtons = () => {
    switch (currentRole) {
      case 'admin':
        return {
          btn1: { id: 'admin-dashboard', label: 'Admin', icon: Shield },
          btn2: { id: 'home', label: 'Home', icon: Home },
          btn4: { id: 'map', label: 'Map', icon: MapPin },
          btn5: { id: 'profile', label: 'Profile', icon: User },
        };
      case 'instructor':
        return {
          btn1: { id: 'instructor-dashboard', label: 'Schedule', icon: Calendar },
          btn2: { id: 'explore', label: 'Explore', icon: Compass },
          btn4: { id: 'instructor-gigs', label: 'My Gigs', icon: Briefcase },
          btn5: { id: 'profile', label: 'Dashboard', icon: BarChart3 },
        };
      case 'studio':
        return {
          btn1: { id: 'studio-dashboard', label: 'Studio', icon: Building2 },
          btn2: { id: 'bookings', label: 'Bookings', icon: Calendar },
          btn4: { id: 'studio-batches', label: 'Batches', icon: Layers },
          btn5: { id: 'studio-finances', label: 'Finances', icon: DollarSign },
        };
      case 'organizer':
        return {
          btn1: { id: 'organizer-dashboard', label: 'My events', icon: Trophy },
          btn2: { id: 'organizer-guests', label: 'Guests', icon: Users },
          btn4: { id: 'organizer-finances', label: 'Finances', icon: DollarSign },
          btn5: { id: 'organizer-more', label: 'Judge/MC', icon: Shield },
        };
      case 'dancer':
      default:
        return {
          btn1: { id: 'home', label: 'Home', icon: Home },
          btn2: { id: 'events', label: 'Events', icon: Zap },
          btn4: { id: 'bookings', label: 'Passes', icon: Calendar },
          btn5: { id: 'challenges', label: 'Battles', icon: Trophy },
        };
    }
  };

  const buttons = getRoleButtons();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-[#060608]/95 backdrop-blur-md border-t border-white/10 px-3 py-2 shadow-2xl">
      <div className="flex items-center justify-between max-w-md mx-auto relative">
        {/* Button 1 */}
        <button
          onClick={() => onNavigate(buttons.btn1.id as ScreenType)}
          className={`flex-1 flex flex-col items-center justify-center py-1 transition-all ${
            currentScreen === buttons.btn1.id || (currentRole === 'organizer' && currentScreen === 'organizer-events' && buttons.btn1.id === 'organizer-dashboard')
              ? 'text-white font-bold'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          {React.createElement(buttons.btn1.icon, { className: 'w-5 h-5' })}
          <span className="text-xs font-semibold mt-0.5 tracking-tight truncate max-w-[65px]">
            {buttons.btn1.label}
          </span>
        </button>

        {/* Button 2 */}
        <button
          onClick={() => onNavigate(buttons.btn2.id as ScreenType)}
          className={`flex-1 flex flex-col items-center justify-center py-1 transition-all ${
            currentScreen === buttons.btn2.id
              ? 'text-white font-bold'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          {React.createElement(buttons.btn2.icon, { className: 'w-5 h-5' })}
          <span className="text-xs font-semibold mt-0.5 tracking-tight truncate max-w-[65px]">
            {buttons.btn2.label}
          </span>
        </button>

        {/* Button 3: CENTERED RAISED ROUND SHAPED (+) BUTTON */}
        <div className="flex-1 flex items-center justify-center -mt-6">
          <button
            onClick={onOpenQuickAction}
            className="w-12 h-12 rounded-2xl bg-white hover:bg-zinc-200 text-black flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.35)] border-4 border-[#060608] transition-transform active:scale-95"
            aria-label="Create or Quick Action"
          >
            <Plus className="w-5 h-5 stroke-[3]" />
          </button>
        </div>

        {/* Button 4 */}
        <button
          onClick={() => onNavigate(buttons.btn4.id as ScreenType)}
          className={`flex-1 flex flex-col items-center justify-center py-1 transition-all ${
            currentScreen === buttons.btn4.id
              ? 'text-white font-bold'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          {React.createElement(buttons.btn4.icon, { className: 'w-5 h-5' })}
          <span className="text-xs font-semibold mt-0.5 tracking-tight truncate max-w-[65px]">
            {buttons.btn4.label}
          </span>
        </button>

        {/* Button 5 */}
        <button
          onClick={() => onNavigate(buttons.btn5.id as ScreenType)}
          className={`flex-1 flex flex-col items-center justify-center py-1 transition-all ${
            currentScreen === buttons.btn5.id
              ? 'text-white font-bold'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          {React.createElement(buttons.btn5.icon, { className: 'w-5 h-5' })}
          <span className="text-xs font-semibold mt-0.5 tracking-tight truncate max-w-[65px]">
            {buttons.btn5.label}
          </span>
        </button>
      </div>
    </nav>
  );
};

