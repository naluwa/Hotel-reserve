// External
import { useState, useCallback, useMemo } from "react";
// Internal — constants & hooks
import { TOAST_TYPES, VIEWS } from "./config/constants";
import { useAuth } from "./hooks/useAuth";
import { useRooms } from "./hooks/useRooms";
import {
  buildRoomCategories,
  computeStayNights,
  filterAndSortRooms,
  getRoomIdentifier,
} from "./utils/roomCatalog";
// Relative — components & pages
import AdminPanel from "./pages/AdminPanel";
import AboutPage from "./pages/AboutPage";
import GalleryPage from "./pages/GalleryPage";
import ContactPage from "./pages/ContactPage";
import BookingModal from "./components/booking/BookingModal";
import CustomerBookingsPanel from "./components/booking/CustomerBookingsPanel";
import LoginForm from "./components/auth/LoginForm";
import CustomerAuthPanel from "./components/auth/CustomerAuthPanel";
import EditRoomModal from "./components/admin/EditRoomModal";
import RoomCard from "./components/common/RoomCard";
import Toast from "./components/common/Toast";
import Navigation from "./components/layout/Navigation";
import HeroSection from "./components/layout/HeroSection";
import WhyChooseUs from "./components/layout/WhyChooseUs";
import Footer from "./components/layout/Footer";
import { Button, EmptyState, LoadingState, Select } from "./components/base";
import "./App.css";

export default function App() {
  const [view, setView] = useState(VIEWS.CUSTOMER);
  const [toast, setToast] = useState({ message: "", type: TOAST_TYPES.INFO });

  const showToast = useCallback(
    (message, type = TOAST_TYPES.INFO) => setToast({ message, type }),
    [],
  );

  const clearToast = useCallback(
    () => setToast({ message: "", type: TOAST_TYPES.INFO }),
    [],
  );

  const auth = useAuth(showToast);
  const rooms = useRooms(showToast, auth.token);

  const [guestForm, setGuestForm] = useState({ name: "", email: "" });
  const resetGuestForm = () => setGuestForm({ name: "", email: "" });

  const openBooking = (room) => {
    const opened = rooms.openBookingModal(room, true);
    if (!opened && !auth.token) {
      setView(VIEWS.CUSTOMER_LOGIN);
      return;
    }
    if (auth.token && !auth.isAdmin) {
      setGuestForm({
        name: auth.userFullName || "",
        email: auth.userEmail || "",
      });
    } else {
      setGuestForm({ name: "", email: "" });
    }
  };

  const [categoryFilter, setCategoryFilter] = useState("All");
  const [sortBy, setSortBy] = useState("default");

  const categories = useMemo(
    () => buildRoomCategories(rooms.rooms),
    [rooms.rooms],
  );
  const stayNights = useMemo(
    () => computeStayNights(rooms.filterCheckIn, rooms.filterCheckOut),
    [rooms.filterCheckIn, rooms.filterCheckOut],
  );

  const hasActiveFilters =
    rooms.filterCheckIn ||
    rooms.filterCheckOut ||
    categoryFilter !== "All" ||
    sortBy !== "default";

  const displayedRooms = useMemo(
    () => filterAndSortRooms(rooms.filteredRooms, { categoryFilter, sortBy }),
    [rooms.filteredRooms, categoryFilter, sortBy],
  );

  const handleBookingSubmit = async (event, checkInDate, checkOutDate) => {
    event.preventDefault();
    const success = await rooms.handleCreateBooking(
      guestForm.name,
      guestForm.email,
      checkInDate,
      checkOutDate,
    );
    if (success) {
      resetGuestForm();
    }
  };

  const handleBookingClose = () => {
    rooms.setBookingRoom(null);
    resetGuestForm();
  };

  const handleResetFilters = () => {
    rooms.setFilterCheckIn("");
    rooms.setFilterCheckOut("");
    setCategoryFilter("All");
    setSortBy("default");
    rooms.loadRooms();
  };

  return (
    <div className="page-shell min-h-screen text-slate-100 font-sans flex flex-col">
      <Toast message={toast.message} type={toast.type} onClose={clearToast} />
      <Navigation
        view={view}
        setView={setView}
        setFilteredRooms={rooms.setFilteredRooms}
        rooms={rooms.rooms}
        token={auth.token}
        isAdmin={auth.isAdmin}
        userFullName={auth.userFullName}
        handleLogout={() => auth.handleLogout(() => setView(VIEWS.CUSTOMER))}
      />

      <main className="main-content flex-1">
        {view === VIEWS.ABOUT && <AboutPage />}

        {view === VIEWS.GALLERY && (
          <GalleryPage isAdmin={auth.isAdmin} showToast={showToast} />
        )}

        {view === VIEWS.CONTACT && <ContactPage showToast={showToast} />}

        {view === VIEWS.LOGIN && (
          <LoginForm
            onSubmit={(e, email, pwd) =>
              auth.handleAdminLogin(email, pwd, () => setView(VIEWS.ADMIN))
            }
          />
        )}

        {view === VIEWS.CUSTOMER_LOGIN && (
          <CustomerAuthPanel
            onLogin={(email, pwd) =>
              auth.handleCustomerLogin(email, pwd, () =>
                setView(VIEWS.CUSTOMER),
              )
            }
            onRegister={auth.handleCustomerRegister}
          />
        )}

        {view === VIEWS.ADMIN && auth.isAdmin && (
          <AdminPanel
            authToken={auth.token}
            currentUserEmail={auth.userEmail}
            onRoomsChanged={rooms.loadRooms}
            showToast={showToast}
          />
        )}

        {view === VIEWS.CUSTOMER_BOOKINGS && auth.token && !auth.isAdmin && (
          <CustomerBookingsPanel
            authToken={auth.token}
            showToast={showToast}
            setView={setView}
            VIEWS={VIEWS}
            rooms={rooms.rooms}
            onRoomsChanged={rooms.loadRooms}
          />
        )}

        {view === VIEWS.CUSTOMER && (
          <div className="flex flex-col gap-10">
            <HeroSection />

            {/* Combined Search & Refine Section */}
            <section className="section-shell p-8">
              <div className="space-y-6">
                <div>
                  <p className="eyebrow">Your search</p>
                  <h2 className="mt-2 font-serif text-3xl text-white sm:text-4xl">
                    Find and refine rooms for your stay
                  </h2>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 lg:items-end">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs uppercase tracking-[0.35em] text-slate-400">
                      Arrival Date
                    </label>
                    <input
                      type="date"
                      value={rooms.filterCheckIn}
                      onChange={(e) => rooms.setFilterCheckIn(e.target.value)}
                      className="w-full rounded-2xl border border-cashmere-700 bg-black px-4 py-3 text-sm text-white focus:outline-none focus:border-brass"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-xs uppercase tracking-[0.35em] text-slate-400">
                      Departure Date
                    </label>
                    <input
                      type="date"
                      value={rooms.filterCheckOut}
                      onChange={(e) => rooms.setFilterCheckOut(e.target.value)}
                      className="w-full rounded-2xl border border-cashmere-700 bg-black px-4 py-3 text-sm text-white focus:outline-none focus:border-brass"
                    />
                  </div>

                  <Select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    placeholder=""
                    options={[
                      { value: "All", label: "All Categories" },
                      ...categories
                        .filter((category) => category !== "All")
                        .map((category) => ({
                          value: category,
                          label: category,
                        })),
                    ]}
                    aria-label="Filter by category"
                  />

                  <Select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    placeholder=""
                    options={[
                      { value: "default", label: "Sort by" },
                      { value: "price-asc", label: "Price: Low to High" },
                      { value: "price-desc", label: "Price: High to Low" },
                    ]}
                    aria-label="Sort rooms"
                  />
                </div>

                <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-cashmere-800">
                  <div className="flex items-center gap-3">
                    <Button
                      type="button"
                      variant="primary"
                      onClick={rooms.handleFindRooms}
                    >
                      Find Rooms
                    </Button>

                    {hasActiveFilters && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleResetFilters}
                      >
                        Clear Filters
                      </Button>
                    )}
                  </div>

                  {stayNights > 0 && (
                    <span className="text-xs uppercase tracking-widest text-brass font-semibold">
                      Stay Length: {stayNights} night{stayNights !== 1 ? "s" : ""}
                    </span>
                  )}
                </div>
              </div>
            </section>

            {/* Room Cards Grid */}
            <section id="rooms-section" className="space-y-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div>
                  <h2 className="font-serif text-4xl text-white">
                    Rooms ready for your next stay
                  </h2>
                  <p className="mt-2 text-slate-400">
                    Browse premium rooms, suites, and peaceful retreats designed
                    for comfort.
                  </p>
                </div>
                <div className="rounded border border-cashmere-700 bg-cashmere-900 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-slate-300">
                  <span>
                    {displayedRooms.length} room
                    {displayedRooms.length !== 1 ? "s" : ""} available
                  </span>
                </div>
              </div>

              {rooms.isLoading && displayedRooms.length === 0 ? (
                <LoadingState
                  title="Preparing stay options"
                  description="We’re loading the latest availability so you can compare rooms without friction."
                  cards={3}
                />
              ) : displayedRooms.length === 0 ? (
                <EmptyState
                  icon={({ className }) => (
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      className={className}
                      aria-hidden="true"
                    >
                      <path
                        d="M4 7.5A2.5 2.5 0 016.5 5h11A2.5 2.5 0 0120 7.5v9A2.5 2.5 0 0117.5 19h-11A2.5 2.5 0 014 16.5v-9Z"
                        stroke="currentColor"
                        strokeWidth="1.6"
                      />
                      <path
                        d="M7 9h10M7 13h6"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                      />
                    </svg>
                  )}
                  title={
                    hasActiveFilters
                      ? "No rooms match your current filters"
                      : "No rooms are available right now"
                  }
                  description={
                    hasActiveFilters
                      ? "Try broadening the dates or clearing a filter to see additional rooms."
                      : "Our team is updating availability, so check back soon or choose a different stay."
                  }
                  action={handleResetFilters}
                  actionLabel={
                    hasActiveFilters ? "Reset filters" : "Refresh availability"
                  }
                />
              ) : (
                <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                  {displayedRooms.map((room, idx) => (
                    <RoomCard
                      key={getRoomIdentifier(room) || idx}
                      room={room}
                      isAdmin={auth.isAdmin}
                      onBook={openBooking}
                      onEdit={rooms.setEditingRoom}
                      checkInDate={rooms.filterCheckIn}
                      checkOutDate={rooms.filterCheckOut}
                    />
                  ))}
                </div>
              )}
            </section>

            {/* Why Guests Choose Us Section at bottom above footer */}
            <WhyChooseUs />
          </div>
        )}
      </main>

      <Footer isAdmin={auth.isAdmin} setView={setView} />

      <BookingModal
        room={rooms.bookingRoom}
        isCustomer={auth.isCustomer || auth.isAdmin}
        customerName={guestForm.name}
        customerEmail={guestForm.email}
        checkInDate={rooms.filterCheckIn}
        checkOutDate={rooms.filterCheckOut}
        onNameChange={(name) => setGuestForm({ ...guestForm, name })}
        onEmailChange={(email) => setGuestForm({ ...guestForm, email })}
        onSubmit={handleBookingSubmit}
        onClose={handleBookingClose}
      />

      <EditRoomModal
        room={rooms.editingRoom}
        onRoomChange={rooms.setEditingRoom}
        onSubmit={(e) => {
          e.preventDefault();
          rooms.handleUpdateRoom();
        }}
        onClose={() => rooms.setEditingRoom(null)}
      />
    </div>
  );
}
