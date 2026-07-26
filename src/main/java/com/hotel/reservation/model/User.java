package com.hotel.reservation.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.security.crypto.password.PasswordEncoder;

@Data
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@Document(collection = "users")
public class User {

    @Id
    private String id;

    @Indexed(unique = true, sparse = true)
    private String username;

    @JsonIgnore
    private String password;
    private String fullName;
    private String role; // "ADMIN" or "CUSTOMER"

    public boolean login(String rawPassword, PasswordEncoder passwordEncoder) {
        if (this.password == null || rawPassword == null) {
            return false;
        }
        return passwordEncoder.matches(rawPassword, this.password);
    }

    public void logout() {
    }
}
