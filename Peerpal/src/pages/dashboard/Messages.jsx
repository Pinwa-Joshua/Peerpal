import { useState } from "react";
import { Link } from "react-router-dom";

/* ─── mock conversations ─── */
const CONVERSATIONS = [
    {
        id: 1,
        name: "Thabo M.",
        initials: "TM",
        gradient: "from-blue-500 to-indigo-600",
        lastMessage: "See you at 3pm for our Calculus session!",
        time: "2 min ago",
        unread: 2,
        messages: [
            { id: 1, from: "them", text: "Hey! Are you ready for our session today?", time: "2:45 PM" },
            { id: 2, from: "me", text: "Yes! I've been working through chapter 7. Got stuck on integration by parts.", time: "2:46 PM" },
            { id: 3, from: "them", text: "Perfect, we can focus on that. I'll share some practice problems too.", time: "2:47 PM" },
            { id: 4, from: "them", text: "See you at 3pm for our Calculus session!", time: "2:48 PM" },
        ],
    },
    {
        id: 2,
        name: "Zanele D.",
        initials: "ZD",
        gradient: "from-yellow-400 to-orange-500",
        lastMessage: "The Linear Algebra notes are uploaded 📎",
        time: "1 hr ago",
        unread: 0,
        messages: [
            { id: 1, from: "me", text: "Hi Zanele! Thanks for the session yesterday.", time: "10:00 AM" },
            { id: 2, from: "them", text: "No problem! You're making great progress with eigenvalues.", time: "10:15 AM" },
            { id: 3, from: "me", text: "Could you share those extra notes you mentioned?", time: "10:20 AM" },
            { id: 4, from: "them", text: "The Linear Algebra notes are uploaded 📎", time: "11:30 AM" },
        ],
    },
    {
        id: 3,
        name: "James P.",
        initials: "JP",
        gradient: "from-emerald-500 to-teal-600",
        lastMessage: "Let me know if you need help with the linked list assignment.",
        time: "3 hrs ago",
        unread: 1,
        messages: [
            { id: 1, from: "them", text: "Hey! How's the Data Structures assignment going?", time: "9:00 AM" },
            { id: 2, from: "me", text: "Slowly 😅 Binary trees are confusing.", time: "9:30 AM" },
            { id: 3, from: "them", text: "We can go over them in our next session. They're easier than they look!", time: "9:35 AM" },
            { id: 4, from: "them", text: "Let me know if you need help with the linked list assignment.", time: "9:40 AM" },
        ],
    },
];

export default function Messages() {
    const [activeId, setActiveId] = useState(CONVERSATIONS[0]?.id || null);
    const [newMsg, setNewMsg] = useState("");
    const active = CONVERSATIONS.find((c) => c.id === activeId);

    const handleSend = (e) => {
        e.preventDefault();
        if (!newMsg.trim()) return;
        // In a real app we'd push to state / API
        setNewMsg("");
    };

    return (
        <div className="max-w-7xl mx-auto h-[calc(100vh-7.5rem)]">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-soft h-full flex overflow-hidden">
                {/* ── Conversation list ── */}
                <div
                    className={`w-full sm:w-80 flex-shrink-0 border-r border-gray-100 flex flex-col ${active ? "hidden sm:flex" : "flex"
                        }`}
                >
                    {/* Header */}
                    <div className="px-5 h-16 flex items-center border-b border-gray-100 flex-shrink-0">
                        <h2 className="font-display font-bold text-gray-900 text-lg">
                            Messages
                        </h2>
                    </div>

                    {/* List */}
                    <div className="flex-1 overflow-y-auto scrollbar-hide">
                        {CONVERSATIONS.map((conv) => (
                            <button
                                key={conv.id}
                                onClick={() => setActiveId(conv.id)}
                                className={`w-full flex items-center gap-3 px-5 py-4 text-left hover:bg-gray-50 transition border-b border-gray-50 ${activeId === conv.id ? "bg-blue-50/50" : ""
                                    }`}
                            >
                                <div
                                    className={`w-11 h-11 rounded-full bg-gradient-to-br ${conv.gradient} flex items-center justify-center text-white text-sm font-bold flex-shrink-0`}
                                >
                                    {conv.initials}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <div className="flex items-center justify-between mb-0.5">
                                        <p className="font-semibold text-gray-900 text-sm truncate">
                                            {conv.name}
                                        </p>
                                        <span className="text-xs text-gray-400 flex-shrink-0 ml-2">
                                            {conv.time}
                                        </span>
                                    </div>
                                    <p className="text-xs text-gray-500 truncate">
                                        {conv.lastMessage}
                                    </p>
                                </div>
                                {conv.unread > 0 && (
                                    <span className="w-5 h-5 rounded-full bg-primary text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0">
                                        {conv.unread}
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* ── Chat area ── */}
                {active ? (
                    <div className="flex-1 flex flex-col min-w-0">
                        {/* Chat header */}
                        <div className="px-5 h-16 flex items-center gap-3 border-b border-gray-100 flex-shrink-0">
                            {/* Back button (mobile) */}
                            <button
                                onClick={() => setActiveId(null)}
                                className="sm:hidden text-gray-500 hover:text-gray-700 transition"
                            >
                                <span className="material-icons-round">
                                    arrow_back
                                </span>
                            </button>
                            <div
                                className={`w-9 h-9 rounded-full bg-gradient-to-br ${active.gradient} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}
                            >
                                {active.initials}
                            </div>
                            <div>
                                <p className="font-semibold text-gray-900 text-sm">
                                    {active.name}
                                </p>
                                <p className="text-xs text-green-500">Online</p>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto scrollbar-hide px-5 py-4 space-y-3">
                            {active.messages.map((msg) => (
                                <div
                                    key={msg.id}
                                    className={`flex ${msg.from === "me"
                                            ? "justify-end"
                                            : "justify-start"
                                        }`}
                                >
                                    <div
                                        className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${msg.from === "me"
                                                ? "bg-primary text-white rounded-br-md"
                                                : "bg-gray-100 text-gray-900 rounded-bl-md"
                                            }`}
                                    >
                                        <p>{msg.text}</p>
                                        <p
                                            className={`text-[10px] mt-1 ${msg.from === "me"
                                                    ? "text-blue-200"
                                                    : "text-gray-400"
                                                }`}
                                        >
                                            {msg.time}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Input */}
                        <form
                            onSubmit={handleSend}
                            className="flex items-center gap-2 px-4 py-3 border-t border-gray-100 flex-shrink-0"
                        >
                            <input
                                type="text"
                                value={newMsg}
                                onChange={(e) => setNewMsg(e.target.value)}
                                placeholder="Type a message…"
                                className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white transition"
                            />
                            <button
                                type="submit"
                                className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center hover:bg-blue-800 transition flex-shrink-0"
                            >
                                <span className="material-icons-round text-lg">
                                    send
                                </span>
                            </button>
                        </form>
                    </div>
                ) : (
                    /* Empty state (mobile when no chat selected) */
                    <div className="flex-1 hidden sm:flex items-center justify-center">
                        <div className="text-center">
                            <span className="material-icons-round text-5xl text-gray-300 mb-3 block">
                                chat_bubble_outline
                            </span>
                            <p className="text-gray-500 font-semibold">
                                Select a conversation
                            </p>
                            <p className="text-gray-400 text-sm">
                                Choose a chat from the sidebar to start messaging.
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
