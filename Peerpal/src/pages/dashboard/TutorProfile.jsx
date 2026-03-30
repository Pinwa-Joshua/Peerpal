import { useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { TutorAPI, MatchesAPI } from "../../services/api";
import { StarsDisplay } from "../../components/feedback/FeedbackWidgets";
import { useAuth } from "../../context/AuthContext";

const formatTutors = (data) =>
    (Array.isArray(data) ? data : []).map((tutor) => ({
        ...tutor,
        subjects:
            typeof tutor.subjects === "string"
                ? tutor.subjects.split(",").map((subject) => subject.trim()).filter(Boolean)
                : tutor.subjects || [],
        initials:
            tutor.initials ||
            (tutor.name || "Tutor User")
                .split(" ")
                .map((part) => part[0])
                .join("")
                .slice(0, 2)
                .toUpperCase(),
        rating: tutor.rating || tutor.average_rating || 4.5,
        reviews: tutor.reviews || 0,
        rate: tutor.rate || tutor.hourly_rate || 100,
        university: tutor.university || "University not provided",
        bio: tutor.bio || "This tutor has not added a bio yet.",
        format: tutor.format || tutor.availability || "Flexible",
    }));

const getDefaultDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().slice(0, 10);
};

export default function TutorProfile() {
    const { id } = useParams();
    const [searchParams, setSearchParams] = useSearchParams();
    const { user } = useAuth();
    const [tutor, setTutor] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [requestOpen, setRequestOpen] = useState(searchParams.get("request") === "1");
    const [requestStatus, setRequestStatus] = useState({ type: "", message: "" });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [requestForm, setRequestForm] = useState({
        subject: "",
        date: getDefaultDate(),
        time: "16:00",
        format: "online",
        message: "",
    });

    useEffect(() => {
        setRequestOpen(searchParams.get("request") === "1");
    }, [searchParams]);

    useEffect(() => {
        const fetchTutor = async () => {
            try {
                const data = await TutorAPI.getTutors();
                const tutors = formatTutors(data);
                const selectedTutor = tutors.find((item) => String(item.id) === String(id));

                if (!selectedTutor) {
                    setError("Tutor profile not found.");
                    return;
                }

                setTutor(selectedTutor);
                setRequestForm((prev) => ({
                    ...prev,
                    subject: prev.subject || selectedTutor.subjects?.[0] || "",
                }));
            } catch (fetchError) {
                console.error("Failed to fetch tutor profile", fetchError);
                setError("Unable to load tutor profile right now.");
            } finally {
                setLoading(false);
            }
        };

        fetchTutor();
    }, [id]);

    const closeRequestModal = () => {
        setRequestOpen(false);
        searchParams.delete("request");
        setSearchParams(searchParams, { replace: true });
    };

    const openRequestModal = () => {
        setRequestOpen(true);
        setSearchParams({ request: "1" }, { replace: true });
    };

    const handleRequestSession = async () => {
        if (!tutor) return;

        setIsSubmitting(true);
        setRequestStatus({ type: "", message: "" });

        try {
            await MatchesAPI.createSession({
                tutor_id: tutor.id,
                subject: requestForm.subject || tutor.subjects?.[0] || "General Session",
                date: requestForm.date,
                time: requestForm.time,
                format: requestForm.format,
                message: requestForm.message,
                university: user?.university || "University",
                year: user?.year || "N/A",
                gradient: "from-cyan-500 to-blue-600",
            });

            setRequestStatus({
                type: "success",
                message: "Session request sent. The tutor can now see it in their request list.",
            });
            closeRequestModal();
        } catch (requestError) {
            console.error("Failed to create session request", requestError);
            setRequestStatus({
                type: "error",
                message: requestError.message || "Unable to send session request.",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return <div className="max-w-5xl mx-auto py-10 text-center text-gray-500">Loading tutor profile...</div>;
    }

    if (error || !tutor) {
        return (
            <div className="max-w-5xl mx-auto py-10">
                <div className="rounded-3xl border border-red-100 bg-red-50 p-6 text-sm text-red-700">
                    {error || "Tutor profile not found."}
                </div>
                <Link
                    to="/dashboard/browse"
                    className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
                >
                    <span className="material-icons-round text-base">arrow_back</span>
                    Back to Browse Tutors
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            <Link
                to="/dashboard/browse"
                className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
            >
                <span className="material-icons-round text-base">arrow_back</span>
                Back to Browse Tutors
            </Link>

            {requestStatus.message && (
                <div
                    className={`rounded-2xl p-4 text-sm font-medium ${
                        requestStatus.type === "success"
                            ? "border border-green-100 bg-green-50 text-green-700"
                            : "border border-red-100 bg-red-50 text-red-700"
                    }`}
                >
                    {requestStatus.message}
                </div>
            )}

            <section className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-soft">
                <div className="bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.16),_transparent_32%),linear-gradient(135deg,#f8fbff_0%,#ffffff_48%,#f1f5f9_100%)] p-6 sm:p-8">
                    <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
                        <div className="flex items-start gap-4">
                            <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-blue-500 to-indigo-600 text-2xl font-bold text-white shadow-md">
                                {tutor.initials}
                            </div>
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary/80">
                                    Tutor Profile
                                </p>
                                <h1 className="mt-2 text-3xl font-display font-extrabold text-slate-900">
                                    {tutor.name}
                                </h1>
                                <p className="mt-2 text-sm text-slate-600">
                                    {tutor.university}
                                </p>
                                <div className="mt-3 flex flex-wrap items-center gap-3">
                                    <div className="flex items-center gap-2">
                                        <StarsDisplay value={tutor.rating} size="text-sm" />
                                        <span className="text-sm font-medium text-slate-700">
                                            {tutor.rating}
                                        </span>
                                    </div>
                                    <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                                        ZAR {tutor.rate}/hr
                                    </span>
                                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                                        {tutor.format}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={openRequestModal}
                            className="rounded-2xl bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-800"
                        >
                            Request Session
                        </button>
                    </div>
                </div>
            </section>

            <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
                <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-soft">
                    <h2 className="text-xl font-display font-bold text-slate-900">About This Tutor</h2>
                    <p className="mt-4 text-sm leading-7 text-slate-600">{tutor.bio}</p>

                    <div className="mt-6">
                        <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">
                            Subjects
                        </h3>
                        <div className="mt-3 flex flex-wrap gap-2">
                            {tutor.subjects.length > 0 ? (
                                tutor.subjects.map((subject) => (
                                    <span
                                        key={subject}
                                        className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-600"
                                    >
                                        {subject}
                                    </span>
                                ))
                            ) : (
                                <p className="text-sm text-slate-500">No subjects listed yet.</p>
                            )}
                        </div>
                    </div>
                </section>

                <aside className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-soft">
                    <h2 className="text-xl font-display font-bold text-slate-900">Quick Facts</h2>
                    <div className="mt-5 space-y-4 text-sm">
                        <div className="rounded-2xl bg-slate-50 p-4">
                            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Email</p>
                            <p className="mt-2 font-medium text-slate-700">{tutor.email || "Not available"}</p>
                        </div>
                        <div className="rounded-2xl bg-slate-50 p-4">
                            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Availability</p>
                            <p className="mt-2 font-medium text-slate-700">{tutor.format}</p>
                        </div>
                        <div className="rounded-2xl bg-slate-50 p-4">
                            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Reviews</p>
                            <p className="mt-2 font-medium text-slate-700">{tutor.reviews} total reviews</p>
                        </div>
                    </div>
                </aside>
            </div>

            {requestOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
                    <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <h2 className="text-xl font-display font-bold text-slate-900">Request a Session</h2>
                                <p className="mt-1 text-sm text-slate-500">
                                    Send your request to {tutor.name}. They will see it in their session requests.
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={closeRequestModal}
                                className="rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
                            >
                                <span className="material-icons-round text-base">close</span>
                            </button>
                        </div>

                        <div className="mt-6 grid gap-4 sm:grid-cols-2">
                            <label className="block">
                                <span className="mb-2 block text-sm font-semibold text-slate-700">Subject</span>
                                <input
                                    type="text"
                                    value={requestForm.subject}
                                    onChange={(event) =>
                                        setRequestForm((prev) => ({ ...prev, subject: event.target.value }))
                                    }
                                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                                />
                            </label>
                            <label className="block">
                                <span className="mb-2 block text-sm font-semibold text-slate-700">Format</span>
                                <select
                                    value={requestForm.format}
                                    onChange={(event) =>
                                        setRequestForm((prev) => ({ ...prev, format: event.target.value }))
                                    }
                                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                                >
                                    <option value="online">Online</option>
                                    <option value="physical">Physical</option>
                                </select>
                            </label>
                            <label className="block">
                                <span className="mb-2 block text-sm font-semibold text-slate-700">Preferred Date</span>
                                <input
                                    type="date"
                                    value={requestForm.date}
                                    onChange={(event) =>
                                        setRequestForm((prev) => ({ ...prev, date: event.target.value }))
                                    }
                                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                                />
                            </label>
                            <label className="block">
                                <span className="mb-2 block text-sm font-semibold text-slate-700">Preferred Time</span>
                                <input
                                    type="time"
                                    value={requestForm.time}
                                    onChange={(event) =>
                                        setRequestForm((prev) => ({ ...prev, time: event.target.value }))
                                    }
                                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                                />
                            </label>
                        </div>

                        <label className="mt-4 block">
                            <span className="mb-2 block text-sm font-semibold text-slate-700">Message</span>
                            <textarea
                                rows={4}
                                value={requestForm.message}
                                onChange={(event) =>
                                    setRequestForm((prev) => ({ ...prev, message: event.target.value }))
                                }
                                placeholder="Briefly describe what you need help with."
                                className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 resize-none"
                            />
                        </label>

                        <div className="mt-6 flex items-center justify-end gap-3">
                            <button
                                type="button"
                                onClick={closeRequestModal}
                                className="rounded-2xl px-4 py-2.5 text-sm font-semibold text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleRequestSession}
                                disabled={isSubmitting}
                                className="rounded-2xl bg-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-800 disabled:opacity-60"
                            >
                                {isSubmitting ? "Sending..." : "Send Request"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
