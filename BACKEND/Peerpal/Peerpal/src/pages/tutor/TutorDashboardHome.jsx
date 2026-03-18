import { Link } from "react-router-dom";

/* ─── mock data ─── */
const STATS = [
    { label: "Sessions Taught", value: "38", icon: "school", color: "bg-teal-50 text-tutor" },
    { label: "Active Students", value: "12", icon: "groups", color: "bg-blue-50 text-blue-600" },
    { label: "Total Earned", value: "R4,560", icon: "payments", color: "bg-emerald-50 text-emerald-600" },
    { label: "Avg Rating", value: "4.9", icon: "star", color: "bg-amber-50 text-amber-600" },
];

const UPCOMING = [
    { id: 1, student: "Lerato M.", initials: "LM", gradient: "from-pink-500 to-rose-600", subject: "Calculus II", date: "Today, 3:00 PM", format: "online" },
    { id: 2, student: "David N.", initials: "DN", gradient: "from-blue-500 to-indigo-600", subject: "Physics I", date: "Tomorrow, 10:00 AM", format: "in-person" },
    { id: 3, student: "Aisha T.", initials: "AT", gradient: "from-violet-500 to-purple-600", subject: "Linear Algebra", date: "Fri, 14 Mar · 2:00 PM", format: "online" },
];

const PENDING_REQUESTS = [
    { id: 1, student: "Thando K.", initials: "TK", gradient: "from-cyan-500 to-blue-600", subject: "Statistics 101", date: "Mon, 17 Mar · 11:00 AM", format: "online" },
    { id: 2, student: "Zara P.", initials: "ZP", gradient: "from-amber-500 to-orange-500", subject: "Chemistry 101", date: "Tue, 18 Mar · 3:00 PM", format: "in-person" },
];

const REVIEWS = [
    { student: "Lerato M.", rating: 5, text: "Thabo explains concepts so clearly — best tutor I've had!", date: "2 days ago" },
    { student: "Sipho N.", rating: 5, text: "Very patient and thorough. Helped me ace my test.", date: "5 days ago" },
    { student: "Amara L.", rating: 4, text: "Good session, covered a lot of ground.", date: "1 week ago" },
];

export default function TutorDashboardHome() {
    return (
        <div className="max-w-6xl mx-auto space-y-6">
            {/* Welcome */}
            <div>
                <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-gray-900">
                    Welcome back, Tutor{" "}
                    <span className="inline-block animate-bounce">👋</span>
                </h1>
                <p className="text-gray-500 mt-1">
                    Here's an overview of your tutoring activity.
                </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {STATS.map((s) => (
                    <div
                        key={s.label}
                        className="bg-white rounded-2xl border border-gray-100 shadow-soft p-5 flex items-start gap-4"
                    >
                        <div
                            className={`w-11 h-11 rounded-xl ${s.color} flex items-center justify-center flex-shrink-0`}
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

            {/* Quick actions */}
            <div className="grid grid-cols-3 gap-3">
                {[
                    { to: "/tutor/dashboard/requests", icon: "inbox", label: "View Requests", count: PENDING_REQUESTS.length },
                    { to: "/tutor/dashboard/availability", icon: "calendar_month", label: "Update Availability" },
                    { to: "/tutor/dashboard/messages", icon: "chat_bubble", label: "Messages" },
                ].map((a) => (
                    <Link
                        key={a.to}
                        to={a.to}
                        className="bg-white rounded-2xl border border-gray-100 shadow-soft p-4 flex items-center gap-3 hover:shadow-lg hover:border-tutor/20 transition group"
                    >
                        <span className="material-icons-round text-xl text-tutor group-hover:scale-110 transition-transform">
                            {a.icon}
                        </span>
                        <span className="text-sm font-semibold text-gray-700 group-hover:text-tutor transition">
                            {a.label}
                        </span>
                        {a.count && (
                            <span className="ml-auto bg-tutor text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                                {a.count}
                            </span>
                        )}
                    </Link>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Upcoming sessions */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-soft p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="font-display font-bold text-gray-900">
                            Upcoming Sessions
                        </h2>
                        <Link
                            to="/tutor/dashboard/sessions"
                            className="text-sm text-tutor font-semibold hover:underline"
                        >
                            View all
                        </Link>
                    </div>
                    <div className="space-y-3">
                        {UPCOMING.map((s) => (
                            <Link
                                key={s.id}
                                to={`/tutor/dashboard/sessions/${s.id}`}
                                className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition"
                            >
                                <div
                                    className={`w-10 h-10 rounded-full bg-gradient-to-br ${s.gradient} flex items-center justify-center text-white text-sm font-bold flex-shrink-0`}
                                >
                                    {s.initials}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-gray-900 truncate">
                                        {s.student}
                                    </p>
                                    <p className="text-xs text-gray-500">{s.subject}</p>
                                </div>
                                <div className="text-right flex-shrink-0">
                                    <p className="text-xs text-gray-500">{s.date}</p>
                                    <span
                                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full mt-0.5 inline-block capitalize ${s.format === "online"
                                                ? "bg-green-50 text-green-600"
                                                : "bg-orange-50 text-orange-600"
                                            }`}
                                    >
                                        {s.format}
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Pending requests */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-soft p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="font-display font-bold text-gray-900">
                            Pending Requests
                        </h2>
                        <Link
                            to="/tutor/dashboard/requests"
                            className="text-sm text-tutor font-semibold hover:underline"
                        >
                            View all
                        </Link>
                    </div>
                    <div className="space-y-3">
                        {PENDING_REQUESTS.map((r) => (
                            <div
                                key={r.id}
                                className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:shadow-sm transition"
                            >
                                <div
                                    className={`w-10 h-10 rounded-full bg-gradient-to-br ${r.gradient} flex items-center justify-center text-white text-sm font-bold flex-shrink-0`}
                                >
                                    {r.initials}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-gray-900 truncate">
                                        {r.student}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {r.subject} · {r.date}
                                    </p>
                                </div>
                                <div className="flex items-center gap-1.5 flex-shrink-0">
                                    <button className="w-8 h-8 rounded-lg bg-tutor text-white flex items-center justify-center hover:bg-teal-700 transition">
                                        <span className="material-icons-round text-base">
                                            check
                                        </span>
                                    </button>
                                    <button className="w-8 h-8 rounded-lg border border-gray-200 text-gray-400 flex items-center justify-center hover:text-red-500 hover:border-red-200 transition">
                                        <span className="material-icons-round text-base">
                                            close
                                        </span>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Recent reviews */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-soft p-6">
                <h2 className="font-display font-bold text-gray-900 mb-4">
                    Recent Reviews
                </h2>
                <div className="space-y-4">
                    {REVIEWS.map((r, i) => (
                        <div
                            key={i}
                            className="flex gap-4 pb-4 border-b border-gray-50 last:border-0 last:pb-0"
                        >
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <p className="text-sm font-semibold text-gray-900">
                                        {r.student}
                                    </p>
                                    <div className="flex items-center gap-0.5">
                                        {Array.from({ length: 5 }).map((_, j) => (
                                            <span
                                                key={j}
                                                className={`material-icons-round text-xs ${j < r.rating
                                                        ? "text-accent"
                                                        : "text-gray-300"
                                                    }`}
                                            >
                                                star
                                            </span>
                                        ))}
                                    </div>
                                    <span className="text-xs text-gray-400">
                                        {r.date}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-600">{r.text}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
