import { useEffect, useState } from "react";
import { Button, Input, Select, Card } from "../base";
import {
  fetchReservations,
  fetchCustomers,
  fetchRooms,
  createReservation,
  cancelReservation,
} from "../../services/api";

const EMPTY_FORM = {
  customerId: "",
  roomId: "",
  checkInDate: "",
  checkOutDate: "",
  numberOfGuests: 1,
};

const RESERVATION_STATUSES = ["All", "Reserved", "Checked In", "Checked Out"];

export default function ReservationsPanel({ token, showToast }) {
  const [reservations, setReservations] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [loading, setLoading] = useState(false);
  const [calculatedDetails, setCalculatedDetails] = useState(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const [reservationList, customerList, roomList] = await Promise.all([
        fetchReservations(token),
        fetchCustomers(token),
        fetchRooms(),
      ]);
      setReservations(reservationList || []);
      setCustomers(customerList || []);
      setRooms(roomList || []);
    } catch (err) {
      showToast?.(err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [token]);

  useEffect(() => {
    if (form.roomId && form.checkInDate && form.checkOutDate) {
      const selectedRoom = rooms.find((r) => r.id === form.roomId);
      const checkIn = new Date(form.checkInDate);
      const checkOut = new Date(form.checkOutDate);

      if (selectedRoom && checkOut > checkIn) {
        const diffTime = Math.abs(checkOut - checkIn);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        const total = diffDays * selectedRoom.pricePerNight;
        setCalculatedDetails({
          nights: diffDays,
          pricePerNight: selectedRoom.pricePerNight,
          totalAmount: total,
        });
        return;
      }
    }
    setCalculatedDetails(null);
  }, [form.roomId, form.checkInDate, form.checkOutDate, rooms]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !form.customerId ||
      !form.roomId ||
      !form.checkInDate ||
      !form.checkOutDate
    ) {
      showToast?.("Please fill in all fields.", "error");
      return;
    }
    if (new Date(form.checkOutDate) <= new Date(form.checkInDate)) {
      showToast?.("Check-out date must be after check-in date.", "error");
      return;
    }

    try {
      const customer = customers.find((c) => c.id === form.customerId);
      const payload = {
        roomId: form.roomId,
        customerId: form.customerId,
        customerName: customer ? customer.fullName : "",
        customerEmail: customer ? customer.email : "",
        checkInDate: form.checkInDate,
        checkOutDate: form.checkOutDate,
        numberOfGuests: parseInt(form.numberOfGuests),
      };

      await createReservation(payload, token);
      showToast?.("Reservation created successfully.", "success");
      setForm(EMPTY_FORM);
      await loadData();
    } catch (err) {
      showToast?.(err.message, "error");
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this reservation?"))
      return;
    try {
      await cancelReservation(id, token);
      showToast?.("Reservation cancelled.", "success");
      await loadData();
    } catch (err) {
      showToast?.(err.message, "error");
    }
  };

  const filteredReservations = reservations.filter((res) => {
    const matchesStatus = statusFilter === "All" || res.status === statusFilter;

    const query = search.trim().toLowerCase();
    const room = rooms.find((r) => r.id === res.roomId);

    const matchesSearch =
      query === "" ||
      (res.customerName || "").toLowerCase().includes(query) ||
      (res.customerEmail || "").toLowerCase().includes(query) ||
      (res.status || "").toLowerCase().includes(query) ||
      (res.paymentStatus || "").toLowerCase().includes(query) ||
      (room?.roomNumber || "").toLowerCase().includes(query);

    return matchesStatus && matchesSearch;
  });

  const inputCls =
    "w-full rounded-2xl border border-cashmere-700 bg-heritage-900 px-3 py-2.5 text-sm text-white focus:outline-none focus:border-brass";

  return (
    <div className="space-y-6">
      <div className="rounded-[1.75rem] border border-cashmere-700 bg-cashmere-900 p-5 shadow-card">
        <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-[0.35em] text-slate-400">
              Booking Workflow
            </p>
            <h3 className="mt-1 text-xl font-bold text-white">
              Create New Reservation
            </h3>
            <p className="mt-1 text-sm text-slate-400">
              Pick a customer, choose an available room, and confirm the stay
              details.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              options={RESERVATION_STATUSES.map((status) => ({ value: status, label: status }))}
              aria-label="Filter reservations by status"
              className="min-w-[12rem]"
            />
            <Input
              aria-label="Search reservations"
              placeholder="Search reservations here"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="min-w-[18rem]"
            />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
          <Select
            label="Select Customer"
            required
            value={form.customerId}
            onChange={(e) => setForm({ ...form, customerId: e.target.value })}
            options={customers.map((c) => ({
              value: c.id,
              label: `${c.fullName} (${c.nicPassport})`,
            }))}
            placeholder="Choose customer here"
          />

          <Select
            label="Select Room"
            required
            value={form.roomId}
            onChange={(e) => setForm({ ...form, roomId: e.target.value })}
            options={rooms.map((r) => ({
              value: r.id,
              label: `Room ${r.roomNumber} - ${r.roomType} (LKR ${r.pricePerNight}/night) - Status: ${r.status}`,
            }))}
            placeholder="Choose room here"
          />

          <Input
            label="Check-in Date"
            type="date"
            required
            value={form.checkInDate}
            onChange={(e) => setForm({ ...form, checkInDate: e.target.value })}
          />

          <Input
            label="Check-out Date"
            type="date"
            required
            value={form.checkOutDate}
            onChange={(e) => setForm({ ...form, checkOutDate: e.target.value })}
          />

          <Input
            label="Number of Guests"
            type="number"
            required
            min="1"
            value={form.numberOfGuests}
            onChange={(e) => setForm({ ...form, numberOfGuests: e.target.value })}
          />

          {calculatedDetails && (
            <div className="md:col-span-2 flex flex-col gap-4 rounded-[1.25rem] border border-cashmere-700 bg-heritage-900 p-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-[0.35em] text-slate-400">
                  Calculation Summary
                </p>
                <p className="mt-2 text-white">
                  {calculatedDetails.nights} Nights × LKR {calculatedDetails.pricePerNight} per night
                </p>
              </div>
              <div className="text-left md:text-right">
                <p className="text-[10px] uppercase tracking-[0.35em] text-slate-400">
                  Total Amount
                </p>
                <p className="mt-2 text-2xl font-bold text-brass">
                  LKR {calculatedDetails.totalAmount.toLocaleString()}
                </p>
              </div>
            </div>
          )}

          <div className="md:col-span-2">
            <Button type="submit" fullWidth>
              Create Reservation
            </Button>
          </div>
        </form>
      </div>

      <div className="rounded-[1.75rem] border border-cashmere-700 bg-cashmere-900 p-5 shadow-card">
        <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-xl font-bold text-white">Reservation List</h3>
            <p className="text-sm text-slate-400">
              Track current booking activity and cancel pending reservations.
            </p>
          </div>
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
                  <th className="p-2">Dates</th>
                  <th className="p-2">Nights</th>
                  <th className="p-2">Total Amount</th>
                  <th className="p-2">Status</th>
                  <th className="p-2">Payment Status</th>
                  <th className="p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredReservations.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-4 text-center text-slate-500">
                      No reservations found.
                    </td>
                  </tr>
                ) : (
                  filteredReservations.map((res) => {
                    const roomObj = rooms.find((r) => r.id === res.roomId);
                    return (
                      <tr
                        key={res.id}
                        className="border-b border-cashmere-800 hover:bg-heritage-900"
                      >
                        <td className="p-2 text-white font-semibold">
                          {res.customerName || "N/A"}
                          <p className="text-xs text-slate-400">
                            {res.customerEmail || "No Email"}
                          </p>
                        </td>
                        <td className="p-2">
                          Room {roomObj ? roomObj.roomNumber : "N/A"}
                        </td>
                        <td className="p-2 text-xs">
                          {res.checkInDate} to {res.checkOutDate}
                        </td>
                        <td className="p-2">{res.numberOfNights}</td>
                        <td className="p-2 font-bold text-slate-200">
                          LKR {res.totalAmount?.toLocaleString()}
                        </td>
                        <td className="p-2">
                          <span
                            className={`rounded px-2 py-1 text-[10px] uppercase font-bold ${
                              res.status === "Reserved"
                                ? "bg-blue-950 text-blue-400 border border-blue-800"
                                : res.status === "Checked In"
                                  ? "bg-green-950 text-green-400 border border-green-800"
                                  : res.status === "Checked Out"
                                    ? "bg-slate-850 text-slate-400 border border-slate-700"
                                    : "bg-red-950 text-red-400 border border-red-800"
                            }`}
                          >
                            {res.status}
                          </span>
                        </td>
                        <td className="p-2 text-xs">
                          <span
                            className={`font-semibold ${res.paymentStatus === "PAID" ? "text-green-400" : "text-yellow-400"}`}
                          >
                            {res.paymentStatus}
                          </span>
                        </td>
                        <td className="p-2">
                          {res.status === "Reserved" && (
                            <button
                              onClick={() => handleCancel(res.id)}
                              className="rounded border border-red-500/30 px-2 py-1 text-xs text-red-400 transition hover:bg-red-500/10"
                            >
                              Cancel
                            </button>
                          )}
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
