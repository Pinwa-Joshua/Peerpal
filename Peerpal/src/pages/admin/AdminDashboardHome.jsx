import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AdminAPI } from "../../services/api";

const STAT_CONFIG = [
    { key: "total_users", label: "Total Users", icon: "people", color: "text-blue-600", bg: "bg-blue-50" },
    { key: "active_tutors", label: "Active Tutors", icon: "school", color: "text-purple-600", bg: "bg-purple-50" },
    { key: "students", label: "Students", icon: "groups", color: "text-emerald-600", bg: "bg-emerald-50" },
    { key: "active_sessions", label: "Active Sessions", icon: "event_note", color: "text-rose-600", bg: "bg-rose-50" },
    { key: "flagged_feedback", label: "Flagged Feedback", icon: "reviews", color: "text-amber-600", bg: "bg-amber-50" },
];

export default function AdminDashboardHome() {
    const [overview, setOverview] = useState({ stats: {}, recent_activity: [] });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        AdminAPI.getOverview()
            .then((data) => setOverview(data || { stats: {}, recent_activity: [] }))
            .catch((error) => console.error("Failed to load admin overview", error))
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return <div className="p-8 text-center text-slate-500">Loading platform overview...</div>;
    }

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Platform Overview</h1>
                    <p className="text-sm text-slate-500 mt-1">Live admin metrics and system activity.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                {STAT_CONFIG.map((stat) => (
                    <div key={stat.key} className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm font-medium text-slate-500 mb-1">{stat.label}</p>
                                <h3 className="text-2xl font-bold text-slate-900">
                                    {overview.stats?.[stat.key] ?? 0}
                                </h3>
                            </div>
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${stat.bg} ${stat.color}`}>
                                <span className="material-icons-round">{stat.icon}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold text-slate-900">Operational Snapshot</h3>
                        <div className="text-sm text-slate-500">
                            Completed sessions: <span className="font-semibold text-slate-900">{overview.stats?.completed_sessions ?? 0}</span>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Link to="/admin/dashboard/users" className="rounded-2xl border border-slate-200 p-5 hover:bg-slate-50 transition">
                            <p className="text-sm font-semibold text-slate-900">Manage Users</p>
                            <p className="mt-1 text-sm text-slate-500">Review tutors, students, and account activity.</p>
                        </Link>
                        <Link to="/admin/dashboard/sessions" className="rounded-2xl border border-slate-200 p-5 hover:bg-slate-50 transition">
                            <p className="text-sm font-semibold text-slate-900">Review Sessions</p>
                            <p className="mt-1 text-sm text-slate-500">Track live session requests and outcomes.</p>
                        </Link>
                        <Link to="/admin/dashboard/feedback" className="rounded-2xl border border-slate-200 p-5 hover:bg-slate-50 transition">
                            <p className="text-sm font-semibold text-slate-900">Feedback Operations</p>
                            <p className="mt-1 text-sm text-slate-500">Inspect low ratings and moderation signals.</p>
                        </Link>
                        <Link to="/admin/dashboard/payouts" className="rounded-2xl border border-slate-200 p-5 hover:bg-slate-50 transition">
                            <p className="text-sm font-semibold text-slate-900">Payout Visibility</p>
                            <p className="mt-1 text-sm text-slate-500">View estimated tutor earnings and platform exposure.</p>
                        </Link>
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
                    <div className="p-5 border-b border-slate-100">
                        <h3 className="text-lg font-bold text-slate-900">Recent Activity</h3>
                    </div>
                    <div className="divide-y divide-slate-100">
                        {overview.recent_activity?.length ? (
                            overview.recent_activity.map((item) => (
                                <div key={item.id} className="p-4">
                                    <div className="flex justify-between items-start gap-3">
                                        <div>
                                            <p className="text-sm font-semibold text-slate-900">{item.action}</p>
                                            <p className="text-xs text-slate-500 mt-1">{item.user}</p>
                                        </div>
                                        <span className="text-[10px] uppercase rounded-full bg-slate-100 text-slate-600 px-2 py-1 font-semibold">
                                            {item.status}
                                        </span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="p-6 text-sm text-slate-500 text-center">No recent activity yet.</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
