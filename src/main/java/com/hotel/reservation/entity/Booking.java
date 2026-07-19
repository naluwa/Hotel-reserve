
package com.hotel.reservation.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@Document(collection = "bookings")
public class Booking {

    @Id
    private String id;

    private String roomId;

    private String customerName;
    private String customerEmail;

    private LocalDate checkInDate;
    private LocalDate checkOutDate;

    private double totalPayment;
    private String paymentStatus;
}
