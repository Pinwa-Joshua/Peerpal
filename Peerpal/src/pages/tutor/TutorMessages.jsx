import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { MessagesAPI, AuthAPI } from "../../services/api";

const URL_REGEX = /(https?:\/\/[^\s]+|www\.[^\s]+)/gi;

function renderMessageContent(text) {
    if (!text) return null;

    const parts = text.split(URL_REGEX);
    return parts.map((part, index) => {
        if (!part) return null;
        if (part.match(URL_REGEX)) {
            const href = part.startsWith("http") ? part : `https://${part}`;
            return (
                <a
                    key={`${part}-${index}`}
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    className="underline break-all"
                >
                    {part}
                </a>
            );
        }

        return <span key={`${part}-${index}`}>{part}</span>;
    });
}

export default function TutorMessages() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [activeId, setActiveId] = useState(null);
    const [input, setInput] = useState("");
    const [attachment, setAttachment] = useState(null);
    const [selectionMode, setSelectionMode] = useState(false);
    const [selectedMessageIds, setSelectedMessageIds] = useState([]);
    const [conversations, setConversations] = useState([]);
    const [messages, setMessages] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const requestedUserId = searchParams.get("user");
    const requestedName = searchParams.get("name");

    useEffect(() => {
        if (!requestedUserId) return;
        setActiveId(Number(requestedUserId));
    }, [requestedUserId]);

    useEffect(() => {
        AuthAPI.getMe()
            .then(user => setCurrentUser(user))
            .catch(err => console.error("Could not fetch user", err));
    }, []);

    // Poll inbox contacts on an interval
    useEffect(() => {
        const fetchInbox = async () => {
            try {
                const inbox = await MessagesAPI.getInbox();
                if (!Array.isArray(inbox)) return;

                const conversationsMap = new Map();
                inbox.forEach((m) => {
                    const otherId = m.sender_id === currentUser?.id ? m.receiver_id : m.sender_id;
                    const otherUser = m.sender_id === currentUser?.id ? m.receiver : m.sender;

                    if (!otherId) return;

                    const existing = conversationsMap.get(otherId);
                    if (!existing || new Date(m.timestamp) > new Date(existing.timestamp)) {
                        conversationsMap.set(otherId, { ...m, otherUser });
                    }
                });

                const formattedConvs = Array.from(conversationsMap.values())
                    .map((lastMsg) => {
                    const otherId = lastMsg.sender_id === currentUser?.id ? lastMsg.receiver_id : lastMsg.sender_id;
                    const otherName = lastMsg.otherUser?.name || `User ${otherId}`;
                    return {
                        id: otherId,
                        student: otherName,
                        initials: otherName.substring(0, 2).toUpperCase(),
                        gradient: "from-blue-500 to-indigo-600",
                        lastMessage: lastMsg.content || "No message",
                        time: lastMsg.timestamp ? new Date(lastMsg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "",
                        timestamp: lastMsg.timestamp || "",
                        unread: 0,
                    };
                })
                    .sort((a, b) => new Date(b.timestamp || 0) - new Date(a.timestamp || 0));

                if (requestedUserId && !formattedConvs.some((conv) => String(conv.id) === String(requestedUserId))) {
                    const fallbackName = requestedName || `Student ${requestedUserId}`;
                    formattedConvs.unshift({
                        id: Number(requestedUserId),
                        student: fallbackName,
                        initials: fallbackName.substring(0, 2).toUpperCase(),
                        gradient: "from-blue-500 to-indigo-600",
                        lastMessage: "Start the conversation",
                        time: "",
                        timestamp: "",
                        unread: 0,
                    });
                }
                setConversations(formattedConvs);
            } catch (err) {
                console.error("Failed to fetch inbox:", err);
            }
        };

        fetchInbox();
        const interval = setInterval(fetchInbox, 10000); // Polling inbox
        return () => clearInterval(interval);
    }, [currentUser, requestedUserId, requestedName]);

    // Poll active chat thread every 3 seconds
    useEffect(() => {
        if (!activeId) {
            setMessages([]);
            setSelectedMessageIds([]);
            setSelectionMode(false);
            return;
        }

        const fetchThread = async () => {
            try {
                const thread = await MessagesAPI.getThread(activeId);
                if (!Array.isArray(thread)) return;
                
                const formattedMsgs = thread.map((m, idx) => ({
                    id: m.id || idx,
                    from: currentUser && (m.sender_id === currentUser.id || m.senderId === currentUser.id) ? "tutor" : "them",
                    text: m.content,
                    time: m.timestamp ? new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "",
                    attachment: m.attachment || null,
                    canDelete: currentUser && (m.sender_id === currentUser.id || m.senderId === currentUser.id),
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

    const active =
        conversations.find((c) => String(c.id) === String(activeId)) ||
        (requestedUserId
            ? {
                  id: Number(requestedUserId),
                  student: requestedName || `Student ${requestedUserId}`,
                  initials: (requestedName || `Student ${requestedUserId}`).substring(0, 2).toUpperCase(),
                  gradient: "from-blue-500 to-indigo-600",
              }
            : null);

    const send = async () => {
        if ((!input.trim() && !attachment) || !activeId) return;

        try {
            await MessagesAPI.sendMessage(activeId, input, attachment);
            
            // Optimistic update
            const optimisticMsg = {
                id: Date.now(),
                from: "tutor",
                text: input.trim() || attachment?.name || "",
                time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                attachment,
            };
            setMessages((prev) => [...prev, optimisticMsg]);
            setInput("");
            setAttachment(null);
        } catch (error) {
            console.error("Failed to send message:", error);
        }
    };

    const handleFileSelect = (event) => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (file.size > 5 * 1024 * 1024) {
            console.error("Attachment too large");
            return;
        }

        const reader = new FileReader();
        reader.onload = () => {
            setAttachment({
                name: file.name,
                type: file.type || "application/octet-stream",
                size: file.size,
                data_url: reader.result,
            });
        };
        reader.readAsDataURL(file);
        event.target.value = "";
    };

    const toggleSelectionMode = () => {
        setSelectionMode((prev) => !prev);
        setSelectedMessageIds([]);
    };

    const toggleMessageSelection = (messageId) => {
        setSelectedMessageIds((prev) =>
            prev.includes(messageId)
                ? prev.filter((id) => id !== messageId)
                : [...prev, messageId]
        );
    };

    const handleDeleteSelected = async () => {
        if (!selectedMessageIds.length) return;

        try {
            const response = await MessagesAPI.deleteMessages(selectedMessageIds);
            const deletedIds = response?.deleted_ids || selectedMessageIds;
            setMessages((prev) => prev.filter((msg) => !deletedIds.includes(msg.id)));
            setSelectedMessageIds([]);
            setSelectionMode(false);
        } catch (error) {
            console.error("Failed to delete selected messages:", error);
        }
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
                                onClick={() => {
                                    setActiveId(c.id);
                                    setSearchParams({ user: c.id, name: c.student }, { replace: true });
                                }}
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
                                onClickCapture={() => setSearchParams({}, { replace: true })}
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
                            <div className="ml-auto flex items-center gap-2">
                                {selectionMode && selectedMessageIds.length > 0 && (
                                    <button
                                        type="button"
                                        onClick={handleDeleteSelected}
                                        className="px-3 py-2 rounded-xl bg-red-50 text-red-600 text-xs font-semibold hover:bg-red-100 transition"
                                    >
                                        Delete Selected ({selectedMessageIds.length})
                                    </button>
                                )}
                                <button
                                    type="button"
                                    onClick={toggleSelectionMode}
                                    className={`px-3 py-2 rounded-xl text-xs font-semibold transition ${
                                        selectionMode
                                            ? "bg-gray-900 text-white"
                                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                    }`}
                                >
                                    {selectionMode ? "Cancel" : "Select"}
                                </button>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto scrollbar-hide p-4 space-y-3">
                            {messages.map((msg) => (
                                <div
                                    key={msg.id}
                                    className={`flex ${msg.from === "tutor" ? "justify-end" : "justify-start"
                                        }`}
                                >
                                    <div
                                        className={`flex items-start gap-2 max-w-[85%] ${
                                            msg.from === "tutor" ? "ml-auto flex-row-reverse" : ""
                                        }`}
                                    >
                                        {selectionMode && msg.canDelete && (
                                            <label className="pt-2">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedMessageIds.includes(msg.id)}
                                                    onChange={() => toggleMessageSelection(msg.id)}
                                                    className="w-4 h-4 rounded border-gray-300 text-tutor focus:ring-tutor"
                                                />
                                            </label>
                                        )}
                                        <div
                                            className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm ${
                                                msg.from === "tutor"
                                                    ? "bg-tutor text-white rounded-br-md"
                                                    : "bg-gray-100 text-gray-900 rounded-bl-md"
                                            } ${
                                                selectedMessageIds.includes(msg.id)
                                                    ? "ring-2 ring-tutor/30"
                                                    : ""
                                            }`}
                                        >
                                            <div className="whitespace-pre-wrap break-words">
                                                {renderMessageContent(msg.text)}
                                            </div>
                                            {msg.attachment?.data_url && (
                                                <a
                                                    href={msg.attachment.data_url}
                                                    download={msg.attachment.name}
                                                    className={`mt-2 block text-xs underline ${msg.from === "tutor" ? "text-teal-100" : "text-tutor"}`}
                                                >
                                                    {msg.attachment.name}
                                                </a>
                                            )}
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
                                </div>
                            ))}
                        </div>

                        {/* Input bar */}
                        <div className="flex items-center gap-2 p-3 border-t border-gray-100 flex-shrink-0">
                            <label className="w-10 h-10 rounded-xl border border-gray-200 bg-white text-gray-500 flex items-center justify-center hover:bg-gray-50 cursor-pointer transition">
                                <span className="material-icons-round text-lg">attach_file</span>
                                <input type="file" className="hidden" onChange={handleFileSelect} />
                            </label>
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
                                disabled={!input.trim() && !attachment}
                                className="w-10 h-10 rounded-xl bg-tutor hover:bg-teal-700 disabled:opacity-40 disabled:cursor-not-allowed text-white flex items-center justify-center transition"
                            >
                                <span className="material-icons-round text-lg">
                                    send
                                </span>
                            </button>
                        </div>
                        {attachment && (
                            <div className="px-3 pb-3 text-xs text-gray-500">
                                Attached: <span className="font-medium text-gray-700">{attachment.name}</span>
                            </div>
                        )}
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
