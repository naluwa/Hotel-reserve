import { Card } from "../components/base";

export default function AboutPage() {
  const highlights = [
    {
      title: "Luxury Accommodations",
      desc: "Thoughtfully crafted rooms and suites featuring bespoke furnishings, premium ocean and garden views, and climate control.",
    },
    {
      title: "Exquisite Fine Dining",
      desc: "Culinary excellence curated by world-class chefs utilizing organic local produce and fresh coastal delicacies.",
    },
    {
      title: "Wellness & Spa",
      desc: "Holistic wellness sanctuaries offering custom spa treatments, therapeutic massage, and serene meditation suites.",
    },
    {
      title: "24/7 Dedicated Concierge",
      desc: "Personalized service ensuring tailored guest itineraries, private transfers, and effortless stay management.",
    },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 space-y-12">
      {/* Header Banner */}
      <div className="rounded-2xl border border-cashmere-700 bg-cashmere-900 p-8 lg:p-12 text-center max-w-4xl mx-auto">
        <p className="eyebrow">Discover Grand Reserve</p>
        <h1 className="mt-4 font-serif text-4xl font-semibold text-white sm:text-5xl">
          A Sanctuary of Elegance & Serenity
        </h1>
        <p className="mt-4 text-base leading-7 text-slate-300">
          Welcome to Grand Reserve Hotel & Resort. Conceived as a peaceful haven where luxury meets genuine hospitality, we offer guests an unforgettable escape.
        </p>
      </div>

      {/* Feature Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {highlights.map((item, idx) => (
          <div
            key={idx}
            className="p-8 bg-cashmere-900 border border-cashmere-700 rounded-xl space-y-3"
          >
            <div className="text-brass text-sm font-semibold tracking-widest uppercase">
              0{idx + 1}
            </div>
            <h3 className="font-serif text-2xl text-white font-semibold">
              {item.title}
            </h3>
            <p className="text-sm leading-6 text-slate-300">
              {item.desc}
            </p>
          </div>
        ))}
      </div>

      {/* Heritage & Values */}
      <section className="rounded-2xl border border-cashmere-700 bg-cashmere-900 p-8 lg:p-12 grid gap-8 lg:grid-cols-2 lg:items-center">
        <div>
          <p className="eyebrow">Our Philosophy</p>
          <h2 className="mt-3 font-serif text-3xl text-white sm:text-4xl">
            Uncompromising Standards & Tailored Comfort
          </h2>
          <p className="mt-4 text-sm leading-7 text-slate-300">
            At Grand Reserve, we believe hospitality is an art form. Every room layout, lighting design, and guest interaction is refined to create an atmosphere of calm, comfort, and luxury.
          </p>
          <div className="mt-6 flex flex-wrap gap-3 text-xs font-semibold uppercase tracking-wider text-slate-300">
            <span className="rounded border border-cashmere-700 bg-heritage-900 px-3 py-1.5">
              Oceanfront Retreat
            </span>
            <span className="rounded border border-cashmere-700 bg-heritage-900 px-3 py-1.5">
              Private Beach Access
            </span>
            <span className="rounded border border-cashmere-700 bg-heritage-900 px-3 py-1.5">
              Eco-Conscious Operations
            </span>
          </div>
        </div>

        <div className="rounded-xl border border-cashmere-700 bg-heritage-900 p-8 space-y-4">
          <h3 className="text-lg font-semibold text-white">Resort Information</h3>
          <div className="space-y-3 text-sm text-slate-300">
            <div className="flex justify-between border-b border-cashmere-800 pb-2">
              <span className="text-slate-400">Check-in Time</span>
              <span className="font-semibold text-white">2:00 PM</span>
            </div>
            <div className="flex justify-between border-b border-cashmere-800 pb-2">
              <span className="text-slate-400">Check-out Time</span>
              <span className="font-semibold text-white">12:00 PM (Midday)</span>
            </div>
            <div className="flex justify-between border-b border-cashmere-800 pb-2">
              <span className="text-slate-400">Location</span>
              <span className="font-semibold text-white">Colombo 03, Sri Lanka</span>
            </div>
            <div className="flex justify-between border-b border-cashmere-800 pb-2">
              <span className="text-slate-400">Contact Email</span>
              <span className="font-semibold text-white">reservations@grandreserve.com</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
