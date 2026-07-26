package com.hotel.reservation.controller;

import com.hotel.reservation.dto.AdminCreateRequest;
import com.hotel.reservation.model.User;
import com.hotel.reservation.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/users")
@RequiredArgsConstructor
public class AdminController {

    private final AuthService authService;

    @GetMapping
    public ResponseEntity<List<User>> getAdminUsers() {
        return ResponseEntity.ok(authService.getAllAdminUsers());
    }

    @PostMapping
    public ResponseEntity<User> createAdminUser(@Valid @RequestBody AdminCreateRequest request) {
        User saved = authService.createAdminUser(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAdminUser(@PathVariable String id, Authentication authentication) {
        authService.deleteAdminUser(id, authentication.getName());
        return ResponseEntity.noContent().build();
    }
}
