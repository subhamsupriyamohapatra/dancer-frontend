export type EventType =
  | 'workshop'
  | 'competition'
  | 'dance_show'
  | 'show'
  | 'dance_battle'
  | 'battle'
  | 'masterclass'
  | 'dance_camp'
  | 'festival'
  | 'audition'
  | 'showcase'
  | 'social'
  | 'jam'
  | 'other';

export type EventStatus =
  | 'draft'
  | 'published'
  | 'registration_open'
  | 'live'
  | 'completed'
  | 'archived';

export type EventLifecycleStatus = EventStatus;

export type ScorePublishPolicy =
  | 'private'
  | 'visible_after_event'
  | 'published_live'
  | 'published_manually'
  | 'auto_after_finalization';

export type DancerResultPublishPrivacy =
  | 'private'
  | 'organizer_only'
  | 'published_to_dancer'
  | 'public';

export type StaffRole =
  | 'owner'
  | 'organizer'
  | 'event_owner'
  | 'co_organizer'
  | 'event_director'
  | 'event_manager'
  | 'head_judge'
  | 'judge'
  | 'battle_mc'
  | 'mc'
  | 'dj'
  | 'stage_manager'
  | 'registration_staff'
  | 'finance_manager'
  | 'finance'
  | 'media_crew'
  | 'security_lead'
  | 'volunteer'
  | 'photographer'
  | 'videographer';

export type OrganizerStaffRole = StaffRole;

export type BattleFormat = '1v1' | '2v2' | 'crew_vs_crew' | '7_to_smoke' | 'cypher_qualifier';

export interface ScoringCriterion {
  id: string;
  name: string;
  weight: number; // e.g. 30 for 30%
  maxScore: number; // e.g. 10
  description?: string;
}

export interface ScoreEntry {
  judgeId: string;
  judgeName: string;
  criteriaScores: { [criterionId: string]: number };
  totalScore: number;
  notes?: string;
  isFinalized: boolean;
  submittedAt: string;
}

export type JudgeScoreRecord = ScoreEntry;

export interface ScoreAuditLog {
  id: string;
  participantId: string;
  participantName: string;
  judgeId: string;
  judgeName: string;
  action: 'score_submitted' | 'score_modified' | 'score_finalized' | 'score_overridden';
  previousScore?: number;
  newScore: number;
  timestamp: string;
  reason?: string;
  modifiedBy: string;
}

export interface CompetitionParticipant {
  id: string;
  bibNumber: number;
  name: string;
  crewOrStudio?: string;
  danceOneId: string;
  category: string;
  ageGroup: string;
  format: 'Solo' | 'Duo' | 'Group' | 'Crew';
  performanceOrder: number;
  heat: string;
  round: string;
  checkedIn: boolean;
  checkInTime?: string;
  musicFile?: string;
  musicStatus: 'Uploaded' | 'Pending' | 'Verified';
  scores: ScoreEntry[];
  weightedTotal: number;
  rank?: number;
  privacy: DancerResultPublishPrivacy;
  certificateIssued: boolean;
  notes?: string;
}

export interface BattleMatchup {
  id: string;
  roundName: 'Round of 16' | 'Quarter-Final' | 'Semi-Final' | 'Final' | 'Pre-Selection';
  matchNumber: number;
  dancer1: {
    id: string;
    name: string;
    bib: number;
    danceOneId: string;
    crew?: string;
    avatar: string;
    votes: number;
  };
  dancer2: {
    id: string;
    name: string;
    bib: number;
    danceOneId: string;
    crew?: string;
    avatar: string;
    votes: number;
  };
  status: 'upcoming' | 'live' | 'completed';
  winnerId?: string;
  judgeVotes: {
    judgeId: string;
    judgeName: string;
    votedForDancerId: string; // dancer1.id or dancer2.id or 'tie'
    round1Score?: { d1: number; d2: number };
    round2Score?: { d1: number; d2: number };
  }[];
  audienceVotingEnabled?: boolean;
  audienceVotes?: { d1: number; d2: number };
  musicTrackTitle?: string;
  currentRoundNumber: number;
  totalRounds: number;
}

export interface ShowPerformance {
  id: string;
  actNumber: number;
  title: string;
  artistOrCrew: string;
  choreographer: string;
  dancersCount: number;
  danceStyle: string;
  durationMinutes: number;
  scheduledTime: string;
  status: 'standby' | 'in_green_room' | 'on_deck' | 'performing' | 'completed';
  lightingCue: string;
  soundCue: string;
  musicTrack: string;
  technicalNotes: string;
  greenRoomAssigned: string;
  rehearsalCompleted: boolean;
}

export interface TicketCategory {
  id: string;
  name: string;
  price: number;
  totalCapacity: number;
  soldCount: number;
  reservedCount: number;
  perks: string[];
  colorBadge: string;
}

export interface WorkshopSession {
  id: string;
  title: string;
  instructorName: string;
  instructorAvatar: string;
  danceStyle: string;
  level: 'Beginner' | 'Open Level' | 'Intermediate' | 'Masterclass / Pro';
  date: string;
  timeRange: string;
  venueRoom: string;
  capacity: number;
  bookedCount: number;
  waitlistCount: number;
  price: number;
  instructorPayoutModel: 'Fixed' | 'Percentage' | 'Hybrid';
  instructorPayoutAmount: number;
  payoutStatus: 'Pending' | 'Processed' | 'Completed';
  attendanceRate: number;
}

export interface CompetitionCategory {
  id: string;
  name: string;
  ageGroup?: string;
  style?: string;
  fee?: number;
  maxParticipants?: number;
  roundType?: string;
  status?: string;
  dancersCount?: number;
}

export type EventCategory = CompetitionCategory;

export interface CampPass {
  id: string;
  name: string;
  price: number;
  validDays: string;
  inclusions: string[];
  accommodationIncluded: boolean;
  capacity: number;
  sold: number;
}

export interface EventStaffMember {
  id: string;
  name: string;
  role: StaffRole;
  phone: string;
  email: string;
  assignedArea?: string;
  assignedEvents?: string[];
  status?: string;
  shift?: string;
  checkInStatus?: 'Checked In' | 'Pending' | 'Off Duty';
  permissions: {
    canScore?: boolean;
    canCheckIn?: boolean;
    canEditSchedule?: boolean;
    canBroadcast?: boolean;
    canViewFinance?: boolean;
    canModifyBrackets?: boolean;
    [key: string]: any;
  } | string[];
}

export type OrganizerStaffMember = EventStaffMember;

export interface JudgeProfile {
  id: string;
  name: string;
  title?: string;
  avatar: string;
  styles: string[];
  experienceYears?: number;
  certifications?: string[];
  eventsJudgedCount: number;
  averageRating?: number;
  rating?: number;
  bio?: string;
  cityCountry?: string;
  danceOneId?: string;
  assignedCategories?: string[];
  payoutFee?: number;
  payoutStatus?: 'Pending' | 'Paid' | 'Processing';
  auditScoresSubmittedCount?: number;
}

export type OrganizerJudgeRecord = JudgeProfile;

export interface FeedbackFormItem {
  id: string;
  targetRole?: 'dancer' | 'judge' | 'instructor' | 'performer' | 'audience';
  respondentRole?: string;
  eventName: string;
  respondentName: string;
  rating: number;
  judgingFairnessRating?: number;
  venueRating?: number;
  musicRating?: number;
  categoryRatings?: { aspect: string; score: number }[];
  comments?: string;
  comment?: string;
  privacy: 'private' | 'shared_with_participant' | 'published' | 'anonymous' | string;
  submittedAt: string;
}

export type EventFeedbackEntry = FeedbackFormItem;

export interface CommunicationMessage {
  id: string;
  title: string;
  message: string;
  targetGroup: 'all' | 'category' | 'team' | 'judge' | 'performer' | 'staff';
  targetDetail?: string;
  channel: 'all_channels' | 'whatsapp' | 'sms' | 'app_push';
  sentAt: string;
  sentBy: string;
  deliveryCount: number;
}

export interface OrganizerEventRecord {
  id: string;
  title: string;
  type: EventType;
  status: EventStatus;
  coverImage: string;
  description: string;
  startDate: string;
  endDate?: string;
  time: string;
  venue: string;
  address: string;
  city: string;
  capacity: number;
  registeredCount: number;
  revenue: number;
  expenses: number;
  registrationDeadline: string;
  categories: string[];
  ageGroups: string[];
  danceStyles: string[];
  rules: string[];
  sponsors: { name: string; logoUrl?: string; tier: string }[];
  ticketPricing: { tier: string; price: number; capacity: number; sold: number }[];
  scorePublishPolicy: ScorePublishPolicy;
  isLiveScoringEnabled: boolean;
  audienceVotingEnabled: boolean;
  judges: string[]; // Judge IDs
  staff: EventStaffMember[];
  scoringCriteria: ScoringCriterion[];
  participants: CompetitionParticipant[];
  battleMatchups?: BattleMatchup[];
  showPerformances?: ShowPerformance[];
  ticketCategories?: TicketCategory[];
  workshopSessions?: WorkshopSession[];
  campPasses?: CampPass[];
  scoreAuditLogs: ScoreAuditLog[];
  announcements: string[];
  termsAndConditions?: string;
  cancellationPolicy?: string;
  contactEmail: string;
  contactPhone: string;
}
