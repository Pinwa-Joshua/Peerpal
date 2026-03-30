import { useEffect, useState } from "react";
import { AdminAPI } from "../../services/api";

export default function AdminUsers() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [query, setQuery] = useState("");
    const [role, setRole] = useState("");

    useEffect(() => {
        setLoading(true);
        AdminAPI.getUsers({ q: query, role })
            .then((data) => setUsers(Array.isArray(data) ? data : []))
            .catch((error) => console.error("Failed to load admin users", error))
            .finally(() => setLoading(false));
    }, [query, role]);

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-900">User Management</h1>
                <p className="text-sm text-slate-500 mt-1">Review students, tutors, and admin accounts.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search name or email"
                    className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-purple-700 focus:ring-2 focus:ring-purple-700/20"
                />
                <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-purple-700 focus:ring-2 focus:ring-purple-700/20"
                >
                    <option value="">All roles</option>
                    <option value="admin">Admin</option>
                    <option value="tutor">Tutor</option>
                    <option value="tutee">Student</option>
                </select>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                {loading ? (
                    <div className="p-8 text-center text-slate-500">Loading users...</div>
                ) : users.length === 0 ? (
                    <div className="p-8 text-center text-slate-500">No users found.</div>
                ) : (
                    <>
                        <div className="hidden md:grid grid-cols-5 gap-4 px-6 py-4 bg-slate-50 text-xs font-semibold uppercase tracking-wider text-slate-500">
                            <span>User</span>
                            <span>Role</span>
                            <span>Sessions</span>
                            <span>Latest Subject</span>
                            <span>User ID</span>
                        </div>
                        <div className="divide-y divide-slate-100">
                            {users.map((user) => (
                                <div key={user.id} className="grid grid-cols-1 md:grid-cols-5 gap-3 px-6 py-4 text-sm">
                                    <div>
                                        <p className="font-semibold text-slate-900">{user.full_name}</p>
                                        <p className="text-slate-500 text-xs mt-1">{user.email}</p>
                                    </div>
                                    <div className="capitalize text-slate-700">{user.role}</div>
                                    <div className="text-slate-700">{user.sessions_count}</div>
                                    <div className="text-slate-700">{user.latest_session_subject || "N/A"}</div>
                                    <div className="text-slate-500">#{user.id}</div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
