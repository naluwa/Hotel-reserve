import { VIEWS } from "../../config/constants";
import { Button } from "../base";

export default function Footer({ isAdmin, token, setView }) {
  return (
    <footer className="border-t border-white/10 bg-heritage-900/80 py-10 text-slate-400 backdrop-blur">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-8 md:grid-cols-[1.4fr_1fr_1fr]">
          {/* Brand */}
          <div>
            <p className="font-serif text-2xl uppercase tracking-[0.3em] text-white">
              Grand Reserve
            </p>
            <p className="mt-1 text-xs uppercase tracking-[0.3em] text-brass">
              Colombo 03, Sri Lanka
            </p>
            <p className="mt-4 max-w-xs text-sm leading-6 text-slate-400">
              64 Galle Road, Colombo 03. Direct bookings, clear stay details,
              and support whenever you need it.
            </p>
          </div>

          {/* Contact */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-300">
              Contact
            </p>
            <ul className="mt-4 space-y-2 text-sm text-slate-400">
              <li>+94012345689</li>
              <li>grandreserve9@gmail.com</li>
              <li>Front desk: 24 / 7</li>
              <li>Reservations: 6:00 AM – 11:00 PM</li>
            </ul>
          </div>

          {/* Navigation */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-300">
              Quick links
            </p>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <button
                  type="button"
                  className="text-slate-400 transition hover:text-white"
                  onClick={() => setView(VIEWS.CONTACT)}
                >
                  Contact
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className="text-slate-400 transition hover:text-white"
                  onClick={() => setView(VIEWS.ABOUT)}
                >
                  About
                </button>
              </li>
              <li>
                <span className="text-slate-500">Privacy Policy</span>
              </li>
              <li>
                <span className="text-slate-500">Terms of Service</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-white/10 pt-6 text-center text-xs text-slate-500">
          &copy; {new Date().getFullYear()} Grand Reserve Colombo. All rights
          reserved.
        </div>
      </div>
    </footer>
  );
}
