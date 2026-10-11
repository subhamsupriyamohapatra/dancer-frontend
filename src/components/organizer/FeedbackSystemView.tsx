import React, { useState } from 'react';
import {
  MessageSquare,
  Star,
  Users,
  Shield,
  Eye,
  EyeOff,
  Send,
  Plus,
  BarChart3,
  ThumbsUp,
  Award,
} from 'lucide-react';
import { EventFeedbackEntry, OrganizerEventRecord } from '../../types/organizer';
import { ORGANIZER_FEEDBACK_ENTRIES } from '../../data/organizerData';

interface FeedbackSystemViewProps {
  events: OrganizerEventRecord[];
}

export const FeedbackSystemView: React.FC<FeedbackSystemViewProps> = ({ events }) => {
  const [feedbackList, setFeedbackList] = useState<EventFeedbackEntry[]>(ORGANIZER_FEEDBACK_ENTRIES);
  const [selectedRole, setSelectedRole] = useState<string>('all');

  const filtered = feedbackList.filter(
    (f) => selectedRole === 'all' || f.respondentRole === selectedRole
  );

  const avgRating = (
    feedbackList.reduce((acc, curr) => acc + curr.rating, 0) / (feedbackList.length || 1)
  ).toFixed(1);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-3xl bg-[#18181b] border border-[#27272a]">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-black uppercase tracking-wider bg-cyan-500/20 text-cyan-400">
              AUDIT & QUALITY FEEDBACK ENGINE
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
            Participant, Judge & Audience Reviews
          </h2>
          <p className="text-xs text-[#a1a1aa]">
            Automated post-event surveys, judging fairness audit, and qualitative dancer critique.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2 bg-[#202024] border border-[#27272a] rounded-2xl text-center">
            <span className="text-xs uppercase font-bold text-[#71717a] block">Overall Score</span>
            <span className="text-lg font-black text-[#eab308] flex items-center gap-1 justify-center">
              <Star className="w-4 h-4 fill-current" /> {avgRating} / 5.0
            </span>
          </div>
        </div>
      </div>

      {/* Role Filter Tabs */}
      <div className="flex items-center gap-2 bg-[#18181b] p-1.5 rounded-2xl border border-[#27272a] overflow-x-auto no-scrollbar">
        {[
          { id: 'all', label: 'All Feedback Streams' },
          { id: 'dancer', label: 'Dancers & Competitors' },
          { id: 'judge', label: 'Adjudicators & Judges' },
          { id: 'instructor', label: 'Master Instructors' },
          { id: 'audience', label: 'Audience & Spectators' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedRole(tab.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              selectedRole === tab.id
                ? 'bg-[#eab308] text-black font-black shadow-md'
                : 'text-[#a1a1aa] hover:text-white hover:bg-[#27272a]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Feedback Feed */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="p-5 rounded-3xl bg-[#18181b] border border-[#27272a] space-y-3 flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-black uppercase bg-[#27272a] text-[#d4d4d8]">
                    {item.respondentRole}
                  </span>
                  <span className="text-xs font-bold text-white">{item.respondentName}</span>
                </div>
                <div className="flex items-center gap-1 text-xs font-black text-[#eab308]">
                  <Star className="w-3.5 h-3.5 fill-current" /> {item.rating} / 5
                </div>
              </div>

              <div className="flex flex-wrap gap-2 text-xs text-[#a1a1aa]">
                {item.judgingFairnessRating && (
                  <span className="bg-[#202024] px-2 py-0.5 rounded-md">
                    Judging Fairness: <strong className="text-white">{item.judgingFairnessRating}/5</strong>
                  </span>
                )}
                {item.venueRating && (
                  <span className="bg-[#202024] px-2 py-0.5 rounded-md">
                    Venue: <strong className="text-white">{item.venueRating}/5</strong>
                  </span>
                )}
                {item.musicRating && (
                  <span className="bg-[#202024] px-2 py-0.5 rounded-md">
                    Sound/DJ: <strong className="text-white">{item.musicRating}/5</strong>
                  </span>
                )}
              </div>

              <p className="text-xs text-[#d4d4d8] bg-[#141417] p-3 rounded-2xl border border-[#27272a] italic leading-relaxed">
                "{item.comment}"
              </p>
            </div>

            <div className="pt-2 flex items-center justify-between text-xs text-[#71717a]">
              <span>Submitted: {item.submittedAt}</span>
              <span className="capitalize">{item.privacy.replace('_', ' ')}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

