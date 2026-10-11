import React, { useState } from 'react';
import {
  DollarSign,
  CircleDollarSign,
  TrendingUp,
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  Download,
  Printer,
  X,
  Building2,
  Send,
  CreditCard,
  Sparkles,
} from 'lucide-react';
import { StudioPaymentRecord, MembershipPackage, StudioSettlement } from '../../types';

interface StudioFinanceTabProps {
  payments: StudioPaymentRecord[];
  memberships: MembershipPackage[];
  settlements: StudioSettlement[];
  studioLogoUrl: string;
  studioName: string;
  studioAddress: string;
  studioGstin: string;
  studioUpiId: string;
  onOpenGenerateInvoiceModal: () => void;
}

type FinanceSubTab = 'Payments' | 'Memberships' | 'Outstanding' | 'Refunds' | 'Settlement';

export const StudioFinanceTab: React.FC<StudioFinanceTabProps> = ({
  payments,
  memberships,
  settlements,
  studioLogoUrl,
  studioName,
  studioAddress,
  studioGstin,
  studioUpiId,
  onOpenGenerateInvoiceModal,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<FinanceSubTab>('Payments');
  const [activeInvoicePreview, setActiveInvoicePreview] = useState<StudioPaymentRecord | null>(null);

  // Outstanding Dues mock data
  const OUTSTANDING_DUES = [
    { id: 'out-1', studentName: 'Rohan Mehta', amount: 3500, dueDate: '15 Aug 2026', batch: 'Urban Choreography Intensive', phone: '+91 98110 55443', daysOverdue: 4 },
    { id: 'out-2', studentName: 'Tanvi Deshmukh', amount: 6800, dueDate: '18 Aug 2026', batch: 'Classical Kathak Batch', phone: '+91 98200 44112', daysOverdue: 1 },
    { id: 'out-3', studentName: 'Arjun Verma', amount: 1500, dueDate: '12 Aug 2026', batch: 'Studio B Rental Balance', phone: '+91 99203 77889', daysOverdue: 7 },
  ];

  // Refunds mock data
  const REFUNDS_DATA = [
    { id: 'ref-1', invoiceId: 'INV-2026-0854', studentName: 'Karan Malhotra', amount: 650, reason: 'Medical absence with certificate', status: 'Processed', date: '14 Aug 2026' },
    { id: 'ref-2', invoiceId: 'INV-2026-0842', studentName: 'Divya Sen', amount: 1200, reason: 'Class reschedule clash', status: 'Credited to Wallet', date: '11 Aug 2026' },
  ];

  // Compute stats
  const totalMonthRevenue = payments.reduce((acc, curr) => (curr.status === 'Paid' ? acc + curr.amount : acc), 0) + 320000;
  const totalOutstanding = OUTSTANDING_DUES.reduce((acc, curr) => acc + curr.amount, 0) + 16700;

  return (
    <div className="space-y-6">
      {/* 1. Finance Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#18181b] p-4 sm:p-5 rounded-3xl border border-[#27272a]">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-black uppercase tracking-wider text-[#10b981]">
              STUDIO FINANCE & INVOICING
            </span>
            <span className="text-xs text-[#22c55e] font-semibold">● GST Compliant</span>
          </div>
          <h2 className="text-xl font-black text-white">Focused Finance Command Hub</h2>
          <p className="text-xs text-[#a1a1aa]">
            Track revenue, auto-generate tax invoices with studio logo, and collect fee dues
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenGenerateInvoiceModal}
            className="px-4 py-2 rounded-xl bg-[#10b981] hover:bg-[#059669] text-white font-bold text-xs flex items-center gap-1.5 shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all"
          >
            <CircleDollarSign className="w-4 h-4" />
            <span>+ Generate Tax Invoice</span>
          </button>
        </div>
      </div>

      {/* 2. Overview 5 Essential Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="p-4 rounded-2xl bg-[#18181b] border border-[#27272a] space-y-1">
          <span className="text-xs font-medium text-[#71717a] block uppercase">Today's Collection</span>
          <p className="text-lg font-black text-[#22c55e]">₹18,500</p>
          <span className="text-xs text-[#22c55e] font-semibold">3 UPI Transactions</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#18181b] border border-[#27272a] space-y-1">
          <span className="text-xs font-medium text-[#71717a] block uppercase">This Month's Revenue</span>
          <p className="text-lg font-black text-white">₹{totalMonthRevenue.toLocaleString()}</p>
          <span className="text-xs text-[#10b981] font-semibold">+22% Growth</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#18181b] border border-[#27272a] space-y-1">
          <span className="text-xs font-medium text-[#71717a] block uppercase">Pending Payments</span>
          <p className="text-lg font-black text-[#ef4444]">₹{totalOutstanding.toLocaleString()}</p>
          <span className="text-xs text-[#ef4444] font-semibold">3 Overdue Dancers</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#18181b] border border-[#27272a] space-y-1">
          <span className="text-xs font-medium text-[#71717a] block uppercase">Refunds</span>
          <p className="text-lg font-black text-[#f97316]">₹1,850</p>
          <span className="text-xs text-[#71717a]">2 Processed</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#18181b] border border-[#27272a] space-y-1 col-span-2 sm:col-span-1">
          <span className="text-xs font-medium text-[#71717a] block uppercase">DanceOne Payouts</span>
          <p className="text-lg font-black text-[#3b82f6]">₹1,88,400</p>
          <span className="text-xs text-[#3b82f6] font-semibold">Auto Settled</span>
        </div>
      </div>

      {/* 3. Sub-Navigation Tabs */}
      <div className="bg-[#18181b] p-1.5 rounded-2xl border border-[#27272a]">
        <div className="grid grid-cols-5 gap-1 text-center">
          {(['Payments', 'Memberships', 'Outstanding', 'Refunds', 'Settlement'] as FinanceSubTab[]).map((tab) => {
            const isActive = activeSubTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveSubTab(tab)}
                className={`py-2 px-1 rounded-xl text-xs font-bold transition-all ${
                  isActive ? 'bg-[#10b981] text-white shadow-md' : 'text-[#a1a1aa] hover:text-white hover:bg-[#27272a]'
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>
      </div>

      {/* TAB 1: PAYMENTS & TAX INVOICE LEDGER */}
      {activeSubTab === 'Payments' && (
        <div className="p-5 rounded-3xl bg-[#18181b] border border-[#27272a] space-y-4">
          <div className="flex items-center justify-between border-b border-[#27272a] pb-3">
            <h3 className="text-sm font-black text-white">Invoice Ledger & Tax Receipts</h3>
            <span className="text-xs text-[#10b981] font-bold">{payments.length} Records</span>
          </div>

          <div className="space-y-3">
            {payments.map((p) => (
              <div
                key={p.id}
                className="p-4 rounded-2xl bg-[#09090b] border border-[#27272a] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[#3b82f6] font-bold">{p.invoiceNumber}</span>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                      p.status === 'Paid' ? 'bg-[#22c55e]/20 text-[#22c55e]' : 'bg-[#ef4444]/20 text-[#ef4444]'
                    }`}>
                      {p.status}
                    </span>
                  </div>
                  <h4 className="font-bold text-white text-sm">{p.studentName}</h4>
                  <p className="text-[#a1a1aa]">{p.itemDescription} • {p.date}</p>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4">
                  <div className="text-right">
                    <span className="text-base font-black text-white">₹{p.amount.toLocaleString()}</span>
                    <span className="text-xs text-[#71717a] block">{p.paymentMethod} • Incl. 18% GST</span>
                  </div>

                  <button
                    onClick={() => setActiveInvoicePreview(p)}
                    className="px-3 py-1.5 rounded-xl bg-[#27272a] hover:bg-[#3f3f46] text-[#3b82f6] font-bold text-xs flex items-center gap-1.5"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>View Invoice</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: MEMBERSHIPS & PACKAGES */}
      {activeSubTab === 'Memberships' && (
        <div className="p-5 rounded-3xl bg-[#18181b] border border-[#27272a] space-y-4">
          <div className="flex items-center justify-between border-b border-[#27272a] pb-3">
            <h3 className="text-sm font-black text-white">Active Studio Membership Plans & Flex Passes</h3>
            <span className="text-xs text-[#10b981] font-bold">{memberships.length} Packages</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {memberships.map((pkg) => (
              <div key={pkg.id} className="p-4 rounded-2xl bg-[#09090b] border border-[#27272a] space-y-3 flex flex-col justify-between text-xs">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-base font-black text-white">{pkg.title}</span>
                    <span className="text-base font-black text-[#10b981]">₹{pkg.price.toLocaleString()}</span>
                  </div>
                  <p className="text-[#a1a1aa]">{pkg.classesCount} Classes • Valid {pkg.validityDays} Days</p>
                  <p className="text-xs text-[#71717a]">{pkg.description}</p>
                </div>

                <div className="pt-2 border-t border-[#27272a]">
                  <button
                    onClick={onOpenGenerateInvoiceModal}
                    className="w-full py-2 rounded-xl bg-[#27272a] hover:bg-[#10b981] text-white font-bold text-xs transition-colors"
                  >
                    Sell Pass to Dancer
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: OUTSTANDING FEES */}
      {activeSubTab === 'Outstanding' && (
        <div className="p-5 rounded-3xl bg-[#18181b] border border-[#27272a] space-y-4">
          <div className="flex items-center justify-between border-b border-[#27272a] pb-3">
            <div>
              <h3 className="text-sm font-black text-white">Overdue Fees & Payment Recovery</h3>
              <p className="text-xs text-[#a1a1aa]">Send 1-click WhatsApp payment reminders with invoice links</p>
            </div>
            <span className="text-xs text-[#ef4444] font-bold">{OUTSTANDING_DUES.length} Overdue Dancers</span>
          </div>

          <div className="space-y-3">
            {OUTSTANDING_DUES.map((due) => (
              <div key={due.id} className="p-4 rounded-2xl bg-[#09090b] border border-[#27272a] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-white text-sm">{due.studentName}</h4>
                    <span className="text-xs text-[#ef4444] font-bold px-2 py-0.5 rounded bg-[#ef4444]/15">
                      {due.daysOverdue} Days Overdue
                    </span>
                  </div>
                  <p className="text-[#a1a1aa]">{due.batch} • Due since {due.dueDate}</p>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3">
                  <span className="text-base font-black text-[#ef4444]">₹{due.amount.toLocaleString()}</span>
                  <button
                    onClick={() => alert(`WhatsApp payment reminder link sent to ${due.studentName} (${due.phone})!`)}
                    className="px-3.5 py-1.5 rounded-xl bg-[#22c55e] hover:bg-[#16a34a] text-white font-bold text-xs flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>WhatsApp Reminder</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: REFUNDS */}
      {activeSubTab === 'Refunds' && (
        <div className="p-5 rounded-3xl bg-[#18181b] border border-[#27272a] space-y-4">
          <div className="flex items-center justify-between border-b border-[#27272a] pb-3">
            <h3 className="text-sm font-black text-white">Refund Log & Credit Adjustments</h3>
            <span className="text-xs text-[#f97316] font-bold">{REFUNDS_DATA.length} Records</span>
          </div>

          <div className="space-y-3">
            {REFUNDS_DATA.map((ref) => (
              <div key={ref.id} className="p-4 rounded-2xl bg-[#09090b] border border-[#27272a] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[#3b82f6] font-bold">{ref.invoiceId}</span>
                    <h4 className="font-bold text-white">{ref.studentName}</h4>
                  </div>
                  <p className="text-[#a1a1aa]">Reason: {ref.reason}</p>
                  <span className="text-xs text-[#71717a]">{ref.date}</span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-sm font-black text-[#f97316]">₹{ref.amount}</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#10b981]/20 text-[#10b981] font-bold text-xs">
                    {ref.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: SETTLEMENTS */}
      {activeSubTab === 'Settlement' && (
        <div className="p-5 rounded-3xl bg-[#18181b] border border-[#27272a] space-y-4">
          <div className="flex items-center justify-between border-b border-[#27272a] pb-3">
            <div>
              <h3 className="text-sm font-black text-white">DanceOne Direct Bank Payouts</h3>
              <p className="text-xs text-[#a1a1aa]">Auto-credited directly to studio bank account ({studioUpiId})</p>
            </div>
            <span className="text-xs text-[#3b82f6] font-bold">Daily T+1 Payouts</span>
          </div>

          <div className="space-y-3">
            {settlements.map((set) => (
              <div key={set.id} className="p-4 rounded-2xl bg-[#09090b] border border-[#27272a] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div>
                  <span className="text-xs font-mono text-[#3b82f6] font-bold block">{set.utr}</span>
                  <h4 className="font-bold text-white text-sm">Settlement Payout</h4>
                  <p className="text-[#71717a]">{set.date} • Period: {set.period}</p>
                </div>

                <div className="text-right">
                  <span className="text-base font-black text-[#22c55e]">₹{set.netAmount.toLocaleString()}</span>
                  <span className="text-xs text-[#71717a] block">Gross: ₹{set.grossAmount.toLocaleString()} (Fee: ₹{set.platformFee})</span>
                  <span className="text-xs text-[#22c55e] font-bold">● {set.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* FULL TAX INVOICE PREVIEW MODAL */}
      {activeInvoicePreview && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#18181b] border border-[#27272a] rounded-3xl max-w-lg w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#27272a] pb-3">
              <span className="text-xs font-black uppercase text-[#10b981]">TAX INVOICE PREVIEW</span>
              <button onClick={() => setActiveInvoicePreview(null)} className="text-[#71717a] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Render Printable Invoice */}
            <div className="p-6 rounded-2xl bg-white text-[#09090b] space-y-4 text-xs font-sans shadow-lg">
              <div className="flex items-start justify-between border-b border-[#e4e4e7] pb-3">
                <div className="space-y-1">
                  <h2 className="text-base font-black text-black">{studioName}</h2>
                  <p className="text-xs text-[#52525b] max-w-[200px]">{studioAddress}</p>
                  <p className="text-xs text-[#71717a]">GSTIN: <strong>{studioGstin}</strong></p>
                  <p className="text-xs text-[#71717a]">UPI: <strong>{studioUpiId}</strong></p>
                </div>

                <div className="text-right space-y-1">
                  {studioLogoUrl ? (
                    <img
                      src={studioLogoUrl}
                      alt={studioName}
                      referrerPolicy="no-referrer"
                      className="w-12 h-12 object-cover rounded-xl ml-auto border border-[#e4e4e7]"
                    />
                  ) : null}
                  <span className="text-xs font-mono font-bold block text-[#52525b]">
                    {activeInvoicePreview.invoiceNumber}
                  </span>
                  <span className="text-xs text-[#71717a] block">{activeInvoicePreview.date}</span>
                </div>
              </div>

              {/* Billed to */}
              <div className="space-y-0.5">
                <span className="text-xs uppercase font-bold text-[#71717a]">Billed To (Dancer):</span>
                <p className="font-bold text-sm text-black">{activeInvoicePreview.studentName}</p>
                <p className="text-xs text-[#52525b]">{activeInvoicePreview.studentPhone} • {activeInvoicePreview.studentEmail}</p>
              </div>

              {/* Item table */}
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-[#e4e4e7] text-[#71717a]">
                    <th className="py-1">Description</th>
                    <th className="py-1 text-right">Subtotal</th>
                    <th className="py-1 text-right">GST (18%)</th>
                    <th className="py-1 text-right">Total</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-[#e4e4e7]">
                    <td className="py-2 font-medium">{activeInvoicePreview.itemDescription}</td>
                    <td className="py-2 text-right">₹{activeInvoicePreview.subtotal.toLocaleString()}</td>
                    <td className="py-2 text-right">₹{activeInvoicePreview.taxAmount.toLocaleString()}</td>
                    <td className="py-2 text-right font-bold">₹{activeInvoicePreview.amount.toLocaleString()}</td>
                  </tr>
                </tbody>
              </table>

              <div className="flex justify-between items-center pt-2">
                <span className="text-xs text-[#71717a]">Payment Status: <strong className="text-emerald-700">{activeInvoicePreview.status}</strong> via {activeInvoicePreview.paymentMethod}</span>
                <span className="text-sm font-black text-black">Total Paid: ₹{activeInvoicePreview.amount.toLocaleString()}</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 rounded-xl bg-[#27272a] hover:bg-[#3f3f46] text-white font-bold text-xs flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Invoice</span>
              </button>
              <button
                onClick={() => {
                  alert(`Invoice downloaded as PDF.`);
                  setActiveInvoicePreview(null);
                }}
                className="px-4 py-2 rounded-xl bg-[#10b981] hover:bg-[#059669] text-white font-bold text-xs flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

