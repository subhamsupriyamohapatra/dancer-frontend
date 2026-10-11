import React, { useState } from 'react';
import {
  Shield,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Search,
  Building2,
  User,
  Trophy,
  MapPin,
  Star,
  Plus,
  Eye,
  Check,
  X,
  Filter,
  BarChart3,
  Users,
  Zap,
  RefreshCw,
  Calendar,
  Sparkles,
  ArrowRight,
  GraduationCap,
  DollarSign,
  ChevronRight,
  History,
  FileText,
  Lock,
  ShoppingBag,
  ExternalLink,
  Layers,
  AlertTriangle,
  GitMerge,
  Edit3,
  Clock,
  CheckSquare,
} from 'lucide-react';
import { Studio, DanceClass, ScreenType } from '../types';
import { FEATURED_STUDIOS, ALL_CLASSES } from '../data/danceData';
import { BrandRecord, BrandApprovalStatus } from '../types/brand';
import { ImportedStudioRecord, ImportedStudioStatus } from '../types/studioImport';
import { INITIAL_BRANDS_DATA } from '../data/brandsData';
import { INITIAL_IMPORTED_STUDIOS_DATA } from '../data/importedStudiosData';

interface AdminDashboardScreenProps {
  onNavigate: (screen: ScreenType) => void;
  onSelectStudio?: (studio: Studio) => void;
  onSelectClass?: (danceClass: DanceClass) => void;
  brands?: BrandRecord[];
  onUpdateBrandStatus?: (brandId: string, status: BrandApprovalStatus, notes?: string) => void;
  importedStudios?: ImportedStudioRecord[];
  onUpdateImportedStudioStatus?: (studioId: string, status: ImportedStudioStatus, notes?: string) => void;
  onMergeDuplicateStudio?: (sourceId: string, targetId: string) => void;
}

export type AdminTab =
  | 'approval_centre'
  | 'studio_import'
  | 'brands_moderation'
  | 'studios'
  | 'audit_logs'
  | 'commissions';

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  adminUser: string;
  actionType:
    | 'VERIFICATION_GRANTED'
    | 'VERIFICATION_REJECTED'
    | 'STUDIO_ONBOARDED'
    | 'COMMISSION_SET'
    | 'STATUS_TOGGLED'
    | 'BRAND_APPROVED'
    | 'BRAND_REJECTED'
    | 'BRAND_CHANGES_REQUESTED'
    | 'STUDIO_IMPORTED_APPROVED'
    | 'STUDIO_DUPLICATE_MERGED';
  entityName: string;
  entityRole: string;
  details: string;
  previousState?: string;
  newState?: string;
  decisionReason?: string;
  ipAddress: string;
}

const INITIAL_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: 'log-101',
    timestamp: 'Today, 02:45 PM',
    adminUser: 'Admin Superuser (HQ-BBSR)',
    actionType: 'VERIFICATION_GRANTED',
    entityName: 'Orissa Dance Academy (ODA)',
    entityRole: 'Studio Partner',
    details: 'Verified classical trust credentials and GSTIN registration for Khandagiri campus.',
    previousState: 'PENDING',
    newState: 'APPROVED',
    decisionReason: 'Govt cultural registration confirmed.',
    ipAddress: '103.24.188.12',
  },
  {
    id: 'log-102',
    timestamp: 'Today, 11:20 AM',
    adminUser: 'Admin Superuser (HQ-BBSR)',
    actionType: 'VERIFICATION_GRANTED',
    entityName: 'Squad of Revolution (SOR Crew)',
    entityRole: 'Instructor Faculty',
    details: 'Granted verified faculty badge to Abhilash Panda for Cuttack & BBSR cypher training.',
    previousState: 'PENDING',
    newState: 'APPROVED',
    decisionReason: 'Battle curriculum and verified video portfolio vetted.',
    ipAddress: '103.24.188.12',
  },
  {
    id: 'log-103',
    timestamp: 'Yesterday, 06:15 PM',
    adminUser: 'System Sentinel',
    actionType: 'COMMISSION_SET',
    entityName: 'Platform Central Gateway',
    entityRole: 'DanceOne Core',
    details: 'Standard marketplace fee locked at 10.0% with immutable transaction ledger.',
    ipAddress: '127.0.0.1 (Internal Ledger)',
  },
];

export const AdminDashboardScreen: React.FC<AdminDashboardScreenProps> = ({
  onNavigate,
  onSelectStudio,
  onSelectClass,
  brands = INITIAL_BRANDS_DATA,
  onUpdateBrandStatus,
  importedStudios = INITIAL_IMPORTED_STUDIOS_DATA,
  onUpdateImportedStudioStatus,
  onMergeDuplicateStudio,
}) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('approval_centre');
  const [selectedCity, setSelectedCity] = useState<'All' | 'Bhubaneswar' | 'Cuttack'>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Local state for approval queues & audit logs
  const [localBrands, setLocalBrands] = useState<BrandRecord[]>(brands);
  const [localImportedStudios, setLocalImportedStudios] = useState<ImportedStudioRecord[]>(importedStudios);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(INITIAL_AUDIT_LOGS);
  const [approvalFilter, setApprovalFilter] = useState<'all' | 'studios' | 'brands' | 'instructors' | 'duplicates'>('all');

  // Decision Modal State
  const [decisionModalItem, setDecisionModalItem] = useState<{
    type: 'brand' | 'studio_import';
    id: string;
    title: string;
    action: 'APPROVED' | 'REJECTED' | 'CHANGES_REQUESTED' | 'UNDER_REVIEW';
  } | null>(null);
  const [decisionReason, setDecisionReason] = useState('');

  // Merge Duplicate Modal State
  const [mergeModalItem, setMergeModalItem] = useState<ImportedStudioRecord | null>(null);
  const [mergeTargetId, setMergeTargetId] = useState('');

  // Studios list
  const [studios, setStudios] = useState<Studio[]>(FEATURED_STUDIOS);

  // Helper to record audit log
  const recordAudit = (
    actionType: AuditLogEntry['actionType'],
    entityName: string,
    entityRole: string,
    details: string,
    previousState?: string,
    newState?: string,
    reason?: string
  ) => {
    const newLog: AuditLogEntry = {
      id: `log-${Date.now()}`,
      timestamp: 'Just now',
      adminUser: 'Admin Superuser (HQ-BBSR)',
      actionType,
      entityName,
      entityRole,
      details,
      previousState,
      newState,
      decisionReason: reason || 'Verified by DanceOne Administrative Governance.',
      ipAddress: '103.24.188.12',
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  // Brand Moderation Action
  const handleExecuteBrandDecision = () => {
    if (!decisionModalItem) return;
    const { id, action } = decisionModalItem;

    const brand = localBrands.find((b) => b.id === id);
    const prevStatus = brand?.approvalStatus || 'PENDING_APPROVAL';

    setLocalBrands((prev) =>
      prev.map((b) =>
        b.id === id
          ? {
              ...b,
              approvalStatus: action,
              reviewedByAdminId: 'admin-super-01',
              reviewedAt: new Date().toISOString(),
              reviewNotes: decisionReason,
            }
          : b
      )
    );

    if (onUpdateBrandStatus) {
      onUpdateBrandStatus(id, action, decisionReason);
    }

    recordAudit(
      action === 'APPROVED'
        ? 'BRAND_APPROVED'
        : action === 'REJECTED'
        ? 'BRAND_REJECTED'
        : 'BRAND_CHANGES_REQUESTED',
      brand?.name || id,
      'Dance-Friendly Brand',
      `Moderation decision: ${action} for ${brand?.name}.`,
      prevStatus,
      action,
      decisionReason
    );

    setDecisionModalItem(null);
    setDecisionReason('');
  };

  // Studio Import Moderation Action
  const handleExecuteStudioImportDecision = (
    id: string,
    newStatus: ImportedStudioStatus,
    reason?: string
  ) => {
    const studio = localImportedStudios.find((s) => s.id === id);
    const prevStatus = studio?.verificationStatus || 'IMPORTED';

    setLocalImportedStudios((prev) =>
      prev.map((s) =>
        s.id === id
          ? {
              ...s,
              verificationStatus: newStatus,
              reviewedByAdminId: 'admin-super-01',
              reviewedAt: new Date().toISOString(),
              notes: reason || s.notes,
            }
          : s
      )
    );

    if (onUpdateImportedStudioStatus) {
      onUpdateImportedStudioStatus(id, newStatus, reason);
    }

    recordAudit(
      newStatus === 'APPROVED' ? 'STUDIO_IMPORTED_APPROVED' : 'VERIFICATION_REJECTED',
      studio?.name || id,
      'Imported Dance Studio',
      `Local studio import status updated to ${newStatus} in ${studio?.city}.`,
      prevStatus,
      newStatus,
      reason || 'Curated directory audit complete.'
    );
  };

  // Execute Merge Duplicate Action
  const handleExecuteMerge = () => {
    if (!mergeModalItem || !mergeTargetId) return;

    setLocalImportedStudios((prev) =>
      prev.map((s) =>
        s.id === mergeModalItem.id
          ? {
              ...s,
              verificationStatus: 'MERGED_DUPLICATE',
              duplicateOfId: mergeTargetId,
              notes: `Merged into primary record ${mergeTargetId}`,
            }
          : s
      )
    );

    if (onMergeDuplicateStudio) {
      onMergeDuplicateStudio(mergeModalItem.id, mergeTargetId);
    }

    recordAudit(
      'STUDIO_DUPLICATE_MERGED',
      mergeModalItem.name,
      'Imported Studio Duplicate',
      `Merged duplicate entry (${mergeModalItem.name}) into target studio ID (${mergeTargetId}).`,
      'IMPORTED',
      'MERGED_DUPLICATE',
      'De-duplication merge verified by platform administrator.'
    );

    setMergeModalItem(null);
    setMergeTargetId('');
  };

  // Count items awaiting review
  const pendingBrands = localBrands.filter(
    (b) => b.approvalStatus === 'PENDING_APPROVAL' || b.approvalStatus === 'UNDER_REVIEW'
  );
  const pendingImportedStudios = localImportedStudios.filter(
    (s) => s.verificationStatus === 'IMPORTED' || s.verificationStatus === 'PENDING_VERIFICATION'
  );
  const duplicateCandidates = localImportedStudios.filter(
    (s) => s.name.toLowerCase().includes('duplicate') || s.notes?.toLowerCase().includes('duplicate')
  );

  const totalPendingInApprovalCentre = pendingBrands.length + pendingImportedStudios.length;

  return (
    <div className="w-full max-w-[1600px] mx-auto px-3 sm:px-6 py-4 space-y-6 pb-24 text-white font-sans">
      {/* 1. TOP HEADER & GOVERNANCE TITLE */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 font-mono text-[11px] font-bold uppercase tracking-wider">
              PROTECTED PLATFORM GOVERNANCE
            </span>
            <span className="text-xs text-zinc-500 font-mono">•</span>
            <span className="text-xs text-zinc-400 font-mono">Platform Moderation Jurisdiction</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <ShieldCheck className="w-7 h-7 text-amber-400" />
            <span>DanceOne Admin Approval &amp; Moderation Centre</span>
          </h1>
          <p className="text-xs sm:text-sm text-zinc-300 max-w-2xl leading-relaxed">
            Centralized approval desk for imported dance academies, instructor dossiers, dancewear brands, and immutable audit logs.
          </p>
        </div>

        {/* Action badge */}
        <div className="flex items-center gap-2">
          <span className="px-3.5 py-1.5 rounded-xl bg-zinc-900 border border-white/10 text-xs font-mono text-zinc-300 flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>{totalPendingInApprovalCentre} Queued for Decision</span>
          </span>
        </div>
      </div>

      {/* 2. ADMIN NAVIGATION TABS */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar border-b border-white/10 pb-3">
        {[
          {
            id: 'approval_centre',
            label: `Approval Centre (${totalPendingInApprovalCentre})`,
            icon: CheckSquare,
          },
          {
            id: 'studio_import',
            label: `Local Studio Data Import (${localImportedStudios.length})`,
            icon: Building2,
          },
          {
            id: 'brands_moderation',
            label: `Brands Marketplace (${localBrands.length})`,
            icon: ShoppingBag,
          },
          {
            id: 'audit_logs',
            label: `Security Audit Trail (${auditLogs.length})`,
            icon: History,
          },
          {
            id: 'commissions',
            label: '10% Commission Ledger',
            icon: DollarSign,
          },
          {
            id: 'studios',
            label: 'Public Studios Directory',
            icon: Layers,
          },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as AdminTab)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-200 flex items-center gap-2 cursor-pointer ${
                isActive
                  ? 'bg-amber-400 text-black shadow-md font-bold'
                  : 'bg-zinc-900 text-zinc-400 hover:text-white border border-white/5 hover:border-white/20'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ============================================================== */}
      {/* TAB 1: CENTRAL APPROVAL & MODERATION CENTRE (RULE 4) */}
      {/* ============================================================== */}
      {activeTab === 'approval_centre' && (
        <div className="space-y-6">
          {/* Filter Pills */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 p-1 bg-zinc-900 border border-white/10 rounded-2xl">
              {[
                { id: 'all', label: `All Inbound (${totalPendingInApprovalCentre})` },
                { id: 'studios', label: `Imported Studios (${pendingImportedStudios.length})` },
                { id: 'brands', label: `Brand Suggestions (${pendingBrands.length})` },
                { id: 'duplicates', label: `Duplicates (${duplicateCandidates.length})` },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setApprovalFilter(f.id as typeof approvalFilter)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    approvalFilter === f.id
                      ? 'bg-white text-black font-bold'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <div className="text-xs text-zinc-400 font-mono">
              Workflow: PENDING → UNDER REVIEW → APPROVED / REJECTED
            </div>
          </div>

          {/* Section: Pending Dance-Friendly Brand Suggestions */}
          {(approvalFilter === 'all' || approvalFilter === 'brands') && (
            <div className="rounded-3xl bg-zinc-900/90 border border-white/10 p-5 sm:p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-amber-400" />
                  <h3 className="text-base font-bold text-white">
                    Dance-Friendly Brand Inbound Suggestions ({pendingBrands.length})
                  </h3>
                </div>
                <span className="text-xs font-mono text-zinc-400">
                  Rule 1: Requires Admin approval before public visibility
                </span>
              </div>

              {pendingBrands.length === 0 ? (
                <p className="text-xs text-zinc-500 py-4 text-center">
                  No pending brand submissions awaiting moderation.
                </p>
              ) : (
                <div className="space-y-3">
                  {pendingBrands.map((brand) => (
                    <div
                      key={brand.id}
                      className="p-4 rounded-2xl bg-zinc-950 border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4"
                    >
                      <div className="flex items-start gap-3">
                        <img
                          src={brand.logoUrl}
                          alt={brand.name}
                          className="w-12 h-12 rounded-xl object-cover bg-black border border-white/10 shrink-0"
                        />
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-bold text-white">{brand.name}</h4>
                            <span className="px-2 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-300 font-mono text-[10px] font-bold uppercase">
                              {brand.approvalStatus}
                            </span>
                            <span className="px-2 py-0.5 rounded-md bg-white/5 text-zinc-400 font-mono text-[10px]">
                              {brand.category}
                            </span>
                          </div>
                          <p className="text-xs text-zinc-300">{brand.tagline}</p>
                          <p className="text-xs text-zinc-400 line-clamp-1">{brand.description}</p>
                          <div className="flex items-center gap-3 text-[11px] font-mono text-zinc-500 pt-1">
                            <span>Suggested by: {brand.suggestedByUserName || 'Platform Dancer'}</span>
                            <span>•</span>
                            <a
                              href={brand.websiteUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="text-amber-300 hover:underline flex items-center gap-1"
                            >
                              <span>Official URL</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                        </div>
                      </div>

                      {/* Moderation Actions */}
                      <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                        <button
                          onClick={() =>
                            setDecisionModalItem({
                              type: 'brand',
                              id: brand.id,
                              title: brand.name,
                              action: 'APPROVED',
                            })
                          }
                          className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-zinc-200 text-black text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-sm"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Approve</span>
                        </button>
                        <button
                          onClick={() =>
                            setDecisionModalItem({
                              type: 'brand',
                              id: brand.id,
                              title: brand.name,
                              action: 'CHANGES_REQUESTED',
                            })
                          }
                          className="px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold cursor-pointer"
                        >
                          Request Changes
                        </button>
                        <button
                          onClick={() =>
                            setDecisionModalItem({
                              type: 'brand',
                              id: brand.id,
                              title: brand.name,
                              action: 'REJECTED',
                            })
                          }
                          className="px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-semibold cursor-pointer"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Section: Inbound Imported Studios Curation Queue */}
          {(approvalFilter === 'all' || approvalFilter === 'studios' || approvalFilter === 'duplicates') && (
            <div className="rounded-3xl bg-zinc-900/90 border border-white/10 p-5 sm:p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-amber-400" />
                  <h3 className="text-base font-bold text-white">
                    Studio Ingestion Queue ({pendingImportedStudios.length})
                  </h3>
                </div>
                <span className="text-xs font-mono text-zinc-400">
                  Rule 2: Never published automatically
                </span>
              </div>

              {pendingImportedStudios.length === 0 ? (
                <p className="text-xs text-zinc-500 py-4 text-center">
                  All imported studios have been audited and resolved.
                </p>
              ) : (
                <div className="space-y-3">
                  {pendingImportedStudios.map((std) => (
                    <div
                      key={std.id}
                      className="p-4 rounded-2xl bg-zinc-950 border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4"
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="text-sm font-bold text-white">{std.name}</h4>
                          <span className="px-2 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-300 font-mono text-[10px] font-bold">
                            {std.verificationStatus}
                          </span>
                          <span className="px-2 py-0.5 rounded-md bg-white/5 text-zinc-400 font-mono text-[10px]">
                            {std.city}
                          </span>
                          {std.notes?.toLowerCase().includes('duplicate') && (
                            <span className="px-2 py-0.5 rounded-md bg-rose-500/10 border border-rose-500/30 text-rose-300 font-mono text-[10px] font-bold flex items-center gap-1">
                              <AlertTriangle className="w-3 h-3" />
                              Duplicate Flag
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-zinc-400 flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                          <span>{std.address}</span>
                        </p>

                        <div className="flex flex-wrap gap-2 text-xs text-zinc-400 font-mono pt-1">
                          <span>Phone: {std.phone}</span>
                          <span>•</span>
                          <span>Source: {std.sourceReference}</span>
                          <span>•</span>
                          <span>Rating: ★ {std.publicRatings} ({std.reviewCounts})</span>
                        </div>
                      </div>

                      {/* Studio Ingestion Actions */}
                      <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                        <button
                          onClick={() => handleExecuteStudioImportDecision(std.id, 'APPROVED')}
                          className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-zinc-200 text-black text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-sm"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Promote to Public</span>
                        </button>

                        <button
                          onClick={() => {
                            setMergeModalItem(std);
                            setMergeTargetId('imp-bbsr-003');
                          }}
                          className="px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                        >
                          <GitMerge className="w-3.5 h-3.5 text-amber-400" />
                          <span>Merge Duplicate</span>
                        </button>

                        <button
                          onClick={() => handleExecuteStudioImportDecision(std.id, 'REJECTED', 'Failed verification audit.')}
                          className="px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-semibold cursor-pointer"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 2: LOCAL STUDIO DATA IMPORT PIPELINE (RULE 2) */}
      {/* ============================================================== */}
      {activeTab === 'studio_import' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Building2 className="w-5 h-5 text-amber-400" />
                <span>Studio Directory Curation</span>
              </h2>
              <p className="text-xs text-zinc-400">
                Rule 2 Compliant: Public directory data imported under permission. Must be verified by Admin before appearing on public app.
              </p>
            </div>

            {/* City Selector */}
            <div className="flex items-center gap-2 shrink-0">
              <div className="flex items-center gap-1 p-1 bg-zinc-900 border border-white/10 rounded-2xl">
                {(['All', 'Bhubaneswar', 'Cuttack'] as const).map((city) => (
                  <button
                    key={city}
                    onClick={() => setSelectedCity(city)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      selectedCity === city
                        ? 'bg-white text-black'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    {city}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Imported Studios Table */}
          <div className="rounded-3xl bg-zinc-900/90 border border-white/10 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-sans">
                <thead className="bg-zinc-950 border-b border-white/10 text-zinc-400 uppercase font-mono tracking-wider">
                  <tr>
                    <th className="py-3.5 px-4 font-semibold">Studio Name &amp; Address</th>
                    <th className="py-3.5 px-4 font-semibold">City</th>
                    <th className="py-3.5 px-4 font-semibold">Contact &amp; Source</th>
                    <th className="py-3.5 px-4 font-semibold">Dance Styles</th>
                    <th className="py-3.5 px-4 font-semibold">Status</th>
                    <th className="py-3.5 px-4 font-semibold text-right">Curation Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {localImportedStudios
                    .filter((s) => selectedCity === 'All' || s.city === selectedCity)
                    .map((s) => (
                      <tr key={s.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="py-3.5 px-4">
                          <span className="font-bold text-white block text-sm">{s.name}</span>
                          <span className="text-zinc-400 text-xs flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3 h-3 text-zinc-500 shrink-0" />
                            {s.address}
                          </span>
                          {s.duplicateOfId && (
                            <span className="text-[10px] text-amber-300 font-mono block mt-0.5">
                              Merged into: {s.duplicateOfId}
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 font-mono font-medium text-zinc-300">
                          {s.city}
                        </td>
                        <td className="py-3.5 px-4 text-zinc-400">
                          <span className="text-white block font-mono">{s.phone}</span>
                          <span className="text-[11px] text-zinc-500 block">{s.sourceReference}</span>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="flex flex-wrap gap-1 max-w-xs">
                            {s.danceStyles.slice(0, 3).map((st, i) => (
                              <span
                                key={i}
                                className="px-2 py-0.5 rounded-md bg-white/5 text-[10px] text-zinc-300"
                              >
                                {st}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`px-2.5 py-1 rounded-xl text-[10px] font-mono font-bold uppercase tracking-wider border ${
                              s.verificationStatus === 'APPROVED'
                                ? 'bg-white/10 text-white border-white/20'
                                : s.verificationStatus === 'PENDING_VERIFICATION'
                                ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                                : s.verificationStatus === 'MERGED_DUPLICATE'
                                ? 'bg-zinc-800 text-zinc-400 border-zinc-700'
                                : s.verificationStatus === 'REJECTED'
                                ? 'bg-rose-500/10 text-rose-300 border-rose-500/30'
                                : 'bg-zinc-900 text-zinc-400 border-white/10'
                            }`}
                          >
                            {s.verificationStatus}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {s.verificationStatus !== 'APPROVED' && (
                              <button
                                onClick={() => handleExecuteStudioImportDecision(s.id, 'APPROVED')}
                                className="px-3 py-1 rounded-lg bg-white hover:bg-zinc-200 text-black text-xs font-bold uppercase cursor-pointer"
                              >
                                Verify &amp; Publish
                              </button>
                            )}
                            <button
                              onClick={() => {
                                setMergeModalItem(s);
                                setMergeTargetId('imp-bbsr-003');
                              }}
                              className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-amber-300 cursor-pointer"
                              title="Merge Duplicate Record"
                            >
                              <GitMerge className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 3: DANCE-FRIENDLY BRANDS MARKETPLACE MODERATION (RULE 1) */}
      {/* ============================================================== */}
      {activeTab === 'brands_moderation' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-amber-400" />
                <span>Dance-Friendly Brands Marketplace Moderation</span>
              </h2>
              <p className="text-xs text-zinc-400">
                Rule 1 Compliant: Dancers discover and suggest brands. Admin governs approvals, edits, suspensions and removals.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {localBrands.map((brand) => (
              <div
                key={brand.id}
                className="rounded-3xl bg-zinc-900 border border-white/10 p-5 flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={brand.logoUrl}
                        alt={brand.name}
                        className="w-12 h-12 rounded-xl object-cover bg-black border border-white/10"
                      />
                      <div>
                        <h4 className="text-sm font-bold text-white">{brand.name}</h4>
                        <span className="text-[11px] font-mono text-zinc-400 block">
                          {brand.category}
                        </span>
                      </div>
                    </div>

                    <span
                      className={`px-2.5 py-1 rounded-xl text-[10px] font-mono font-bold uppercase tracking-wider border ${
                        brand.approvalStatus === 'APPROVED'
                          ? 'bg-white/10 text-white border-white/20'
                          : brand.approvalStatus === 'PENDING_APPROVAL'
                          ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                          : brand.approvalStatus === 'CHANGES_REQUESTED'
                          ? 'bg-amber-500/20 text-amber-200 border-amber-500/30'
                          : 'bg-rose-500/10 text-rose-300 border-rose-500/30'
                      }`}
                    >
                      {brand.approvalStatus}
                    </span>
                  </div>

                  <p className="text-xs text-zinc-300 line-clamp-2 mb-2">{brand.description}</p>
                  {brand.discountCode && (
                    <div className="text-xs font-mono text-amber-300 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20 inline-block">
                      Perk: {brand.discountCode} ({brand.discountPercent}% OFF)
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-2">
                  <a
                    href={brand.websiteUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-zinc-400 hover:text-white flex items-center gap-1 font-mono"
                  >
                    <span>Website</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>

                  <div className="flex items-center gap-1.5">
                    {brand.approvalStatus !== 'APPROVED' && (
                      <button
                        onClick={() =>
                          setDecisionModalItem({
                            type: 'brand',
                            id: brand.id,
                            title: brand.name,
                            action: 'APPROVED',
                          })
                        }
                        className="px-3 py-1 rounded-lg bg-white hover:bg-zinc-200 text-black text-xs font-bold uppercase cursor-pointer"
                      >
                        Approve
                      </button>
                    )}
                    {brand.approvalStatus === 'APPROVED' && (
                      <button
                        onClick={() =>
                          setDecisionModalItem({
                            type: 'brand',
                            id: brand.id,
                            title: brand.name,
                            action: 'REJECTED',
                          })
                        }
                        className="px-3 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-rose-300 text-xs font-semibold cursor-pointer"
                      >
                        Suspend
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 4: IMMUTABLE SECURITY AUDIT TRAIL (RULE 4, 6) */}
      {/* ============================================================== */}
      {activeTab === 'audit_logs' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <History className="w-5 h-5 text-amber-400" />
                <span>Immutable Security &amp; Moderation Audit Trail</span>
              </h2>
              <p className="text-xs text-zinc-400">
                Rule 4 Compliant: Records reviewer, timestamp, previous state, new state, and decision reason.
              </p>
            </div>
            <span className="text-xs font-mono text-zinc-400">{auditLogs.length} Logged Actions</span>
          </div>

          <div className="rounded-3xl bg-zinc-900/90 border border-white/10 overflow-hidden">
            <div className="divide-y divide-white/5">
              {auditLogs.map((log) => (
                <div key={log.id} className="p-4 sm:p-5 flex flex-col sm:flex-row items-start justify-between gap-3 hover:bg-white/[0.01] transition-colors">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2 py-0.5 rounded-md bg-white/10 text-white font-mono text-[10px] font-bold">
                        {log.actionType}
                      </span>
                      <span className="font-bold text-white text-sm">{log.entityName}</span>
                      <span className="text-zinc-500 text-xs">•</span>
                      <span className="text-xs text-zinc-400">{log.entityRole}</span>
                    </div>

                    <p className="text-xs text-zinc-300">{log.details}</p>

                    {log.decisionReason && (
                      <p className="text-[11px] text-amber-300 font-mono mt-0.5">
                        Reason: {log.decisionReason}
                      </p>
                    )}
                  </div>

                  <div className="text-right text-xs font-mono text-zinc-500 shrink-0">
                    <span className="text-zinc-300 block">{log.timestamp}</span>
                    <span className="block text-[10px] text-zinc-500">{log.adminUser}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 5: COMMISSIONS & SETTLEMENTS LEDGER (RULE 11) */}
      {/* ============================================================== */}
      {activeTab === 'commissions' && (
        <div className="space-y-6">
          <div className="rounded-3xl bg-zinc-900 border border-white/10 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-amber-400" />
                  <span>Central Platform Fee &amp; Commission Ledger</span>
                </h3>
                <p className="text-xs text-zinc-400">
                  Rule 11: All customer payments go through DanceOne payment gateway with automated rolling settlements.
                </p>
              </div>
              <span className="text-xs font-mono text-amber-300 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20 font-bold">
                10.0% Flat Take-Rate
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-zinc-950 border border-white/5">
                <span className="text-xs text-zinc-500 font-mono block">PLATFORM REVENUE</span>
                <span className="text-2xl font-mono font-bold text-white">₹1,42,800</span>
                <span className="text-[11px] text-zinc-400 block mt-1">10% Platform fee</span>
              </div>
              <div className="p-4 rounded-2xl bg-zinc-950 border border-white/5">
                <span className="text-xs text-zinc-500 font-mono block">DISBURSED SETTLEMENTS</span>
                <span className="text-2xl font-mono font-bold text-amber-300">₹12,85,200</span>
                <span className="text-[11px] text-zinc-400 block mt-1">Settled to Studios &amp; Faculty</span>
              </div>
              <div className="p-4 rounded-2xl bg-zinc-950 border border-white/5">
                <span className="text-xs text-zinc-500 font-mono block">SETTLEMENT CYCLE</span>
                <span className="text-2xl font-mono font-bold text-white">T+2 Rolling</span>
                <span className="text-[11px] text-zinc-400 block mt-1">Automatic UPI/NEFT transfer</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 6: PUBLIC STUDIOS DIRECTORY */}
      {activeTab === 'studios' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h3 className="text-base font-bold text-white">
              Verified Public Academies ({studios.length})
            </h3>
            <span className="text-xs font-mono text-zinc-400">Live on Public Discovery Feed</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {studios.map((std) => (
              <div
                key={std.id}
                className="rounded-2xl bg-zinc-900 border border-white/10 p-4 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-white truncate">{std.name}</h4>
                  <span className="text-xs font-mono text-amber-300">★ {std.rating}</span>
                </div>
                <p className="text-xs text-zinc-400 truncate">{std.address}</p>
                <div className="flex items-center justify-between text-xs pt-2 border-t border-white/5">
                  <span className="text-zinc-500">{std.city}</span>
                  <span className="text-white font-mono">{std.priceRange}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* DECISION ACTION MODAL (FOR AUDIT LOG DOCUMENTATION) */}
      {/* ============================================================== */}
      {decisionModalItem && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="max-w-md w-full rounded-3xl bg-zinc-900 border border-white/10 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-base font-bold text-white">
                Record Decision: {decisionModalItem.action}
              </h3>
              <button
                onClick={() => setDecisionModalItem(null)}
                className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-zinc-300">
              Applying <strong className="text-white">{decisionModalItem.action}</strong> to{' '}
              <span className="text-amber-300 font-semibold">{decisionModalItem.title}</span>.
              Please record the audit rationale for the governance record.
            </p>

            <div>
              <label className="text-xs font-semibold text-zinc-300 block mb-1">
                Decision &amp; Audit Rationale *
              </label>
              <textarea
                rows={3}
                required
                value={decisionReason}
                onChange={(e) => setDecisionReason(e.target.value)}
                placeholder="State verified criteria, license validation, or requested modifications..."
                className="w-full p-3 rounded-xl bg-zinc-950 border border-white/10 focus:border-amber-400 text-xs text-white outline-none resize-none"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setDecisionModalItem(null)}
                className="px-4 py-2 rounded-xl bg-zinc-800 text-xs font-bold text-zinc-300"
              >
                Cancel
              </button>
              <button
                onClick={handleExecuteBrandDecision}
                className="px-5 py-2 rounded-xl bg-white hover:bg-zinc-200 text-black text-xs font-bold uppercase tracking-wider cursor-pointer"
              >
                Confirm Decision
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MERGE DUPLICATE STUDIO MODAL (RULE 2, 4) */}
      {/* ============================================================== */}
      {mergeModalItem && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="max-w-md w-full rounded-3xl bg-zinc-900 border border-white/10 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <GitMerge className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-bold text-white">Merge Duplicate Studio</h3>
              </div>
              <button
                onClick={() => setMergeModalItem(null)}
                className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-zinc-300">
              Merging duplicate entry <strong className="text-white">{mergeModalItem.name}</strong> into an existing master academy record.
            </p>

            <div>
              <label className="text-xs font-semibold text-zinc-300 block mb-1">
                Select Master Studio Record *
              </label>
              <select
                value={mergeTargetId}
                onChange={(e) => setMergeTargetId(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-zinc-950 border border-white/10 text-xs text-white outline-none"
              >
                <option value="imp-bbsr-003">Dance Workz Institute (B-24 Saheed Nagar)</option>
                <option value="imp-bbsr-001">Sizzling Dance Academy (KIIT Road, Patia)</option>
                <option value="imp-ctk-001">Utkal Sangeet Mandir (Odia Bazar, Cuttack)</option>
              </select>
            </div>

            <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200">
              The duplicate record will be archived as <span className="font-mono font-bold">MERGED_DUPLICATE</span> and linked to the master ID.
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setMergeModalItem(null)}
                className="px-4 py-2 rounded-xl bg-zinc-800 text-xs font-bold text-zinc-300"
              >
                Cancel
              </button>
              <button
                onClick={handleExecuteMerge}
                className="px-5 py-2 rounded-xl bg-white hover:bg-zinc-200 text-black text-xs font-bold uppercase tracking-wider cursor-pointer"
              >
                Merge Records
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
