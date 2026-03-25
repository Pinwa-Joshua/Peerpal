export function StarsDisplay({ value, size = "text-base" }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, index) => (
        <span
          key={index}
          className={`material-icons-round ${size} ${
            index < Math.round(value) ? "text-amber-400" : "text-gray-300"
          }`}
        >
          star
        </span>
      ))}
    </div>
  );
}

export function StarRatingInput({ label, value, onChange, accent = "primary" }) {
  const activeClass =
    accent === "tutor"
      ? "text-tutor"
      : accent === "purple"
        ? "text-purple-600"
        : "text-primary";
  const hoverClass =
    accent === "tutor" ? "hover:text-tutor" : "hover:text-primary";

  return (
    <div className="rounded-2xl border border-gray-100 bg-gray-50/70 p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-semibold text-gray-700">{label}</p>
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => onChange(index + 1)}
              className="transition-transform hover:scale-110"
            >
              <span
                className={`material-icons-round text-xl ${
                  index < value ? activeClass : `text-gray-300 ${hoverClass}`
                }`}
              >
                star
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export function MetricCard({ label, value, helper, tone = "blue" }) {
  const tones = {
    blue: "from-blue-50 to-indigo-50 text-blue-700",
    teal: "from-teal-50 to-emerald-50 text-teal-700",
    amber: "from-amber-50 to-orange-50 text-amber-700",
    rose: "from-rose-50 to-pink-50 text-rose-700",
  };

  return (
    <div className={`rounded-2xl bg-gradient-to-br ${tones[tone]} p-5`}>
      <p className="text-xs font-semibold uppercase tracking-[0.18em] opacity-70">{label}</p>
      <p className="mt-3 text-3xl font-black">{value}</p>
      {helper && <p className="mt-2 text-sm opacity-80">{helper}</p>}
    </div>
  );
}

export function FeedbackStatusPill({ submitted, label }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
        submitted ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
      }`}
    >
      <span className={`h-2 w-2 rounded-full ${submitted ? "bg-emerald-500" : "bg-amber-500"}`} />
      {label}
    </span>
  );
}

export function DimensionBars({ metrics = {}, accent = "bg-primary" }) {
  return (
    <div className="space-y-3">
      {Object.entries(metrics).map(([key, value]) => (
        <div key={key}>
          <div className="mb-1 flex items-center justify-between gap-3 text-sm">
            <span className="font-medium capitalize text-gray-600">
              {key.replace(/([A-Z])/g, " $1")}
            </span>
            <span className="font-semibold text-gray-900">{value || 0}/5</span>
          </div>
          <div className="h-2 rounded-full bg-gray-100">
            <div
              className={`h-2 rounded-full ${accent}`}
              style={{ width: `${((value || 0) / 5) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
