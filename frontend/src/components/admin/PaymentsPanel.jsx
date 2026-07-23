import { useEffect, useState, useCallback } from "react";
import {
  fetchPayments,
  createPayment,
  updatePayment,
  fetchReservations,
} from "../../services/api";

const PAYMENT_METHODS = ["Cash", "Card", "Bank Transfer"];
const PAYMENT_STATUSES = ["Paid", "Pending"];

const EMPTY_FORM = {
  reservationId: "",
  amount: "",
  paymentDate: "",
  paymentMethod: "Cash",
  paymentStatus: "Paid",
};

export default function PaymentsPanel({ token, showToast }) {
  const [payments, setPayments] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(false);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [paymentList, reservationList] = await Promise.all([
        fetchPayments(token),
        fetchReservations(token),
      ]);
      setPayments(paymentList || []);
      setReservations(reservationList || []);
    } catch (err) {
      showToast?.(err.message, "error");
    } finally {
      setLoading(false);
    }
  }, [token, showToast]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.reservationId || !form.amount || !form.paymentDate) {
      showToast?.("All fields are required.", "error");
      return;
    }
    if (parseFloat(form.amount) <= 0) {
      showToast?.("Amount must be greater than zero.", "error");
      return;
    }

    try {
      const payload = {
        ...form,
        amount: parseFloat(form.amount),
      };
      await createPayment(payload, token);
      showToast?.("Payment record created.", "success");
      setForm(EMPTY_FORM);
      await loadData();
    } catch (err) {
      showToast?.(err.message, "error");
    }
  };

  const handleToggleStatus = async (payment) => {
    try {
      const nextStatus = payment.paymentStatus === "Paid" ? "Pending" : "Paid";
      const payload = { ...payment, paymentStatus: nextStatus };
      await updatePayment(payment.id, payload, token);
      showToast?.(`Payment marked as ${nextStatus}.`, "success");
      await loadData();
    } catch (err) {
      showToast?.(err.message, "error");
    }
  };

  const inputCls =
    "w-full rounded-2xl border border-cashmere-700 bg-black px-3 py-2.5 text-sm text-white focus:outline-none focus:border-brass";

  return (
    <div className="space-y-6">
      {/* Record New Payment */}
      <div className="rounded-[1.75rem] border border-cashmere-700 bg-cashmere-900 p-5 shadow-card">
        <div className="mb-4 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-[0.35em] text-slate-400">
              Billing Desk
            </p>
            <h3 className="mt-1 text-xl font-bold text-white">
              Record New Payment
            </h3>
            <p className="mt-1 text-sm text-slate-400">
              Capture payment details against a reservation and update the
              ledger.
            </p>
          </div>
          <span className="rounded-full bg-brass/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.35em] text-brass">
            {payments.length} Records
          </span>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
          <div className="flex flex-col gap-1">
            <label className="text-xs uppercase tracking-[0.35em] text-slate-400">
              Select Reservation / Guest *
            </label>
            <select
              required
              className={inputCls}
              value={form.reservationId}
              onChange={(e) => {
                const reservationId = e.target.value;
                const matchedReservation = reservations.find((r) => r.id === reservationId);
                setForm({
                  ...form,
                  reservationId,
                  amount: matchedReservation
                    ? matchedReservation.totalAmount.toString()
                    : "",
                });
              }}
            >
              <option value="">-- Choose Reservation --</option>
              {reservations.map((r) => (
                <option key={r.id} value={r.id}>
                  Guest: {r.customerName} - Total: LKR{" "}
                  {r.totalAmount?.toLocaleString()} ({r.status})
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs uppercase tracking-[0.35em] text-slate-400">
              Payment Amount (LKR) *
            </label>
            <input
              required
              type="number"
              step="0.01"
              min="1"
              className={inputCls}
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs uppercase tracking-[0.35em] text-slate-400">
              Payment Date *
            </label>
            <input
              required
              type="date"
              className={inputCls}
              value={form.paymentDate}
              onChange={(e) =>
                setForm({ ...form, paymentDate: e.target.value })
              }
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs uppercase tracking-[0.35em] text-slate-400">
              Payment Method *
            </label>
            <select
              required
              className={inputCls}
              value={form.paymentMethod}
              onChange={(e) =>
                setForm({ ...form, paymentMethod: e.target.value })
              }
            >
              {PAYMENT_METHODS.map((method) => (
                <option key={method} value={method}>
                  {method}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs uppercase tracking-[0.35em] text-slate-400">
              Payment Status *
            </label>
            <select
              required
              className={inputCls}
              value={form.paymentStatus}
              onChange={(e) =>
                setForm({ ...form, paymentStatus: e.target.value })
              }
            >
              {PAYMENT_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2">
            <button
              type="submit"
              className="w-full rounded-3xl bg-brass px-5 py-3 text-sm font-bold uppercase text-heritage-900 transition hover:bg-brass-light"
            >
              Record Payment
            </button>
          </div>
        </form>
      </div>

      {/* Payment Ledger */}
      <div className="rounded-[1.75rem] border border-cashmere-700 bg-cashmere-900 p-5 shadow-card">
        <div className="mb-4">
          <h3 className="text-xl font-bold text-white">Payment Ledger</h3>
          <p className="text-sm text-slate-400">
            Review payment history and update payment status quickly.
          </p>
        </div>

        {loading ? (
          <p className="text-sm text-slate-400">Loading payments...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="border-b border-cashmere-700 text-slate-400 text-xs uppercase">
                  <th className="p-2">Payment ID</th>
                  <th className="p-2">Reservation Info</th>
                  <th className="p-2">Amount</th>
                  <th className="p-2">Date</th>
                  <th className="p-2">Method</th>
                  <th className="p-2">Status</th>
                  <th className="p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {payments.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-4 text-center text-slate-500">
                      No payment records found.
                    </td>
                  </tr>
                ) : (
                  payments.map((payment) => {
                    const matchedReservation = reservations.find(
                      (r) => r.id === payment.reservationId,
                    );
                    return (
                      <tr
                        key={payment.id}
                        className="border-b border-cashmere-800 hover:bg-heritage-900"
                      >
                        <td className="p-2 font-mono text-xs text-slate-400">
                          {payment.id}
                        </td>
                        <td className="p-2">
                          {matchedReservation ? (
                            <div>
                              <p className="text-white font-semibold">
                                {matchedReservation.customerName}
                              </p>
                              <p className="text-xs text-slate-400">
                                {matchedReservation.customerEmail}
                              </p>
                            </div>
                          ) : (
                            <span className="text-slate-500 font-mono text-xs">
                              Res ID: {payment.reservationId}
                            </span>
                          )}
                        </td>
                        <td className="p-2 font-bold text-slate-200">
                          LKR {payment.amount?.toLocaleString()}
                        </td>
                        <td className="p-2 text-xs">{payment.paymentDate}</td>
                        <td className="p-2">{payment.paymentMethod}</td>
                        <td className="p-2">
                          <span
                            className={`rounded px-2 py-1 text-[10px] font-bold uppercase ${
                              payment.paymentStatus === "Paid"
                                ? "bg-green-950 text-green-400 border border-green-800"
                                : "bg-yellow-950 text-yellow-400 border border-yellow-800"
                            }`}
                          >
                            {payment.paymentStatus}
                          </span>
                        </td>
                        <td className="p-2">
                          <button
                            onClick={() => handleToggleStatus(payment)}
                            className="rounded border border-brass-subtle px-2 py-1 text-xs text-brass transition hover:bg-brass/10"
                          >
                            Toggle Status
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
