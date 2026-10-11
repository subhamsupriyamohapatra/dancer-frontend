import React, { useState } from 'react';
import {
  DollarSign,
  TrendingUp,
  Receipt,
  Download,
  CreditCard,
  Building2,
  CheckCircle2,
  AlertCircle,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  ShieldCheck,
  FileSpreadsheet,
  Ticket,
  Users,
  RotateCcw,
  Wallet,
  Coins,
} from 'lucide-react';
import { OrganizerEventRecord } from '../../types/organizer';
import { ORGANIZER_FINANCIAL_SUMMARY } from '../../data/organizerData';

interface OrganizerFinanceViewProps {
  events: OrganizerEventRecord[];
}

export const OrganizerFinanceView: React.FC<OrganizerFinanceViewProps> = ({ events }) => {
  const [financeData, setFinanceData] = useState(ORGANIZER_FINANCIAL_SUMMARY);

  // 8 Segregated Finance Sub-tabs
  const [subTab, setSubTab] = useState<
    | 'registrations'
    | 'ticket_sales'
    | 'payments'
    | 'expenses'
    | 'refunds'
    | 'payouts'
    | 'settlements'
    | 'revenue_reports'
  >('registrations');

  const [showAddExpenseModal, setShowAddExpenseModal] = useState(false);
  const [newExpenseName, setNewExpenseName] = useState('');
  const [newExpenseCat, setNewExpenseCat] = useState<'Venue' | 'Sound/Lights' | 'Judges' | 'Staff' | 'Marketing' | 'Prize Pool'>('Venue');
  const [newExpenseAmt, setNewExpenseAmt] = useState('');

  // Calculate live numbers from created events
  const totalEventRevenue = events.reduce((sum, ev) => sum + (ev.revenue || 0), 0);
  const totalRegisteredAthletes = events.reduce((sum, ev) => sum + (ev.registeredCount || ev.participants?.length || 0), 0);
  const totalExpenses = financeData.expenses.reduce((sum, exp) => sum + exp.amount, 0) + events.reduce((sum, ev) => sum + (ev.expenses || 0), 0);
  const netProfit = totalEventRevenue - totalExpenses;
  const marginPercentage = totalEventRevenue > 0 ? ((netProfit / totalEventRevenue) * 100).toFixed(1) : '0.0';

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExpenseName.trim() || !newExpenseAmt) return;

    const newExp = {
      id: `exp-${Date.now()}`,
      category: newExpenseCat,
      name: newExpenseName.trim(),
      amount: Number(newExpenseAmt),
      status: 'Pending' as const,
      recipient: 'Vendor',
    };

    setFinanceData({
      ...financeData,
      expenses: [newExp, ...financeData.expenses],
      totalExpenses: financeData.totalExpenses + Number(newExpenseAmt),
      netProfit: financeData.netProfit - Number(newExpenseAmt),
    });

    setNewExpenseName('');
    setNewExpenseAmt('');
    setShowAddExpenseModal(false);
  };

  return (
    <div className="space-y-4">
      {/* 1. Top Summary Banner */}
      <div className="bg-[#141417] border border-[#27272a] rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
        <div>
          <h2 className="text-sm sm:text-base font-bold text-white tracking-tight flex items-center gap-1.5">
            <DollarSign className="w-4 h-4 text-[#22c55e]" />
            <span>Financial Command, P&L & Treasury</span>
          </h2>
          <p className="text-xs text-[#a1a1aa]">
            Consolidated entry collections, box office sales, expense logs, staff payouts, and bank settlements.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => alert('Exporting financial ledger (CSV)...')}
            className="px-2.5 py-1.5 bg-[#202024] hover:bg-[#27272a] text-white text-xs font-medium rounded-xl flex items-center gap-1.5 border border-[#27272a] transition-all"
          >
            <Download className="w-3.5 h-3.5 text-[#a1a1aa]" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* 2. Top-Level Metric Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3 rounded-xl bg-[#141417] border border-[#27272a]">
          <span className="text-xs text-[#71717a] font-bold uppercase block">Gross Inflow</span>
          <span className="text-lg font-bold text-[#22c55e]">
            ₹{totalEventRevenue.toLocaleString()}
          </span>
          <span className="text-xs text-[#71717a] block mt-0.5">{totalRegisteredAthletes} Paid Entries</span>
        </div>

        <div className="p-3 rounded-xl bg-[#141417] border border-[#27272a]">
          <span className="text-xs text-[#71717a] font-bold uppercase block">Total Expenses</span>
          <span className="text-lg font-bold text-rose-400">
            ₹{totalExpenses.toLocaleString()}
          </span>
          <span className="text-xs text-[#71717a] block mt-0.5">{financeData.expenses.length} Logged Items</span>
        </div>

        <div className="p-3 rounded-xl bg-[#141417] border border-[#27272a]">
          <span className="text-xs text-[#71717a] font-bold uppercase block">Net Margin / Profit</span>
          <span className={`text-lg font-bold ${netProfit >= 0 ? 'text-[#eab308]' : 'text-rose-400'}`}>
            ₹{netProfit.toLocaleString()}
          </span>
          <span className="text-xs text-[#22c55e] block mt-0.5">
            {marginPercentage}% Margin
          </span>
        </div>

        <div className="p-3 rounded-xl bg-[#141417] border border-[#27272a]">
          <span className="text-xs text-[#71717a] font-bold uppercase block">Pending Settlement</span>
          <span className="text-lg font-bold text-cyan-400">
            ₹0
          </span>
          <span className="text-xs text-[#71717a] block mt-0.5">Payout Cycle: Daily (T+1)</span>
        </div>
      </div>

      {/* 3. 8 Segregated Sub-Navigation Tabs */}
      <div className="flex items-center bg-[#141417] p-1 rounded-xl border border-[#27272a] overflow-x-auto no-scrollbar gap-1">
        {[
          { id: 'registrations', label: 'Registrations', icon: Users },
          { id: 'ticket_sales', label: 'Ticket Sales', icon: Ticket },
          { id: 'payments', label: 'Payments', icon: CreditCard },
          { id: 'expenses', label: 'Expenses', icon: ArrowDownRight },
          { id: 'refunds', label: 'Refunds', icon: RotateCcw },
          { id: 'payouts', label: 'Payouts', icon: Wallet },
          { id: 'settlements', label: 'Settlements', icon: Building2 },
          { id: 'revenue_reports', label: 'Revenue Reports', icon: FileSpreadsheet },
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

      {/* 4. Sub-Tab Views */}
      {/* 4.1 REGISTRATIONS */}
      {subTab === 'registrations' && (
        <div className="p-4 rounded-xl bg-[#141417] border border-[#27272a] space-y-3">
          <span className="text-xs font-bold text-white block">Participant Entry Fees Ledger</span>
          {events.length === 0 ? (
            <div className="p-8 text-center bg-[#18181b] border border-[#27272a] rounded-xl space-y-2">
              <Users className="w-6 h-6 text-[#71717a] mx-auto opacity-60" />
              <p className="text-xs text-[#a1a1aa]">No registration fee collections recorded.</p>
            </div>
          ) : (
            <div className="overflow-x-auto border border-[#27272a] rounded-lg">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#18181b] text-xs text-[#a1a1aa] uppercase font-bold border-b border-[#27272a]">
                  <tr>
                    <th className="p-2.5">Event Name</th>
                    <th className="p-2.5">Type</th>
                    <th className="p-2.5">Paid Entries</th>
                    <th className="p-2.5">Total Collected</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#27272a]">
                  {events.map((ev) => (
                    <tr key={ev.id} className="hover:bg-[#18181b]/50">
                      <td className="p-2.5 font-bold text-white">{ev.title}</td>
                      <td className="p-2.5 text-[#a1a1aa] capitalize">{ev.type.replace(/_/g, ' ')}</td>
                      <td className="p-2.5 text-white">{ev.registeredCount || ev.participants?.length || 0} entries</td>
                      <td className="p-2.5 font-bold text-[#22c55e] font-mono">₹{(ev.revenue || 0).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* 4.2 TICKET SALES */}
      {subTab === 'ticket_sales' && (
        <div className="p-4 rounded-xl bg-[#141417] border border-[#27272a] space-y-3">
          <span className="text-xs font-bold text-white block">Audience Box Office & Pass Sales</span>
          {events.every((e) => !e.ticketPricing || e.ticketPricing.length === 0) ? (
            <div className="p-8 text-center bg-[#18181b] border border-[#27272a] rounded-xl space-y-2">
              <Ticket className="w-6 h-6 text-[#71717a] mx-auto opacity-60" />
              <p className="text-xs text-[#a1a1aa]">No active audience ticket tiers configured.</p>
              <p className="text-xs text-[#71717a]">
                Configure ticket tiers in your event's management workspace to start selling audience passes.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              {events
                .flatMap((e) => e.ticketPricing || [])
                .map((t, idx) => (
                  <div key={idx} className="p-3 rounded-lg bg-[#18181b] border border-[#27272a] space-y-1">
                    <span className="font-bold text-white block">{t.tier}</span>
                    <span className="text-xs text-[#a1a1aa] block">Price: ₹{t.price} • {t.sold}/{t.capacity} Sold</span>
                    <span className="text-sm font-bold text-[#22c55e] block pt-1">₹{(t.price * t.sold).toLocaleString()}</span>
                  </div>
                ))}
            </div>
          )}
        </div>
      )}

      {/* 4.3 PAYMENTS */}
      {subTab === 'payments' && (
        <div className="p-4 rounded-xl bg-[#141417] border border-[#27272a] space-y-3">
          <span className="text-xs font-bold text-white block">Payment Gateway Transactions</span>
          <div className="p-8 text-center bg-[#18181b] border border-[#27272a] rounded-xl space-y-2">
            <CreditCard className="w-6 h-6 text-[#71717a] mx-auto opacity-60" />
            <p className="text-xs text-[#a1a1aa]">No payment gateway transactions processed yet.</p>
            <p className="text-xs text-[#71717a]">
              Live UPI, Card, and Netbanking payments will be captured in real-time.
            </p>
          </div>
        </div>
      )}

      {/* 4.4 EXPENSES */}
      {subTab === 'expenses' && (
        <div className="p-4 rounded-xl bg-[#141417] border border-[#27272a] space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white">Operational Expenses Ledger</span>
            <button
              onClick={() => setShowAddExpenseModal(true)}
              className="px-2.5 py-1 bg-[#27272a] text-white text-xs font-medium rounded-lg flex items-center gap-1"
            >
              <Plus className="w-3 h-3 text-[#eab308]" />
              <span>+ Add Expense</span>
            </button>
          </div>

          {financeData.expenses.length === 0 ? (
            <div className="p-8 text-center bg-[#18181b] border border-[#27272a] rounded-xl space-y-2">
              <ArrowDownRight className="w-6 h-6 text-[#71717a] mx-auto opacity-60" />
              <p className="text-xs text-[#a1a1aa]">No expenses logged yet.</p>
              <p className="text-xs text-[#71717a]">
                Click "+ Add Expense" to track stage rentals, lighting, judges fees, and production costs.
              </p>
            </div>
          ) : (
            <div className="space-y-2 text-xs">
              {financeData.expenses.map((exp) => (
                <div key={exp.id} className="p-2.5 rounded-lg bg-[#18181b] border border-[#27272a] flex items-center justify-between">
                  <div>
                    <span className="font-bold text-white block">{exp.name}</span>
                    <span className="text-xs text-[#a1a1aa]">{exp.category} • Recipient: {exp.recipient}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-mono font-bold text-rose-400 block">₹{exp.amount.toLocaleString()}</span>
                    <span className="text-xs text-[#a1a1aa]">{exp.status}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 4.5 REFUNDS */}
      {subTab === 'refunds' && (
        <div className="p-4 rounded-xl bg-[#141417] border border-[#27272a] space-y-3 text-xs">
          <span className="text-xs font-bold text-white block">Refund & Cancellation Requests</span>
          <div className="p-8 text-center bg-[#18181b] border border-[#27272a] rounded-xl space-y-2">
            <RotateCcw className="w-6 h-6 text-[#71717a] mx-auto opacity-60" />
            <p className="text-xs text-[#a1a1aa]">No pending refund requests.</p>
            <p className="text-xs text-[#71717a]">
              Refund requests submitted by participants or ticket buyers will appear here for verification.
            </p>
          </div>
        </div>
      )}

      {/* 4.6 PAYOUTS */}
      {subTab === 'payouts' && (
        <div className="p-4 rounded-xl bg-[#141417] border border-[#27272a] space-y-3 text-xs">
          <span className="text-xs font-bold text-white block">Judges, MC, DJ & Prize Honorarium Disbursements</span>
          <div className="p-8 text-center bg-[#18181b] border border-[#27272a] rounded-xl space-y-2">
            <Wallet className="w-6 h-6 text-[#71717a] mx-auto opacity-60" />
            <p className="text-xs text-[#a1a1aa]">No payouts scheduled yet.</p>
            <p className="text-xs text-[#71717a]">
              Automated honorarium and prize pool disbursement transfers will be tracked here.
            </p>
          </div>
        </div>
      )}

      {/* 4.7 SETTLEMENTS */}
      {subTab === 'settlements' && (
        <div className="p-4 rounded-xl bg-[#141417] border border-[#27272a] space-y-3 text-xs">
          <span className="text-xs font-bold text-white block">Bank Direct Settlements</span>
          <div className="p-8 text-center bg-[#18181b] border border-[#27272a] rounded-xl space-y-2">
            <Building2 className="w-6 h-6 text-[#71717a] mx-auto opacity-60" />
            <p className="text-xs text-[#a1a1aa]">No past settlements generated.</p>
            <p className="text-xs text-[#71717a]">
              Automatic daily bank settlements with UTR tracking will appear as revenue is collected.
            </p>
          </div>
        </div>
      )}

      {/* 4.8 REVENUE REPORTS */}
      {subTab === 'revenue_reports' && (
        <div className="p-4 rounded-xl bg-[#141417] border border-[#27272a] space-y-3 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white">Full Season Profit & Loss Statement</span>
            <button
              onClick={() => alert('Downloading official PDF Tax Invoice & P&L Statement...')}
              className="px-2.5 py-1 bg-[#27272a] text-white text-xs font-medium rounded-lg flex items-center gap-1"
            >
              <Download className="w-3 h-3 text-[#eab308]" />
              <span>Download PDF Audit</span>
            </button>
          </div>

          <div className="p-4 rounded-lg bg-[#18181b] border border-[#27272a] space-y-2">
            <div className="flex justify-between py-1 border-b border-[#27272a]">
              <span className="text-[#a1a1aa]">Total Registrations & Entry Collections:</span>
              <strong className="text-white font-mono">₹{totalEventRevenue.toLocaleString()}</strong>
            </div>
            <div className="flex justify-between py-1 border-b border-[#27272a]">
              <span className="text-[#a1a1aa]">Total Ticket Sales & Box Office:</span>
              <strong className="text-white font-mono">₹0</strong>
            </div>
            <div className="flex justify-between py-1 border-b border-[#27272a]">
              <span className="text-rose-400">Total Event Expenses & Payouts:</span>
              <strong className="text-rose-400 font-mono">- ₹{totalExpenses.toLocaleString()}</strong>
            </div>
            <div className="flex justify-between py-2 text-sm font-bold">
              <span className="text-[#eab308]">Consolidated Net Organizer Profit:</span>
              <strong className={`font-mono ${netProfit >= 0 ? 'text-[#22c55e]' : 'text-rose-400'}`}>
                ₹{netProfit.toLocaleString()}
              </strong>
            </div>
          </div>
        </div>
      )}

      {/* Add Expense Modal */}
      {showAddExpenseModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#141417] border border-[#27272a] rounded-2xl w-full max-w-sm p-4 space-y-3">
            <h3 className="text-xs font-bold text-white">Record New Expense</h3>
            <form onSubmit={handleAddExpense} className="space-y-2 text-xs">
              <div>
                <label className="text-xs text-[#a1a1aa] block uppercase">Expense Name</label>
                <input
                  type="text"
                  placeholder="e.g. Stage LED Screen rental"
                  value={newExpenseName}
                  onChange={(e) => setNewExpenseName(e.target.value)}
                  className="w-full p-2 bg-[#18181b] border border-[#27272a] rounded-lg text-white outline-none text-xs"
                />
              </div>
              <div>
                <label className="text-xs text-[#a1a1aa] block uppercase">Category</label>
                <select
                  value={newExpenseCat}
                  onChange={(e) => setNewExpenseCat(e.target.value as any)}
                  className="w-full p-2 bg-[#18181b] border border-[#27272a] rounded-lg text-white outline-none text-xs"
                >
                  <option value="Venue">Venue</option>
                  <option value="Sound/Lights">Sound/Lights</option>
                  <option value="Judges">Judges</option>
                  <option value="Staff">Staff</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Prize Pool">Prize Pool</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-[#a1a1aa] block uppercase">Amount (₹)</label>
                <input
                  type="number"
                  placeholder="25000"
                  value={newExpenseAmt}
                  onChange={(e) => setNewExpenseAmt(e.target.value)}
                  className="w-full p-2 bg-[#18181b] border border-[#27272a] rounded-lg text-white outline-none text-xs"
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddExpenseModal(false)}
                  className="w-1/2 py-1.5 bg-[#202024] text-[#a1a1aa] rounded-lg text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-1.5 bg-[#eab308] text-black font-bold rounded-lg text-xs"
                >
                  Save Expense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

