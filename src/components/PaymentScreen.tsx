import React, { useState } from 'react';
import {
  ArrowLeft,
  ShieldCheck,
  CreditCard,
  QrCode,
  Smartphone,
  Lock,
  CheckCircle2,
  Sparkles,
  Zap,
} from 'lucide-react';
import { Booking, DanceClass } from '../types';

interface PaymentScreenProps {
  bookingDetails: {
    danceClass: DanceClass;
    selectedDate: string;
    selectedTime: string;
    totalAmount: number;
  };
  onBack: () => void;
  onPaymentSuccess: (booking: Booking) => void;
}

export const PaymentScreen: React.FC<PaymentScreenProps> = ({
  bookingDetails,
  onBack,
  onPaymentSuccess,
}) => {
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'applepay'>('upi');
  const [upiId, setUpiId] = useState('ananya@okhdfcbank');
  const [isProcessing, setIsProcessing] = useState(false);

  const { danceClass, selectedDate, selectedTime, totalAmount } = bookingDetails;
  const platformFee = 25;
  const grandTotal = totalAmount + platformFee;

  const handlePay = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      const newBooking: Booking = {
        id: `bk-${Date.now()}`,
        bookingCode: `#DN-${Math.floor(1000 + Math.random() * 9000)}-${danceClass.category.slice(0, 1)}`,
        classTitle: danceClass.title,
        instructorName: danceClass.instructor,
        category: danceClass.category,
        date: selectedDate,
        time: selectedTime,
        studioName: danceClass.studio,
        room: 'Room B (Main Studio Floor)',
        location: danceClass.location,
        price: grandTotal,
        currency: danceClass.currency,
        paymentMethod: paymentMethod === 'upi' ? 'UPI / GPay' : paymentMethod === 'card' ? 'Credit Card' : 'Apple Pay',
        bookedAt: new Date().toISOString(),
        status: 'confirmed',
        qrCodeUrl:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuBqYSmmRk7JqWXUHZQHedHkHt77sN8v0iOOXSfibtfZSNLCReXM6u3f9SLv-A9LWTni0GoTAaFYouQQgu0A1DcLY-v2RZypNhaQYpxJC7YvS-acRlcOjL10_S4Yqbr7EN103W_NGBUA9tF79K5zZ4pxiWRgs9EjKoKnM5-dZc__0M5WBVq8Y9GGIlCYAglgBxCsqaMmH3XxPyYFvX05YLjpAuPd9mbEMUzRq0wgDEhbc_HzarUutJx5IA',
      };
      onPaymentSuccess(newBooking);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-[#fafafa] pb-32">
      {/* Top Bar */}
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
              Step 2 of 2
            </span>
            <h1 className="text-base font-black text-[#fafafa]">Secure Studio Checkout</h1>
          </div>
          <div className="w-10" />
        </div>
      </header>

      {/* Main Container */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Pass Breakdown Overview */}
        <div className="p-6 rounded-3xl bg-[#18181b] border border-[#27272a] space-y-4 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-[#27272a]">
            <div>
              <span className="text-xs uppercase font-extrabold text-[#3b82f6] tracking-wider block">
                Class Reservation
              </span>
              <h2 className="text-lg font-black text-[#fafafa]">{danceClass.title}</h2>
            </div>
            <span className="px-3 py-1 rounded-full bg-[#27272a] text-[#fafafa] border border-[#3f3f46] text-xs font-bold">
              {danceClass.category}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-[#a1a1aa]">
            <div>
              <span className="text-[#71717a] block">Date & Timing</span>
              <strong className="text-[#fafafa] font-bold text-sm block mt-0.5">
                {selectedDate} • {selectedTime}
              </strong>
            </div>
            <div>
              <span className="text-[#71717a] block">Studio Venue</span>
              <strong className="text-[#fafafa] font-bold text-sm block mt-0.5">
                {danceClass.location}
              </strong>
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="space-y-4">
          <label className="text-xs font-black uppercase tracking-wider text-[#a1a1aa] block">
            Select Payment Method
          </label>

          {/* UPI */}
          <div
            onClick={() => setPaymentMethod('upi')}
            className={`p-5 rounded-3xl border transition-all cursor-pointer ${
              paymentMethod === 'upi'
                ? 'bg-[#18181b] border-[#3b82f6] shadow-[0_0_15px_rgba(59,130,246,0.2)] ring-1 ring-[#3b82f6]'
                : 'bg-[#18181b] border-[#27272a] hover:border-[#3f3f46]'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#27272a] border border-[#3f3f46] text-[#3b82f6] flex items-center justify-center font-black text-xs">
                  UPI
                </div>
                <div>
                  <h3 className="text-sm font-black text-[#fafafa]">Instant UPI / GPay / PhonePe</h3>
                  <p className="text-xs text-[#a1a1aa]">Zero convenience charges</p>
                </div>
              </div>
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  paymentMethod === 'upi' ? 'border-[#3b82f6] bg-[#3b82f6]' : 'border-[#3f3f46]'
                }`}
              >
                {paymentMethod === 'upi' && <div className="w-2 h-2 rounded-full bg-white" />}
              </div>
            </div>

            {paymentMethod === 'upi' && (
              <div className="mt-4 pt-4 border-t border-[#27272a] space-y-2">
                <input
                  type="text"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  placeholder="Enter your UPI ID (e.g. mobile@upi)"
                  className="w-full p-3 bg-[#121215] border border-[#27272a] focus:border-[#3b82f6] text-xs text-[#fafafa] rounded-2xl outline-none"
                />
              </div>
            )}
          </div>

          {/* Credit/Debit Card */}
          <div
            onClick={() => setPaymentMethod('card')}
            className={`p-5 rounded-3xl border transition-all cursor-pointer ${
              paymentMethod === 'card'
                ? 'bg-[#18181b] border-[#3b82f6] shadow-[0_0_15px_rgba(59,130,246,0.2)] ring-1 ring-[#3b82f6]'
                : 'bg-[#18181b] border-[#27272a] hover:border-[#3f3f46]'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#27272a] border border-[#3f3f46] text-[#fafafa] flex items-center justify-center">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-[#fafafa]">Credit or Debit Card</h3>
                  <p className="text-xs text-[#a1a1aa]">Visa, Mastercard, RuPay</p>
                </div>
              </div>
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  paymentMethod === 'card' ? 'border-[#3b82f6] bg-[#3b82f6]' : 'border-[#3f3f46]'
                }`}
              >
                {paymentMethod === 'card' && <div className="w-2 h-2 rounded-full bg-white" />}
              </div>
            </div>
          </div>

          {/* Apple Pay */}
          <div
            onClick={() => setPaymentMethod('applepay')}
            className={`p-5 rounded-3xl border transition-all cursor-pointer ${
              paymentMethod === 'applepay'
                ? 'bg-[#18181b] border-[#3b82f6] shadow-[0_0_15px_rgba(59,130,246,0.2)] ring-1 ring-[#3b82f6]'
                : 'bg-[#18181b] border-[#27272a] hover:border-[#3f3f46]'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#27272a] border border-[#3f3f46] text-[#fafafa] flex items-center justify-center">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-[#fafafa]">Apple Pay / Google Wallet</h3>
                  <p className="text-xs text-[#a1a1aa]">One-tap biometric checkout</p>
                </div>
              </div>
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  paymentMethod === 'applepay' ? 'border-[#3b82f6] bg-[#3b82f6]' : 'border-[#3f3f46]'
                }`}
              >
                {paymentMethod === 'applepay' && <div className="w-2 h-2 rounded-full bg-white" />}
              </div>
            </div>
          </div>
        </div>

        {/* Cost Summary Breakdown */}
        <div className="p-6 rounded-3xl bg-[#18181b] border border-[#27272a] space-y-3 text-xs">
          <h3 className="text-xs font-black uppercase tracking-wider text-[#a1a1aa]">
            Price Summary
          </h3>
          <div className="flex justify-between text-[#a1a1aa]">
            <span>Class Pass Fee</span>
            <span className="font-bold text-[#fafafa]">{danceClass.currency}{totalAmount}</span>
          </div>
          <div className="flex justify-between text-[#a1a1aa]">
            <span>Studio Protection & Insurance</span>
            <span className="font-bold text-[#fafafa]">{danceClass.currency}{platformFee}</span>
          </div>
          <div className="pt-3 border-t border-[#27272a] flex justify-between text-base font-black text-[#fafafa]">
            <span>Total Payable</span>
            <span className="text-[#3b82f6]">{danceClass.currency}{grandTotal}</span>
          </div>
        </div>
      </div>

      {/* Floating Bottom Pay Action */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#09090b]/95 backdrop-blur-md border-t border-[#27272a] px-4 sm:px-8 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-[#a1a1aa]">
            <Lock className="w-4 h-4 text-[#22c55e]" />
            <span>256-Bit Encrypted Studio Escrow</span>
          </div>

          <button
            onClick={handlePay}
            disabled={isProcessing}
            className="px-8 py-4 rounded-2xl bg-[#3b82f6] hover:bg-[#2563eb] disabled:opacity-50 text-white font-black text-xs uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(59,130,246,0.35)] active:scale-98 flex items-center gap-2"
          >
            {isProcessing ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Confirming Booking...</span>
              </>
            ) : (
              <>
                <span>Pay {danceClass.currency}{grandTotal}</span>
                <Zap className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

