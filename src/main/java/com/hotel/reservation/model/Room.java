package com.hotel.reservation.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "rooms")
public class Room {
    @Id
    private String id;

    private String roomNumber;
    private String roomType;
    private double pricePerNight;
    private String status;
    private String description;
    private String imageUrl;
    private String roomSize;
    private String bedType;
    private String capacity;
    private List<String> amenities;
}
