import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FeedbackStatusPill } from "../../components/feedback/FeedbackWidgets";
import { MatchesAPI, FeedbackAPI } from "../../services/api";
import { toast } from "sonner";
import {
  createEmptyRatings,
  TUTOR_RATING_FIELDS,
  SessionRatingForm,
  SessionRatingSummary,
} from "../../components/feedback/SessionRating";

const STATUS_CFG = {
  accepted: { bg: "bg-green-50", text: "text-green-700", dot: "bg-green-500", label: "Confirmed" },
  pending: { bg: "bg-yellow-50", text: "text-yellow-700", dot: "bg-yellow-500", label: "Pending" },
  completed: { bg: "bg-blue-50", text: "text-tutor", dot: "bg-tutor", label: "Completed" },
  cancelled: { bg: "bg-red-50", text: "text-red-600", dot: "bg-red-500", label: "Cancelled" },
  declined: { bg: "bg-red-50", text: "text-red-600", dot: "bg-red-500", label: "Declined" },
};

const SESSION_GRADIENT = "from-cyan-500 to-blue-600";

export default function TutorSessionDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCancel, setShowCancel] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);

  const [ratings, setRatings] = useState(createEmptyRatings(TUTOR_RATING_FIELDS));
  const [submittedFeedback, setSubmittedFeedback] = useState(null);
  const [status, setStatus] = useState({ type: "", message: "" });

  const handleRate = (key, value) => {
    setRatings((current) => ({ ...current, [key]: value }));
  };

  const handleComplete = async () => {
    if (!window.confirm("Are you sure you want to mark this session as completed?")) return;
    try {
      setIsCompleting(true);
      await MatchesAPI.completeSession(session.id);
      setSession(prev => ({ ...prev, status: "completed" }));
      toast.success("Session marked as completed");
    } catch (err) {
      console.error("Failed to complete session", err);
      toast.error("Could not complete session");
    } finally {
      setIsCompleting(false);
    }
  };

  const handleSubmitFeedback = async () => {
    const values = Object.values(ratings);
    if (values.includes(0)) {
      toast.error("Please provide a rating for all fields.");
      return;
    }
    const overallRating = Math.round((values.reduce((sum, value) => sum + value, 0) / values.length) * 10) / 10;
    try {
      await FeedbackAPI.submitFeedback({
        session_id: id,
        rating: overallRating,
        comments: `Punctuality: ${ratings.punctuality || 0}, Preparedness: ${ratings.preparedness || 0}`
      });

      setSubmittedFeedback({
        ratings,
        overallRating,
        submittedAt: new Date().toISOString(),
      });
      toast.success("Student rating submitted!");
    } catch (err) {
      toast.error(err.message || "Failed to submit feedback.");
    }
  };

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
          subject: found.subject || "Subject",
          topic: found.message || "Session details will appear here once confirmed.",
          student: found.tuteeName || found.tutee_name || found.partner_name || "Unknown Student",
          university: found.university || "University not provided",
          gradient: found.gradient || SESSION_GRADIENT,
          initials: (found.tuteeName || found.tutee_name || found.partner_name || "ST")
            .split(" ")
            .map((part) => part[0])
            .join("")
            .slice(0, 2)
            .toUpperCase(),
          date: found.date || (found.created_at ? new Date(found.created_at).toLocaleDateString() : "TBD"),
          time: found.time || (found.created_at ? new Date(found.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "TBD"),
          duration: found.duration || "1 hour",
          format: found.session_type || found.format || "online",
          location: (found.session_type || found.format) === "physical" ? "Physical location to be agreed" : "Meeting link will be shared with the student",
          rate: found.rate || 100,
          paid: Boolean(found.paid),
          meetingLink: found.meeting_link || "",
          notes: found.message || "",
          feedbackStatus: found.feedback_status || "pending",
          cancelReason: found.rejectReason || "",
        };

        setSession(mappedSession);
      } catch (err) {
        console.error("Failed to load session detail:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSession();
  }, [id]);

  if (loading) {
    return <div className="max-w-3xl mx-auto py-20 text-center text-gray-500">Loading session...</div>;
  }

  if (!session) {
    return (
      <div className="max-w-3xl mx-auto py-20 text-center">
        <span className="material-icons-round mb-4 block text-6xl text-gray-300">
          event_busy
        </span>
        <h2 className="mb-2 text-xl font-display font-bold text-gray-900">
          Session not found
        </h2>
        <p className="mb-6 text-gray-500">
          This session may have been removed or does not exist.
        </p>
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 rounded-full bg-tutor px-6 py-3 font-semibold text-white shadow-sm transition hover:bg-teal-700"
        >
          <span className="material-icons-round text-lg">arrow_back</span>
          Go Back
        </button>
      </div>
    );
  }

  const st = STATUS_CFG[session.status] || STATUS_CFG.pending;
  const isUpcoming = session.status === "pending" || session.status === "accepted";
  const isCompleted = session.status === "completed";
  const isCancelled = session.status === "cancelled" || session.status === "declined";

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-500 transition hover:text-tutor group"
      >
        <span className="material-icons-round text-lg transition-transform group-hover:-translate-x-0.5">
          arrow_back
        </span>
        Back
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
                <span className="text-sm font-semibold text-gray-900">{session.student}</span>
                <span className="text-xs text-gray-400">•</span>
                <span className="text-sm text-gray-500">{session.university}</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 lg:flex-col">
              {isCompleted && session.feedbackStatus === "pending" && (
                <button
                  onClick={() => document.getElementById("feedback-section")?.scrollIntoView({ behavior: "smooth" })}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-tutor px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-700"
                >
                  <span className="material-icons-round text-lg">edit_note</span>
                  Submit Feedback
                </button>
              )}
              <Link
                to={session.chatUserId ? `/tutor/dashboard/messages?user=${session.chatUserId}&name=${encodeURIComponent(session.student)}` : "/tutor/dashboard/messages"}
                className="inline-flex items-center gap-2 rounded-xl border-2 border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:border-tutor hover:text-tutor"
              >
                <span className="material-icons-round text-lg">chat</span>
                Message Student
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
          <section id="feedback-section" className="rounded-3xl border border-gray-100 bg-white p-6 shadow-soft">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-display font-bold text-gray-900">Feedback Status</h2>
                <p className="text-sm text-gray-500">Track whether the student session evaluation still needs your attention.</p>
              </div>
              <FeedbackStatusPill
                submitted={session.feedbackStatus !== "pending" || submittedFeedback}
                label={session.feedbackStatus !== "pending" || submittedFeedback ? "Your evaluation submitted" : "Your evaluation pending"}
              />
            </div>
          </section>

          {isCompleted && (session.feedbackStatus === "pending" && !submittedFeedback) && (
            <SessionRatingForm
              title="Rate Your Student"
              subtitle="Use quick numeric ratings only. Written feedback is disabled to keep the process fast and objective."
              fields={TUTOR_RATING_FIELDS}
              ratings={ratings}
              onRate={handleRate}
              onSubmit={handleSubmitFeedback}
              submitLabel="Submit student rating"
              accent="tutor"
            />
          )}

          {isCompleted && (session.feedbackStatus !== "pending" || submittedFeedback) && (
            <section className="rounded-3xl border border-dashed border-gray-200 bg-white p-6 text-sm text-gray-500 shadow-soft">
              Your feedback rating for the student is locked for this completed session.
            </section>
          )}

          {session.notes && (
            <section className="rounded-3xl border border-gray-100 bg-white p-6 shadow-soft">
              <div className="mb-3 flex items-center gap-2">
                <span className="material-icons-round text-tutor">description</span>
                <h2 className="font-display text-xl font-bold text-gray-900">Session Notes</h2>
              </div>
              <p className="text-sm leading-relaxed text-gray-600">{session.notes}</p>
            </section>
          )}
        </div>

        <div className="space-y-6">
          <section className="rounded-3xl border border-gray-100 bg-white p-6 shadow-soft">
            <h2 className="text-xl font-display font-bold text-gray-900">Next Actions</h2>
            <div className="mt-4 flex flex-col gap-3">                {isUpcoming && (
              <button
                onClick={handleComplete}
                disabled={isCompleting}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-green-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-green-600/20 transition hover:-translate-y-0.5 hover:bg-green-700 disabled:opacity-50"
              >
                <span className="material-icons-round text-lg">check_circle</span>
                {isCompleting ? "Completing..." : "Mark as Completed"}
              </button>
            )}              {isUpcoming && session.format === "online" && session.meetingLink && (
              <a
                href={session.meetingLink}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-tutor px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-tutor/20 transition hover:-translate-y-0.5 hover:bg-teal-700"
              >
                <span className="material-icons-round text-lg">videocam</span>
                Join Session
              </a>
            )}
              {isCompleted && (
                <Link
                  to="/tutor/dashboard/requests"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-tutor px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-tutor/20 transition hover:-translate-y-0.5 hover:bg-teal-700"
                >
                  <span className="material-icons-round text-lg">refresh</span>
                  View More Requests
                </Link>
              )}
              <Link
                to={session.chatUserId ? `/tutor/dashboard/messages?user=${session.chatUserId}&name=${encodeURIComponent(session.student)}` : "/tutor/dashboard/messages"}
                className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-tutor px-6 py-3 text-sm font-semibold text-tutor transition hover:bg-teal-50"
              >
                <span className="material-icons-round text-lg">chat</span>
                Message Student
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
                      onClick={() => navigate("/tutor/dashboard/sessions")}
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
                  to="/tutor/dashboard/requests"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-tutor px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-tutor/20 transition hover:bg-teal-700"
                >
                  <span className="material-icons-round text-lg">inbox</span>
                  Review Requests
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
