import {
  Booking,
  DanceClass,
  DanceEvent,
  Competition,
  WeddingOffer,
  StyleIconItem,
  BannerItem,
  Instructor,
  Lead,
  Studio,
  UserProfile,
  WeddingChoreographer,
  DanceFitnessClass,
  ChallengeItem,
  InstructorGig,
  UserRole,
  StudioBatch,
  StudioStudent,
  StudioTeacher,
  StudioStaff,
  MembershipPackage,
  StudioPaymentRecord,
  StudioReview,
  StudioSettlement,
} from '../types';

export const INITIAL_USER: UserProfile = {
  name: 'New Dancer',
  location: '',
  email: '',
  avatar:
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
  danceStreakDays: 0,
  weeklyGoalCompleted: 0,
  weeklyGoalTotal: 3,
  savedFavorites: [],
  role: 'dancer',
  isVerified: false,
};

// 1. RUNNING FEATURED BANNERS (Curated highlights)
export const RUNNING_FEATURED_BANNERS: BannerItem[] = [
  {
    id: 'banner-odisha-1',
    title: 'Top Dance Studios & Academies',
    subtitle: 'From authentic Odissi academies to premier urban street & sangeet studios',
    category: 'PREMIER STUDIOS',
    image: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=1200&auto=format&fit=crop&q=80',
    actionText: 'Explore Studios',
    actionUrl: 'studios',
    tag: 'Featured Studios',
    gradient: 'from-purple-900/90 via-black/80 to-transparent',
    borderColor: 'border-purple-500/30',
  },
  {
    id: 'banner-odisha-2',
    title: 'Odissi Abhinaya & Tala Masterclasses',
    subtitle: 'Learn under legendary exponents at Orissa Dance Academy & Gunjan Dance Academy',
    category: 'CLASSICAL MASTERY',
    image: 'https://images.unsplash.com/photo-1518834107812-67b0b7c58434?w=1200&auto=format&fit=crop&q=80',
    actionText: 'Reserve Slot',
    actionUrl: 'events',
    tag: 'Cultural Heritage',
    gradient: 'from-amber-900/90 via-black/80 to-transparent',
    borderColor: 'border-amber-500/30',
  },
  {
    id: 'banner-odisha-3',
    title: 'All-Style Street Cypher 2026',
    subtitle: '1v1 Hip-Hop, Popping & Breaking battles with cash awards & live jury',
    category: 'TOURNAMENTS',
    image: 'https://images.unsplash.com/photo-1535525153412-5a42439a210d?w=1200&auto=format&fit=crop&q=80',
    actionText: 'View Battles',
    actionUrl: 'challenges',
    tag: 'Live Cyphers',
    gradient: 'from-amber-900/90 via-black/80 to-transparent',
    borderColor: 'border-amber-500/30',
  },
];

// 2. NEAREST STUDIOS (Authentic Bhubaneswar & Cuttack Studios Data)
export const NEAREST_STUDIOS_DATA: Studio[] = [
  // --- BHUBANESWAR STUDIOS ---
  {
    id: 'studio-bbsr-1',
    name: "Shibani's Yes! You Can Dance!",
    rating: 4.9,
    reviewCount: 186,
    neighborhood: 'Patia',
    city: 'Bhubaneswar',
    address: 'Plot 122/A, Near KIIT Square, Patia, Bhubaneswar',
    distance: '1.2 km',
    priceRange: '₹1,800 - ₹3,500 / mo',
    styles: ['Contemporary', 'Bollywood', 'Hip-Hop', 'Zumba'],
    about: "One of Bhubaneswar's most beloved dance hubs. Certified instructors, high-energy cardio dance, wedding sangeet preparation, and progressive choreography batches.",
    heroImage: 'https://images.unsplash.com/photo-1518834107812-67b0b7c58434?w=800&auto=format&fit=crop&q=80',
    amenities: [
      { id: 'am-1', name: 'Sprung Hardwood Floors', icon: 'Sparkles' },
      { id: 'am-2', name: 'Full Wall Mirrors', icon: 'Check' },
      { id: 'am-3', name: 'Acoustic Sound System', icon: 'Music' },
      { id: 'am-4', name: 'Air Conditioned', icon: 'ShieldCheck' },
    ],
    instructors: [
      { id: 'inst-1', name: 'Shibani Patnaik', role: 'Founder & Lead Choreographer', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200', rating: 4.9, classesCount: 14 },
      { id: 'inst-2', name: 'Ritesh Das', role: 'Hip-Hop & Urban Instructor', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200', rating: 4.8, classesCount: 9 },
    ],
    schedule: [],
  },
  {
    id: 'studio-bbsr-2',
    name: 'Orissa Dance Academy (ODA)',
    rating: 5.0,
    reviewCount: 310,
    neighborhood: 'Baramunda / Khandagiri',
    city: 'Bhubaneswar',
    address: 'Near Baramunda ISBT, Khandagiri Road, Bhubaneswar',
    distance: '3.5 km',
    priceRange: '₹1,500 - ₹4,000 / mo',
    styles: ['Odissi', 'Semi-Classical', 'Contemporary Fusion'],
    about: 'Premier global institution for authentic Guru Kelucharan Mohapatra style Odissi classical training, disciple research, and stage performance diplomas.',
    heroImage: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=800&auto=format&fit=crop&q=80',
    amenities: [
      { id: 'am-1', name: 'Teak Wooden Dance Hall', icon: 'Sparkles' },
      { id: 'am-2', name: 'Ghungroo Practice Mats', icon: 'Check' },
      { id: 'am-3', name: 'Live Pakhawaj Rig', icon: 'Music' },
    ],
    instructors: [
      { id: 'inst-3', name: 'Guru Aruna Mohanty', role: 'Artistic Director', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200', rating: 5.0, classesCount: 20 },
    ],
    schedule: [],
  },
  {
    id: 'studio-bbsr-3',
    name: 'Inner Beat Dance Studio',
    rating: 4.8,
    reviewCount: 142,
    neighborhood: 'Chandrasekharpur',
    city: 'Bhubaneswar',
    address: '2nd Floor, Near Damana Square, CSPur, Bhubaneswar',
    distance: '2.0 km',
    priceRange: '₹2,000 - ₹3,200 / mo',
    styles: ['Hip-Hop', 'Popping', 'Locking', 'Breaking'],
    about: 'The street dance heart of Bhubaneswar. Hosts official state cyphers, battle workshops, and intense freestyle foundation sessions.',
    heroImage: 'https://images.unsplash.com/photo-1535525153412-5a42439a210d?w=800&auto=format&fit=crop&q=80',
    amenities: [
      { id: 'am-1', name: 'Shock-Absorbing Vinyl', icon: 'Sparkles' },
      { id: 'am-2', name: 'Cypher Circle Area', icon: 'Check' },
      { id: 'am-3', name: 'High-Bass JBL Rig', icon: 'Music' },
    ],
    instructors: [
      { id: 'inst-4', name: 'Ansuman "B-Boy Beat" Roy', role: 'Head Street Coach', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200', rating: 4.8, classesCount: 12 },
    ],
    schedule: [],
  },
  {
    id: 'studio-bbsr-4',
    name: 'Rubato School of Music, Art & Dance',
    rating: 4.8,
    reviewCount: 98,
    neighborhood: 'Jayadev Vihar',
    city: 'Bhubaneswar',
    address: 'Near Pal Heights Mall, Jayadev Vihar, Bhubaneswar',
    distance: '2.8 km',
    priceRange: '₹2,200 - ₹4,000 / mo',
    styles: ['Contemporary', 'Bollywood', 'Kathak', 'Jazz'],
    about: 'Multi-disciplinary arts conservatory celebrated for disciplined dance syllabus, stage presentation, and certified examinations.',
    heroImage: 'https://images.unsplash.com/photo-1547153760-18fc86324498?w=800&auto=format&fit=crop&q=80',
    amenities: [
      { id: 'am-1', name: 'Acoustic Mirrored Hall', icon: 'Sparkles' },
      { id: 'am-2', name: 'Central Air Conditioning', icon: 'Check' },
      { id: 'am-3', name: 'Locker & Dressing Room', icon: 'Users' },
    ],
    instructors: [
      { id: 'inst-5', name: 'Sneha Mishra', role: 'Contemporary & Jazz Faculty', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200', rating: 4.9, classesCount: 8 },
    ],
    schedule: [],
  },
  {
    id: 'studio-bbsr-5',
    name: 'Goutam Dance Studio',
    rating: 4.7,
    reviewCount: 115,
    neighborhood: 'Nayapalli',
    city: 'Bhubaneswar',
    address: 'Behind ISKCON Temple, CRP Square, Nayapalli, Bhubaneswar',
    distance: '3.1 km',
    priceRange: '₹1,600 - ₹2,800 / mo',
    styles: ['Bollywood', 'Freestyle', 'Sangeet Choreography'],
    about: 'High energy commercial studio known across Odisha for destination wedding sangeets, Bollywood medleys, and beginner-friendly weekend classes.',
    heroImage: 'https://images.unsplash.com/photo-1516762689617-e1cffcef479d?w=800&auto=format&fit=crop&q=80',
    amenities: [
      { id: 'am-1', name: 'Full Mirror Wall', icon: 'Sparkles' },
      { id: 'am-2', name: 'Sound System', icon: 'Music' },
      { id: 'am-3', name: 'Air Conditioning', icon: 'Check' },
    ],
    instructors: [
      { id: 'inst-6', name: 'Goutam Kumar', role: 'Chief Choreographer', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200', rating: 4.8, classesCount: 15 },
    ],
    schedule: [],
  },
  {
    id: 'studio-bbsr-6',
    name: 'The S Dance Studio',
    rating: 4.9,
    reviewCount: 130,
    neighborhood: 'Patia / Infocity',
    city: 'Bhubaneswar',
    address: 'Infocity Avenue, Near DLF Cybercity, Patia, Bhubaneswar',
    distance: '1.8 km',
    priceRange: '₹2,200 - ₹3,800 / mo',
    styles: ['Heels', 'K-Pop', 'Urban Choreography', 'Zumba'],
    about: 'Trendsetting contemporary space featuring viral choreography, commercial heels styling, and K-Pop group formations.',
    heroImage: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&auto=format&fit=crop&q=80',
    amenities: [
      { id: 'am-1', name: 'RGB Dynamic Ambience', icon: 'Sparkles' },
      { id: 'am-2', name: 'Hardwood Flooring', icon: 'Check' },
      { id: 'am-3', name: 'Shower & Change Room', icon: 'Users' },
    ],
    instructors: [
      { id: 'inst-7', name: 'Swati Senapati', role: 'Heels & Commercial Lead', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200', rating: 4.9, classesCount: 11 },
    ],
    schedule: [],
  },
  {
    id: 'studio-bbsr-7',
    name: 'D-Stylo Academy of Dance',
    rating: 4.7,
    reviewCount: 89,
    neighborhood: 'Laxmisagar',
    city: 'Bhubaneswar',
    address: 'Cuttack-Puri Road, Near Jharpada Flyover, Bhubaneswar',
    distance: '4.2 km',
    priceRange: '₹1,500 - ₹2,800 / mo',
    styles: ['Hip-Hop', 'Breaking', 'Bollywood', 'House'],
    about: 'Specializes in b-boying power moves, tumbling routines, and competition choreography for junior and adult crews.',
    heroImage: 'https://images.unsplash.com/photo-1504609773096-104ff2c73ba4?w=800&auto=format&fit=crop&q=80',
    amenities: [
      { id: 'am-1', name: 'Safety Gymnastic Mats', icon: 'Sparkles' },
      { id: 'am-2', name: 'Wall-to-wall Mirrors', icon: 'Check' },
    ],
    instructors: [
      { id: 'inst-8', name: 'Deepak Stylo', role: 'Breaking Specialist', avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=200', rating: 4.7, classesCount: 7 },
    ],
    schedule: [],
  },
  {
    id: 'studio-bbsr-8',
    name: 'Feel The Dance Studio',
    rating: 4.8,
    reviewCount: 104,
    neighborhood: 'Saheed Nagar',
    city: 'Bhubaneswar',
    address: 'B-Block, Saheed Nagar, Near Maharishi College, Bhubaneswar',
    distance: '3.0 km',
    priceRange: '₹1,800 - ₹3,000 / mo',
    styles: ['Bollywood', 'Salsa', 'Bachata', 'Cardio Dance'],
    about: 'A lively dance sanctuary for adults and couples. Weekend social salsa bootcamps, morning cardio dance, and beginner-friendly sessions.',
    heroImage: 'https://images.unsplash.com/photo-1545959570-a9443652c717?w=800&auto=format&fit=crop&q=80',
    amenities: [
      { id: 'am-1', name: 'Sprung Wooden Dance Floor', icon: 'Sparkles' },
      { id: 'am-2', name: 'Surround Audio Setup', icon: 'Music' },
      { id: 'am-3', name: 'Air Conditioning', icon: 'Check' },
    ],
    instructors: [
      { id: 'inst-9', name: 'Pooja Mohanty', role: 'Latin & Bollywood Mentor', avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=200', rating: 4.8, classesCount: 10 },
    ],
    schedule: [],
  },

  // --- CUTTACK STUDIOS ---
  {
    id: 'studio-ctc-1',
    name: 'Squad of Revolution (SOR Dance & Fitness)',
    rating: 4.9,
    reviewCount: 165,
    neighborhood: 'CDA Sector 7',
    city: 'Cuttack',
    address: 'Near Windsor Palace & Reliance Office, CDA Sector 7, Cuttack',
    distance: '1.5 km',
    priceRange: '₹1,800 - ₹3,200 / mo',
    styles: ['Hip-Hop', 'Popping', 'Bollywood', 'Zumba'],
    about: "Cuttack's landmark modern dance academy. Known for air-conditioned studios, national battle representations, and comprehensive fitness routines.",
    heroImage: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=800&auto=format&fit=crop&q=80',
    amenities: [
      { id: 'am-1', name: 'Air Conditioned Rehearsal Hall', icon: 'Sparkles' },
      { id: 'am-2', name: 'Sprung Wooden Floor', icon: 'Check' },
      { id: 'am-3', name: 'Pro Audio & Bluetooth Rig', icon: 'Music' },
    ],
    instructors: [
      { id: 'inst-10', name: 'Abhilash SOR', role: 'Head Choreographer', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200', rating: 4.9, classesCount: 16 },
    ],
    schedule: [],
  },
  {
    id: 'studio-ctc-2',
    name: 'Gunjan Dance Academy',
    rating: 5.0,
    reviewCount: 220,
    neighborhood: 'Badambadi / Lunia Sahi',
    city: 'Cuttack',
    address: 'Mahtab Road, Lunia Sahi, Cuttack',
    distance: '2.1 km',
    priceRange: '₹1,600 - ₹4,500 / mo',
    styles: ['Odissi', 'Classical Abhinaya', 'Tala System'],
    about: 'Founded by prestigious Odissi exponent Guru Smt. Meera Das. A renowned international conservatory for pure Odissi Guru Kelucharan Parampara.',
    heroImage: 'https://images.unsplash.com/photo-1518834107812-67b0b7c58434?w=800&auto=format&fit=crop&q=80',
    amenities: [
      { id: 'am-1', name: 'Teakwood Rehearsal Sanctuary', icon: 'Sparkles' },
      { id: 'am-2', name: 'Acoustic Soundproofing', icon: 'Check' },
      { id: 'am-3', name: 'Classical Heritage Archive', icon: 'Music' },
    ],
    instructors: [
      { id: 'inst-11', name: 'Guru Meera Das', role: 'Founding Guru & Legend', avatar: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=200', rating: 5.0, classesCount: 25 },
    ],
    schedule: [],
  },
  {
    id: 'studio-ctc-3',
    name: 'Paradise Dance Studio',
    rating: 4.8,
    reviewCount: 112,
    neighborhood: 'CDA Sector 10',
    city: 'Cuttack',
    address: 'Near SIMS College, CDA Sector 10, Cuttack',
    distance: '2.4 km',
    priceRange: '₹1,700 - ₹3,000 / mo',
    styles: ['Hip-Hop', 'Locking', 'Popping', 'Krump'],
    about: 'Specializes in street locking, popping, and competitive choreography. The primary hub for young street dance enthusiasts in Cuttack.',
    heroImage: 'https://images.unsplash.com/photo-1535525153412-5a42439a210d?w=800&auto=format&fit=crop&q=80',
    amenities: [
      { id: 'am-1', name: 'Hardwood Flooring', icon: 'Sparkles' },
      { id: 'am-2', name: 'Wall Mirrors', icon: 'Check' },
    ],
    instructors: [
      { id: 'inst-12', name: 'Subham "Krump" Sahoo', role: 'Street Mentor', avatar: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=200', rating: 4.8, classesCount: 9 },
    ],
    schedule: [],
  },
  {
    id: 'studio-ctc-4',
    name: 'Creato Dance Academy',
    rating: 4.7,
    reviewCount: 95,
    neighborhood: 'Bidanasi',
    city: 'Cuttack',
    address: 'Near Sati Chauraha Traffic Chhak, Bidanasi, Cuttack',
    distance: '3.0 km',
    priceRange: '₹1,500 - ₹2,700 / mo',
    styles: ['Contemporary', 'Bollywood', 'Freestyle'],
    about: 'Nurturing foundation for school students, teenagers, and beginners. Emphasizes rhythm control, flexibility, and stage confidence.',
    heroImage: 'https://images.unsplash.com/photo-1516762689617-e1cffcef479d?w=800&auto=format&fit=crop&q=80',
    amenities: [
      { id: 'am-1', name: 'Mirrored Studio Hall', icon: 'Sparkles' },
      { id: 'am-2', name: 'Comfort Floor Mats', icon: 'Check' },
    ],
    instructors: [
      { id: 'inst-13', name: 'Rakesh Barik', role: 'Lead Instructor', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200', rating: 4.7, classesCount: 8 },
    ],
    schedule: [],
  },
  {
    id: 'studio-ctc-5',
    name: "Deep's Dance Studio",
    rating: 4.8,
    reviewCount: 140,
    neighborhood: 'Badambadi',
    city: 'Cuttack',
    address: 'Near Chandi Sweets, Badambadi Bus Stand Road, Cuttack',
    distance: '1.1 km',
    priceRange: '₹1,500 - ₹2,500 / mo',
    styles: ['Bollywood', 'Semi-Classical', 'Wedding Sangeet', 'Folk'],
    about: 'Serving Cuttack since 2010. Household name for high-spirited sangeet group medleys, festive performances, and hobby batches.',
    heroImage: 'https://images.unsplash.com/photo-1547153760-18fc86324498?w=800&auto=format&fit=crop&q=80',
    amenities: [
      { id: 'am-1', name: 'Wide Mirrored Rehearsal Hall', icon: 'Sparkles' },
      { id: 'am-2', name: 'Sound System & Mic', icon: 'Music' },
    ],
    instructors: [
      { id: 'inst-14', name: 'Deepak "Deep" Behera', role: 'Sangeet Choreographer', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200', rating: 4.8, classesCount: 18 },
    ],
    schedule: [],
  },
  {
    id: 'studio-ctc-6',
    name: 'Odissi Nrutya Mandal',
    rating: 4.9,
    reviewCount: 88,
    neighborhood: 'CDA Sector 8',
    city: 'Cuttack',
    address: 'Sector 8, CDA, Near Biju Patnaik Park, Cuttack',
    distance: '2.0 km',
    priceRange: '₹1,400 - ₹3,500 / mo',
    styles: ['Odissi', 'Nritya Nataka', 'Girish Abhinaya'],
    about: 'Dedicated community center celebrating traditional Odissi dance forms and guru-shishya parampara education for young girls and boys.',
    heroImage: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=800&auto=format&fit=crop&q=80',
    amenities: [
      { id: 'am-1', name: 'Natural Wooden Floor', icon: 'Sparkles' },
      { id: 'am-2', name: 'Costume Dressing Suite', icon: 'Users' },
    ],
    instructors: [
      { id: 'inst-15', name: 'Sujata Rout', role: 'Classical Acharya', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200', rating: 4.9, classesCount: 12 },
    ],
    schedule: [],
  },
  {
    id: 'studio-ctc-7',
    name: 'Kreative Quotient Dance Studio',
    rating: 4.8,
    reviewCount: 76,
    neighborhood: 'CDA Sector 9',
    city: 'Cuttack',
    address: 'Near Jugal Kishore Park, CDA Sector 9, Cuttack',
    distance: '2.5 km',
    priceRange: '₹1,800 - ₹3,000 / mo',
    styles: ['Contemporary', 'Hip-Hop', 'Aerobics', 'Jazz'],
    about: 'Boutique studio with emphasis on personal attention, correct postural alignment, and creative movement expression.',
    heroImage: 'https://images.unsplash.com/photo-1518834107812-67b0b7c58434?w=800&auto=format&fit=crop&q=80',
    amenities: [
      { id: 'am-1', name: 'Sprung Hardwood Floor', icon: 'Sparkles' },
      { id: 'am-2', name: 'Ambient Stage Lights', icon: 'Check' },
    ],
    instructors: [
      { id: 'inst-16', name: 'Kavita Nayak', role: 'Contemporary Instructor', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200', rating: 4.8, classesCount: 7 },
    ],
    schedule: [],
  },
  {
    id: 'studio-ctc-8',
    name: 'Faith Dance Group Studio',
    rating: 4.7,
    reviewCount: 82,
    neighborhood: 'Buxibazar',
    city: 'Cuttack',
    address: 'Near Axis Bank, Buxibazar Main Road, Cuttack',
    distance: '1.8 km',
    priceRange: '₹1,600 - ₹2,800 / mo',
    styles: ['Street Dance', 'Stunts & Locking', 'Bollywood', 'Cyphers'],
    about: 'Renowned for acrobatic stunts, high-energy crew syncs, stage shows, and corporate choreography across Cuttack and Bhubaneswar.',
    heroImage: 'https://images.unsplash.com/photo-1545959570-a9443652c717?w=800&auto=format&fit=crop&q=80',
    amenities: [
      { id: 'am-1', name: 'Air Conditioned Studio', icon: 'Sparkles' },
      { id: 'am-2', name: 'Full Wall Mirror', icon: 'Check' },
      { id: 'am-3', name: 'Stage Acrobatic Rig', icon: 'Music' },
    ],
    instructors: [
      { id: 'inst-17', name: 'Sagar "Faith" Jena', role: 'Crew Director', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200', rating: 4.7, classesCount: 11 },
    ],
    schedule: [],
  },
];

export const FEATURED_STUDIOS: Studio[] = NEAREST_STUDIOS_DATA;

// 3. WORKSHOPS (Curated Masterclasses in Bhubaneswar & Cuttack)
export const WORKSHOPS_DATA: DanceClass[] = [
  {
    id: 'ws-bbsr-1',
    title: 'Odissi Abhinaya & Tala Masterclass with Guru Aruna Mohanty',
    category: 'Odissi',
    instructor: 'Guru Aruna Mohanty',
    instructorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200',
    studio: 'Orissa Dance Academy (ODA)',
    location: 'Baramunda / Khandagiri',
    city: 'Bhubaneswar',
    dayTime: 'Sat & Sun • 10:00 AM - 01:00 PM',
    date: 'Oct 14 - 15, 2026',
    time: '10:00 AM',
    price: 1200,
    currency: '₹',
    image: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=800&auto=format&fit=crop&q=80',
    level: 'Intermediate / Advanced',
    spotsLeft: 8,
  },
  {
    id: 'ws-ctc-1',
    title: 'Urban Popping & Locking Drills Intensive',
    category: 'Hip-Hop',
    instructor: 'Abhilash SOR',
    instructorAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200',
    studio: 'Squad of Revolution (SOR)',
    location: 'CDA Sector 7',
    city: 'Cuttack',
    dayTime: 'Sunday Intensive • 04:00 PM - 07:00 PM',
    date: 'Oct 18, 2026',
    time: '04:00 PM',
    price: 650,
    currency: '₹',
    image: 'https://images.unsplash.com/photo-1535525153412-5a42439a210d?w=800&auto=format&fit=crop&q=80',
    level: 'All Levels',
    spotsLeft: 12,
  },
  {
    id: 'ws-bbsr-2',
    title: 'Contemporary Floorwork & Release Technique',
    category: 'Contemporary',
    instructor: 'Shibani Patnaik',
    instructorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200',
    studio: "Shibani's Yes! You Can Dance!",
    location: 'Patia',
    city: 'Bhubaneswar',
    dayTime: 'Friday Special • 06:30 PM - 08:30 PM',
    date: 'Oct 20, 2026',
    time: '06:30 PM',
    price: 750,
    currency: '₹',
    image: 'https://images.unsplash.com/photo-1518834107812-67b0b7c58434?w=800&auto=format&fit=crop&q=80',
    level: 'Beginner / Intermediate',
    spotsLeft: 10,
  },
  {
    id: 'ws-ctc-2',
    title: 'Sangeet Wedding Couple & Family Medley Bootcamp',
    category: 'Bollywood',
    instructor: 'Deepak "Deep" Behera',
    instructorAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200',
    studio: "Deep's Dance Studio",
    location: 'Badambadi',
    city: 'Cuttack',
    dayTime: 'Weekend Batch • 05:00 PM - 07:30 PM',
    date: 'Oct 21 - 22, 2026',
    time: '05:00 PM',
    price: 999,
    currency: '₹',
    image: 'https://images.unsplash.com/photo-1547153760-18fc86324498?w=800&auto=format&fit=crop&q=80',
    level: 'All Levels',
    spotsLeft: 6,
  },
];

// 4. WEDDING CHOREOGRAPHY OFFERS
export const WEDDING_OFFERS_DATA: WeddingOffer[] = [
  {
    id: 'wo-1',
    title: 'Sangeet Couple Dream Choreo (3 Songs)',
    subtitle: 'Bespoke romantic entry, slow-motion lifts & song edit',
    instructorName: 'Deepak "Deep" Behera',
    offerPrice: 12500,
    originalPrice: 16000,
    currency: '₹',
    image: 'https://images.unsplash.com/photo-1547153760-18fc86324498?w=600',
    badge: 'Trending',
  },
  {
    id: 'wo-2',
    title: 'Bridal Squad Flashmob & Medley',
    subtitle: '5 sessions + high-resolution video practice links',
    instructorName: 'Shibani Patnaik',
    offerPrice: 14000,
    originalPrice: 18500,
    currency: '₹',
    image: 'https://images.unsplash.com/photo-1518834107812-67b0b7c58434?w=600',
    badge: 'Popular Choice',
  },
];

// 5. REGULAR CLASSES (Daily Batches in Bhubaneswar & Cuttack)
export const REGULAR_CLASSES_DATA: DanceClass[] = [
  {
    id: 'rc-bbsr-1',
    title: 'Bollywood & Freestyle Weekend Batch',
    category: 'Bollywood',
    instructor: 'Goutam Kumar',
    studio: 'Goutam Dance Studio',
    location: 'Nayapalli, CRP Square',
    city: 'Bhubaneswar',
    dayTime: 'Sat & Sun • 06:00 PM - 07:30 PM',
    date: 'Weekly',
    time: '06:00 PM',
    price: 400,
    currency: '₹',
    image: 'https://images.unsplash.com/photo-1516762689617-e1cffcef479d?w=800',
    level: 'Beginner',
    spotsLeft: 14,
  },
  {
    id: 'rc-ctc-1',
    title: 'Urban Hip-Hop & Grooves Foundation',
    category: 'Hip-Hop',
    instructor: 'Abhilash SOR',
    studio: 'Squad of Revolution (SOR)',
    location: 'CDA Sector 7',
    city: 'Cuttack',
    dayTime: 'Tue & Thu • 06:30 PM - 08:00 PM',
    date: 'Weekly',
    time: '06:30 PM',
    price: 450,
    currency: '₹',
    image: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=800',
    level: 'Beginner',
    spotsLeft: 12,
  },
  {
    id: 'rc-bbsr-2',
    title: 'Authentic Classical Odissi Foundations',
    category: 'Odissi',
    instructor: 'Guru Aruna Mohanty',
    studio: 'Orissa Dance Academy (ODA)',
    location: 'Baramunda / Khandagiri',
    city: 'Bhubaneswar',
    dayTime: 'Mon, Wed, Fri • 07:00 AM - 08:30 AM',
    date: 'Weekly',
    time: '07:00 AM',
    price: 500,
    currency: '₹',
    image: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=800',
    level: 'All Levels',
    spotsLeft: 15,
  },
  {
    id: 'rc-ctc-2',
    title: 'Street Popping, Waving & Cypher Lab',
    category: 'Hip-Hop',
    instructor: 'Subham "Krump" Sahoo',
    studio: 'Paradise Dance Studio',
    location: 'CDA Sector 10',
    city: 'Cuttack',
    dayTime: 'Wed & Fri • 05:30 PM - 07:00 PM',
    date: 'Weekly',
    time: '05:30 PM',
    price: 400,
    currency: '₹',
    image: 'https://images.unsplash.com/photo-1535525153412-5a42439a210d?w=800',
    level: 'Intermediate',
    spotsLeft: 8,
  },
];

// 6. DANCE STYLES & DISCIPLINES (Taxonomy catalog for search & filters)
export const DANCE_STYLE_ICONS_DATA: StyleIconItem[] = [
  {
    id: 'style-1',
    name: 'Contemporary',
    iconName: 'Sparkles',
    count: '0 Batches',
    image:
      'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=600&auto=format&fit=crop&q=80',
    accentColor: 'from-purple-500 to-indigo-600',
  },
  {
    id: 'style-2',
    name: 'Bollywood',
    iconName: 'Flame',
    count: '0 Batches',
    image:
      'https://images.unsplash.com/photo-1547153760-18fc86324498?w=600&auto=format&fit=crop&q=80',
    accentColor: 'from-pink-500 to-rose-600',
  },
  {
    id: 'style-3',
    name: 'Hip-Hop',
    iconName: 'Zap',
    count: '0 Batches',
    image:
      'https://images.unsplash.com/photo-1535525153412-5a42439a210d?w=600&auto=format&fit=crop&q=80',
    accentColor: 'from-amber-500 to-orange-600',
  },
  {
    id: 'style-4',
    name: 'Kathak',
    iconName: 'Heart',
    count: '0 Batches',
    image:
      'https://images.unsplash.com/photo-1518834107812-67b0b7c58434?w=600&auto=format&fit=crop&q=80',
    accentColor: 'from-red-600 to-purple-700',
  },
  {
    id: 'style-5',
    name: 'Ballet',
    iconName: 'Feather',
    count: '0 Batches',
    image:
      'https://images.unsplash.com/photo-1516762689617-e1cffcef479d?w=600&auto=format&fit=crop&q=80',
    accentColor: 'from-sky-500 to-indigo-600',
  },
  {
    id: 'style-6',
    name: 'Salsa & Bachata',
    iconName: 'Flame',
    count: '0 Batches',
    image:
      'https://images.unsplash.com/photo-1504609773096-104ff2c73ba4?w=600&auto=format&fit=crop&q=80',
    accentColor: 'from-emerald-500 to-teal-700',
  },
  {
    id: 'style-7',
    name: 'Afrobeat & Amapiano',
    iconName: 'Music',
    count: '0 Batches',
    image:
      'https://images.unsplash.com/photo-1545959570-a9443652c717?w=600&auto=format&fit=crop&q=80',
    accentColor: 'from-yellow-500 to-amber-600',
  },
  {
    id: 'style-8',
    name: 'Heels & Commercial',
    iconName: 'Crown',
    count: '0 Batches',
    image:
      'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&auto=format&fit=crop&q=80',
    accentColor: 'from-fuchsia-600 to-pink-600',
  },
];

// 7. EVENTS (Empty from scratch)
export const EVENTS_DATA: DanceEvent[] = [];

// 8. COMPETITIONS (Empty from scratch)
export const COMPETITIONS_DATA: Competition[] = [];

// 9. CHOREOGRAPHERS (Empty from scratch)
export const CHOREOGRAPHERS_DATA: WeddingChoreographer[] = [];

// Style Filters
export const DANCE_CATEGORIES = [
  { id: 'all', name: 'All' },
  { id: 'for-you', name: 'For You' },
  { id: 'contemporary', name: 'Contemporary' },
  { id: 'bollywood', name: 'Bollywood' },
  { id: 'hip-hop', name: 'Hip-Hop' },
  { id: 'kathak', name: 'Kathak' },
  { id: 'ballet', name: 'Ballet' },
  { id: 'salsa', name: 'Salsa' },
  { id: 'bachata', name: 'Bachata' },
  { id: 'afrobeat', name: 'Afrobeat' },
  { id: 'heels', name: 'Heels' },
];

export const UPCOMING_FEATURED_CLASS: DanceClass = {
  id: 'featured-init',
  title: 'No Upcoming Class',
  category: 'Contemporary',
  instructor: 'Faculty Pending',
  studio: 'Studio Pending',
  location: '',
  city: '',
  dayTime: '',
  date: '',
  time: '',
  price: 0,
  currency: '₹',
  image: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=800&auto=format&fit=crop&q=80',
  level: 'All Levels',
  spotsLeft: 0,
};

export const ALL_CLASSES: DanceClass[] = [...WORKSHOPS_DATA, ...REGULAR_CLASSES_DATA];
export const TRENDING_CLASSES: DanceClass[] = REGULAR_CLASSES_DATA.slice(0, 4);
export const WORKSHOP_CLASSES: DanceClass[] = WORKSHOPS_DATA;

export const WEDDING_CHOREOGRAPHERS: WeddingChoreographer[] = [
  {
    id: 'wc-1',
    name: 'Goutam Kumar',
    title: 'Lead Sangeet Director & Bollywood Choreographer',
    rating: 4.8,
    reviewCount: 96,
    experience: '10+ Years',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1516762689617-e1cffcef479d?w=800&auto=format&fit=crop&q=80',
    city: 'Bhubaneswar',
    neighborhood: 'Nayapalli / CRP Square',
    startingPrice: '₹15,000 / event',
    specialties: ['Bollywood Medley', 'Couple First Dance', 'Family Group Mashups', 'Prop Coordination'],
    weddingsDone: 180,
    bio: 'Renowned wedding choreographer across Bhubaneswar and Cuttack. Directs high-octane bridal entries, flashmobs, and couple routines.',
    featuredRoutine: 'Couple Romantic Waltz + Lyrical Odia/Bollywood Fusion',
  },
  {
    id: 'wc-2',
    name: 'Deep Mohanty',
    title: 'Grand Sangeet & Concept Choreographer',
    rating: 4.9,
    reviewCount: 112,
    experience: '8+ Years',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&auto=format&fit=crop&q=80',
    city: 'Cuttack',
    neighborhood: 'Badambadi / College Square',
    startingPrice: '₹12,000 / event',
    specialties: ['Grand Entrances', 'Retro Medley', 'Theme Sangeet', 'Couple Romance'],
    weddingsDone: 140,
    bio: 'Specialist in family sangeet choreography with custom rehearsal videos for out-of-town guests and elderly relatives.',
    featuredRoutine: 'Grand Rajasthani-Bollywood Royal Bridal Entry',
  },
  {
    id: 'wc-3',
    name: 'Swati Senapati',
    title: 'Contemporary & Semi-Classical Bridal Specialist',
    rating: 4.9,
    reviewCount: 78,
    experience: '7+ Years',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&auto=format&fit=crop&q=80',
    city: 'Bhubaneswar',
    neighborhood: 'Patia / KIIT Square',
    startingPrice: '₹18,000 / event',
    specialties: ['Bridal Solo', 'Semi-Classical Fusion', 'Graceful Couple Waltzes'],
    weddingsDone: 95,
    bio: 'Specializes in graceful bride solos and viral wedding reels with exquisite expressions and seamless transitions.',
    featuredRoutine: 'Lyrical Semi-Classical Bridal Reveal',
  },
  {
    id: 'wc-4',
    name: 'Abhilash Panda (SOR)',
    title: 'Flashmob & High Energy Crew Sangeet Director',
    rating: 4.9,
    reviewCount: 135,
    experience: '9+ Years',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=800&auto=format&fit=crop&q=80',
    city: 'Cuttack',
    neighborhood: 'CDA Sector 7',
    startingPrice: '₹20,000 / event',
    specialties: ['Groom Gang Cypher', 'Party Mashup', 'Flashmob Surprise', 'LED Stage Coordination'],
    weddingsDone: 160,
    bio: 'Founder of Squad of Revolution (SOR). Creates showstopper groom crew battles and synchronized flashmobs for destination weddings.',
    featuredRoutine: 'Dynamic Groom Crew Dance Battle',
  },
];

export const FLOW_STUDIO_DATA: Studio = FEATURED_STUDIOS[0];

export const MAP_STUDIOS: {
  id: string;
  name: string;
  lat: number;
  lng: number;
  address: string;
  rating: number;
  priceRange: string;
  tags: string[];
  image: string;
}[] = [
  {
    id: 'studio-bbsr-1',
    name: "Shibani's Yes! You Can Dance!",
    lat: 20.3552,
    lng: 85.8184,
    address: 'Plot No. 422, Near Silicon Hills, KIIT Road, Patia, Bhubaneswar',
    rating: 4.9,
    priceRange: '₹2,000 - ₹3,500 / mo',
    tags: ['Contemporary', 'Bollywood', 'Zumba'],
    image: 'https://images.unsplash.com/photo-1518834107812-67b0b7c58434?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'studio-bbsr-2',
    name: 'Orissa Dance Academy (ODA)',
    lat: 20.2582,
    lng: 85.7871,
    address: 'Qrs No 4R-7, Unit-8 & Baramunda / Khandagiri Cultural Complex, Bhubaneswar',
    rating: 5.0,
    priceRange: '₹1,500 - ₹4,000 / mo',
    tags: ['Odissi', 'Chhau', 'Classical'],
    image: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'studio-bbsr-3',
    name: 'Inner Beat Dance Studio',
    lat: 20.3248,
    lng: 85.8182,
    address: 'District Center, Above SBI, Chandrasekharpur, Bhubaneswar',
    rating: 4.8,
    priceRange: '₹1,800 - ₹3,000 / mo',
    tags: ['Hip-Hop', 'Urban', 'Zumba'],
    image: 'https://images.unsplash.com/photo-1547153760-18fc86324498?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'studio-bbsr-4',
    name: 'Rubato School of Music & Dance',
    lat: 20.3015,
    lng: 85.8202,
    address: 'Near Mayfair Lagoon, Jayadev Vihar, Bhubaneswar',
    rating: 4.9,
    priceRange: '₹2,500 - ₹4,500 / mo',
    tags: ['Contemporary', 'Ballet', 'Jazz'],
    image: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'studio-bbsr-5',
    name: 'Goutam Dance Studio',
    lat: 20.2985,
    lng: 85.8105,
    address: 'Behind ISKCON Temple, CRP Square, Nayapalli, Bhubaneswar',
    rating: 4.7,
    priceRange: '₹1,600 - ₹2,800 / mo',
    tags: ['Bollywood', 'Freestyle', 'Sangeet'],
    image: 'https://images.unsplash.com/photo-1516762689617-e1cffcef479d?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'studio-bbsr-6',
    name: 'The S Dance Studio',
    lat: 20.3580,
    lng: 85.8195,
    address: 'Infocity Avenue, Near DLF Cybercity, Patia, Bhubaneswar',
    rating: 4.9,
    priceRange: '₹2,200 - ₹3,800 / mo',
    tags: ['Heels', 'K-Pop', 'Urban Choreography'],
    image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'studio-bbsr-7',
    name: 'D-Stylo Academy of Dance',
    lat: 20.2785,
    lng: 85.8550,
    address: 'Cuttack-Puri Road, Near Jharpada Flyover, Laxmisagar, Bhubaneswar',
    rating: 4.7,
    priceRange: '₹1,500 - ₹2,800 / mo',
    tags: ['Breaking', 'Hip-Hop', 'House'],
    image: 'https://images.unsplash.com/photo-1504609773096-104ff2c73ba4?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'studio-bbsr-8',
    name: 'Feel The Dance Studio',
    lat: 20.2915,
    lng: 85.8452,
    address: 'B-Block, Saheed Nagar, Near Maharishi College, Bhubaneswar',
    rating: 4.8,
    priceRange: '₹1,800 - ₹3,000 / mo',
    tags: ['Salsa', 'Bachata', 'Bollywood'],
    image: 'https://images.unsplash.com/photo-1545959570-a9443652c717?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'studio-ctc-1',
    name: 'Squad of Revolution (SOR Dance & Fitness)',
    lat: 20.4782,
    lng: 85.8362,
    address: 'Near Windsor Palace, CDA Sector 7, Cuttack',
    rating: 4.9,
    priceRange: '₹1,800 - ₹3,200 / mo',
    tags: ['Hip-Hop', 'Popping', 'Bollywood'],
    image: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'studio-ctc-2',
    name: 'Gunjan Dance Academy',
    lat: 20.4485,
    lng: 85.8752,
    address: 'Lunia Sahi, Badambadi, Cuttack',
    rating: 5.0,
    priceRange: '₹1,400 - ₹3,000 / mo',
    tags: ['Odissi', 'Folk', 'Classical'],
    image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'studio-ctc-3',
    name: 'Paradise Dance & Fitness Studio',
    lat: 20.4820,
    lng: 85.8305,
    address: 'CDA Sector 10 Market Complex, Cuttack',
    rating: 4.8,
    priceRange: '₹1,600 - ₹2,800 / mo',
    tags: ['Zumba', 'Bollywood', 'Aerobics'],
    image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'studio-ctc-4',
    name: 'Creato Dance Academy',
    lat: 20.4725,
    lng: 85.8420,
    address: 'Bidanasi Main Road, Near High Court Enclave, Cuttack',
    rating: 4.7,
    priceRange: '₹1,500 - ₹2,600 / mo',
    tags: ['Hip-Hop', 'Contemporary', 'Freestyle'],
    image: 'https://images.unsplash.com/photo-1535525153412-5a42439a210d?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'studio-ctc-5',
    name: "Deep's Dance Studio",
    lat: 20.4501,
    lng: 85.8740,
    address: 'Opposite State Bank, Badambadi, Cuttack',
    rating: 4.8,
    priceRange: '₹1,500 - ₹2,700 / mo',
    tags: ['Bollywood', 'Sangeet', 'Wedding Dance'],
    image: 'https://images.unsplash.com/photo-1547153760-18fc86324498?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'studio-ctc-6',
    name: 'Odissi Nrutya Mandal',
    lat: 20.4800,
    lng: 85.8340,
    address: 'Sector 8 Biju Patnaik Chowk, CDA, Cuttack',
    rating: 4.9,
    priceRange: '₹1,200 - ₹2,500 / mo',
    tags: ['Odissi', 'Abhinaya', 'Classical'],
    image: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'studio-ctc-7',
    name: 'Kreative Quotient Dance Studio',
    lat: 20.4812,
    lng: 85.8325,
    address: 'Sector 9, Near St. Xavier High School, CDA, Cuttack',
    rating: 4.7,
    priceRange: '₹1,600 - ₹2,900 / mo',
    tags: ['Jazz', 'Contemporary', 'Hip-Hop'],
    image: 'https://images.unsplash.com/photo-1518834107812-67b0b7c58434?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'studio-ctc-8',
    name: 'Faith Dance Group Studio',
    lat: 20.4632,
    lng: 85.8790,
    address: 'Near Gouri Shankar Park, Buxibazar, Cuttack',
    rating: 4.8,
    priceRange: '₹1,500 - ₹2,600 / mo',
    tags: ['Krump', 'Urban Choreo', 'Breaking'],
    image: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=600&auto=format&fit=crop&q=80',
  },
];

export const INITIAL_BOOKINGS: Booking[] = [];
export const INITIAL_LEADS: Lead[] = [];

export const RIYA_SHARMA_INSTRUCTOR: Instructor = {
  id: 'inst-1',
  name: 'Shibani Patnaik',
  title: 'Founder & Principal Contemporary Faculty',
  specialty: 'Contemporary & Urban Fusion',
  specialties: ['Contemporary', 'Floorwork', 'Urban Fusion', 'Ballet Basics'],
  rating: 4.9,
  reviewCount: 142,
  experience: '12+ Years Professional Experience',
  experienceYears: 12,
  studentsTaught: 3500,
  studentsCount: 3500,
  classesCount: 18,
  avatar:
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&auto=format&fit=crop&q=80',
  coverImage:
    'https://images.unsplash.com/photo-1518834107812-67b0b7c58434?w=800&auto=format&fit=crop&q=80',
  heroImage:
    'https://images.unsplash.com/photo-1518834107812-67b0b7c58434?w=800&auto=format&fit=crop&q=80',
  bio: "Lead choreographer and artistic director at Shibani's Yes! You Can Dance! in Patia, Bhubaneswar. Dedicated to contemporary movement, theatrical choreography, and dancer growth.",
  privateSessionRate: 2500,
  upcomingClasses: [WORKSHOPS_DATA[2], REGULAR_CLASSES_DATA[0]],
};

export const CONTEMPORARY_SEARCH_RESULTS: DanceClass[] = ALL_CLASSES.filter(
  (c) => c.category === 'Contemporary' || c.category === 'Classical' || c.category === 'Hip-Hop'
);

export const WEDDING_SERVICES = [
  {
    id: 'ws-1',
    title: 'Couple First Dance & Bridal Solo',
    startingRate: 'Custom Quote',
    description: 'Custom waltz, lyrical Bollywood, or romantic contemporary routine designed for ease and stage impact.',
  },
  {
    id: 'ws-2',
    title: 'Family & Friends Sangeet Medley',
    startingRate: 'Custom Quote',
    description: 'Energetic multi-track mashup with step-by-step video breakdown tutorials for all family members.',
  },
  {
    id: 'ws-3',
    title: 'Full Sangeet Direction & Troupe',
    startingRate: 'Custom Quote',
    description: 'Complete stage direction, background dancers, professional audio mixing, and stage light rehearsals.',
  },
];

export const REAL_WEDDING_GALLERY: {
  id: string;
  coupleName: string;
  routineType: string;
  songTitle: string;
  thumbnail: string;
  videoUrl: string;
}[] = [];

export const WEDDING_TESTIMONIALS: {
  id: string;
  couple: string;
  city: string;
  quote: string;
}[] = [];

export const DANCE_FITNESS_CLASSES_DATA: DanceFitnessClass[] = [];
export const CHALLENGES_DATA: ChallengeItem[] = [];
export const INSTRUCTOR_GIGS_DATA: InstructorGig[] = [];

// Role presets for initialization
export const ROLE_USER_PRESETS: Record<UserRole, UserProfile> = {
  dancer: {
    name: 'Dancer User',
    location: 'Bhubaneswar, Odisha',
    email: 'dancer@danceone.io',
    avatar:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
    danceStreakDays: 7,
    weeklyGoalCompleted: 2,
    weeklyGoalTotal: 3,
    savedFavorites: ['ws-bbsr-1', 'studio-bbsr-1'],
    role: 'dancer',
    isVerified: true,
  },
  instructor: {
    name: 'Abhilash Panda',
    location: 'CDA Sector 7, Cuttack',
    email: 'choreographer@danceone.io',
    avatar:
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&auto=format&fit=crop&q=80',
    danceStreakDays: 14,
    weeklyGoalCompleted: 5,
    weeklyGoalTotal: 5,
    savedFavorites: [],
    role: 'instructor',
    isVerified: false,
    instructorTitle: 'Head Choreographer, SOR Academy',
    verificationBadge: 'Verified Choreographer & Faculty',
  },
  studio: {
    name: "Shibani's Yes! You Can Dance!",
    location: 'Patia, Bhubaneswar',
    email: 'studio@danceone.io',
    avatar:
      'https://images.unsplash.com/photo-1518834107812-67b0b7c58434?w=300&auto=format&fit=crop&q=80',
    danceStreakDays: 0,
    weeklyGoalCompleted: 0,
    weeklyGoalTotal: 0,
    savedFavorites: [],
    role: 'studio',
    isVerified: false,
    studioName: "Shibani's Yes! You Can Dance!",
    verificationBadge: 'Verified Dance Studio Partner',
  },
  organizer: {
    name: 'Odisha Dance Battles',
    location: 'Bhubaneswar & Cuttack',
    email: 'organizer@danceone.io',
    avatar:
      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80',
    danceStreakDays: 0,
    weeklyGoalCompleted: 0,
    weeklyGoalTotal: 0,
    savedFavorites: [],
    role: 'organizer',
    isVerified: false,
    organizationName: 'Odisha Dance Cypher & Battle Guild',
    verificationBadge: 'Verified Event Organizer',
  },
  admin: {
    name: 'Dance One Admin',
    location: 'Bhubaneswar & Cuttack Platform HQ',
    email: 'admin@danceone.io',
    avatar:
      'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=300&auto=format&fit=crop&q=80',
    danceStreakDays: 30,
    weeklyGoalCompleted: 5,
    weeklyGoalTotal: 5,
    savedFavorites: [],
    role: 'admin',
    isVerified: true,
  },
};

// Studio ERP Empty Datasets (Clean start)
export const STUDIO_BATCHES_DATA: StudioBatch[] = [];
export const STUDIO_STUDENTS_DATA: StudioStudent[] = [];
export const STUDIO_TEACHERS_DATA: StudioTeacher[] = [];
export const STUDIO_STAFF_DATA: StudioStaff[] = [];
export const STUDIO_MEMBERSHIPS_DATA: MembershipPackage[] = [];
export const STUDIO_PAYMENTS_DATA: StudioPaymentRecord[] = [];
export const STUDIO_REVIEWS_DATA: StudioReview[] = [];
export const STUDIO_SETTLEMENTS_DATA: StudioSettlement[] = [];
export const STUDIO_MARKETING_DATA: {
  id: string;
  title: string;
  type: string;
  reach: string;
  conversions: number;
  couponCode: string;
  status: string;
}[] = [];
