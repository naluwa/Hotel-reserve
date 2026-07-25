import { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalFooter,
  Input,
  Select,
  TextArea,
  Button,
} from "../base";
import { ROOM_TYPES } from "../../config/roomTypes";

const ROOM_STATUSES = ["Available", "Occupied", "Reserved", "Maintenance"];

export default function AddRoomModal({ onSubmit, onClose }) {
  const [form, setForm] = useState({
    roomNumber: "",
    roomType: ROOM_TYPES[0],
    pricePerNight: "",
    description: "",
    status: "Available",
    imageUrl: "",
    roomSize: "",
    bedType: "Queen Bed",
    capacity: "2 Guests",
    amenities: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.roomNumber.trim()) return;

    const pricePerNight = parseFloat(form.pricePerNight);
    if (Number.isNaN(pricePerNight) || pricePerNight <= 0) return;

    const amenities = form.amenities
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

    onSubmit({
      ...form,
      pricePerNight,
      amenities,
    });
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
            name="roomType"
            required
            value={form.roomType}
            onChange={(e) => setForm({ ...form, roomType: e.target.value })}
            options={ROOM_TYPES.map((type) => ({ value: type, label: type }))}
          />

          <TextArea
            label="Description"
            name="description"
            placeholder="Enter room description here"
            rows={4}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />

          <div className="grid gap-3 sm:grid-cols-2">
            <Input
              label="Room Size"
              name="roomSize"
              placeholder="520 sq ft"
              value={form.roomSize}
              onChange={(e) => setForm({ ...form, roomSize: e.target.value })}
            />
            <Select
              label="Bed Type"
              name="bedType"
              value={form.bedType}
              onChange={(e) => setForm({ ...form, bedType: e.target.value })}
              options={[
                "King Bed",
                "Queen Bed",
                "Twin Beds",
                "Single Bed",
                "Two Double Beds",
              ].map((type) => ({ value: type, label: type }))}
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <Input
              label="Guests"
              name="capacity"
              placeholder="2 Guests"
              value={form.capacity}
              onChange={(e) => setForm({ ...form, capacity: e.target.value })}
            />
            <Input
              label="Amenities"
              name="amenities"
              placeholder="Free WiFi, Ocean View, Mini Bar"
              value={form.amenities}
              onChange={(e) => setForm({ ...form, amenities: e.target.value })}
            />
          </div>

          <Select
            label="Status"
            name="status"
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
