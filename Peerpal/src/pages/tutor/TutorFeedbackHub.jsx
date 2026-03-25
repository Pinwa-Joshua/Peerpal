import { Link } from "react-router-dom";
import { useFeedback } from "../../context/FeedbackContext";
import {
  FeedbackStatusPill,
  MetricCard,
} from "../../components/feedback/FeedbackWidgets";

export default function TutorFeedbackHub() {
  const { getTutorSessions } = useFeedback();
  const sessions = getTutorSessions();
  const completedSessions = sessions.filter((session) => session.tab === "completed");
  const pending = completedSessions.filter((session) => !session.feedback.tutor);
  const submitted = completedSessions.filter((session) => session.feedback.tutor);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-gray-900">
            Tutor Rating Desk
          </h1>
          <p className="mt-1 text-gray-500">
            Submit your private learner ratings without seeing the learner&apos;s rating.
          </p>
        </div>
        <div className="rounded-2xl border border-teal-100 bg-teal-50 px-4 py-3 text-sm text-teal-700">
          Ratings stay private between sides. You can only see your own submission state.
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <MetricCard
          label="Pending Ratings"
          value={pending.length}
          helper="Completed sessions waiting on your private tutor rating."
          tone="amber"
        />
        <MetricCard
          label="Submitted"
          value={submitted.length}
          helper="Tutor-side ratings already locked for completed sessions."
          tone="teal"
        />
        <MetricCard
          label="Completed Sessions"
          value={completedSessions.length}
          helper="Sessions eligible for independent rating."
          tone="blue"
        />
      </div>

      <section className="rounded-3xl border border-gray-100 bg-white p-6 shadow-soft">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-display font-bold text-gray-900">Session Rating Pipeline</h2>
            <p className="text-sm text-gray-500">Completed sessions and private submission status for both sides.</p>
          </div>
        </div>

        <div className="mt-5 space-y-4">
          {completedSessions.map((session) => (
            <article key={session.id} className="rounded-2xl border border-gray-100 bg-gray-50/70 p-5">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{session.subject}</h3>
                  <p className="text-sm text-gray-500">
                    {session.student} • {session.topic}
                  </p>
                  <p className="mt-2 text-xs font-medium uppercase tracking-[0.18em] text-gray-400">
                    Session #{session.id} • {session.date}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <FeedbackStatusPill
                    submitted={!!session.feedback.tutor}
                    label={session.feedback.tutor ? "Your rating submitted" : "Your rating pending"}
                  />
                  <FeedbackStatusPill
                    submitted={!!session.feedback.student}
                    label={session.feedback.student ? "Learner submitted privately" : "Learner pending"}
                  />
                </div>
              </div>

              <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-gray-600">
                  {session.feedback.tutor ? "Your private tutor rating is stored for this session." : "Submit the quick 1 to 5 learner rating when the session is complete."}
                </p>
                <Link
                  to={`/tutor/dashboard/sessions/${session.id}`}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-tutor px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-tutor/20 transition hover:-translate-y-0.5 hover:bg-teal-700"
                >
                  <span className="material-icons-round text-lg">fact_check</span>
                  {session.feedback.tutor ? "View your rating" : "Submit rating"}
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
