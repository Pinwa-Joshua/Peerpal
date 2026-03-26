import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { MatchesAPI } from "../../services/api";
import {
  FeedbackStatusPill,
  MetricCard,
} from "../../components/feedback/FeedbackWidgets";

export default function TutorFeedbackHub() {
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
                student: s.tutee_name || `Student ${s.tutee_id}`,
                topic: "Session",
                date: new Date(s.date).toLocaleDateString()
            };
        });
        setCompletedSessions(completed);
      } catch (err) {
        console.error("Error fetching sessions for tutor feedback hub:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSessions();
  }, []);

  const pending = completedSessions.filter((session) => !session.feedback.tutor);
  const submitted = completedSessions.filter((session) => session.feedback.tutor);

  if (loading) {
     return <div className="max-w-7xl mx-auto py-20 text-center text-gray-500">Loading Evaluation Center...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-gray-900">
            Evaluation Center
          </h1>
          <p className="mt-1 text-gray-500">
            Evaluate your students to help them improve. Ratings remain private
            between users.
          </p>
        </div>
        <div className="rounded-2xl border border-teal-100 bg-teal-50 px-4 py-3 text-sm text-teal-800">
          Evaluations are private. You only see your submission state.
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <MetricCard
          label="Pending Evaluations"
          value={pending.length}
          helper="Past sessions missing your student evaluation."
          tone="amber"
        />
        <MetricCard
          label="Submitted"
          value={submitted.length}
          helper="Locked evaluations submitted for your students."
          tone="teal"
        />
        <MetricCard
          label="Completed Sessions"
          value={completedSessions.length}
          helper="Total past sessions eligible for review."
          tone="blue"
        />
      </div>

      <section className="rounded-3xl border border-gray-100 bg-white p-6 shadow-soft">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-display font-bold text-gray-900">
              Recent Sessions
            </h2>
            <p className="text-sm text-gray-500">
              Completed sessions and private evaluation status.
            </p>
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
                  <h3 className="text-lg font-bold text-gray-900">
                    {session.subject}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {session.topic} with {session.student}
                  </p>
                  <p className="mt-2 text-xs font-medium uppercase tracking-[0.18em] text-gray-400">
                    Session #{session.id} &bull; {session.date}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <FeedbackStatusPill
                    submitted={!!session.feedback.tutor}
                    label={
                      session.feedback.tutor
                        ? "Your evaluation submitted"
                        : "Your evaluation pending"
                    }
                  />
                  <FeedbackStatusPill
                    submitted={!!session.feedback.student}
                    label={
                      session.feedback.student
                        ? "Student submitted privately"
                        : "Student pending"
                    }
                  />
                </div>
              </div>

              <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="text-sm text-gray-600">
                  {session.feedback.tutor ? (
                    <span>
                      Your private evaluation is securely stored. Thank you.
                    </span>
                  ) : (
                    <span>
                      Evaluate your student's progress and understanding.
                    </span>
                  )}
                </div>
                <Link
                  to={`/tutor/dashboard/sessions/${session.id}`}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-tutor px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-teal-700/20 transition hover:-translate-y-0.5 hover:bg-teal-700"
                >
                  <span className="material-icons-round text-lg">
                    edit_note
                  </span>
                  {session.feedback.tutor
                    ? "View Evaluation"
                    : "Evaluate Student"}
                </Link>
              </div>
            </div>
          ))}
          {completedSessions.length === 0 && (
            <div className="text-center text-gray-500 py-10">
                No completed sessions found. Complete a tutoring session to submit evaluations.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}


