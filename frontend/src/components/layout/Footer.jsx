import { VIEWS } from "../../config/constants";
import { Button } from "../base";

export default function Footer({ isAdmin, setView }) {
  return (
    <footer className="border-t border-brass-subtle bg-cashmere-900/95 py-8 text-slate-400">
      <div className="mx-auto grid max-w-7xl gap-6 px-6 md:grid-cols-[1fr_auto_auto] md:items-center">
        <div>
          <p className="font-serif text-2xl uppercase tracking-[0.3em] text-white">
            Grand Reserve
          </p>
          <p className="mt-2 text-sm text-slate-400">
            Crafted for effortless booking and memorable stays.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-[11px] uppercase tracking-[0.32em]">
          <span>Built for easy stays</span>
          <span>•</span>
          <span>Privacy</span>
          <span>•</span>
          <span>Terms</span>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-[11px] uppercase tracking-[0.35em]">
          {!isAdmin && (
            <Button
              type="button"
              variant="ghost"
              className="text-brass hover:text-brass-light"
              onClick={() => setView(VIEWS.LOGIN)}
            >
              Admin Login
            </Button>
          )}
          <span>&copy; {new Date().getFullYear()} Grand Reserve</span>
        </div>
      </div>
    </footer>
  );
}
