import { useEffect, useState, useCallback } from "react";
import {
  fetchReservations,
  fetchRooms,
  checkInReservation,
} from "../../services/api";

export default function CheckInPanel({ token, showToast }) {
  const [reservations, setReservations] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [reservationList, roomList] = await Promise.all([
        fetchReservations(token),
        fetchRooms(),
      ]);
      setReservations(reservationList || []);
      setRooms(roomList || []);
    } catch (err) {
      showToast?.(err.message, "error");
    } finally {
      setLoading(false);
    }
  }, [token, showToast]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleCheckIn = async (reservationId) => {
    try {
      await checkInReservation(reservationId, token);
      showToast?.(
        "Check-in confirmed. Room status updated to Occupied.",
        "success",
      );
      await loadData();
    } catch (err) {
      showToast?.(err.message, "error");
    }
  };

  // Only show reservations that are in "Reserved" state — ready for check-in
  const readyForCheckIn = reservations.filter((r) => r.status === "Reserved");

  return (
    <div className="space-y-6">
      <div className="rounded-[1.75rem] border border-cashmere-700 bg-cashmere-900 p-5 shadow-card">
        <div className="mb-4 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-[0.35em] text-slate-400">
              Arrival Desk
            </p>
            <h3 className="mt-1 text-xl font-bold text-white">
              Check-In Management
            </h3>
            <p className="mt-1 text-sm text-slate-400">
              Select a reservation with status &ldquo;Reserved&rdquo; and
              confirm the guest&rsquo;s arrival. The reservation status will
              change to <strong className="text-white">Checked In</strong> and
              the room will be marked <strong className="text-white">Occupied</strong>.
            </p>
          </div>
          <span className="rounded-full bg-brass/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.35em] text-brass">
            {readyForCheckIn.length} Ready
          </span>
        </div>

        {loading ? (
          <p className="text-sm text-slate-400">Loading reservations...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="border-b border-cashmere-700 text-slate-400 text-xs uppercase">
                  <th className="p-2">Guest</th>
                  <th className="p-2">Room</th>
                  <th className="p-2">Check-In Date</th>
                  <th className="p-2">Check-Out Date</th>
                  <th className="p-2">Nights</th>
                  <th className="p-2">Total Amount</th>
                  <th className="p-2">Payment</th>
                  <th className="p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {readyForCheckIn.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-6 text-center text-slate-500">
                      No reservations are currently ready for check-in.
                      <br />
                      <span className="text-xs">
                        Reservations with status &ldquo;Reserved&rdquo; will appear here.
                      </span>
                    </td>
                  </tr>
                ) : (
                  readyForCheckIn.map((reservation) => {
                    const roomObj = rooms.find((r) => r.id === reservation.roomId);
                    return (
                      <tr
                        key={reservation.id}
                        className="border-b border-cashmere-800 hover:bg-heritage-900"
                      >
                        <td className="p-2 text-white font-semibold">
                          {reservation.customerName}
                          <p className="text-xs text-slate-400">
                            {reservation.customerEmail}
                          </p>
                        </td>
                        <td className="p-2">
                          {roomObj ? (
                            <>
                              <p>Room {roomObj.roomNumber}</p>
                              <p className="text-xs text-slate-400">
                                {roomObj.roomType}
                              </p>
                            </>
                          ) : (
                            "N/A"
                          )}
                        </td>
                        <td className="p-2 text-xs">{reservation.checkInDate}</td>
                        <td className="p-2 text-xs">{reservation.checkOutDate}</td>
                        <td className="p-2">{reservation.numberOfNights}</td>
                        <td className="p-2 font-bold text-slate-200">
                          LKR {reservation.totalAmount?.toLocaleString()}
                        </td>
                        <td className="p-2 text-xs">
                          <span
                            className={`font-semibold ${
                              reservation.paymentStatus === "PAID"
                                ? "text-green-400"
                                : "text-yellow-400"
                            }`}
                          >
                            {reservation.paymentStatus}
                          </span>
                        </td>
                        <td className="p-2">
                          <button
                            onClick={() => handleCheckIn(reservation.id)}
                            className="rounded-3xl bg-brass px-3 py-1.5 text-xs font-bold uppercase text-heritage-900 transition hover:bg-brass-light"
                          >
                            Confirm Check-In
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
