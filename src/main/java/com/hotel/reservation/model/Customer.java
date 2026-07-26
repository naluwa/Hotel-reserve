package com.hotel.reservation.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import org.springframework.data.mongodb.core.index.Indexed;

@Data
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@EqualsAndHashCode(callSuper = true)
public class Customer extends User {

    @Indexed(unique = true, sparse = true)
    private String email;

    private String nicPassport;
    private String phone;
    private String address;

    public void register() {
        setRole("CUSTOMER");
    }
}
