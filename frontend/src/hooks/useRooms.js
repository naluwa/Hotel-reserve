import { useState, useCallback, useEffect } from "react";
import { TOAST_TYPES } from "../config/constants";
import {
  fetchRooms,
  fetchAvailableRooms,
  createReservation,
  updateRoom,
} from "../services/api";
import { getRoomIdentifier } from "../utils/roomCatalog";

const formatIsoDate = (date) => date.toISOString().split("T")[0];

const normalizeDateRange = (start, end) => {
  if (start && !end) {
    const nextDay = new Date(start);
    nextDay.setDate(nextDay.getDate() + 1);
    return { start, end: formatIsoDate(nextDay) };
  }

  if (!start && end) {
    const previousDay = new Date(end);
    previousDay.setDate(previousDay.getDate() - 1);
    return { start: formatIsoDate(previousDay), end };
  }

  if (start && end && end <= start) {
    const nextDay = new Date(start);
    nextDay.setDate(nextDay.getDate() + 1);
    return { start, end: formatIsoDate(nextDay) };
  }

  return { start, end };
};

const validateBookingDates = (checkInDate, checkOutDate) => {
  if (!checkInDate || !checkOutDate) {
    return "Please select both arrival and departure dates.";
  }
  if (checkOutDate <= checkInDate) {
    return "Departure must be after arrival.";
  }
  return null;
};

export function useRooms(showToast, token) {
  const [rooms, setRooms] = useState([]);
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterCheckIn, setFilterCheckIn] = useState("");
  const [filterCheckOut, setFilterCheckOut] = useState("");
  const [bookingRoom, setBookingRoom] = useState(null);
  const [editingRoom, setEditingRoom] = useState(null);

  const toast = useCallback(
    (message, type = TOAST_TYPES.INFO) => showToast(message, type),
    [showToast],
  );

  const loadRooms = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await fetchRooms();
      setRooms(data);
      setFilteredRooms(data);
    } catch {
      toast(
        "Could not load rooms. Please verify the server is running.",
        TOAST_TYPES.ERROR,
      );
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadRooms();
  }, [loadRooms]);

  const handleFindRooms = async () => {
    const normalized = normalizeDateRange(filterCheckIn, filterCheckOut);

    if (normalized.start !== filterCheckIn) {
      setFilterCheckIn(normalized.start || "");
    }
    if (normalized.end !== filterCheckOut) {
      setFilterCheckOut(normalized.end || "");
    }

    setIsLoading(true);
    try {
      const available = await fetchAvailableRooms(
        normalized.start || "",
        normalized.end || "",
      );
      setFilteredRooms(available);
      const count = available.length;
      toast(
        `${count} room${count !== 1 ? "s" : ""} available for your search.`,
        TOAST_TYPES.INFO,
      );
    } catch {
      toast(
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

  const validateBookingPreconditions = (requireAuth) => {
    if (requireAuth && !token) {
      toast(
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
    if (!valid) return redirectToLogin;
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
      toast("Please select a room first.", TOAST_TYPES.ERROR);
      return false;
    }

    const bookingError = validateBookingDates(checkInDate, checkOutDate);
    if (bookingError) {
      toast(bookingError, TOAST_TYPES.ERROR);
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
        toast(
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

      toast(
        `Room ${bookingRoom.roomNumber} reserved successfully.`,
        TOAST_TYPES.SUCCESS,
      );

      setFilterCheckIn(checkInDate);
      setFilterCheckOut(checkOutDate);
      setBookingRoom(null);
      setFilteredRooms(await fetchAvailableRooms(checkInDate, checkOutDate));
      return true;
    } catch (err) {
      toast(err.message, TOAST_TYPES.ERROR);
      return false;
    }
  };

  const handleUpdateRoom = async () => {
    if (!editingRoom) return;
    try {
      await updateRoom(editingRoom.id, editingRoom, token);
      toast("Ledger entry updated.", TOAST_TYPES.SUCCESS);
      setEditingRoom(null);
      await loadRooms();
    } catch (err) {
      toast(err.message, TOAST_TYPES.ERROR);
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
