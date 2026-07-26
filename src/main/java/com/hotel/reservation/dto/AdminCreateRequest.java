package com.hotel.reservation.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class AdminCreateRequest {

    @NotBlank(message = "Admin email is required")
    @Email(message = "Email must be a valid email address")
    private String email;

    private String fullName;
    private String password;
}
