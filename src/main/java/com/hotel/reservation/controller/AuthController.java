package com.hotel.reservation.controller;

import com.hotel.reservation.dto.LoginRequest;
import com.hotel.reservation.dto.RegisterRequest;
import com.hotel.reservation.model.Customer;
import com.hotel.reservation.model.User;
import com.hotel.reservation.repository.CustomerRepository;
import com.hotel.reservation.repository.UserRepository;
import com.hotel.reservation.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;
    private final UserRepository userRepository;
    private final CustomerRepository customerRepository;
    private final PasswordEncoder passwordEncoder;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );
        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = tokenProvider.generateToken(authentication);
        String username = request.getUsername();
        String role = authentication.getAuthorities().stream()
                .findFirst()
                .map(Object::toString)
                .orElse("ROLE_CUSTOMER");
        String fullName = username;
        String userId = null;

        if (role.equals("ROLE_ADMIN")) {
            User user = userRepository.findByUsername(username).orElse(null);
            if (user != null) {
                fullName = user.getFullName();
                userId = user.getId();
            }
        } else {
            Customer customer = customerRepository.findByEmail(username).orElse(null);
            if (customer != null) {
                fullName = customer.getFullName();
                userId = customer.getId();
            }
        }

        Map<String, Object> response = new HashMap<>();
        response.put("token", jwt);
        response.put("username", username);
        response.put("fullName", fullName);
        response.put("role", role);
        response.put("id", userId != null ? userId : "");

        return ResponseEntity.ok(response);
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        if (customerRepository.existsByEmail(request.getEmail())) {
            return ResponseEntity.badRequest().body(Map.of("error", "Email already registered."));
        }
        if (request.getNicPassport() != null && !request.getNicPassport().isBlank() &&
                customerRepository.findByNicPassport(request.getNicPassport()).isPresent()) {
            return ResponseEntity.badRequest().body(Map.of("error", "NIC/Passport number already registered."));
        }

        Customer customer = new Customer();
        customer.setFullName(request.getFullName());
        customer.setEmail(request.getEmail());
        customer.setPassword(passwordEncoder.encode(request.getPassword()));
        customer.setNicPassport(request.getNicPassport());
        customer.setPhone(request.getPhone());
        customer.setAddress(request.getAddress());
        customer = customerRepository.save(customer);

        return ResponseEntity.ok(Map.of(
                "id", customer.getId(),
                "email", customer.getEmail(),
                "fullName", customer.getFullName()
        ));
    }

    @PostMapping("/setup-admin-password")
    public ResponseEntity<?> setupAdminPassword(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String password = request.get("password");
        String fullName = request.get("fullName");

        if (email == null || email.isBlank() || password == null || password.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Email and password are required."));
        }

        User user = userRepository.findByUsername(email).orElse(null);
        if (user == null || !"ADMIN".equalsIgnoreCase(user.getRole())) {
            return ResponseEntity.badRequest().body(Map.of("error", "No eligible admin invitation found for this email."));
        }

        user.setPassword(passwordEncoder.encode(password));
        if (fullName != null && !fullName.isBlank()) {
            user.setFullName(fullName);
        }

        userRepository.save(user);
        return ResponseEntity.ok(Map.of("message", "Admin password successfully configured."));
    }
}
