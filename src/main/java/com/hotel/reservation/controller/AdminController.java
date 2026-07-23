package com.hotel.reservation.controller;

import com.hotel.reservation.model.User;
import com.hotel.reservation.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/users")
@CrossOrigin(origins = "http://localhost:5173")
@RequiredArgsConstructor
public class AdminController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @GetMapping
    public List<User> getAdminUsers() {
        return userRepository.findAll();
    }

    @PostMapping
    public ResponseEntity<?> createAdminUser(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        if (email == null || email.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Admin email is required."));
        }

        if (userRepository.existsByUsername(email)) {
            return ResponseEntity.badRequest().body(Map.of("error", "Administrator already exists."));
        }

        String fullName = request.get("fullName");
        if (fullName == null || fullName.isBlank()) {
            fullName = email.contains("@") ? email.substring(0, email.indexOf("@")) : email;
        }

        String password = request.get("password");
        if (password == null || password.isBlank()) {
            password = "PENDING_SETUP_" + System.currentTimeMillis();
        }

        User user = new User();
        user.setUsername(email);
        user.setFullName(fullName);
        user.setPassword(passwordEncoder.encode(password));
        user.setRole("ADMIN");

        User saved = userRepository.save(user);
        return ResponseEntity.ok(saved);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteAdminUser(@PathVariable String id, Authentication authentication) {
        User existing = userRepository.findById(id).orElse(null);
        if (existing == null) {
            return ResponseEntity.notFound().build();
        }
        if (existing.getUsername().equals(authentication.getName())) {
            return ResponseEntity.badRequest().body(Map.of("error", "Administrators cannot remove their own account."));
        }

        userRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
