import {
  OrganizerEventRecord,
  JudgeProfile,
  EventStaffMember,
  FeedbackFormItem,
  CommunicationMessage,
  OrganizerJudgeRecord,
  OrganizerStaffMember,
  EventFeedbackEntry,
} from '../types/organizer';

export const ORGANIZER_JUDGES_DATA: JudgeProfile[] = [];

export const ORGANIZER_STAFF_DATA: EventStaffMember[] = [];

export const ORGANIZER_EVENTS_DATA: OrganizerEventRecord[] = [];

export const ORGANIZER_FEEDBACK_DATA: FeedbackFormItem[] = [];

export const ORGANIZER_COMMUNICATIONS_DATA: CommunicationMessage[] = [];

export const ORGANIZER_SAMPLE_EVENTS: OrganizerEventRecord[] = [];

export const ORGANIZER_STAFF_MEMBERS: OrganizerStaffMember[] = [];

export const ORGANIZER_FEEDBACK_ENTRIES: EventFeedbackEntry[] = [];

export const ORGANIZER_FINANCIAL_SUMMARY = {
  totalRevenue: 0,
  ticketSalesRevenue: 0,
  registrationFeesRevenue: 0,
  sponsorshipRevenue: 0,
  totalExpenses: 0,
  danceOneCommission: 0,
  netProfit: 0,
  expenses: [] as {
    id: string;
    name: string;
    category: string;
    amount: number;
    status: 'Paid' | 'Pending';
    recipient: string;
  }[],
  settlements: [] as {
    id: string;
    date: string;
    amount: number;
    bankAccount: string;
    utrNumber: string;
    status: 'Completed' | 'Pending';
  }[],
};
