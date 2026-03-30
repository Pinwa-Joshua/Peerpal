import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { MatchesAPI } from "../../services/api";
import { useAuth } from "../../context/AuthContext";

export default function DashboardHome() {
    const { user } = useAuth();


    const [stats, setStats] = useState([
        { icon: "event_available", label: "Total Sessions", value: "0", color: "bg-blue-50 text-primary" },
        { icon: "menu_book", label: "Subjects Built", value: "0", color: "bg-green-50 text-green-600" },
        { icon: "schedule", label: "Hours Learned", value: "0", color: "bg-purple-50 text-purple-600" },
    ]);
    const [upcomingSessions, setUpcomingSessions] = useState([]);
    const [recommendedTutors, setRecommendedTutors] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                // Fetch sessions
                const sessionsResponse = await MatchesAPI.getSessions();
                // Ensure it's an array
                const sessions = Array.isArray(sessionsResponse) ? sessionsResponse : [];

                // Process for stats
                const totalSessions = sessions.length;
                const hours = sessions.reduce((acc, curr) => acc + (curr.duration || 1), 0);

                // Format upcoming sessions
                const upcoming = sessions.filter(s => s.status === 'upcoming' || s.status === 'accepted').slice(0, 3).map(s => ({
                    id: s.id,
                    tutor: s.tutor_name || `Tutor ${s.tutor_id}`,
                    initials: (s.tutor_name || "T U").split(" ").map(n => n[0]).join(""),
                    gradient: "from-blue-500 to-indigo-600",
                    subject: s.subject || "General Session",
                    date: new Date(s.date).toLocaleString(),
                    format: s.session_type || "online",
                }));

                setUpcomingSessions(upcoming);

                setStats([
                    { icon: "event_available", label: "Total Sessions", value: totalSessions.toString(), color: "bg-blue-50 text-primary" },
                    { icon: "menu_book", label: "Subjects Built", value: "1", color: "bg-green-50 text-green-600" },
                    { icon: "schedule", label: "Hours Learned", value: hours.toString(), color: "bg-purple-50 text-purple-600" },
                ]);

                // We can't fetch real tutors yet because TutorAPI may not have a getTutors exported. 
                // We'll fallback to context or empty array for now until TutorAPI is fully ready.
                setRecommendedTutors([]);
            } catch (error) {
                console.error("Failed to load dashboard data", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const actionButtonClass =
        "inline-flex items-center gap-2 rounded-full border-2 border-primary px-5 py-2.5 text-sm font-semibold text-primary transition hover:bg-blue-50";

    return (
        <div className="max-w-7xl mx-auto space-y-8">
            <div>
                <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-gray-900 flex items-center gap-2">
                    Welcome back
                    <span className="material-icons-round text-accent">waving_hand</span>
                </h1>
                <p className="text-gray-500 mt-1">
                    Here's what's happening with your learning journey.
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {stats.map((s) => (
                    <div
                        key={s.label}
                        className="bg-white rounded-2xl border border-gray-100 shadow-soft p-5 flex items-center gap-4"
                    >
                        <div
                            className={`${s.color} w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0`}
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
            </div>

            {user?.role !== "tutor" && (
                <section className="rounded-[2rem] border border-emerald-100 bg-[linear-gradient(135deg,#ecfdf5_0%,#ffffff_48%,#eff6ff_100%)] p-6 shadow-soft">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                        <div className="max-w-2xl">
                            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-700">
                                Grow On PeerPal
                            </p>
                            <h2 className="mt-2 text-2xl font-display font-bold text-gray-900">
                                Want to teach too? Become a tutor from this account.
                            </h2>
                            <p className="mt-2 text-sm leading-relaxed text-gray-600">
                                If you also want to tutor other students, you can start the tutor onboarding flow from here.
                                Once you complete it, your account will be upgraded for tutor access.
                            </p>
                        </div>
                        <div className="flex flex-col gap-3 sm:flex-row">
                            <Link
                                to="/onboarding/tutor/quiz"
                                className="inline-flex items-center justify-center gap-2 rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
                            >
                                <span className="material-icons-round text-lg">school</span>
                                Become a Tutor
                            </Link>
                            <Link
                                to="/dashboard/settings"
                                className="inline-flex items-center justify-center gap-2 rounded-full border border-emerald-200 bg-white px-6 py-3 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-50"
                            >
                                <span className="material-icons-round text-lg">manage_accounts</span>
                                Review Profile
                            </Link>
                        </div>
                    </div>
                </section>
            )}

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
                    {upcomingSessions.length === 0 && !isLoading && (
                        <p className="text-gray-500 text-sm">No upcoming sessions found. Start exploring tutors to book one!</p>
                    )}
                    {upcomingSessions.map((session) => (
                        <div
                            key={session.id}
                            className="bg-white rounded-2xl border border-gray-100 shadow-soft p-5 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <div
                                    className={`bg-gradient-to-br ${session.gradient} w-11 h-11 shrink-0 rounded-full flex items-center justify-center text-white font-bold shadow-inner`}
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
                                    className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${session.format === "online" ? "bg-blue-50 text-blue-700" : "bg-purple-50 text-purple-700"}`}
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
                        Recommended Tutors
                    </h2>
                    <Link
                        to="/dashboard/browse"
                        className="text-sm text-primary font-semibold hover:underline inline-flex items-center gap-1"
                    >
                        View all
                        <span className="material-icons-round text-sm">
                            arrow_forward
                        </span>
                    </Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {recommendedTutors.length === 0 && !isLoading && (
                        <p className="text-gray-500 text-sm">No recommended tutors found at the moment.</p>
                    )}
                    {recommendedTutors.map((tutor) => (
                        <div
                            key={tutor.id}
                            className="bg-white rounded-2xl border border-gray-100 shadow-soft p-5 flex flex-col hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
                        >
                            <div className="flex items-start gap-4 mb-4">
                                {tutor.profile_picture ? (
                                    <img
                                        src={tutor.profile_picture}
                                        alt={tutor.name}
                                        className="w-14 h-14 rounded-full object-cover"
                                    />
                                ) : (
                                    <div
                                        className={`w-14 h-14 rounded-full bg-gradient-to-br ${tutor.gradient || "from-gray-400 to-gray-500"} flex flex-shrink-0 items-center justify-center text-white text-lg font-bold`}
                                    >
                                        {tutor.initials || "TU"}
                                    </div>
                                )}
                                <div>
                                    <h3 className="font-semibold text-gray-900">
                                        {tutor.name}
                                    </h3>
                                    <p className="text-sm text-gray-500 line-clamp-1">
                                        {tutor.university}
                                    </p>
                                    <div className="flex items-center gap-1 mt-1">
                                        <span className="material-icons-round text-sm text-accent">
                                            star
                                        </span>
                                        <span className="text-sm font-medium text-gray-900">
                                            {tutor.rating}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-wrap gap-2 mb-4">
                                {(tutor.subjects || []).slice(0, 2).map((subject, idx) => (
                                    <span
                                        key={idx}
                                        className="text-xs font-medium px-2 py-1 bg-gray-50 text-gray-600 rounded-md"
                                    >
                                        {subject}
                                    </span>
                                ))}
                            </div>
                            <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-50">
                                <span className="font-semibold text-gray-900">
                                    R{tutor.rate}/hr
                                </span>
                                <Link
                                    to={`/dashboard/tutors/${tutor.id}`}
                                    className="text-sm font-semibold text-primary hover:text-blue-800 transition"
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

