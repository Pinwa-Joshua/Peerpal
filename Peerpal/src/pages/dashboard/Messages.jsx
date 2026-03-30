import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { MessagesAPI } from "../../services/api";
import { useAuth } from "../../context/AuthContext";

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

export default function Messages() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [activeId, setActiveId] = useState(null);
    const [newMsg, setNewMsg] = useState("");
    const [attachment, setAttachment] = useState(null);
    const [selectionMode, setSelectionMode] = useState(false);
    const [selectedMessageIds, setSelectedMessageIds] = useState([]);
    const [conversations, setConversations] = useState([]);
    const [messages, setMessages] = useState([]);
    const { user: currentUser } = useAuth();
    const requestedUserId = searchParams.get("user");
    const requestedName = searchParams.get("name");

    useEffect(() => {
        if (!requestedUserId) return;
        setActiveId(Number(requestedUserId));
    }, [requestedUserId]);

    // Poll inbox contacts on an interval
    useEffect(() => {
        if (!currentUser) return;

        const fetchInbox = async () => {
            try {
                const inbox = await MessagesAPI.getInbox();
                if (!Array.isArray(inbox)) return;

                // Group by sender_id to unique conversations
                const sendersMap = new Map();
                inbox.forEach(m => {
                    const sId = m.sender_id === currentUser?.id ? m.receiver_id : m.sender_id;
                    const otherUser = m.sender_id === currentUser?.id ? m.receiver : m.sender;
                    const id = sId || "Unknown";
                    // keep latest message or all info
                    if (!sendersMap.has(id)) {
                        sendersMap.set(id, { ...m, otherUser });
                    } else {
                        const existing = sendersMap.get(id);
                        if (new Date(m.timestamp) > new Date(existing.timestamp)) {
                            sendersMap.set(id, { ...m, otherUser });
                        }
                    }
                });

                const formattedConvs = Array.from(sendersMap.values()).map(lastMsg => {
                    const senderId = lastMsg.sender_id === currentUser?.id ? lastMsg.receiver_id : lastMsg.sender_id;
                    const senderName = lastMsg.otherUser?.name || `User ${senderId}`;
                    return {
                        id: senderId,
                        name: senderName,
                        initials: senderName.substring(0, 2).toUpperCase(),
                        gradient: "from-blue-500 to-indigo-600",
                        lastMessage: lastMsg.content || "No message",
                        time: lastMsg.timestamp ? new Date(lastMsg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "",
                        unread: 0,
                    };
                });

                if (requestedUserId && !formattedConvs.some((conv) => String(conv.id) === String(requestedUserId))) {
                    const fallbackName = requestedName || `User ${requestedUserId}`;
                    formattedConvs.unshift({
                        id: Number(requestedUserId),
                        name: fallbackName,
                        initials: fallbackName.substring(0, 2).toUpperCase(),
                        gradient: "from-blue-500 to-indigo-600",
                        lastMessage: "Start the conversation",
                        time: "",
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
                    from: currentUser && (m.sender_id === currentUser.id || m.senderId === currentUser.id) ? "me" : "them",
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
                  name: requestedName || `User ${requestedUserId}`,
                  initials: (requestedName || `User ${requestedUserId}`).substring(0, 2).toUpperCase(),
                  gradient: "from-blue-500 to-indigo-600",
              }
            : null);

    const handleSend = async (e) => {
        e.preventDefault();
        if ((!newMsg.trim() && !attachment) || !activeId) return;

        try {
            await MessagesAPI.sendMessage(activeId, newMsg, attachment);

            // Optimistic update
            const optimisticMsg = {
                id: Date.now(),
                from: "me",
                text: newMsg || attachment?.name || "",
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                attachment,
            };
            setMessages((prev) => [...prev, optimisticMsg]);
            setNewMsg("");
            setAttachment(null);
        } catch (error) {
            console.error("Failed to send message:", error);
        }
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
                                onClick={() => {
                                    setActiveId(conv.id);
                                    setSearchParams({ user: conv.id, name: conv.name }, { replace: true });
                                }}
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
                                onClickCapture={() => setSearchParams({}, { replace: true })}
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
                        <div className="flex-1 overflow-y-auto scrollbar-hide px-5 py-4 space-y-3">
                            {messages.map((msg) => (
                                <div
                                    key={msg.id}
                                    className={`flex ${msg.from === "me"
                                        ? "justify-end"
                                        : "justify-start"
                                        }`}
                                >
                                    <div className="flex items-start gap-2 max-w-[85%]">
                                        {selectionMode && msg.canDelete && (
                                            <label className="pt-2">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedMessageIds.includes(msg.id)}
                                                    onChange={() => toggleMessageSelection(msg.id)}
                                                    className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                                                />
                                            </label>
                                        )}
                                        <div
                                            className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                                                msg.from === "me"
                                                    ? "bg-primary text-white rounded-br-md"
                                                    : "bg-gray-100 text-gray-900 rounded-bl-md"
                                            } ${
                                                selectedMessageIds.includes(msg.id)
                                                    ? "ring-2 ring-primary/30"
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
                                                    className={`mt-2 block text-xs underline ${msg.from === "me" ? "text-blue-100" : "text-primary"}`}
                                                >
                                                    {msg.attachment.name}
                                                </a>
                                            )}
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
                                </div>
                            ))}
                        </div>

                        {/* Input */}
                        <form
                            onSubmit={handleSend}
                            className="flex items-center gap-2 px-4 py-3 border-t border-gray-100 flex-shrink-0"
                        >
                            <label className="w-10 h-10 rounded-xl border border-gray-200 bg-white text-gray-500 flex items-center justify-center hover:bg-gray-50 cursor-pointer transition flex-shrink-0">
                                <span className="material-icons-round text-lg">attach_file</span>
                                <input type="file" className="hidden" onChange={handleFileSelect} />
                            </label>
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
                        {attachment && (
                            <div className="px-4 pb-3 text-xs text-gray-500">
                                Attached: <span className="font-medium text-gray-700">{attachment.name}</span>
                            </div>
                        )}
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
