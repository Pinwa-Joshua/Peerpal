import { useParams, Link, useNavigate } from "react-router-dom";
import { useState } from "react";

/* ─── extended mock data ─── */
const SESSIONS = [
    {
        id: 1, student: "Lerato Mokoena", initials: "LM", gradient: "from-pink-500 to-rose-600",
        university: "University of Cape Town", year: "2nd Year", subject: "Calculus II",
        topic: "Integration by Parts & Partial Fractions", date: "Today", time: "3:00 PM – 4:00 PM",
        duration: "1 hour", format: "online", status: "confirmed", tab: "upcoming",
        meetingLink: "https://meet.google.com/abc-defg-hij", rate: 120, paid: true,
        notes: "Covering integration by parts, working through past exam questions on partial fractions.",
        studentNote: "I'm struggling with choosing u and dv. Please go slowly through the examples.",
    },
    {
        id: 2, student: "David Ndlovu", initials: "DN", gradient: "from-blue-500 to-indigo-600",
        university: "University of the Witwatersrand", year: "1st Year", subject: "Physics I",
        topic: "Newton's Laws & Free Body Diagrams", date: "Tomorrow", time: "10:00 AM – 11:30 AM",
        duration: "1.5 hours", format: "in-person", status: "confirmed", tab: "upcoming",
        location: "Science Library, Room 204", rate: 100, paid: false,
        notes: "First session – assess current level and build a semester study plan.",
        studentNote: "I need help drawing free body diagrams for pulley systems.",
    },
    {
        id: 3, student: "Aisha Tshikeli", initials: "AT", gradient: "from-violet-500 to-purple-600",
        university: "University of Cape Town", year: "2nd Year", subject: "Linear Algebra",
        topic: "Eigenvalues & Diagonalisation", date: "Fri, 14 Mar", time: "2:00 PM – 3:00 PM",
        duration: "1 hour", format: "online", status: "confirmed", tab: "upcoming",
        meetingLink: "https://meet.google.com/xyz-uvwx-rst", rate: 150, paid: true,
        notes: "Eigenvectors, diagonalisation, and applications.",
        studentNote: "Can we practice with 3x3 matrices?",
    },
    {
        id: 4, student: "Sipho Ndaba", initials: "SN", gradient: "from-cyan-500 to-blue-600",
        university: "University of KwaZulu-Natal", year: "1st Year", subject: "Chemistry 101",
        topic: "Stoichiometry & Molar Calculations", date: "Mon, 3 Mar", time: "11:00 AM – 12:00 PM",
        duration: "1 hour", format: "online", status: "completed", tab: "completed",
        rate: 90, paid: true, studentRating: 5,
        studentReview: "Thabo explained stoichiometry so clearly — best session ever!",
        notes: "Worked through balancing equations and limiting reagent problems.",
    },
    {
        id: 5, student: "Amara Langa", initials: "AL", gradient: "from-emerald-500 to-teal-600",
        university: "University of Cape Town", year: "3rd Year", subject: "Statistics 101",
        topic: "Hypothesis Testing & P-values", date: "Sat, 1 Mar", time: "9:00 AM – 10:30 AM",
        duration: "1.5 hours", format: "in-person", status: "completed", tab: "completed",
        location: "Science Library, Room 101", rate: 130, paid: true, studentRating: 4,
        studentReview: "Good session, covered a lot of ground quickly.",
        notes: "Z-tests, t-tests and interpreting p-values.",
    },
    {
        id: 6, student: "Thando Khumalo", initials: "TK", gradient: "from-yellow-400 to-orange-500",
        university: "University of Cape Town", year: "2nd Year", subject: "Data Structures",
        topic: "Binary Trees & BFS/DFS", date: "Thu, 27 Feb", time: "4:00 PM – 5:00 PM",
        duration: "1 hour", format: "online", status: "completed", tab: "completed",
        rate: 150, paid: true, studentRating: 5,
        studentReview: "Brilliant tutor! Made tree traversal make sense.",
        notes: "Implementing BFS & DFS in Python. Laptop session.",
    },
    {
        id: 7, student: "Nomsa Buthelezi", initials: "NB", gradient: "from-amber-500 to-red-500",
        university: "University of Pretoria", year: "2nd Year", subject: "Linear Algebra",
        topic: "Eigenvalues & Eigenvectors", date: "Tue, 25 Feb", time: "1:00 PM – 2:00 PM",
        duration: "1 hour", format: "in-person", status: "cancelled", tab: "cancelled",
        cancelReason: "Student had a schedule conflict.", rate: 110, paid: false,
        location: "Math Building, Room M23",
        notes: "Was planned to cover diagonalisation fundamentals.",
    },
];

const STATUS_CFG = {
    confirmed: { bg: "bg-green-50", text: "text-green-700", dot: "bg-green-500", label: "Confirmed" },
    completed: { bg: "bg-teal-50", text: "text-tutor", dot: "bg-tutor", label: "Completed" },
    cancelled: { bg: "bg-red-50", text: "text-red-600", dot: "bg-red-500", label: "Cancelled" },
};

export default function TutorSessionDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const session = SESSIONS.find((s) => s.id === Number(id));

    const [tutorNotes, setTutorNotes] = useState(session?.notes || "");
    const [showCancel, setShowCancel] = useState(false);

    if (!session) {
        return (
            <div className="max-w-3xl mx-auto py-20 text-center">
                <span className="material-icons-round text-6xl text-gray-300 mb-4 block">
                    event_busy
                </span>
                <h2 className="text-xl font-display font-bold text-gray-900 mb-2">
                    Session not found
                </h2>
                <p className="text-gray-500 mb-6">
                    This session may have been removed or doesn't exist.
                </p>
                <Link
                    to="/tutor/dashboard/sessions"
                    className="inline-flex items-center gap-2 bg-tutor text-white font-semibold px-6 py-3 rounded-full shadow-lg shadow-tutor/20 hover:bg-teal-700 transition"
                >
                    <span className="material-icons-round text-lg">arrow_back</span>
                    Back to Sessions
                </Link>
            </div>
        );
    }

    const st = STATUS_CFG[session.status];
    const isUpcoming = session.tab === "upcoming";
    const isCompleted = session.tab === "completed";
    const isCancelled = session.tab === "cancelled";

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Back link */}
            <button
                onClick={() => navigate("/tutor/dashboard/sessions")}
                className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-tutor font-semibold transition group"
            >
                <span className="material-icons-round text-lg group-hover:-translate-x-0.5 transition-transform">
                    arrow_back
                </span>
                Back to My Sessions
            </button>

            {/* Header card */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-soft overflow-hidden">
                {/* Status banner */}
                <div className={`${st.bg} px-6 py-3 flex items-center gap-2`}>
                    <span className={`w-2 h-2 rounded-full ${st.dot}`} />
                    <span className={`text-sm font-semibold ${st.text}`}>
                        {st.label}
                    </span>
                    {isCancelled && session.cancelReason && (
                        <span className="text-xs text-gray-500 ml-1">
                            — {session.cancelReason}
                        </span>
                    )}
                </div>

                <div className="p-6 sm:p-8">
                    <div className="flex flex-col sm:flex-row gap-6">
                        {/* Student avatar */}
                        <div
                            className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${session.gradient} flex items-center justify-center text-white text-2xl font-bold flex-shrink-0 shadow-lg`}
                        >
                            {session.initials}
                        </div>

                        <div className="flex-1 min-w-0">
                            <h1 className="text-xl sm:text-2xl font-display font-extrabold text-gray-900">
                                {session.subject}
                            </h1>
                            <p className="text-gray-500 mt-0.5">{session.topic}</p>

                            <div className="flex flex-wrap items-center gap-3 mt-3">
                                <span className="text-sm font-semibold text-gray-900">
                                    {session.student}
                                </span>
                                <span className="text-xs text-gray-400">•</span>
                                <span className="text-sm text-gray-500">
                                    {session.university}
                                </span>
                                <span className="text-xs text-gray-400">•</span>
                                <span className="text-sm text-gray-500">
                                    {session.year}
                                </span>
                            </div>
                        </div>

                        {/* Quick actions */}
                        <div className="flex sm:flex-col gap-2 flex-shrink-0">
                            <Link
                                to="/tutor/dashboard/messages"
                                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-gray-200 text-sm font-semibold text-gray-700 hover:border-tutor hover:text-tutor transition bg-white"
                            >
                                <span className="material-icons-round text-lg">chat</span>
                                Message
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Details grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Date & Time */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-soft p-5 flex items-start gap-4">
                    <div className="w-11 h-11 rounded-xl bg-teal-50 flex items-center justify-center flex-shrink-0">
                        <span className="material-icons-round text-tutor">
                            calendar_today
                        </span>
                    </div>
                    <div>
                        <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide">
                            Date & Time
                        </p>
                        <p className="font-semibold text-gray-900 mt-0.5">
                            {session.date}
                        </p>
                        <p className="text-sm text-gray-500">{session.time}</p>
                    </div>
                </div>

                {/* Duration */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-soft p-5 flex items-start gap-4">
                    <div className="w-11 h-11 rounded-xl bg-purple-50 flex items-center justify-center flex-shrink-0">
                        <span className="material-icons-round text-purple-600">
                            timer
                        </span>
                    </div>
                    <div>
                        <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide">
                            Duration
                        </p>
                        <p className="font-semibold text-gray-900 mt-0.5">
                            {session.duration}
                        </p>
                    </div>
                </div>

                {/* Format & Location */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-soft p-5 flex items-start gap-4">
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${session.format === "online" ? "bg-green-50" : "bg-orange-50"}`}>
                        <span className={`material-icons-round ${session.format === "online" ? "text-green-600" : "text-orange-600"}`}>
                            {session.format === "online" ? "videocam" : "location_on"}
                        </span>
                    </div>
                    <div>
                        <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide">
                            Format
                        </p>
                        <p className="font-semibold text-gray-900 mt-0.5 capitalize">
                            {session.format}
                        </p>
                        {session.meetingLink && (
                            <a
                                href={session.meetingLink}
                                target="_blank"
                                rel="noreferrer"
                                className="text-sm text-tutor hover:underline flex items-center gap-1 mt-0.5"
                            >
                                Meeting link
                                <span className="material-icons-round text-sm">
                                    open_in_new
                                </span>
                            </a>
                        )}
                        {session.location && (
                            <p className="text-sm text-gray-500 mt-0.5">
                                {session.location}
                            </p>
                        )}
                    </div>
                </div>

                {/* Earnings */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-soft p-5 flex items-start gap-4">
                    <div className="w-11 h-11 rounded-xl bg-emerald-50 flex items-center justify-center flex-shrink-0">
                        <span className="material-icons-round text-emerald-600">
                            payments
                        </span>
                    </div>
                    <div>
                        <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide">
                            Earnings
                        </p>
                        <p className="font-semibold text-gray-900 mt-0.5">
                            R{session.rate}
                        </p>
                        <p className={`text-sm font-semibold mt-0.5 ${session.paid ? "text-green-600" : "text-yellow-600"}`}>
                            {session.paid ? "Paid" : "Pending payment"}
                        </p>
                    </div>
                </div>
            </div>

            {/* Student's note */}
            {session.studentNote && (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-soft p-6">
                    <div className="flex items-center gap-2 mb-3">
                        <span className="material-icons-round text-blue-500 text-xl">
                            chat_bubble
                        </span>
                        <h3 className="font-display font-bold text-gray-900">
                            Student's Note
                        </h3>
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed">
                        "{session.studentNote}"
                    </p>
                </div>
            )}

            {/* Tutor session notes (editable for upcoming) */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-soft p-6">
                <div className="flex items-center gap-2 mb-3">
                    <span className="material-icons-round text-tutor text-xl">
                        description
                    </span>
                    <h3 className="font-display font-bold text-gray-900">
                        Your Session Notes
                    </h3>
                </div>
                {isUpcoming ? (
                    <>
                        <textarea
                            rows={3}
                            value={tutorNotes}
                            onChange={(e) => setTutorNotes(e.target.value)}
                            placeholder="Add prep notes for this session…"
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-tutor/30 focus:border-tutor transition resize-none text-sm"
                        />
                        <button className="mt-2 text-sm font-semibold text-tutor hover:underline">
                            Save Notes
                        </button>
                    </>
                ) : (
                    <p className="text-gray-600 text-sm leading-relaxed">
                        {session.notes}
                    </p>
                )}
            </div>

            {/* Student review (completed) */}
            {isCompleted && session.studentRating && (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-soft p-6">
                    <div className="flex items-center gap-2 mb-3">
                        <span className="material-icons-round text-accent text-xl">
                            rate_review
                        </span>
                        <h3 className="font-display font-bold text-gray-900">
                            Student's Review
                        </h3>
                    </div>
                    <div className="flex items-center gap-1 mb-2">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <span
                                key={i}
                                className={`material-icons-round text-lg ${i < session.studentRating
                                        ? "text-accent"
                                        : "text-gray-300"
                                    }`}
                            >
                                star
                            </span>
                        ))}
                        <span className="text-sm text-gray-500 ml-1">
                            {session.studentRating}/5
                        </span>
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed">
                        "{session.studentReview}"
                    </p>
                </div>
            )}

            {/* Action bar */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-soft p-5 flex flex-col sm:flex-row items-center gap-3">
                {isUpcoming && (
                    <>
                        {session.format === "online" && session.meetingLink && (
                            <a
                                href={session.meetingLink}
                                target="_blank"
                                rel="noreferrer"
                                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-tutor hover:bg-teal-700 text-white font-semibold px-8 py-3 rounded-full shadow-lg shadow-tutor/20 transition-all hover:-translate-y-0.5"
                            >
                                <span className="material-icons-round text-lg">
                                    videocam
                                </span>
                                Start Session
                            </a>
                        )}
                        <Link
                            to="/tutor/dashboard/messages"
                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border-2 border-tutor text-tutor font-semibold px-8 py-3 rounded-full hover:bg-teal-50 transition"
                        >
                            <span className="material-icons-round text-lg">
                                chat
                            </span>
                            Message Student
                        </Link>
                        <div className="flex-1" />
                        {!showCancel ? (
                            <button
                                onClick={() => setShowCancel(true)}
                                className="w-full sm:w-auto text-sm text-red-500 hover:text-red-700 font-semibold px-6 py-3 rounded-full hover:bg-red-50 transition"
                            >
                                Cancel Session
                            </button>
                        ) : (
                            <div className="flex items-center gap-2 w-full sm:w-auto">
                                <span className="text-sm text-red-600 font-semibold">
                                    Cancel this session?
                                </span>
                                <button
                                    onClick={() => navigate("/tutor/dashboard/sessions")}
                                    className="bg-red-500 hover:bg-red-600 text-white text-sm font-semibold px-4 py-2 rounded-full transition"
                                >
                                    Yes, cancel
                                </button>
                                <button
                                    onClick={() => setShowCancel(false)}
                                    className="text-sm text-gray-500 hover:text-gray-700 font-semibold px-4 py-2 rounded-full hover:bg-gray-100 transition"
                                >
                                    Keep it
                                </button>
                            </div>
                        )}
                    </>
                )}

                {isCompleted && (
                    <Link
                        to="/tutor/dashboard/messages"
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-tutor hover:bg-teal-700 text-white font-semibold px-8 py-3 rounded-full shadow-lg shadow-tutor/20 transition-all hover:-translate-y-0.5"
                    >
                        <span className="material-icons-round text-lg">
                            chat
                        </span>
                        Message Student
                    </Link>
                )}

                {isCancelled && (
                    <Link
                        to="/tutor/dashboard/requests"
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-tutor hover:bg-teal-700 text-white font-semibold px-8 py-3 rounded-full shadow-lg shadow-tutor/20 transition-all hover:-translate-y-0.5"
                    >
                        <span className="material-icons-round text-lg">
                            inbox
                        </span>
                        View Requests
                    </Link>
                )}
            </div>
        </div>
    );
}
