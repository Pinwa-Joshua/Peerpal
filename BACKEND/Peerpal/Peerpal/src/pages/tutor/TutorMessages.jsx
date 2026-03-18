import { useState } from "react";

/* ─── mock conversations ─── */
const CONVERSATIONS = [
    {
        id: 1, student: "Lerato M.", initials: "LM", gradient: "from-pink-500 to-rose-600",
        lastMessage: "Thanks, see you at 3!", time: "2m ago", unread: 1,
        messages: [
            { id: 1, from: "student", text: "Hi! Are we still on for today?", time: "2:45 PM" },
            { id: 2, from: "tutor", text: "Yes! I've prepared some practice problems on integration by parts.", time: "2:47 PM" },
            { id: 3, from: "student", text: "Perfect, I'll have my tutorial sheet ready.", time: "2:50 PM" },
            { id: 4, from: "tutor", text: "Great. Join the meeting link 5 mins early if you can.", time: "2:52 PM" },
            { id: 5, from: "student", text: "Thanks, see you at 3!", time: "2:55 PM" },
        ],
    },
    {
        id: 2, student: "David N.", initials: "DN", gradient: "from-blue-500 to-indigo-600",
        lastMessage: "Room 204, right?", time: "1h ago", unread: 0,
        messages: [
            { id: 1, from: "student", text: "Hey Thabo, looking forward to tomorrow's session.", time: "1:00 PM" },
            { id: 2, from: "tutor", text: "Same here! We'll cover Newton's laws and draw some free body diagrams.", time: "1:05 PM" },
            { id: 3, from: "student", text: "Room 204, right?", time: "1:10 PM" },
        ],
    },
    {
        id: 3, student: "Aisha T.", initials: "AT", gradient: "from-violet-500 to-purple-600",
        lastMessage: "Can we also cover diagonalisation?", time: "3h ago", unread: 2,
        messages: [
            { id: 1, from: "tutor", text: "Hi Aisha! For Friday's session, we'll focus on eigenvalues.", time: "10:00 AM" },
            { id: 2, from: "student", text: "Awesome. I've been struggling with the concept.", time: "10:15 AM" },
            { id: 3, from: "student", text: "Can we also cover diagonalisation?", time: "10:16 AM" },
        ],
    },
];

export default function TutorMessages() {
    const [activeId, setActiveId] = useState(null);
    const [input, setInput] = useState("");
    const [conversations, setConversations] = useState(CONVERSATIONS);

    const active = conversations.find((c) => c.id === activeId);

    const send = () => {
        if (!input.trim() || !active) return;
        const newMsg = {
            id: Date.now(),
            from: "tutor",
            text: input.trim(),
            time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };
        setConversations((prev) =>
            prev.map((c) =>
                c.id === activeId
                    ? { ...c, messages: [...c.messages, newMsg], lastMessage: newMsg.text, time: "Just now" }
                    : c
            )
        );
        setInput("");
    };

    return (
        <div className="max-w-6xl mx-auto">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-soft overflow-hidden flex" style={{ height: "calc(100vh - 140px)" }}>
                {/* Conversation list */}
                <div
                    className={`w-full sm:w-80 flex-shrink-0 border-r border-gray-100 flex flex-col ${active ? "hidden sm:flex" : "flex"
                        }`}
                >
                    <div className="p-4 border-b border-gray-100">
                        <h2 className="font-display font-bold text-gray-900">
                            Messages
                        </h2>
                    </div>
                    <div className="flex-1 overflow-y-auto scrollbar-hide">
                        {conversations.map((c) => (
                            <button
                                key={c.id}
                                onClick={() => setActiveId(c.id)}
                                className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition text-left ${activeId === c.id ? "bg-teal-50" : ""
                                    }`}
                            >
                                <div
                                    className={`w-10 h-10 rounded-full bg-gradient-to-br ${c.gradient} flex items-center justify-center text-white text-sm font-bold flex-shrink-0`}
                                >
                                    {c.initials}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm font-semibold text-gray-900 truncate">
                                            {c.student}
                                        </p>
                                        <span className="text-[10px] text-gray-400 flex-shrink-0 ml-2">
                                            {c.time}
                                        </span>
                                    </div>
                                    <p className="text-xs text-gray-500 truncate">
                                        {c.lastMessage}
                                    </p>
                                </div>
                                {c.unread > 0 && (
                                    <span className="w-5 h-5 rounded-full bg-tutor text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0">
                                        {c.unread}
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Chat area */}
                {active ? (
                    <div className="flex-1 flex flex-col min-w-0">
                        {/* Chat header */}
                        <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100 flex-shrink-0">
                            <button
                                onClick={() => setActiveId(null)}
                                className="sm:hidden text-gray-400 hover:text-gray-600"
                            >
                                <span className="material-icons-round">
                                    arrow_back
                                </span>
                            </button>
                            <div
                                className={`w-9 h-9 rounded-full bg-gradient-to-br ${active.gradient} flex items-center justify-center text-white text-xs font-bold`}
                            >
                                {active.initials}
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-gray-900">
                                    {active.student}
                                </p>
                                <p className="text-[10px] text-green-500 font-medium">
                                    Online
                                </p>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto scrollbar-hide p-4 space-y-3">
                            {active.messages.map((msg) => (
                                <div
                                    key={msg.id}
                                    className={`flex ${msg.from === "tutor" ? "justify-end" : "justify-start"
                                        }`}
                                >
                                    <div
                                        className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm ${msg.from === "tutor"
                                                ? "bg-tutor text-white rounded-br-md"
                                                : "bg-gray-100 text-gray-900 rounded-bl-md"
                                            }`}
                                    >
                                        <p>{msg.text}</p>
                                        <p
                                            className={`text-[10px] mt-1 ${msg.from === "tutor"
                                                    ? "text-teal-200"
                                                    : "text-gray-400"
                                                }`}
                                        >
                                            {msg.time}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Input bar */}
                        <div className="flex items-center gap-2 p-3 border-t border-gray-100 flex-shrink-0">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && send()}
                                placeholder="Type a message…"
                                className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-tutor/20 focus:border-tutor focus:bg-white transition"
                            />
                            <button
                                onClick={send}
                                disabled={!input.trim()}
                                className="w-10 h-10 rounded-xl bg-tutor hover:bg-teal-700 disabled:opacity-40 disabled:cursor-not-allowed text-white flex items-center justify-center transition"
                            >
                                <span className="material-icons-round text-lg">
                                    send
                                </span>
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="flex-1 hidden sm:flex items-center justify-center text-center p-6">
                        <div>
                            <span className="material-icons-round text-6xl text-gray-200 mb-3 block">
                                chat_bubble
                            </span>
                            <p className="text-gray-500 font-semibold">
                                Select a conversation
                            </p>
                            <p className="text-gray-400 text-sm mt-1">
                                Choose a student to start messaging.
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
