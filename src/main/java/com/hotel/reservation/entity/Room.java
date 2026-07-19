
package com.hotel.reservation.entity;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@NoArgsConstructor
@Document(collection = "rooms")
public class Room {
    @Id
    private String id;
    private String roomNumber;
    private String type;
    private double pricePerNight;
    private boolean available;
    private String imageUrl; // Added to support visual cards

    public Room(String roomNumber, String type, double pricePerNight, boolean available, String imageUrl) {
        this.roomNumber = roomNumber;
        this.type = type;
        this.pricePerNight = pricePerNight;
        this.available = available;
        this.imageUrl = imageUrl;
    }
}
