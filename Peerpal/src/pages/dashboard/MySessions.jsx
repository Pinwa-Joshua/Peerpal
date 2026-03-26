import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FeedbackStatusPill } from "../../components/feedback/FeedbackWidgets";
import { MatchesAPI } from "../../services/api";

const TABS = ["upcoming", "completed", "cancelled"];

const STATUS_STYLES = {
  upcoming: "bg-blue-50 text-blue-600",
  confirmed: "bg-green-50 text-green-600",
  pending: "bg-yellow-50 text-yellow-600",
  completed: "bg-blue-50 text-primary",
  cancelled: "bg-gray-100 text-gray-500",
};

export default function MySessions() {
  const [activeTab, setActiveTab] = useState("upcoming");
  const [sessionsData, setSessionsData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    // MatchesAPI.getSessions could be used if getMySessions is redundant, but let's use getSessions()
    MatchesAPI.getSessions()
      .then((data) => {
        if (isMounted) {
          const raw = Array.isArray(data) ? data : [];
          const formatted = raw.map(s => {
             let tab = "upcoming";
             if (s.status === "completed") tab = "completed";
             else if (s.status === "cancelled" || s.status === "rejected") tab = "cancelled";

             const tutorName = s.tutor_name || `Tutor ${s.tutor_id}`;
             const nameParts = tutorName.split(" ");
             const computedInitials =
               nameParts.length > 1
                 ? nameParts[0][0] + nameParts[1][0]
                 : nameParts[0].substring(0, 2);

             return {
                 id: s.id,
                 tab,
                 tutorName: tutorName,
                 initials: computedInitials,
                 gradient: "from-blue-500 to-indigo-600",
                 subject: s.subject || "General Session",
                 date: new Date(s.date).toLocaleString(),
                 format: s.session_type || "online",
                 status: s.status,
                 feedbackStatus: s.feedback_status || "none",
             };
          });
          setSessionsData(formatted);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch sessions:", err);
        if (isMounted) setLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const filteredSessions = sessionsData.filter((session) => session.tab === activeTab);

  if (loading) {
     return <div className="p-8 text-center text-gray-500">Loading your sessions...</div>;
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-gray-900">
          My Sessions
        </h1>
        <p className="mt-1 text-gray-500">
          View your upcoming calendar and past lesson history.
        </p>
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
              ({sessionsData.filter((s) => s.tab === tab).length})
            </span>
          </button>
        ))}
      </div>

      {filteredSessions.length > 0 ? (
        <div className="space-y-3">
          {filteredSessions.map((session) => (
            <Link
              key={session.id}
              to={`/dashboard/sessions/${session.id}`}
              className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-xl border border-gray-100 bg-white p-4 shadow-soft hover:shadow-md hover:-translate-y-0.5 transition-all w-full text-left"
            >
              <div className="flex items-center gap-4">
                <div
                  className={`w-12 h-12 rounded-full bg-gradient-to-br ${session.gradient || "from-blue-500 to-indigo-600"} flex items-center justify-center text-white font-bold flex-shrink-0`}
                >
                  {session.initials}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <h3 className="font-semibold text-gray-900">
                      {session.tutorName}
                    </h3>
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${session.status === "cancelled" ? "bg-red-50 text-red-700" : session.status === "completed" ? "bg-blue-50 text-blue-700" : session.status === "upcoming" ? "bg-green-50 text-green-700" : "bg-yellow-50 text-yellow-700"}`}
                    >
                      {session.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">{session.subject}</p>
                  <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <span className="material-icons-round text-sm">
                        schedule
                      </span>
                      {session.date}
                    </span>
                    <span className="flex items-center gap-1 capitalize">
                      <span className="material-icons-round text-sm">
                        videocam
                      </span>
                      {session.format}
                    </span>
                  </div>
                </div>
              </div>

              <div className="w-full sm:w-auto mt-2 sm:mt-0 pt-3 sm:pt-0 border-t sm:border-0 border-gray-50 flex flex-col items-end gap-2">
                {session.tab === "completed" && (
                  <FeedbackStatusPill
                    status={session.feedbackStatus}
                    role="student"
                  />
                )}
                <span className="text-sm font-semibold text-primary group-hover:text-blue-800 transition-colors inline-flex items-center gap-1">
                  View Details
                  <span className="material-icons-round text-sm">
                    chevron_right
                  </span>
                </span>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border-2 border-dashed border-gray-200 p-8 text-center bg-gray-50/50">
          <span className="material-icons-round text-gray-400 text-4xl mb-2">
            calendar_today
          </span>
          <p className="text-gray-500 font-medium">
            No {activeTab} sessions found.
          </p>
          {activeTab === "upcoming" && (
            <Link
              to="/dashboard/browse"
              className="inline-block mt-4 text-sm font-semibold text-primary hover:underline"
            >
              Browse tutors to book a session
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
