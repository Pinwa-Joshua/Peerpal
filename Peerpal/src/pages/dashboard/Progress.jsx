/* ─── mock data ─── */
const SUBJECT_PROGRESS = [
    { subject: "Calculus II", sessions: 5, confidence: 72, trend: "+12%", trendUp: true },
    { subject: "Physics I", sessions: 3, confidence: 58, trend: "+8%", trendUp: true },
    { subject: "Data Structures", sessions: 4, confidence: 85, trend: "+15%", trendUp: true },
    { subject: "Linear Algebra", sessions: 2, confidence: 45, trend: "+5%", trendUp: true },
];

const SESSION_HISTORY = [
    { id: 1, tutor: "Thabo M.", subject: "Calculus II", date: "10 Feb 2026", rating: 5 },
    { id: 2, tutor: "Zanele D.", subject: "Linear Algebra", date: "3 Feb 2026", rating: 5 },
    { id: 3, tutor: "James P.", subject: "Data Structures", date: "1 Feb 2026", rating: 4 },
    { id: 4, tutor: "Naledi K.", subject: "Physics I", date: "28 Jan 2026", rating: 5 },
    { id: 5, tutor: "Sipho N.", subject: "Data Structures", date: "25 Jan 2026", rating: 4 },
    { id: 6, tutor: "Amara L.", subject: "Calculus II", date: "20 Jan 2026", rating: 5 },
];

const STAT_CARDS = [
    { icon: "trending_up", label: "GPA Boost", value: "+0.5", sub: "Average improvement", color: "bg-green-50 text-green-600" },
    { icon: "event_available", label: "Sessions", value: "14", sub: "Completed this semester", color: "bg-blue-50 text-primary" },
    { icon: "schedule", label: "Hours", value: "21", sub: "Total study time", color: "bg-purple-50 text-purple-600" },
    { icon: "star", label: "Avg Rating", value: "4.8", sub: "Your tutor ratings", color: "bg-yellow-50 text-yellow-600" },
];

export default function Progress() {
    return (
        <div className="max-w-7xl mx-auto space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-gray-900">
                    Progress
                </h1>
                <p className="text-gray-500 mt-1">
                    Track your academic improvement and session history.
                </p>
            </div>

            {/* Stat cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {STAT_CARDS.map((s) => (
                    <div
                        key={s.label}
                        className="bg-white rounded-2xl border border-gray-100 shadow-soft p-5"
                    >
                        <div
                            className={`w-11 h-11 rounded-xl ${s.color} flex items-center justify-center mb-3`}
                        >
                            <span className="material-icons-round text-xl">
                                {s.icon}
                            </span>
                        </div>
                        <p className="text-2xl font-bold text-gray-900">
                            {s.value}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">{s.sub}</p>
                    </div>
                ))}
            </div>

            {/* Subject progress */}
            <section>
                <h2 className="text-lg font-display font-bold text-gray-900 mb-4">
                    Subject Confidence
                </h2>
                <div className="bg-white rounded-2xl border border-gray-100 shadow-soft divide-y divide-gray-50">
                    {SUBJECT_PROGRESS.map((sp) => (
                        <div
                            key={sp.subject}
                            className="flex items-center gap-4 px-5 py-4"
                        >
                            <div className="min-w-0 flex-1">
                                <div className="flex items-center justify-between mb-1.5">
                                    <p className="font-semibold text-gray-900 text-sm truncate">
                                        {sp.subject}
                                    </p>
                                    <div className="flex items-center gap-2 flex-shrink-0">
                                        <span
                                            className={`text-xs font-semibold ${sp.trendUp
                                                    ? "text-green-600"
                                                    : "text-red-500"
                                                }`}
                                        >
                                            {sp.trend}
                                        </span>
                                        <span className="text-sm font-bold text-gray-900">
                                            {sp.confidence}%
                                        </span>
                                    </div>
                                </div>
                                {/* Progress bar */}
                                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-500"
                                        style={{ width: `${sp.confidence}%` }}
                                    />
                                </div>
                            </div>
                            <div className="text-xs text-gray-400 flex-shrink-0 w-20 text-right">
                                {sp.sessions} sessions
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Session history */}
            <section>
                <h2 className="text-lg font-display font-bold text-gray-900 mb-4">
                    Recent Sessions
                </h2>
                <div className="bg-white rounded-2xl border border-gray-100 shadow-soft overflow-hidden">
                    <div className="hidden sm:grid grid-cols-4 gap-4 px-5 py-3 bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        <span>Tutor</span>
                        <span>Subject</span>
                        <span>Date</span>
                        <span>Rating</span>
                    </div>
                    <div className="divide-y divide-gray-50">
                        {SESSION_HISTORY.map((s) => (
                            <div
                                key={s.id}
                                className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 px-5 py-3.5 text-sm hover:bg-gray-50 transition"
                            >
                                <span className="font-semibold text-gray-900">
                                    {s.tutor}
                                </span>
                                <span className="text-gray-600">{s.subject}</span>
                                <span className="text-gray-500">{s.date}</span>
                                <div className="flex items-center gap-0.5">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                        <span
                                            key={i}
                                            className={`material-icons-round text-sm ${i < s.rating
                                                    ? "text-accent"
                                                    : "text-gray-300"
                                                }`}
                                        >
                                            star
                                        </span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
