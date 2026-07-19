package com.hotel.reservation.controller;

import com.hotel.reservation.dto.AdminUserRequestDTO;
import com.hotel.reservation.service.AdminUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "${VITE_ALLOWED_ORIGIN:http://localhost:5173}")
@RequiredArgsConstructor
public class AdminController {

    private final AdminUserService adminUserService;

    @GetMapping("/users")
    public List<Map<String, Object>> listAdmins() { return adminUserService.listAllAdmins(); }

    @PostMapping("/users")
    @ResponseStatus(HttpStatus.CREATED)
    public Map<String, Object> createAdmin(@RequestBody AdminUserRequestDTO request) {
        return adminUserService.createAdmin(request);
    }

    @DeleteMapping("/users/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteAdmin(@PathVariable String id, Authentication authentication) {
        adminUserService.deleteAdmin(id, authentication.getName());
    }
}
