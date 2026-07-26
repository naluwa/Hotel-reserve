package com.hotel.reservation.controller;

import com.hotel.reservation.dto.ReservationRequest;
import com.hotel.reservation.model.Reservation;
import com.hotel.reservation.service.ReservationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reservations")
@RequiredArgsConstructor
public class ReservationController {

    private final ReservationService reservationService;

    @GetMapping
    public ResponseEntity<List<Reservation>> getReservations() {
        return ResponseEntity.ok(reservationService.getAllReservations());
    }

    @GetMapping("/my")
    public ResponseEntity<List<Reservation>> getMyReservations(Authentication authentication) {
        return ResponseEntity.ok(reservationService.getReservationsForCustomer(authentication.getName()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Reservation> getReservation(@PathVariable String id) {
        return ResponseEntity.ok(reservationService.getReservation(id));
    }

    @PostMapping
    public ResponseEntity<Reservation> createReservation(@Valid @RequestBody ReservationRequest request) {
        Reservation reservation = reservationService.createReservation(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(reservation);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Reservation> updateReservation(@PathVariable String id, @Valid @RequestBody ReservationRequest request) {
        return ResponseEntity.ok(reservationService.updateReservation(id, request));
    }

    @PutMapping("/{id}/payment")
    public ResponseEntity<Reservation> updatePayment(@PathVariable String id, @RequestParam String status) {
        return ResponseEntity.ok(reservationService.updatePaymentStatus(id, status));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReservation(@PathVariable String id, Authentication authentication) {
        boolean isAdmin = authentication.getAuthorities().stream()
                .anyMatch(authority -> "ROLE_ADMIN".equals(authority.getAuthority()));
        reservationService.deleteReservation(id, authentication.getName(), isAdmin);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/check-in")
    public ResponseEntity<Reservation> checkIn(@PathVariable String id) {
        return ResponseEntity.ok(reservationService.checkIn(id));
    }

    @PostMapping("/{id}/check-out")
    public ResponseEntity<Reservation> checkOut(@PathVariable String id) {
        return ResponseEntity.ok(reservationService.checkOut(id));
    }
}
