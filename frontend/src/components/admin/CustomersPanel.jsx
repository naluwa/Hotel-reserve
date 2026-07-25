import { useEffect, useState } from "react";
import { Button, Input } from "../base";
import {
  createCustomer,
  deleteCustomer,
  fetchCustomers,
  updateCustomer,
} from "../../services/api";

const EMPTY_FORM = {
  fullName: "",
  nicPassport: "",
  phone: "",
  email: "",
  address: "",
};

export default function CustomersPanel({ token, showToast }) {
  const [customers, setCustomers] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const load = async () => {
    try {
      setLoading(true);
      setCustomers(await fetchCustomers(token));
    } catch (err) {
      showToast?.(err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [token]);

  const resetForm = () => {
    setForm(EMPTY_FORM);
    setEditing(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.fullName.trim() || !form.nicPassport.trim()) {
      showToast?.("Full Name and NIC/Passport are required.", "error");
      return;
    }
    try {
      if (editing) {
        await updateCustomer(editing.id, form, token);
        showToast?.("Customer updated.", "success");
      } else {
        await createCustomer(form, token);
        showToast?.("Customer added.", "success");
      }
      resetForm();
      await load();
    } catch (err) {
      showToast?.(err.message, "error");
    }
  };

  const handleEdit = (c) => {
    setEditing(c);
    setForm({
      fullName: c.fullName || "",
      nicPassport: c.nicPassport || "",
      phone: c.phone || "",
      email: c.email || "",
      address: c.address || "",
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this customer?")) return;
    try {
      await deleteCustomer(id, token);
      showToast?.("Customer deleted.", "success");
      await load();
    } catch (err) {
      showToast?.(err.message, "error");
    }
  };

  const filtered = customers.filter(
    (c) =>
      (c.fullName || "").toLowerCase().includes(search.toLowerCase()) ||
      (c.email || "").toLowerCase().includes(search.toLowerCase()) ||
      (c.nicPassport || "").toLowerCase().includes(search.toLowerCase()),
  );

  const inputCls =
    "w-full rounded-2xl border border-cashmere-700 bg-heritage-900 px-3 py-2.5 text-sm text-white focus:outline-none focus:border-brass";

  return (
    <div className="space-y-6">
      <div className="rounded-[1.75rem] border border-cashmere-700 bg-cashmere-900 p-5 shadow-card">
        <div className="mb-4 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-[0.35em] text-slate-400">
              Guest Registry
            </p>
            <h3 className="mt-1 text-xl font-bold text-white">
              {editing ? "Edit Customer" : "Add Customer"}
            </h3>
            <p className="mt-1 text-sm text-slate-400">
              Keep guest details organized for fast reservation handling.
            </p>
          </div>
          <span className="rounded-full bg-brass/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.35em] text-brass">
            {customers.length} Guests
          </span>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-3 md:grid-cols-2">
          <Input
            label="Full Name"
            placeholder="Enter full name here"
            required
            value={form.fullName}
            onChange={(e) => setForm({ ...form, fullName: e.target.value })}
          />
          <Input
            label="NIC / Passport"
            placeholder="Enter NIC or passport number here"
            required
            value={form.nicPassport}
            onChange={(e) => setForm({ ...form, nicPassport: e.target.value })}
          />
          <Input
            label="Email"
            type="email"
            placeholder="Enter email address here"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <Input
            label="Phone"
            placeholder="Enter phone number here"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
          <Input
            label="Address"
            placeholder="Enter address here"
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
            className="md:col-span-2"
          />
          <div className="md:col-span-2 flex gap-3">
            {editing && (
              <Button
                type="button"
                variant="outline"
                fullWidth
                onClick={resetForm}
              >
                Cancel
              </Button>
            )}
            <Button type="submit" variant="primary" fullWidth>
              {editing ? "Update Customer" : "Add Customer"}
            </Button>
          </div>
        </form>
      </div>

      <div className="rounded-[1.75rem] border border-cashmere-700 bg-cashmere-900 p-5 shadow-card">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-xl font-bold text-white">Customer List</h3>
            <p className="text-sm text-slate-400">
              Search and manage guest records quickly.
            </p>
          </div>
          <Input
            placeholder="Search by name, email or NIC here"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="sm:w-72"
          />
        </div>
        {loading ? (
          <p className="text-sm text-slate-400">Loading…</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="border-b border-cashmere-700 text-slate-400 text-xs uppercase">
                  <th className="p-2">Full Name</th>
                  <th className="p-2">NIC / Passport</th>
                  <th className="p-2">Phone</th>
                  <th className="p-2">Email</th>
                  <th className="p-2">Address</th>
                  <th className="p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-4 text-center text-slate-500">
                      No customers found.
                    </td>
                  </tr>
                ) : (
                  filtered.map((c) => (
                    <tr
                      key={c.id}
                      className="border-b border-cashmere-800 hover:bg-heritage-900"
                    >
                      <td className="p-2 text-white font-semibold">
                        {c.fullName}
                      </td>
                      <td className="p-2">{c.nicPassport}</td>
                      <td className="p-2">{c.phone}</td>
                      <td className="p-2">{c.email}</td>
                      <td className="p-2">{c.address}</td>
                      <td className="p-2">
                        <div className="flex flex-wrap gap-2">
                          <button
                            onClick={() => handleEdit(c)}
                            className="rounded border border-cashmere-700 px-2 py-1 text-xs text-white transition hover:bg-cashmere-700"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(c.id)}
                            className="rounded border border-red-500/30 px-2 py-1 text-xs text-red-400 transition hover:bg-red-500/10"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
