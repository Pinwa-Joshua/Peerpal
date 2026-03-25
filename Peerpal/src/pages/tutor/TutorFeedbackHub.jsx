import { Link } from "react-router-dom";
import { useFeedback } from "../../context/FeedbackContext";
import {
  DimensionBars,
  FeedbackStatusPill,
  MetricCard,
  StarsDisplay,
} from "../../components/feedback/FeedbackWidgets";

export default function TutorFeedbackHub() {
  const { getTutorSessions, tutorProfiles } = useFeedback();
  const sessions = getTutorSessions();
  const profile = tutorProfiles.find((entry) => entry.id === 201);
  const completedSessions = sessions.filter((session) => session.tab === "completed");
  const pending = completedSessions.filter((session) => !session.feedback.tutor);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-gray-900">
            Tutor Feedback Desk
          </h1>
          <p className="mt-1 text-gray-500">
            Review students, store session notes, and monitor the ratings shaping your visibility.
          </p>
        </div>
        <div className="rounded-2xl border border-teal-100 bg-teal-50 px-4 py-3 text-sm text-teal-700">
          Higher-rated tutors rise in marketplace ranking through the visibility score below.
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <MetricCard
          label="Pending Tutor Reviews"
          value={pending.length}
          helper="Completed sessions waiting on your feedback."
          tone="amber"
        />
        <MetricCard
          label="Public Rating"
          value={`${profile?.rating || 0}/5`}
          helper={`${profile?.reviews || 0} student review${profile?.reviews === 1 ? "" : "s"}`}
          tone="teal"
        />
        <MetricCard
          label="Visibility Score"
          value={profile?.visibilityScore || 0}
          helper="Used in tutor ranking and matching priority."
          tone="blue"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-3xl border border-gray-100 bg-white p-6 shadow-soft">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-display font-bold text-gray-900">Session Review Pipeline</h2>
              <p className="text-sm text-gray-500">Every completed session expects a tutor-side review.</p>
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
                      label={session.feedback.tutor ? "Your review submitted" : "Tutor review pending"}
                    />
                    <FeedbackStatusPill
                      submitted={!!session.feedback.student}
                      label={session.feedback.student ? "Student review received" : "Student review pending"}
                    />
                  </div>
                </div>

                <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-sm text-gray-600">
                    Add engagement ratings, strengths, weaknesses, study advice, and flag issues if needed.
                  </p>
                  <Link
                    to={`/tutor/dashboard/sessions/${session.id}`}
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-tutor px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-tutor/20 transition hover:-translate-y-0.5 hover:bg-teal-700"
                  >
                    <span className="material-icons-round text-lg">fact_check</span>
                    {session.feedback.tutor ? "View feedback" : "Submit review"}
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>

        <div className="space-y-6">
          <section className="rounded-3xl border border-gray-100 bg-white p-6 shadow-soft">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-display font-bold text-gray-900">Public Tutor Profile</h2>
                <p className="text-sm text-gray-500">Average ratings shown on your profile and used in matching.</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-black text-gray-900">{profile?.rating || 0}</p>
                <StarsDisplay value={profile?.rating || 0} />
              </div>
            </div>

            <div className="mt-5">
              <DimensionBars metrics={profile?.dimensions || {}} accent="bg-tutor" />
            </div>
          </section>

          <section className="rounded-3xl border border-gray-100 bg-white p-6 shadow-soft">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-display font-bold text-gray-900">Recent Student Reviews</h2>
                <p className="text-sm text-gray-500">Anonymous reviews remain anonymous on your public history.</p>
              </div>
            </div>

            <div className="mt-5 space-y-4">
              {profile?.recentReviews?.map((review) => (
                <article key={review.id} className="rounded-2xl border border-gray-100 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-gray-900">{review.authorName}</p>
                      <p className="text-sm text-gray-500">{review.sessionSubject}</p>
                    </div>
                    <div className="text-right">
                      <StarsDisplay value={review.overallRating} size="text-sm" />
                      <p className="mt-1 text-xs text-gray-400">
                        {new Date(review.submittedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-gray-600">{review.comment}</p>
                </article>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
