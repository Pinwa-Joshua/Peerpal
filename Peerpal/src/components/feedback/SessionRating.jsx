import { StarRatingInput, StarsDisplay } from "./FeedbackWidgets";

export const LEARNER_RATING_FIELDS = [
  { key: "teachingClarity", label: "Teaching Clarity" },
  { key: "communication", label: "Communication" },
  { key: "punctuality", label: "Punctuality" },
  { key: "helpfulness", label: "Helpfulness" },
  { key: "subjectKnowledge", label: "Subject Knowledge" },
];

export const TUTOR_RATING_FIELDS = [
  { key: "punctuality", label: "Punctuality" },
  { key: "preparedness", label: "Preparedness" },
  { key: "communication", label: "Communication" },
  { key: "engagement", label: "Engagement" },
  { key: "courtesy", label: "Courtesy" },
];

export function createEmptyRatings(fields) {
  return fields.reduce((acc, field) => {
    acc[field.key] = 0;
    return acc;
  }, {});
}

export function getOverallRating(ratings = {}) {
  const values = Object.values(ratings).filter((value) => typeof value === "number" && value > 0);
  if (!values.length) return 0;
  return Math.round((values.reduce((sum, value) => sum + value, 0) / values.length) * 10) / 10;
}

export function SessionRatingForm({
  title,
  subtitle,
  fields,
  ratings,
  onRate,
  onSubmit,
  submitLabel,
  accent = "primary",
  disabled = false,
  status,
}) {
  const overall = getOverallRating(ratings);
  const allRated = fields.every((field) => ratings[field.key] > 0);

  return (
    <section className="rounded-3xl border border-gray-100 bg-white p-6 shadow-soft">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h2 className="text-xl font-display font-bold text-gray-900">{title}</h2>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">{subtitle}</p>
        </div>
        <OverallRatingBadge value={overall} accent={accent} />
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {fields.map((field) => (
          <StarRatingInput
            key={field.key}
            label={field.label}
            value={ratings[field.key]}
            onChange={(value) => onRate(field.key, value)}
            accent={accent}
          />
        ))}
      </div>

      {status?.message && (
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

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-gray-500">
          Rate every category to unlock submission. Ratings are stored independently for each user.
        </p>
        <button
          type="button"
          disabled={!allRated || disabled}
          onClick={onSubmit}
          className={`inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white shadow-lg transition disabled:cursor-not-allowed disabled:opacity-40 ${
            accent === "tutor"
              ? "bg-tutor shadow-tutor/20 hover:bg-teal-700"
              : "bg-primary shadow-primary/20 hover:bg-blue-800"
          }`}
        >
          <span className="material-icons-round text-lg">send</span>
          {submitLabel}
        </button>
      </div>
    </section>
  );
}

export function SessionRatingSummary({
  title,
  subtitle,
  entry,
  fields,
  accent = "primary",
}) {
  return (
    <section className="rounded-3xl border border-gray-100 bg-white p-6 shadow-soft">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h2 className="text-xl font-display font-bold text-gray-900">{title}</h2>
          <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
          <p className="mt-2 text-xs font-medium uppercase tracking-[0.18em] text-gray-400">
            Submitted {new Date(entry.submittedAt).toLocaleString()}
          </p>
        </div>
        <OverallRatingBadge value={entry.overallRating} accent={accent} />
      </div>

      <div className="mt-6 grid gap-3 md:grid-cols-2">
        {fields.map((field) => (
          <div key={field.key} className="rounded-2xl border border-gray-100 bg-gray-50/70 p-4">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-semibold text-gray-700">{field.label}</p>
              <span className={`text-sm font-bold ${accent === "tutor" ? "text-tutor" : "text-primary"}`}>
                {entry.ratings?.[field.key] || 0}/5
              </span>
            </div>
            <div className="mt-2">
              <StarsDisplay value={entry.ratings?.[field.key] || 0} size="text-sm" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function OverallRatingBadge({ value, accent }) {
  return (
    <div className={`rounded-[1.5rem] px-5 py-4 text-center ${accent === "tutor" ? "bg-teal-50" : "bg-blue-50"}`}>
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">Overall Rating</p>
      <p className={`mt-2 text-3xl font-black ${accent === "tutor" ? "text-tutor" : "text-primary"}`}>
        {value ? value.toFixed(1) : "--"}
      </p>
      <div className="mt-2 flex justify-center">
        <StarsDisplay value={value || 0} />
      </div>
    </div>
  );
}
