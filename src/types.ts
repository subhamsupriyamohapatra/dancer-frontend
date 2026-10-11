export type ScreenType =
  | 'splash'
  | 'auth'
  | 'home'
  | 'events'
  | 'explore'
  | 'search'
  | 'studio-profile'
  | 'instructor-profile'
  | 'slot-selection'
  | 'payment'
  | 'booking-confirmed'
  | 'booking-confirmation'
  | 'wedding-landing'
  | 'wedding-choreographers'
  | 'wedding-request'
  | 'studio-dashboard'
  | 'studio-batches'
  | 'studio-finances'
  | 'studio-students'
  | 'studio-attendance'
  | 'studio-teachers'
  | 'instructor-dashboard'
  | 'organizer-dashboard'
  | 'organizer-events'
  | 'organizer-guests'
  | 'organizer-finances'
  | 'organizer-more'
  | 'bookings'
  | 'challenges'
  | 'instructor-gigs'
  | 'profile'
  | 'map'
  | 'admin'
  | 'admin-dashboard'
  | 'admin-login'
  | 'brands-marketplace';

export * from './types/brand';
export * from './types/studioImport';

export type UserRole = 'dancer' | 'instructor' | 'studio' | 'organizer' | 'admin';

export interface DanceClass {
  id: string;
  title: string;
  category: string;
  instructor: string;
  instructorAvatar?: string;
  studio: string;
  location: string;
  city: string;
  dayTime: string;
  date: string;
  time: string;
  price: number;
  currency: string;
  image: string;
  imageAlt?: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels' | 'Intermediate / Advanced' | string;
  spotsLeft?: number;
  totalSpots?: number;
  bookedCount?: number;
  isNew?: boolean;
  isFavorite?: boolean;
  description?: string;
}

export interface DanceFitnessClass {
  id: string;
  title: string;
  type: 'Zumba' | 'Bollywood Cardio' | 'Barre Burn' | 'Piloxing' | 'Afrobeat Fit' | 'HIIT Dance';
  instructor: string;
  instructorAvatar: string;
  studio: string;
  location: string;
  dayTime: string;
  durationMins: number;
  caloriesBurned: number;
  intensity: 'Medium' | 'High' | 'Extreme';
  price: number;
  currency: string;
  image: string;
  spotsLeft: number;
  bpm: number;
}

export interface ChallengeItem {
  id: string;
  title: string;
  category: string;
  rewardText: string;
  xpPoints: number;
  deadline: string;
  participantsCount: number;
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Pro Battle';
  image: string;
  rules: string[];
  status: 'Active' | 'Joined' | 'Submitted' | 'Voting';
}

export interface InstructorGig {
  id: string;
  title: string;
  clientOrStudio: string;
  gigType: 'Sangeet Choreography' | 'Guest Masterclass' | 'Substitute Teacher' | 'Commercial Shoot' | 'Corporate Workshop';
  date: string;
  duration: string;
  location: string;
  budget: number;
  currency: string;
  status: 'Open Application' | 'Shortlisted' | 'Confirmed' | 'Completed';
  applicantsCount: number;
  urgent?: boolean;
}

export interface Studio {
  id: string;
  name: string;
  rating: number;
  reviewCount: number;
  neighborhood: string;
  city: string;
  address?: string;
  distance?: string;
  priceRange?: string;
  styles: string[];
  about: string;
  heroImage: string;
  logo?: string;
  phone?: string;
  email?: string;
  gstin?: string;
  upiId?: string;
  bankAccount?: string;
  amenities: { id: string; name: string; icon: string }[];
  instructors: {
    id: string;
    name: string;
    role: string;
    avatar: string;
    specialty?: string;
    rating?: number;
    classesCount?: number;
  }[];
  schedule: {
    date: string;
    day: string;
    dateNum: number;
    classes: {
      id: string;
      timeRange: string;
      title: string;
      instructor: string;
      spotsLeft: number;
      price: number;
      category?: string;
      level?: string;
      room?: string;
    }[];
  }[];
}

export interface Instructor {
  id: string;
  name: string;
  title: string;
  specialty?: string;
  specialties: string[];
  rating: number;
  reviewCount: number;
  experience?: string;
  experienceYears: number;
  studentsTaught?: number;
  studentsCount: number;
  classesCount?: number;
  avatar?: string;
  coverImage?: string;
  heroImage: string;
  bio: string;
  privateSessionRate: number;
  upcomingClasses: {
    id: string;
    tag: string;
    title: string;
    time: string;
    studioRoom: string;
    image: string;
  }[];
}

export interface WeddingChoreographer {
  id: string;
  name: string;
  rating: number;
  reviewCount: number;
  tags: string[];
  genres: string[];
  styleTitle: string;
  startingPrice: number;
  startingRate: string;
  image: string;
  avatar: string;
  imageAlt: string;
  bio: string;
  location: string;
  specialty: string;
  weddingsCompleted: number;
}

export interface DanceEvent {
  id: string;
  title: string;
  type: 'Showcase' | 'Cypher' | 'Social' | 'Jam' | 'Party';
  date: string;
  time: string;
  venue: string;
  location: string;
  organizer: string;
  price: number;
  currency: string;
  image: string;
  attendeesCount: number;
  badge?: string;
  description: string;
}

export interface Competition {
  id: string;
  title: string;
  category: string;
  prizePool: string;
  entryFee: number;
  currency: string;
  date: string;
  venue: string;
  city: string;
  format: '1v1 Battle' | 'Crew vs Crew' | 'Solo Showcase' | 'Duo/Trio';
  image: string;
  registeredTeams: number;
  status: 'Registration Open' | 'Filling Fast' | 'Final Spots';
  badge?: string;
}

export interface WeddingOffer {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  discountText: string;
  originalPrice: number;
  offerPrice: number;
  currency: string;
  inclusions: string[];
  image: string;
  validTill: string;
}

export interface StyleIconItem {
  id: string;
  name: string;
  iconName: string;
  count: string;
  image: string;
  accentColor: string;
}

export interface BannerItem {
  id: string;
  tag: string;
  title: string;
  subtitle: string;
  ctaText: string;
  actionType: 'class' | 'workshop' | 'wedding' | 'competition' | 'event';
  targetId?: string;
  image: string;
  badgeColor?: string;
  timeHighlight?: string;
}

export interface Booking {
  id: string;
  bookingCode: string;
  classTitle: string;
  instructorName: string;
  category: string;
  date: string;
  time: string;
  studioName: string;
  room: string;
  location: string;
  price: number;
  currency: string;
  paymentMethod: string;
  bookedAt: string;
  status: 'confirmed' | 'completed' | 'cancelled';
  qrCodeUrl: string;
}

export interface Lead {
  id: string;
  initials: string;
  name: string;
  interest: string;
  email: string;
  phone: string;
  date: string;
  status?: 'New' | 'Follow-up' | 'Trial Booked' | 'Converted' | 'Lost';
  source?: string;
  notes?: string;
}

export type StudioSubSection =
  | 'dashboard'
  | 'manage-schedule'
  | 'manage-classes'
  | 'batches'
  | 'students-management'
  | 'leads-crm'
  | 'attendance'
  | 'instructors'
  | 'staff'
  | 'rooms'
  | 'memberships-packages'
  | 'payments'
  | 'workshops-events'
  | 'marketing'
  | 'reviews'
  | 'analytics'
  | 'settlements'
  | 'settings';

export interface StudioBatch {
  id: string;
  name: string;
  style: string;
  instructor: string;
  room: string;
  days: string;
  time: string;
  startDate: string;
  endDate?: string;
  enrolled: number;
  capacity: number;
  fee: number;
  status: 'Upcoming' | 'Ongoing' | 'Full' | 'Completed' | 'Enrolling Now';
  attendanceRate?: number;
  batchAnnouncements?: string[];
  totalSessions?: number;
}

export interface StudioStudent {
  id: string;
  name: string;
  email: string;
  phone: string;
  danceOneId: string;
  accountStatus?: 'Linked DanceOne Account' | 'Pending Invite' | 'Manual / Unclaimed';
  enrolledBatches?: string[];
  batchId?: string;
  batchName?: string;
  activeMembership?: string;
  membershipType?: string;
  attendanceRate?: number;
  attendanceStreak?: number;
  streakDays?: number;
  feeStatus?: string;
  status?: string;
  otherStudios?: string[];
  joinDate?: string;
  emergencyContact?: string;
  medicalNotes?: string;
  avatar?: string;
}

export interface StudioTeacher {
  id: string;
  name: string;
  avatar: string;
  danceStyles?: string[];
  styles?: string[];
  assignedBatches?: string[];
  batchesAssigned?: string[];
  schedule: string;
  attendanceRate: number;
  earningsType?: 'Fixed Per Class' | 'Commission %' | 'Monthly Retainer';
  earningsModel?: string;
  monthlyEarnings?: number;
  sessionRate?: number;
  commissionPercent?: number;
  reviewsRating?: number;
  rating?: number;
  reviewsCount: number;
  availability: 'Available' | 'In Class' | 'On Leave';
  phone: string;
  email: string;
  bio?: string;
}

export interface StudioStaff {
  id: string;
  name: string;
  role: 'Front Desk' | 'Studio Manager' | 'Sound & AV Tech' | 'Facility Ops';
  phone: string;
  shift: string;
  status: 'On Shift' | 'Off Duty' | 'Leave';
  accessLevel: 'Admin' | 'Manager' | 'Staff';
}

export interface MembershipPackage {
  id: string;
  name: string;
  price: number;
  validityDays: number;
  creditsOrAccess: string;
  popular?: boolean;
  activeSubscribers: number;
  perks: string[];
}

export interface StudioPaymentRecord {
  id: string;
  invoiceNumber: string;
  studentName: string;
  studentId?: string;
  studentPhone?: string;
  studentEmail?: string;
  amount: number;
  subtotal?: number;
  gstRate?: number;
  taxAmount?: number;
  date: string;
  dueDate?: string;
  itemDescription: string;
  paymentMethod: 'UPI' | 'Credit Card' | 'Debit Card' | 'Cash' | 'Net Banking' | string;
  status: 'Paid' | 'Pending' | 'Failed' | 'Refunded';
  notes?: string;
  studioLogoUrl?: string;
  studioName?: string;
  studioAddress?: string;
  studioGstin?: string;
  studioUpiId?: string;
}

export interface StudioReview {
  id: string;
  userName: string;
  rating: number;
  date: string;
  comment: string;
  tags: string[];
  reply?: string;
}

export interface StudioSettlement {
  id: string;
  period: string;
  grossAmount: number;
  gatewayFee: number;
  netSettled: number;
  status: 'Settled' | 'Processing' | 'Upcoming';
  payoutDate: string;
  bankAccount: string;
  utrNumber?: string;
}

export interface VerificationDetails {
  status: 'verified' | 'pending' | 'unverified';
  documentType?: 'GSTIN' | 'Govt_ID' | 'Certification' | 'Commercial_Lease' | 'Showreel' | string;
  documentNumberOrLink?: string;
  businessOrEntityName?: string;
  yearsOfExperience?: string;
  specializationStyles?: string[];
  studioAddress?: string;
  contactOtpCode?: string;
  verifiedAt?: string;
  badgeTitle?: string;
  otpVerified?: boolean;
}

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

