import React, { useState } from 'react';
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Info,
} from 'lucide-react';
import { DanceClass } from '../types';

interface SlotSelectionScreenProps {
  danceClass: DanceClass;
  onBack: () => void;
  onContinueToPayment: (details: {
    danceClass: DanceClass;
    selectedDate: string;
    selectedTime: string;
    totalAmount: number;
  }) => void;
}

export const SlotSelectionScreen: React.FC<SlotSelectionScreenProps> = ({
  danceClass,
  onBack,
  onContinueToPayment,
}) => {
  const DATES = [
    { day: 'TODAY', date: 'Oct 21', full: 'Sat, Oct 21, 2023', available: true },
    { day: 'SUN', date: 'Oct 22', full: 'Sun, Oct 22, 2023', available: true },
    { day: 'MON', date: 'Oct 23', full: 'Mon, Oct 23, 2023', available: false },
    { day: 'TUE', date: 'Oct 24', full: 'Tue, Oct 24, 2023', available: true },
    { day: 'WED', date: 'Oct 25', full: 'Wed, Oct 25, 2023', available: true },
  ];

  const TIME_SLOTS = [
    { time: '10:00 AM - 11:30 AM', spots: 4, room: 'Room B (Sprung Hardwood)', isFull: false },
    { time: '02:30 PM - 04:00 PM', spots: 2, room: 'Studio 1 (Main Hall)', isFull: false },
    { time: '06:00 PM - 07:30 PM', spots: 0, room: 'Room B (Evening Session)', isFull: true },
    { time: '08:00 PM - 09:30 PM', spots: 6, room: 'Studio 2 (Acoustic Lounge)', isFull: false },
  ];

  const [selectedDateIdx, setSelectedDateIdx] = useState(0);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(TIME_SLOTS[0]);
  const [quantity, setQuantity] = useState(1);

  const totalAmount = danceClass.price * quantity;

  const handleProceed = () => {
    onContinueToPayment({
      danceClass,
      selectedDate: DATES[selectedDateIdx].full,
      selectedTime: selectedTimeSlot.time,
      totalAmount,
    });
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-[#fafafa] pb-32">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-[#09090b]/95 backdrop-blur-md border-b border-[#27272a] px-4 sm:px-8 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <button
            onClick={onBack}
            className="w-10 h-10 rounded-full bg-[#18181b] border border-[#27272a] hover:border-[#3b82f6] flex items-center justify-center text-white transition-all shadow-md"
            aria-label="Back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="text-center">
            <span className="text-xs uppercase font-extrabold tracking-widest text-[#71717a] block">
              Step 1 of 2
            </span>
            <h1 className="text-base font-black text-[#fafafa]">Select Date & Studio Slot</h1>
          </div>
          <div className="w-10" />
        </div>
      </header>

      {/* Main Form Body */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Selected Class Summary Card */}
        <div className="p-5 rounded-3xl bg-[#18181b] border border-[#27272a] flex flex-col sm:flex-row items-center gap-5 shadow-sm">
          <img
            src={danceClass.image}
            alt={danceClass.title}
            referrerPolicy="no-referrer"
            className="w-full sm:w-32 h-28 rounded-2xl object-cover shrink-0 border border-[#27272a] opacity-90"
          />
          <div className="space-y-1.5 flex-1 w-full text-center sm:text-left">
            <span className="px-2.5 py-0.5 rounded-full bg-[#27272a] text-[#fafafa] border border-[#3f3f46] text-xs font-extrabold uppercase">
              {danceClass.category} • {danceClass.level}
            </span>
            <h2 className="text-lg font-black text-[#fafafa]">{danceClass.title}</h2>
            <p className="text-xs text-[#a1a1aa] flex items-center justify-center sm:justify-start gap-1">
              <MapPin className="w-3.5 h-3.5 text-[#3b82f6]" />
              <span>{danceClass.location}</span>
            </p>
            <p className="text-xs text-[#71717a]">
              Led by Instructor: <strong className="text-[#fafafa]">{danceClass.instructor}</strong>
            </p>
          </div>
          <div className="text-center sm:text-right shrink-0">
            <span className="text-xs text-[#71717a] uppercase font-bold block">Rate / Pass</span>
            <span className="text-xl font-black text-[#fafafa]">
              {danceClass.currency}{danceClass.price}
            </span>
          </div>
        </div>

        {/* Date Selector Carousel */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-black uppercase tracking-wider text-[#a1a1aa] flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#3b82f6]" />
              <span>1. Choose Session Date</span>
            </label>
            <span className="text-xs font-bold text-[#3b82f6]">
              {DATES[selectedDateIdx].full}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {DATES.map((d, idx) => {
              const isSelected = selectedDateIdx === idx;
              return (
                <button
                  key={idx}
                  disabled={!d.available}
                  onClick={() => setSelectedDateIdx(idx)}
                  className={`p-4 rounded-2xl flex flex-col items-center justify-center gap-1 transition-all border ${
                    !d.available
                      ? 'opacity-40 bg-[#121215] border-[#27272a] cursor-not-allowed text-[#71717a]'
                      : isSelected
                      ? 'bg-[#3b82f6] text-white border-[#3b82f6] shadow-[0_0_15px_rgba(59,130,246,0.35)] scale-102'
                      : 'bg-[#18181b] text-[#fafafa] border-[#27272a] hover:border-[#3f3f46]'
                  }`}
                >
                  <span className="text-xs font-black uppercase tracking-wider opacity-80">
                    {d.day}
                  </span>
                  <span className="text-lg font-black">{d.date}</span>
                  <span className="text-xs font-bold">
                    {d.available ? 'Slots Open' : 'Full'}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Time Slot Pickers */}
        <div className="space-y-3">
          <label className="text-xs font-black uppercase tracking-wider text-[#a1a1aa] flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#3b82f6]" />
            <span>2. Choose Timing & Floor Capacity</span>
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {TIME_SLOTS.map((slot, idx) => {
              const isSelected = selectedTimeSlot.time === slot.time;
              return (
                <button
                  key={idx}
                  disabled={slot.isFull}
                  onClick={() => setSelectedTimeSlot(slot)}
                  className={`p-5 rounded-3xl text-left transition-all border flex items-center justify-between ${
                    slot.isFull
                      ? 'opacity-40 bg-[#121215] border-[#27272a] cursor-not-allowed'
                      : isSelected
                      ? 'bg-[#18181b] border-[#3b82f6] shadow-[0_0_15px_rgba(59,130,246,0.2)] ring-1 ring-[#3b82f6]'
                      : 'bg-[#18181b] border-[#27272a] hover:border-[#3f3f46]'
                  }`}
                >
                  <div className="space-y-1">
                    <span className="text-sm font-black text-[#fafafa] block">
                      {slot.time}
                    </span>
                    <span className="text-xs text-[#a1a1aa] block">{slot.room}</span>
                  </div>

                  <div className="text-right">
                    {slot.isFull ? (
                      <span className="px-2.5 py-1 rounded-full bg-[#27272a] text-[#71717a] text-xs font-extrabold uppercase">
                        Sold Out
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full bg-[#ef4444]/20 border border-[#ef4444]/40 text-[#ef4444] text-xs font-extrabold uppercase">
                        {slot.spots} spots left
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Pass Quantity & Studio Access Guidelines */}
        <div className="p-5 rounded-3xl bg-[#18181b] border border-[#27272a] space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-black text-[#fafafa]">Number of Dancer Passes</h3>
              <p className="text-xs text-[#a1a1aa]">Bringing a friend or dance partner?</p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-9 h-9 rounded-xl bg-[#27272a] border border-[#3f3f46] text-[#fafafa] font-black text-base hover:bg-[#3f3f46]"
              >
                -
              </button>
              <span className="text-base font-black text-[#fafafa] w-6 text-center">{quantity}</span>
              <button
                onClick={() => setQuantity(Math.min(4, quantity + 1))}
                className="w-9 h-9 rounded-xl bg-[#27272a] border border-[#3f3f46] text-[#fafafa] font-black text-base hover:bg-[#3f3f46]"
              >
                +
              </button>
            </div>
          </div>

          <div className="pt-3 border-t border-[#27272a] flex items-start gap-2.5 text-xs text-[#a1a1aa]">
            <Info className="w-4 h-4 text-[#3b82f6] shrink-0 mt-0.5" />
            <p>
              Please arrive 15 minutes before slot start time for warmup and check-in. Changing rooms and filtered water are provided free at the studio.
            </p>
          </div>
        </div>
      </div>

      {/* Floating Bottom Checkout Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#09090b]/95 backdrop-blur-md border-t border-[#27272a] px-4 sm:px-8 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
          <div>
            <span className="text-xs uppercase font-bold text-[#71717a] block">
              Total ({quantity} {quantity === 1 ? 'Pass' : 'Passes'})
            </span>
            <span className="text-2xl font-black text-[#fafafa]">
              {danceClass.currency}{totalAmount}
            </span>
          </div>

          <button
            onClick={handleProceed}
            className="px-8 py-4 rounded-2xl bg-[#3b82f6] hover:bg-[#2563eb] text-white font-black text-xs uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(59,130,246,0.35)] flex items-center gap-2 active:scale-98"
          >
            <span>Proceed to Payment</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

