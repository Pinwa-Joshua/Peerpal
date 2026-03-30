import { useEffect, useState } from "react";
import { AdminAPI } from "../../services/api";

export default function AdminPayouts() {
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        AdminAPI.getPayouts()
            .then((data) => setRows(Array.isArray(data) ? data : []))
            .catch((error) => console.error("Failed to load admin payouts", error))
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-900">Financials & Payouts</h1>
                <p className="text-sm text-slate-500 mt-1">Read-only view of estimated tutor earnings based on completed sessions.</p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                {loading ? (
                    <div className="p-8 text-center text-slate-500">Loading payout visibility...</div>
                ) : rows.length === 0 ? (
                    <div className="p-8 text-center text-slate-500">No tutor payout data available yet.</div>
                ) : (
                    <>
                        <div className="hidden lg:grid grid-cols-5 gap-4 px-6 py-4 bg-slate-50 text-xs font-semibold uppercase tracking-wider text-slate-500">
                            <span>Tutor</span>
                            <span>Email</span>
                            <span>Completed Sessions</span>
                            <span>Subjects</span>
                            <span>Estimated Earnings</span>
                        </div>
                        <div className="divide-y divide-slate-100">
                            {rows.map((row) => (
                                <div key={row.id} className="grid grid-cols-1 lg:grid-cols-5 gap-3 px-6 py-4 text-sm">
                                    <div className="font-semibold text-slate-900">{row.tutor}</div>
                                    <div className="text-slate-700">{row.email}</div>
                                    <div className="text-slate-700">{row.sessions_completed}</div>
                                    <div className="text-slate-700">{row.subjects?.join(", ") || "N/A"}</div>
                                    <div className="font-semibold text-slate-900">₦{Number(row.estimated_earnings || 0).toLocaleString()}</div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
