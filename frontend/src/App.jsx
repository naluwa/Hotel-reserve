import { useState, useCallback, useMemo } from "react";
import { TOAST_TYPES, VIEWS } from "./config/constants";
import { useAuth } from "./hooks/useAuth";
import { useRooms } from "./hooks/useRooms";
import {
  buildRoomCategories,
  computeStayNights,
  filterAndSortRooms,
  getRoomIdentifier,
} from "./utils/roomCatalog";
import AdminPanel from "./pages/AdminPanel";
import AboutPage from "./pages/AboutPage";
import GalleryPage from "./pages/GalleryPage";
import ContactPage from "./pages/ContactPage";
import BookingModal from "./components/booking/BookingModal";
import CustomerBookingsPanel from "./components/booking/CustomerBookingsPanel";
import CustomerMessagesPanel from "./components/booking/CustomerMessagesPanel";
import LoginForm from "./components/auth/LoginForm";
import CustomerAuthPanel from "./components/auth/CustomerAuthPanel";
import EditRoomModal from "./components/admin/EditRoomModal";
import RoomCard from "./components/common/RoomCard";
import Toast from "./components/common/Toast";
import Navigation from "./components/layout/Navigation";
import HeroSection from "./components/layout/HeroSection";
import WhyChooseUs from "./components/layout/WhyChooseUs";
import Footer from "./components/layout/Footer";
import { Button, EmptyState, LoadingState } from "./components/base";
import "./App.css";

export default function App() {
  const [view, setView] = useState(VIEWS.CUSTOMER);
  const [toast, setToast] = useState({ message: "", type: TOAST_TYPES.INFO });
  const [customerAuthMode, setCustomerAuthMode] = useState("login");

  const showToast = useCallback(
    (message, type = TOAST_TYPES.INFO) => setToast({ message, type }),
    [],
  );

  const openCustomerAuth = (mode = "login") => {
    setCustomerAuthMode(mode);
    setView(VIEWS.CUSTOMER_LOGIN);
  };

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
  const [guestCount, setGuestCount] = useState("");
  const [scrollToContactForm, setScrollToContactForm] = useState(false);

  const stayNights = useMemo(
    () => computeStayNights(rooms.filterCheckIn, rooms.filterCheckOut),
    [rooms.filterCheckIn, rooms.filterCheckOut],
  );

  const hasActiveFilters =
    rooms.filterCheckIn ||
    rooms.filterCheckOut ||
    categoryFilter !== "All" ||
    sortBy !== "default" ||
    guestCount !== "";

  const displayedRooms = useMemo(
    () =>
      filterAndSortRooms(rooms.filteredRooms, {
        categoryFilter,
        sortBy,
        guestFilter: guestCount,
      }),
    [rooms.filteredRooms, categoryFilter, sortBy, guestCount],
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
    setGuestCount("");
    rooms.loadRooms();
  };

  const handleSubmitRequest = () => {
    setView(VIEWS.CONTACT);
    setScrollToContactForm(true);
  };

  return (
    <div className="page-shell flex min-h-screen flex-col font-sans text-slate-100">
      <Toast message={toast.message} type={toast.type} onClose={clearToast} />
      <Navigation
        view={view}
        setView={setView}
        onCustomerAuth={openCustomerAuth}
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

        {view === VIEWS.CONTACT && (
          <ContactPage
            showToast={showToast}
            scrollToForm={scrollToContactForm}
            onScrollHandled={() => setScrollToContactForm(false)}
          />
        )}

        {view === VIEWS.LOGIN && (
          <LoginForm
            onSubmit={(e, email, pwd) =>
              auth.handleAdminLogin(email, pwd, () => setView(VIEWS.ADMIN))
            }
          />
        )}

        {view === VIEWS.CUSTOMER_LOGIN && (
          <CustomerAuthPanel
            initialMode={customerAuthMode}
            onLogin={(email, pwd) =>
              auth.handleCustomerLogin(email, pwd, () =>
                setView(VIEWS.CUSTOMER),
              )
            }
            onRegister={async (
              fullName,
              email,
              password,
              nicPassport,
              phone,
              address,
            ) => {
              const registered = await auth.handleCustomerRegister(
                fullName,
                email,
                password,
                nicPassport,
                phone,
                address,
              );
              if (registered) {
                await auth.handleCustomerLogin(email, password, () =>
                  setView(VIEWS.CUSTOMER),
                );
              }
            }}
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

        {view === VIEWS.CUSTOMER_MESSAGES && auth.token && !auth.isAdmin && (
          <CustomerMessagesPanel
            authToken={auth.token}
            showToast={showToast}
            setView={setView}
            VIEWS={VIEWS}
            userFullName={auth.userFullName}
            userEmail={auth.userEmail}
          />
        )}

        {view === VIEWS.CUSTOMER && (
          <div className="flex flex-col gap-10">
            <HeroSection
              filterCheckIn={rooms.filterCheckIn}
              filterCheckOut={rooms.filterCheckOut}
              roomTypeFilter={categoryFilter}
              guestCount={guestCount}
              onCheckInChange={(e) => rooms.setFilterCheckIn(e.target.value)}
              onCheckOutChange={(e) => rooms.setFilterCheckOut(e.target.value)}
              onRoomTypeChange={(e) => setCategoryFilter(e.target.value)}
              onGuestCountChange={(e) => setGuestCount(e.target.value)}
              onSearchAvailability={rooms.handleFindRooms}
              onStartBooking={() => {
                if (auth.token && !auth.isAdmin) {
                  setView(VIEWS.CUSTOMER_BOOKINGS);
                } else {
                  openCustomerAuth("register");
                }
              }}
              onScrollToRooms={() => {
                setView(VIEWS.CUSTOMER);
                setTimeout(() => {
                  document.getElementById("rooms-section")?.scrollIntoView({
                    block: "start",
                  });
                }, 50);
              }}
              onClearFilters={handleResetFilters}
              hasFilters={hasActiveFilters}
            />

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

            <div className="space-y-6">
              <WhyChooseUs onSubmitRequest={handleSubmitRequest} />
            </div>
          </div>
        )}
      </main>

      <Footer isAdmin={auth.isAdmin} token={auth.token} setView={setView} />

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
