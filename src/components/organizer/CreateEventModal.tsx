import React, { useState } from 'react';
import {
  X,
  GraduationCap,
  Trophy,
  Film,
  Flame,
  Tent,
  Sparkles,
  UserCheck,
  Heart,
  Music,
  MoreHorizontal,
  Calendar,
  Clock,
  MapPin,
  DollarSign,
  Users,
  ChevronRight,
  ChevronLeft,
  Plus,
  Trash2,
  CheckCircle2,
} from 'lucide-react';
import {
  EventType,
  EventStatus,
  ScorePublishPolicy,
  ScoringCriterion,
  OrganizerEventRecord,
} from '../../types/organizer';
import { ORGANIZER_STAFF_DATA } from '../../data/organizerData';

interface CreateEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateEvent: (newEvent: OrganizerEventRecord) => void;
}

// Exactly ordered sequence as requested by user:
// 1. Workshops, 2. Competitions, 3. Shows, 4. Battles, 5. Masterclasses, 6. Dance Camps,
// 7. Festivals, 8. Auditions, 9. Showcase, 10. Socials, 11. Jams, 12. Other gatherings
export const EVENT_TYPE_OPTIONS: {
  id: EventType;
  title: string;
  subtitle: string;
  icon: React.ElementType;
  color: string;
  accentBg: string;
}[] = [
  {
    id: 'workshop',
    title: 'Workshops',
    subtitle: 'Guest Instructors, Intensives & Levels',
    icon: GraduationCap,
    color: 'text-blue-400',
    accentBg: 'hover:border-blue-500/50 hover:bg-blue-500/5',
  },
  {
    id: 'competition',
    title: 'Competitions',
    subtitle: 'Heats, Solo/Duo/Crew, Scoring Sheets & Bibs',
    icon: Trophy,
    color: 'text-amber-400',
    accentBg: 'hover:border-amber-500/50 hover:bg-amber-500/5',
  },
  {
    id: 'dance_show',
    title: 'Shows',
    subtitle: 'Stage Recitals, Running Orders & Tickets',
    icon: Film,
    color: 'text-purple-400',
    accentBg: 'hover:border-purple-500/50 hover:bg-purple-500/5',
  },
  {
    id: 'dance_battle',
    title: 'Battles',
    subtitle: '1v1, 2v2, Cyphers, Brackets & Live Clock',
    icon: Flame,
    color: 'text-rose-400',
    accentBg: 'hover:border-rose-500/50 hover:bg-rose-500/5',
  },
  {
    id: 'masterclass',
    title: 'Masterclasses',
    subtitle: 'Elite VIP Intensive with World-Renowned Faculty',
    icon: GraduationCap,
    color: 'text-yellow-400',
    accentBg: 'hover:border-yellow-500/50 hover:bg-yellow-500/5',
  },
  {
    id: 'dance_camp',
    title: 'Dance Camps',
    subtitle: 'Multi-Day Residential, Multiple Classes & Lodging',
    icon: Tent,
    color: 'text-emerald-400',
    accentBg: 'hover:border-emerald-500/50 hover:bg-emerald-500/5',
  },
  {
    id: 'festival',
    title: 'Festivals',
    subtitle: 'Multi-Venue, Multi-Stage, All-Access Passes',
    icon: Sparkles,
    color: 'text-cyan-400',
    accentBg: 'hover:border-cyan-500/50 hover:bg-cyan-500/5',
  },
  {
    id: 'audition',
    title: 'Auditions',
    subtitle: 'Casting Calls, Troupe Selection & Scorecards',
    icon: UserCheck,
    color: 'text-indigo-400',
    accentBg: 'hover:border-indigo-500/50 hover:bg-indigo-500/5',
  },
  {
    id: 'showcase',
    title: 'Showcase',
    subtitle: 'Exhibition Performances, Non-Competitive Troupes',
    icon: Film,
    color: 'text-pink-400',
    accentBg: 'hover:border-pink-500/50 hover:bg-pink-500/5',
  },
  {
    id: 'social',
    title: 'Socials',
    subtitle: 'Social Dancing, Salsa/Bachata/Kizomba/West Coast',
    icon: Heart,
    color: 'text-red-400',
    accentBg: 'hover:border-red-500/50 hover:bg-red-500/5',
  },
  {
    id: 'jam',
    title: 'Jams',
    subtitle: 'Open Floor, DJ Sessions, Cyphers & Community',
    icon: Music,
    color: 'text-orange-400',
    accentBg: 'hover:border-orange-500/50 hover:bg-orange-500/5',
  },
  {
    id: 'other',
    title: 'Other gatherings',
    subtitle: 'Custom Dance Gathering, Shoot or Meetup',
    icon: MoreHorizontal,
    color: 'text-zinc-400',
    accentBg: 'hover:border-zinc-500/50 hover:bg-zinc-500/5',
  },
];

const DEFAULT_SCORING_CRITERIA: ScoringCriterion[] = [
  { id: 'crit-1', name: 'Technique & Execution', weight: 30, maxScore: 10, description: 'Body control & precision' },
  { id: 'crit-2', name: 'Musicality & Rhythm', weight: 25, maxScore: 10, description: 'Timing & tempo lock' },
  { id: 'crit-3', name: 'Creativity & Originality', weight: 25, maxScore: 10, description: 'Novel concept & style' },
  { id: 'crit-4', name: 'Performance & Stage Presence', weight: 20, maxScore: 10, description: 'Energy & projection' },
];

export const CreateEventModal: React.FC<CreateEventModalProps> = ({
  isOpen,
  onClose,
  onCreateEvent,
}) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [selectedType, setSelectedType] = useState<EventType>('workshop');

  // Form State - Starts completely clean & blank as requested
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [endDate, setEndDate] = useState('');
  const [time, setTime] = useState('');
  const [venue, setVenue] = useState('');
  const [city, setCity] = useState('');
  const [capacity, setCapacity] = useState<number | ''>(100);
  const [status, setStatus] = useState<EventStatus>('published');
  const [guestsInput, setGuestsInput] = useState('');

  // Categories & Styles - Blank by default
  const [categories, setCategories] = useState<string[]>([]);
  const [newCatInput, setNewCatInput] = useState('');
  const [danceStyles, setDanceStyles] = useState<string[]>([]);
  const [newStyleInput, setNewStyleInput] = useState('');

  // Ticket Pricing Tier
  const [ticketPricing, setTicketPricing] = useState<
    { tier: string; price: number; capacity: number; sold: number }[]
  >([
    { tier: 'General Pass', price: 499, capacity: 100, sold: 0 },
  ]);

  if (!isOpen) return null;

  const handleAddCategory = () => {
    if (newCatInput.trim()) {
      setCategories([...categories, newCatInput.trim()]);
      setNewCatInput('');
    }
  };

  const handleRemoveCategory = (index: number) => {
    setCategories(categories.filter((_, i) => i !== index));
  };

  const handleAddStyle = () => {
    if (newStyleInput.trim()) {
      setDanceStyles([...danceStyles, newStyleInput.trim()]);
      setNewStyleInput('');
    }
  };

  const handleRemoveStyle = (index: number) => {
    setDanceStyles(danceStyles.filter((_, i) => i !== index));
  };

  const handleAddTicketTier = () => {
    setTicketPricing([
      ...ticketPricing,
      { tier: `Tier ${ticketPricing.length + 1}`, price: 799, capacity: 50, sold: 0 },
    ]);
  };

  const handleRemoveTicketTier = (index: number) => {
    setTicketPricing(ticketPricing.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const selectedOption = EVENT_TYPE_OPTIONS.find((opt) => opt.id === selectedType);

    const newEvent: OrganizerEventRecord = {
      id: `evt-${Date.now()}`,
      title: title.trim(),
      type: selectedType,
      status: status,
      coverImage:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuBEZ4Hv6cCRoeMQlsgpqOEe-2zBy69m_r1CYFmIZPGIKUhKqKU0IdqP0atUS3pzcYiyLULFgztB5q-JxaHzam5UbxCTl8XXmb0EbUHOiAATCjXV715lDSN9fr2JO8V1TSYzbntMbFEJbIWQtBkpXQa_1Gl3uZ5t40m0cQIi6Rspbuq8bq1TmnsCv_czfuxgJlGgO-DpFZiPiLBSb7wD17H56Jf0TnPfHRitnRSoO3Ac99cnCKePbwQIEw',
      description:
        description ||
        `Official ${selectedOption?.title || 'dance event'} managed on DanceOne.`,
      startDate,
      endDate: endDate || startDate,
      time,
      venue: venue || 'Main Dance Hall',
      address: 'Main Avenue',
      city,
      capacity: Number(capacity) || 200,
      registeredCount: 0,
      revenue: 0,
      expenses: 0,
      registrationDeadline: startDate,
      categories,
      ageGroups: ['Open (All Ages)'],
      danceStyles,
      rules: ['Valid photo ID required at entry.', 'Follow house rules & respect artists.'],
      sponsors: [],
      ticketPricing,
      scorePublishPolicy: 'visible_after_event',
      isLiveScoringEnabled: selectedType === 'competition' || selectedType === 'dance_battle',
      audienceVotingEnabled: false,
      judges: guestsInput
        ? guestsInput
            .split(',')
            .map((g) => g.trim())
            .filter(Boolean)
        : [],
      staff: ORGANIZER_STAFF_DATA,
      scoringCriteria: DEFAULT_SCORING_CRITERIA,
      participants: [],
      scoreAuditLogs: [],
      announcements: ['Event created and workspace initialized.'],
      termsAndConditions: 'Standard event terms & refund policies apply.',
      cancellationPolicy: 'Refunds available up to 7 days before event start.',
      contactEmail: 'organizer@danceone.app',
      contactPhone: '+91 98200 00000',
    };

    onCreateEvent(newEvent);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in">
      <div className="bg-[#141417] border border-[#27272a] rounded-2xl w-full max-w-2xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden my-auto animate-in zoom-in-95">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#27272a] bg-[#18181b]">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#eab308]" />
            <h3 className="text-sm sm:text-base font-bold text-white tracking-tight">Create Event</h3>
            <span className="text-xs text-[#a1a1aa] border-l border-[#27272a] pl-2.5">
              {step === 1 ? 'Step 1: Select Format' : 'Step 2: Event Details'}
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-[#27272a] hover:bg-[#3f3f46] text-[#a1a1aa] hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 text-xs sm:text-sm space-y-4">
          {step === 1 ? (
            /* STEP 1: 12-Item Event Type Grid in exact user sequence */
            <div className="space-y-3">
              <div className="text-xs font-mono text-[#a1a1aa] flex items-center justify-between">
                <span>Select format (tap to configure):</span>
                <span className="text-xs text-[#10b981] font-bold">12 Formats Available</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {EVENT_TYPE_OPTIONS.map((opt, index) => {
                  const Icon = opt.icon;
                  const isSelected = selectedType === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => {
                        setSelectedType(opt.id);
                        setStep(2);
                      }}
                      className={`p-3.5 rounded-xl border text-left transition-all relative flex flex-col justify-between min-h-[90px] active:scale-[0.98] ${
                        isSelected
                          ? 'bg-white text-black border-white shadow-md'
                          : 'bg-[#18181b] border-white/[0.08] text-[#a1a1aa] hover:border-white/30 hover:bg-[#202024]'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full mb-2">
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                            isSelected ? 'bg-black text-white' : 'bg-white/[0.08] text-white'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className="text-xs font-mono text-[#71717a]">#{index + 1}</span>
                      </div>
                      <div>
                        <div className={`text-xs sm:text-sm font-bold leading-tight truncate ${isSelected ? 'text-black' : 'text-white'}`}>
                          {opt.title}
                        </div>
                        <div className={`text-xs truncate mt-0.5 ${isSelected ? 'text-zinc-700' : 'text-[#71717a]'}`}>
                          {opt.subtitle}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            /* STEP 2: Configuration Form */
            <form id="minimal-create-event-form" onSubmit={handleSubmit} className="space-y-3.5">
              {/* Event Title */}
              <div className="space-y-1">
                <label className="text-xs font-mono font-bold text-[#a1a1aa] uppercase tracking-wider block">
                  Event Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Masterclass Workshop / Battle Championship"
                  className="w-full px-3.5 py-2.5 bg-[#18181b] border border-white/[0.1] rounded-xl text-xs sm:text-sm text-white placeholder:text-[#52525b] outline-none focus:border-white/40"
                />
              </div>

              {/* Date & Time Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-mono font-bold text-[#a1a1aa] uppercase tracking-wider flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#38bdf8]" /> Starting Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 bg-[#18181b] border border-white/[0.1] rounded-xl text-xs sm:text-sm text-white outline-none focus:border-white/40"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono font-bold text-[#a1a1aa] uppercase tracking-wider flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#71717a]" /> End Date (Opt)
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3 py-2 bg-[#18181b] border border-white/[0.1] rounded-xl text-xs sm:text-sm text-white outline-none focus:border-white/40"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono font-bold text-[#a1a1aa] uppercase tracking-wider flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#71717a]" /> Time (Opt)
                  </label>
                  <input
                    type="text"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    placeholder="10 AM - 6 PM"
                    className="w-full px-3 py-2 bg-[#18181b] border border-white/[0.1] rounded-xl text-xs sm:text-sm text-white outline-none focus:border-white/40"
                  />
                </div>
              </div>

              {/* Venue, City & Capacity */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-mono font-bold text-[#a1a1aa] uppercase tracking-wider flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#71717a]" /> Venue (Opt)
                  </label>
                  <input
                    type="text"
                    value={venue}
                    onChange={(e) => setVenue(e.target.value)}
                    placeholder="Dance Hall"
                    className="w-full px-3 py-2 bg-[#18181b] border border-white/[0.1] rounded-xl text-xs sm:text-sm text-white outline-none focus:border-white/40"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono font-bold text-[#a1a1aa] uppercase tracking-wider flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#10b981]" /> City / Locality
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Bandra, Mumbai"
                    className="w-full px-3 py-2 bg-[#18181b] border border-white/[0.1] rounded-xl text-xs sm:text-sm text-white outline-none focus:border-white/40"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono font-bold text-[#a1a1aa] uppercase tracking-wider flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-[#71717a]" /> Capacity
                  </label>
                  <input
                    type="number"
                    value={capacity}
                    onChange={(e) => setCapacity(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="100"
                    className="w-full px-3 py-2 bg-[#18181b] border border-white/[0.1] rounded-xl text-xs sm:text-sm text-white outline-none focus:border-white/40"
                  />
                </div>
              </div>

              {/* Guests & Faculty */}
              <div className="space-y-1">
                <label className="text-xs font-mono font-bold text-[#a1a1aa] uppercase tracking-wider flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-[#38bdf8]" /> Guests & Faculty (Optional)
                </label>
                <input
                  type="text"
                  value={guestsInput}
                  onChange={(e) => setGuestsInput(e.target.value)}
                  placeholder="e.g. Sarah Jenkins, B-Boy Neguin (comma separated)"
                  className="w-full px-3.5 py-2 bg-[#18181b] border border-white/[0.1] rounded-xl text-xs sm:text-sm text-white placeholder:text-[#52525b] outline-none focus:border-white/40"
                />
              </div>

              {/* Description */}
              <div className="space-y-1">
                <label className="text-xs font-mono font-bold text-[#a1a1aa] uppercase tracking-wider block">
                  Description / Notes (Optional)
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Schedule or prerequisites..."
                  className="w-full px-3.5 py-2 bg-[#18181b] border border-white/[0.1] rounded-xl text-xs sm:text-sm text-white placeholder:text-[#52525b] outline-none focus:border-white/40 resize-none"
                />
              </div>

              {/* Categories / Divisions */}
              <div className="space-y-2 bg-[#18181b] p-3.5 rounded-xl border border-[#27272a]">
                <label className="text-xs font-bold text-[#a1a1aa] uppercase tracking-wider block">
                  Categories / Formats
                </label>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {categories.map((cat, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 bg-[#27272a] text-white text-xs rounded-lg flex items-center gap-1.5"
                    >
                      {cat}
                      <button
                        type="button"
                        onClick={() => handleRemoveCategory(idx)}
                        className="text-[#71717a] hover:text-rose-400 font-bold"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newCatInput}
                    onChange={(e) => setNewCatInput(e.target.value)}
                    placeholder="Add category (e.g., 1v1 Breaking, Advanced Choreography)"
                    className="flex-1 px-3 py-2 bg-[#141417] border border-[#27272a] rounded-xl text-xs text-white outline-none focus:border-[#eab308]"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddCategory();
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleAddCategory}
                    className="px-3.5 py-2 bg-[#27272a] hover:bg-[#3f3f46] text-white text-xs font-bold rounded-xl"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Ticket Pricing Tiers */}
              <div className="space-y-2 bg-[#18181b] p-3.5 rounded-xl border border-[#27272a]">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-[#a1a1aa] uppercase tracking-wider flex items-center gap-1.5">
                    <DollarSign className="w-3.5 h-3.5 text-[#eab308]" /> Ticket & Registration Pricing
                  </label>
                  <button
                    type="button"
                    onClick={handleAddTicketTier}
                    className="text-xs text-[#eab308] hover:underline font-bold"
                  >
                    + Add Tier
                  </button>
                </div>

                <div className="space-y-2">
                  {ticketPricing.map((t, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={t.tier}
                        onChange={(e) => {
                          const updated = [...ticketPricing];
                          updated[idx].tier = e.target.value;
                          setTicketPricing(updated);
                        }}
                        className="flex-1 px-3 py-2 bg-[#141417] border border-[#27272a] rounded-xl text-xs text-white outline-none"
                        placeholder="Tier Name"
                      />
                      <div className="relative w-24">
                        <span className="text-xs text-[#71717a] absolute left-2 top-1/2 -translate-y-1/2">
                          ₹
                        </span>
                        <input
                          type="number"
                          value={t.price}
                          onChange={(e) => {
                            const updated = [...ticketPricing];
                            updated[idx].price = Number(e.target.value) || 0;
                            setTicketPricing(updated);
                          }}
                          className="w-full pl-5 pr-2 py-2 bg-[#141417] border border-[#27272a] rounded-xl text-xs text-white outline-none"
                        />
                      </div>
                      <div className="relative w-20">
                        <input
                          type="number"
                          value={t.capacity}
                          onChange={(e) => {
                            const updated = [...ticketPricing];
                            updated[idx].capacity = Number(e.target.value) || 0;
                            setTicketPricing(updated);
                          }}
                          className="w-full px-2 py-2 bg-[#141417] border border-[#27272a] rounded-xl text-xs text-white outline-none text-center"
                          placeholder="Seats"
                        />
                      </div>
                      {ticketPricing.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveTicketTier(idx)}
                          className="p-1.5 text-[#71717a] hover:text-rose-400"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </form>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-5 py-3.5 border-t border-[#27272a] bg-[#18181b]">
          {step === 1 ? (
            <>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-[#27272a] hover:bg-[#3f3f46] text-white text-xs font-semibold transition-all"
              >
                Cancel
              </button>
              <span className="text-xs text-[#a1a1aa]">
                Tap any category card above to proceed
              </span>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-4 py-2 rounded-xl bg-[#27272a] hover:bg-[#3f3f46] text-white text-xs font-semibold flex items-center gap-1.5 transition-all"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Change Format</span>
              </button>
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl bg-[#27272a] hover:bg-[#3f3f46] text-white text-xs font-semibold transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  form="minimal-create-event-form"
                  className="px-5 py-2 rounded-xl bg-[#eab308] hover:bg-[#facc15] text-black text-xs sm:text-sm font-bold shadow-md flex items-center gap-2 transition-all active:scale-95"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Create Event</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

