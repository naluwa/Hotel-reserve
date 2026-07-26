package com.hotel.reservation.config;

import com.hotel.reservation.model.Room;
import com.hotel.reservation.repository.RoomRepository;
import com.hotel.reservation.service.AuthService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@Slf4j
@RequiredArgsConstructor
public class DatabaseInitializer implements CommandLineRunner {

    private final AuthService authService;
    private final RoomRepository roomRepository;

    @Override
    public void run(String... args) throws Exception {
        authService.ensureDefaultAdmin("admin@example.com", "admin123", "System Administrator");

        if (roomRepository.count() == 0) {
            roomRepository.saveAll(List.of(
                Room.builder()
                        .roomNumber("101")
                        .roomType("Single")
                        .pricePerNight(4500)
                        .status("Available")
                        .description("Cozy single room ideal for solo travelers.")
                        .imageUrl("/images/room_single.jpg")
                        .roomSize("260 sq ft")
                        .bedType("Single Bed")
                        .capacity("1 Guest")
                        .amenities(List.of("Free Wi-Fi", "Air Conditioning", "Flat-screen TV"))
                        .build(),
                Room.builder()
                        .roomNumber("102")
                        .roomType("Double")
                        .pricePerNight(6500)
                        .status("Available")
                        .description("Comfortable double room with city view and modern amenities.")
                        .imageUrl("/images/room_double.jpg")
                        .roomSize("360 sq ft")
                        .bedType("Queen Bed")
                        .capacity("2 Guests")
                        .amenities(List.of("Free Wi-Fi", "Mini Bar", "Room Service"))
                        .build(),
                Room.builder()
                        .roomNumber("201")
                        .roomType("Deluxe")
                        .pricePerNight(9500)
                        .status("Available")
                        .description("Spacious deluxe room with premium furnishings and balcony.")
                        .imageUrl("/images/room_deluxe.jpg")
                        .roomSize("520 sq ft")
                        .bedType("King Bed")
                        .capacity("2 Guests")
                        .amenities(List.of("Free Wi-Fi", "Breakfast Included", "Spa Access"))
                        .build(),
                Room.builder()
                        .roomNumber("301")
                        .roomType("Suite")
                        .pricePerNight(15000)
                        .status("Available")
                        .description("Luxury suite with premium living area and ocean-inspired décor.")
                        .imageUrl("/images/room_suite.jpg")
                        .roomSize("650 sq ft")
                        .bedType("King Bed")
                        .capacity("4 Guests")
                        .amenities(List.of("Free Wi-Fi", "Private Lounge", "Complimentary Champagne"))
                        .build()
            ));

            log.info("Default admin created and sample rooms seeded only when empty.");
        }
    }
}
