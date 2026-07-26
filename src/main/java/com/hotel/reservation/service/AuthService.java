package com.hotel.reservation.service;

import com.hotel.reservation.dto.AuthResponse;
import com.hotel.reservation.dto.RegisterRequest;
import com.hotel.reservation.model.Admin;
import com.hotel.reservation.model.Customer;
import com.hotel.reservation.model.User;
import com.hotel.reservation.repository.CustomerRepository;
import com.hotel.reservation.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.hotel.reservation.dto.AdminCreateRequest;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final CustomerRepository customerRepository;
    private final PasswordEncoder passwordEncoder;

    public boolean validateCredentials(String username, String password) {
        User user = userRepository.findByUsername(username).orElse(null);
        if (user == null) {
            return false;
        }
        return user.login(password, passwordEncoder);
    }

    public AuthResponse buildAuthResponse(String token, String loginIdentifier, Authentication authentication) {
        String role = authentication.getAuthorities().stream()
                .findFirst()
                .map(Object::toString)
                .orElse("ROLE_CUSTOMER");

        String fullName = loginIdentifier;
        String userId = "";

        if ("ROLE_ADMIN".equals(role)) {
            User user = userRepository.findByUsername(loginIdentifier).orElse(null);
            if (user != null) {
                fullName = user.getFullName();
                userId = user.getId();
            }
        } else {
            Customer customer = customerRepository.findByEmail(loginIdentifier).orElse(null);
            if (customer != null) {
                fullName = customer.getFullName();
                userId = customer.getId();
            }
        }

        return new AuthResponse(token, loginIdentifier, fullName, role, userId);
    }

    public Customer registerCustomer(RegisterRequest request) {
        if (customerRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email already registered.");
        }

        String nicPassport = request.getNicPassport();
        if (nicPassport != null && !nicPassport.isBlank() && customerRepository.findByNicPassport(nicPassport).isPresent()) {
            throw new IllegalArgumentException("NIC/Passport number already registered.");
        }

        Customer customer = Customer.builder()
                .fullName(request.getFullName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .nicPassport(request.getNicPassport())
                .phone(request.getPhone())
                .address(request.getAddress())
                .role("CUSTOMER")
                .build();

        customer.register();
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

    public void ensureDefaultAdmin(String username, String password, String fullName) {
        if (userRepository.existsByUsername(username)) {
            User existing = userRepository.findByUsername(username).orElseThrow();
            if (!"ADMIN".equalsIgnoreCase(existing.getRole())) {
                throw new IllegalArgumentException("Default admin username is reserved for admin accounts.");
            }
            if (existing.getPassword() == null || existing.getPassword().isBlank() || !passwordEncoder.matches(password, existing.getPassword())) {
                existing.setPassword(passwordEncoder.encode(password));
            }
            if (fullName != null && !fullName.isBlank()) {
                existing.setFullName(fullName);
            }
            userRepository.save(existing);
            return;
        }

        Admin admin = Admin.builder()
                .username(username)
                .password(passwordEncoder.encode(password))
                .fullName(fullName)
                .role("ADMIN")
                .build();

        userRepository.save(admin);
    }

    public List<User> getAllAdminUsers() {
        return userRepository.findAll();
    }

    public User createAdminUser(AdminCreateRequest request) {
        String email = request.getEmail();
        if (email == null || email.isBlank()) {
            throw new IllegalArgumentException("Admin email is required.");
        }

        if (userRepository.existsByUsername(email)) {
            throw new IllegalArgumentException("Administrator already exists.");
        }

        String fullName = request.getFullName();
        if (fullName == null || fullName.isBlank()) {
            fullName = email.contains("@") ? email.substring(0, email.indexOf("@")) : email;
        }

        String password = request.getPassword();
        if (password == null || password.isBlank()) {
            password = "PENDING_SETUP_" + System.currentTimeMillis();
        }

        Admin admin = Admin.builder()
                .username(email)
                .fullName(fullName)
                .password(passwordEncoder.encode(password))
                .role("ADMIN")
                .build();

        return userRepository.save(admin);
    }

    public void deleteAdminUser(String id, String requestingUsername) {
        User existing = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Admin user not found."));

        if (existing.getUsername().equals(requestingUsername)) {
            throw new IllegalArgumentException("Administrators cannot remove their own account.");
        }

        userRepository.deleteById(id);
    }
}
