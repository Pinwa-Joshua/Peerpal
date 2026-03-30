import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MatchesAPI } from "../../services/api";

const FILTERS = ["all", "active", "inactive"];

const formatSessionDate = (session) => {
    if (session?.date) {
        const parsed = new Date(session.date);
        if (!Number.isNaN(parsed.getTime())) {
            return parsed.toLocaleDateString([], {
                day: "2-digit",
                month: "short",
                year: "numeric",
            });
        }
        return session.date;
    }

    if (session?.created_at) {
        const parsed = new Date(session.created_at);
        if (!Number.isNaN(parsed.getTime())) {
            return parsed.toLocaleDateString([], {
                day: "2-digit",
                month: "short",
                year: "numeric",
            });
        }
    }

    return "N/A";
};

export default function Students() {
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("all");
    const [sortBy, setSortBy] = useState("sessions");
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        const loadStudents = async () => {
            try {
                const data = await MatchesAPI.getSessions();
                if (!isMounted) return;

                const sessions = Array.isArray(data) ? data : [];
                const grouped = new Map();

                sessions.forEach((session) => {
                    const studentId = session.partner_id;
                    const studentName = session.tuteeName || session.partner_name || "Unknown Student";
                    if (!studentId) return;

                    const existing = grouped.get(studentId);
                    const sessionDate = new Date(session.created_at || session.date || 0);
                    const subject = session.subject || "General Session";
                    const status = session.status === "declined" || session.status === "cancelled" ? "inactive" : "active";

                    if (!existing) {
                        grouped.set(studentId, {
                            id: studentId,
                            name: studentName,
                            avatar: studentName.charAt(0).toUpperCase() || "S",
                            university: session.university || "University not set",
                            year: session.year || "Year not set",
                            subjects: [subject],
                            sessions: 1,
                            lastSession: formatSessionDate(session),
                            lastSessionDate: sessionDate,
                            lastSessionId: session.id,
                            status,
                        });
                        return;
                    }

                    existing.sessions += 1;
                    if (!existing.subjects.includes(subject)) {
                        existing.subjects.push(subject);
                    }
                    if (session.university && existing.university === "University not set") {
                        existing.university = session.university;
                    }
                    if (session.year && existing.year === "Year not set") {
                        existing.year = session.year;
                    }
                    if (status === "active") {
                        existing.status = "active";
                    }
                    if (sessionDate > existing.lastSessionDate) {
                        existing.lastSessionDate = sessionDate;
                        existing.lastSession = formatSessionDate(session);
                        existing.lastSessionId = session.id;
                    }
                });

                setStudents(Array.from(grouped.values()));
            } catch (error) {
                console.error("Failed to load tutor students:", error);
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        loadStudents();

        return () => {
            isMounted = false;
        };
    }, []);

    const filtered = students
        .filter((student) => {
            const term = search.toLowerCase();
            const matchSearch =
                student.name.toLowerCase().includes(term) ||
                student.subjects.some((subject) => subject.toLowerCase().includes(term)) ||
                student.university.toLowerCase().includes(term);
            const matchFilter = filter === "all" || student.status === filter;
            return matchSearch && matchFilter;
        })
        .sort((a, b) => {
            if (sortBy === "sessions") return b.sessions - a.sessions;
            if (sortBy === "name") return a.name.localeCompare(b.name);
            if (sortBy === "lastSession") return b.lastSessionDate - a.lastSessionDate;
            return 0;
        });

    const activeCount = students.filter((student) => student.status === "active").length;
    const totalSessions = students.reduce((sum, student) => sum + student.sessions, 0);

    if (loading) {
        return <div className="p-8 text-center text-gray-500">Loading students...</div>;
    }

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            <div>
                <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-gray-900">
                    Students
                </h1>
                <p className="text-gray-500 mt-1">
                    View and manage your student relationships.
                </p>
            </div>

            <div className="grid grid-cols-3 gap-4">
                <div className="bg-white rounded-2xl border border-gray-100 shadow-soft p-4 text-center">
                    <p className="text-3xl font-display font-extrabold text-tutor">
                        {students.length}
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

            <div className="bg-white rounded-2xl border border-gray-100 shadow-soft p-4">
                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="flex-1 relative">
                        <span className="material-icons-round absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg">
                            search
                        </span>
                        <input
                            type="text"
                            placeholder="Search by name, subject, or university..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border-2 border-gray-200 text-sm focus:border-tutor focus:ring-2 focus:ring-tutor/20 outline-none transition"
                        />
                    </div>

                    <div className="flex gap-2">
                        {FILTERS.map((item) => (
                            <button
                                key={item}
                                onClick={() => setFilter(item)}
                                className={`px-4 py-2 rounded-xl text-xs font-semibold capitalize border-2 transition-all ${
                                    filter === item
                                        ? "border-tutor bg-tutor text-white"
                                        : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                                }`}
                            >
                                {item}
                            </button>
                        ))}
                    </div>

                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="px-3 py-2 rounded-xl border-2 border-gray-200 text-sm font-semibold text-gray-600 focus:border-tutor outline-none"
                    >
                        <option value="sessions">Most Sessions</option>
                        <option value="lastSession">Latest Session</option>
                        <option value="name">Name A-Z</option>
                    </select>
                </div>
            </div>

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
                    {filtered.map((student) => (
                        <div
                            key={student.id}
                            className="bg-white rounded-2xl border border-gray-100 shadow-soft p-5 hover:shadow-md transition"
                        >
                            <div className="flex items-start gap-3 mb-3">
                                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-tutor to-tutor-light flex items-center justify-center text-white font-bold text-sm shrink-0">
                                    {student.avatar}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-semibold text-gray-900 truncate">
                                        {student.name}
                                    </h4>
                                    <p className="text-xs text-gray-400 truncate">
                                        {student.university}
                                    </p>
                                    <p className="text-xs text-gray-400">{student.year}</p>
                                </div>
                                <span
                                    className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${
                                        student.status === "active"
                                            ? "bg-green-50 text-green-600"
                                            : "bg-gray-100 text-gray-500"
                                    }`}
                                >
                                    {student.status}
                                </span>
                            </div>

                            <div className="flex flex-wrap gap-1.5 mb-3">
                                {student.subjects.map((subject) => (
                                    <span
                                        key={subject}
                                        className="bg-teal-50 text-tutor text-xs font-semibold px-2.5 py-1 rounded-full"
                                    >
                                        {subject}
                                    </span>
                                ))}
                            </div>

                            <div className="flex items-center justify-between text-xs text-gray-400 border-t border-gray-100 pt-3">
                                <div className="flex items-center gap-1">
                                    <span className="material-icons-round text-sm">
                                        event
                                    </span>
                                    {student.sessions} sessions
                                </div>
                                <div className="flex items-center gap-1">
                                    <span className="material-icons-round text-sm">
                                        schedule
                                    </span>
                                    {student.lastSession}
                                </div>
                            </div>

                            <div className="flex gap-2 mt-3">
                                <Link
                                    to={`/tutor/dashboard/messages?user=${student.id}&name=${encodeURIComponent(student.name)}`}
                                    className="flex-1 bg-tutor hover:bg-teal-700 text-white text-xs font-semibold py-2 rounded-xl transition flex items-center justify-center gap-1"
                                >
                                    <span className="material-icons-round text-sm">
                                        chat_bubble
                                    </span>
                                    Message
                                </Link>
                                <Link
                                    to={student.lastSessionId ? `/tutor/dashboard/sessions/${student.lastSessionId}` : "/tutor/dashboard/sessions"}
                                    className="flex-1 border-2 border-gray-200 hover:border-gray-300 text-gray-600 text-xs font-semibold py-2 rounded-xl transition flex items-center justify-center gap-1"
                                >
                                    <span className="material-icons-round text-sm">
                                        event_note
                                    </span>
                                    Sessions
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
