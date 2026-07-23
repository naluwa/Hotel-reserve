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
  const goHome = () => {
    setView(VIEWS.CUSTOMER);
    setFilteredRooms(rooms);
  };

  const handleRoomsClick = () => {
    setView(VIEWS.CUSTOMER);
    setFilteredRooms(rooms);
    setTimeout(() => {
      document.getElementById("rooms-section")?.scrollIntoView({
        block: "start",
      });
    }, 50);
  };

  const initials = (userFullName || "Guest")
    .trim()
    .charAt(0)
    .toUpperCase();

  const navBtnClass = (active) =>
    `px-4 py-2 rounded text-xs uppercase tracking-[0.2em] font-semibold transition ${
      active
        ? "bg-brass text-heritage-900"
        : "text-slate-300 hover:text-white hover:bg-cashmere-800"
    }`;

  return (
    <header className="sticky top-0 z-50 border-b border-cashmere-700 bg-heritage-900">
      <nav className="mx-auto flex max-w-7xl flex-row items-center justify-between px-4 py-4 sm:px-6">
        <div className="flex items-center gap-4">
          <Button
            type="button"
            variant="ghost"
            className="text-left p-0 border-none bg-transparent hover:bg-transparent"
            onClick={goHome}
          >
            <span className="flex items-center gap-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded border border-brass-subtle bg-cashmere-900 text-sm font-bold tracking-[0.2em] text-brass">
                GR
              </span>
              <span className="hidden sm:block">
                <span className="block font-serif text-xl uppercase tracking-[0.3em] text-white lg:text-2xl">
                  Grand Reserve
                </span>
                <span className="text-[10px] uppercase tracking-[0.48em] text-slate-400">
                  simple hotel ops
                </span>
              </span>
            </span>
          </Button>
        </div>

        <div className="flex flex-row items-center justify-end gap-2 flex-nowrap">
          <button
            type="button"
            className={navBtnClass(view === VIEWS.CUSTOMER)}
            onClick={handleRoomsClick}
          >
            Rooms
          </button>

          <button
            type="button"
            className={navBtnClass(view === VIEWS.ABOUT)}
            onClick={() => setView(VIEWS.ABOUT)}
          >
            About
          </button>

          <button
            type="button"
            className={navBtnClass(view === VIEWS.GALLERY)}
            onClick={() => setView(VIEWS.GALLERY)}
          >
            Gallery
          </button>

          <button
            type="button"
            className={navBtnClass(view === VIEWS.CONTACT)}
            onClick={() => setView(VIEWS.CONTACT)}
          >
            Contact
          </button>

          {token && !isAdmin && (
            <button
              type="button"
              className={navBtnClass(view === VIEWS.CUSTOMER_BOOKINGS)}
              onClick={() => setView(VIEWS.CUSTOMER_BOOKINGS)}
            >
              My Bookings
            </button>
          )}

          {token && isAdmin && (
            <button
              type="button"
              className={navBtnClass(view === VIEWS.ADMIN)}
              onClick={() => setView(VIEWS.ADMIN)}
            >
              Admin Panel
            </button>
          )}

          {token ? (
            <div className="flex flex-row items-center gap-2">
              <div className="hidden lg:flex items-center gap-2 rounded border border-cashmere-700 bg-cashmere-900 px-3 py-1.5">
                <span className="inline-flex h-6 w-6 items-center justify-center rounded bg-brass text-xs font-bold text-heritage-900">
                  {initials}
                </span>
                <span className="text-xs font-semibold text-white tracking-wider max-w-[100px] truncate">
                  {userFullName || "User"}
                </span>
              </div>
              <button
                type="button"
                className={navBtnClass(false)}
                onClick={handleLogout}
              >
                Sign Out
              </button>
            </div>
          ) : (
            <button
              type="button"
              className="text-heritage-900 bg-brass hover:bg-brass-light font-bold px-6 py-2 text-xs uppercase tracking-[0.2em] rounded transition min-w-[110px]"
              onClick={() => setView(VIEWS.CUSTOMER_LOGIN)}
            >
              Sign In
            </button>
          )}
        </div>
      </nav>
    </header>
  );
}
