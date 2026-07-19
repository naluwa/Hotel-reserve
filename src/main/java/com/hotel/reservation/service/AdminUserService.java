package com.hotel.reservation.service;

import com.hotel.reservation.exception.ResourceNotFoundException;
import com.hotel.reservation.dto.AdminUserRequestDTO;
import com.hotel.reservation.entity.User;
import com.hotel.reservation.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class AdminUserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public List<Map<String, Object>> listAllAdmins() {
        return userRepository.findAll().stream().map(this::toSafeMap).toList();
    }

    public Map<String, Object> createAdmin(AdminUserRequestDTO request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email '" + request.getEmail() + "' is already registered.");
        }
        User u = new User();
        u.setFullName(request.getFullName());
        u.setEmail(request.getEmail());
        u.setPassword(passwordEncoder.encode(request.getPassword()));
        u.setRoles(Set.of("ROLE_ADMIN"));
        u.setCreatedAt(LocalDateTime.now());
        return toSafeMap(userRepository.save(u));
    }

    public void deleteAdmin(String id, String requestingEmail) {
        User target = userRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Admin user", "id", id));
        if (target.getEmail().equals(requestingEmail)) throw new IllegalArgumentException("You cannot delete your own account.");
        if (userRepository.count() <= 1) throw new IllegalArgumentException("Cannot delete the last admin account.");
        userRepository.deleteById(id);
    }

    private Map<String, Object> toSafeMap(User u) {
        return Map.of("id", u.getId(), "fullName", u.getFullName(), "email", u.getEmail(), "createdAt", u.getCreatedAt() != null ? u.getCreatedAt() : LocalDateTime.now(), "roles", u.getRoles());
    }
}
