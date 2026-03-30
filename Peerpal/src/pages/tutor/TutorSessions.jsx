import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FeedbackStatusPill } from "../../components/feedback/FeedbackWidgets";
import { MatchesAPI } from "../../services/api";

const TABS = ["upcoming", "completed", "cancelled"];

const STATUS_STYLES = {
  confirmed: "bg-green-50 text-green-600",
  completed: "bg-teal-50 text-tutor",
  cancelled: "bg-gray-100 text-gray-500",
};

export default function TutorSessions() {
  const [activeTab, setActiveTab] = useState("upcoming");
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    MatchesAPI.getSessions()
      .then((data) => {
        if (isMounted) {
          const apiSessions = Array.isArray(data) ? data : [];
          // Map backend format to component expectations
          const formatted = apiSessions.map(s => {
            let tab = "upcoming";
            if (s.status === "completed") tab = "completed";
            else if (s.status === "cancelled" || s.status === "rejected") tab = "cancelled";

            return {
              id: s.id,
              tab,
              student: s.tuteeName || s.tutee_name || s.partner_name || "Unknown Student",
              subject: s.subject || "Subject",
              date: s.date ? new Date(s.date).toLocaleString() : "TBD",
              format: s.session_type || s.format || "online",
              status: s.status,
              feedbackStatus: s.feedback_status || "pending"
            };
          });
          setSessions(formatted);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch tutor sessions:", err);
        if (isMounted) setLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const filtered = sessions.filter((session) => session.tab === activeTab);

  if (loading) return <div className="p-8 text-center text-gray-500">Loading sessions...</div>;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-gray-900">My Sessions</h1>
        <p className="mt-1 text-gray-500">Manage active sessions and complete tutor-side feedback after each lesson.</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`${activeTab === tab ? "border-primary bg-primary text-white" : "border-gray-100 bg-white text-gray-600 hover:border-gray-200"} rounded-full border-2 px-5 py-2 text-sm font-semibold capitalize transition-all`}
          >
            {tab}
            <span className="ml-1.5 text-xs opacity-70">
              ({sessions.filter((session) => session.tab === tab).length})
            </span>
          </button>
        ))}
      </div>

      {filtered.length ? (
        <div className="space-y-3">
          {filtered.map((session) => (
            <article
              key={session.id}
              className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-xl border border-gray-100 bg-white p-4 shadow-soft"
            >
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-gray-900">{session.student}</h3>
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${session.status === "cancelled" ? "bg-red-50 text-red-700" : session.status === "completed" ? "bg-blue-50 text-blue-700" : session.status === "upcoming" ? "bg-green-50 text-green-700" : "bg-yellow-50 text-yellow-700"}`}
                  >
                    {session.status}
                  </span>
                </div>
                <p className="text-sm font-medium text-gray-900">{session.subject}</p>
                <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <span className="material-icons-round text-sm">schedule</span>
                    {session.date}
                  </span>
                  <span className="flex items-center gap-1 capitalize">
                    <span className="material-icons-round text-sm">videocam</span>
                    {session.format}
                  </span>
                </div>
              </div>

              <div className="flex w-full sm:w-auto flex-col items-stretch sm:items-end gap-2 shrink-0">
                {session.tab === "completed" ? (
                  <>
                    <FeedbackStatusPill status={session.feedbackStatus} role="tutor" />
                    {session.feedbackStatus === "pending" ? (
                      <Link
                        to={`/tutor/dashboard/sessions/${session.id}`}
                        className="w-full sm:w-auto text-center rounded-lg bg-tutor px-4 py-2 text-sm font-semibold text-white hover:bg-teal-700 transition"
                      >
                        Submit Feedback
                      </Link>
                    ) : (
                      <Link
                        to={`/tutor/dashboard/sessions/${session.id}`}
                        className="w-full sm:w-auto text-center rounded-lg border-2 border-tutor px-4 py-2 text-sm font-semibold text-tutor hover:bg-teal-50 transition"
                      >
                        View Record
                      </Link>
                    )}
                  </>
                ) : (
                  <Link
                    to={`/tutor/dashboard/sessions/${session.id}`}
                    className="w-full sm:w-auto text-center rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition shadow-sm"
                  >
                    Manage Session
                  </Link>
                )}
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border-2 border-dashed border-gray-200 p-8 text-center bg-gray-50/50">
          <span className="material-icons-round text-gray-400 text-4xl mb-2">inbox</span>
          <p className="text-gray-500 font-medium">No {activeTab} sessions found.</p>
        </div>
      )}
    </div>
  );
}
