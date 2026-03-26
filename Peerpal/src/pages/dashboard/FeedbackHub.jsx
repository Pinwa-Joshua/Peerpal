import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { MatchesAPI } from "../../services/api";
import {
  FeedbackStatusPill,
  MetricCard,
} from "../../components/feedback/FeedbackWidgets";

export default function FeedbackHub() {
  const [completedSessions, setCompletedSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const resp = await MatchesAPI.getSessions();
        const allSessions = Array.isArray(resp) ? resp : [];
        const completed = allSessions.filter(s => s.status === "completed" || s.tab === "completed").map(s => {
          return {
            ...s,
            feedback: {
              student: s.feedback_status !== "pending",
              tutor: s.feedback_status !== "pending"
            },
            subject: s.subject || "Subject",
            tutor: s.tutor_name || `Tutor ${s.tutor_id}`,
            topic: "Session",
            date: new Date(s.date).toLocaleDateString()
          };
        });
        setCompletedSessions(completed);
      } catch (err) {
        console.error("Error fetching sessions for feedback hub:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSessions();
  }, []);

  const pending = completedSessions.filter((session) => !session.feedback.student);
  const submitted = completedSessions.filter((session) => session.feedback.student);

  if (loading) {
    return <div className="max-w-7xl mx-auto py-20 text-center text-gray-500">Loading Rating Center...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-gray-900">
            Rating Center
          </h1>
          <p className="mt-1 text-gray-500">
            Submit your private session ratings without seeing the tutor's rating.
          </p>
        </div>
        <div className="rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-700">
          Ratings stay private between sides. You can only see your own submission state.
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <MetricCard
          label="Pending Ratings"
          value={pending.length}
          helper="Completed sessions still waiting on your private rating."
          tone="amber"
        />
        <MetricCard
          label="Submitted"
          value={submitted.length}
          helper="Your learner ratings already locked for completed sessions."
          tone="blue"
        />
        <MetricCard
          label="Completed Sessions"
          value={completedSessions.length}
          helper="Sessions eligible for independent rating."
          tone="teal"
        />
      </div>

      <section className="rounded-3xl border border-gray-100 bg-white p-6 shadow-soft">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-display font-bold text-gray-900">Session Rating Queue</h2>
            <p className="text-sm text-gray-500">Completed sessions and private submission status for both sides.</p>
          </div>
          <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600">
            {completedSessions.length} completed
          </span>
        </div>

        <div className="mt-5 space-y-4">
          {completedSessions.map((session) => (
            <div
              key={session.id}
              className="rounded-2xl border border-gray-100 bg-gray-50/70 p-5"
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{session.subject}</h3>
                  <p className="text-sm text-gray-500">
                    {session.topic} with {session.tutor}
                  </p>
                  <p className="mt-2 text-xs font-medium uppercase tracking-[0.18em] text-gray-400">
                    Session #{session.id} &bull; {session.date}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <FeedbackStatusPill
                    submitted={!!session.feedback.student}
                    label={session.feedback.student ? "Your rating submitted" : "Your rating pending"}
                  />
                  <FeedbackStatusPill
                    submitted={!!session.feedback.tutor}
                    label={session.feedback.tutor ? "Tutor submitted privately" : "Tutor pending"}
                  />
                </div>
              </div>

              <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="text-sm text-gray-600">
                  {session.feedback.student ? (
                    <span>Your private learner rating is stored for this session.</span>
                  ) : (
                    <span>Submit your 1 to 5 star ratings for this completed session.</span>
                  )}
                </div>
                <Link
                  to={`/dashboard/sessions/${session.id}`}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition hover:-translate-y-0.5 hover:bg-blue-800"
                >
                  <span className="material-icons-round text-lg">rate_review</span>
                  {session.feedback.student ? "View your rating" : "Leave rating"}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
