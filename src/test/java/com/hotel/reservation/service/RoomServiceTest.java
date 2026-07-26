package com.hotel.reservation.service;

import com.hotel.reservation.model.Room;
import com.hotel.reservation.repository.ReservationRepository;
import com.hotel.reservation.repository.RoomRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class RoomServiceTest {

    @Mock private RoomRepository roomRepository;
    @Mock private ReservationRepository reservationRepository;

    private RoomService roomService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        roomService = new RoomService(roomRepository, reservationRepository);
    }

    // ── saveRoom ────────────────────────────────────────────────────────────────

    @Test
    void saveRoom_defaultsStatusToAvailableWhenNull() {
        Room room = new Room();
        room.setRoomNumber("101");
        room.setStatus(null);

        when(roomRepository.save(any(Room.class))).thenAnswer(inv -> inv.getArgument(0));

        Room saved = roomService.saveRoom(room);

        assertThat(saved.getStatus()).isEqualTo("Available");
    }

    @Test
    void saveRoom_defaultsStatusToAvailableWhenBlank() {
        Room room = new Room();
        room.setRoomNumber("102");
        room.setStatus("   ");

        when(roomRepository.save(any(Room.class))).thenAnswer(inv -> inv.getArgument(0));

        Room saved = roomService.saveRoom(room);

        assertThat(saved.getStatus()).isEqualTo("Available");
    }

    @Test
    void saveRoom_defaultsRoomTypeToSingleWhenNull() {
        Room room = new Room();
        room.setRoomNumber("103");
        room.setRoomType(null);

        when(roomRepository.save(any(Room.class))).thenAnswer(inv -> inv.getArgument(0));

        Room saved = roomService.saveRoom(room);

        assertThat(saved.getRoomType()).isEqualTo("Single");
    }

    @Test
    void saveRoom_preservesExplicitStatusWhenProvided() {
        Room room = new Room();
        room.setRoomNumber("104");
        room.setStatus("Reserved");

        when(roomRepository.save(any(Room.class))).thenAnswer(inv -> inv.getArgument(0));

        Room saved = roomService.saveRoom(room);

        assertThat(saved.getStatus()).isEqualTo("Reserved");
    }

    // ── getRoomById ─────────────────────────────────────────────────────────────

    @Test
    void getRoomById_returnsNullWhenRoomNotFound() {
        when(roomRepository.findById("bad-id")).thenReturn(Optional.empty());

        Room result = roomService.getRoomById("bad-id");

        assertThat(result).isNull();
    }

    @Test
    void getRoomById_returnsNormalizedRoomWhenFound() {
        Room room = new Room();
        room.setId("room-1");
        room.setRoomNumber("105");
        room.setStatus(null); // normalizeRoom should fix this

        when(roomRepository.findById("room-1")).thenReturn(Optional.of(room));

        Room result = roomService.getRoomById("room-1");

        assertThat(result).isNotNull();
        assertThat(result.getStatus()).isEqualTo("Available");
    }

    // ── updateRoom ──────────────────────────────────────────────────────────────

    @Test
    void updateRoom_throwsWhenRoomNotFound() {
        when(roomRepository.findById("bad-id")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> roomService.updateRoom("bad-id", new Room()))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Room not found");
    }

    @Test
    void updateRoom_appliesAllFieldsFromUpdatedRoom() {
        Room existing = new Room();
        existing.setId("room-1");
        existing.setRoomNumber("101");
        existing.setPricePerNight(80.0);

        Room updated = new Room();
        updated.setRoomNumber("101-A");
        updated.setRoomType("Suite");
        updated.setPricePerNight(150.0);
        updated.setStatus("Available");
        updated.setAmenities(List.of("WiFi", "TV"));

        when(roomRepository.findById("room-1")).thenReturn(Optional.of(existing));
        when(roomRepository.save(any(Room.class))).thenAnswer(inv -> inv.getArgument(0));

        Room result = roomService.updateRoom("room-1", updated);

        assertThat(result.getRoomNumber()).isEqualTo("101-A");
        assertThat(result.getRoomType()).isEqualTo("Suite");
        assertThat(result.getPricePerNight()).isEqualTo(150.0);
    }

    // ── hasActiveReservations ───────────────────────────────────────────────────

    @Test
    void hasActiveReservations_returnsTrueWhenActiveReservationsExist() {
        when(reservationRepository.findByRoomIdAndStatusIn(eq("room-1"), anyList()))
                .thenReturn(List.of(new com.hotel.reservation.model.Reservation()));

        assertThat(roomService.hasActiveReservations("room-1")).isTrue();
    }

    @Test
    void hasActiveReservations_returnsFalseWhenNoActiveReservations() {
        when(reservationRepository.findByRoomIdAndStatusIn(eq("room-1"), anyList()))
                .thenReturn(List.of());

        assertThat(roomService.hasActiveReservations("room-1")).isFalse();
    }

    // ── deleteRoom ──────────────────────────────────────────────────────────────

    @Test
    void deleteRoom_callsRepositoryDeleteById() {
        roomService.deleteRoom("room-1");
        verify(roomRepository).deleteById("room-1");
    }
}
