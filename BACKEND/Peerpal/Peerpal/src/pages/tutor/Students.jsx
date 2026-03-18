import { useState } from "react";

/* ─── mock data ─── */
const STUDENTS = [
    {
        id: 1,
        name: "Lerato Mokoena",
        avatar: "L",
        university: "University of the Witwatersrand",
        year: "2nd Year",
        subjects: ["Calculus II", "Linear Algebra"],
        sessions: 8,
        lastSession: "14 Mar 2026",
        rating: 5,
        status: "active",
    },
    {
        id: 2,
        name: "David Nkosi",
        avatar: "D",
        university: "University of Cape Town",
        year: "3rd Year",
        subjects: ["Physics I"],
        sessions: 5,
        lastSession: "13 Mar 2026",
        rating: 4,
        status: "active",
    },
    {
        id: 3,
        name: "AishaТо\u043cас",
        avatar: "A",
        university: "Stellenbosch University",
        year: "1st Year",
        subjects: ["Statistics 101", "Data Structures"],
        sessions: 12,
        lastSession: "10 Mar 2026",
        rating: 5,
        status: "active",
    },
    {
        id: 4,
        name: "Sipho Ndlovu",
        avatar: "S",
        university: "University of Pretoria",
        year: "2nd Year",
        subjects: ["Chemistry 101"],
        sessions: 3,
        lastSession: "3 Mar 2026",
        rating: 4,
        status: "active",
    },
    {
        id: 5,
        name: "Amara Langa",
        avatar: "A",
        university: "Rhodes University",
        year: "1st Year",
        subjects: ["Economics 101"],
        sessions: 2,
        lastSession: "20 Feb 2026",
        rating: 5,
        status: "inactive",
    },
    {
        id: 6,
        name: "Thando Khumalo",
        avatar: "T",
        university: "University of Johannesburg",
        year: "3rd Year",
        subjects: ["Data Structures", "Calculus II"],
        sessions: 6,
        lastSession: "27 Feb 2026",
        rating: 4,
        status: "active",
    },
    {
        id: 7,
        name: "Zara Patel",
        avatar: "Z",
        university: "University of Cape Town",
        year: "2nd Year",
        subjects: ["Chemistry 101", "Physics I"],
        sessions: 1,
        lastSession: "15 Feb 2026",
        rating: 5,
        status: "inactive",
    },
];

const FILTERS = ["all", "active", "inactive"];

export default function Students() {
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("all");
    const [sortBy, setSortBy] = useState("sessions"); // sessions | lastSession | name

    const filtered = STUDENTS.filter((s) => {
        const matchSearch =
            s.name.toLowerCase().includes(search.toLowerCase()) ||
            s.subjects.some((subj) =>
                subj.toLowerCase().includes(search.toLowerCase())
            ) ||
            s.university.toLowerCase().includes(search.toLowerCase());
        const matchFilter = filter === "all" || s.status === filter;
        return matchSearch && matchFilter;
    }).sort((a, b) => {
        if (sortBy === "sessions") return b.sessions - a.sessions;
        if (sortBy === "name") return a.name.localeCompare(b.name);
        return 0;
    });

    const activeCount = STUDENTS.filter((s) => s.status === "active").length;
    const totalSessions = STUDENTS.reduce((sum, s) => sum + s.sessions, 0);

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-gray-900">
                    Students
                </h1>
                <p className="text-gray-500 mt-1">
                    View and manage your student relationships.
                </p>
            </div>

            {/* Stats strip */}
            <div className="grid grid-cols-3 gap-4">
                <div className="bg-white rounded-2xl border border-gray-100 shadow-soft p-4 text-center">
                    <p className="text-3xl font-display font-extrabold text-tutor">
                        {STUDENTS.length}
                    </p>
                    <p className="text-xs text-gray-400 font-semibold uppercase mt-1">
                        Total Students
                    </p>
                </div>
                <div className="bg-white rounded-2xl border border-gray-100 shadow-soft p-4 text-center">
                    <p className="text-3xl font-display font-extrabold text-tutor">
                        {activeCount}
                    </p>
                    <p className="text-xs text-gray-400 font-semibold uppercase mt-1">
                        Active
                    </p>
                </div>
                <div className="bg-white rounded-2xl border border-gray-100 shadow-soft p-4 text-center">
                    <p className="text-3xl font-display font-extrabold text-tutor">
                        {totalSessions}
                    </p>
                    <p className="text-xs text-gray-400 font-semibold uppercase mt-1">
                        Total Sessions
                    </p>
                </div>
            </div>

            {/* Search + Filters bar */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-soft p-4">
                <div className="flex flex-col sm:flex-row gap-3">
                    {/* Search */}
                    <div className="flex-1 relative">
                        <span className="material-icons-round absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg">
                            search
                        </span>
                        <input
                            type="text"
                            placeholder="Search by name, subject, or university…"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border-2 border-gray-200 text-sm focus:border-tutor focus:ring-2 focus:ring-tutor/20 outline-none transition"
                        />
                    </div>

                    {/* Filter pills */}
                    <div className="flex gap-2">
                        {FILTERS.map((f) => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-4 py-2 rounded-xl text-xs font-semibold capitalize border-2 transition-all ${filter === f
                                        ? "border-tutor bg-tutor text-white"
                                        : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                                    }`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>

                    {/* Sort */}
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="px-3 py-2 rounded-xl border-2 border-gray-200 text-sm font-semibold text-gray-600 focus:border-tutor outline-none"
                    >
                        <option value="sessions">Most Sessions</option>
                        <option value="name">Name A–Z</option>
                    </select>
                </div>
            </div>

            {/* Student cards */}
            {filtered.length === 0 ? (
                <div className="text-center py-16">
                    <span className="material-icons-round text-5xl text-gray-300">
                        person_off
                    </span>
                    <p className="text-gray-400 mt-2 font-medium">
                        No students match your search.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filtered.map((s) => (
                        <div
                            key={s.id}
                            className="bg-white rounded-2xl border border-gray-100 shadow-soft p-5 hover:shadow-md transition"
                        >
                            {/* Top row */}
                            <div className="flex items-start gap-3 mb-3">
                                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-tutor to-tutor-light flex items-center justify-center text-white font-bold text-sm shrink-0">
                                    {s.avatar}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-semibold text-gray-900 truncate">
                                        {s.name}
                                    </h4>
                                    <p className="text-xs text-gray-400 truncate">
                                        {s.university}
                                    </p>
                                    <p className="text-xs text-gray-400">{s.year}</p>
                                </div>
                                <span
                                    className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${s.status === "active"
                                            ? "bg-green-50 text-green-600"
                                            : "bg-gray-100 text-gray-500"
                                        }`}
                                >
                                    {s.status}
                                </span>
                            </div>

                            {/* Subjects */}
                            <div className="flex flex-wrap gap-1.5 mb-3">
                                {s.subjects.map((subj) => (
                                    <span
                                        key={subj}
                                        className="bg-teal-50 text-tutor text-xs font-semibold px-2.5 py-1 rounded-full"
                                    >
                                        {subj}
                                    </span>
                                ))}
                            </div>

                            {/* Meta */}
                            <div className="flex items-center justify-between text-xs text-gray-400 border-t border-gray-100 pt-3">
                                <div className="flex items-center gap-1">
                                    <span className="material-icons-round text-sm">
                                        event
                                    </span>
                                    {s.sessions} sessions
                                </div>
                                <div className="flex items-center gap-1">
                                    <span className="material-icons-round text-sm">
                                        schedule
                                    </span>
                                    {s.lastSession}
                                </div>
                                <div className="flex items-center gap-0.5 text-yellow-500">
                                    <span className="material-icons-round text-sm">
                                        star
                                    </span>
                                    {s.rating}
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-2 mt-3">
                                <button className="flex-1 bg-tutor hover:bg-teal-700 text-white text-xs font-semibold py-2 rounded-xl transition flex items-center justify-center gap-1">
                                    <span className="material-icons-round text-sm">
                                        chat_bubble
                                    </span>
                                    Message
                                </button>
                                <button className="flex-1 border-2 border-gray-200 hover:border-gray-300 text-gray-600 text-xs font-semibold py-2 rounded-xl transition flex items-center justify-center gap-1">
                                    <span className="material-icons-round text-sm">
                                        event_note
                                    </span>
                                    Sessions
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
