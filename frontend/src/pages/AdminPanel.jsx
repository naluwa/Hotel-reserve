import { useState, useEffect, useCallback } from "react";
import { ADMIN_VIEWS, TOAST_TYPES } from "../config/constants";
import ConfirmDialog from "../components/common/ConfirmDialog";
import AdminUsersPanel from "../components/admin/AdminUsersPanel";
import AddRoomModal from "../components/admin/AddRoomModal";
import EditRoomModal from "../components/admin/EditRoomModal";
import DashboardPanel from "../components/admin/DashboardPanel";
import CustomersPanel from "../components/admin/CustomersPanel";
import ReservationsPanel from "../components/admin/ReservationsPanel";
import CheckInPanel from "../components/admin/CheckInPanel";
import CheckOutPanel from "../components/admin/CheckOutPanel";
import PaymentsPanel from "../components/admin/PaymentsPanel";
import { Button } from "../components/base";
import {
  createRoom,
  fetchRooms,
  updateRoom,
  deleteRoom,
} from "../services/api";

const ADMIN_NAV_TABS = [
  [ADMIN_VIEWS.DASHBOARD, "Dashboard"],
  [ADMIN_VIEWS.ROOMS, "Rooms"],
  [ADMIN_VIEWS.CUSTOMERS, "Customers"],
  [ADMIN_VIEWS.RESERVATIONS, "Reservations"],
  [ADMIN_VIEWS.CHECKIN, "Check-In"],
  [ADMIN_VIEWS.CHECKOUT, "Check-Out"],
  [ADMIN_VIEWS.PAYMENTS, "Payments"],
  [ADMIN_VIEWS.USERS, "Admins"],
];

const RoomsTable = ({ rooms, onEditRoom, onDeleteRoom, onAddRoom }) => (
  <div className="overflow-hidden rounded-[1.5rem] border border-cashmere-700 bg-cashmere-900 shadow-card">
    <div className="flex flex-col gap-3 border-b border-cashmere-700 bg-heritage-900 p-4 md:flex-row md:items-center md:justify-between">
      <div>
        <p className="text-[11px] uppercase tracking-[0.35em] text-slate-400">
          Inventory Overview
        </p>
        <h3 className="text-lg font-semibold text-white">Room Inventory</h3>
      </div>
      <Button type="button" variant="primary" size="sm" onClick={onAddRoom}>
        Add Room
      </Button>
    </div>
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left">
        <thead>
          <tr className="border-b border-cashmere-700 text-slate-400 text-xs uppercase">
            <th className="p-3">Room</th>
            <th className="p-3">Type</th>
            <th className="p-3">Rate</th>
            <th className="p-3">Status</th>
            <th className="p-3">Description</th>
            <th className="p-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {rooms.map((room) => (
            <tr
              key={room.id}
              className="border-b border-cashmere-800 hover:bg-heritage-900"
            >
              <td className="p-3 font-bold text-white">
                Room {room.roomNumber}
              </td>
              <td className="p-3">{room.roomType}</td>
              <td className="p-3">
                LKR {room.pricePerNight?.toLocaleString()}
              </td>
              <td className="p-3">
                <span
                  className={`rounded px-2 py-1 text-[10px] uppercase font-bold ${
                    room.status === "Available"
                      ? "bg-green-950 text-green-400 border border-green-800"
                      : room.status === "Occupied"
                        ? "bg-red-950 text-red-400 border border-red-800"
                        : room.status === "Reserved"
                          ? "bg-blue-950 text-blue-400 border border-blue-800"
                          : "bg-yellow-950 text-yellow-400 border border-yellow-800"
                  }`}
                >
                  {room.status || "Available"}
                </span>
              </td>
              <td className="max-w-xs truncate p-3 text-xs text-slate-400">
                {room.description || "—"}
              </td>
              <td className="p-3">
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => onEditRoom({ ...room })}
                    className="rounded border border-cashmere-700 px-2 py-1 text-xs text-white transition hover:bg-cashmere-700"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDeleteRoom(room)}
                    className="rounded border border-red-500/30 px-2 py-1 text-xs text-red-400 transition hover:bg-red-500/10"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default function AdminPanel({
  authToken,
  currentUserEmail,
  onRoomsChanged,
  showToast,
}) {
  const [rooms, setRooms] = useState([]);
  const [subView, setSubView] = useState(ADMIN_VIEWS.DASHBOARD);
  const [isLoading, setIsLoading] = useState(false);
  const [showAddRoom, setShowAddRoom] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    title: "",
    description: "",
    onConfirm: null,
  });

  const closeConfirmDialog = () =>
    setConfirmDialog((current) => ({
      ...current,
      open: false,
      onConfirm: null,
    }));

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const fetchedRooms = await fetchRooms();
      setRooms(fetchedRooms || []);
    } catch (err) {
      showToast(err.message, TOAST_TYPES.ERROR);
    } finally {
      setIsLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const performAction = async (
    promise,
    successMessage,
    shouldRefreshRooms = false,
  ) => {
    try {
      await promise;
      showToast(successMessage, TOAST_TYPES.SUCCESS);
      await loadData();
      if (shouldRefreshRooms) onRoomsChanged();
    } catch (err) {
      showToast(err.message, TOAST_TYPES.ERROR);
    }
  };

  const handleAddRoom = (data) =>
    performAction(
      createRoom(data, authToken),
      `Room ${data.roomNumber} added.`,
      true,
    ).then(() => setShowAddRoom(false));

  const handleSaveRoom = () =>
    performAction(
      updateRoom(editingRoom.id, editingRoom, authToken),
      "Room updated.",
      true,
    ).then(() => setEditingRoom(null));

  const handleDeleteRoom = (room) => {
    setConfirmDialog({
      open: true,
      title: "Delete Room",
      description: `Are you sure you want to delete Room ${room.roomNumber}? This action cannot be undone.`,
      onConfirm: async () => {
        closeConfirmDialog();
        await performAction(
          deleteRoom(room.id, authToken),
          "Room deleted.",
          true,
        );
      },
    });
  };

  return (
    <div className="flex w-full flex-col gap-6 text-slate-300">
      <div className="flex flex-col gap-4 border-b border-brass-subtle pb-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-[11px] uppercase tracking-[0.35em] text-slate-400">
            Operations hub
          </p>
          <h1 className="font-serif text-3xl text-white">Admin Portal</h1>
        </div>
        <div className="flex flex-wrap gap-2">
          {ADMIN_NAV_TABS.map(([key, label]) => (
            <Button
              key={key}
              type="button"
              size="sm"
              variant={subView === key ? "primary" : "ghost"}
              className={
                subView === key ? "uppercase" : "uppercase text-slate-400"
              }
              onClick={() => setSubView(key)}
            >
              {label}
            </Button>
          ))}
        </div>
      </div>

      {isLoading && subView === ADMIN_VIEWS.ROOMS ? (
        <p className="py-12 text-center text-sm text-slate-400">Loading...</p>
      ) : (
        <div className="w-full">
          {subView === ADMIN_VIEWS.DASHBOARD && (
            <DashboardPanel token={authToken} showToast={showToast} />
          )}
          {subView === ADMIN_VIEWS.ROOMS && (
            <RoomsTable
              rooms={rooms}
              onEditRoom={setEditingRoom}
              onDeleteRoom={handleDeleteRoom}
              onAddRoom={() => setShowAddRoom(true)}
            />
          )}
          {subView === ADMIN_VIEWS.CUSTOMERS && (
            <CustomersPanel token={authToken} showToast={showToast} />
          )}
          {subView === ADMIN_VIEWS.RESERVATIONS && (
            <ReservationsPanel token={authToken} showToast={showToast} />
          )}
          {subView === ADMIN_VIEWS.CHECKIN && (
            <CheckInPanel token={authToken} showToast={showToast} />
          )}
          {subView === ADMIN_VIEWS.CHECKOUT && (
            <CheckOutPanel token={authToken} showToast={showToast} />
          )}
          {subView === ADMIN_VIEWS.PAYMENTS && (
            <PaymentsPanel token={authToken} showToast={showToast} />
          )}
          {subView === ADMIN_VIEWS.USERS && (
            <AdminUsersPanel
              authToken={authToken}
              currentUserEmail={currentUserEmail}
              showToast={showToast}
            />
          )}
        </div>
      )}

      {showAddRoom && (
        <AddRoomModal
          onSubmit={handleAddRoom}
          onClose={() => setShowAddRoom(false)}
        />
      )}
      {editingRoom && (
        <EditRoomModal
          room={editingRoom}
          onRoomChange={setEditingRoom}
          onSubmit={(e) => {
            e.preventDefault();
            handleSaveRoom();
          }}
          onClose={() => setEditingRoom(null)}
        />
      )}
      <ConfirmDialog
        open={confirmDialog.open}
        title={confirmDialog.title}
        description={confirmDialog.description}
        confirmLabel="Yes, delete"
        cancelLabel="Cancel"
        onConfirm={confirmDialog.onConfirm}
        onCancel={closeConfirmDialog}
      />
    </div>
  );
}
