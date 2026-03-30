import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FeedbackStatusPill } from "../../components/feedback/FeedbackWidgets";
import {
  createEmptyRatings,
  LEARNER_RATING_FIELDS,
  SessionRatingForm,
  SessionRatingSummary,
} from "../../components/feedback/SessionRating";
import { MatchesAPI } from "../../services/api";

const STATUS_CFG = {
  accepted: { bg: "bg-green-50", text: "text-green-700", dot: "bg-green-500", label: "Confirmed" },
  pending: { bg: "bg-yellow-50", text: "text-yellow-700", dot: "bg-yellow-500", label: "Pending" },
  completed: { bg: "bg-blue-50", text: "text-primary", dot: "bg-primary", label: "Completed" },
  cancelled: { bg: "bg-red-50", text: "text-red-600", dot: "bg-red-500", label: "Cancelled" },
  declined: { bg: "bg-red-50", text: "text-red-600", dot: "bg-red-500", label: "Declined" },
};

const SESSION_GRADIENT = "from-blue-500 to-indigo-600";

export default function SessionDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [ratings, setRatings] = useState(createEmptyRatings(LEARNER_RATING_FIELDS));
  const [submittedFeedback, setSubmittedFeedback] = useState(null);
  const [status, setStatus] = useState({ type: "", message: "" });
  const [showCancel, setShowCancel] = useState(false);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const sessionsResp = await MatchesAPI.getSessions();
        const sessions = Array.isArray(sessionsResp) ? sessionsResp : [];
        const found = sessions.find((item) => String(item.id) === String(id));

        if (!found) {
          setSession(null);
          return;
        }

        const mappedSession = {
          id: found.id,
          status: found.status || "pending",
          chatUserId: found.partner_id,
          subject: found.subject || "General Session",
          topic: found.message || "Session details will appear here once confirmed.",
          tutor: found.partner_name || found.tutor_name || "Tutor",
          university: found.university || "University not provided",
          tutorBio: found.message || "No tutor bio available yet.",
          gradient: SESSION_GRADIENT,
          initials: (found.partner_name || found.tutor_name || "TU")
            .split(" ")
            .map((part) => part[0])
            .join("")
            .slice(0, 2)
            .toUpperCase(),
          date: found.date || (found.created_at ? new Date(found.created_at).toLocaleDateString() : "TBD"),
          time: found.time || (found.created_at ? new Date(found.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "TBD"),
          duration: found.duration || "1 hour",
          format: found.format || "online",
          location: found.format === "physical" ? "Physical location to be agreed" : "Meeting link will be shared by the tutor",
          rate: found.rate || 100,
          paid: Boolean(found.paid),
          meetingLink: found.meeting_link || "",
          notes: found.message || "",
          feedback: {
            student: submittedFeedback,
            tutor: null,
          },
          cancelReason: found.rejectReason || "",
        };

        setSession(mappedSession);
      } catch (error) {
        console.error("Failed to load session detail", error);
        setStatus({ type: "error", message: "Unable to load this session right now." });
      } finally {
        setLoading(false);
      }
    };

    fetchSession();
  }, [id, submittedFeedback]);

  if (loading) {
    return <div className="max-w-3xl mx-auto py-20 text-center text-gray-500">Loading session...</div>;
  }

  if (!session) {
    return (
      <div className="max-w-3xl mx-auto py-20 text-center">
        <span className="material-icons-round mb-4 block text-6xl text-gray-300">event_busy</span>
        <h2 className="mb-2 text-xl font-display font-bold text-gray-900">Session not found</h2>
        <p className="mb-6 text-gray-500">This session may have been removed or does not exist.</p>
        <Link
          to="/dashboard/sessions"
          className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-semibold text-white shadow-lg shadow-primary/20 transition hover:bg-blue-800"
        >
          <span className="material-icons-round text-lg">arrow_back</span>
          Back to Sessions
        </Link>
      </div>
    );
  }

  const st = STATUS_CFG[session.status] || STATUS_CFG.pending;
  const isUpcoming = session.status === "pending" || session.status === "accepted";
  const isCompleted = session.status === "completed";
  const isCancelled = session.status === "cancelled" || session.status === "declined";
  const studentFeedback = submittedFeedback;
  const tutorFeedback = null;

  const handleRate = (key, value) => {
    setRatings((current) => ({ ...current, [key]: value }));
  };

  const handleSubmit = () => {
    const values = Object.values(ratings).filter((value) => value > 0);
    if (!values.length) {
      setStatus({ type: "error", message: "Please rate at least one category." });
      return;
    }

    const overallRating = Math.round((values.reduce((sum, value) => sum + value, 0) / values.length) * 10) / 10;
    setSubmittedFeedback({
      ratings,
      overallRating,
      submittedAt: new Date().toISOString(),
    });
    setStatus({ type: "success", message: "Tutor rating submitted for this session." });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <button
        onClick={() => navigate("/dashboard/sessions")}
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-500 transition hover:text-primary group"
      >
        <span className="material-icons-round text-lg transition-transform group-hover:-translate-x-0.5">
          arrow_back
        </span>
        Back to My Sessions
      </button>

      <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-soft">
        <div className={`${st.bg} flex items-center gap-2 px-6 py-3`}>
          <span className={`h-2 w-2 rounded-full ${st.dot}`} />
          <span className={`text-sm font-semibold ${st.text}`}>{st.label}</span>
          {isCancelled && session.cancelReason && (
            <span className="ml-1 text-xs text-gray-500">{session.cancelReason}</span>
          )}
        </div>

        <div className="p-6 sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row">
            <div
              className={`flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br ${session.gradient} text-2xl font-bold text-white shadow-lg`}
            >
              {session.initials}
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-display font-extrabold text-gray-900">{session.subject}</h1>
              <p className="mt-1 text-gray-500">{session.topic}</p>
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <span className="text-sm font-semibold text-gray-900">{session.tutor}</span>
                <span className="text-xs text-gray-400">•</span>
                <span className="text-sm text-gray-500">{session.university}</span>
              </div>
              <p className="mt-3 max-w-3xl text-sm leading-relaxed text-gray-500">{session.tutorBio}</p>
            </div>

            <div className="flex flex-wrap gap-2 lg:flex-col">
              <Link
                to={session.chatUserId ? `/dashboard/messages?user=${session.chatUserId}&name=${encodeURIComponent(session.tutor)}` : "/dashboard/messages"}
                className="inline-flex items-center gap-2 rounded-xl border-2 border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:border-primary hover:text-primary"
              >
                <span className="material-icons-round text-lg">chat</span>
                Message
              </Link>
              <Link
                to="/dashboard/feedback"
                className="inline-flex items-center gap-2 rounded-xl border-2 border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:border-primary hover:text-primary"
              >
                <span className="material-icons-round text-lg">star_rate</span>
                Ratings
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <InfoCard icon="calendar_today" tone="blue" label="Date & Time" value={session.date} helper={session.time} />
        <InfoCard icon="timer" tone="purple" label="Duration" value={session.duration} />
        <InfoCard
          icon={session.format === "online" ? "videocam" : "location_on"}
          tone={session.format === "online" ? "green" : "orange"}
          label="Format"
          value={session.format}
          helper={session.location}
        />
        <InfoCard
          icon="payments"
          tone="emerald"
          label="Rate"
          value={`N${session.rate}/hr`}
          helper={session.paid ? "Paid" : "Payment pending"}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          <section className="rounded-3xl border border-gray-100 bg-white p-6 shadow-soft">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-display font-bold text-gray-900">Two-Way Rating Status</h2>
                <p className="text-sm text-gray-500">Each user submits their rating independently after the session is completed.</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <FeedbackStatusPill
                  submitted={!!studentFeedback}
                  label={studentFeedback ? "Your rating submitted" : "Your rating pending"}
                />
                <FeedbackStatusPill
                  submitted={!!tutorFeedback}
                  label={tutorFeedback ? "Tutor submitted privately" : "Tutor pending"}
                />
              </div>
            </div>
          </section>

          {session.notes && (
            <section className="rounded-3xl border border-gray-100 bg-white p-6 shadow-soft">
              <div className="mb-3 flex items-center gap-2">
                <span className="material-icons-round text-primary">description</span>
                <h2 className="font-display text-xl font-bold text-gray-900">Session Notes</h2>
              </div>
              <p className="text-sm leading-relaxed text-gray-600">{session.notes}</p>
            </section>
          )}

          {isCompleted && !studentFeedback && (
            <SessionRatingForm
              title="Rate Your Tutor"
              subtitle="Use quick numeric ratings only. Written feedback is disabled to keep the process fast and objective."
              fields={LEARNER_RATING_FIELDS}
              ratings={ratings}
              onRate={handleRate}
              onSubmit={handleSubmit}
              submitLabel="Submit learner rating"
              status={status}
            />
          )}

          {isCompleted && studentFeedback && (
            <SessionRatingSummary
              title="Your Tutor Rating"
              subtitle="This rating is now locked for this completed session."
              entry={studentFeedback}
              fields={LEARNER_RATING_FIELDS}
            />
          )}

          {isCompleted && (
            <section className="rounded-3xl border border-dashed border-gray-200 bg-white p-6 text-sm text-gray-500 shadow-soft">
              Tutor ratings remain private and are not shown to learners.
            </section>
          )}
        </div>

        <div className="space-y-6">
          <section className="rounded-3xl border border-gray-100 bg-white p-6 shadow-soft">
            <h2 className="text-xl font-display font-bold text-gray-900">Next Actions</h2>
            <div className="mt-4 flex flex-col gap-3">
              {isUpcoming && session.format === "online" && session.meetingLink && (
                <a
                  href={session.meetingLink}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition hover:-translate-y-0.5 hover:bg-blue-800"
                >
                  <span className="material-icons-round text-lg">videocam</span>
                  Join Session
                </a>
              )}
              {isCompleted && (
                <Link
                  to="/dashboard/browse"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition hover:-translate-y-0.5 hover:bg-blue-800"
                >
                  <span className="material-icons-round text-lg">refresh</span>
                  Rebook Tutor
                </Link>
              )}
              <Link
                to={session.chatUserId ? `/dashboard/messages?user=${session.chatUserId}&name=${encodeURIComponent(session.tutor)}` : "/dashboard/messages"}
                className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-primary px-6 py-3 text-sm font-semibold text-primary transition hover:bg-blue-50"
              >
                <span className="material-icons-round text-lg">chat</span>
                Message Tutor
              </Link>

              {isUpcoming && !showCancel && (
                <button
                  onClick={() => setShowCancel(true)}
                  className="rounded-full px-6 py-3 text-sm font-semibold text-red-500 transition hover:bg-red-50 hover:text-red-700"
                >
                  Cancel Session
                </button>
              )}
              {isUpcoming && showCancel && (
                <div className="rounded-2xl bg-red-50 p-4 text-sm text-red-700">
                  <p className="font-semibold">Cancel this session?</p>
                  <div className="mt-3 flex gap-2">
                    <button
                      onClick={() => navigate("/dashboard/sessions")}
                      className="rounded-full bg-red-500 px-4 py-2 font-semibold text-white transition hover:bg-red-600"
                    >
                      Yes, cancel
                    </button>
                    <button
                      onClick={() => setShowCancel(false)}
                      className="rounded-full bg-white px-4 py-2 font-semibold text-red-600 transition hover:bg-red-100"
                    >
                      Keep session
                    </button>
                  </div>
                </div>
              )}
              {isCancelled && (
                <Link
                  to="/dashboard/browse"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition hover:bg-blue-800"
                >
                  <span className="material-icons-round text-lg">search</span>
                  Find Another Tutor
                </Link>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function InfoCard({ icon, tone, label, value, helper }) {
  const tones = {
    blue: "bg-blue-50 text-primary",
    purple: "bg-purple-50 text-purple-600",
    green: "bg-green-50 text-green-600",
    orange: "bg-orange-50 text-orange-600",
    emerald: "bg-emerald-50 text-emerald-600",
  };

  return (
    <div className="flex items-start gap-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-soft">
      <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${tones[tone]}`}>
        <span className="material-icons-round">{icon}</span>
      </div>
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-400">{label}</p>
        <p className="mt-1 font-semibold capitalize text-gray-900">{value}</p>
        {helper && <p className="text-sm text-gray-500">{helper}</p>}
      </div>
    </div>
  );
}
