import { useState } from "react";
import logo from "../../assets/img/logo.jpg";
import { VIEWS } from "../../config/constants";
import { Button } from "../base";

export default function Navigation({
  view,
  setView,
  setFilteredRooms,
  rooms,
  token,
  isAdmin,
  userFullName,
  handleLogout,
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const goHome = () => {
    setView(VIEWS.CUSTOMER);
    setFilteredRooms(rooms);
    setMobileOpen(false);
  };

  const handleRoomsClick = () => {
    goHome();
    setMobileOpen(false);
    setTimeout(() => {
      document.getElementById("rooms-section")?.scrollIntoView({
        block: "start",
      });
    }, 50);
  };

  const initials = (userFullName || "Guest").trim().charAt(0).toUpperCase();

  const navLinkClass =
    "text-sm font-medium text-slate-300 transition hover:text-white";

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[rgba(5,8,13,0.82)] backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 md:flex-row md:items-center md:justify-between md:px-6">
        <div className="flex items-center justify-between gap-4">
          <Button
            type="button"
            variant="ghost"
            className="border-none bg-transparent p-0 text-left hover:bg-transparent"
            onClick={goHome}
          >
            <span className="flex items-center gap-3">
              <img
                src={logo}
                alt="Grand Reserve hotel logo"
                className="h-10 w-10 rounded-full border border-brass/30 object-cover"
              />
              <span className="block md:hidden">
                <span className="block text-sm font-semibold uppercase tracking-[0.28em] text-brass-light">
                  Grand Reserve
                </span>
                <span className="mt-0.5 block text-[10px] uppercase tracking-[0.48em] text-slate-400">
                  Colombo 03, Sri Lanka
                </span>
              </span>
              <span className="hidden md:block">
                <span className="block font-serif text-xl uppercase tracking-[0.3em] text-brass-light lg:text-2xl">
                  Grand Reserve
                </span>
                <span className="text-[10px] uppercase tracking-[0.48em] text-slate-400">
                  Colombo 03, Sri Lanka
                </span>
              </span>
            </span>
          </Button>

          <button
            type="button"
            className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/5 p-2 text-white transition hover:bg-white/10 md:hidden"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            <svg
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {mobileOpen ? (
                <>
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </>
              ) : (
                <>
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </>
              )}
            </svg>
          </button>
        </div>

        <div className="hidden items-center gap-6 md:flex">
          <button
            type="button"
            className={navLinkClass}
            onClick={handleRoomsClick}
          >
            Rooms
          </button>
          <button
            type="button"
            className={navLinkClass}
            onClick={() => setView(VIEWS.ABOUT)}
          >
            About
          </button>
          <button
            type="button"
            className={navLinkClass}
            onClick={() => setView(VIEWS.GALLERY)}
          >
            Gallery
          </button>
          <button
            type="button"
            className={navLinkClass}
            onClick={() => setView(VIEWS.CONTACT)}
          >
            Contact
          </button>
        </div>

        <div className="hidden flex-wrap items-center gap-3 md:flex">
          {token ? (
            <>
              {!isAdmin ? (
                <>
                  <button
                    type="button"
                    className={`rounded-full border px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] transition ${view === VIEWS.CUSTOMER_BOOKINGS
                        ? "border-brass bg-brass text-heritage-900"
                        : "border-brass/30 bg-white/5 text-white hover:border-brass hover:text-brass"
                      }`}
                    onClick={() => setView(VIEWS.CUSTOMER_BOOKINGS)}
                  >
                    My Bookings
                  </button>
                  <button
                    type="button"
                    className={`rounded-full border px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] transition ${view === VIEWS.CUSTOMER_MESSAGES
                        ? "border-brass bg-brass text-heritage-900"
                        : "border-brass/30 bg-white/5 text-white hover:border-brass hover:text-brass"
                      }`}
                    onClick={() => setView(VIEWS.CUSTOMER_MESSAGES)}
                  >
                    Messages
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  className="rounded-full border border-brass/30 bg-white/5 px-5 py-2 text-xs font-bold uppercase tracking-[0.14em] text-white transition hover:border-brass hover:text-brass"
                  onClick={() => setView(VIEWS.ADMIN)}
                >
                  Admin Panel
                </button>
              )}
              <div className="flex items-center rounded-full border border-white/10 bg-cashmere-900/70 px-3 py-1.5 text-slate-200">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-brass text-xs font-bold text-heritage-900">
                  {initials}
                </span>
              </div>
              <button
                type="button"
                className="rounded-full bg-brass px-5 py-2 text-xs font-bold uppercase tracking-[0.14em] text-heritage-900 shadow-sm transition hover:bg-brass-light"
                onClick={handleLogout}
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                className="rounded-full border border-white/15 bg-white/5 px-5 py-2 text-xs font-bold uppercase tracking-[0.14em] text-white transition hover:border-brass hover:text-brass"
                onClick={() => setView(VIEWS.LOGIN)}
              >
                Admin Login
              </button>
              <button
                type="button"
                className="rounded-full bg-brass px-5 py-2 text-xs font-bold uppercase tracking-[0.14em] text-heritage-900 shadow-sm transition hover:bg-brass-light"
                onClick={() => setView(VIEWS.CUSTOMER_LOGIN)}
              >
                Sign In
              </button>
            </>
          )}
        </div>
      </nav>

      {mobileOpen && (
        <div className="md:hidden border-t border-white/10 bg-[rgba(5,8,13,0.96)] px-4 py-4">
          <div className="flex flex-col gap-3">
            <button
              type="button"
              className="w-full text-left text-sm font-medium text-slate-300 transition hover:text-white"
              onClick={handleRoomsClick}
            >
              Rooms
            </button>
            <button
              type="button"
              className="w-full text-left text-sm font-medium text-slate-300 transition hover:text-white"
              onClick={() => {
                setView(VIEWS.ABOUT);
                setMobileOpen(false);
              }}
            >
              About
            </button>
            <button
              type="button"
              className="w-full text-left text-sm font-medium text-slate-300 transition hover:text-white"
              onClick={() => {
                setView(VIEWS.GALLERY);
                setMobileOpen(false);
              }}
            >
              Gallery
            </button>
            <button
              type="button"
              className="w-full text-left text-sm font-medium text-slate-300 transition hover:text-white"
              onClick={() => {
                setView(VIEWS.CONTACT);
                setMobileOpen(false);
              }}
            >
              Contact
            </button>
          </div>

          <div className="mt-4 flex flex-col gap-3">
            {token ? (
              <>
                {!isAdmin ? (
                  <>
                    <button
                      type="button"
                      className="w-full rounded-full border border-brass/30 bg-white/5 px-4 py-2 text-left text-xs font-bold uppercase tracking-[0.14em] text-white transition hover:border-brass hover:text-brass"
                      onClick={() => {
                        setView(VIEWS.CUSTOMER_BOOKINGS);
                        setMobileOpen(false);
                      }}
                    >
                      My Bookings
                    </button>
                    <button
                      type="button"
                      className="w-full rounded-full border border-brass/30 bg-white/5 px-4 py-2 text-left text-xs font-bold uppercase tracking-[0.14em] text-white transition hover:border-brass hover:text-brass"
                      onClick={() => {
                        setView(VIEWS.CUSTOMER_MESSAGES);
                        setMobileOpen(false);
                      }}
                    >
                      Messages
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    className="w-full rounded-full border border-brass/30 bg-white/5 px-4 py-2 text-left text-xs font-bold uppercase tracking-[0.14em] text-white transition hover:border-brass hover:text-brass"
                    onClick={() => {
                      setView(VIEWS.ADMIN);
                      setMobileOpen(false);
                    }}
                  >
                    Admin Panel
                  </button>
                )}

                <button
                  type="button"
                  className="w-full rounded-full bg-brass px-4 py-2 text-left text-xs font-bold uppercase tracking-[0.14em] text-heritage-900 shadow-sm transition hover:bg-brass-light"
                  onClick={() => {
                    handleLogout();
                    setMobileOpen(false);
                  }}
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  className="w-full rounded-full border border-white/15 bg-white/5 px-4 py-2 text-left text-xs font-bold uppercase tracking-[0.14em] text-white transition hover:border-brass hover:text-brass"
                  onClick={() => {
                    setView(VIEWS.LOGIN);
                    setMobileOpen(false);
                  }}
                >
                  Admin Login
                </button>
                <button
                  type="button"
                  className="w-full rounded-full bg-brass px-4 py-2 text-left text-xs font-bold uppercase tracking-[0.14em] text-heritage-900 shadow-sm transition hover:bg-brass-light"
                  onClick={() => {
                    setView(VIEWS.CUSTOMER_LOGIN);
                    setMobileOpen(false);
                  }}
                >
                  Sign In
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
