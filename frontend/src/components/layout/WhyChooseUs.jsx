import { formatLKR } from "../../utils/currency";

const highlights = [
  { label: "Flexible dates", value: "Book by day, not by stress" },
  { label: "Fast check-in", value: "A shorter path to your room" },
  { label: "Best value", value: `From ${formatLKR(14500)} / night` },
];

export default function WhyChooseUs() {
  return (
    <section className="rounded-2xl border border-cashmere-700 bg-cashmere-900 p-6 lg:p-8">
      <p className="eyebrow">Why guests choose us</p>
      <h2 className="mt-3 font-serif text-3xl text-white sm:text-4xl">
        A calmer way to book and unwind
      </h2>
      <p className="mt-3 text-sm leading-6 text-slate-400 max-w-3xl">
        Every detail is designed to feel effortless, from flexible dates to a
        smoother arrival experience.
      </p>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {highlights.map((item) => (
          <div
            key={item.label}
            className="rounded-xl border border-cashmere-700 bg-heritage-900 p-5"
          >
            <p className="text-[10px] uppercase tracking-[0.35em] text-slate-500">
              {item.label}
            </p>
            <p className="mt-2 text-base font-semibold text-white">
              {item.value}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-xl border border-cashmere-700 bg-heritage-900 p-5">
        <div className="flex items-center gap-3">
          <div>
            <p className="text-sm font-semibold text-white">
              Concierge-ready stays
            </p>
            <p className="text-sm text-slate-400">
              Thoughtful service, flexible check-in, and room upgrades
              available on request.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
