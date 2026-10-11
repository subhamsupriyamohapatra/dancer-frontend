import React, { useState } from 'react';
import {
  Shield,
  Users,
  Key,
  CheckCircle2,
  Lock,
  Plus,
  Mail,
  Smartphone,
  Sparkles,
} from 'lucide-react';
import { OrganizerStaffMember, OrganizerStaffRole } from '../../types/organizer';
import { ORGANIZER_STAFF_MEMBERS } from '../../data/organizerData';

export const StaffAndPermissionsView: React.FC = () => {
  const [staffList, setStaffList] = useState<OrganizerStaffMember[]>(ORGANIZER_STAFF_MEMBERS);
  const [showInviteModal, setShowInviteModal] = useState(false);

  const [inviteName, setInviteName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [invitePhone, setInvitePhone] = useState('');
  const [inviteRole, setInviteRole] = useState<OrganizerStaffRole>('registration_staff');

  const handleInviteStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteName.trim() || !inviteEmail.trim()) return;

    const newStaff: OrganizerStaffMember = {
      id: `staff-${Date.now()}`,
      name: inviteName.trim(),
      email: inviteEmail.trim(),
      phone: invitePhone.trim() || '+91 98000 00000',
      role: inviteRole,
      assignedEvents: ['org-ev-1'],
      status: 'invited',
      permissions: ['canScanQR', 'canCheckInDancers'],
    };

    setStaffList([...staffList, newStaff]);
    setInviteName('');
    setInviteEmail('');
    setInvitePhone('');
    setShowInviteModal(false);
    alert(`Invitation link and PIN sent to ${inviteEmail}`);
  };

  const getRoleBadgeColor = (role: OrganizerStaffRole) => {
    switch (role) {
      case 'event_owner':
      case 'co_organizer':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/40';
      case 'head_judge':
      case 'judge':
        return 'bg-[#eab308]/20 text-[#eab308] border-[#eab308]/40';
      case 'battle_mc':
        return 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40';
      case 'stage_manager':
        return 'bg-rose-500/20 text-rose-400 border-rose-500/40';
      case 'finance_manager':
        return 'bg-[#22c55e]/20 text-[#22c55e] border-[#22c55e]/40';
      default:
        return 'bg-zinc-800 text-zinc-300 border-zinc-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-3xl bg-[#18181b] border border-[#27272a]">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-black uppercase tracking-wider bg-purple-500/20 text-purple-400">
              ROLE-BASED ACCESS CONTROL (RBAC)
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white mt-1">Staff Team & Permissions</h2>
          <p className="text-xs text-[#a1a1aa]">
            12 Granular roles: Event Director, Head Judge, MC, DJ, Stage Manager, Gate Scanner, Finance, Media, Security.
          </p>
        </div>

        <button
          onClick={() => setShowInviteModal(true)}
          className="px-4 py-2.5 bg-[#eab308] hover:bg-[#facc15] text-black text-xs font-black rounded-2xl flex items-center gap-2 shadow-md self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>+ Invite Staff Member</span>
        </button>
      </div>

      {/* Staff Roster Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {staffList.map((st) => (
          <div
            key={st.id}
            className="p-5 rounded-3xl bg-[#18181b] border border-[#27272a] space-y-3 flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-black uppercase border ${getRoleBadgeColor(
                    st.role
                  )}`}
                >
                  {st.role.replace(/_/g, ' ')}
                </span>
                <span
                  className={`w-2 h-2 rounded-full ${
                    st.status === 'active' ? 'bg-[#22c55e]' : 'bg-amber-400'
                  }`}
                />
              </div>

              <h4 className="text-base font-black text-white">{st.name}</h4>
              <div className="text-xs text-[#a1a1aa] space-y-0.5">
                <p className="truncate">✉️ {st.email}</p>
                <p>📱 {st.phone}</p>
              </div>

              <div className="pt-2 border-t border-[#27272a]">
                <span className="text-xs font-bold uppercase text-[#71717a] block">
                  Permissions Granted:
                </span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {st.permissions.map((p, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded-md bg-[#202024] text-xs text-[#d4d4d8]"
                    >
                      {p}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-3 flex items-center justify-between text-xs">
              <span className="text-[#71717a] capitalize">Status: {st.status}</span>
              <button
                onClick={() => alert(`Regenerated passkey for ${st.name}`)}
                className="text-[#eab308] hover:underline font-bold"
              >
                Reset Access
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* INVITE MODAL */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-[#121215] border border-[#27272a] rounded-3xl w-full max-w-md p-6 space-y-4 shadow-2xl">
            <h3 className="text-lg font-black text-white">Invite Crew / Staff Member</h3>

            <form onSubmit={handleInviteStaff} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#d4d4d8]">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rohan 'DJ Ro' Kadam"
                  value={inviteName}
                  onChange={(e) => setInviteName(e.target.value)}
                  className="w-full px-3.5 py-2 bg-[#18181b] border border-[#27272a] rounded-xl text-xs text-white outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#d4d4d8]">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="rohan@dancecrew.com"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="w-full px-3.5 py-2 bg-[#18181b] border border-[#27272a] rounded-xl text-xs text-white outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#d4d4d8]">Phone Number</label>
                <input
                  type="text"
                  placeholder="+91 98200 11223"
                  value={invitePhone}
                  onChange={(e) => setInvitePhone(e.target.value)}
                  className="w-full px-3.5 py-2 bg-[#18181b] border border-[#27272a] rounded-xl text-xs text-white outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#d4d4d8]">Assigned Role</label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value as OrganizerStaffRole)}
                  className="w-full px-3.5 py-2 bg-[#18181b] border border-[#27272a] rounded-xl text-xs font-bold text-white outline-none"
                >
                  <option value="co_organizer">Co-Organizer</option>
                  <option value="event_director">Event Director</option>
                  <option value="head_judge">Head Judge</option>
                  <option value="judge">Judge</option>
                  <option value="battle_mc">Battle MC / Host</option>
                  <option value="dj">DJ</option>
                  <option value="stage_manager">Stage Manager</option>
                  <option value="registration_staff">Registration & Gate Staff</option>
                  <option value="finance_manager">Finance Manager</option>
                  <option value="media_crew">Content / Media Crew</option>
                  <option value="security_lead">Security Lead</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowInviteModal(false)}
                  className="px-4 py-2 rounded-xl bg-[#27272a] text-xs font-bold text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#eab308] text-black text-xs font-black"
                >
                  Send Access Invite
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

