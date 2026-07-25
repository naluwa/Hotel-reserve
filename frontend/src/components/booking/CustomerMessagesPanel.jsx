import { useState, useEffect, useCallback } from "react";
import { Button, Input, Card } from "../base";
import { fetchMyGuestMessages, submitGuestMessage } from "../../services/api";

export default function CustomerMessagesPanel({ authToken, showToast, setView, VIEWS, userFullName, userEmail }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showNewForm, setShowNewForm] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const [form, setForm] = useState({
    subject: "",
    message: "",
  });

  const loadMessages = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchMyGuestMessages(authToken);
      setMessages(data || []);
    } catch (err) {
      showToast?.(err.message || "Unable to load message history", "error");
    } finally {
      setLoading(false);
    }
  }, [authToken, showToast]);

  useEffect(() => {
    loadMessages();
  }, [loadMessages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    const trimmedSubject = form.subject.trim();
    const trimmedMessage = form.message.trim();

    if (!trimmedSubject || !trimmedMessage) {
      showToast?.("Please complete all fields.", "error");
      return;
    }

    setIsSending(true);
    try {
      await submitGuestMessage({
        name: userFullName || "Guest",
        email: userEmail || "",
        subject: trimmedSubject,
        message: trimmedMessage,
      });
      showToast?.("Your message has been sent to our concierge team.", "success");
      setForm({ subject: "", message: "" });
      setShowNewForm(false);
      await loadMessages();
    } catch (err) {
      showToast?.(err.message || "Failed to send message", "error");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl space-y-8 px-4 py-10 sm:px-6 lg:px-8">
      {/* Shell Header */}
      <div className="section-shell p-6 lg:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="eyebrow">Guest Concierge</p>
            <h1 className="mt-1 font-serif text-3xl text-white sm:text-4xl">
              My Messages &amp; Inquiries
            </h1>
            <p className="mt-2 text-sm text-slate-300">
              Track your conversations with the Grand Reserve Colombo concierge team.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowNewForm((prev) => !prev)}
            >
              {showNewForm ? "Cancel" : "New Message"}
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setView?.(VIEWS?.CONTACT)}
            >
              Contact Info
            </Button>
          </div>
        </div>
      </div>

      {/* New Message Form */}
      {showNewForm && (
        <Card className="border-brass/30 bg-cashmere-900/90 p-6 shadow-card">
          <h3 className="mb-4 font-serif text-xl text-white">
            Send a new message to concierge
          </h3>
          <form onSubmit={handleSendMessage} className="space-y-4">
            <Input
              label="Subject"
              placeholder="e.g. Airport Transfer or Room Special Request"
              required
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
            />
            <Input
              label="Message"
              as="textarea"
              rows={4}
              required
              placeholder="Write your request or question here..."
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
            />
            <div className="flex justify-end gap-3 pt-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setShowNewForm(false)}
              >
                Cancel
              </Button>
              <Button type="submit" size="sm" disabled={isSending}>
                {isSending ? "Sending…" : "Send Message"}
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Message List */}
      {loading ? (
        <div className="section-shell p-12 text-center text-sm text-slate-400">
          Loading your message history…
        </div>
      ) : messages.length === 0 ? (
        <div className="section-shell p-12 text-center">
          <svg
            className="mx-auto h-12 w-12 text-slate-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
              d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
          <h3 className="mt-4 font-serif text-lg font-semibold text-white">
            No message history found
          </h3>
          <p className="mt-2 text-sm text-slate-400">
            Have a question about your stay? Reach out to our concierge desk anytime.
          </p>
          <Button
            type="button"
            className="mt-6"
            onClick={() => setShowNewForm(true)}
          >
            Send your first message
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {messages.map((item) => (
            <article
              key={item.id}
              className={`rounded-[1.5rem] border p-6 shadow-card transition ${
                item.replied
                  ? "border-brass/40 bg-cashmere-900/90"
                  : "border-white/10 bg-cashmere-900/70"
              }`}
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-serif text-lg font-semibold text-white">
                      {item.subject}
                    </h3>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[10px] uppercase font-bold tracking-wider ${
                        item.replied
                          ? "bg-brass/20 text-brass border border-brass/30"
                          : "bg-slate-800 text-slate-400 border border-slate-700"
                      }`}
                    >
                      {item.replied ? "Replied by Concierge" : "Pending Reply"}
                    </span>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-slate-300">
                    {item.message}
                  </p>
                </div>
                <div className="shrink-0 text-xs text-slate-500">
                  {new Date(item.createdAt).toLocaleString()}
                </div>
              </div>

              {/* Admin Reply Display */}
              {item.replied && item.replyMessage && (
                <div className="mt-5 rounded-2xl border border-brass/30 bg-heritage-900/90 p-4">
                  <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-3">
                    <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-brass">
                      <span className="h-2 w-2 rounded-full bg-brass" />
                      Grand Reserve Concierge
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {new Date(item.repliedAt).toLocaleString()}
                    </span>
                  </div>
                  <p className="whitespace-pre-wrap text-sm leading-6 text-slate-200">
                    {item.replyMessage}
                  </p>
                </div>
              )}
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
