import { useState } from "react";

/* ─── mock data ─── */
const BALANCE = { available: 2340, pending: 480, thisMonth: 1560, total: 12420 };

const PAYOUT_METHODS = [
    { id: 1, type: "bank", bank: "FNB", last4: "4521", primary: true },
];

const TRANSACTIONS = [
    { id: 1, student: "Lerato M.", subject: "Calculus II", date: "14 Mar 2026", amount: 120, status: "completed" },
    { id: 2, student: "David N.", subject: "Physics I", date: "13 Mar 2026", amount: 150, status: "completed" },
    { id: 3, student: "Aisha T.", subject: "Linear Algebra", date: "10 Mar 2026", amount: 150, status: "pending" },
    { id: 4, student: "Sipho N.", subject: "Chemistry 101", date: "3 Mar 2026", amount: 90, status: "completed" },
    { id: 5, student: "Amara L.", subject: "Statistics 101", date: "1 Mar 2026", amount: 195, status: "completed" },
    { id: 6, student: "Thando K.", subject: "Data Structures", date: "27 Feb 2026", amount: 150, status: "completed" },
    { id: 7, student: "Withdrawal to FNB ••4521", subject: "", date: "25 Feb 2026", amount: -2000, status: "withdrawn" },
    { id: 8, student: "Zara P.", subject: "Economics 101", date: "20 Feb 2026", amount: 100, status: "completed" },
];

const SUBJECT_EARNINGS = [
    { subject: "Calculus II", earned: 2880, sessions: 24 },
    { subject: "Data Structures", earned: 3600, sessions: 24 },
    { subject: "Statistics 101", earned: 2340, sessions: 18 },
    { subject: "Physics I", earned: 1800, sessions: 18 },
    { subject: "Chemistry 101", earned: 1800, sessions: 20 },
];

const FILTERS = ["all", "completed", "pending", "withdrawn"];

const STATUS_COLORS = {
    completed: "bg-green-50 text-green-600",
    pending: "bg-yellow-50 text-yellow-600",
    withdrawn: "bg-gray-100 text-gray-500",
};

export default function Earnings() {
    const [filter, setFilter] = useState("all");

    const filtered = TRANSACTIONS.filter(
        (t) => filter === "all" || t.status === filter
    );

    const maxEarned = Math.max(...SUBJECT_EARNINGS.map((s) => s.earned));

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-gray-900">
                    Earnings
                </h1>
                <p className="text-gray-500 mt-1">
                    Track your income and manage payouts.
                </p>
            </div>

            {/* Balance cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-tutor to-tutor-light rounded-2xl p-5 text-white col-span-2 sm:col-span-1">
                    <p className="text-sm font-medium text-teal-100">Available</p>
                    <p className="text-3xl font-display font-extrabold mt-1">
                        R{BALANCE.available.toLocaleString()}
                    </p>
                    <button className="mt-3 bg-white/20 hover:bg-white/30 text-white text-sm font-semibold px-4 py-2 rounded-full transition">
                        Withdraw
                    </button>
                </div>
                <div className="bg-white rounded-2xl border border-gray-100 shadow-soft p-5">
                    <p className="text-xs text-gray-400 font-semibold uppercase">Pending</p>
                    <p className="text-2xl font-display font-extrabold text-gray-900 mt-1">
                        R{BALANCE.pending.toLocaleString()}
                    </p>
                </div>
                <div className="bg-white rounded-2xl border border-gray-100 shadow-soft p-5">
                    <p className="text-xs text-gray-400 font-semibold uppercase">This Month</p>
                    <p className="text-2xl font-display font-extrabold text-gray-900 mt-1">
                        R{BALANCE.thisMonth.toLocaleString()}
                    </p>
                </div>
                <div className="bg-white rounded-2xl border border-gray-100 shadow-soft p-5">
                    <p className="text-xs text-gray-400 font-semibold uppercase">Total Earned</p>
                    <p className="text-2xl font-display font-extrabold text-gray-900 mt-1">
                        R{BALANCE.total.toLocaleString()}
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Earnings by subject */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-soft p-6 lg:col-span-1">
                    <h3 className="font-display font-bold text-gray-900 mb-4">
                        By Subject
                    </h3>
                    <div className="space-y-4">
                        {SUBJECT_EARNINGS.map((s) => (
                            <div key={s.subject}>
                                <div className="flex items-center justify-between mb-1">
                                    <p className="text-sm font-semibold text-gray-700">
                                        {s.subject}
                                    </p>
                                    <p className="text-sm font-bold text-gray-900">
                                        R{s.earned.toLocaleString()}
                                    </p>
                                </div>
                                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                    <div
                                        className="h-full rounded-full bg-gradient-to-r from-tutor to-tutor-light transition-all duration-500"
                                        style={{ width: `${(s.earned / maxEarned) * 100}%` }}
                                    />
                                </div>
                                <p className="text-xs text-gray-400 mt-0.5">
                                    {s.sessions} sessions
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Transaction history + payout methods */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Payout methods */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-soft p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-display font-bold text-gray-900">
                                Payout Methods
                            </h3>
                            <button className="text-sm text-tutor font-semibold hover:underline">
                                + Add Account
                            </button>
                        </div>
                        <div className="space-y-3">
                            {PAYOUT_METHODS.map((pm) => (
                                <div
                                    key={pm.id}
                                    className="flex items-center gap-3 p-3 rounded-xl border border-gray-100"
                                >
                                    <div className="w-10 h-10 rounded-lg bg-teal-50 flex items-center justify-center">
                                        <span className="material-icons-round text-tutor">
                                            account_balance
                                        </span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-gray-900">
                                            {pm.bank} ••{pm.last4}
                                        </p>
                                        {pm.primary && (
                                            <span className="text-xs text-tutor font-medium">
                                                Primary
                                            </span>
                                        )}
                                    </div>
                                    <button className="text-gray-400 hover:text-red-500 transition">
                                        <span className="material-icons-round text-lg">
                                            delete
                                        </span>
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Transaction history */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-soft p-6">
                        <h3 className="font-display font-bold text-gray-900 mb-4">
                            Transaction History
                        </h3>

                        {/* Filters */}
                        <div className="flex gap-2 mb-4 overflow-x-auto scrollbar-hide">
                            {FILTERS.map((f) => (
                                <button
                                    key={f}
                                    onClick={() => setFilter(f)}
                                    className={`px-4 py-1.5 rounded-full text-xs font-semibold capitalize border-2 transition-all whitespace-nowrap ${filter === f
                                            ? "border-tutor bg-tutor text-white"
                                            : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                                        }`}
                                >
                                    {f}
                                </button>
                            ))}
                        </div>

                        {/* Table */}
                        <div className="overflow-x-auto scrollbar-hide">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="text-left text-xs text-gray-400 uppercase border-b border-gray-100">
                                        <th className="pb-2 font-semibold">Description</th>
                                        <th className="pb-2 font-semibold">Date</th>
                                        <th className="pb-2 font-semibold text-right">Amount</th>
                                        <th className="pb-2 font-semibold text-right">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filtered.map((t) => (
                                        <tr
                                            key={t.id}
                                            className="border-b border-gray-50 last:border-0"
                                        >
                                            <td className="py-3">
                                                <p className="font-semibold text-gray-900">
                                                    {t.student}
                                                </p>
                                                {t.subject && (
                                                    <p className="text-xs text-gray-400">
                                                        {t.subject}
                                                    </p>
                                                )}
                                            </td>
                                            <td className="py-3 text-gray-500">
                                                {t.date}
                                            </td>
                                            <td
                                                className={`py-3 text-right font-semibold ${t.amount >= 0
                                                        ? "text-green-600"
                                                        : "text-gray-500"
                                                    }`}
                                            >
                                                {t.amount >= 0 ? "+" : ""}R
                                                {Math.abs(t.amount).toLocaleString()}
                                            </td>
                                            <td className="py-3 text-right">
                                                <span
                                                    className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${STATUS_COLORS[t.status]
                                                        }`}
                                                >
                                                    {t.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
