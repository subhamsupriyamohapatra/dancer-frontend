import React, { useState, useRef } from 'react';
import {
  X,
  Upload,
  Building2,
  Check,
  Search,
  Mail,
  UserPlus,
  Layers,
  CircleDollarSign,
  Plus,
  Flame,
  CheckCircle2,
} from 'lucide-react';
import { StudioBatch, StudioStudent, StudioPaymentRecord, DanceClass } from '../../types';

// ==========================================
// 1. ADD STUDENT MODAL (3 Options Flow)
// ==========================================
interface AddStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultOption?: 1 | 2 | 3;
  batches: StudioBatch[];
  onAddStudentSuccess: (student: StudioStudent) => void;
}

export const AddStudentModal: React.FC<AddStudentModalProps> = ({
  isOpen,
  onClose,
  defaultOption = 1,
  batches,
  onAddStudentSuccess,
}) => {
  const [activeOption, setActiveOption] = useState<1 | 2 | 3>(defaultOption);

  // Option 1: Search Existing
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFoundUser, setSelectedFoundUser] = useState<any | null>(null);
  const [selectedBatchId, setSelectedBatchId] = useState(batches[0]?.id || 'batch-1');

  // Option 2: Invite
  const [inviteName, setInviteName] = useState('');
  const [invitePhone, setInvitePhone] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteSent, setInviteSent] = useState(false);

  // Option 3: Manual
  const [manualName, setManualName] = useState('');
  const [manualPhone, setManualPhone] = useState('');
  const [manualEmail, setManualEmail] = useState('');
  const [manualMembership, setManualMembership] = useState('Standard');

  if (!isOpen) return null;

  // Mock DanceOne Network Users for Option 1
  const MOCK_EXISTING_DANCERS = [
    { id: 'do-1', name: 'Nehal Suna', phone: '+91 98201 88990', email: 'nehal.suna@gmail.com', danceOneId: 'DO-89211', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100', otherStudios: ['The Danceworx', 'Big Dance Centre'] },
    { id: 'do-2', name: 'Rohan Mehta', phone: '+91 98110 55443', email: 'rohan.mehta@gmail.com', danceOneId: 'DO-44120', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100', otherStudios: ['Studio 19'] },
    { id: 'do-3', name: 'Aarav Nair', phone: '+91 99203 11223', email: 'aarav.n@gmail.com', danceOneId: 'DO-90312', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100', otherStudios: ['Tangerine Arts'] },
  ];

  const filteredFoundDancers = MOCK_EXISTING_DANCERS.filter(
    (d) =>
      d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.phone.includes(searchQuery) ||
      d.danceOneId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleConfirmOption1 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFoundUser) return;

    const chosenBatch = batches.find((b) => b.id === selectedBatchId) || batches[0];
    const newStudent: StudioStudent = {
      id: `stud-${Date.now()}`,
      name: selectedFoundUser.name,
      phone: selectedFoundUser.phone,
      email: selectedFoundUser.email,
      danceOneId: selectedFoundUser.danceOneId,
      batchId: chosenBatch.id,
      batchName: chosenBatch.name,
      membershipType: 'Standard',
      feeStatus: 'Paid',
      attendanceStreak: 12,
      status: 'Active',
      avatar: selectedFoundUser.avatar,
    };

    onAddStudentSuccess(newStudent);
    onClose();
  };

  const handleSendInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteName || !invitePhone) return;

    setInviteSent(true);
    setTimeout(() => {
      setInviteSent(false);
      onClose();
    }, 2000);
  };

  const handleAddManual = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualName || !manualPhone) return;

    const chosenBatch = batches.find((b) => b.id === selectedBatchId) || batches[0];
    const generatedDanceOneId = `DO-${Math.floor(10000 + Math.random() * 90000)}`;

    const newStudent: StudioStudent = {
      id: `stud-${Date.now()}`,
      name: manualName,
      phone: manualPhone,
      email: manualEmail || `${manualName.toLowerCase().replace(/\s+/g, '')}@danceone.app`,
      danceOneId: generatedDanceOneId,
      batchId: chosenBatch.id,
      batchName: chosenBatch.name,
      membershipType: manualMembership as any,
      feeStatus: 'Paid',
      attendanceStreak: 1,
      status: 'Active',
    };

    onAddStudentSuccess(newStudent);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#18181b] border border-[#27272a] rounded-3xl max-w-lg w-full p-6 space-y-5">
        <div className="flex items-center justify-between border-b border-[#27272a] pb-3">
          <div>
            <span className="text-xs font-black uppercase text-[#10b981]">DANCEONE STUDENT ONBOARDING</span>
            <h3 className="font-black text-white text-base">Add Student to Studio</h3>
          </div>
          <button onClick={onClose} className="text-[#71717a] hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 3 Selection Tabs */}
        <div className="grid grid-cols-3 gap-1 bg-[#09090b] p-1 rounded-2xl border border-[#27272a]">
          <button
            onClick={() => setActiveOption(1)}
            className={`py-2 text-xs font-bold rounded-xl transition-all ${
              activeOption === 1 ? 'bg-[#3b82f6] text-white shadow-md' : 'text-[#a1a1aa] hover:text-white'
            }`}
          >
            1. Search ID
          </button>
          <button
            onClick={() => setActiveOption(2)}
            className={`py-2 text-xs font-bold rounded-xl transition-all ${
              activeOption === 2 ? 'bg-[#10b981] text-white shadow-md' : 'text-[#a1a1aa] hover:text-white'
            }`}
          >
            2. Invite
          </button>
          <button
            onClick={() => setActiveOption(3)}
            className={`py-2 text-xs font-bold rounded-xl transition-all ${
              activeOption === 3 ? 'bg-[#a855f7] text-white shadow-md' : 'text-[#a1a1aa] hover:text-white'
            }`}
          >
            3. Manual
          </button>
        </div>

        {/* OPTION 1: SEARCH DANCEONE USER */}
        {activeOption === 1 && (
          <form onSubmit={handleConfirmOption1} className="space-y-4 text-xs">
            <div className="space-y-2">
              <label className="text-[#a1a1aa] font-medium block">Search DanceOne Dancer Directory</label>
              <div className="relative">
                <Search className="w-4 h-4 text-[#71717a] absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by Name, Phone, Email, or DanceOne ID (e.g. DO-89211)..."
                  className="w-full pl-9 pr-3 py-2 bg-[#09090b] border border-[#27272a] rounded-xl text-white outline-none focus:border-[#3b82f6]"
                />
              </div>
            </div>

            {/* Found Users List */}
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {filteredFoundDancers.map((user) => {
                const isSelected = selectedFoundUser?.id === user.id;
                return (
                  <div
                    key={user.id}
                    onClick={() => setSelectedFoundUser(user)}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'bg-[#3b82f6]/15 border-[#3b82f6]'
                        : 'bg-[#09090b] border-[#27272a] hover:border-[#3f3f46]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={user.avatar}
                        alt={user.name}
                        referrerPolicy="no-referrer"
                        className="w-10 h-10 rounded-full object-cover border border-[#27272a]"
                      />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-white">{user.name}</span>
                          <span className="text-xs font-mono text-[#3b82f6] px-1 rounded bg-[#3b82f6]/20">
                            {user.danceOneId}
                          </span>
                        </div>
                        <span className="text-xs text-[#71717a] block">{user.phone} • {user.email}</span>
                      </div>
                    </div>

                    <div className="w-5 h-5 rounded-full border border-[#27272a] flex items-center justify-center">
                      {isSelected && <Check className="w-3 h-3 text-[#3b82f6]" />}
                    </div>
                  </div>
                );
              })}
            </div>

            {selectedFoundUser && (
              <div className="space-y-2 pt-2 border-t border-[#27272a]">
                <label className="text-[#a1a1aa] font-medium block">Assign to Cohort Batch</label>
                <select
                  value={selectedBatchId}
                  onChange={(e) => setSelectedBatchId(e.target.value)}
                  className="w-full px-3 py-2 bg-[#09090b] border border-[#27272a] rounded-xl text-white font-bold outline-none"
                >
                  {batches.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name} ({b.style}) — ₹{b.fee}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="pt-2 flex items-center justify-end gap-2">
              <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl bg-[#27272a] text-white font-bold">
                Cancel
              </button>
              <button
                type="submit"
                disabled={!selectedFoundUser}
                className="px-5 py-2 rounded-xl bg-[#3b82f6] hover:bg-[#2563eb] text-white font-bold disabled:opacity-50"
              >
                Add Dancer to Cohort
              </button>
            </div>
          </form>
        )}

        {/* OPTION 2: INVITE STUDENT */}
        {activeOption === 2 && (
          <form onSubmit={handleSendInvite} className="space-y-3.5 text-xs">
            <p className="text-[#a1a1aa]">
              Enter student details. DanceOne will send an official SMS & WhatsApp link to join your studio.
            </p>

            <div>
              <label className="text-[#a1a1aa] block mb-1">Student Full Name</label>
              <input
                type="text"
                required
                value={inviteName}
                onChange={(e) => setInviteName(e.target.value)}
                placeholder="e.g. Zoya Akhtar"
                className="w-full px-3.5 py-2 bg-[#09090b] border border-[#27272a] rounded-xl text-white outline-none focus:border-[#10b981]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[#a1a1aa] block mb-1">Mobile Phone</label>
                <input
                  type="tel"
                  required
                  value={invitePhone}
                  onChange={(e) => setInvitePhone(e.target.value)}
                  placeholder="+91 98200 00000"
                  className="w-full px-3.5 py-2 bg-[#09090b] border border-[#27272a] rounded-xl text-white outline-none focus:border-[#10b981]"
                />
              </div>
              <div>
                <label className="text-[#a1a1aa] block mb-1">Email Address</label>
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="student@gmail.com"
                  className="w-full px-3.5 py-2 bg-[#09090b] border border-[#27272a] rounded-xl text-white outline-none focus:border-[#10b981]"
                />
              </div>
            </div>

            {inviteSent && (
              <div className="p-3 rounded-xl bg-[#22c55e]/20 border border-[#22c55e]/50 text-[#22c55e] font-bold">
                ✓ Invitation sent via WhatsApp & SMS to {invitePhone}!
              </div>
            )}

            <div className="pt-2 flex items-center justify-end gap-2">
              <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl bg-[#27272a] text-white font-bold">
                Cancel
              </button>
              <button type="submit" className="px-5 py-2 rounded-xl bg-[#10b981] hover:bg-[#059669] text-white font-bold">
                Send DanceOne Invite
              </button>
            </div>
          </form>
        )}

        {/* OPTION 3: MANUAL CREATION */}
        {activeOption === 3 && (
          <form onSubmit={handleAddManual} className="space-y-3.5 text-xs">
            <p className="text-[#a1a1aa]">
              Creates a linked provisional profile. When the student signs up on DanceOne, their activity automatically connects with zero duplicates.
            </p>

            <div>
              <label className="text-[#a1a1aa] block mb-1">Full Name</label>
              <input
                type="text"
                required
                value={manualName}
                onChange={(e) => setManualName(e.target.value)}
                placeholder="e.g. Siddharth Verma"
                className="w-full px-3.5 py-2 bg-[#09090b] border border-[#27272a] rounded-xl text-white outline-none focus:border-[#a855f7]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[#a1a1aa] block mb-1">Phone</label>
                <input
                  type="tel"
                  required
                  value={manualPhone}
                  onChange={(e) => setManualPhone(e.target.value)}
                  placeholder="+91 98000 00000"
                  className="w-full px-3.5 py-2 bg-[#09090b] border border-[#27272a] rounded-xl text-white outline-none focus:border-[#a855f7]"
                />
              </div>
              <div>
                <label className="text-[#a1a1aa] block mb-1">Email</label>
                <input
                  type="email"
                  value={manualEmail}
                  onChange={(e) => setManualEmail(e.target.value)}
                  placeholder="sid@gmail.com"
                  className="w-full px-3.5 py-2 bg-[#09090b] border border-[#27272a] rounded-xl text-white outline-none focus:border-[#a855f7]"
                />
              </div>
            </div>

            <div>
              <label className="text-[#a1a1aa] block mb-1">Assign Batch</label>
              <select
                value={selectedBatchId}
                onChange={(e) => setSelectedBatchId(e.target.value)}
                className="w-full px-3 py-2 bg-[#09090b] border border-[#27272a] rounded-xl text-white font-bold outline-none"
              >
                {batches.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name} ({b.style}) — ₹{b.fee}
                  </option>
                ))}
              </select>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl bg-[#27272a] text-white font-bold">
                Cancel
              </button>
              <button type="submit" className="px-5 py-2 rounded-xl bg-[#a855f7] hover:bg-[#9333ea] text-white font-bold">
                Create & Link Profile
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

// ==========================================
// 2. CREATE BATCH MODAL
// ==========================================
interface CreateBatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddBatchSuccess: (batch: StudioBatch) => void;
}

export const CreateBatchModal: React.FC<CreateBatchModalProps> = ({
  isOpen,
  onClose,
  onAddBatchSuccess,
}) => {
  const [batchName, setBatchName] = useState('');
  const [batchStyle, setBatchStyle] = useState('Contemporary');
  const [batchInstructor, setBatchInstructor] = useState('Sarah Jenkins');
  const [batchRoom, setBatchRoom] = useState('Studio A (Grand Hall)');
  const [batchDays, setBatchDays] = useState('Mon & Wed');
  const [batchTime, setBatchTime] = useState('07:00 PM - 08:30 PM');
  const [batchCapacity, setBatchCapacity] = useState<number>(20);
  const [batchFee, setBatchFee] = useState<number>(6500);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!batchName.trim()) return;

    const newBatch: StudioBatch = {
      id: `batch-${Date.now()}`,
      name: batchName.trim(),
      style: batchStyle,
      instructor: batchInstructor,
      room: batchRoom,
      days: batchDays,
      time: batchTime,
      capacity: batchCapacity,
      enrolled: 0,
      fee: batchFee,
      status: 'Enrolling Now',
      startDate: '1 Sep 2026',
      totalSessions: 8,
    };

    onAddBatchSuccess(newBatch);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#18181b] border border-[#27272a] rounded-3xl max-w-lg w-full p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-[#27272a] pb-3">
          <div>
            <span className="text-xs font-black uppercase text-[#10b981]">NEW COHORT</span>
            <h3 className="font-black text-white text-base">Create Dance Batch</h3>
          </div>
          <button onClick={onClose} className="text-[#71717a] hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div>
            <label className="text-[#a1a1aa] block mb-1">Batch Cohort Name</label>
            <input
              type="text"
              required
              value={batchName}
              onChange={(e) => setBatchName(e.target.value)}
              placeholder="e.g. Urban Choreography Intensive (Level 2)"
              className="w-full px-3.5 py-2 bg-[#09090b] border border-[#27272a] rounded-xl text-white outline-none focus:border-[#10b981]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[#a1a1aa] block mb-1">Dance Style</label>
              <select
                value={batchStyle}
                onChange={(e) => setBatchStyle(e.target.value)}
                className="w-full px-3 py-2 bg-[#09090b] border border-[#27272a] rounded-xl text-white font-bold outline-none"
              >
                <option value="Contemporary">Contemporary</option>
                <option value="Hip-Hop">Hip-Hop</option>
                <option value="Ballet">Ballet</option>
                <option value="Bollywood">Bollywood</option>
                <option value="Heels">Heels</option>
                <option value="Kathak">Kathak</option>
              </select>
            </div>

            <div>
              <label className="text-[#a1a1aa] block mb-1">Assigned Faculty</label>
              <input
                type="text"
                required
                value={batchInstructor}
                onChange={(e) => setBatchInstructor(e.target.value)}
                className="w-full px-3.5 py-2 bg-[#09090b] border border-[#27272a] rounded-xl text-white outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[#a1a1aa] block mb-1">Room Allocation</label>
              <select
                value={batchRoom}
                onChange={(e) => setBatchRoom(e.target.value)}
                className="w-full px-3 py-2 bg-[#09090b] border border-[#27272a] rounded-xl text-white font-bold outline-none"
              >
                <option value="Studio A (Grand Hall)">Studio A (Grand Hall)</option>
                <option value="Studio B (Ballet Suite)">Studio B (Ballet Suite)</option>
                <option value="Studio C (Urban Loft)">Studio C (Urban Loft)</option>
              </select>
            </div>

            <div>
              <label className="text-[#a1a1aa] block mb-1">Days & Timing</label>
              <input
                type="text"
                required
                value={`${batchDays} • ${batchTime}`}
                onChange={(e) => {
                  const parts = e.target.value.split('•');
                  setBatchDays(parts[0]?.trim() || 'Mon & Wed');
                  setBatchTime(parts[1]?.trim() || '07:00 PM');
                }}
                className="w-full px-3.5 py-2 bg-[#09090b] border border-[#27272a] rounded-xl text-white outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[#a1a1aa] block mb-1">Seat Capacity</label>
              <input
                type="number"
                required
                min={5}
                max={50}
                value={batchCapacity}
                onChange={(e) => setBatchCapacity(Number(e.target.value))}
                className="w-full px-3.5 py-2 bg-[#09090b] border border-[#27272a] rounded-xl text-white outline-none"
              />
            </div>

            <div>
              <label className="text-[#a1a1aa] block mb-1">Monthly Fee (₹)</label>
              <input
                type="number"
                required
                step={100}
                value={batchFee}
                onChange={(e) => setBatchFee(Number(e.target.value))}
                className="w-full px-3.5 py-2 bg-[#09090b] border border-[#27272a] rounded-xl text-white outline-none"
              />
            </div>
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl bg-[#27272a] text-white font-bold">
              Cancel
            </button>
            <button type="submit" className="px-5 py-2 rounded-xl bg-[#10b981] hover:bg-[#059669] text-white font-bold">
              Launch Cohort
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

