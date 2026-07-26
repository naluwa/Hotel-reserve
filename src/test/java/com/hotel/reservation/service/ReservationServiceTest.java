package com.hotel.reservation.service;

import com.hotel.reservation.dto.ReservationRequest;
import com.hotel.reservation.exception.ResourceNotFoundException;
import com.hotel.reservation.exception.RoomUnavailableException;
import com.hotel.reservation.model.Customer;
import com.hotel.reservation.model.Reservation;
import com.hotel.reservation.model.Room;
import com.hotel.reservation.repository.CustomerRepository;
import com.hotel.reservation.repository.ReservationRepository;
import com.hotel.reservation.repository.RoomRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.security.access.AccessDeniedException;

import java.time.LocalDate;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class ReservationServiceTest {

    @Mock private ReservationRepository reservationRepository;
    @Mock private RoomRepository roomRepository;
    @Mock private CustomerRepository customerRepository;
    @Mock private EmailService emailService;

    private ReservationService reservationService;
    private ReservationDomainService reservationDomainService;
    private ReservationStateService reservationStateService;
    private ReservationLifecycleService reservationLifecycleService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        reservationDomainService = new ReservationDomainService();
        reservationStateService = new ReservationStateService(reservationRepository, roomRepository);
        reservationLifecycleService = new ReservationLifecycleService(
                reservationRepository,
                roomRepository,
                reservationDomainService
        );
        reservationService = new ReservationService(
                reservationRepository,
                roomRepository,
                customerRepository,
                emailService,
                reservationDomainService,
                reservationStateService,
                reservationLifecycleService
        );
    }

    // ── createReservation ───────────────────────────────────────────────────────

    @Test
    void createReservation_throwsWhenCheckOutIsNotAfterCheckIn() {
        ReservationRequest request = buildRequest(
                LocalDate.of(2026, 8, 10),
                LocalDate.of(2026, 8, 10)  // same day — invalid
        );

        assertThatThrownBy(() -> reservationService.createReservation(request))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Check-out date must be after check-in date");
    }

    @Test
    void createReservation_throwsWhenRoomNotFound() {
        ReservationRequest request = buildRequest(
                LocalDate.of(2026, 8, 10), LocalDate.of(2026, 8, 12)
        );
        when(roomRepository.findById("room-99")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> reservationService.createReservation(request))
                .isInstanceOf(ResourceNotFoundException.class);
    }

    @Test
    void createReservation_throwsRoomUnavailableWhenRoomIsNotAvailable() {
        Room room = buildRoom("room-1", "101", "Available");
        // Make checkAvailability() return false
        room.setStatus("Reserved");

        ReservationRequest request = buildRequest(
                LocalDate.of(2026, 8, 10), LocalDate.of(2026, 8, 12)
        );
        when(roomRepository.findById("room-99")).thenReturn(Optional.of(room));

        assertThatThrownBy(() -> reservationService.createReservation(request))
                .isInstanceOf(RoomUnavailableException.class);
    }

    @Test
    void createReservation_throwsWhenDatesOverlapExistingReservation() {
        Room room = buildRoom("room-99", "101", "Available");
        ReservationRequest request = buildRequest(
                LocalDate.of(2026, 8, 10), LocalDate.of(2026, 8, 12)
        );
        when(roomRepository.findById("room-99")).thenReturn(Optional.of(room));
        // Simulate an overlapping reservation exists
        when(reservationRepository
                .findByRoomIdAndCheckInDateBeforeAndCheckOutDateAfterAndStatusIn(any(), any(), any(), any()))
                .thenReturn(List.of(new Reservation()));

        assertThatThrownBy(() -> reservationService.createReservation(request))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("overlap");
    }

    @Test
    void createReservation_savesAndReturnsReservationWhenValid() {
        Room room = buildRoom("room-99", "101", "Available");
        Customer customer = Customer.builder()
                .id("cust-1").email("guest@hotel.com").fullName("Jane Doe").role("CUSTOMER").build();
        ReservationRequest request = buildRequest(
                LocalDate.of(2026, 8, 10), LocalDate.of(2026, 8, 12)
        );
        request.setCustomerId("cust-1");

        when(roomRepository.findById("room-99")).thenReturn(Optional.of(room));
        when(reservationRepository
                .findByRoomIdAndCheckInDateBeforeAndCheckOutDateAfterAndStatusIn(any(), any(), any(), any()))
                .thenReturn(Collections.emptyList());
        when(customerRepository.findById("cust-1")).thenReturn(Optional.of(customer));
        when(reservationRepository.save(any(Reservation.class))).thenAnswer(inv -> inv.getArgument(0));
        when(roomRepository.save(any(Room.class))).thenAnswer(inv -> inv.getArgument(0));
        when(emailService.sendBookingConfirmation(any(), any())).thenReturn(true);

        Reservation result = reservationService.createReservation(request);

        assertThat(result).isNotNull();
        assertThat(result.getStatus()).isEqualTo("Reserved");
        assertThat(result.getNumberOfNights()).isEqualTo(2);
        assertThat(result.getTotalAmount()).isEqualTo(2 * room.getPricePerNight());
        assertThat(result.getPaymentStatus()).isEqualTo("PENDING");
        verify(roomRepository).save(argThat(r -> "Reserved".equals(r.getStatus())));
    }

    // ── deleteReservation ───────────────────────────────────────────────────────

    @Test
    void deleteReservation_throwsAccessDeniedWhenCustomerCancelsOthersReservation() {
        Reservation reservation = new Reservation();
        reservation.setCustomerEmail("owner@hotel.com");
        reservation.setStatus("Reserved");

        when(reservationRepository.findById("res-1")).thenReturn(Optional.of(reservation));

        assertThatThrownBy(() ->
                reservationService.deleteReservation("res-1", "attacker@hotel.com", false))
                .isInstanceOf(AccessDeniedException.class);
    }

    @Test
    void deleteReservation_adminCanCancelAnyReservation() {
        Reservation reservation = new Reservation();
        reservation.setCustomerEmail("owner@hotel.com");
        reservation.setRoomId("room-1");
        reservation.setStatus("Reserved");

        Room room = buildRoom("room-1", "101", "Reserved");

        when(reservationRepository.findById("res-1")).thenReturn(Optional.of(reservation));
        when(roomRepository.findById("room-1")).thenReturn(Optional.of(room));
        when(emailService.sendBookingCancellation(any(), any())).thenReturn(true);

        reservationService.deleteReservation("res-1", "admin@hotel.com", true);

        verify(reservationRepository).deleteById("res-1");
        verify(roomRepository).save(argThat(r -> "Available".equals(r.getStatus())));
    }

    @Test
    void deleteReservation_resetsRoomToAvailableForActiveReservation() {
        Reservation reservation = new Reservation();
        reservation.setCustomerEmail("guest@hotel.com");
        reservation.setRoomId("room-1");
        reservation.setStatus("Checked In");

        Room room = buildRoom("room-1", "101", "Occupied");

        when(reservationRepository.findById("res-1")).thenReturn(Optional.of(reservation));
        when(roomRepository.findById("room-1")).thenReturn(Optional.of(room));
        when(emailService.sendBookingCancellation(any(), any())).thenReturn(true);

        reservationService.deleteReservation("res-1", "guest@hotel.com", false);

        verify(roomRepository).save(argThat(r -> "Available".equals(r.getStatus())));
        verify(reservationRepository).deleteById("res-1");
    }

    @Test
    void deleteReservation_doesNotResetRoomWhenAlreadyCancelledReservation() {
        Reservation reservation = new Reservation();
        reservation.setCustomerEmail("guest@hotel.com");
        reservation.setRoomId("room-1");
        reservation.setStatus("Cancelled");

        when(reservationRepository.findById("res-1")).thenReturn(Optional.of(reservation));
        when(emailService.sendBookingCancellation(any(), any())).thenReturn(true);

        reservationService.deleteReservation("res-1", "guest@hotel.com", false);

        // Room save must NOT be called for an already-cancelled reservation
        verify(roomRepository, never()).save(any());
        verify(reservationRepository).deleteById("res-1");
    }

    // ── getReservation ──────────────────────────────────────────────────────────

    @Test
    void getReservation_throwsResourceNotFoundWhenMissing() {
        when(reservationRepository.findById("bad-id")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> reservationService.getReservation("bad-id"))
                .isInstanceOf(ResourceNotFoundException.class);
    }

    // ── checkIn / checkOut ──────────────────────────────────────────────────────

    @Test
    void checkIn_throwsWhenStatusIsNotReserved() {
        Reservation reservation = new Reservation();
        reservation.setStatus("Checked In");
        when(reservationRepository.findById("res-1")).thenReturn(Optional.of(reservation));

        assertThatThrownBy(() -> reservationService.checkIn("res-1"))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Reserved");
    }

    @Test
    void checkOut_throwsWhenStatusIsNotCheckedIn() {
        Reservation reservation = new Reservation();
        reservation.setStatus("Reserved");
        when(reservationRepository.findById("res-1")).thenReturn(Optional.of(reservation));

        assertThatThrownBy(() -> reservationService.checkOut("res-1"))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Checked In");
    }

    // ── helpers ─────────────────────────────────────────────────────────────────

    private ReservationRequest buildRequest(LocalDate checkIn, LocalDate checkOut) {
        ReservationRequest r = new ReservationRequest();
        r.setRoomId("room-99");
        r.setCheckInDate(checkIn);
        r.setCheckOutDate(checkOut);
        r.setNumberOfGuests(2);
        return r;
    }

    private Room buildRoom(String id, String roomNumber, String status) {
        Room room = new Room();
        room.setId(id);
        room.setRoomNumber(roomNumber);
        room.setStatus(status);
        room.setPricePerNight(100.0);
        return room;
    }
}
