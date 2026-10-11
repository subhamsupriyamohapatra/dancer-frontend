import React, { useState } from 'react';
import {
  Shield,
  Megaphone,
  Camera,
  HeartHandshake,
  FileSpreadsheet,
  Award,
  BarChart2,
  User,
  Settings,
  HelpCircle,
  Plus,
  Trash2,
  CheckCircle2,
  Download,
  Share2,
  Lock,
  Smartphone,
  Mail,
  Copy,
  ExternalLink,
} from 'lucide-react';
import { OrganizerEventRecord } from '../../types/organizer';
import { StaffAndPermissionsView } from './StaffAndPermissionsView';
import { FeedbackSystemView } from './FeedbackSystemView';

interface OrganizerMoreViewProps {
  events: OrganizerEventRecord[];
  onUpdateEvent?: (updatedEvent: OrganizerEventRecord) => void;
}

export const OrganizerMoreView: React.FC<OrganizerMoreViewProps> = ({
  events,
  onUpdateEvent,
}) => {
  const [subTab, setSubTab] = useState<
    | 'staff'
    | 'announcements'
    | 'media'
    | 'sponsors'
    | 'feedback'
    | 'certificates'
    | 'analytics'
    | 'profile'
    | 'settings'
    | 'support'
  >('staff');

  return (
    <div className="space-y-4">
      {/* 1. Minimal Header */}
      <div className="bg-[#141417] border border-[#27272a] rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
        <div>
          <h2 className="text-sm sm:text-base font-bold text-white tracking-tight flex items-center gap-1.5">
            <Settings className="w-4 h-4 text-[#eab308]" />
            <span>Organizer Suite & Administration</span>
          </h2>
          <p className="text-xs text-[#a1a1aa]">
            Team permissions, broadcasts, brand sponsors, certificate templates, and support hotlines.
          </p>
        </div>
      </div>

      {/* 2. Segregated Sub-Navigation Tabs */}
      <div className="flex items-center bg-[#141417] p-1 rounded-xl border border-[#27272a] overflow-x-auto no-scrollbar gap-1">
        {[
          { id: 'staff', label: 'Staff & Permissions', icon: Shield },
          { id: 'announcements', label: 'Announcements', icon: Megaphone },
          { id: 'media', label: 'Media', icon: Camera },
          { id: 'sponsors', label: 'Sponsors', icon: HeartHandshake },
          { id: 'feedback', label: 'Feedback Forms', icon: FileSpreadsheet },
          { id: 'certificates', label: 'Certificate Templates', icon: Award },
          { id: 'analytics', label: 'Analytics', icon: BarChart2 },
          { id: 'profile', label: 'Organizer Profile', icon: User },
          { id: 'settings', label: 'Settings', icon: Settings },
          { id: 'support', label: 'Support', icon: HelpCircle },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = subTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setSubTab(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap flex items-center gap-1.5 transition-all ${
                isActive
                  ? 'bg-[#27272a] text-white font-bold border border-[#3f3f46]'
                  : 'text-[#a1a1aa] hover:text-white hover:bg-[#18181b]'
              }`}
            >
              <Icon className="w-3 h-3 text-[#a1a1aa]" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 3. Sub-View Panels */}
      {/* 3.1 STAFF & PERMISSIONS */}
      {subTab === 'staff' && (
        <div className="rounded-xl overflow-hidden border border-[#27272a]">
          <StaffAndPermissionsView />
        </div>
      )}

      {/* 3.2 ANNOUNCEMENTS */}
      {subTab === 'announcements' && (
        <div className="p-4 rounded-xl bg-[#141417] border border-[#27272a] space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs font-bold text-white">Global DanceOne Broadcast Feed</h3>
              <p className="text-xs text-[#a1a1aa]">Push notifications sent to dancers across all your active championships.</p>
            </div>
            <button
              onClick={() => alert('New announcement created!')}
              className="px-2.5 py-1 bg-[#eab308] text-black text-xs font-bold rounded-lg flex items-center gap-1"
            >
              <Megaphone className="w-3 h-3" />
              <span>+ New Broadcast</span>
            </button>
          </div>

          <div className="space-y-2 text-xs">
            {[
              { title: 'National Finals Schedule Published', target: 'All Registered Dancers', time: '2 hours ago', status: 'Delivered (480)' },
              { title: 'Judges Briefing 10:30 AM in Room B', target: 'Official Judges Only', time: '5 hours ago', status: 'Delivered (8)' },
              { title: 'Early Bird Ticket Window Extended', target: 'Public Audience', time: 'Yesterday', status: 'Delivered (1,240)' },
            ].map((a, idx) => (
              <div key={idx} className="p-2.5 rounded-lg bg-[#18181b] border border-[#27272a] flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-white">{a.title}</h4>
                  <span className="text-xs text-[#a1a1aa]">{a.target} • {a.time}</span>
                </div>
                <span className="text-xs text-[#22c55e] font-mono">{a.status}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3.3 MEDIA */}
      {subTab === 'media' && (
        <div className="p-4 rounded-xl bg-[#141417] border border-[#27272a] space-y-3">
          <h3 className="text-xs font-bold text-white">Official Media, Live Stream & Photos</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-lg bg-[#18181b] border border-[#27272a] space-y-2">
              <span className="font-bold text-white block">Official Stream Link</span>
              <input
                type="text"
                defaultValue="https://youtube.com/live/danceone-national-championship"
                className="w-full px-2.5 py-1 bg-[#202024] border border-[#27272a] rounded text-xs text-white outline-none"
              />
              <span className="text-xs text-[#22c55e]">Live Feed Connected</span>
            </div>
            <div className="p-3 rounded-lg bg-[#18181b] border border-[#27272a] space-y-2">
              <span className="font-bold text-white block">Official Photo Storage Drive</span>
              <input
                type="text"
                defaultValue="https://drive.google.com/drive/folders/danceone-photos"
                className="w-full px-2.5 py-1 bg-[#202024] border border-[#27272a] rounded text-xs text-white outline-none"
              />
              <span className="text-xs text-[#a1a1aa]">Shared with all athletes</span>
            </div>
          </div>
        </div>
      )}

      {/* 3.4 SPONSORS */}
      {subTab === 'sponsors' && (
        <div className="p-4 rounded-xl bg-[#141417] border border-[#27272a] space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs font-bold text-white">Brand Partners & Event Sponsors</h3>
              <p className="text-xs text-[#a1a1aa]">Sponsor logos, backdrop deliverables, and banner placements.</p>
            </div>
            <button
              onClick={() => alert('Add sponsor clicked')}
              className="px-2.5 py-1 bg-[#27272a] text-white text-xs font-medium rounded-lg flex items-center gap-1"
            >
              <Plus className="w-3 h-3 text-[#eab308]" />
              <span>+ Add Sponsor</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            {[
              { name: 'Red Bull', tier: 'Title Partner', deliverable: 'Main Stage Banners & Cypher Prize' },
              { name: 'Puma Streetwear', tier: 'Apparel Partner', deliverable: 'Athlete Bibs & Official Tees' },
              { name: 'Monster Energy', tier: 'Hydration Partner', deliverable: 'Green Room Fridge & Booth' },
            ].map((sp, idx) => (
              <div key={idx} className="p-3 rounded-lg bg-[#18181b] border border-[#27272a] space-y-1">
                <span className="text-xs font-bold text-white block">{sp.name}</span>
                <span className="text-xs font-bold text-[#eab308] bg-[#202024] px-1.5 py-0.5 rounded inline-block">
                  {sp.tier}
                </span>
                <span className="text-xs text-[#a1a1aa] block pt-1">{sp.deliverable}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3.5 FEEDBACK FORMS */}
      {subTab === 'feedback' && (
        <div className="rounded-xl overflow-hidden border border-[#27272a]">
          <FeedbackSystemView />
        </div>
      )}

      {/* 3.6 CERTIFICATE TEMPLATES */}
      {subTab === 'certificates' && (
        <div className="p-4 rounded-xl bg-[#141417] border border-[#27272a] space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs font-bold text-white">Digital Certificate Designer</h3>
              <p className="text-xs text-[#a1a1aa]">Automated blockchain / QR verified certificate templates for podium and participants.</p>
            </div>
            <button
              onClick={() => alert('Certificate template saved!')}
              className="px-2.5 py-1 bg-[#eab308] text-black text-xs font-bold rounded-lg"
            >
              Save Template
            </button>
          </div>

          <div className="p-6 rounded-lg bg-[#18181b] border-2 border-dashed border-[#eab308]/40 text-center space-y-2">
            <Award className="w-8 h-8 text-[#eab308] mx-auto" />
            <h4 className="text-sm font-bold text-white">DanceOne Official Certificate of Merit</h4>
            <p className="text-xs text-[#a1a1aa] max-w-md mx-auto">
              Dynamic variables: {"{dancer_name}"}, {"{event_title}"}, {"{category}"}, {"{rank_position}"}, {"{date}"}.
            </p>
          </div>
        </div>
      )}

      {/* 3.7 ANALYTICS */}
      {subTab === 'analytics' && (
        <div className="p-4 rounded-xl bg-[#141417] border border-[#27272a] space-y-3">
          <h3 className="text-xs font-bold text-white">Cross-Event Ecosystem Analytics</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 rounded-lg bg-[#18181b] border border-[#27272a]">
              <span className="text-xs text-[#71717a] block uppercase font-bold">Lifetime Athletes</span>
              <span className="text-lg font-bold text-white">2,840</span>
              <span className="text-xs text-[#22c55e] block">+18% this season</span>
            </div>
            <div className="p-3 rounded-lg bg-[#18181b] border border-[#27272a]">
              <span className="text-xs text-[#71717a] block uppercase font-bold">Total Gross Revenue</span>
              <span className="text-lg font-bold text-[#22c55e]">₹42,80,000</span>
            </div>
            <div className="p-3 rounded-lg bg-[#18181b] border border-[#27272a]">
              <span className="text-xs text-[#71717a] block uppercase font-bold">Avg Athlete Rating</span>
              <span className="text-lg font-bold text-[#eab308]">4.92 / 5.0</span>
            </div>
            <div className="p-3 rounded-lg bg-[#18181b] border border-[#27272a]">
              <span className="text-xs text-[#71717a] block uppercase font-bold">Verified Studios</span>
              <span className="text-lg font-bold text-white">68</span>
            </div>
          </div>
        </div>
      )}

      {/* 3.8 ORGANIZER PROFILE */}
      {subTab === 'profile' && (
        <div className="p-4 rounded-xl bg-[#141417] border border-[#27272a] space-y-3 text-xs">
          <h3 className="text-xs font-bold text-white">Organizer Organization Profile</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs text-[#a1a1aa] uppercase font-bold">Organization Name</label>
              <input
                type="text"
                defaultValue="DanceOne India Entertainment LLP"
                className="w-full px-2.5 py-1.5 bg-[#18181b] border border-[#27272a] rounded-lg text-xs text-white outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-[#a1a1aa] uppercase font-bold">Official Email</label>
              <input
                type="email"
                defaultValue="organizer@danceone.com"
                className="w-full px-2.5 py-1.5 bg-[#18181b] border border-[#27272a] rounded-lg text-xs text-white outline-none"
              />
            </div>
          </div>
        </div>
      )}

      {/* 3.9 SETTINGS */}
      {subTab === 'settings' && (
        <div className="p-4 rounded-xl bg-[#141417] border border-[#27272a] space-y-3 text-xs">
          <h3 className="text-xs font-bold text-white">System Settings & Defaults</h3>
          <div className="space-y-2">
            <div className="p-2.5 rounded-lg bg-[#18181b] border border-[#27272a] flex items-center justify-between">
              <div>
                <span className="font-bold text-white block">Default Currency</span>
                <span className="text-xs text-[#a1a1aa]">INR (₹) Indian Rupee</span>
              </div>
              <span className="text-xs font-bold text-[#eab308]">₹ INR</span>
            </div>
            <div className="p-2.5 rounded-lg bg-[#18181b] border border-[#27272a] flex items-center justify-between">
              <div>
                <span className="font-bold text-white block">SMS & WhatsApp Alerts</span>
                <span className="text-xs text-[#a1a1aa]">Send instant bib numbers on ticket purchase.</span>
              </div>
              <input type="checkbox" defaultChecked className="w-4 h-4 accent-[#eab308]" />
            </div>
          </div>
        </div>
      )}

      {/* 3.10 SUPPORT */}
      {subTab === 'support' && (
        <div className="p-4 rounded-xl bg-[#141417] border border-[#27272a] space-y-3 text-xs">
          <h3 className="text-xs font-bold text-white">DanceOne 24/7 Organizer Support</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3 rounded-lg bg-[#18181b] border border-[#27272a] space-y-1">
              <span className="font-bold text-white block">Dedicated Organizer Emergency Hotline</span>
              <span className="text-sm font-mono font-bold text-[#eab308]">+91 800-DANCE-ONE</span>
              <span className="text-xs text-[#22c55e] block">Live during active event days</span>
            </div>
            <div className="p-3 rounded-lg bg-[#18181b] border border-[#27272a] space-y-1">
              <span className="font-bold text-white block">Direct Email Support</span>
              <span className="text-sm font-mono text-cyan-400">help@danceone.org</span>
              <span className="text-xs text-[#a1a1aa] block">Priority 15 min response time</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

