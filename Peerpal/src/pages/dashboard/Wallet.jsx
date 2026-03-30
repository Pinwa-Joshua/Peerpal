import { useState, useEffect } from "react";
import { FinanceAPI } from "../../services/api";

/* ─── mock data ─── */
const MOCK_BALANCE = { available: 450, totalSpent: 1820 };

const MOCK_TRANSACTIONS = [
    { id: 1, tutor: "Thabo M.", subject: "Calculus II", date: "10 Feb 2026", amount: -120, status: "completed" },
    { id: 2, tutor: "Wallet Top-Up", subject: "", date: "8 Feb 2026", amount: 500, status: "completed" },
    { id: 3, tutor: "Zanele D.", subject: "Linear Algebra", date: "3 Feb 2026", amount: -120, status: "completed" },
    { id: 4, tutor: "James P.", subject: "Data Structures", date: "1 Feb 2026", amount: -130, status: "completed" },
    { id: 5, tutor: "Naledi K.", subject: "Physics I", date: "28 Jan 2026", amount: -80, status: "completed" },
    { id: 6, tutor: "Fatima R.", subject: "Financial Accounting", date: "28 Jan 2026", amount: -110, status: "refunded" },
    { id: 7, tutor: "Wallet Top-Up", subject: "", date: "25 Jan 2026", amount: 1000, status: "completed" },
    { id: 8, tutor: "Sipho N.", subject: "Data Structures", date: "25 Jan 2026", amount: -100, status: "pending" },
];

const MOCK_PAYMENT_METHODS = [
    { id: 1, type: "visa", last4: "4521", expiry: "09/27" },
    { id: 2, type: "mastercard", last4: "8832", expiry: "03/28" },
];

const STATUS_STYLES = {
    completed: "bg-green-50 text-green-600",
    pending: "bg-yellow-50 text-yellow-600",
    refunded: "bg-red-50 text-red-500",
};

export default function Wallet() {
    const [activeFilter, setActiveFilter] = useState("all");
    const [balance, setBalance] = useState({ available: 0, totalSpent: 0 });
    const [transactions, setTransactions] = useState([]);
    const [paymentMethods, setPaymentMethods] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchWallet = async () => {
            try {
                const data = await FinanceAPI.getWallet();
                if (data) {
                    if (data.balance) setBalance(data.balance);
                    if (data.transactions) setTransactions(data.transactions);
                    if (data.paymentMethods) setPaymentMethods(data.paymentMethods);
                }
            } catch (error) {
                console.error("Failed to fetch wallet info", error);
            } finally {
                setLoading(false);
            }
        };
        fetchWallet();
    }, []);

    const handleTopUp = async () => {
        const amountStr = prompt("Enter amount to top up:");
        if (!amountStr) return;
        const amount = Number(amountStr);
        if (isNaN(amount) || amount <= 0) {
            alert("Invalid amount");
            return;
        }

        try {
            await FinanceAPI.topupWallet(amount);
            alert("Top-up successful!");
            setBalance((prev) => ({ ...prev, available: prev.available + amount }));
            setTransactions((prev) => [
                { id: Date.now(), tutor: "Wallet Top-Up", subject: "", date: new Date().toLocaleDateString(), amount: amount, status: "completed" },
                ...prev
            ]);
        } catch (error) {
            console.error("Top-up failed", error);
            alert("Top-up failed");
        }
    };

    const filtered =
        activeFilter === "all"
            ? transactions
            : transactions.filter((t) => t.status === activeFilter);

    if (loading) {
        return <div className="p-8 text-center text-gray-500">Loading wallet details...</div>;
    }

    return (
        <div className="max-w-5xl mx-auto space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-gray-900">
                    Wallet
                </h1>
                <p className="text-gray-500 mt-1">
                    Manage your balance, transactions, and payment methods.
                </p>
            </div>

            {/* Balance cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-primary to-blue-800 rounded-2xl p-6 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-white/5 rounded-full blur-2xl" />
                    <p className="text-blue-200 text-sm font-medium mb-1">
                        Available Balance
                    </p>
                    <p className="text-3xl font-bold">
                        ₦{balance.available.toLocaleString()}
                    </p>
                    <button
                        onClick={handleTopUp}
                        className="mt-4 bg-white text-primary text-sm font-semibold px-5 py-2 rounded-full hover:bg-gray-100 transition shadow-lg">
                        Add Funds
                    </button>
                </div>
                <div className="bg-white rounded-2xl border border-gray-100 shadow-soft p-6">
                    <p className="text-gray-500 text-sm font-medium mb-1">
                        Total Spent
                    </p>
                    <p className="text-3xl font-bold text-gray-900">
                        ₦{balance.totalSpent.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-400 mt-2">This semester</p>
                </div>
            </div>

            {/* Payment methods */}
            <section>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-display font-bold text-gray-900">
                        Payment Methods
                    </h2>
                    <button className="text-sm text-primary font-semibold hover:underline inline-flex items-center gap-1">
                        <span className="material-icons-round text-sm">add</span>
                        Add New
                    </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {paymentMethods.map((pm) => (
                        <div
                            key={pm.id}
                            className="bg-white rounded-xl border border-gray-100 shadow-soft px-5 py-4 flex items-center gap-4"
                        >
                            <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                                <span className="material-icons-round text-gray-500">
                                    credit_card
                                </span>
                            </div>
                            <div className="flex-1">
                                <p className="font-semibold text-gray-900 text-sm capitalize">
                                    {pm.type} •••• {pm.last4}
                                </p>
                                <p className="text-xs text-gray-400">
                                    Expires {pm.expiry}
                                </p>
                            </div>
                            <button className="text-gray-400 hover:text-red-500 transition">
                                <span className="material-icons-round text-lg">
                                    delete_outline
                                </span>
                            </button>
                        </div>
                    ))}
                </div>
            </section>

            {/* Transactions */}
            <section>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-display font-bold text-gray-900">
                        Transaction History
                    </h2>
                    <div className="flex gap-1.5">
                        {["all", "completed", "pending", "refunded"].map((f) => (
                            <button
                                key={f}
                                onClick={() => setActiveFilter(f)}
                                className={`px-3 py-1 rounded-full text-xs font-semibold capitalize transition ${activeFilter === f
                                    ? "bg-primary text-white"
                                    : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                                    }`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="bg-white rounded-2xl border border-gray-100 shadow-soft overflow-hidden">
                    {/* Table header */}
                    <div className="hidden sm:grid grid-cols-5 gap-4 px-5 py-3 bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        <span>Description</span>
                        <span>Subject</span>
                        <span>Date</span>
                        <span>Amount</span>
                        <span>Status</span>
                    </div>
                    <div className="divide-y divide-gray-50">
                        {filtered.map((t) => (
                            <div
                                key={t.id}
                                className="grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-4 px-5 py-3.5 text-sm hover:bg-gray-50 transition"
                            >
                                <span className="font-semibold text-gray-900">
                                    {t.tutor}
                                </span>
                                <span className="text-gray-600">
                                    {t.subject || "—"}
                                </span>
                                <span className="text-gray-500">{t.date}</span>
                                <span
                                    className={`font-bold ${t.amount > 0
                                        ? "text-green-600"
                                        : "text-gray-900"
                                        }`}
                                >
                                    {t.amount > 0 ? "+" : ""}R
                                    {Math.abs(t.amount)}
                                </span>
                                <span
                                    className={`inline-flex w-fit px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${STATUS_STYLES[t.status]
                                        }`}
                                >
                                    {t.status}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
