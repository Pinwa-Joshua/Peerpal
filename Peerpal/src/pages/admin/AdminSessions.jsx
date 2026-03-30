import { useEffect, useState } from "react";
import { AdminAPI } from "../../services/api";

export default function AdminSessions() {
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState("");

    useEffect(() => {
        setLoading(true);
        AdminAPI.getSessions(status ? { status } : {})
            .then((data) => setSessions(Array.isArray(data) ? data : []))
            .catch((error) => console.error("Failed to load admin sessions", error))
            .finally(() => setLoading(false));
    }, [status]);

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Sessions & Disputes</h1>
                    <p className="text-sm text-slate-500 mt-1">Monitor live and historical session activity.</p>
                </div>
                <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-purple-700 focus:ring-2 focus:ring-purple-700/20"
                >
                    <option value="">All statuses</option>
                    <option value="pending">Pending</option>
                    <option value="accepted">Accepted</option>
                    <option value="declined">Declined</option>
                </select>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                {loading ? (
                    <div className="p-8 text-center text-slate-500">Loading sessions...</div>
                ) : sessions.length === 0 ? (
                    <div className="p-8 text-center text-slate-500">No sessions found.</div>
                ) : (
                    <>
                        <div className="hidden lg:grid grid-cols-6 gap-4 px-6 py-4 bg-slate-50 text-xs font-semibold uppercase tracking-wider text-slate-500">
                            <span>Student</span>
                            <span>Tutor</span>
                            <span>Subject</span>
                            <span>Schedule</span>
                            <span>Format</span>
                            <span>Status</span>
                        </div>
                        <div className="divide-y divide-slate-100">
                            {sessions.map((session) => (
                                <div key={session.id} className="grid grid-cols-1 lg:grid-cols-6 gap-3 px-6 py-4 text-sm">
                                    <div className="font-semibold text-slate-900">{session.student}</div>
                                    <div className="text-slate-700">{session.tutor}</div>
                                    <div className="text-slate-700">{session.subject}</div>
                                    <div className="text-slate-700">{session.date || session.created_at || "N/A"} {session.time ? `at ${session.time}` : ""}</div>
                                    <div className="capitalize text-slate-700">{session.format || "N/A"}</div>
                                    <div>
                                        <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold capitalize text-slate-700">
                                            {session.status}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
