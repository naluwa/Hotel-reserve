package com.hotel.reservation.service;

import com.hotel.reservation.model.Reservation;
import com.hotel.reservation.model.Room;
import com.hotel.reservation.repository.ReservationRepository;
import com.hotel.reservation.repository.RoomRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RoomService {

    private static final List<String> ACTIVE_RESERVATION_STATUSES = List.of("Reserved", "Checked In");

    private final RoomRepository roomRepository;
    private final ReservationRepository reservationRepository;

    public List<Room> getAllRooms() {
        return roomRepository.findAll().stream()
                .map(this::normalizeRoom)
                .collect(Collectors.toList());
    }

    public Room getRoomById(String id) {
        return roomRepository.findById(id)
                .map(this::normalizeRoom)
                .orElse(null);
    }

    public Room saveRoom(Room room) {
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
            return getAllRooms().stream()
                    .filter(room -> "Available".equalsIgnoreCase(room.getStatus()))
                    .collect(Collectors.toList());
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

        Set<String> blockedRoomIds = reservationRepository
                .findByCheckInDateBeforeAndCheckOutDateAfterAndStatusIn(
                        end,
                        start,
                        ACTIVE_RESERVATION_STATUSES
                )
                .stream()
                .map(Reservation::getRoomId)
                .collect(Collectors.toSet());
        return roomRepository.findAll().stream()
                .map(this::normalizeRoom)
                .filter(room -> "Available".equalsIgnoreCase(room.getStatus()))
                .filter(room -> !blockedRoomIds.contains(room.getId()))
                .collect(Collectors.toList());
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
        return room;
    }
}
