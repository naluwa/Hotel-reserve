package com.hotel.reservation.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Transient;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "reservations")
public class Reservation {

    @Id
    private String id;

    private String customerId;
    private String customerName;
    private String customerEmail;
    private String roomId;

    private LocalDate checkInDate;
    private LocalDate checkOutDate;
    private int numberOfGuests;
    private int numberOfNights;
    private double totalAmount;
    private String status;
    private String paymentStatus;
    private LocalDateTime actualCheckIn;
    private LocalDateTime actualCheckOut;

    @Transient
    private double pricePerNight;

    public double calculateTotalAmount() {
        if (this.pricePerNight > 0 && this.numberOfNights > 0) {
            return this.numberOfNights * this.pricePerNight;
        }
        return this.totalAmount;
    }

    public void confirm() {
        this.status = "Reserved";
    }

    public void cancel() {
        this.status = "Cancelled";
    }
}
