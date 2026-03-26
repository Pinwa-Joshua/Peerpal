import { useMemo, useState } from "react";
import { StarsDisplay } from "../../components/feedback/FeedbackWidgets";

const ACTION_STYLES = {
  pending: "bg-amber-100 text-amber-700",
  warn: "bg-blue-100 text-blue-700",
  suspend: "bg-rose-100 text-rose-700",
  remove: "bg-gray-900 text-white",
};

export default function AdminFeedback() {
  const [allFeedback, setAllFeedback] = useState([]);
  const [flaggedCases, setFlaggedCases] = useState([]);

  const [filters, setFilters] = useState({
    flaggedOnly: false,
    actor: "all",
    rating: "all",
    query: "",
  });

  const takeModerationAction = () => {
    console.log("Action taken placeholder");
  }

  const filteredFeedback = useMemo(() => {
    return allFeedback.filter((entry) => {
      const matchesFlag = !filters.flaggedOnly || !!entry.flag;
      const matchesActor = filters.actor === "all" || entry.fromRole === filters.actor;
      const matchesRating =
        filters.rating === "all" ||
        (filters.rating === "high" && entry.overallRating >= 4) ||
        (filters.rating === "mid" && entry.overallRating >= 3 && entry.overallRating < 4) ||
        (filters.rating === "low" && entry.overallRating < 3);
      const searchTarget = `${entry.counterpartName} ${entry.sessionSubject} ${entry.sessionId}`.toLowerCase();
      const matchesQuery =
        !filters.query || searchTarget.includes(filters.query.toLowerCase());

      return matchesFlag && matchesActor && matchesRating && matchesQuery;
    });
  }, [allFeedback, filters]);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Feedback Operations</h1>
          <p className="mt-1 text-sm text-slate-500">
            Review platform feedback, flagged issues, and moderation decisions.
          </p>
        </div>
        <div className="rounded-2xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {flaggedCases.length} flagged case{flaggedCases.length === 1 ? "" : "s"} currently tracked
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
        <input
          type="text"
          value={filters.query}
          onChange={(event) => setFilters((current) => ({ ...current, query: event.target.value }))}
          placeholder="Search user, subject, or session"
          className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-purple-700 focus:ring-2 focus:ring-purple-700/20"
        />
        <select
          value={filters.actor}
          onChange={(event) => setFilters((current) => ({ ...current, actor: event.target.value }))}
          className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-purple-700 focus:ring-2 focus:ring-purple-700/20"
        >
          <option value="all">All submitters</option>
          <option value="student">Student feedback</option>
          <option value="tutor">Tutor feedback</option>
        </select>
        <select
          value={filters.rating}
          onChange={(event) => setFilters((current) => ({ ...current, rating: event.target.value }))}
          className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-purple-700 focus:ring-2 focus:ring-purple-700/20"
        >
          <option value="all">All ratings</option>
          <option value="high">4.0 and above</option>
          <option value="mid">3.0 to 3.9</option>
          <option value="low">Below 3.0</option>
        </select>
        <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700">
          <input
            type="checkbox"
            checked={filters.flaggedOnly}
            onChange={(event) =>
              setFilters((current) => ({ ...current, flaggedOnly: event.target.checked }))
            }
            className="h-4 w-4 rounded border-slate-300 text-purple-700 focus:ring-purple-700"
          />
          Flagged issues only
        </label>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <section className="rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-6 py-5">
            <h2 className="text-lg font-bold text-slate-900">All Feedback</h2>
          </div>
          <div className="divide-y divide-slate-100">
            {filteredFeedback.map((entry) => (
              <article key={entry.id} className="px-6 py-5">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold capitalize text-slate-600">
                        {entry.fromRole}
                      </span>
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                        Session #{entry.sessionId}
                      </span>
                      {entry.flag && (
                        <span className="rounded-full bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-700">
                          Flagged: {entry.flag.type}
                        </span>
                      )}
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-900">{entry.sessionSubject}</h3>
                      <p className="text-sm text-slate-500">Counterpart: {entry.counterpartName}</p>
                    </div>
                    <p className="text-sm leading-relaxed text-slate-600">{entry.comment}</p>
                    {entry.flag?.details && (
                      <div className="rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700">
                        <span className="font-semibold">Report details:</span> {entry.flag.details}
                      </div>
                    )}
                  </div>

                  <div className="min-w-[190px] rounded-2xl bg-slate-50 p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-slate-700">Rating</span>
                      <span className="text-lg font-black text-slate-900">{entry.overallRating}</span>
                    </div>
                    <div className="mt-2">
                      <StarsDisplay value={entry.overallRating} size="text-sm" />
                    </div>
                    <p className="mt-3 text-xs text-slate-400">
                      Submitted {new Date(entry.submittedAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-6 py-5">
            <h2 className="text-lg font-bold text-slate-900">Flagged Reports</h2>
          </div>
          <div className="space-y-4 p-6">
            {flaggedCases.map((item) => (
              <article key={item.caseId} className="rounded-2xl border border-slate-200 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">
                      Session #{item.sessionId}
                    </p>
                    <h3 className="mt-1 font-bold text-slate-900">{item.issueType}</h3>
                    <p className="text-sm text-slate-500">
                      {item.counterpartName} &bull; {item.sessionSubject}
                    </p>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${item.action === "Pending" ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700"}`}>
                    {item.action}
                  </span>
                </div>

                <p className="mt-3 text-sm leading-relaxed text-slate-600">{item.details}</p>
                {item.actionNote && (
                  <div className="mt-3 rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-700">
                    <span className="font-semibold">Admin note:</span> {item.actionNote}
                  </div>
                )}

                <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-3">
                  {["warn", "suspend", "remove"].map((action) => (
                    <button
                      key={action}
                      onClick={() =>
                        takeModerationAction({
                          feedbackId: item.feedbackId,
                          action,
                          note: `${action} applied from admin feedback dashboard.`,
                        })
                      }
                      className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${action === "warn" ? "bg-amber-100 text-amber-800" : action === "suspend" ? "bg-orange-100 text-orange-800" : "bg-red-100 text-red-800"}`}
                    >
                      {action === "warn" ? "Warn user" : action === "suspend" ? "Suspend user" : "Remove user"}
                    </button>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

