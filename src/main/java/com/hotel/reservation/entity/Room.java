

package com.hotel.reservation.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;


@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "rooms")
public class Room {
    @Id
    private String id;
    private String roomNumber;
    private String type;
    private double pricePerNight;
    private boolean available;

}
