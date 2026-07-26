import { useEffect, useMemo, useState, useCallback } from "react";
import { Button, Input } from "../base";
import {
  fetchGuestMessages,
  markGuestMessageAsRead,
  replyToGuestMessage,
  deleteGuestMessage,
} from "../../services/api";

export default function MessagesPanel({ token, showToast }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [replyingId, setReplyingId] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);

  const loadMessages = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchGuestMessages(token);
      setMessages(data || []);
    } catch (err) {
      showToast?.(err.message || "Could not load messages", "error");
    } finally {
      setLoading(false);
    }
  }, [token, showToast]);

  useEffect(() => {
    loadMessages();
  }, [loadMessages]);

  const markAsRead = async (id) => {
    try {
      const updated = await markGuestMessageAsRead(id, token);
      setMessages((current) =>
        current.map((item) => (item.id === id ? updated : item)),
      );
    } catch (err) {
      showToast?.(err.message || "Could not update message", "error");
    }
  };

  const handleSendReply = async (id) => {
    if (!replyText.trim()) {
      showToast?.("Please type a reply message before sending.", "error");
      return;
    }

    setIsSubmittingReply(true);
    try {
      const updated = await replyToGuestMessage(id, replyText.trim(), token);
      setMessages((current) =>
        current.map((item) => (item.id === id ? updated : item)),
      );
      showToast?.("Reply sent to guest successfully.", "success");
      setReplyingId(null);
      setReplyText("");
    } catch (err) {
      showToast?.(err.message || "Failed to send reply", "error");
    } finally {
      setIsSubmittingReply(false);
    }
  };

  const unreadCount = useMemo(
    () => messages.filter((item) => !item.read).length,
    [messages],
  );

  return (
    <div className="space-y-4">
      <div className="rounded-[1.5rem] border border-cashmere-700 bg-cashmere-900 p-5 shadow-card">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-[0.35em] text-slate-400">
              Inbox
            </p>
            <h2 className="font-serif text-2xl text-white">Guest messages</h2>
          </div>
          <div className="flex items-center gap-2">
            <div className="rounded-full border border-brass/20 bg-brass/10 px-3 py-1 text-sm font-semibold text-brass">
              {unreadCount} unread
            </div>
            <button
              onClick={loadMessages}
              className="rounded-full border border-cashmere-700 bg-heritage-900 px-3 py-1 text-xs text-slate-300 transition hover:text-white"
            >
              Refresh
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="rounded-[1.5rem] border border-cashmere-700 bg-cashmere-900 p-10 text-center text-sm text-slate-400">
          Loading messages…
        </div>
      ) : messages.length === 0 ? (
        <div className="rounded-[1.5rem] border border-cashmere-700 bg-cashmere-900 p-10 text-center text-sm text-slate-400">
          No guest messages yet.
        </div>
      ) : (
        <div className="space-y-4">
          {messages.map((message) => (
            <article
              key={message.id}
              className={`rounded-[1.5rem] border p-5 ${
                message.replied
                  ? "border-cashmere-700 bg-cashmere-900"
                  : message.read
                    ? "border-cashmere-700 bg-cashmere-900/80"
                    : "border-brass/40 bg-heritage-900"
              }`}
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold text-white">
                      {message.senderName || "Guest"}
                    </h3>
                    {!message.read && (
                      <span className="rounded-full bg-brass/15 px-2 py-1 text-[10px] uppercase tracking-[0.24em] text-brass">
                        New
                      </span>
                    )}
                    {message.replied && (
                      <span className="rounded-full bg-emerald-950 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.24em] text-emerald-400 border border-emerald-800">
                        Replied
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-slate-400">
                    {message.senderEmail}
                  </p>
                  <p className="mt-3 text-sm font-semibold text-white">
                    {message.subject}
                  </p>
                  <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-300">
                    {message.message}
                  </p>
                </div>
                <div className="text-xs uppercase tracking-[0.24em] text-slate-500">
                  {new Date(message.createdAt).toLocaleString()}
                </div>
              </div>

              {/* Display existing reply */}
              {message.replied && message.replyMessage && (
                <div className="mt-4 rounded-xl border border-brass/30 bg-heritage-900/90 p-4">
                  <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-2">
                    <span className="text-xs font-semibold text-brass">
                      Concierge Reply ({message.repliedBy || "Admin"})
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {new Date(message.repliedAt).toLocaleString()}
                    </span>
                  </div>
                  <p className="whitespace-pre-wrap text-sm text-slate-200">
                    {message.replyMessage}
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="mt-4 flex flex-wrap items-center gap-3">
                {!message.read && (
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => markAsRead(message.id)}
                  >
                    Mark as read
                  </Button>
                )}

                <Button
                  type="button"
                  size="sm"
                  variant={replyingId === message.id ? "secondary" : "primary"}
                  onClick={() => {
                    if (replyingId === message.id) {
                      setReplyingId(null);
                      setReplyText("");
                    } else {
                      setReplyingId(message.id);
                      setReplyText(message.replyMessage || "");
                    }
                  }}
                >
                  {replyingId === message.id
                    ? "Cancel Reply"
                    : message.replied
                      ? "Edit Reply"
                      : "Reply to Guest"}
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={async () => {
                    const confirmed = window.confirm(
                      "Delete this message permanently?",
                    );
                    if (!confirmed) {
                      return;
                    }
                    try {
                      await deleteGuestMessage(message.id, token);
                      setMessages((current) =>
                        current.filter((item) => item.id !== message.id),
                      );
                      showToast?.("Message deleted successfully.", "success");
                    } catch (err) {
                      showToast?.(
                        err.message || "Could not delete message",
                        "error",
                      );
                    }
                  }}
                >
                  Delete
                </Button>
              </div>

              {/* Inline Reply Textarea */}
              {replyingId === message.id && (
                <div className="mt-4 space-y-3 rounded-xl border border-brass/30 bg-heritage-900 p-4">
                  <Input
                    label="Reply message to guest"
                    as="textarea"
                    rows={4}
                    placeholder="Type your response to the guest..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                  />
                  <div className="flex justify-end gap-2">
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setReplyingId(null);
                        setReplyText("");
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      disabled={isSubmittingReply}
                      onClick={() => handleSendReply(message.id)}
                    >
                      {isSubmittingReply ? "Sending..." : "Send Reply"}
                    </Button>
                  </div>
                </div>
              )}
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
