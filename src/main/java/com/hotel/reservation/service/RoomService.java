package com.hotel.reservation.service;

import com.hotel.reservation.model.Reservation;
import com.hotel.reservation.model.Room;
import com.hotel.reservation.repository.ReservationRepository;
import com.hotel.reservation.repository.RoomRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class RoomService {

    private static final List<String> ACTIVE_RESERVATION_STATUSES = List.of("Reserved", "Checked In");

    private final RoomRepository roomRepository;
    private final ReservationRepository reservationRepository;

    public List<Room> getAllRooms() {
        List<Room> rooms = new ArrayList<>();
        for (Room room : roomRepository.findAll()) {
            rooms.add(normalizeRoom(room));
        }
        return rooms;
    }

    public Room getRoomById(String id) {
        return roomRepository.findById(id)
                .map(this::normalizeRoom)
                .orElse(null);
    }

    public Room saveRoom(Room room) {
        // normalizeRoom sets status to "Available" when null/blank - business default lives here
        return roomRepository.save(normalizeRoom(room));
    }

    public Room updateRoom(String id, Room updatedRoom) {
        Room existingRoom = roomRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Room not found: " + id));

        existingRoom.setRoomNumber(updatedRoom.getRoomNumber());
        existingRoom.setRoomType(updatedRoom.getRoomType());
        existingRoom.setPricePerNight(updatedRoom.getPricePerNight());
        existingRoom.setStatus(updatedRoom.getStatus());
        existingRoom.setDescription(updatedRoom.getDescription());
        existingRoom.setImageUrl(updatedRoom.getImageUrl());
        existingRoom.setRoomSize(updatedRoom.getRoomSize());
        existingRoom.setBedType(updatedRoom.getBedType());
        existingRoom.setCapacity(updatedRoom.getCapacity());
        existingRoom.setAmenities(updatedRoom.getAmenities());

        return roomRepository.save(normalizeRoom(existingRoom));
    }

    public void deleteRoom(String id) {
        roomRepository.deleteById(id);
    }

    public boolean hasActiveReservations(String roomId) {
        return !reservationRepository.findByRoomIdAndStatusIn(roomId, ACTIVE_RESERVATION_STATUSES).isEmpty();
    }

    public List<Room> findAvailableRooms(String checkIn, String checkOut) {
        if ((checkIn == null || checkIn.isBlank()) && (checkOut == null || checkOut.isBlank())) {
            List<Room> availableRooms = new ArrayList<>();
            for (Room room : getAllRooms()) {
                if ("Available".equalsIgnoreCase(room.getStatus())) {
                    availableRooms.add(room);
                }
            }
            return availableRooms;
        }

        LocalDate start;
        LocalDate end;

        if (checkIn != null && !checkIn.isBlank() && (checkOut == null || checkOut.isBlank())) {
            start = LocalDate.parse(checkIn);
            end = start.plusDays(1);
        } else if ((checkIn == null || checkIn.isBlank()) && checkOut != null && !checkOut.isBlank()) {
            end = LocalDate.parse(checkOut);
            start = end.minusDays(1);
        } else {
            start = LocalDate.parse(checkIn);
            end = LocalDate.parse(checkOut);
        }

        if (end.isBefore(start) || end.isEqual(start)) {
            end = start.plusDays(1);
        }

        Set<String> blockedRoomIds = new HashSet<>();
        for (Reservation reservation : reservationRepository.findByCheckInDateBeforeAndCheckOutDateAfterAndStatusIn(
                end,
                start,
                ACTIVE_RESERVATION_STATUSES
        )) {
            if (reservation.getRoomId() != null) {
                blockedRoomIds.add(reservation.getRoomId());
            }
        }

        List<Room> availableRooms = new ArrayList<>();
        for (Room room : roomRepository.findAll()) {
            Room normalizedRoom = normalizeRoom(room);
            if ("Available".equalsIgnoreCase(normalizedRoom.getStatus())
                    && !blockedRoomIds.contains(normalizedRoom.getId())) {
                availableRooms.add(normalizedRoom);
            }
        }
        return availableRooms;
    }

    private Room normalizeRoom(Room room) {
        if (room == null) {
            return null;
        }

        if (room.getRoomType() == null || room.getRoomType().isBlank()) {
            room.setRoomType("Single");
        }
        if (room.getStatus() == null || room.getStatus().isBlank()) {
            room.setStatus("Available");
        }
        if (room.getDescription() == null) {
            room.setDescription("");
        }
        if (room.getAmenities() == null) {
            room.setAmenities(List.of());
        }
        return room;
    }
}
