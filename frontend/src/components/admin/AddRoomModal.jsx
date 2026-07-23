import { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalFooter,
  Input,
  Select,
  Button,
} from "../base";

const ROOM_TYPES = ["Single", "Double", "Deluxe", "Suite"];
const ROOM_STATUSES = ["Available", "Occupied", "Reserved", "Maintenance"];

export default function AddRoomModal({ onSubmit, onClose }) {
  const [form, setForm] = useState({
    roomNumber: "",
    roomType: "Single",
    pricePerNight: "",
    description: "",
    status: "Available",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.roomNumber.trim()) return;
    if (parseFloat(form.pricePerNight) <= 0) return;
    onSubmit({ ...form, pricePerNight: parseFloat(form.pricePerNight) });
  };

  return (
    <Modal isOpen onClose={onClose} title="Add New Room" size="sm">
      <form onSubmit={handleSubmit}>
        <ModalContent className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <Input
              label="Room Number"
              required
              placeholder="Enter room number here"
              value={form.roomNumber}
              onChange={(e) => setForm({ ...form, roomNumber: e.target.value })}
            />
            <Input
              label="Price Per Night (LKR)"
              type="number"
              required
              step="0.01"
              min="1"
              placeholder="Enter price per night here"
              value={form.pricePerNight}
              onChange={(e) =>
                setForm({ ...form, pricePerNight: e.target.value })
              }
            />
          </div>

          <Select
            label="Room Type"
            required
            value={form.roomType}
            onChange={(e) => setForm({ ...form, roomType: e.target.value })}
            options={ROOM_TYPES.map((type) => ({ value: type, label: type }))}
          />

          <Input
            label="Description"
            placeholder="Enter room description here"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />

          <Select
            label="Status"
            required
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
            options={ROOM_STATUSES.map((status) => ({
              value: status,
              label: status,
            }))}
          />

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Upload Room Photo (Admin Only)
            </label>
            <input
              type="file"
              accept="image/*"
              className="w-full rounded-xl border border-cashmere-700 bg-heritage-900 p-2 text-xs text-slate-300 file:mr-4 file:rounded-lg file:border-0 file:bg-brass file:px-3 file:py-1 file:text-xs file:font-bold file:text-heritage-900"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = () => {
                  setForm((prev) => ({ ...prev, imageUrl: reader.result }));
                };
                reader.readAsDataURL(file);
              }}
            />
            {form.imageUrl && (
              <img
                src={form.imageUrl}
                alt="Room Preview"
                className="mt-2 h-24 w-full rounded-xl object-cover border border-brass-subtle"
              />
            )}
          </div>
        </ModalContent>

        <ModalFooter className="flex-col gap-3 sm:flex-row">
          <Button type="button" variant="outline" fullWidth onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" fullWidth>
            Add Room
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  );
}
