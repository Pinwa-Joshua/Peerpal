import { Link } from "react-router-dom";
import { useFeedback } from "../../context/FeedbackContext";
import {
  DimensionBars,
  FeedbackStatusPill,
  MetricCard,
  StarsDisplay,
} from "../../components/feedback/FeedbackWidgets";

export default function FeedbackHub() {
  const { getStudentSessions, studentProfile } = useFeedback();
  const sessions = getStudentSessions();
  const completedSessions = sessions.filter((session) => session.tab === "completed");
  const pending = completedSessions.filter((session) => !session.feedback.student);
  const submitted = completedSessions.filter((session) => session.feedback.student);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-gray-900">
            Feedback Center
          </h1>
          <p className="mt-1 text-gray-500">
            Track session reviews, reflections, and the feedback tutors leave for you.
          </p>
        </div>
        <div className="rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-700">
          Two-way feedback is locked per session. Once you submit, the form cannot be sent again.
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <MetricCard
          label="Pending Reviews"
          value={pending.length}
          helper="Completed sessions still waiting on your feedback."
          tone="amber"
        />
        <MetricCard
          label="Tutor Rating"
          value={`${studentProfile.rating || 0}/5`}
          helper={`${studentProfile.reviews} tutor review${studentProfile.reviews === 1 ? "" : "s"} received`}
          tone="teal"
        />
        <MetricCard
          label="Submitted"
          value={submitted.length}
          helper="Student reviews already attached to completed sessions."
          tone="blue"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <section className="rounded-3xl border border-gray-100 bg-white p-6 shadow-soft">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-display font-bold text-gray-900">Session Feedback Queue</h2>
              <p className="text-sm text-gray-500">Completed sessions and their two-way submission status.</p>
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
                      Session #{session.id} • {session.date}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <FeedbackStatusPill
                      submitted={!!session.feedback.student}
                      label={session.feedback.student ? "Your review submitted" : "You still need to review"}
                    />
                    <FeedbackStatusPill
                      submitted={!!session.feedback.tutor}
                      label={session.feedback.tutor ? "Tutor responded" : "Tutor response pending"}
                    />
                  </div>
                </div>

                <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="text-sm text-gray-600">
                    {session.feedback.student ? (
                      <span>Your reflection is now stored on {session.tutor}'s profile history.</span>
                    ) : (
                      <span>Submit your rating, review, learning reflection, and any issue report.</span>
                    )}
                  </div>
                  <Link
                    to={`/dashboard/sessions/${session.id}`}
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition hover:-translate-y-0.5 hover:bg-blue-800"
                  >
                    <span className="material-icons-round text-lg">rate_review</span>
                    {session.feedback.student ? "View feedback" : "Leave feedback"}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="space-y-6">
          <section className="rounded-3xl border border-gray-100 bg-white p-6 shadow-soft">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-display font-bold text-gray-900">How Tutors Rate You</h2>
                <p className="text-sm text-gray-500">Profile history used to track your readiness and engagement.</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-black text-gray-900">{studentProfile.rating || 0}</p>
                <StarsDisplay value={studentProfile.rating || 0} />
              </div>
            </div>

            <div className="mt-5">
              <DimensionBars metrics={studentProfile.dimensions} accent="bg-tutor" />
            </div>
          </section>

          <section className="rounded-3xl border border-gray-100 bg-white p-6 shadow-soft">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-display font-bold text-gray-900">Received Feedback</h2>
                <p className="text-sm text-gray-500">Notes and recommendations from tutors after sessions.</p>
              </div>
            </div>

            <div className="mt-5 space-y-4">
              {studentProfile.receivedFeedback.length ? (
                studentProfile.receivedFeedback.map((entry) => (
                  <article key={entry.id} className="rounded-2xl border border-gray-100 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold text-gray-900">{entry.sessionSubject}</p>
                        <p className="text-sm text-gray-500">{entry.counterpartName}</p>
                      </div>
                      <div className="text-right">
                        <StarsDisplay value={entry.overallRating} size="text-sm" />
                        <p className="mt-1 text-xs text-gray-400">
                          {new Date(entry.submittedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <p className="mt-3 text-sm leading-relaxed text-gray-600">{entry.comment}</p>
                    <div className="mt-3 rounded-2xl bg-teal-50 px-4 py-3 text-sm text-teal-800">
                      <span className="font-semibold">Recommendation:</span> {entry.recommendation}
                    </div>
                  </article>
                ))
              ) : (
                <div className="rounded-2xl border border-dashed border-gray-200 p-8 text-center text-sm text-gray-500">
                  No tutor feedback yet.
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
