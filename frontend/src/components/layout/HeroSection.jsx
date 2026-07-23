import { Button } from "../base";

export default function HeroSection() {
  const scrollToRooms = () => {
    document.getElementById("rooms-section")?.scrollIntoView({
      block: "start",
    });
  };

  return (
    <section className="rounded-2xl border border-cashmere-700 bg-cashmere-900 p-8 sm:p-10 lg:p-12">
      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div className="max-w-2xl space-y-6">
          <div className="inline-flex items-center gap-2 rounded border border-cashmere-700 bg-heritage-900 px-3 py-1.5">
            <span className="text-[10px] font-semibold uppercase tracking-[0.34em] text-brass">
              Curated luxury stays
            </span>
          </div>

          <h1 className="font-serif text-5xl leading-[0.95] text-white sm:text-6xl lg:text-7xl">
            Elevated stays for every kind of getaway.
          </h1>
          <p className="max-w-xl text-base leading-7 text-slate-300">
            Discover elegant rooms, effortless booking, and a calm arrival
            experience designed for business trips, weekend escapes, and
            long-awaited rest.
          </p>

          <div className="flex flex-wrap gap-3">
            <Button type="button" onClick={scrollToRooms}>
              Explore rooms
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={scrollToRooms}
            >
              Check availability
            </Button>
          </div>
        </div>

        <div className="rounded-xl border border-cashmere-700 bg-heritage-900 p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="eyebrow">This week</p>
              <p className="mt-2 text-2xl font-semibold text-white">
                A refined stay, from arrival to checkout
              </p>
            </div>
            <div className="rounded border border-cashmere-700 bg-cashmere-900 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-300">
              4.9/5 rating
            </div>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg border border-cashmere-700 bg-cashmere-900 p-4">
              <p className="text-[10px] uppercase tracking-[0.35em] text-slate-500">
                Instant booking
              </p>
              <p className="mt-2 text-lg font-semibold text-white">
                Reserve in seconds
              </p>
            </div>
            <div className="rounded-lg border border-cashmere-700 bg-cashmere-900 p-4">
              <p className="text-[10px] uppercase tracking-[0.35em] text-slate-500">
                Secure stays
              </p>
              <p className="mt-2 text-lg font-semibold text-white">
                Protected checkout
              </p>
            </div>
            <div className="rounded-lg border border-cashmere-700 bg-cashmere-900 p-4 sm:col-span-2">
              <p className="text-[10px] uppercase tracking-[0.35em] text-slate-500">
                Flexible plans
              </p>
              <p className="mt-2 text-lg font-semibold text-white">
                Choose dates and room styles without pressure
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
