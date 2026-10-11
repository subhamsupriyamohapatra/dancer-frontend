import React, { useState } from 'react';
import {
  Megaphone,
  Send,
  Users,
  CheckCircle2,
  Bell,
  Smartphone,
  Mail,
  Tv,
  X,
} from 'lucide-react';
import { OrganizerEventRecord } from '../../types/organizer';

interface CommunicationBroadcastModalProps {
  event: OrganizerEventRecord;
  onClose: () => void;
  onUpdateEvent: (updatedEvent: OrganizerEventRecord) => void;
}

export const CommunicationBroadcastModal: React.FC<CommunicationBroadcastModalProps> = ({
  event,
  onClose,
  onUpdateEvent,
}) => {
  const [targetAudience, setTargetAudience] = useState<string>('all_dancers');
  const [channels, setChannels] = useState<{ inApp: boolean; sms: boolean; email: boolean; stage: boolean }>({
    inApp: true,
    sms: false,
    email: true,
    stage: true,
  });
  const [messageTitle, setMessageTitle] = useState('Important Schedule Update: Semi-Finals Call Time');
  const [messageBody, setMessageBody] = useState(
    'Please report to Green Room Stage Left 15 minutes prior to your allocated battle heat. Ensure music USB or tracks are verified with DJ console.'
  );

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageBody.trim()) return;

    const newAnn = `[${targetAudience.toUpperCase()}] ${messageTitle}: ${messageBody}`;
    const updatedAnnouncements = [newAnn, ...(event.announcements || [])];

    onUpdateEvent({ ...event, announcements: updatedAnnouncements });
    alert(`Broadcast successfully dispatched to ${targetAudience.replace(/_/g, ' ')}!`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="bg-[#121215] border border-[#27272a] rounded-3xl w-full max-w-xl p-6 space-y-5 shadow-2xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#eab308]/20 text-[#eab308] flex items-center justify-center">
              <Megaphone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-white">Targeted Broadcast Dispatch</h3>
              <p className="text-xs text-[#a1a1aa]">{event.title}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-2xl bg-[#27272a] hover:bg-[#3f3f46] text-[#a1a1aa] hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSend} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-[#d4d4d8]">Target Audience Group</label>
            <select
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value)}
              className="w-full px-3.5 py-2 bg-[#18181b] border border-[#27272a] rounded-xl text-xs font-bold text-white outline-none"
            >
              <option value="all_dancers">All Registered Competitors & Dancers</option>
              <option value="semi_finalists">Semi-Finalists Only</option>
              <option value="judges_staff">Judges, MC & Stage Crew</option>
              <option value="ticket_holders">Audience & VIP Ticket Holders</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-[#d4d4d8]">Delivery Channels</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { key: 'inApp', label: 'In-App Alert', icon: Bell },
                { key: 'stage', label: 'Stage Screen', icon: Tv },
                { key: 'email', label: 'Email Push', icon: Mail },
                { key: 'sms', label: 'SMS Blast', icon: Smartphone },
              ].map((c) => {
                const Icon = c.icon;
                const active = channels[c.key as keyof typeof channels];
                return (
                  <button
                    type="button"
                    key={c.key}
                    onClick={() =>
                      setChannels((prev) => ({
                        ...prev,
                        [c.key]: !prev[c.key as keyof typeof channels],
                      }))
                    }
                    className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                      active
                        ? 'bg-[#eab308]/20 border-[#eab308] text-[#eab308]'
                        : 'bg-[#18181b] border-[#27272a] text-[#71717a]'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{c.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-[#d4d4d8]">Broadcast Title</label>
            <input
              type="text"
              required
              value={messageTitle}
              onChange={(e) => setMessageTitle(e.target.value)}
              className="w-full px-3.5 py-2 bg-[#18181b] border border-[#27272a] rounded-xl text-xs text-white outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-[#d4d4d8]">Message Body</label>
            <textarea
              rows={3}
              required
              value={messageBody}
              onChange={(e) => setMessageBody(e.target.value)}
              className="w-full p-3 bg-[#18181b] border border-[#27272a] rounded-xl text-xs text-white outline-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-[#27272a] text-xs font-bold text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-[#eab308] text-black text-xs font-black flex items-center gap-1.5 shadow-lg"
            >
              <Send className="w-4 h-4" />
              <span>Broadcast Alert</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
