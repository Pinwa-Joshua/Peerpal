import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { FeedbackStatusPill } from "../../components/feedback/FeedbackWidgets";
import { MatchesAPI } from "../../services/api";

const STATUS_CFG = {
  confirmed: { bg: "bg-green-50", text: "text-green-700", dot: "bg-green-500", label: "Confirmed" },
  pending: { bg: "bg-yellow-50", text: "text-yellow-700", dot: "bg-yellow-500", label: "Pending" },
  completed: { bg: "bg-blue-50", text: "text-tutor", dot: "bg-tutor", label: "Completed" },
  cancelled: { bg: "bg-red-50", text: "text-red-600", dot: "bg-red-500", label: "Cancelled" },
};

export default function TutorSessionDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
     const fetchSession = async () => {
         try {
             // We fallback to getSessions() and filter for now instead of mock context.
             const sessionsResp = await MatchesAPI.getSessions();
             const sessions = Array.isArray(sessionsResp) ? sessionsResp : [];
             const found = sessions.find(s => String(s.id) === String(id));
             
             if (found) {
                // Map it roughly to the legacy UI expectations
                let tab = "upcoming";
                if (found.status === "completed") tab = "completed";
                else if (found.status === "cancelled" || found.status === "rejected") tab = "cancelled";

                const uiSession = {
                    ...found,
                    tab,
                    student: found.tutee_name || `Student ${found.tutee_id}`,
                    subject: found.subject || "Subject",
                    format: found.session_type || "online",
                    date: new Date(found.date).toLocaleString(),
                    feedbackStatus: found.feedback_status || "pending",
                    duration: found.duration || 1
                };
                setSession(uiSession);
             }
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

  const st = STATUS_CFG[session.tab === "cancelled" ? "cancelled" : (session.status === "upcoming" ? "confirmed" : session.status)] || STATUS_CFG.pending;
  const isUpcoming = session.tab === "upcoming";
  const isCompleted = session.tab === "completed";

  return (
    <div className="max-w-3xl mx-auto pb-10">
      <div className="mb-6">
        <button
          onClick={() => navigate(-1)}
          className="group inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-gray-900 transition-colors"
        >
          <span className="material-icons-round text-lg group-hover:-translate-x-1 transition-transform">
            arrow_back
          </span>
          Back
        </button>
      </div>

      <div className="space-y-6">
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-soft sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
            <div className="flex gap-4">
              <div
                className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${statusColors[session.status] || "from-gray-400 to-gray-500"} text-xl font-bold text-white shadow-inner`}
              >
                {session.initials || "S"}
              </div>
              <div>
                <div className="mb-2 flex items-center gap-3">
                  <h1 className="text-2xl font-display font-extrabold text-gray-900">
                    {session.subject}
                  </h1>
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${st.color}`}
                  >
                    <span className={`h-1.5 w-1.5 rounded-full ${st.dotColor}`}></span>
                    {st.label}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-500">
                  <div className="flex items-center gap-1.5">
                    <span className="material-icons-round text-base">person</span>
                    Student: <span className="font-semibold text-gray-900">{session.tutee_name || `Student ${session.tutee_id}`}</span>
                  </div>
                  <span className="hidden sm:block">&bull;</span>
                  <div className="flex items-center gap-1.5">
                    <span className="material-icons-round text-base">videocam</span>
                    {session.session_type || "Online"}
                  </div>
                </div>
              </div>
            </div>

            {session.status === "completed" && !session.feedback_submitted && ( 
              <div className="mt-4 sm:mt-0">
                <Link
                  to={`/tutor/sessions/${session.id}/feedback`}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-tutor px-6 py-3 font-semibold text-white shadow-sm transition hover:bg-teal-700"
                >
                  Submit Feedback Now
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
