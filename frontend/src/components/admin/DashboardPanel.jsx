import { useEffect, useState } from "react";
import { fetchDashboard } from "../../services/api";

export default function DashboardPanel({ token, showToast }) {
  const [stats, setStats] = useState({
    totalRooms: 0,
    availableRooms: 0,
    reservedRooms: 0,
    occupiedRooms: 0,
    totalCustomers: 0,
    activeReservations: 0,
  });
  const [loading, setLoading] = useState(false);

  const loadStats = async () => {
    try {
      setLoading(true);
      const data = await fetchDashboard(token);
      if (data) {
        setStats(data);
      }
    } catch (err) {
      showToast?.(err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, [token]);

  if (loading) {
    return (
      <div className="rounded-[1.75rem] border border-cashmere-700 bg-cashmere-900 p-10 text-center text-sm text-slate-400">
        Loading statistics...
      </div>
    );
  }

  const cards = [
    {
      title: "Total Rooms",
      value: stats.totalRooms,
      note: "All inventory",
    },
    {
      title: "Available Rooms",
      value: stats.availableRooms,
      note: "Ready to book",
    },
    {
      title: "Reserved Rooms",
      value: stats.reservedRooms,
      note: "Awaiting check-in",
    },
    {
      title: "Occupied Rooms",
      value: stats.occupiedRooms,
      note: "Currently in use",
    },
    {
      title: "Total Customers",
      value: stats.totalCustomers,
      note: "Registered guests",
    },
    {
      title: "Active Reservations",
      value: stats.activeReservations,
      note: "Open stay records",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-white font-serif">Hotel Overview</h2>
          <p className="mt-1 text-sm text-slate-400">
            A simple snapshot of room availability, active bookings, and guest traffic.
          </p>
        </div>
        <button
          onClick={loadStats}
          className="rounded bg-brass px-4 py-2 text-xs font-bold uppercase tracking-wider text-heritage-900 transition hover:bg-brass-light"
        >
          Refresh Statistics
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {cards.map((card, idx) => (
          <div
            key={idx}
            className="rounded-xl border border-cashmere-700 bg-cashmere-900 p-5 space-y-3"
          >
            <div className="flex items-center justify-between gap-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-slate-400">
                {card.title}
              </p>
              <span className="rounded border border-cashmere-700 bg-heritage-900 px-2 py-0.5 text-[10px] uppercase tracking-[0.2em] text-slate-300">
                {card.note}
              </span>
            </div>
            <p className="text-4xl font-bold text-white font-serif">
              {card.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
