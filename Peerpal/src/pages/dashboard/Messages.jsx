import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { MessagesAPI, AuthAPI } from "../../services/api";

export default function Messages() {
    const [activeId, setActiveId] = useState(null);
    const [newMsg, setNewMsg] = useState("");
    const [conversations, setConversations] = useState([]);
    const [messages, setMessages] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        AuthAPI.getMe().then(user => setCurrentUser(user)).catch(err => console.error("Could not fetch user", err));
    }, []);

    // Poll inbox contacts on an interval
    useEffect(() => {
        const fetchInbox = async () => {
            try {
                const inbox = await MessagesAPI.getInbox();
                if (!Array.isArray(inbox)) return;
                
                // Group by sender_id to unique conversations
                const sendersMap = new Map();
                inbox.forEach(m => {
                    const sId = m.sender_id || m.senderId || (m.sender && m.sender.id) || "Unknown";
                    // keep latest message
                    sendersMap.set(sId, m);
                });
                
                const formattedConvs = Array.from(sendersMap.values()).map(lastMsg => {
                    const senderId = lastMsg.sender_id || lastMsg.senderId || (lastMsg.sender && lastMsg.sender.id) || "Unknown";
                    return {
                        id: senderId,
                        name: `Contact ${senderId}`,
                        initials: `C${senderId}`,
                        gradient: "from-blue-500 to-indigo-600",
                        lastMessage: lastMsg.content || "No message",
                        time: lastMsg.timestamp ? new Date(lastMsg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "",
                        unread: 0,
                    };
                });
                setConversations(formattedConvs);
            } catch (err) {
                console.error("Failed to fetch inbox:", err);
            }
        };

        fetchInbox();
        const interval = setInterval(fetchInbox, 10000); // Polling inbox
        return () => clearInterval(interval);
    }, []);

    // Poll active chat thread every 3 seconds
    useEffect(() => {
        if (!activeId) {
            setMessages([]);
            return;
        }

        const fetchThread = async () => {
            try {
                const thread = await MessagesAPI.getThread(activeId);
                if (!Array.isArray(thread)) return;
                
                const formattedMsgs = thread.map((m, idx) => ({
                    id: m.id || idx,
                    from: currentUser && (m.sender_id === currentUser.id || m.senderId === currentUser.id) ? "me" : "them",
                    text: m.content,
                    time: m.timestamp ? new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ""
                }));
                setMessages(formattedMsgs);
            } catch (err) {
                console.error("Failed to fetch thread:", err);
            }
        };

        fetchThread();
        const interval = setInterval(fetchThread, 3000); // Poll every 3s
        return () => clearInterval(interval);
    }, [activeId, currentUser]);

    const active = conversations.find((c) => c.id === activeId);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!newMsg.trim() || !activeId) return;

        try {
            await MessagesAPI.sendMessage(activeId, newMsg);
            
            // Optimistic update
            const optimisticMsg = {
                id: Date.now(),
                from: "me",
                text: newMsg,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            setMessages((prev) => [...prev, optimisticMsg]);
            setNewMsg("");
        } catch (error) {
            console.error("Failed to send message:", error);
        }
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
                        {conversations.map((conv) => (
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
                            {messages.map((msg) => (
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
