import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Calendar,
  Users,
  Music,
  MapPin,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { WeddingChoreographer } from '../types';

interface WeddingRequestModalProps {
  initialChoreographer?: WeddingChoreographer | null;
  onClose: () => void;
  onSuccess: () => void;
}

export const WeddingRequestModal: React.FC<WeddingRequestModalProps> = ({
  initialChoreographer,
  onClose,
  onSuccess,
}) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    coupleName: 'Ananya & Kabir',
    weddingDate: '2024-02-14',
    city: 'Mumbai / Destination Goa',
    eventTypes: ['Couple First Dance', 'Family Sangeet Medley'],
    songsPreference: 'Bollywood Romantic + High-Energy Punjabi',
    preferredMode: 'Hybrid (Studio + Online)',
    budgetRange: '₹35,000 - ₹50,000',
    contactNumber: '+91 98201 44512',
    email: 'ananya.dance@gmail.com',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDone, setIsDone] = useState(false);

  const toggleEventType = (type: string) => {
    if (formData.eventTypes.includes(type)) {
      setFormData({
        ...formData,
        eventTypes: formData.eventTypes.filter((t) => t !== type),
      });
    } else {
      setFormData({
        ...formData,
        eventTypes: [...formData.eventTypes, type],
      });
    }
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsDone(true);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#18181b] border border-[#27272a] rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl animate-in fade-in zoom-in-95 text-[#fafafa]">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#27272a]">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#3b82f6]" />
            <h2 className="text-lg font-black text-[#fafafa]">
              Wedding Choreography Concierge
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#27272a] hover:bg-[#3f3f46] text-[#fafafa] flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {isDone ? (
          <div className="text-center py-8 space-y-4">
            <div className="w-16 h-16 rounded-full bg-[#22c55e]/15 border border-[#22c55e]/30 text-[#22c55e] flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(34,197,94,0.3)]">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-black text-[#fafafa]">Custom Quote Requested!</h3>
            <p className="text-xs text-[#a1a1aa] max-w-sm mx-auto">
              Our lead choreography director will reach out to you within 2 hours with customized music mix tracks and rehearsal slot availability.
            </p>
            <button
              onClick={onClose}
              className="px-8 py-3 rounded-2xl bg-[#3b82f6] hover:bg-[#2563eb] text-white text-xs font-black uppercase tracking-wider"
            >
              Done
            </button>
          </div>
        ) : (
          <div className="space-y-5">
            {/* Step 1: Event Details */}
            {step === 1 && (
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#fafafa]">Couple / Family Names</label>
                  <input
                    type="text"
                    value={formData.coupleName}
                    onChange={(e) => setFormData({ ...formData, coupleName: e.target.value })}
                    className="w-full p-3 bg-[#121215] border border-[#27272a] focus:border-[#3b82f6] text-xs text-[#fafafa] rounded-2xl outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#fafafa]">Sangeet / Event Date</label>
                    <input
                      type="date"
                      value={formData.weddingDate}
                      onChange={(e) => setFormData({ ...formData, weddingDate: e.target.value })}
                      className="w-full p-3 bg-[#121215] border border-[#27272a] focus:border-[#3b82f6] text-xs text-[#fafafa] rounded-2xl outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#fafafa]">City / Destination</label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full p-3 bg-[#121215] border border-[#27272a] focus:border-[#3b82f6] text-xs text-[#fafafa] rounded-2xl outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#fafafa]">Performances Needed</label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      'Couple First Dance',
                      'Family Sangeet Medley',
                      'Bride Solo / Friends',
                      'Flashmob & Troupe',
                    ].map((type) => {
                      const isChecked = formData.eventTypes.includes(type);
                      return (
                        <button
                          type="button"
                          key={type}
                          onClick={() => toggleEventType(type)}
                          className={`p-3 rounded-2xl border text-xs font-semibold text-left transition-all ${
                            isChecked
                              ? 'bg-[#3b82f6] text-white border-[#3b82f6]'
                              : 'bg-[#121215] text-[#a1a1aa] border-[#27272a]'
                          }`}
                        >
                          {type}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="w-full py-4 rounded-2xl bg-[#3b82f6] hover:bg-[#2563eb] text-white font-black text-xs uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(59,130,246,0.35)] flex items-center justify-center gap-2"
                >
                  <span>Continue to Song & Rehearsal Setup</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Step 2: Song & Rehearsal Setup */}
            {step === 2 && (
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#fafafa]">Song Ideas / Music Vision</label>
                  <textarea
                    rows={2}
                    value={formData.songsPreference}
                    onChange={(e) => setFormData({ ...formData, songsPreference: e.target.value })}
                    placeholder="E.g. Maahi Ve medley + slow acoustic romantic track for first dance..."
                    className="w-full p-3 bg-[#121215] border border-[#27272a] focus:border-[#3b82f6] text-xs text-[#fafafa] rounded-2xl outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#fafafa]">Rehearsal Format</label>
                    <select
                      value={formData.preferredMode}
                      onChange={(e) => setFormData({ ...formData, preferredMode: e.target.value })}
                      className="w-full p-3 bg-[#121215] border border-[#27272a] focus:border-[#3b82f6] text-xs text-[#fafafa] rounded-2xl outline-none"
                    >
                      <option value="Hybrid (Studio + Online)">Hybrid (Studio + Online)</option>
                      <option value="Studio Only (Mumbai)">Studio Only (Mumbai)</option>
                      <option value="100% Online Rehearsals">100% Online Rehearsals</option>
                      <option value="At-Home Private Visits">At-Home Private Visits</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#fafafa]">Phone / WhatsApp</label>
                    <input
                      type="text"
                      value={formData.contactNumber}
                      onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
                      className="w-full p-3 bg-[#121215] border border-[#27272a] focus:border-[#3b82f6] text-xs text-[#fafafa] rounded-2xl outline-none"
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="py-4 px-5 rounded-2xl bg-[#27272a] text-[#fafafa] font-bold text-xs"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="flex-1 py-4 rounded-2xl bg-[#3b82f6] hover:bg-[#2563eb] text-white font-black text-xs uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(59,130,246,0.35)] flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <span>Sending Request...</span>
                    ) : (
                      <span>Submit Request & Get Quote</span>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
