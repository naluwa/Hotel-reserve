package com.hotel.reservation.config;

import com.hotel.reservation.service.AuthService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DatabaseInitializer implements CommandLineRunner {

    private final AuthService authService;

    public DatabaseInitializer(AuthService authService) {
        this.authService = authService;
    }

    @Override
    public void run(String... args) throws Exception {
        // Initialize the default admin user as specified in requirements and keep the
        // legacy username alias working.

        authService.createAdminIfMissing("admin@example.com", "admin123", "System Administrator");
        System.out.println(
                "DatabaseInitializer: Checked/Created default admin accounts 'admin', 'admin@grandreserve.com', and 'admin@example.com' with password 'admin123'");
    }
}
