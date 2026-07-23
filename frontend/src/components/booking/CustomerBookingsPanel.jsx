import { useState, useEffect, useCallback } from "react";
import { PAYMENT_STATUS, TOAST_TYPES } from "../../config/constants";
import { fetchMyReservations, cancelReservation } from "../../services/api";
import PaymentGatewayModal from "../payment/PaymentGatewayModal";
import ConfirmDialog from "../common/ConfirmDialog";
import { formatLKR } from "../../utils/currency";
import { Button, Card, Badge } from "../base";

export default function CustomerBookingsPanel({
  authToken,
  showToast,
  setView,
  VIEWS,
  rooms,
  onRoomsChanged,
}) {
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPaymentBooking, setSelectedPaymentBooking] = useState(null);
  const [pendingCancelBookingId, setPendingCancelBookingId] = useState(null);

  const loadBookings = useCallback(async () => {
    setIsLoading(true);
    try {
      setBookings(await fetchMyReservations(authToken));
    } catch (err) {
      showToast(err.message, TOAST_TYPES.ERROR);
    } finally {
      setIsLoading(false);
    }
  }, [authToken, showToast]);

  useEffect(() => {
    if (authToken) loadBookings();
  }, [authToken, loadBookings]);

  const handleCancelBooking = (id) => {
    setPendingCancelBookingId(id);
  };

  const confirmCancelBooking = async () => {
    if (!pendingCancelBookingId) return;
    try {
      await cancelReservation(pendingCancelBookingId, authToken);
      showToast("Reservation cancelled successfully.", TOAST_TYPES.SUCCESS);
      await loadBookings();
      onRoomsChanged?.();
    } catch (err) {
      showToast(err.message, TOAST_TYPES.ERROR);
    } finally {
      setPendingCancelBookingId(null);
    }
  };

  const selectedPaymentRoom = selectedPaymentBooking
    ? rooms.find((room) => room.id === selectedPaymentBooking.roomId)
    : null;

  return (
    <div className="flex min-h-[calc(100vh-8rem)] flex-col gap-8">
      <div className="rounded-[2rem] border border-brass-subtle bg-cashmere-900 p-8 shadow-card">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-brass">
              Your reservations
            </p>
            <h1 className="font-serif text-4xl text-white mt-3">My Bookings</h1>
          </div>
          <Button
            type="button"
            variant="primary"
            onClick={() => setView(VIEWS.CUSTOMER)}
          >
            Browse Rooms
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="rounded-[2rem] border border-cashmere-700 bg-heritage-900 p-12 text-center text-slate-500">
          Loading your reservations...
        </div>
      ) : bookings.length === 0 ? (
        <div className="rounded-[2rem] border border-cashmere-700 bg-cashmere-900 p-12 text-center text-slate-300">
          <p className="text-xl font-semibold text-white">
            No reservations yet
          </p>
          <p className="mt-2 text-slate-400">
            Book a room to see your stay details here.
          </p>
          <Button
            type="button"
            variant="primary"
            onClick={() => setView(VIEWS.CUSTOMER)}
            className="mt-6"
          >
            Start browsing
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          {bookings.map((booking) => {
            const room = rooms.find((r) => r.id === booking.roomId);
            return (
              <article
                key={booking.id}
                className="rounded-[2rem] border border-cashmere-700 bg-cashmere-900 p-6 shadow-card"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.35em] text-slate-400">
                      Room {room?.roomNumber || "N/A"}
                    </p>
                    <h2 className="mt-2 text-2xl font-serif text-white">
                      {room?.type || "Guest stay"}
                    </h2>
                    <p className="mt-2 text-slate-400 text-sm">
                      {booking.checkInDate} — {booking.checkOutDate}
                    </p>
                  </div>
                  <div className="rounded-3xl bg-heritage-900 px-4 py-3 text-right">
                    <p className="text-[10px] uppercase tracking-[0.35em] text-slate-400">
                      Total Paid
                    </p>
                    <p className="mt-2 text-2xl font-semibold text-brass">
                      {formatLKR(booking.totalAmount)}
                    </p>
                  </div>
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-3">
                  <div className="rounded-lg border border-cashmere-700 bg-heritage-900 p-4 text-sm text-slate-300">
                    <p className="text-[10px] uppercase tracking-[0.35em] text-slate-400">
                      Payment
                    </p>
                    <p className="mt-2">
                      <Badge variant={booking.paymentStatus === PAYMENT_STATUS.PAID ? "success" : "warning"} size="sm">
                        {booking.paymentStatus}
                      </Badge>
                    </p>
                  </div>
                  <div className="rounded-lg border border-cashmere-700 bg-heritage-900 p-4 text-sm text-slate-300">
                    <p className="text-[10px] uppercase tracking-[0.35em] text-slate-400">
                      Guest email
                    </p>
                    <p className="mt-2 text-white font-medium">
                      {booking.customerEmail || "Not provided"}
                    </p>
                  </div>
                  <div className="rounded-lg border border-cashmere-700 bg-heritage-900 p-4 text-sm text-slate-300">
                    <p className="text-[10px] uppercase tracking-[0.35em] text-slate-400">
                      Status
                    </p>
                    <p className="mt-2 text-white font-medium">
                      {room?.status === "Available"
                        ? "Room ready"
                        : "Check availability"}
                    </p>
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap gap-3">
                  {booking.paymentStatus === PAYMENT_STATUS.PENDING && (
                    <Button
                      type="button"
                      variant="primary"
                      onClick={() => setSelectedPaymentBooking(booking)}
                    >
                      Pay Now
                    </Button>
                  )}
                  <Button
                    type="button"
                    variant="outline"
                    className="text-red-400 border-red-800/40 hover:bg-red-950/20"
                    onClick={() => handleCancelBooking(booking.id)}
                  >
                    Cancel booking
                  </Button>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {selectedPaymentBooking && (
        <PaymentGatewayModal
          booking={selectedPaymentBooking}
          room={selectedPaymentRoom}
          authToken={authToken}
          showToast={showToast}
          onSuccess={loadBookings}
          onClose={() => setSelectedPaymentBooking(null)}
        />
      )}

      <ConfirmDialog
        open={pendingCancelBookingId !== null}
        title="Cancel reservation"
        description="Are you sure you want to cancel this reservation? This action cannot be undone."
        confirmLabel="Yes, cancel"
        cancelLabel="Keep booking"
        onConfirm={confirmCancelBooking}
        onCancel={() => setPendingCancelBookingId(null)}
      />
    </div>
  );
}
