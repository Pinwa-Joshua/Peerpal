import { useState } from "react";
import { Link } from "react-router-dom";
import { useFeedback } from "../../context/FeedbackContext";
import { FeedbackStatusPill } from "../../components/feedback/FeedbackWidgets";

const TABS = ["upcoming", "completed", "cancelled"];

const STATUS_STYLES = {
  confirmed: "bg-green-50 text-green-600",
  completed: "bg-teal-50 text-tutor",
  cancelled: "bg-gray-100 text-gray-500",
};

export default function TutorSessions() {
  const [activeTab, setActiveTab] = useState("upcoming");
  const { getTutorSessions } = useFeedback();
  const sessions = getTutorSessions();
  const filtered = sessions.filter((session) => session.tab === activeTab);

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
            className={`rounded-full border-2 px-5 py-2 text-sm font-semibold capitalize transition-all ${
              activeTab === tab
                ? "border-tutor bg-tutor text-white"
                : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
            }`}
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
              className="rounded-2xl border border-gray-100 bg-white p-5 shadow-soft transition hover:shadow-lg"
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
                <div className="flex min-w-0 flex-1 items-center gap-3">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br ${session.gradient} font-bold text-white`}
                  >
                    {session.initials}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-gray-900">{session.student}</p>
                    <p className="text-sm text-gray-500">{session.subject}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-sm text-gray-500">
                  <span className="material-icons-round text-base">schedule</span>
                  {session.date} • {session.time}
                </div>

                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${
                    session.format === "online" ? "bg-green-50 text-green-600" : "bg-orange-50 text-orange-600"
                  }`}
                >
                  {session.format}
                </span>

                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${STATUS_STYLES[session.status]}`}
                >
                  {session.status}
                </span>

                {session.tab === "completed" && (
                  <FeedbackStatusPill
                    submitted={!!session.feedback.tutor}
                    label={session.feedback.tutor ? "Review sent" : "Review needed"}
                  />
                )}

                <div className="flex-shrink-0">
                  <Link
                    to={`/tutor/dashboard/sessions/${session.id}`}
                    className={`inline-block rounded-xl px-5 py-2 text-sm font-semibold transition ${
                      session.tab === "upcoming"
                        ? "bg-tutor text-white shadow-sm hover:bg-teal-700"
                        : session.tab === "completed" && !session.feedback.tutor
                          ? "border-2 border-tutor text-tutor hover:bg-teal-50"
                          : "text-tutor hover:underline"
                    }`}
                  >
                    {session.tab === "upcoming"
                      ? session.format === "online"
                        ? "Start"
                        : "Details"
                      : session.tab === "completed" && !session.feedback.tutor
                        ? "Submit Review"
                        : "View Details"}
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-gray-100 bg-white p-12 text-center shadow-soft">
          <span className="material-icons-round mb-3 block text-5xl text-gray-300">
            {activeTab === "upcoming" ? "event_busy" : activeTab === "completed" ? "task_alt" : "cancel"}
          </span>
          <p className="mb-1 font-semibold text-gray-500">No {activeTab} sessions</p>
          <p className="text-sm text-gray-400">
            {activeTab === "upcoming"
              ? "Accept requests to start your next session."
              : `Your ${activeTab} sessions will appear here.`}
          </p>
          {activeTab === "upcoming" && (
            <Link
              to="/tutor/dashboard/requests"
              className="mt-4 inline-flex items-center gap-2 rounded-full bg-tutor px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-tutor/20 transition hover:bg-teal-700"
            >
              <span className="material-icons-round text-lg">inbox</span>
              View Requests
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
