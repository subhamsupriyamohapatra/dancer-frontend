/**
 * DanceOne Centralized API Client
 * Connects frontend to the Node.js/Express + MongoDB backend
 */

import {
  DanceClass,
  Studio,
  Booking,
  UserProfile,
  UserRole,
  StudioBatch,
  StudioStudent,
  StudioPaymentRecord,
} from '../types';
import { OrganizerEventRecord } from '../types/organizer';
import { BrandRecord, SuggestBrandPayload, BrandApprovalStatus } from '../types/brand';
import { ImportedStudioRecord, ImportedStudioStatus } from '../types/studioImport';

const API_BASE = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api').replace(/\/$/, '');

function getAuthHeader(): Record<string, string> {
  const token = localStorage.getItem('danceone_token') || sessionStorage.getItem('danceone_admin_session_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...getAuthHeader(),
    ...(options.headers || {}),
  };

  try {
    const res = await fetch(url, { ...options, headers });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || `HTTP error ${res.status}`);
    }
    return data;
  } catch (err: any) {
    console.error(`[API Error] ${endpoint}:`, err.message);
    throw err;
  }
}

export const api = {
  // --- AUTHENTICATION & USERS ---
  auth: {
    async register(payload: { name: string; email: string; password?: string; role: UserRole; phone?: string; location?: string }) {
      const res = await request<{ success: boolean; token: string; user: UserProfile }>('/auth/register', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      if (res.token) localStorage.setItem('danceone_token', res.token);
      return res;
    },
    async login(payload: { email: string; password?: string; role?: UserRole }) {
      const res = await request<{ success: boolean; token: string; user: UserProfile }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      if (res.token) localStorage.setItem('danceone_token', res.token);
      return res;
    },
    async adminLogin(payload: { email: string; passkey: string; otp: string }) {
      const res = await request<{ success: boolean; token: string; user: UserProfile }>('/auth/admin-login', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      if (res.token) {
        sessionStorage.setItem('danceone_admin_session_token', res.token);
        sessionStorage.setItem('danceone_admin_session_info', JSON.stringify({
          adminId: res.user.email,
          email: res.user.email,
          name: res.user.name,
          role: 'admin',
          token: res.token,
          expiresAt: Date.now() + 4 * 60 * 60 * 1000,
        }));
      }
      return res;
    },
    async sendCode(payload: { email?: string; role?: UserRole; purpose?: string }) {
      return request<{ success: boolean; message: string }>('/auth/send-code', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
    },
    async verifyCode(payload: { email?: string; code: string }) {
      return request<{ success: boolean; message: string }>('/auth/verify-code', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
    },
    async getMe() {
      return request<{ success: boolean; user: UserProfile }>('/auth/me');
    },
    async updateProfile(updates: Partial<UserProfile>) {
      return request<{ success: boolean; user: UserProfile }>('/auth/profile', {
        method: 'PUT',
        body: JSON.stringify(updates),
      });
    },
    async switchRole(role: UserRole) {
      return request<{ success: boolean; user: UserProfile }>('/auth/role-switch', {
        method: 'POST',
        body: JSON.stringify({ role }),
      });
    },
    logout() {
      localStorage.removeItem('danceone_token');
      sessionStorage.removeItem('danceone_admin_session_token');
      sessionStorage.removeItem('danceone_admin_session_info');
    },
  },

  // --- CLASSES ---
  classes: {
    async list(params?: { category?: string; city?: string; query?: string }) {
      const query = new URLSearchParams();
      if (params?.category && params.category !== 'All') query.append('category', params.category);
      if (params?.city) query.append('city', params.city);
      if (params?.query) query.append('query', params.query);
      const qs = query.toString() ? `?${query.toString()}` : '';
      return request<{ success: boolean; count: number; classes: DanceClass[] }>(`/classes${qs}`);
    },
    async getById(id: string) {
      return request<{ success: boolean; danceClass: DanceClass }>(`/classes/${id}`);
    },
    async create(newClass: Partial<DanceClass>) {
      return request<{ success: boolean; danceClass: DanceClass }>('/classes', {
        method: 'POST',
        body: JSON.stringify(newClass),
      });
    },
    async update(id: string, updates: Partial<DanceClass>) {
      return request<{ success: boolean; danceClass: DanceClass }>(`/classes/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updates),
      });
    },
    async delete(id: string) {
      return request<{ success: boolean }>(`/classes/${id}`, { method: 'DELETE' });
    },
  },

  // --- STUDIOS & STUDIO ERP ---
  studios: {
    async list(params?: { city?: string; query?: string }) {
      const query = new URLSearchParams();
      if (params?.city) query.append('city', params.city);
      if (params?.query) query.append('query', params.query);
      const qs = query.toString() ? `?${query.toString()}` : '';
      return request<{ success: boolean; count: number; studios: Studio[] }>(`/studios${qs}`);
    },
    async getById(id: string) {
      return request<{ success: boolean; studio: Studio }>(`/studios/${id}`);
    },
    async update(id: string, updates: Partial<Studio>) {
      return request<{ success: boolean; studio: Studio }>(`/studios/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updates),
      });
    },
    // Batches
    async listBatches(studioId: string = 'studio-1') {
      return request<{ success: boolean; count: number; batches: StudioBatch[] }>(`/studios/${studioId}/batches`);
    },
    async createBatch(studioId: string, batch: Partial<StudioBatch>) {
      return request<{ success: boolean; batch: StudioBatch }>(`/studios/${studioId}/batches`, {
        method: 'POST',
        body: JSON.stringify(batch),
      });
    },
    // Students CRM
    async listStudents(studioId: string = 'studio-1') {
      return request<{ success: boolean; count: number; students: StudioStudent[] }>(`/studios/${studioId}/students`);
    },
    async createStudent(studioId: string, student: Partial<StudioStudent>) {
      return request<{ success: boolean; student: StudioStudent }>(`/studios/${studioId}/students`, {
        method: 'POST',
        body: JSON.stringify(student),
      });
    },
    // Invoices (18% GST)
    async listInvoices(studioId: string = 'studio-1') {
      return request<{ success: boolean; count: number; invoices: StudioPaymentRecord[] }>(`/studios/${studioId}/invoices`);
    },
    async createInvoice(studioId: string, invoice: Partial<StudioPaymentRecord>) {
      return request<{ success: boolean; invoice: StudioPaymentRecord }>(`/studios/${studioId}/invoices`, {
        method: 'POST',
        body: JSON.stringify(invoice),
      });
    },
  },

  // --- EVENTS & TOURNAMENTS ---
  events: {
    async list(params?: { status?: string; type?: string; city?: string; query?: string }) {
      const query = new URLSearchParams();
      if (params?.status) query.append('status', params.status);
      if (params?.type) query.append('type', params.type);
      if (params?.city) query.append('city', params.city);
      if (params?.query) query.append('query', params.query);
      const qs = query.toString() ? `?${query.toString()}` : '';
      return request<{ success: boolean; count: number; events: OrganizerEventRecord[] }>(`/events${qs}`);
    },
    async getById(id: string) {
      return request<{ success: boolean; event: OrganizerEventRecord }>(`/events/${id}`);
    },
    async create(event: Partial<OrganizerEventRecord>) {
      return request<{ success: boolean; event: OrganizerEventRecord }>('/events', {
        method: 'POST',
        body: JSON.stringify(event),
      });
    },
    async update(id: string, updates: Partial<OrganizerEventRecord>) {
      return request<{ success: boolean; event: OrganizerEventRecord }>(`/events/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updates),
      });
    },
    async bookPass(eventId: string, tierIndex: number = 0) {
      return request<{ success: boolean; event: OrganizerEventRecord }>(`/events/${eventId}/book-pass`, {
        method: 'POST',
        body: JSON.stringify({ tierIndex }),
      });
    },
    async submitScore(eventId: string, payload: { participantId: string; judgeName?: string; criteriaScores: any; totalScore: number }) {
      return request<{ success: boolean; scoreLog: any }>(`/events/${eventId}/scores`, {
        method: 'POST',
        body: JSON.stringify(payload),
      });
    },
    async voteBattle(eventId: string, payload: { matchupId: string; voterType: string; votedDancerId: string }) {
      return request<{ success: boolean; message: string }>(`/events/${eventId}/battles/vote`, {
        method: 'POST',
        body: JSON.stringify(payload),
      });
    },
  },

  // --- BOOKINGS & PASSES ---
  bookings: {
    async checkout(payload: Partial<Booking>) {
      return request<{ success: boolean; booking: Booking }>('/bookings/checkout', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
    },
    async getMyPasses() {
      return request<{ success: boolean; count: number; passes: Booking[] }>('/bookings/my-passes');
    },
    async checkInPass(id: string) {
      return request<{ success: boolean; booking: Booking; message: string }>(`/bookings/${id}/check-in`, {
        method: 'POST',
      });
    },
    async submitReview(id: string, payload: { rating: number; comment: string }) {
      return request<{ success: boolean; booking: Booking }>(`/bookings/${id}/review`, {
        method: 'POST',
        body: JSON.stringify(payload),
      });
    },
  },

  // --- INSTRUCTOR WORKSPACE ---
  instructor: {
    async getSchedule() {
      return request<{ success: boolean; schedule: any[] }>('/instructor/schedule');
    },
    async getPrivateRequests() {
      return request<{ success: boolean; requests: any[] }>('/instructor/private-requests');
    },
    async updatePrivateRequest(id: string, status: 'accepted' | 'rejected') {
      return request<{ success: boolean; request: any }>(`/instructor/private-requests/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ status }),
      });
    },
    async getGigs() {
      return request<{ success: boolean; gigs: any[]; appliedIds: string[] }>('/instructor/gigs');
    },
    async applyGig(id: string) {
      return request<{ success: boolean; message: string }>(`/instructor/gigs/${id}/apply`, {
        method: 'POST',
      });
    },
    async getEarnings() {
      return request<{ success: boolean; summary: any }>('/instructor/earnings');
    },
  },

  // --- BRANDS MARKETPLACE ---
  brands: {
    async list(params?: { category?: string; query?: string }) {
      const query = new URLSearchParams();
      if (params?.category && params.category !== 'all') query.append('category', params.category);
      if (params?.query) query.append('query', params.query);
      const qs = query.toString() ? `?${query.toString()}` : '';
      return request<{ success: boolean; count: number; brands: BrandRecord[] }>(`/brands${qs}`);
    },
    async suggest(payload: SuggestBrandPayload) {
      return request<{ success: boolean; brand: BrandRecord; message: string }>('/brands/suggest', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
    },
    async listAllForAdmin() {
      return request<{ success: boolean; count: number; brands: BrandRecord[] }>('/brands/all');
    },
    async updateStatus(id: string, status: BrandApprovalStatus, notes?: string) {
      return request<{ success: boolean; brand: BrandRecord }>(`/brands/${id}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status, notes }),
      });
    },
  },

  // --- ADMIN GOVERNANCE & IMPORTED STUDIOS ---
  admin: {
    async listImportedStudios(params?: { city?: string; status?: string }) {
      const query = new URLSearchParams();
      if (params?.city && params.city !== 'All') query.append('city', params.city);
      if (params?.status && params.status !== 'all') query.append('status', params.status);
      const qs = query.toString() ? `?${query.toString()}` : '';
      return request<{ success: boolean; count: number; studios: ImportedStudioRecord[] }>(`/admin/imported-studios${qs}`);
    },
    async updateImportedStudioStatus(id: string, status: ImportedStudioStatus, notes?: string) {
      return request<{ success: boolean; studio: ImportedStudioRecord }>(`/admin/imported-studios/${id}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status, notes }),
      });
    },
    async mergeDuplicateStudios(sourceId: string, targetId: string) {
      return request<{ success: boolean; mergedSource: ImportedStudioRecord; primaryTarget: ImportedStudioRecord }>(
        '/admin/imported-studios/merge',
        {
          method: 'POST',
          body: JSON.stringify({ sourceId, targetId }),
        }
      );
    },
    async getAuditLogs() {
      return request<{ success: boolean; count: number; logs: any[] }>('/admin/audit-logs');
    },
    async getCommissions() {
      return request<any>('/admin/commissions');
    },
  },

  // --- WEDDING SERVICES ---
  wedding: {
    async listChoreographers() {
      return request<{ success: boolean; count: number; choreographers: any[] }>('/wedding/choreographers');
    },
    async submitQuoteRequest(payload: any) {
      return request<{ success: boolean; request: any; message: string }>('/wedding/quote-requests', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
    },
  },
};
