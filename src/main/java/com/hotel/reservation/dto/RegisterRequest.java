package com.hotel.reservation.dto;

import lombok.Data;

@Data
public class RegisterRequest {
    private String fullName;
    private String email;
    private String password;
    private String nicPassport;
    private String phone;
    private String address;
}
