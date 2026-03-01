import { Link } from "react-router-dom";

/* ─── mock data ─── */
const STATS = [
    { icon: "event_available", label: "Total Sessions", value: "12", color: "bg-blue-50 text-primary" },
    { icon: "menu_book", label: "Subjects", value: "4", color: "bg-green-50 text-green-600" },
    { icon: "schedule", label: "Hours Learned", value: "18.5", color: "bg-purple-50 text-purple-600" },
];

const UPCOMING_SESSIONS = [
    {
        id: 1,
        tutor: "Thabo M.",
        initials: "TM",
        gradient: "from-blue-500 to-indigo-600",
        subject: "Calculus II",
        date: "Today, 3:00 PM",
        format: "online",
    },
    {
        id: 2,
        tutor: "Naledi K.",
        initials: "NK",
        gradient: "from-pink-500 to-rose-600",
        subject: "Physics I",
        date: "Tomorrow, 10:00 AM",
        format: "in-person",
    },
    {
        id: 3,
        tutor: "James P.",
        initials: "JP",
        gradient: "from-emerald-500 to-teal-600",
        subject: "Data Structures",
        date: "Fri, 14 Feb · 2:00 PM",
        format: "online",
    },
];

const RECOMMENDED_TUTORS = [
    {
        id: 1,
        name: "Zanele D.",
        initials: "ZD",
        gradient: "from-yellow-400 to-orange-500",
        university: "University of Cape Town",
        subjects: ["Linear Algebra", "Calculus I"],
        rating: 4.9,
        rate: 120,
    },
    {
        id: 2,
        name: "Sipho N.",
        initials: "SN",
        gradient: "from-cyan-500 to-blue-600",
        university: "University of the Witwatersrand",
        subjects: ["Chemistry 101", "Organic Chemistry"],
        rating: 4.8,
        rate: 100,
    },
    {
        id: 3,
        name: "Amara L.",
        initials: "AL",
        gradient: "from-violet-500 to-purple-600",
        university: "Stellenbosch University",
        subjects: ["Statistics 101", "Economics 101"],
        rating: 4.7,
        rate: 90,
    },
];

export default function DashboardHome() {
    return (
        <div className="max-w-7xl mx-auto space-y-8">
            {/* ── Welcome ── */}
            <div>
                <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-gray-900 flex items-center gap-2">
                    Welcome back
                    <span className="material-icons-round text-accent">waving_hand</span>
                </h1>
                <p className="text-gray-500 mt-1">
                    Here's what's happening with your learning journey.
                </p>
            </div>

            {/* ── Stat cards ── */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {STATS.map((s) => (
                    <div
                        key={s.label}
                        className="bg-white rounded-2xl border border-gray-100 shadow-soft p-5 flex items-center gap-4"
                    >
                        <div
                            className={`w-12 h-12 rounded-xl ${s.color} flex items-center justify-center flex-shrink-0`}
                        >
                            <span className="material-icons-round text-2xl">
                                {s.icon}
                            </span>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-900">
                                {s.value}
                            </p>
                            <p className="text-sm text-gray-500">{s.label}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* ── Quick actions ── */}
            <div className="flex flex-wrap gap-3">
                <Link
                    to="/dashboard/browse"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white text-sm font-semibold rounded-full shadow-lg shadow-primary/20 hover:bg-blue-800 transition-all hover:-translate-y-0.5"
                >
                    <span className="material-icons-round text-lg">search</span>
                    Find a Tutor
                </Link>
                <Link
                    to="/dashboard/sessions"
                    className="inline-flex items-center gap-2 px-5 py-2.5 border-2 border-primary text-primary text-sm font-semibold rounded-full hover:bg-blue-50 transition"
                >
                    <span className="material-icons-round text-lg">
                        calendar_today
                    </span>
                    View Schedule
                </Link>
                <Link
                    to="/dashboard/messages"
                    className="inline-flex items-center gap-2 px-5 py-2.5 border-2 border-gray-200 text-gray-600 text-sm font-semibold rounded-full hover:bg-gray-50 transition"
                >
                    <span className="material-icons-round text-lg">
                        chat_bubble_outline
                    </span>
                    Messages
                </Link>
            </div>

            {/* ── Upcoming Sessions ── */}
            <section>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-display font-bold text-gray-900">
                        Upcoming Sessions
                    </h2>
                    <Link
                        to="/dashboard/sessions"
                        className="text-sm text-primary font-semibold hover:underline inline-flex items-center gap-1"
                    >
                        View all
                        <span className="material-icons-round text-sm">
                            arrow_forward
                        </span>
                    </Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {UPCOMING_SESSIONS.map((session) => (
                        <div
                            key={session.id}
                            className="bg-white rounded-2xl border border-gray-100 shadow-soft p-5 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <div
                                    className={`w-11 h-11 rounded-full bg-gradient-to-br ${session.gradient} flex items-center justify-center text-white text-sm font-bold flex-shrink-0`}
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
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-1.5 text-sm text-gray-500">
                                    <span className="material-icons-round text-base">
                                        schedule
                                    </span>
                                    {session.date}
                                </div>
                                <span
                                    className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${session.format === "online"
                                        ? "bg-green-50 text-green-600"
                                        : "bg-orange-50 text-orange-600"
                                        }`}
                                >
                                    {session.format}
                                </span>
                            </div>
                            <button className="mt-4 w-full bg-primary hover:bg-blue-800 text-white text-sm font-semibold py-2.5 rounded-xl shadow-sm transition">
                                {session.format === "online"
                                    ? "Join Session"
                                    : "View Details"}
                            </button>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── Recommended Tutors ── */}
            <section>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-display font-bold text-gray-900">
                        Recommended Tutors
                    </h2>
                    <Link
                        to="/dashboard/browse"
                        className="text-sm text-primary font-semibold hover:underline inline-flex items-center gap-1"
                    >
                        Browse all
                        <span className="material-icons-round text-sm">
                            arrow_forward
                        </span>
                    </Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {RECOMMENDED_TUTORS.map((tutor) => (
                        <div
                            key={tutor.id}
                            className="bg-white rounded-2xl border border-gray-100 shadow-soft p-5 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 group"
                        >
                            <div className="flex items-center gap-3 mb-3">
                                <div
                                    className={`w-12 h-12 rounded-full bg-gradient-to-br ${tutor.gradient} flex items-center justify-center text-white font-bold flex-shrink-0 shadow-lg`}
                                >
                                    {tutor.initials}
                                </div>
                                <div className="min-w-0">
                                    <p className="font-display font-bold text-gray-900 truncate">
                                        {tutor.name}
                                    </p>
                                    <p className="text-xs text-gray-400 truncate">
                                        {tutor.university}
                                    </p>
                                </div>
                                <div className="ml-auto flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-lg text-yellow-600 text-xs font-bold flex-shrink-0">
                                    <span className="material-icons-round text-sm">
                                        star
                                    </span>
                                    {tutor.rating}
                                </div>
                            </div>
                            <div className="flex flex-wrap gap-1.5 mb-4">
                                {tutor.subjects.map((sub) => (
                                    <span
                                        key={sub}
                                        className="px-2.5 py-0.5 rounded-full bg-blue-50 text-primary text-xs font-semibold border border-blue-100"
                                    >
                                        {sub}
                                    </span>
                                ))}
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-gray-500 font-medium text-sm">
                                    R{tutor.rate}/hr
                                </span>
                                <Link
                                    to="/dashboard/browse"
                                    className="text-sm font-semibold text-primary hover:underline"
                                >
                                    View Profile
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
