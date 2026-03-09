import { useState } from "react";

/* ─── mock requests ─── */
const REQUESTS = [
    { id: 1, student: "Thando Khumalo", initials: "TK", gradient: "from-cyan-500 to-blue-600", university: "University of Cape Town", year: "2nd Year", subject: "Statistics 101", date: "Mon, 17 Mar", time: "11:00 AM – 12:00 PM", format: "online", message: "Hi! I'm struggling with hypothesis testing and p-values. Would love some help before my test next week.", status: "pending" },
    { id: 2, student: "Zara Pillay", initials: "ZP", gradient: "from-amber-500 to-orange-500", university: "University of Cape Town", year: "1st Year", subject: "Chemistry 101", date: "Tue, 18 Mar", time: "3:00 PM – 4:30 PM", format: "in-person", message: "Need help with stoichiometry and balancing equations. I have my tutorial sheet ready.", status: "pending" },
    { id: 3, student: "Mandla S.", initials: "MS", gradient: "from-violet-500 to-purple-600", university: "Stellenbosch University", year: "3rd Year", subject: "Data Structures", date: "Wed, 19 Mar", time: "2:00 PM – 3:00 PM", format: "online", message: "Can we go over binary search trees and AVL trees? Exam in 2 weeks.", status: "pending" },
    { id: 4, student: "Lerato M.", initials: "LM", gradient: "from-pink-500 to-rose-600", university: "University of Cape Town", year: "2nd Year", subject: "Calculus II", date: "Fri, 14 Mar", time: "3:00 PM – 4:00 PM", format: "online", message: "Integration by parts revision.", status: "accepted" },
    { id: 5, student: "David N.", initials: "DN", gradient: "from-blue-500 to-indigo-600", university: "University of the Witwatersrand", year: "1st Year", subject: "Physics I", date: "Thu, 13 Mar", time: "10:00 AM – 11:30 AM", format: "in-person", message: "Newton's laws and free body diagrams.", status: "accepted" },
    { id: 6, student: "Nomsa B.", initials: "NB", gradient: "from-emerald-500 to-teal-600", university: "University of Pretoria", year: "2nd Year", subject: "Linear Algebra", date: "Mon, 10 Mar", time: "11:00 AM – 12:00 PM", format: "online", message: "Can you help with eigenvalues?", status: "declined", declineReason: "Schedule conflict with exam prep." },
    { id: 7, student: "Yusuf A.", initials: "YA", gradient: "from-red-500 to-pink-600", university: "University of Johannesburg", year: "1st Year", subject: "Economics 101", date: "Sat, 8 Mar", time: "9:00 AM – 10:00 AM", format: "online", message: "Supply and demand curves.", status: "declined", declineReason: "Subject outside my expertise." },
];

const TABS = ["pending", "accepted", "declined"];

const TAB_ICONS = {
    pending: "pending_actions",
    accepted: "check_circle",
    declined: "cancel",
};

export default function SessionRequests() {
    const [activeTab, setActiveTab] = useState("pending");
    const [declineModal, setDeclineModal] = useState(null); // request id
    const [declineReason, setDeclineReason] = useState("");

    const filtered = REQUESTS.filter((r) => r.status === activeTab);

    const handleDecline = () => {
        // TODO: persist decline with reason
        setDeclineModal(null);
        setDeclineReason("");
    };

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-gray-900">
                    Session Requests
                </h1>
                <p className="text-gray-500 mt-1">
                    Review and respond to session requests from students.
                </p>
            </div>

            {/* Tabs */}
            <div className="flex gap-2">
                {TABS.map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`inline-flex items-center gap-1.5 px-5 py-2 rounded-full text-sm font-semibold capitalize border-2 transition-all ${activeTab === tab
                                ? "border-tutor bg-tutor text-white"
                                : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                            }`}
                    >
                        <span className="material-icons-round text-base">
                            {TAB_ICONS[tab]}
                        </span>
                        {tab}
                        <span className="text-xs opacity-70">
                            ({REQUESTS.filter((r) => r.status === tab).length})
                        </span>
                    </button>
                ))}
            </div>

            {/* Request list */}
            {filtered.length > 0 ? (
                <div className="space-y-4">
                    {filtered.map((req) => (
                        <div
                            key={req.id}
                            className="bg-white rounded-2xl border border-gray-100 shadow-soft p-5 sm:p-6 hover:shadow-lg transition"
                        >
                            <div className="flex flex-col sm:flex-row gap-4">
                                {/* Student info */}
                                <div className="flex items-start gap-3 flex-1 min-w-0">
                                    <div
                                        className={`w-12 h-12 rounded-full bg-gradient-to-br ${req.gradient} flex items-center justify-center text-white font-bold flex-shrink-0`}
                                    >
                                        {req.initials}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <p className="font-semibold text-gray-900">
                                                {req.student}
                                            </p>
                                            <span className="text-xs text-gray-400">
                                                {req.university} · {req.year}
                                            </span>
                                        </div>
                                        {/* Subject + time */}
                                        <div className="flex items-center gap-3 mt-1 flex-wrap">
                                            <span className="inline-flex items-center gap-1 text-sm text-tutor font-semibold">
                                                <span className="material-icons-round text-sm">
                                                    menu_book
                                                </span>
                                                {req.subject}
                                            </span>
                                            <span className="inline-flex items-center gap-1 text-sm text-gray-500">
                                                <span className="material-icons-round text-sm">
                                                    schedule
                                                </span>
                                                {req.date} · {req.time}
                                            </span>
                                            <span
                                                className={`text-xs font-semibold px-2 py-0.5 rounded-full capitalize ${req.format === "online"
                                                        ? "bg-green-50 text-green-600"
                                                        : "bg-orange-50 text-orange-600"
                                                    }`}
                                            >
                                                {req.format}
                                            </span>
                                        </div>
                                        {/* Message */}
                                        <p className="text-sm text-gray-500 mt-2 leading-relaxed">
                                            "{req.message}"
                                        </p>
                                        {/* Decline reason (for declined tab) */}
                                        {req.declineReason && (
                                            <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1">
                                                <span className="material-icons-round text-xs">
                                                    info
                                                </span>
                                                Reason: {req.declineReason}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-2 flex-shrink-0 sm:flex-col sm:items-end">
                                    {req.status === "pending" && (
                                        <>
                                            <button className="inline-flex items-center gap-1.5 bg-tutor hover:bg-teal-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow-sm transition">
                                                <span className="material-icons-round text-base">
                                                    check
                                                </span>
                                                Accept
                                            </button>
                                            <button
                                                onClick={() => setDeclineModal(req.id)}
                                                className="inline-flex items-center gap-1.5 border-2 border-gray-200 text-gray-500 hover:border-red-200 hover:text-red-500 text-sm font-semibold px-5 py-2.5 rounded-xl transition"
                                            >
                                                <span className="material-icons-round text-base">
                                                    close
                                                </span>
                                                Decline
                                            </button>
                                        </>
                                    )}
                                    {req.status === "accepted" && (
                                        <span className="inline-flex items-center gap-1 text-sm text-tutor font-semibold">
                                            <span className="material-icons-round text-base">
                                                check_circle
                                            </span>
                                            Accepted
                                        </span>
                                    )}
                                    {req.status === "declined" && (
                                        <span className="inline-flex items-center gap-1 text-sm text-gray-400 font-semibold">
                                            <span className="material-icons-round text-base">
                                                cancel
                                            </span>
                                            Declined
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-soft p-12 text-center">
                    <span className="material-icons-round text-5xl text-gray-300 mb-3 block">
                        {activeTab === "pending"
                            ? "inbox"
                            : activeTab === "accepted"
                                ? "event_available"
                                : "block"}
                    </span>
                    <p className="text-gray-500 font-semibold mb-1">
                        No {activeTab} requests
                    </p>
                    <p className="text-gray-400 text-sm">
                        {activeTab === "pending"
                            ? "New requests from students will appear here."
                            : `Your ${activeTab} requests will appear here.`}
                    </p>
                </div>
            )}

            {/* Decline modal */}
            {declineModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 space-y-4">
                        <h3 className="font-display font-bold text-gray-900 text-lg">
                            Decline request
                        </h3>
                        <p className="text-sm text-gray-500">
                            Let the student know why you can't take this session. This helps them understand and find another tutor.
                        </p>
                        <textarea
                            rows={3}
                            value={declineReason}
                            onChange={(e) => setDeclineReason(e.target.value)}
                            placeholder="e.g. Schedule conflict, subject not in my expertise…"
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-tutor/30 focus:border-tutor transition resize-none"
                        />
                        <div className="flex items-center gap-2 justify-end">
                            <button
                                onClick={() => {
                                    setDeclineModal(null);
                                    setDeclineReason("");
                                }}
                                className="px-5 py-2.5 text-sm font-semibold text-gray-500 hover:text-gray-700 rounded-xl hover:bg-gray-50 transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDecline}
                                disabled={!declineReason.trim()}
                                className="px-5 py-2.5 text-sm font-semibold bg-red-500 hover:bg-red-600 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl transition"
                            >
                                Decline Request
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
