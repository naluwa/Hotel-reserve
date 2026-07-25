import { useEffect, useState } from "react";
import { Input, Button } from "../base";
import {
  createRoom,
  deleteRoom,
  fetchRooms,
  updateRoom,
} from "../../services/api";

export default function RoomsPanel({ token }) {
  const [rooms, setRooms] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    roomNumber: "",
    roomType: "",
    price: "",
    available: true,
  });
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        setRooms(await fetchRooms(token));
      } catch (err) {
        setError(err.message);
      }
    };
    load();
  }, [token]);

  const resetForm = () =>
    setForm({ number: "", type: "", price: "", available: true });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const payload = {
        roomNumber: form.roomNumber,
        roomType: form.roomType,
        pricePerNight: Number(form.price),
        status: form.available ? "Available" : "Occupied",
      };
      if (editing) {
        const updated = await updateRoom(editing.id, payload, token);
        setRooms((prev) =>
          prev.map((room) => (room.id === editing.id ? updated : room)),
        );
      } else {
        const created = await createRoom(payload, token);
        setRooms((prev) => [...prev, created]);
      }
      setEditing(null);
      resetForm();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (room) => {
    setEditing(room);
    setForm({
      roomNumber: room.roomNumber,
      roomType: room.roomType,
      price: room.pricePerNight,
      available: room.status === "Available",
    });
  };

  const handleDelete = async (id) => {
    setError("");
    try {
      await deleteRoom(id, token);
      setRooms((prev) => prev.filter((room) => room._id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] border border-cashmere-700 bg-cashmere-900 p-6 shadow-card">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-white">Rooms</h2>
            <p className="mt-1 text-sm text-slate-400">
              Manage room inventory, rates, and availability.
            </p>
          </div>
        </div>

        <form
          className="mt-6 grid gap-4 md:grid-cols-4"
          onSubmit={handleSubmit}
        >
          <Input
            label="Room Number"
            placeholder="Enter room number here"
            value={form.roomNumber}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, roomNumber: e.target.value }))
            }
            required
          />
          <Input
            label="Room Type"
            placeholder="Enter room type here"
            value={form.roomType}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, roomType: e.target.value }))
            }
            required
          />
          <Input
            label="Price Per Night"
            type="number"
            placeholder="Enter price per night here"
            value={form.price}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, price: Number(e.target.value) }))
            }
            required
          />
          <Button type="submit" variant="primary">
            {editing ? "Update Room" : "Add Room"}
          </Button>
        </form>

        {error && <p className="mt-4 text-sm text-crimson">{error}</p>}
      </section>

      <section className="rounded-[2rem] border border-cashmere-700 bg-cashmere-900 p-6 shadow-card">
        <h3 className="text-xl font-semibold text-white">Room List</h3>
        <div className="mt-4 space-y-4">
          {rooms.map((room) => (
            <div
              key={room._id}
              className="flex flex-col gap-3 rounded-[1.75rem] border border-cashmere-800 bg-heritage-900 p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="text-lg font-semibold text-white">
                  {room.roomNumber} - {room.roomType}
                </p>
                <p className="text-sm text-slate-400">
                  ${room.pricePerNight} / night -{" "}
                  {room.status === "Available" ? "Available" : "Unavailable"}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(room)}
                >
                  Edit
                </Button>
                <Button
                  type="button"
                  variant="danger"
                  size="sm"
                  onClick={() => handleDelete(room.id)}
                >
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
