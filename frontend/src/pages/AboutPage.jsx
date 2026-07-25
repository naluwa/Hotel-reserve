import { ROOM_TYPES } from "../config/roomTypes";
import lobbyImage from "../assets/img/lobby.jpg";
import poolImage from "../assets/img/pool.jpg";

const highlights = [
  {
    title: "Rooms & suites",
    desc: "Seventy-two rooms and suites overlooking the Indian Ocean or the Colombo skyline, each furnished with local hardwoods and hand-woven textiles.",
  },
  {
    title: "Dining & service",
    desc: "Two restaurants: Kaluwamodara, serving coastal Sri Lankan cuisine, and The Terrace, an all-day international kitchen with garden seating.",
  },
  {
    title: "Meetings & events",
    desc: "Four private event rooms accommodating 20 to 200 guests, with dedicated AV support and in-house catering.",
  },
  {
    title: "Guest support",
    desc: "Round-the-clock front desk, airport transfers from BIA, and a multilingual concierge team available throughout your stay.",
  },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-10 px-4 py-12 sm:px-6 lg:px-8">
      {/* Hero text */}
      <div className="mx-auto max-w-4xl text-center">
        <p className="text-sm font-medium uppercase tracking-[0.24em] text-brass">
          Discover Grand Reserve Colombo
        </p>
        <h1 className="mt-4 font-serif text-4xl font-semibold text-white sm:text-5xl">
          Where Colombo meets the ocean.
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-300">
          Situated on Galle Road in the heart of Colombo 03, Grand Reserve
          combines colonial-era architecture with contemporary hospitality, just
          minutes from the Galle Face Green and the city's financial district.
        </p>
      </div>

      {/* Hero image */}
      <div className="relative h-72 overflow-hidden rounded-[1.75rem] border border-white/10 sm:h-96">
        <img
          src={lobbyImage}
          alt="Grand Reserve Colombo lobby"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-heritage-900/60 via-transparent to-transparent" />
      </div>

      {/* Highlights grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {highlights.map((item, idx) => (
          <div
            key={idx}
            className="rounded-[1.5rem] border border-white/10 bg-cashmere-900/80 p-8"
          >
            <h3 className="font-serif text-2xl font-semibold text-white">
              {item.title}
            </h3>
            <p className="mt-4 text-sm leading-6 text-slate-300">{item.desc}</p>
          </div>
        ))}
      </div>

      {/* Details section */}
      <section className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
        <div className="space-y-6 rounded-[1.5rem] border border-white/10 bg-heritage-900/70 p-8">
          <h2 className="font-serif text-3xl font-semibold text-white">
            Service built for clarity.
          </h2>
          <p className="text-sm leading-7 text-slate-300">
            Book directly with consistent pricing, clear arrival details, and a
            team that handles the details, so your stay in Colombo is effortless
            from the moment you arrive.
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <p className="text-sm text-slate-400">Room type options</p>
              <p className="font-semibold text-white">
                {ROOM_TYPES.join(", ")}
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-slate-400">Concierge</p>
              <p className="font-semibold text-white">24/7 guest support</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-slate-400">Location</p>
              <p className="font-semibold text-white">Colombo 03, Sri Lanka</p>
            </div>
          </div>
        </div>

        {/* Resort quick-info card */}
        <div className="space-y-4 overflow-hidden rounded-[1.5rem] bg-[#11141c]">
          <div className="relative h-40 overflow-hidden">
            <img
              src={poolImage}
              alt="Grand Reserve rooftop pool"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#11141c] via-[#11141c]/30 to-transparent" />
          </div>
          <div className="grid gap-4 p-6 text-sm text-slate-300 sm:grid-cols-2">
            <div>
              <p className="text-slate-400">Check-in</p>
              <p className="font-semibold text-white">2:00 PM</p>
            </div>
            <div>
              <p className="text-slate-400">Check-out</p>
              <p className="font-semibold text-white">12:00 PM</p>
            </div>
            <div>
              <p className="text-slate-400">Address</p>
              <p className="font-semibold text-white">
                64 Galle Rd, Colombo 03
              </p>
            </div>
            <div>
              <p className="text-slate-400">Email</p>
              <p className="font-semibold text-white">
                grandreserve9@gmail.com
              </p>
            </div>
            <div>
              <p className="text-slate-400">Phone</p>
              <p className="font-semibold text-white">+94012345689</p>
            </div>
            <div>
              <p className="text-slate-400">Airport transfer</p>
              <p className="font-semibold text-white">Available on request</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
