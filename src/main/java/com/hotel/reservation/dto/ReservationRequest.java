package com.hotel.reservation.dto;

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
    private String roomId;
    private LocalDate checkInDate;
    private LocalDate checkOutDate;
    private int numberOfGuests;
    private String paymentStatus;
}
