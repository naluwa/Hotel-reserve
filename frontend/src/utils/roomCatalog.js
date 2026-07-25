export const buildRoomCategories = (rooms = []) => {
  const categories = new Set(
    rooms.map((room) => getRoomType(room)).filter(Boolean),
  );
  return ["All", ...Array.from(categories)];
};

const isRoomAvailable = (room = {}) => {
  if (typeof room?.available === "boolean") {
    return room.available === true;
  }

  const status = (room?.status || "").toString().toLowerCase();
  return status === "available" || status === "vacant";
};

export const filterAndSortRooms = (rooms = [], filters = {}) => {
  const {
    categoryFilter = "All",
    sortBy = "default",
    guestFilter = 1,
  } = filters;
  let nextRooms = [...rooms];

  if (
    categoryFilter &&
    categoryFilter !== "All" &&
    categoryFilter.trim() !== ""
  ) {
    nextRooms = nextRooms.filter(
      (room) => getRoomType(room) === categoryFilter,
    );
  }

  if (guestFilter) {
    nextRooms = nextRooms.filter((room) => {
      const roomCapacity = String(room?.capacity || "")
        .toLowerCase()
        .replace("guests", "")
        .replace("guest", "")
        .trim();
      const capacityNumber =
        Number(roomCapacity) ||
        (room?.roomType?.toLowerCase()?.includes("suite")
          ? 4
          : room?.roomType?.toLowerCase()?.includes("single")
            ? 1
            : 2);
      return capacityNumber === Number(guestFilter);
    });
  }

  nextRooms = [...nextRooms].sort((a, b) => {
    const aAvailable = isRoomAvailable(a);
    const bAvailable = isRoomAvailable(b);

    if (aAvailable && !bAvailable) return -1;
    if (!aAvailable && bAvailable) return 1;

    if (sortBy === "price-asc") {
      return (Number(a.pricePerNight) || 0) - (Number(b.pricePerNight) || 0);
    }

    if (sortBy === "price-desc") {
      return (Number(b.pricePerNight) || 0) - (Number(a.pricePerNight) || 0);
    }

    return 0;
  });

  return nextRooms;
};

export const computeStayNights = (checkIn, checkOut) => {
  if (!checkIn || !checkOut || checkOut <= checkIn) {
    return 0;
  }

  return Math.round(
    (new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24),
  );
};

export const getRoomIdentifier = (room = {}) =>
  room.id ?? room._id ?? room.roomNumber ?? "";

export const getRoomType = (room = {}) => room.roomType ?? room.type ?? "";
