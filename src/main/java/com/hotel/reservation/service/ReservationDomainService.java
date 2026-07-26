package com.hotel.reservation.service;

import com.hotel.reservation.dto.ReservationRequest;
import com.hotel.reservation.model.Customer;
import com.hotel.reservation.model.Reservation;
import com.hotel.reservation.model.Room;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;

@Service
public class ReservationDomainService {

    public void validateStayDates(LocalDate checkInDate, LocalDate checkOutDate) {
        if (checkInDate == null || checkOutDate == null || !checkOutDate.isAfter(checkInDate)) {
            throw new IllegalArgumentException("Check-out date must be after check-in date.");
        }
    }

    public int calculateNights(LocalDate checkInDate, LocalDate checkOutDate) {
        return (int) ChronoUnit.DAYS.between(checkInDate, checkOutDate);
    }

    public double calculateTotalAmount(int nights, double pricePerNight) {
        return nights * pricePerNight;
    }

    public void ensureNoOverlap(boolean hasOverlap) {
        if (hasOverlap) {
            throw new IllegalArgumentException("Selected dates overlap with an existing reservation.");
        }
    }

    public Reservation createPendingReservation(
            ReservationRequest request,
            Customer customer,
            Room room,
            int nights,
            double totalAmount
    ) {
        return Reservation.builder()
                .customerId(customer.getId())
                .customerName(customer.getFullName())
                .customerEmail(customer.getEmail())
                .roomId(room.getId())
                .checkInDate(request.getCheckInDate())
                .checkOutDate(request.getCheckOutDate())
                .numberOfGuests(request.getNumberOfGuests())
                .numberOfNights(nights)
                .totalAmount(totalAmount)
                .paymentStatus("PENDING")
                .pricePerNight(room.getPricePerNight())
                .build();
    }

    public void ensureTransitionAllowed(Reservation reservation, String expectedStatus, String action) {
        if (!expectedStatus.equals(reservation.getStatus())) {
            throw new IllegalArgumentException(
                    String.format("%s is only allowed for reservations with status '%s'. Current status: %s",
                            action, expectedStatus, reservation.getStatus())
            );
        }
    }
}
