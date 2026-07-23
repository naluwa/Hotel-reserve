import test from "node:test";
import assert from "node:assert/strict";

import {
  buildRoomCategories,
  computeStayNights,
  filterAndSortRooms,
  getRoomIdentifier,
  getRoomType,
} from "./roomCatalog.js";

test("buildRoomCategories includes All and unique room types", () => {
  const rooms = [
    { id: 1, roomType: "Deluxe" },
    { id: 2, type: "Suite" },
    { id: 3, roomType: "Deluxe" },
  ];

  assert.deepEqual(buildRoomCategories(rooms), ["All", "Deluxe", "Suite"]);
});

test("filterAndSortRooms preserves the existing filter and sort semantics", () => {
  const rooms = [
    { id: 1, roomType: "Deluxe", pricePerNight: 120 },
    { id: 2, roomType: "Suite", pricePerNight: 90 },
    { id: 3, roomType: "Deluxe", pricePerNight: 80 },
  ];

  assert.deepEqual(
    filterAndSortRooms(rooms, {
      categoryFilter: "Deluxe",
      sortBy: "price-asc",
    }),
    [
      { id: 3, roomType: "Deluxe", pricePerNight: 80 },
      { id: 1, roomType: "Deluxe", pricePerNight: 120 },
    ],
  );

  assert.deepEqual(
    filterAndSortRooms(rooms, { categoryFilter: "All", sortBy: "price-desc" }),
    [
      { id: 1, roomType: "Deluxe", pricePerNight: 120 },
      { id: 2, roomType: "Suite", pricePerNight: 90 },
      { id: 3, roomType: "Deluxe", pricePerNight: 80 },
    ],
  );
});
test("computeStayNights returns zero for invalid ranges and calculates valid stays", () => {
  assert.equal(computeStayNights("", "2025-01-02"), 0);
  assert.equal(computeStayNights("2025-01-02", "2025-01-01"), 0);
  assert.equal(computeStayNights("2025-01-01", "2025-01-03"), 2);
});
test("getRoomIdentifier and getRoomType normalize room data safely", () => {
  assert.equal(getRoomIdentifier({ id: 42 }), 42);
  assert.equal(getRoomIdentifier({ _id: "abc" }), "abc");
  assert.equal(getRoomIdentifier({ roomNumber: "101" }), "101");
  assert.equal(getRoomType({ roomType: "Deluxe" }), "Deluxe");
  assert.equal(getRoomType({ type: "Suite" }), "Suite");
  assert.equal(getRoomType({}), "");
});
