package com.hotel.reservation.service;

import com.hotel.reservation.dto.AuthResponse;
import com.hotel.reservation.dto.RegisterRequest;
import com.hotel.reservation.model.Customer;
import com.hotel.reservation.model.User;
import com.hotel.reservation.repository.CustomerRepository;
import com.hotel.reservation.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final CustomerRepository customerRepository;
    private final PasswordEncoder passwordEncoder;

    public boolean validateCredentials(String username, String password) {
        return userRepository.findByUsername(username)
                .filter(user -> passwordEncoder.matches(password, user.getPassword()))
                .isPresent();
    }

    public AuthResponse buildAuthResponse(String token, String username, Authentication authentication) {
        String role = authentication.getAuthorities().stream()
                .findFirst()
                .map(Object::toString)
                .orElse("ROLE_CUSTOMER");

        String fullName = username;
        String userId = "";

        if ("ROLE_ADMIN".equals(role)) {
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

        return new AuthResponse(token, username, fullName, role, userId);
    }

    public Customer registerCustomer(RegisterRequest request) {
        if (customerRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email already registered.");
        }
        if (request.getNicPassport() != null && !request.getNicPassport().isBlank() &&
                customerRepository.findByNicPassport(request.getNicPassport()).isPresent()) {
            throw new IllegalArgumentException("NIC/Passport number already registered.");
        }

        Customer customer = Customer.builder()
                .fullName(request.getFullName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .nicPassport(request.getNicPassport())
                .phone(request.getPhone())
                .address(request.getAddress())
                .build();

        return customerRepository.save(customer);
    }

    public void setupAdminPassword(String email, String password, String fullName) {
        User user = userRepository.findByUsername(email)
                .orElseThrow(() -> new IllegalArgumentException("No eligible admin invitation found for this email."));

        if (!"ADMIN".equalsIgnoreCase(user.getRole())) {
            throw new IllegalArgumentException("No eligible admin invitation found for this email.");
        }

        user.setPassword(passwordEncoder.encode(password));
        if (fullName != null && !fullName.isBlank()) {
            user.setFullName(fullName);
        }

        userRepository.save(user);
    }

    public void createAdminIfMissing(String username, String password, String fullName) {
        if (userRepository.existsByUsername(username)) {
            return;
        }

        User admin = User.builder()
                .username(username)
                .password(passwordEncoder.encode(password))
                .fullName(fullName)
                .role("ADMIN")
                .build();

        userRepository.save(admin);
    }
}
