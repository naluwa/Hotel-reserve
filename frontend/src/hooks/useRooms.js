// External
import { useState, useCallback, useEffect } from "react";
// Internal — constants & services
import { TOAST_TYPES } from "../config/constants";
import {
  fetchRooms,
  fetchAvailableRooms,
  createReservation,
  updateRoom,
} from "../services/api";
import { getRoomIdentifier } from "../utils/roomCatalog";

// Hook

export function useRooms(showToast, token) {
  const [rooms, setRooms] = useState([]);
  // setFilteredRooms is intentionally public: Navigation uses it to clear search results.
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterCheckIn, setFilterCheckIn] = useState("");
  const [filterCheckOut, setFilterCheckOut] = useState("");
  const [bookingRoom, setBookingRoom] = useState(null);
  const [editingRoom, setEditingRoom] = useState(null);

  const loadRooms = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await fetchRooms();
      setRooms(data);
      setFilteredRooms(data);
    } catch {
      showToast(
        "Could not load rooms. Please verify the server is running.",
        TOAST_TYPES.ERROR,
      );
    } finally {
      setIsLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    loadRooms();
  }, [loadRooms]);

  const handleFindRooms = async () => {
    let start = filterCheckIn;
    let end = filterCheckOut;

    if (start && !end) {
      const startDate = new Date(start);
      startDate.setDate(startDate.getDate() + 1);
      end = startDate.toISOString().split("T")[0];
      setFilterCheckOut(end);
    } else if (!start && end) {
      const endDate = new Date(end);
      endDate.setDate(endDate.getDate() - 1);
      start = endDate.toISOString().split("T")[0];
      setFilterCheckIn(start);
    }

    if (start && end && end <= start) {
      const startDate = new Date(start);
      startDate.setDate(startDate.getDate() + 1);
      end = startDate.toISOString().split("T")[0];
      setFilterCheckOut(end);
    }

    setIsLoading(true);
    try {
      const available = await fetchAvailableRooms(start || "", end || "");
      setFilteredRooms(available);
      const count = available.length;
      showToast(
        `${count} room${count !== 1 ? "s" : ""} available for your search.`,
        TOAST_TYPES.INFO,
      );
    } catch {
      showToast(
        "Could not filter availability. Showing all rooms.",
        TOAST_TYPES.WARNING,
      );
      setFilteredRooms(rooms);
    } finally {
      setIsLoading(false);
    }
  };

  const resetDateSearch = () => {
    setFilterCheckIn("");
    setFilterCheckOut("");
    setFilteredRooms(rooms);
  };

  /**
   * Validates all preconditions before a booking modal can open:
   * - User must be authenticated (when requireAuth=true)
   * Returns { valid: boolean, redirectToLogin: boolean }
   */
  const validateBookingPreconditions = (requireAuth) => {
    if (requireAuth && !token) {
      showToast(
        "Please sign in or register to make a reservation.",
        TOAST_TYPES.INFO,
      );
      return { valid: false, redirectToLogin: true };
    }
    return { valid: true, redirectToLogin: false };
  };

  const openBookingModal = (room, requireAuth) => {
    const { valid, redirectToLogin } =
      validateBookingPreconditions(requireAuth);
    if (!valid) return redirectToLogin ? false : true;
    setBookingRoom(room);
    return true;
  };

  const handleCreateBooking = async (
    customerName,
    customerEmail,
    checkInDate,
    checkOutDate,
  ) => {
    if (!bookingRoom) {
      showToast("Please select a room first.", TOAST_TYPES.ERROR);
      return false;
    }

    if (!checkInDate || !checkOutDate) {
      showToast(
        "Please select both arrival and departure dates.",
        TOAST_TYPES.ERROR,
      );
      return false;
    }

    if (checkOutDate <= checkInDate) {
      showToast("Departure must be after arrival.", TOAST_TYPES.ERROR);
      return false;
    }

    try {
      const roomId = getRoomIdentifier(bookingRoom);
      const availableRooms = await fetchAvailableRooms(
        checkInDate,
        checkOutDate,
      );
      const isRoomAvailable = availableRooms.some(
        (room) => getRoomIdentifier(room) === roomId,
      );

      if (!isRoomAvailable) {
        showToast(
          "These dates are not available for this room. Please choose another stay.",
          TOAST_TYPES.ERROR,
        );
        return false;
      }

      await createReservation(
        {
          roomId,
          customerName,
          customerEmail,
          checkInDate,
          checkOutDate,
          numberOfGuests: 1,
        },
        token,
      );
      showToast(
        `Room ${bookingRoom.roomNumber} reserved successfully.`,
        TOAST_TYPES.SUCCESS,
      );
      setFilterCheckIn(checkInDate);
      setFilterCheckOut(checkOutDate);
      setBookingRoom(null);
      setFilteredRooms(await fetchAvailableRooms(checkInDate, checkOutDate));
      return true;
    } catch (err) {
      showToast(err.message, TOAST_TYPES.ERROR);
      return false;
    }
  };

  const handleUpdateRoom = async () => {
    if (!editingRoom) return;
    try {
      await updateRoom(editingRoom.id, editingRoom, token);
      showToast("Ledger entry updated.", TOAST_TYPES.SUCCESS);
      setEditingRoom(null);
      await loadRooms();
    } catch (err) {
      showToast(err.message, TOAST_TYPES.ERROR);
    }
  };

  return {
    rooms,
    filteredRooms,
    isLoading,
    filterCheckIn,
    filterCheckOut,
    bookingRoom,
    editingRoom,
    setFilterCheckIn,
    setFilterCheckOut,
    setBookingRoom,
    setEditingRoom,
    setFilteredRooms,
    loadRooms,
    handleFindRooms,
    resetDateSearch,
    openBookingModal,
    handleCreateBooking,
    handleUpdateRoom,
  };
}
