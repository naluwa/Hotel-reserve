import {
  Modal,
  ModalContent,
  ModalFooter,
  Input,
  Select,
  Button,
} from "../base";

const ROOM_TYPES = ["Single", "Double", "Deluxe", "Suite"];
const ROOM_STATUSES = ["Available", "Reserved", "Occupied", "Maintenance"];

export default function EditRoomModal({
  room,
  onRoomChange,
  onSubmit,
  onClose,
}) {
  if (!room) return null;

  return (
    <Modal
      isOpen
      onClose={onClose}
      title={`Edit Room ${room.roomNumber}`}
      size="sm"
    >
      <form onSubmit={onSubmit}>
        <ModalContent className="space-y-4">
          <Input
            label="Room Number"
            required
            value={room.roomNumber}
            onChange={(e) =>
              onRoomChange({ ...room, roomNumber: e.target.value })
            }
          />

          <Select
            label="Room Type"
            required
            value={room.roomType}
            onChange={(e) =>
              onRoomChange({ ...room, roomType: e.target.value })
            }
            options={ROOM_TYPES.map((type) => ({ value: type, label: type }))}
          />

          <Input
            label="Price Per Night (LKR)"
            type="number"
            required
            step="0.01"
            min="1"
            value={room.pricePerNight}
            onChange={(e) =>
              onRoomChange({
                ...room,
                pricePerNight: parseFloat(e.target.value),
              })
            }
          />

          <Input
            label="Description"
            value={room.description || ""}
            onChange={(e) =>
              onRoomChange({ ...room, description: e.target.value })
            }
          />

          <Select
            label="Status"
            required
            value={room.status}
            onChange={(e) => onRoomChange({ ...room, status: e.target.value })}
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
                  onRoomChange({ ...room, imageUrl: reader.result });
                };
                reader.readAsDataURL(file);
              }}
            />
            {room.imageUrl && (
              <img
                src={room.imageUrl}
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
            Save Changes
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  );
}
