import React, { useState, useRef, useEffect } from 'react';
import {
  Building2,
  Layers,
  Users,
  CheckCircle2,
  DollarSign,
  Calendar,
  Settings,
  Plus,
  CircleDollarSign,
  ExternalLink,
  Upload,
  X,
  Sparkles,
  Award,
} from 'lucide-react';
import {
  ScreenType,
  Studio,
  DanceClass,
  StudioBatch,
  StudioStudent,
  StudioTeacher,
  MembershipPackage,
  StudioPaymentRecord,
  StudioSettlement,
} from '../types';
import {
  STUDIO_BATCHES_DATA,
  STUDIO_STUDENTS_DATA,
  STUDIO_TEACHERS_DATA,
  STUDIO_MEMBERSHIPS_DATA,
  STUDIO_PAYMENTS_DATA,
  STUDIO_SETTLEMENTS_DATA,
} from '../data/danceData';
import { StudioDashboardTab } from './studio/StudioDashboardTab';
import { StudioBatchesTab } from './studio/StudioBatchesTab';
import { StudioStudentsTab } from './studio/StudioStudentsTab';
import { StudioAttendanceTab } from './studio/StudioAttendanceTab';
import { StudioFinanceTab } from './studio/StudioFinanceTab';
import { StudioTeachersTab } from './studio/StudioTeachersTab';
import { AddStudentModal, CreateBatchModal } from './studio/StudioModals';

interface StudioDashboardScreenProps {
  onNavigate: (screen: ScreenType) => void;
  initialSection?: 'DASHBOARD' | 'BATCHES' | 'STUDENTS' | 'ATTENDANCE' | 'FINANCE' | 'TEACHERS';
  studioData?: Studio;
  onUpdateStudioProfile?: (updated: Partial<Studio>) => void;
  allClasses?: DanceClass[];
  onAddClass?: (newClass: DanceClass) => void;
  onAddWorkshop?: (newWorkshop: DanceClass) => void;
  payments?: StudioPaymentRecord[];
  onAddPaymentRecord?: (newPayment: StudioPaymentRecord) => void;
}

type MainStudioSection = 'DASHBOARD' | 'BATCHES' | 'STUDENTS' | 'ATTENDANCE' | 'FINANCE' | 'TEACHERS';

export const StudioDashboardScreen: React.FC<StudioDashboardScreenProps> = ({
  onNavigate,
  initialSection = 'DASHBOARD',
  studioData,
  onUpdateStudioProfile,
  allClasses = [],
  onAddClass,
  onAddWorkshop,
  payments: initialPaymentsProp,
  onAddPaymentRecord,
}) => {
  // Navigation State
  const [activeSection, setActiveSection] = useState<MainStudioSection>(initialSection);

  useEffect(() => {
    if (initialSection) {
      setActiveSection(initialSection);
    }
  }, [initialSection]);

  // Cohort & Entity Data State
  const [batches, setBatches] = useState<StudioBatch[]>(STUDIO_BATCHES_DATA);
  const [students, setStudents] = useState<StudioStudent[]>(STUDIO_STUDENTS_DATA);
  const [teachers] = useState<StudioTeacher[]>(STUDIO_TEACHERS_DATA);
  const [memberships] = useState<MembershipPackage[]>(STUDIO_MEMBERSHIPS_DATA);
  const [settlements] = useState<StudioSettlement[]>(STUDIO_SETTLEMENTS_DATA);
  const [selectedBatchId, setSelectedBatchId] = useState<string>('batch-1');

  // Payments / Fees Ledger State
  const [paymentsList, setPaymentsList] = useState<StudioPaymentRecord[]>(
    initialPaymentsProp || STUDIO_PAYMENTS_DATA
  );

  // Studio Profile Form State
  const [studioName, setStudioName] = useState(studioData?.name || 'The Movement Sanctuary');
  const [studioAddress, setStudioAddress] = useState(
    studioData?.address || '14th Road, Off Khar-Danda, Bandra West, Mumbai'
  );
  const [studioCity, setStudioCity] = useState(studioData?.city || 'Mumbai');
  const [studioPhone, setStudioPhone] = useState(studioData?.phone || '+91 98201 44512');
  const [studioEmail, setStudioEmail] = useState(studioData?.email || 'contact@movementsanctuary.com');
  const [studioGstin, setStudioGstin] = useState(studioData?.gstin || '27AABCU9603R1ZM');
  const [studioUpiId, setStudioUpiId] = useState(studioData?.upiId || 'movement.sanctuary@hdfcbank');
  const [studioBio, setStudioBio] = useState(
    studioData?.about || 'Premium 4,500 sq.ft state-of-the-art dance facility with sprung Harlequin hardwood flooring.'
  );
  const [studioLogoUrl, setStudioLogoUrl] = useState(
    studioData?.logo || 'https://images.unsplash.com/photo-1547153760-18fc86324498?w=200'
  );
  const [isSavedSuccess, setIsSavedSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Modal States
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [addStudentDefaultOption, setAddStudentDefaultOption] = useState<1 | 2 | 3>(1);
  const [showCreateBatchModal, setShowCreateBatchModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [showGenerateInvoiceModal, setShowGenerateInvoiceModal] = useState(false);

  // New Invoice Generator Form State
  const [invStudentName, setInvStudentName] = useState('Ananya Sen');
  const [invStudentPhone, setInvStudentPhone] = useState('+91 98201 33221');
  const [invStudentEmail, setInvStudentEmail] = useState('ananya.sen@gmail.com');
  const [invItemDesc, setInvItemDesc] = useState('Contemporary Foundations 6-Week Cohort');
  const [invBaseAmount, setInvBaseAmount] = useState<number>(6500);
  const [invGstRate, setInvGstRate] = useState<number>(18);
  const [invPaymentMethod, setInvPaymentMethod] = useState<string>('UPI');
  const [invPaymentStatus, setInvPaymentStatus] = useState<'Paid' | 'Pending'>('Paid');
  const [invNotes, setInvNotes] = useState('Thank you for dancing with us. Admission non-transferable.');

  // Publishing Class / Workshop State
  const [newClassType, setNewClassType] = useState<'regular' | 'workshop'>('regular');
  const [newClassTitle, setNewClassTitle] = useState('');
  const [newClassCategory, setNewClassCategory] = useState('Contemporary');
  const [newClassInstructor, setNewClassInstructor] = useState('Sarah Jenkins');
  const [newClassDayTime, setNewClassDayTime] = useState('Mon & Wed • 07:00 PM - 08:30 PM');
  const [newClassPrice, setNewClassPrice] = useState<number>(750);
  const [newClassSpots, setNewClassSpots] = useState<number>(20);
  const [newClassDescription, setNewClassDescription] = useState('');
  const [publishSuccessMessage, setPublishSuccessMessage] = useState('');

  // Handle Logo Upload from local computer
  const handleLogoFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const resultStr = event.target.result as string;
          setStudioLogoUrl(resultStr);
          if (onUpdateStudioProfile) {
            onUpdateStudioProfile({ logo: resultStr });
          }
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Save Studio Profile & Publish Live
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (onUpdateStudioProfile) {
      onUpdateStudioProfile({
        name: studioName,
        address: studioAddress,
        city: studioCity,
        phone: studioPhone,
        email: studioEmail,
        gstin: studioGstin,
        upiId: studioUpiId,
        about: studioBio,
        logo: studioLogoUrl,
      });
    }
    setIsSavedSuccess(true);
    setTimeout(() => {
      setIsSavedSuccess(false);
      setShowSettingsModal(false);
    }, 1500);
  };

  // Generate Invoice Handler
  const handleGenerateInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    const taxAmt = Math.round((invBaseAmount * invGstRate) / 100);
    const totalAmt = invBaseAmount + taxAmt;
    const invNum = `INV-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const todayStr = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

    const newRecord: StudioPaymentRecord = {
      id: `pay-${Date.now()}`,
      invoiceNumber: invNum,
      studentName: invStudentName,
      studentPhone: invStudentPhone,
      studentEmail: invStudentEmail,
      amount: totalAmt,
      subtotal: invBaseAmount,
      taxAmount: taxAmt,
      gstRate: invGstRate,
      date: todayStr,
      dueDate: invPaymentStatus === 'Pending' ? 'In 7 Days' : todayStr,
      itemDescription: invItemDesc,
      paymentMethod: invPaymentMethod,
      status: invPaymentStatus === 'Paid' ? 'Paid' : 'Pending',
      notes: invNotes,
      studioLogoUrl: studioLogoUrl,
      studioName: studioName,
      studioAddress: studioAddress,
      studioGstin: studioGstin,
      studioUpiId: studioUpiId,
    };

    setPaymentsList([newRecord, ...paymentsList]);
    if (onAddPaymentRecord) {
      onAddPaymentRecord(newRecord);
    }
    setShowGenerateInvoiceModal(false);
    setActiveSection('FINANCE');
  };

  // 1-Click Invoice prefill from student or batch
  const handlePrefillInvoice = (studentName: string, amount: number, batchName: string) => {
    setInvStudentName(studentName);
    setInvBaseAmount(amount);
    setInvItemDesc(`${batchName} - Cohort Fee`);
    setShowGenerateInvoiceModal(true);
  };

  // Publish Class / Workshop Handler
  const handlePublishClassOrWorkshop = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClassTitle.trim()) return;

    const newClassItem: DanceClass = {
      id: `cls-${Date.now()}`,
      title: newClassTitle.trim(),
      category: newClassCategory,
      instructor: newClassInstructor,
      studio: studioName,
      location: `${studioName}, ${studioAddress.split(',')[0]}`,
      city: studioCity,
      dayTime: newClassDayTime,
      date: newClassDayTime.split('•')[0]?.trim() || 'Weekly',
      time: newClassDayTime.split('•')[1]?.trim() || '07:00 PM',
      price: newClassPrice,
      currency: '₹',
      image:
        newClassCategory === 'Contemporary'
          ? 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=600'
          : newClassCategory === 'Hip-Hop'
          ? 'https://images.unsplash.com/photo-1535525153412-5a42439a210d?w=600'
          : 'https://images.unsplash.com/photo-1547153760-18fc86324498?w=600',
      level: 'All Levels' as any,
      spotsLeft: newClassSpots,
      totalSpots: newClassSpots,
      description: newClassDescription || `Official ${newClassCategory} session at ${studioName} with ${newClassInstructor}.`,
    };

    if (newClassType === 'regular' && onAddClass) {
      onAddClass(newClassItem);
    } else if (newClassType === 'workshop' && onAddWorkshop) {
      onAddWorkshop(newClassItem);
    }

    setPublishSuccessMessage(`✓ Successfully published "${newClassTitle}" to the main portal!`);
    setNewClassTitle('');
    setNewClassDescription('');
    setTimeout(() => {
      setPublishSuccessMessage('');
      setShowPublishModal(false);
    }, 2500);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-3.5 sm:px-6 py-4 space-y-4 pb-20 text-[#fafafa] font-sans">
      {/* 1. Header Banner with Studio Logo & DANCEONE STUDIO Brand */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#0c0d12] p-4 sm:p-5 rounded-2xl border border-white/[0.1] shadow-md">
        <div className="flex items-center gap-3.5">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-[#060608] border border-white/[0.15] overflow-hidden shrink-0 flex items-center justify-center p-1 shadow-sm">
            {studioLogoUrl ? (
              <img
                src={studioLogoUrl}
                alt={studioName}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <Building2 className="w-7 h-7 text-[#10b981]" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase tracking-wider text-[#10b981] font-bold">
                DANCEONE STUDIO
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse" />
              <span className="text-xs font-mono text-[#a1a1aa]">Live Sync</span>
            </div>
            <h1 className="text-base sm:text-xl font-bold text-white tracking-tight leading-snug">
              {studioName}
            </h1>
            <p className="text-xs text-[#a1a1aa] truncate max-w-sm mt-0.5">{studioAddress}</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => onNavigate('studio-profile')}
            className="px-3.5 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-white font-mono text-xs flex items-center gap-1.5 transition-all border border-white/[0.08]"
          >
            <span>Public Portal</span>
            <ExternalLink className="w-3.5 h-3.5 text-[#38bdf8]" />
          </button>
          <button
            onClick={() => setShowPublishModal(true)}
            className="px-3.5 py-2 rounded-xl bg-[#38bdf8]/15 border border-[#38bdf8]/30 hover:bg-[#38bdf8] text-[#38bdf8] hover:text-black font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Publish Class</span>
          </button>
          <button
            onClick={() => setShowGenerateInvoiceModal(true)}
            className="px-4 py-2 rounded-xl bg-[#10b981] hover:bg-[#059669] text-white font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-md transition-all active:scale-95"
          >
            <CircleDollarSign className="w-4 h-4" />
            <span>+ Invoice</span>
          </button>
          <button
            onClick={() => setShowSettingsModal(true)}
            className="p-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-[#a1a1aa] hover:text-white transition-all border border-white/[0.08]"
            title="Studio Settings & Logo"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. Top-Level Main Studio Hierarchy Navigation Tabs */}
      <div className="bg-[#0c0d12] p-1.5 rounded-2xl border border-white/[0.08] overflow-x-auto no-scrollbar">
        <div className="flex sm:grid sm:grid-cols-6 gap-1.5 min-w-max sm:min-w-0">
          {(['DASHBOARD', 'BATCHES', 'STUDENTS', 'ATTENDANCE', 'FINANCE', 'TEACHERS'] as const).map((section) => {
            const isActive = activeSection === section;
            return (
              <button
                key={section}
                onClick={() => setActiveSection(section)}
                className={`py-2 px-3 sm:px-4 rounded-xl text-xs sm:text-sm font-mono tracking-wider transition-all flex items-center justify-center gap-2 shrink-0 ${
                  isActive
                    ? 'bg-white text-black font-bold shadow-md'
                    : 'text-[#9e9ea7] hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                {section === 'DASHBOARD' && <Building2 className="w-4 h-4" />}
                {section === 'BATCHES' && <Layers className="w-4 h-4" />}
                {section === 'STUDENTS' && <Users className="w-4 h-4" />}
                {section === 'ATTENDANCE' && <CheckCircle2 className="w-4 h-4" />}
                {section === 'FINANCE' && <DollarSign className="w-4 h-4" />}
                {section === 'TEACHERS' && <Award className="w-4 h-4" />}
                <span>{section}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. SECTION VIEWS */}
      {/* ========================================================================= */}
      {activeSection === 'DASHBOARD' && (
        <StudioDashboardTab
          batches={batches}
          students={students}
          teachers={teachers}
          onSelectSection={setActiveSection}
          onOpenAddStudent={() => {
            setAddStudentDefaultOption(1);
            setShowAddStudentModal(true);
          }}
          onOpenCreateBatch={() => setShowCreateBatchModal(true)}
          onOpenMarkAttendance={() => setActiveSection('ATTENDANCE')}
          onOpenRecordPayment={() => setShowGenerateInvoiceModal(true)}
        />
      )}

      {activeSection === 'BATCHES' && (
        <StudioBatchesTab
          batches={batches}
          students={students}
          selectedBatchId={selectedBatchId}
          onSelectBatchId={setSelectedBatchId}
          onOpenCreateBatch={() => setShowCreateBatchModal(true)}
          onGenerateInvoiceForStudent={handlePrefillInvoice}
        />
      )}

      {activeSection === 'STUDENTS' && (
        <StudioStudentsTab
          students={students}
          batches={batches}
          onOpenAddStudentModal={(opt) => {
            setAddStudentDefaultOption(opt || 1);
            setShowAddStudentModal(true);
          }}
          onGenerateInvoice={handlePrefillInvoice}
        />
      )}

      {activeSection === 'ATTENDANCE' && (
        <StudioAttendanceTab batches={batches} students={students} />
      )}

      {activeSection === 'FINANCE' && (
        <StudioFinanceTab
          payments={paymentsList}
          memberships={memberships}
          settlements={settlements}
          studioLogoUrl={studioLogoUrl}
          studioName={studioName}
          studioAddress={studioAddress}
          studioGstin={studioGstin}
          studioUpiId={studioUpiId}
          onOpenGenerateInvoiceModal={() => setShowGenerateInvoiceModal(true)}
        />
      )}

      {activeSection === 'TEACHERS' && (
        <StudioTeachersTab
          teachers={teachers}
          batches={batches}
          onSelectBatch={(bId) => {
            setSelectedBatchId(bId);
            setActiveSection('BATCHES');
          }}
        />
      )}

      {/* ========================================================================= */}
      {/* 4. MODALS */}
      {/* ========================================================================= */}

      {/* Add Student Modal (3 Options: Search ID, Invite, Manual) */}
      <AddStudentModal
        isOpen={showAddStudentModal}
        onClose={() => setShowAddStudentModal(false)}
        defaultOption={addStudentDefaultOption}
        batches={batches}
        onAddStudentSuccess={(newStudent) => {
          setStudents([newStudent, ...students]);
          setActiveSection('STUDENTS');
        }}
      />

      {/* Create Batch Modal */}
      <CreateBatchModal
        isOpen={showCreateBatchModal}
        onClose={() => setShowCreateBatchModal(false)}
        onAddBatchSuccess={(newBatch) => {
          setBatches([newBatch, ...batches]);
          setSelectedBatchId(newBatch.id);
          setActiveSection('BATCHES');
        }}
      />

      {/* Generate Tax Invoice Modal */}
      {showGenerateInvoiceModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#18181b] border border-[#27272a] rounded-3xl max-w-lg w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#27272a] pb-3">
              <div>
                <span className="text-xs font-black uppercase text-[#10b981]">GST INVOICING</span>
                <h3 className="font-black text-white text-base">Generate Fee Receipt</h3>
              </div>
              <button onClick={() => setShowGenerateInvoiceModal(false)} className="text-[#71717a] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleGenerateInvoice} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[#a1a1aa] block mb-1">Student Name</label>
                  <input
                    type="text"
                    required
                    value={invStudentName}
                    onChange={(e) => setInvStudentName(e.target.value)}
                    className="w-full px-3 py-2 bg-[#09090b] border border-[#27272a] rounded-xl text-white outline-none"
                  />
                </div>
                <div>
                  <label className="text-[#a1a1aa] block mb-1">Student Mobile</label>
                  <input
                    type="tel"
                    required
                    value={invStudentPhone}
                    onChange={(e) => setInvStudentPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-[#09090b] border border-[#27272a] rounded-xl text-white outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[#a1a1aa] block mb-1">Fee Description / Item</label>
                <input
                  type="text"
                  required
                  value={invItemDesc}
                  onChange={(e) => setInvItemDesc(e.target.value)}
                  className="w-full px-3 py-2 bg-[#09090b] border border-[#27272a] rounded-xl text-white outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[#a1a1aa] block mb-1">Base Amount (₹)</label>
                  <input
                    type="number"
                    required
                    min={100}
                    value={invBaseAmount}
                    onChange={(e) => setInvBaseAmount(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-[#09090b] border border-[#27272a] rounded-xl text-white outline-none"
                  />
                </div>
                <div>
                  <label className="text-[#a1a1aa] block mb-1">GST Rate</label>
                  <select
                    value={invGstRate}
                    onChange={(e) => setInvGstRate(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-[#09090b] border border-[#27272a] rounded-xl text-white font-bold outline-none"
                  >
                    <option value={18}>18% GST (Standard)</option>
                    <option value={12}>12% GST</option>
                    <option value={5}>5% GST</option>
                    <option value={0}>0% (Tax Exempt)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[#a1a1aa] block mb-1">Payment Method</label>
                  <select
                    value={invPaymentMethod}
                    onChange={(e) => setInvPaymentMethod(e.target.value)}
                    className="w-full px-3 py-2 bg-[#09090b] border border-[#27272a] rounded-xl text-white font-bold outline-none"
                  >
                    <option value="UPI">UPI (Google Pay/PhonePe)</option>
                    <option value="Card">Credit/Debit Card</option>
                    <option value="Net Banking">Net Banking</option>
                    <option value="Cash">Cash at Studio Desk</option>
                  </select>
                </div>
                <div>
                  <label className="text-[#a1a1aa] block mb-1">Status</label>
                  <select
                    value={invPaymentStatus}
                    onChange={(e) => setInvPaymentStatus(e.target.value as any)}
                    className="w-full px-3 py-2 bg-[#09090b] border border-[#27272a] rounded-xl text-white font-bold outline-none"
                  >
                    <option value="Paid">Paid / Collected</option>
                    <option value="Pending">Pending / Overdue</option>
                  </select>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#09090b] border border-[#27272a] flex items-center justify-between text-xs">
                <span className="text-[#a1a1aa]">Total Tax Invoice Amount:</span>
                <span className="text-base font-black text-[#22c55e]">
                  ₹{(invBaseAmount + Math.round((invBaseAmount * invGstRate) / 100)).toLocaleString()}
                </span>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowGenerateInvoiceModal(false)}
                  className="px-4 py-2 rounded-xl bg-[#27272a] text-white font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#10b981] hover:bg-[#059669] text-white font-bold"
                >
                  Create & Record Invoice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Publish Class / Workshop Modal */}
      {showPublishModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#18181b] border border-[#27272a] rounded-3xl max-w-lg w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#27272a] pb-3">
              <div>
                <span className="text-xs font-black uppercase text-[#3b82f6]">PUBLIC DISCOVERY</span>
                <h3 className="font-black text-white text-base">Publish to DanceOne Portal</h3>
              </div>
              <button onClick={() => setShowPublishModal(false)} className="text-[#71717a] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handlePublishClassOrWorkshop} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-2 bg-[#09090b] p-1 rounded-xl border border-[#27272a]">
                <button
                  type="button"
                  onClick={() => setNewClassType('regular')}
                  className={`py-2 text-xs font-bold rounded-lg transition-all ${
                    newClassType === 'regular' ? 'bg-[#3b82f6] text-white' : 'text-[#a1a1aa]'
                  }`}
                >
                  Regular Drop-in Class
                </button>
                <button
                  type="button"
                  onClick={() => setNewClassType('workshop')}
                  className={`py-2 text-xs font-bold rounded-lg transition-all ${
                    newClassType === 'workshop' ? 'bg-[#f97316] text-white' : 'text-[#a1a1aa]'
                  }`}
                >
                  Dance Workshop
                </button>
              </div>

              <div>
                <label className="text-[#a1a1aa] block mb-1">Session Title</label>
                <input
                  type="text"
                  required
                  value={newClassTitle}
                  onChange={(e) => setNewClassTitle(e.target.value)}
                  placeholder="e.g. Masterclass: Afro-Beats & Commercial Grooves"
                  className="w-full px-3 py-2 bg-[#09090b] border border-[#27272a] rounded-xl text-white outline-none focus:border-[#3b82f6]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[#a1a1aa] block mb-1">Dance Style</label>
                  <select
                    value={newClassCategory}
                    onChange={(e) => setNewClassCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-[#09090b] border border-[#27272a] rounded-xl text-white font-bold outline-none"
                  >
                    <option value="Contemporary">Contemporary</option>
                    <option value="Hip-Hop">Hip-Hop</option>
                    <option value="Bollywood">Bollywood</option>
                    <option value="Ballet">Ballet</option>
                    <option value="Heels">Heels</option>
                    <option value="Kathak">Kathak</option>
                  </select>
                </div>

                <div>
                  <label className="text-[#a1a1aa] block mb-1">Lead Faculty</label>
                  <input
                    type="text"
                    required
                    value={newClassInstructor}
                    onChange={(e) => setNewClassInstructor(e.target.value)}
                    className="w-full px-3 py-2 bg-[#09090b] border border-[#27272a] rounded-xl text-white outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[#a1a1aa] block mb-1">Ticket / Class Price (₹)</label>
                  <input
                    type="number"
                    required
                    min={100}
                    value={newClassPrice}
                    onChange={(e) => setNewClassPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-[#09090b] border border-[#27272a] rounded-xl text-white outline-none"
                  />
                </div>

                <div>
                  <label className="text-[#a1a1aa] block mb-1">Available Spots</label>
                  <input
                    type="number"
                    required
                    min={1}
                    max={100}
                    value={newClassSpots}
                    onChange={(e) => setNewClassSpots(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-[#09090b] border border-[#27272a] rounded-xl text-white outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[#a1a1aa] block mb-1">Schedule & Slot</label>
                <input
                  type="text"
                  required
                  value={newClassDayTime}
                  onChange={(e) => setNewClassDayTime(e.target.value)}
                  className="w-full px-3 py-2 bg-[#09090b] border border-[#27272a] rounded-xl text-white outline-none"
                />
              </div>

              {publishSuccessMessage && (
                <div className="p-3 rounded-xl bg-[#22c55e]/20 border border-[#22c55e]/50 text-[#22c55e] font-bold">
                  {publishSuccessMessage}
                </div>
              )}

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowPublishModal(false)}
                  className="px-4 py-2 rounded-xl bg-[#27272a] text-white font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#3b82f6] hover:bg-[#2563eb] text-white font-bold"
                >
                  Publish to Main App
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Studio Settings & Custom Logo Upload Modal */}
      {showSettingsModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#18181b] border border-[#27272a] rounded-3xl max-w-lg w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#27272a] pb-3">
              <div>
                <span className="text-xs font-black uppercase text-[#10b981]">STUDIO PROFILE</span>
                <h3 className="font-black text-white text-base">Studio Identity & Logo</h3>
              </div>
              <button onClick={() => setShowSettingsModal(false)} className="text-[#71717a] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Logo Upload Section */}
            <div className="p-4 rounded-2xl bg-[#09090b] border border-[#27272a] flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-[#18181b] border border-[#27272a] overflow-hidden flex items-center justify-center shrink-0">
                {studioLogoUrl ? (
                  <img
                    src={studioLogoUrl}
                    alt={studioName}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Building2 className="w-8 h-8 text-[#71717a]" />
                )}
              </div>
              <div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleLogoFileUpload}
                  accept="image/*"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3.5 py-1.5 rounded-xl bg-[#10b981] hover:bg-[#059669] text-white font-bold text-xs flex items-center gap-1.5"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload Logo File</span>
                </button>
                <p className="text-xs text-[#71717a] mt-1">Appears on invoices and public portal</p>
              </div>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-3 text-xs">
              <div>
                <label className="text-[#a1a1aa] block mb-1">Studio Name</label>
                <input
                  type="text"
                  required
                  value={studioName}
                  onChange={(e) => setStudioName(e.target.value)}
                  className="w-full px-3 py-2 bg-[#09090b] border border-[#27272a] rounded-xl text-white outline-none"
                />
              </div>

              <div>
                <label className="text-[#a1a1aa] block mb-1">Address</label>
                <input
                  type="text"
                  required
                  value={studioAddress}
                  onChange={(e) => setStudioAddress(e.target.value)}
                  className="w-full px-3 py-2 bg-[#09090b] border border-[#27272a] rounded-xl text-white outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[#a1a1aa] block mb-1">GSTIN</label>
                  <input
                    type="text"
                    value={studioGstin}
                    onChange={(e) => setStudioGstin(e.target.value)}
                    className="w-full px-3 py-2 bg-[#09090b] border border-[#27272a] rounded-xl text-white outline-none"
                  />
                </div>
                <div>
                  <label className="text-[#a1a1aa] block mb-1">UPI ID</label>
                  <input
                    type="text"
                    value={studioUpiId}
                    onChange={(e) => setStudioUpiId(e.target.value)}
                    className="w-full px-3 py-2 bg-[#09090b] border border-[#27272a] rounded-xl text-white outline-none"
                  />
                </div>
              </div>

              {isSavedSuccess && (
                <div className="p-3 rounded-xl bg-[#22c55e]/20 border border-[#22c55e]/50 text-[#22c55e] font-bold">
                  ✓ Studio profile & logo synced to public portal!
                </div>
              )}

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowSettingsModal(false)}
                  className="px-4 py-2 rounded-xl bg-[#27272a] text-white font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#10b981] hover:bg-[#059669] text-white font-bold text-xs"
                >
                  Save & Sync
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

