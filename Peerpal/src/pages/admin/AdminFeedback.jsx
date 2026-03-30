import { useEffect, useMemo, useState } from "react";
import { StarsDisplay } from "../../components/feedback/FeedbackWidgets";
import { AdminAPI } from "../../services/api";

export default function AdminFeedback() {
    const [entries, setEntries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [flaggedOnly, setFlaggedOnly] = useState(false);
    const [query, setQuery] = useState("");

    useEffect(() => {
        AdminAPI.getFeedback()
            .then((data) => setEntries(Array.isArray(data) ? data : []))
            .catch((error) => console.error("Failed to load admin feedback", error))
            .finally(() => setLoading(false));
    }, []);

    const filtered = useMemo(() => {
        return entries.filter((entry) => {
            const matchesFlag = !flaggedOnly || entry.flagged;
            const target = `${entry.from_user} ${entry.to_user} ${entry.comment} ${entry.session_id || ""}`.toLowerCase();
            const matchesQuery = !query || target.includes(query.toLowerCase());
            return matchesFlag && matchesQuery;
        });
    }, [entries, flaggedOnly, query]);

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Feedback Operations</h1>
                    <p className="mt-1 text-sm text-slate-500">
                        Review live platform feedback and spot low-rated interactions.
                    </p>
                </div>
                <div className="rounded-2xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                    {entries.filter((entry) => entry.flagged).length} flagged feedback item(s)
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_auto]">
                <input
                    type="text"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Search user, comment, or session"
                    className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-purple-700 focus:ring-2 focus:ring-purple-700/20"
                />
                <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700">
                    <input
                        type="checkbox"
                        checked={flaggedOnly}
                        onChange={(event) => setFlaggedOnly(event.target.checked)}
                        className="h-4 w-4 rounded border-slate-300 text-purple-700 focus:ring-purple-700"
                    />
                    Flagged only
                </label>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-100 px-6 py-5">
                    <h2 className="text-lg font-bold text-slate-900">All Feedback</h2>
                </div>
                {loading ? (
                    <div className="p-8 text-center text-slate-500">Loading feedback...</div>
                ) : filtered.length === 0 ? (
                    <div className="p-8 text-center text-slate-500">No feedback found.</div>
                ) : (
                    <div className="divide-y divide-slate-100">
                        {filtered.map((entry) => (
                            <article key={entry.id} className="px-6 py-5">
                                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                                    <div className="space-y-2">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold capitalize text-slate-600">
                                                {entry.from_role}
                                            </span>
                                            {entry.session_id && (
                                                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                                                    Session #{entry.session_id}
                                                </span>
                                            )}
                                            {entry.flagged && (
                                                <span className="rounded-full bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-700">
                                                    Flagged
                                                </span>
                                            )}
                                        </div>
                                        <div>
                                            <h3 className="text-base font-bold text-slate-900">{entry.from_user}</h3>
                                            <p className="text-sm text-slate-500">About {entry.to_user}</p>
                                        </div>
                                        <p className="text-sm leading-relaxed text-slate-600">{entry.comment || "No written comment."}</p>
                                    </div>

                                    <div className="min-w-[190px] rounded-2xl bg-slate-50 p-4">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-semibold text-slate-700">Rating</span>
                                            <span className="text-lg font-black text-slate-900">{entry.rating}</span>
                                        </div>
                                        <div className="mt-2">
                                            <StarsDisplay value={entry.rating} size="text-sm" />
                                        </div>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
