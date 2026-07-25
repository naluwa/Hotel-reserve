import { formatLKR } from "../../utils/currency";
import { Button } from "../base";

const highlights = [
  {
    label: "Flexible dates",
    value: "Reserve by the night with no hidden fees or surcharges.",
  },
  {
    label: "Fast check-in",
    value: "Arrive after 2:00 PM, our team is ready when you are.",
  },
  {
    label: "Best value",
    value: `From ${formatLKR(4500)} / night`,
  },
];

export default function WhyChooseUs({ onSubmitRequest }) {
  return (
    <section className="section-shell p-6 lg:p-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          <p className="text-sm font-medium uppercase tracking-[0.24em] text-brass">
            The Grand Reserve Experience
          </p>
          <h2 className="mt-3 font-serif text-3xl text-white sm:text-4xl">
            Rooms, dining, and service made simple.
          </h2>
          <p className="mt-3 text-sm leading-6 text-slate-400">
            Clear information, direct booking, and a reliable stay experience in
            the heart of Colombo, from check-in to check-out.
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {highlights.map((item) => (
          <div
            key={item.label}
            className="motion-card rounded-[1.35rem] border border-white/10 bg-heritage-900/70 p-6"
          >
            <p className="text-[10px] uppercase tracking-[0.35em] text-slate-500">
              {item.label}
            </p>
            <p className="mt-4 text-base font-semibold text-white">
              {item.value}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-[1.35rem] border border-white/10 bg-heritage-900/70 p-5">
        <div className="flex flex-col gap-4 text-sm text-slate-300 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <span className="font-semibold text-white">
              Concierge support on demand :
            </span>
            <span>
              Private transfers from BIA, late check-out, and early breakfast
              available on request.
            </span>
          </div>
          <Button
            type="button"
            onClick={onSubmitRequest}
            className="self-start sm:self-auto"
          >
            Submit a request
          </Button>
        </div>
      </div>
    </section>
  );
}
