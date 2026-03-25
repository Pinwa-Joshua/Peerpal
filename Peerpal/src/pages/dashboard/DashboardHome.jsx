import { useState } from "react";
import { Link } from "react-router-dom";
import { useFeedback } from "../../context/FeedbackContext";
import { MatchesAPI } from "../../services/api";

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
        date: "Fri, 14 Feb - 2:00 PM",
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
    const feedback = useFeedback();
    const [isMatching, setIsMatching] = useState(false);
    const [matchResult, setMatchResult] = useState(null);

    const recommendedTutors = feedback?.tutorProfiles?.length
        ? feedback.tutorProfiles.slice(0, 3)
        : RECOMMENDED_TUTORS;

    const actionButtonClass = "inline-flex items-center gap-2 rounded-full border-2 border-primary px-5 py-2.5 text-sm font-semibold text-primary transition hover:bg-blue-50";

    const getMatchSubject = () => {
        const rankedCourse = feedback?.courseCatalog
            ?.slice()
            ?.sort((a, b) => (b.popularity || 0) - (a.popularity || 0))[0];

        if (rankedCourse?.category) return rankedCourse.category;
        if (recommendedTutors[0]?.subjects?.[0]) return recommendedTutors[0].subjects[0];
        return "Calculus II";
    };

    const handleMatchTutor = async () => {
        const subject = getMatchSubject();

        setIsMatching(true);
        try {
            const result = await MatchesAPI.recommendTutor({
                subject,
                prefer_same_university: true,
            });

            setMatchResult({
                status: "success",
                title: "Match created",
                message: `A tutor match was created successfully for ${subject}.`,
                meta: result?.probability ? `Match score: ${result.probability}` : null,
            });
        } catch (error) {
            const message = error?.message || "Match not created";
            const isNotFound = /no tutors found|no suitable tutor found|match not created/i.test(message);

            setMatchResult({
                status: "error",
                title: isNotFound ? "Match not created" : "Unable to create match",
                message: isNotFound
                    ? `No tutor was found for ${subject} right now.`
                    : message,
                meta: null,
            });
        } finally {
            setIsMatching(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto space-y-8">
            {matchResult && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4">
                    <div className="w-full max-w-md rounded-[2rem] bg-white p-6 shadow-2xl">
                        <div className="flex items-start gap-4">
                            <div
                                className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full ${matchResult.status === "success"
                                    ? "bg-emerald-50 text-emerald-600"
                                    : "bg-rose-50 text-rose-600"
                                    }`}
                            >
                                <span className="material-icons-round text-2xl">
                                    {matchResult.status === "success" ? "check_circle" : "error"}
                                </span>
                            </div>
                            <div className="min-w-0 flex-1">
                                <h2 className="text-xl font-display font-bold text-slate-900">
                                    {matchResult.title}
                                </h2>
                                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                                    {matchResult.message}
                                </p>
                                {matchResult.meta && (
                                    <p className="mt-2 text-sm font-semibold text-primary">
                                        {matchResult.meta}
                                    </p>
                                )}
                            </div>
                        </div>
                        <div className="mt-6 flex justify-end">
                            <button
                                type="button"
                                onClick={() => setMatchResult(null)}
                                className={actionButtonClass}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div>
                <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-gray-900 flex items-center gap-2">
                    Welcome back
                    <span className="material-icons-round text-accent">waving_hand</span>
                </h1>
                <p className="text-gray-500 mt-1">
                    Here&apos;s what&apos;s happening with your learning journey.
                </p>
            </div>

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

            <div className="flex flex-wrap gap-3">
                <Link
                    to="/dashboard/browse"
                    className={actionButtonClass}
                >
                    <span className="material-icons-round text-lg">search</span>
                    Search Courses
                </Link>
                <Link
                    to="/dashboard/sessions"
                    className={actionButtonClass}
                >
                    <span className="material-icons-round text-lg">
                        calendar_today
                    </span>
                    View Schedule
                </Link>
                <Link
                    to="/dashboard/messages"
                    className={actionButtonClass}
                >
                    <span className="material-icons-round text-lg">
                        chat_bubble_outline
                    </span>
                    Messages
                </Link>
                <button
                    type="button"
                    onClick={handleMatchTutor}
                    disabled={isMatching}
                    className={`${actionButtonClass} disabled:cursor-not-allowed disabled:opacity-60`}
                >
                    <span className="material-icons-round text-lg">
                        {isMatching ? "hourglass_top" : "person_search"}
                    </span>
                    {isMatching ? "Matching..." : "Match Tutor"}
                </button>
            </div>

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

            <section>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-display font-bold text-gray-900">
                        Recommended Matches
                    </h2>
                    <Link
                        to="/dashboard/browse"
                        className="text-sm text-primary font-semibold hover:underline inline-flex items-center gap-1"
                    >
                        Explore search
                        <span className="material-icons-round text-sm">
                            arrow_forward
                        </span>
                    </Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {recommendedTutors.map((tutor) => (
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
                                    N{tutor.rate}/hr
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
