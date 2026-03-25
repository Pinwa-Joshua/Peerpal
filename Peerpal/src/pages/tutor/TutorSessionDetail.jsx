import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useFeedback } from "../../context/FeedbackContext";
import {
  FeedbackStatusPill,
  StarRatingInput,
  StarsDisplay,
} from "../../components/feedback/FeedbackWidgets";

const STATUS_CFG = {
  confirmed: { bg: "bg-green-50", text: "text-green-700", dot: "bg-green-500", label: "Confirmed" },
  completed: { bg: "bg-teal-50", text: "text-tutor", dot: "bg-tutor", label: "Completed" },
  cancelled: { bg: "bg-red-50", text: "text-red-600", dot: "bg-red-500", label: "Cancelled" },
};

const reportOptions = [
  { value: "", label: "No issue to report" },
  { value: "no-show", label: "Student no-show" },
  { value: "poor-behavior", label: "Poor behavior" },
  { value: "late-payment", label: "Late payment concern" },
];

export default function TutorSessionDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getSessionByRole, submitFeedback, studentProfile } = useFeedback();
  const session = getSessionByRole("tutor", Number(id));

  const [notes, setNotes] = useState(session?.notes || "");
  const [form, setForm] = useState({
    ratings: {
      engagement: 0,
      preparedness: 0,
      participation: 0,
    },
    comment: "",
    topicsCovered: "",
    strengths: "",
    weaknesses: "",
    recommendation: "",
    anonymous: false,
    flagType: "",
    flagDetails: "",
  });
  const [status, setStatus] = useState({ type: "", message: "" });
  const [showCancel, setShowCancel] = useState(false);

  if (!session) {
    return (
      <div className="max-w-3xl mx-auto py-20 text-center">
        <span className="material-icons-round mb-4 block text-6xl text-gray-300">event_busy</span>
        <h2 className="mb-2 text-xl font-display font-bold text-gray-900">Session not found</h2>
        <p className="mb-6 text-gray-500">This session may have been removed or does not exist.</p>
        <Link
          to="/tutor/dashboard/sessions"
          className="inline-flex items-center gap-2 rounded-full bg-tutor px-6 py-3 font-semibold text-white shadow-lg shadow-tutor/20 transition hover:bg-teal-700"
        >
          <span className="material-icons-round text-lg">arrow_back</span>
          Back to Sessions
        </Link>
      </div>
    );
  }

  const st = STATUS_CFG[session.status];
  const isUpcoming = session.tab === "upcoming";
  const isCompleted = session.tab === "completed";
  const isCancelled = session.tab === "cancelled";
  const studentFeedback = session.feedback.student;
  const tutorFeedback = session.feedback.tutor;
  const canSubmit = Object.values(form.ratings).every((value) => value > 0);

  const handleSubmit = () => {
    try {
      submitFeedback({
        sessionId: session.id,
        role: "tutor",
        payload: {
          ratings: form.ratings,
          comment: form.comment,
          anonymous: form.anonymous,
          recommendation: form.recommendation,
          sessionNotes: {
            topicsCovered: form.topicsCovered,
            strengths: form.strengths,
            weaknesses: form.weaknesses,
          },
          flag: form.flagType
            ? { type: form.flagType, details: form.flagDetails }
            : null,
        },
      });
      setStatus({ type: "success", message: "Tutor feedback submitted and locked for this session." });
    } catch (error) {
      setStatus({ type: "error", message: error.message });
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <button
        onClick={() => navigate("/tutor/dashboard/sessions")}
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-500 transition hover:text-tutor group"
      >
        <span className="material-icons-round text-lg transition-transform group-hover:-translate-x-0.5">
          arrow_back
        </span>
        Back to My Sessions
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
                <span className="text-xs text-gray-400">•</span>
                <span className="text-sm text-gray-500">{session.year}</span>
                {session.studentId === studentProfile.id && (
                  <>
                    <span className="text-xs text-gray-400">•</span>
                    <span className="flex items-center gap-1 text-sm text-gray-500">
                      <span className="font-semibold text-gray-900">{studentProfile.rating}</span>
                      <StarsDisplay value={studentProfile.rating} size="text-sm" />
                    </span>
                  </>
                )}
              </div>
            </div>
            <div className="flex flex-wrap gap-2 lg:flex-col">
              <Link
                to="/tutor/dashboard/messages"
                className="inline-flex items-center gap-2 rounded-xl border-2 border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:border-tutor hover:text-tutor"
              >
                <span className="material-icons-round text-lg">chat</span>
                Message
              </Link>
              <Link
                to="/tutor/dashboard/feedback"
                className="inline-flex items-center gap-2 rounded-xl border-2 border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:border-tutor hover:text-tutor"
              >
                <span className="material-icons-round text-lg">insights</span>
                Feedback desk
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <InfoCard icon="calendar_today" tone="teal" label="Date & Time" value={session.date} helper={session.time} />
        <InfoCard icon="timer" tone="purple" label="Duration" value={session.duration} />
        <InfoCard
          icon={session.format === "online" ? "videocam" : "location_on"}
          tone={session.format === "online" ? "green" : "orange"}
          label="Format"
          value={session.format}
          helper={session.location || "Meeting link available"}
        />
        <InfoCard
          icon="payments"
          tone="emerald"
          label="Earnings"
          value={`N${session.rate}`}
          helper={session.paid ? "Paid" : "Pending payment"}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          <section className="rounded-3xl border border-gray-100 bg-white p-6 shadow-soft">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-display font-bold text-gray-900">Two-Way Feedback Status</h2>
                <p className="text-sm text-gray-500">Both student and tutor feedback remain independent for every completed session.</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <FeedbackStatusPill
                  submitted={!!tutorFeedback}
                  label={tutorFeedback ? "Your review sent" : "Your review pending"}
                />
                <FeedbackStatusPill
                  submitted={!!studentFeedback}
                  label={studentFeedback ? "Student review received" : "Student review pending"}
                />
              </div>
            </div>
          </section>

          {session.studentNote && (
            <section className="rounded-3xl border border-gray-100 bg-white p-6 shadow-soft">
              <div className="mb-3 flex items-center gap-2">
                <span className="material-icons-round text-blue-500">chat_bubble</span>
                <h2 className="font-display text-xl font-bold text-gray-900">Student Note</h2>
              </div>
              <p className="text-sm leading-relaxed text-gray-600">{session.studentNote}</p>
            </section>
          )}

          <section className="rounded-3xl border border-gray-100 bg-white p-6 shadow-soft">
            <div className="mb-3 flex items-center gap-2">
              <span className="material-icons-round text-tutor">description</span>
              <h2 className="font-display text-xl font-bold text-gray-900">Your Session Notes</h2>
            </div>
            {isUpcoming ? (
              <>
                <textarea
                  rows={4}
                  value={notes}
                  onChange={(event) => setNotes(event.target.value)}
                  placeholder="Add prep notes for this session."
                  className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-tutor focus:ring-2 focus:ring-tutor/20"
                />
                <button className="mt-3 text-sm font-semibold text-tutor hover:underline">Save Notes</button>
              </>
            ) : (
              <p className="text-sm leading-relaxed text-gray-600">{session.notes}</p>
            )}
          </section>

          {isCompleted && studentFeedback && (
            <FeedbackSummaryCard
              title="Student Review"
              accent="primary"
              entry={studentFeedback}
              extra={
                <div className="grid gap-3 md:grid-cols-2">
                  <ReflectionCard
                    label="Improved understanding"
                    value={studentFeedback.reflection?.improvedUnderstanding}
                  />
                  <ReflectionCard
                    label="Needs improvement"
                    value={studentFeedback.reflection?.needsImprovement}
                  />
                </div>
              }
            />
          )}

          {isCompleted && tutorFeedback && (
            <FeedbackSummaryCard
              title="Your Submitted Tutor Feedback"
              accent="tutor"
              entry={tutorFeedback}
              extra={
                <div className="grid gap-3 md:grid-cols-2">
                  <ReflectionCard label="Topics covered" value={tutorFeedback.sessionNotes?.topicsCovered} />
                  <ReflectionCard label="Study advice" value={tutorFeedback.recommendation} />
                  <ReflectionCard label="Strengths" value={tutorFeedback.sessionNotes?.strengths} />
                  <ReflectionCard label="Weaknesses" value={tutorFeedback.sessionNotes?.weaknesses} />
                </div>
              }
            />
          )}

          {isCompleted && !tutorFeedback && (
            <section className="rounded-3xl border border-gray-100 bg-white p-6 shadow-soft">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-xl font-display font-bold text-gray-900">Submit Tutor Feedback</h2>
                  <p className="mt-1 text-sm text-gray-500">
                    Rate engagement, preparedness, and participation, then store session notes and recommendations.
                  </p>
                </div>
                <label className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-3 py-2 text-xs font-semibold text-gray-600">
                  <input
                    type="checkbox"
                    checked={form.anonymous}
                    onChange={(event) =>
                      setForm((current) => ({ ...current, anonymous: event.target.checked }))
                    }
                  />
                  Anonymous admin-only identity
                </label>
              </div>

              <div className="mt-5 grid gap-4 md:grid-cols-3">
                <StarRatingInput
                  label="Engagement"
                  value={form.ratings.engagement}
                  onChange={(value) =>
                    setForm((current) => ({
                      ...current,
                      ratings: { ...current.ratings, engagement: value },
                    }))
                  }
                  accent="tutor"
                />
                <StarRatingInput
                  label="Preparedness"
                  value={form.ratings.preparedness}
                  onChange={(value) =>
                    setForm((current) => ({
                      ...current,
                      ratings: { ...current.ratings, preparedness: value },
                    }))
                  }
                  accent="tutor"
                />
                <StarRatingInput
                  label="Participation"
                  value={form.ratings.participation}
                  onChange={(value) =>
                    setForm((current) => ({
                      ...current,
                      ratings: { ...current.ratings, participation: value },
                    }))
                  }
                  accent="tutor"
                />
              </div>

              <div className="mt-5 grid gap-4">
                <Field
                  as="textarea"
                  rows={4}
                  label="Session reflection"
                  value={form.comment}
                  onChange={(value) => setForm((current) => ({ ...current, comment: value }))}
                  placeholder="Summarize how the session went."
                />
                <Field
                  as="textarea"
                  rows={3}
                  label="Topics covered"
                  value={form.topicsCovered}
                  onChange={(value) => setForm((current) => ({ ...current, topicsCovered: value }))}
                  placeholder="What did you work through together?"
                />
                <div className="grid gap-4 md:grid-cols-2">
                  <Field
                    as="textarea"
                    rows={3}
                    label="Student strengths"
                    value={form.strengths}
                    onChange={(value) => setForm((current) => ({ ...current, strengths: value }))}
                    placeholder="What went well?"
                  />
                  <Field
                    as="textarea"
                    rows={3}
                    label="Student weaknesses"
                    value={form.weaknesses}
                    onChange={(value) => setForm((current) => ({ ...current, weaknesses: value }))}
                    placeholder="What still needs work?"
                  />
                </div>
                <Field
                  as="textarea"
                  rows={3}
                  label="Recommended topics to revise and study advice"
                  value={form.recommendation}
                  onChange={(value) => setForm((current) => ({ ...current, recommendation: value }))}
                  placeholder="Suggested revision and next steps."
                />
              </div>

              <div className="mt-5 grid gap-4 md:grid-cols-[0.85fr_1.15fr]">
                <SelectField
                  label="Flag or report an issue"
                  value={form.flagType}
                  onChange={(value) => setForm((current) => ({ ...current, flagType: value }))}
                  options={reportOptions}
                />
                <Field
                  as="textarea"
                  rows={3}
                  label="Issue details"
                  value={form.flagDetails}
                  onChange={(value) => setForm((current) => ({ ...current, flagDetails: value }))}
                  placeholder="Add context for admins if needed."
                />
              </div>

              {status.message && (
                <div
                  className={`mt-5 rounded-2xl px-4 py-3 text-sm ${
                    status.type === "success"
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-rose-50 text-rose-700"
                  }`}
                >
                  {status.message}
                </div>
              )}

              <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-gray-500">
                  Duplicate tutor submissions are blocked once this review is stored.
                </p>
                <button
                  type="button"
                  disabled={!canSubmit}
                  onClick={handleSubmit}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-tutor px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-tutor/20 transition hover:-translate-y-0.5 hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <span className="material-icons-round text-lg">send</span>
                  Submit tutor feedback
                </button>
              </div>
            </section>
          )}
        </div>

        <div className="space-y-6">
          {session.studentId === studentProfile.id && (
            <section className="rounded-3xl border border-gray-100 bg-white p-6 shadow-soft">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-400">Student profile</p>
                  <h2 className="mt-1 text-xl font-display font-bold text-gray-900">{studentProfile.name}</h2>
                  <p className="text-sm text-gray-500">{studentProfile.university}</p>
                </div>
                <div className="rounded-2xl bg-teal-50 px-4 py-3 text-right">
                  <p className="text-2xl font-black text-gray-900">{studentProfile.rating}</p>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-tutor">
                    Learner rating
                  </p>
                </div>
              </div>

              <div className="mt-5 space-y-3">
                {studentProfile.receivedFeedback.map((entry) => (
                  <div key={entry.id} className="rounded-2xl border border-gray-100 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-semibold text-gray-900">{entry.sessionSubject}</p>
                      <StarsDisplay value={entry.overallRating} size="text-sm" />
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-gray-600">{entry.comment}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          <section className="rounded-3xl border border-gray-100 bg-white p-6 shadow-soft">
            <h2 className="text-xl font-display font-bold text-gray-900">Next Actions</h2>
            <div className="mt-4 flex flex-col gap-3">
              {isUpcoming && session.format === "online" && session.meetingLink && (
                <a
                  href={session.meetingLink}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-tutor px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-tutor/20 transition hover:-translate-y-0.5 hover:bg-teal-700"
                >
                  <span className="material-icons-round text-lg">videocam</span>
                  Start Session
                </a>
              )}
              <Link
                to="/tutor/dashboard/messages"
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
                  View Requests
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
    teal: "bg-teal-50 text-tutor",
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

function Field({ as = "input", label, value, onChange, ...props }) {
  const Tag = as;
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-gray-700">{label}</span>
      <Tag
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-tutor focus:ring-2 focus:ring-tutor/20"
        {...props}
      />
    </label>
  );
}

function SelectField({ label, value, onChange, options }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-gray-700">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-tutor focus:ring-2 focus:ring-tutor/20"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function ReflectionCard({ label, value }) {
  return (
    <div className="rounded-2xl bg-gray-50 p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-400">{label}</p>
      <p className="mt-2 text-sm leading-relaxed text-gray-600">{value || "Not provided."}</p>
    </div>
  );
}

function FeedbackSummaryCard({ title, entry, accent, extra }) {
  const accentClass = accent === "tutor" ? "text-tutor" : "text-primary";
  return (
    <section className="rounded-3xl border border-gray-100 bg-white p-6 shadow-soft">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-xl font-display font-bold text-gray-900">{title}</h2>
          <p className="mt-1 text-sm text-gray-500">
            Submitted {new Date(entry.submittedAt).toLocaleString()}
            {entry.anonymous ? " • Anonymous setting enabled" : ""}
          </p>
        </div>
        <div className="text-right">
          <p className={`text-2xl font-black ${accentClass}`}>{entry.overallRating}</p>
          <StarsDisplay value={entry.overallRating} />
        </div>
      </div>
      <p className="mt-4 text-sm leading-relaxed text-gray-600">{entry.comment || "No written comment provided."}</p>
      {entry.flag && (
        <div className="mt-4 rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700">
          <span className="font-semibold">Flagged issue:</span> {entry.flag.type}
          {entry.flag.details ? ` • ${entry.flag.details}` : ""}
        </div>
      )}
      {extra && <div className="mt-4">{extra}</div>}
    </section>
  );
}
