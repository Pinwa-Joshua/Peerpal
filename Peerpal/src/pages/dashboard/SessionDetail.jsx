import { useParams, Link, useNavigate } from "react-router-dom";
import { useState } from "react";

/* ─── extended mock data (mirrors MySessions + extra detail) ─── */
const SESSIONS = [
    {
        id: 1,
        tutor: "Thabo Mokoena",
        initials: "TM",
        gradient: "from-blue-500 to-indigo-600",
        subject: "Calculus II",
        topic: "Integration by Parts & Partial Fractions",
        date: "Today",
        time: "3:00 PM – 4:00 PM",
        duration: "1 hour",
        format: "online",
        status: "confirmed",
        tab: "upcoming",
        meetingLink: "https://meet.google.com/abc-defg-hij",
        university: "University of Cape Town",
        rating: 4.9,
        totalReviews: 47,
        rate: 120,
        paid: true,
        notes: "We'll cover integration by parts and work through past exam questions on partial fractions. Please bring your tutorial sheet.",
        tutorBio: "Honours student in Applied Mathematics with 3 years of tutoring experience.",
    },
    {
        id: 2,
        tutor: "Naledi Khumalo",
        initials: "NK",
        gradient: "from-pink-500 to-rose-600",
        subject: "Physics I",
        topic: "Newton's Laws & Free Body Diagrams",
        date: "Tomorrow",
        time: "10:00 AM – 11:30 AM",
        duration: "1.5 hours",
        format: "in-person",
        status: "pending",
        tab: "upcoming",
        location: "Science Library, Room 204",
        university: "University of the Witwatersrand",
        rating: 4.7,
        totalReviews: 31,
        rate: 100,
        paid: false,
        notes: "Intro session — we'll assess your current level and build a study plan for the semester.",
        tutorBio: "3rd year BSc Physics student. Passionate about making mechanics intuitive.",
    },
    {
        id: 3,
        tutor: "James Peterson",
        initials: "JP",
        gradient: "from-emerald-500 to-teal-600",
        subject: "Data Structures",
        topic: "Binary Trees & Graph Traversal",
        date: "Fri, 14 Feb",
        time: "2:00 PM – 3:00 PM",
        duration: "1 hour",
        format: "online",
        status: "confirmed",
        tab: "upcoming",
        meetingLink: "https://meet.google.com/xyz-uvwx-rst",
        university: "Stellenbosch University",
        rating: 4.8,
        totalReviews: 56,
        rate: 150,
        paid: true,
        notes: "Implementing BFS & DFS in Python. Bring your laptop with Python 3 installed.",
        tutorBio: "MSc Computer Science candidate specialising in algorithms and competitive programming.",
    },
    {
        id: 4,
        tutor: "Zanele Dlamini",
        initials: "ZD",
        gradient: "from-yellow-400 to-orange-500",
        subject: "Linear Algebra",
        topic: "Eigenvalues & Eigenvectors",
        date: "Mon, 3 Feb",
        time: "11:00 AM – 12:00 PM",
        duration: "1 hour",
        format: "online",
        status: "completed",
        tab: "completed",
        rating: 5,
        studentRating: 5,
        studentReview: "Zanele explained eigenvalues so clearly — best session I've had!",
        university: "University of Pretoria",
        totalReviews: 39,
        rate: 110,
        paid: true,
        notes: "Covered diagonalisation and practice problems.",
        tutorBio: "4th year Mathematics student with a knack for clear explanations.",
    },
    {
        id: 5,
        tutor: "Sipho Ndaba",
        initials: "SN",
        gradient: "from-cyan-500 to-blue-600",
        subject: "Chemistry 101",
        topic: "Stoichiometry & Molar Calculations",
        date: "Sat, 1 Feb",
        time: "9:00 AM – 10:30 AM",
        duration: "1.5 hours",
        format: "in-person",
        status: "completed",
        tab: "completed",
        rating: 4.6,
        studentRating: 4,
        studentReview: "Good session, would book again for organic chemistry.",
        university: "University of KwaZulu-Natal",
        totalReviews: 22,
        rate: 90,
        paid: true,
        location: "Chemistry Building, Lab 3",
        notes: "Worked through balancing equations and limiting reagent problems.",
        tutorBio: "BSc Chemistry student. Loves helping peers understand reactions intuitively.",
    },
    {
        id: 6,
        tutor: "Amara Langa",
        initials: "AL",
        gradient: "from-violet-500 to-purple-600",
        subject: "Statistics 101",
        topic: "Hypothesis Testing & P-values",
        date: "Thu, 30 Jan",
        time: "4:00 PM – 5:00 PM",
        duration: "1 hour",
        format: "online",
        status: "completed",
        tab: "completed",
        rating: 4.9,
        studentRating: 5,
        studentReview: "Amara made p-values finally make sense. Highly recommend!",
        university: "University of Cape Town",
        totalReviews: 44,
        rate: 130,
        paid: true,
        notes: "Z-tests, t-tests and interpreting p-values for research projects.",
        tutorBio: "Honours student in Statistical Sciences with published research experience.",
    },
    {
        id: 7,
        tutor: "Fatima Razak",
        initials: "FR",
        gradient: "from-amber-500 to-red-500",
        subject: "Financial Accounting",
        topic: "Journal Entries & Trial Balance",
        date: "Tue, 28 Jan",
        time: "1:00 PM – 2:00 PM",
        duration: "1 hour",
        format: "in-person",
        status: "cancelled",
        tab: "cancelled",
        cancelReason: "Tutor had a schedule conflict.",
        university: "University of Johannesburg",
        rating: 4.5,
        totalReviews: 18,
        rate: 100,
        paid: false,
        location: "Business School, Room B12",
        notes: "Was planned to cover double-entry bookkeeping fundamentals.",
        tutorBio: "BCom Accounting student. Focused on making debits and credits intuitive.",
    },
];

const STATUS_CFG = {
    confirmed: { bg: "bg-green-50", text: "text-green-700", dot: "bg-green-500", label: "Confirmed" },
    pending: { bg: "bg-yellow-50", text: "text-yellow-700", dot: "bg-yellow-500", label: "Pending" },
    completed: { bg: "bg-blue-50", text: "text-primary", dot: "bg-primary", label: "Completed" },
    cancelled: { bg: "bg-red-50", text: "text-red-600", dot: "bg-red-500", label: "Cancelled" },
};

export default function SessionDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const session = SESSIONS.find((s) => s.id === Number(id));

    /* review state (for completed sessions without a review) */
    const [reviewRating, setReviewRating] = useState(0);
    const [reviewText, setReviewText] = useState("");
    const [reviewSubmitted, setReviewSubmitted] = useState(false);

    /* cancel confirmation */
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
                    to="/dashboard/sessions"
                    className="inline-flex items-center gap-2 bg-primary text-white font-semibold px-6 py-3 rounded-full shadow-lg shadow-primary/20 hover:bg-blue-800 transition"
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
    const hasReview = !!session.studentRating || reviewSubmitted;

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Back link */}
            <button
                onClick={() => navigate("/dashboard/sessions")}
                className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-primary font-semibold transition group"
            >
                <span className="material-icons-round text-lg group-hover:-translate-x-0.5 transition-transform">
                    arrow_back
                </span>
                Back to My Sessions
            </button>

            {/* ─── Header card ─── */}
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
                        {/* Tutor avatar */}
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
                                    {session.tutor}
                                </span>
                                <span className="text-xs text-gray-400">•</span>
                                <span className="text-sm text-gray-500">
                                    {session.university}
                                </span>
                                <span className="text-xs text-gray-400">•</span>
                                <span className="flex items-center gap-0.5 text-sm">
                                    <span className="material-icons-round text-accent text-sm">
                                        star
                                    </span>
                                    <span className="font-semibold text-gray-900">
                                        {session.rating}
                                    </span>
                                    <span className="text-gray-400 text-xs">
                                        ({session.totalReviews})
                                    </span>
                                </span>
                            </div>
                            {session.tutorBio && (
                                <p className="text-xs text-gray-400 mt-2 leading-relaxed">
                                    {session.tutorBio}
                                </p>
                            )}
                        </div>

                        {/* Quick actions top-right */}
                        <div className="flex sm:flex-col gap-2 flex-shrink-0">
                            <Link
                                to="/dashboard/messages"
                                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-gray-200 text-sm font-semibold text-gray-700 hover:border-primary hover:text-primary transition bg-white"
                            >
                                <span className="material-icons-round text-lg">chat</span>
                                Message
                            </Link>
                            <Link
                                to="/dashboard/browse"
                                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-gray-200 text-sm font-semibold text-gray-700 hover:border-primary hover:text-primary transition bg-white"
                            >
                                <span className="material-icons-round text-lg">person</span>
                                Profile
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* ─── Details grid ─── */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Date & Time */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-soft p-5 flex items-start gap-4">
                    <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                        <span className="material-icons-round text-primary">
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
                                className="text-sm text-primary hover:underline flex items-center gap-1 mt-0.5"
                            >
                                Join meeting link
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

                {/* Payment */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-soft p-5 flex items-start gap-4">
                    <div className="w-11 h-11 rounded-xl bg-emerald-50 flex items-center justify-center flex-shrink-0">
                        <span className="material-icons-round text-emerald-600">
                            payments
                        </span>
                    </div>
                    <div>
                        <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide">
                            Rate
                        </p>
                        <p className="font-semibold text-gray-900 mt-0.5">
                            ₦{session.rate}/hr
                        </p>
                        <p className={`text-sm font-semibold mt-0.5 ${session.paid ? "text-green-600" : "text-yellow-600"}`}>
                            {session.paid ? "Paid" : "Payment pending"}
                        </p>
                    </div>
                </div>
            </div>

            {/* ─── Session Notes ─── */}
            {session.notes && (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-soft p-6">
                    <div className="flex items-center gap-2 mb-3">
                        <span className="material-icons-round text-primary text-xl">
                            description
                        </span>
                        <h3 className="font-display font-bold text-gray-900">
                            Session Notes
                        </h3>
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed">
                        {session.notes}
                    </p>
                </div>
            )}

            {/* ─── Your Review (completed sessions) ─── */}
            {isCompleted && hasReview && (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-soft p-6">
                    <div className="flex items-center gap-2 mb-3">
                        <span className="material-icons-round text-accent text-xl">
                            rate_review
                        </span>
                        <h3 className="font-display font-bold text-gray-900">
                            Your Review
                        </h3>
                    </div>
                    <div className="flex items-center gap-1 mb-2">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <span
                                key={i}
                                className={`material-icons-round text-lg ${i < (session.studentRating || reviewRating)
                                        ? "text-accent"
                                        : "text-gray-300"
                                    }`}
                            >
                                star
                            </span>
                        ))}
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed">
                        {session.studentReview || reviewText}
                    </p>
                </div>
            )}

            {/* ─── Leave a Review (completed, no review yet) ─── */}
            {isCompleted && !hasReview && (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-soft p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <span className="material-icons-round text-accent text-xl">
                            star_half
                        </span>
                        <h3 className="font-display font-bold text-gray-900">
                            Leave a Review
                        </h3>
                    </div>

                    {/* Stars */}
                    <div className="flex items-center gap-1 mb-4">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setReviewRating(i + 1)}
                                className="transition-transform hover:scale-110"
                            >
                                <span
                                    className={`material-icons-round text-2xl ${i < reviewRating
                                            ? "text-accent"
                                            : "text-gray-300 hover:text-yellow-300"
                                        }`}
                                >
                                    star
                                </span>
                            </button>
                        ))}
                        {reviewRating > 0 && (
                            <span className="text-sm text-gray-500 ml-2">
                                {reviewRating}/5
                            </span>
                        )}
                    </div>

                    {/* Text */}
                    <textarea
                        rows={3}
                        value={reviewText}
                        onChange={(e) => setReviewText(e.target.value)}
                        placeholder="Share your experience with this tutor..."
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition resize-none text-sm"
                    />

                    <button
                        disabled={reviewRating === 0}
                        onClick={() => setReviewSubmitted(true)}
                        className="mt-3 bg-primary hover:bg-blue-800 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold text-sm px-6 py-2.5 rounded-full shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5"
                    >
                        Submit Review
                    </button>
                </div>
            )}

            {/* ─── Action bar ─── */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-soft p-5 flex flex-col sm:flex-row items-center gap-3">
                {isUpcoming && (
                    <>
                        {session.format === "online" && session.meetingLink && (
                            <a
                                href={session.meetingLink}
                                target="_blank"
                                rel="noreferrer"
                                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-primary hover:bg-blue-800 text-white font-semibold px-8 py-3 rounded-full shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5"
                            >
                                <span className="material-icons-round text-lg">
                                    videocam
                                </span>
                                Join Session
                            </a>
                        )}
                        <Link
                            to="/dashboard/messages"
                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border-2 border-primary text-primary font-semibold px-8 py-3 rounded-full hover:bg-blue-50 transition"
                        >
                            <span className="material-icons-round text-lg">
                                chat
                            </span>
                            Message Tutor
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
                                    onClick={() => {
                                        // TODO: cancel session
                                        navigate("/dashboard/sessions");
                                    }}
                                    className="bg-red-500 hover:bg-red-600 text-white text-sm font-semibold px-4 py-2 rounded-full transition"
                                >
                                    Yes, cancel
                                </button>
                                <button
                                    onClick={() => setShowCancel(false)}
                                    className="text-sm text-gray-500 hover:text-gray-700 font-semibold px-4 py-2 rounded-full hover:bg-gray-100 transition"
                                >
                                    No, keep it
                                </button>
                            </div>
                        )}
                    </>
                )}

                {isCompleted && (
                    <>
                        <Link
                            to="/dashboard/browse"
                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-primary hover:bg-blue-800 text-white font-semibold px-8 py-3 rounded-full shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5"
                        >
                            <span className="material-icons-round text-lg">
                                refresh
                            </span>
                            Rebook Tutor
                        </Link>
                        <Link
                            to="/dashboard/messages"
                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border-2 border-primary text-primary font-semibold px-8 py-3 rounded-full hover:bg-blue-50 transition"
                        >
                            <span className="material-icons-round text-lg">
                                chat
                            </span>
                            Message Tutor
                        </Link>
                    </>
                )}

                {isCancelled && (
                    <Link
                        to="/dashboard/browse"
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-primary hover:bg-blue-800 text-white font-semibold px-8 py-3 rounded-full shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5"
                    >
                        <span className="material-icons-round text-lg">
                            search
                        </span>
                        Find Another Tutor
                    </Link>
                )}
            </div>
        </div>
    );
}
