package com.hotel.reservation.config;

import com.hotel.reservation.entity.Room;
import com.hotel.reservation.entity.User;
import com.hotel.reservation.repository.RoomRepository;
import com.hotel.reservation.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

@Component
@RequiredArgsConstructor
public class DatabaseSeeder implements CommandLineRunner {

    private final RoomRepository roomRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (roomRepository.count() == 0) {
            roomRepository.saveAll(List.of(
                new Room("101", "Standard Single", 85.00, true, "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400"),
                new Room("102", "Standard Single", 85.00, true, "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=400"),
                new Room("201", "Deluxe Double", 150.00, true, "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=400"),
                new Room("202", "Deluxe Double", 150.00, false, "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=400"),
                new Room("301", "Executive Suite", 320.00, true, "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=400"),
                new Room("302", "Executive Suite", 320.00, true, "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=400"),
                new Room("401", "Penthouse Suite", 850.00, true, "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=400")
            ));
        }

        if (!userRepository.existsByEmail("admin@grandreserve.com")) {
            User admin = new User();
            admin.setEmail("admin@grandreserve.com");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setFullName("System Administrator");
            admin.setCreatedAt(LocalDateTime.now());
            admin.setRoles(Set.of("ROLE_ADMIN"));
            userRepository.save(admin);
        }
    }
}
