package com.hotel.reservation.dto;

import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

@Data
public class ReservationRequest {

    private String customerId;
    private String customerEmail;
    private String customerName;
    private String nicPassport;
    private String phone;
    private String address;

    @NotNull(message = "Room ID is required")
    private String roomId;

    @NotNull(message = "Check-in date is required")
    @FutureOrPresent(message = "Check-in date must be today or in the future")
    private LocalDate checkInDate;

    @NotNull(message = "Check-out date is required")
    private LocalDate checkOutDate;

    @Min(value = 1, message = "At least one guest is required")
    private int numberOfGuests;

    private String status;
    private String paymentStatus;
}
