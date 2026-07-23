package com.hotel.reservation.controller;

import com.hotel.reservation.dto.ReservationRequest;
import com.hotel.reservation.model.Reservation;
import com.hotel.reservation.service.ReservationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reservations")
@CrossOrigin(origins = "http://localhost:5173")
@RequiredArgsConstructor
public class ReservationController {

    private final ReservationService reservationService;

    @GetMapping
    public List<Reservation> getReservations() {
        return reservationService.getAllReservations();
    }

    @GetMapping("/my")
    public List<Reservation> getMyReservations(Authentication authentication) {
        return reservationService.getReservationsForCustomer(authentication.getName());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Reservation> getReservation(@PathVariable String id) {
        return ResponseEntity.ok(reservationService.getReservation(id));
    }

    @PostMapping
    public Reservation createReservation(@RequestBody ReservationRequest request) {
        return reservationService.createReservation(request);
    }

    @PutMapping("/{id}")
    public Reservation updateReservation(@PathVariable String id, @RequestBody ReservationRequest request) {
        return reservationService.updateReservation(id, request);
    }

    @PutMapping("/{id}/payment")
    public Reservation updatePayment(@PathVariable String id, @RequestParam String status) {
        return reservationService.updatePaymentStatus(id, status);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReservation(@PathVariable String id, Authentication authentication) {
        Reservation existing = reservationService.getReservation(id);
        boolean isAdmin = authentication.getAuthorities().stream()
                .anyMatch(auth -> auth.getAuthority().equals("ROLE_ADMIN"));
        if (!isAdmin && !existing.getCustomerEmail().equals(authentication.getName())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        reservationService.deleteReservation(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/check-in")
    public Reservation checkIn(@PathVariable String id) {
        return reservationService.checkIn(id);
    }

    @PostMapping("/{id}/check-out")
    public Reservation checkOut(@PathVariable String id) {
        return reservationService.checkOut(id);
    }
}
