package com.hotel.reservation.dto;

import lombok.Data;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.time.LocalDate;

@Data
public class PaymentRequest {

    @NotBlank(message = "Reservation ID is required")
    private String reservationId;

    @NotNull(message = "Amount is required")
    @Positive(message = "Amount must be positive")
    private Double amount;

    private LocalDate paymentDate;

    private String paymentMethod;

    @NotBlank(message = "Payment status is required")
    private String paymentStatus;
}
