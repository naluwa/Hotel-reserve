export const buildRoomCategories = (rooms = []) => {
  const categories = new Set(
    rooms.map((room) => getRoomType(room)).filter(Boolean),
  );
  return ["All", ...Array.from(categories)];
};

export const filterAndSortRooms = (rooms = [], filters = {}) => {
  const { categoryFilter = "All", sortBy = "default" } = filters;
  let nextRooms = [...rooms];

  if (categoryFilter && categoryFilter !== "All" && categoryFilter.trim() !== "") {
    nextRooms = nextRooms.filter(
      (room) => getRoomType(room) === categoryFilter,
    );
  }

  if (sortBy === "price-asc") {
    nextRooms = [...nextRooms].sort(
      (a, b) => a.pricePerNight - b.pricePerNight,
    );
  } else if (sortBy === "price-desc") {
    nextRooms = [...nextRooms].sort(
      (a, b) => b.pricePerNight - a.pricePerNight,
    );
  }

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
