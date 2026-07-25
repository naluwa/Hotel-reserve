package com.hotel.reservation;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.io.File;
import java.nio.file.Files;

@SpringBootApplication
public class ReservationApplication {

    public static void main(String[] args) {
        loadDotEnv();
        SpringApplication.run(ReservationApplication.class, args);
    }

    private static void loadDotEnv() {
        try {
            File envFile = new File(".env");
            if (envFile.exists()) {
                Files.lines(envFile.toPath()).forEach(line -> {
                    String trimmed = line.trim();
                    if (!trimmed.isEmpty() && !trimmed.startsWith("#") && trimmed.contains("=")) {
                        int eqIdx = trimmed.indexOf('=');
                        String key = trimmed.substring(0, eqIdx).trim();
                        String value = trimmed.substring(eqIdx + 1).trim();
                        if (System.getProperty(key) == null && System.getenv(key) == null) {
                            System.setProperty(key, value);
                        }
                    }
                });
            }
        } catch (Exception ignored) {
        }
    }
}
