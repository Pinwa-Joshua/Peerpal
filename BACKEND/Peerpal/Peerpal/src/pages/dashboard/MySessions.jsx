import { useState } from "react";
import { Link } from "react-router-dom";

/* ─── mock sessions ─── */
const SESSIONS = [
    { id: 1, tutor: "Thabo M.", initials: "TM", gradient: "from-blue-500 to-indigo-600", subject: "Calculus II", date: "Today, 3:00 PM", format: "online", status: "confirmed", tab: "upcoming" },
    { id: 2, tutor: "Naledi K.", initials: "NK", gradient: "from-pink-500 to-rose-600", subject: "Physics I", date: "Tomorrow, 10:00 AM", format: "in-person", status: "pending", tab: "upcoming" },
    { id: 3, tutor: "James P.", initials: "JP", gradient: "from-emerald-500 to-teal-600", subject: "Data Structures", date: "Fri, 14 Feb · 2:00 PM", format: "online", status: "confirmed", tab: "upcoming" },
    { id: 4, tutor: "Zanele D.", initials: "ZD", gradient: "from-yellow-400 to-orange-500", subject: "Linear Algebra", date: "Mon, 3 Feb · 11:00 AM", format: "online", status: "completed", tab: "completed", rating: 5 },
    { id: 5, tutor: "Sipho N.", initials: "SN", gradient: "from-cyan-500 to-blue-600", subject: "Chemistry 101", date: "Sat, 1 Feb · 9:00 AM", format: "in-person", status: "completed", tab: "completed", rating: 4 },
    { id: 6, tutor: "Amara L.", initials: "AL", gradient: "from-violet-500 to-purple-600", subject: "Statistics 101", date: "Thu, 30 Jan · 4:00 PM", format: "online", status: "completed", tab: "completed", rating: 5 },
    { id: 7, tutor: "Fatima R.", initials: "FR", gradient: "from-amber-500 to-red-500", subject: "Financial Accounting", date: "Tue, 28 Jan · 1:00 PM", format: "in-person", status: "cancelled", tab: "cancelled" },
];

const TABS = ["upcoming", "completed", "cancelled"];

const STATUS_STYLES = {
    confirmed: "bg-green-50 text-green-600",
    pending: "bg-yellow-50 text-yellow-600",
    completed: "bg-blue-50 text-primary",
    cancelled: "bg-gray-100 text-gray-500",
};

export default function MySessions() {
    const [activeTab, setActiveTab] = useState("upcoming");
    const filtered = SESSIONS.filter((s) => s.tab === activeTab);

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-gray-900">
                    My Sessions
                </h1>
                <p className="text-gray-500 mt-1">
                    Manage your upcoming and past tutoring sessions.
                </p>
            </div>

            {/* Tabs */}
            <div className="flex gap-2">
                {TABS.map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-5 py-2 rounded-full text-sm font-semibold capitalize border-2 transition-all ${activeTab === tab
                            ? "border-primary bg-primary text-white"
                            : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                            }`}
                    >
                        {tab}
                        <span className="ml-1.5 text-xs opacity-70">
                            ({SESSIONS.filter((s) => s.tab === tab).length})
                        </span>
                    </button>
                ))}
            </div>

            {/* Session list */}
            {filtered.length > 0 ? (
                <div className="space-y-3">
                    {filtered.map((session) => (
                        <div
                            key={session.id}
                            className="bg-white rounded-2xl border border-gray-100 shadow-soft p-5 flex flex-col sm:flex-row sm:items-center gap-4 hover:shadow-lg transition"
                        >
                            {/* Tutor info */}
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                                <div
                                    className={`w-12 h-12 rounded-full bg-gradient-to-br ${session.gradient} flex items-center justify-center text-white font-bold flex-shrink-0`}
                                >
                                    {session.initials}
                                </div>
                                <div className="min-w-0">
                                    <p className="font-semibold text-gray-900 truncate">
                                        {session.tutor}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        {session.subject}
                                    </p>
                                </div>
                            </div>

                            {/* Date & time */}
                            <div className="flex items-center gap-1.5 text-sm text-gray-500 flex-shrink-0">
                                <span className="material-icons-round text-base">
                                    schedule
                                </span>
                                {session.date}
                            </div>

                            {/* Format */}
                            <span
                                className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize flex-shrink-0 ${session.format === "online"
                                    ? "bg-green-50 text-green-600"
                                    : "bg-orange-50 text-orange-600"
                                    }`}
                            >
                                {session.format}
                            </span>

                            {/* Status */}
                            <span
                                className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize flex-shrink-0 ${STATUS_STYLES[session.status]
                                    }`}
                            >
                                {session.status}
                            </span>

                            {/* Rating (completed only) */}
                            {session.rating && (
                                <div className="flex items-center gap-0.5 flex-shrink-0">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                        <span
                                            key={i}
                                            className={`material-icons-round text-sm ${i < session.rating
                                                ? "text-accent"
                                                : "text-gray-300"
                                                }`}
                                        >
                                            star
                                        </span>
                                    ))}
                                </div>
                            )}

                            {/* Action */}
                            <div className="flex-shrink-0">
                                {session.tab === "upcoming" && (
                                    <Link
                                        to={`/dashboard/sessions/${session.id}`}
                                        className="bg-primary hover:bg-blue-800 text-white text-sm font-semibold px-5 py-2 rounded-xl shadow-sm transition inline-block"
                                    >
                                        {session.format === "online"
                                            ? "Join"
                                            : "Details"}
                                    </Link>
                                )}
                                {session.tab === "completed" && !session.rating && (
                                    <Link
                                        to={`/dashboard/sessions/${session.id}`}
                                        className="border-2 border-primary text-primary text-sm font-semibold px-5 py-2 rounded-xl hover:bg-blue-50 transition inline-block"
                                    >
                                        Review
                                    </Link>
                                )}
                                {session.tab === "completed" && session.rating && (
                                    <Link
                                        to={`/dashboard/sessions/${session.id}`}
                                        className="text-sm text-primary font-semibold hover:underline"
                                    >
                                        View Details
                                    </Link>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-soft p-12 text-center">
                    <span className="material-icons-round text-5xl text-gray-300 mb-3 block">
                        {activeTab === "upcoming"
                            ? "event_busy"
                            : activeTab === "completed"
                                ? "task_alt"
                                : "cancel"}
                    </span>
                    <p className="text-gray-500 font-semibold mb-1">
                        No {activeTab} sessions
                    </p>
                    <p className="text-gray-400 text-sm">
                        {activeTab === "upcoming"
                            ? "Book a session with a tutor to get started."
                            : `Your ${activeTab} sessions will appear here.`}
                    </p>
                    {activeTab === "upcoming" && (
                        <Link
                            to="/dashboard/browse"
                            className="inline-flex items-center gap-2 mt-4 px-6 py-2.5 bg-primary text-white text-sm font-semibold rounded-full shadow-lg shadow-primary/20 hover:bg-blue-800 transition"
                        >
                            <span className="material-icons-round text-lg">
                                search
                            </span>
                            Find a Tutor
                        </Link>
                    )}
                </div>
            )}
        </div>
    );
}
