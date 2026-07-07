package com.hotel.reservation.entity;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@Document(collection = "customers")
public class Customer extends User {
    private String name;
    private int totalBookingsMade;

    public Customer(String name, String email) {
        this.name = name;
        this.setEmail(email);
        this.totalBookingsMade = 1;
    }
}
