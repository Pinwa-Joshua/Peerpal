import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { MatchesAPI } from "../../services/api";

const NAIRA_SYMBOL = "\u20A6";
const WAVING_HAND = "\u{1F44B}";

const REVIEWS = [
    { student: "Lerato M.", rating: 5, text: "Explains concepts so clearly - best tutor I've had!", date: "2 days ago" },
    { student: "Sipho N.", rating: 5, text: "Very patient and thorough. Helped me ace my test.", date: "5 days ago" },
    { student: "Amara L.", rating: 4, text: "Good session, covered a lot of ground.", date: "1 week ago" },
];

export default function TutorDashboardHome() {
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const response = await MatchesAPI.getSessions();
                setSessions(Array.isArray(response) ? response : []);
            } catch (err) {
                console.error("Dashboard data load error:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    const upcomingSessions = sessions.filter((s) => s.status === "upcoming").slice(0, 3);
    const pendingSessions = sessions.filter((s) => s.status === "pending").slice(0, 3);
    const completedSessions = sessions.filter((s) => s.status === "completed");

    const totalSessions = completedSessions.length;
    const activeStudents = new Set(upcomingSessions.map((s) => s.tutee_id)).size || 0;

    const STATS = [
        { label: "Sessions Taught", value: totalSessions.toString(), icon: "school", color: "bg-teal-50 text-tutor" },
        { label: "Active Students", value: activeStudents.toString(), icon: "groups", color: "bg-blue-50 text-blue-600" },
        { label: "Total Earned", value: `${NAIRA_SYMBOL}${(totalSessions * 500).toLocaleString()}`, icon: "payments", color: "bg-emerald-50 text-emerald-600" },
        { label: "Avg Rating", value: "4.9", icon: "star", color: "bg-amber-50 text-amber-600" },
    ];

    if (loading) {
        return <div className="max-w-6xl mx-auto py-20 text-center text-gray-500">Loading Dashboard...</div>;
    }

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            <div>
                <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-gray-900">
                    Welcome back, Tutor{" "}
                    <span className="inline-block animate-bounce" aria-label="waving hand">{WAVING_HAND}</span>
                </h1>
                <p className="text-gray-500 mt-1">
                    Here's an overview of your tutoring activity.
                </p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {STATS.map((s) => (
                    <div
                        key={s.label}
                        className="bg-white rounded-2xl border border-gray-100 shadow-soft p-5 flex items-start gap-4"
                    >
                        <div
                            className={`${s.color} w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0`}
                        >
                            <span className="material-icons-round text-xl">
                                {s.icon}
                            </span>
                        </div>
                        <div>
                            <p className="text-2xl font-display font-extrabold text-gray-900">
                                {s.value}
                            </p>
                            <p className="text-xs text-gray-400 font-medium">
                                {s.label}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-3 gap-3">
                {[
                    { label: "Manage Availability", icon: "event_available", path: "/tutor/dashboard/availability" },
                    { label: "View Payouts", icon: "account_balance_wallet", path: "/tutor/dashboard/earnings" },
                    { label: "Edit Profile", icon: "manage_accounts", path: "/tutor/dashboard/settings" },
                ].map((action) => (
                    <Link
                        key={action.label}
                        to={action.path}
                        className="flex flex-col items-center justify-center gap-2 bg-white rounded-2xl border border-gray-100 shadow-soft p-4 hover:border-teal-200 transition group"
                    >
                        <span className="material-icons-round text-gray-400 group-hover:text-tutor transition-colors">
                            {action.icon}
                        </span>
                        <span className="text-xs font-semibold text-gray-600 group-hover:text-gray-900">
                            {action.label}
                        </span>
                    </Link>
                ))}
            </div>

            <div className="grid lg:grid-cols-3 gap-6 items-start">
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-3xl border border-gray-100 shadow-soft p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-display font-bold text-gray-900">
                                Upcoming Sessions
                            </h2>
                            <Link
                                to="/tutor/dashboard/sessions"
                                className="text-sm font-semibold text-tutor hover:text-teal-800 transition"
                            >
                                View Calendar &rarr;
                            </Link>
                        </div>
                        <div className="space-y-4">
                            {upcomingSessions.length > 0 ? (
                                upcomingSessions.map((session) => (
                                    <div
                                        key={session.id}
                                        className="flex items-center gap-4 p-4 rounded-2xl border border-gray-100 hover:border-teal-100 hover:bg-teal-50/30 transition group"
                                    >
                                        <div
                                            className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-400 to-tutor flex flex-col items-center justify-center text-white flex-shrink-0 shadow-inner"
                                        >
                                            <span className="text-xs font-bold uppercase">
                                                {new Date(session.date).toLocaleString("en-US", { month: "short" })}
                                            </span>
                                            <span className="text-lg font-black leading-none">
                                                {new Date(session.date).getDate()}
                                            </span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-bold text-gray-900 truncate">
                                                {session.subject}
                                            </h3>
                                            <p className="text-sm text-gray-500 truncate flex items-center gap-1.5">
                                                Student: {session.tuteeName || session.tutee_name || session.partner_name || "Unknown Student"}
                                                <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                                                {session.session_type || session.format || "Online"}
                                            </p>
                                        </div>
                                        <Link
                                            to={`/dashboard/sessions/${session.id}`}
                                            className="w-10 h-10 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center group-hover:bg-tutor group-hover:text-white transition"
                                        >
                                            <span className="material-icons-round text-xl">
                                                videocam
                                            </span>
                                        </Link>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-500 text-center py-6 text-sm">
                                    No upcoming sessions. Make sure your availability is set!
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="bg-white rounded-3xl border border-gray-100 shadow-soft p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-display font-bold text-gray-900">
                                Pending Requests
                            </h2>
                            <Link
                                to="/tutor/dashboard/requests"
                                className="text-sm font-semibold text-tutor hover:text-teal-800 transition"
                            >
                                View All &rarr;
                            </Link>
                        </div>
                        <div className="space-y-4">
                            {pendingSessions.length > 0 ? (
                                pendingSessions.map((req) => (
                                    <div
                                        key={req.id}
                                        className="p-4 rounded-2xl border border-gray-100 bg-gray-50/50"
                                    >
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-400 to-tutor text-white font-bold flex items-center justify-center shadow-inner text-xs"
                                                >
                                                    T
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-gray-900 text-sm">
                                                        {req.tuteeName || req.tutee_name || req.partner_name || "Unknown Student"}
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        {req.subject}
                                                    </p>
                                                </div>
                                            </div>
                                            <span className="text-xs font-medium text-gray-400">
                                                {new Date(req.date).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <div className="flex gap-2">
                                            <button className="flex-1 py-2 text-sm font-semibold bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition">
                                                Decline
                                            </button>
                                            <button className="flex-1 py-2 text-sm font-semibold bg-tutor text-white rounded-xl hover:bg-teal-700 transition shadow-sm">
                                                Accept
                                            </button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-500 text-center py-6 text-sm">
                                    No pending requests at the moment.
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-3xl border border-gray-100 shadow-soft p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-display font-bold text-gray-900">
                            Recent Feedback
                        </h2>
                    </div>
                    <div className="space-y-5">
                        {REVIEWS.map((rev, i) => (
                            <div key={i} className="border-b border-gray-100 last:border-0 pb-5 last:pb-0">
                                <div className="flex items-center justify-between mb-2">
                                    <p className="font-semibold text-gray-900 text-sm">
                                        {rev.student}
                                    </p>
                                    <div className="flex items-center text-amber-400">
                                        <span className="material-icons-round text-sm">star</span>
                                        <span className="text-xs font-bold text-gray-700 ml-1">{rev.rating}.0</span>
                                    </div>
                                </div>
                                <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed">
                                    "{rev.text}"
                                </p>
                                <p className="text-xs text-gray-400 mt-2 font-medium">
                                    {rev.date}
                                </p>
                            </div>
                        ))}
                    </div>
                    <Link
                        to="/tutor/dashboard/reviews"
                        className="mt-6 block w-full py-3 text-center text-sm font-semibold border-2 border-gray-100 rounded-xl text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition"
                    >
                        Read All Reviews
                    </Link>
                </div>
            </div>
        </div>
    );
}
