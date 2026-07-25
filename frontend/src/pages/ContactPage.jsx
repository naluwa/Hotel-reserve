import { useState, useEffect } from "react";
import { Button, Input } from "../components/base";
import { submitGuestMessage } from "../services/api";
import { useAuth } from "../hooks/useAuth";

export default function ContactPage({
  showToast,
  scrollToForm,
  onScrollHandled,
}) {
  const auth = useAuth(showToast);

  const [form, setForm] = useState({
    name: auth.userFullName || "",
    email: auth.userEmail || "",
    subject: "",
    message: "",
  });

  useEffect(() => {
    setForm((prev) => ({
      ...prev,
      name: prev.name || auth.userFullName || "",
      email: prev.email || auth.userEmail || "",
    }));
  }, [auth.userFullName, auth.userEmail]);

  const [isSending, setIsSending] = useState(false);
  const [hasScrolledToForm, setHasScrolledToForm] = useState(false);

  useEffect(() => {
    if (scrollToForm && !hasScrolledToForm) {
      const target = document.getElementById("contact-form");
      target?.scrollIntoView({ behavior: "smooth", block: "start" });
      setHasScrolledToForm(true);
      onScrollHandled?.();
    }
  }, [scrollToForm, hasScrolledToForm, onScrollHandled]);

  const handleChange = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmed = {
      name: form.name.trim(),
      email: form.email.trim(),
      subject: form.subject.trim(),
      message: form.message.trim(),
    };

    if (
      !trimmed.name ||
      !trimmed.email ||
      !trimmed.subject ||
      !trimmed.message
    ) {
      showToast?.(
        "Please complete every field before sending your message.",
        "error",
      );
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed.email)) {
      showToast?.("Please enter a valid email address.", "error");
      return;
    }

    setIsSending(true);
    try {
      await submitGuestMessage(trimmed);
      showToast?.(
        "Thank you! Your message has been sent to our concierge team.",
        "success",
      );
      setForm({
        name: auth.userFullName || "",
        email: auth.userEmail || "",
        subject: "",
        message: "",
      });
    } catch (err) {
      const errorMessage =
        err && err.status === 403
          ? "Your message was blocked by the server. Please try again later or contact support."
          : err?.message || "Unable to send your message right now.";
      showToast?.(errorMessage, "error");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-12 sm:px-6 lg:px-8">
      <div className="section-shell mx-auto max-w-3xl p-8 text-center lg:p-10">
        <p className="eyebrow">Contact &amp; location</p>
        <h1 className="mt-3 font-serif text-4xl text-white sm:text-5xl">
          Get in touch
        </h1>
        <p className="mt-3 text-sm text-slate-300">
          Have questions about your stay or a special request? Our concierge
          team is available around the clock.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">
        {/* Left column contact details */}
        <div className="section-shell space-y-6 p-6">
          <h2 className="border-b border-white/10 pb-3 font-serif text-xl font-semibold text-white">
            Concierge &amp; location
          </h2>

          <div className="space-y-6 text-sm">
            {/* Address */}
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-brass/20 bg-brass/10 text-brass">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-white">Location</h3>
                <p className="mt-0.5 text-slate-300">
                  64 Galle Road, Colombo 03, Sri Lanka
                </p>
              </div>
            </div>

            {/* Phone */}
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-brass/20 bg-brass/10 text-brass">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-white">Phone</h3>
                <p className="mt-0.5 font-mono text-slate-300">+94012345689</p>
                <p className="text-xs text-slate-400">Available 24/7</p>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-brass/20 bg-brass/10 text-brass">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-white">Email</h3>
                <p className="mt-0.5 text-slate-300">grandreserve9@gmail.com</p>
                <p className="text-xs text-slate-400">
                  Response within 2 hours
                </p>
              </div>
            </div>

            {/* Hours */}
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-brass/20 bg-brass/10 text-brass">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-white">Hours of operation</h3>
                <p className="mt-0.5 text-slate-300">
                  Front desk: 24 hours / 7 days
                </p>
                <p className="text-xs text-slate-400">
                  Reservations: 6:00 AM – 11:00 PM (IST)
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right column — map + message form */}
        <div className="flex flex-col gap-6">
          <div className="h-64 overflow-hidden rounded-[1.5rem] border border-white/10 bg-heritage-900/70">
            <iframe
              title="Grand Reserve Colombo Location"
              src="https://maps.google.com/maps?q=64+Galle+Road+Colombo+03+Sri+Lanka&t=&z=15&ie=UTF8&iwloc=&output=embed"
              className="h-full w-full border-0 brightness-90 contrast-105"
              loading="lazy"
              allowFullScreen
            />
          </div>

          <div className="section-shell flex-1 p-6" id="contact-form">
            <h3 className="mb-4 font-serif text-xl font-semibold text-white">
              Send a direct message
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  label="Your name"
                  placeholder="Enter your name here"
                  required
                  value={form.name}
                  onChange={handleChange("name")}
                />
                <Input
                  label="Email address"
                  type="email"
                  placeholder="Enter your email address here"
                  required
                  value={form.email}
                  onChange={handleChange("email")}
                />
              </div>

              <Input
                label="Subject"
                placeholder="Enter subject here"
                required
                value={form.subject}
                onChange={handleChange("subject")}
              />

              <Input
                label="Message"
                as="textarea"
                rows={4}
                required
                placeholder="Enter your message here"
                value={form.message}
                onChange={handleChange("message")}
              />

              <Button type="submit" fullWidth disabled={isSending}>
                {isSending ? "Sending…" : "Send message"}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
