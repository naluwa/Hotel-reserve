import { useState } from "react";
import { Button, Card, Input } from "../components/base";

export default function ContactPage({ showToast }) {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [isSending, setIsSending] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      showToast?.("Thank you! Your message has been sent to our concierge team.", "success");
      setForm({ name: "", email: "", subject: "", message: "" });
    }, 600);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 space-y-10">
      {/* Header */}
      <div className="rounded-2xl border border-cashmere-700 bg-cashmere-900 p-8 lg:p-10 text-center max-w-3xl mx-auto">
        <p className="eyebrow">Contact & Location</p>
        <h1 className="mt-3 font-serif text-4xl text-white sm:text-5xl">
          Get in Touch
        </h1>
        <p className="mt-3 text-sm text-slate-300">
          Have questions about your stay or special requests? Reach out to our 24/7 concierge desk.
        </p>
      </div>

      {/* Main Grid: Info Section (Left) & Map / Inquiry Form (Right) */}
      <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">
        {/* Left Column: Structured Information */}
        <div className="rounded-2xl border border-cashmere-700 bg-cashmere-900 p-6 space-y-6">
          <h2 className="text-xl font-serif text-white font-semibold border-b border-cashmere-700 pb-3">
            Concierge & Location
          </h2>

          <div className="space-y-6 text-sm">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded border border-brass-subtle bg-heritage-900 text-brass">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-white">Location</h3>
                <p className="mt-0.5 text-slate-300">35200 S. Dixie Hwy, Florida City, FL 33034</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded border border-brass-subtle bg-heritage-900 text-brass">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-white">Phone</h3>
                <p className="mt-0.5 font-mono text-slate-300">+1 (305) 247-3414</p>
                <p className="text-xs text-slate-400">Available 24/7</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded border border-brass-subtle bg-heritage-900 text-brass">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-white">Email</h3>
                <p className="mt-0.5 text-slate-300">reservations@grandreserve.com</p>
                <p className="text-xs text-slate-400">Response within 2 hours</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded border border-brass-subtle bg-heritage-900 text-brass">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-white">Hours of Operation</h3>
                <p className="mt-0.5 text-slate-300">Front Desk: 24 Hours / 7 Days</p>
                <p className="text-xs text-slate-400">Reservations: 6:00 AM - 11:00 PM</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Google Map Embed & Send Message Form */}
        <div className="space-y-6 flex flex-col">
          {/* Map View */}
          <div className="overflow-hidden rounded-xl border border-cashmere-700 bg-heritage-900 h-64">
            <iframe
              title="Hotel Location Map"
              src="https://maps.google.com/maps?q=35200%20S.%20Dixie%20Hwy,%20Homestead,%20FL%2033034&t=&z=14&ie=UTF8&iwloc=&output=embed"
              className="w-full h-full border-0 filter brightness-90 contrast-105"
              loading="lazy"
              allowFullScreen
            ></iframe>
          </div>

          {/* Inquiry Form */}
          <div className="p-6 bg-cashmere-900 border border-cashmere-700 rounded-xl flex-1">
            <h3 className="text-xl font-serif text-white font-semibold mb-4">
              Send a Direct Message
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  label="Your Name"
                  placeholder="Enter your name here"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
                <Input
                  label="Email Address"
                  type="email"
                  placeholder="Enter your email address here"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>

              <Input
                label="Subject"
                placeholder="Enter subject here"
                required
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
              />

              <div>
                <label className="text-xs uppercase tracking-wider text-slate-400 block mb-1 font-semibold">
                  Message
                </label>
                <textarea
                  rows="4"
                  required
                  placeholder="Enter your message here"
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full rounded border border-cashmere-700 bg-heritage-900 p-3 text-sm text-white focus:outline-none focus:border-brass"
                ></textarea>
              </div>

              <Button type="submit" fullWidth disabled={isSending}>
                {isSending ? "Sending..." : "Send Message"}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
