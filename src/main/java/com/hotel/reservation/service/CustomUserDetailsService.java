package com.hotel.reservation.service;

import com.hotel.reservation.model.Customer;
import com.hotel.reservation.model.User;
import com.hotel.reservation.repository.CustomerRepository;
import com.hotel.reservation.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;
    private final CustomerRepository customerRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        String normalizedUsername = username == null ? "" : username.trim();
        if (normalizedUsername.isBlank()) {
            throw new UsernameNotFoundException("No user: " + username);
        }

        Optional<User> adminUser = userRepository.findByUsername(normalizedUsername);
        if (adminUser.isPresent()) {
            User u = adminUser.get();
            return new org.springframework.security.core.userdetails.User(
                u.getUsername(),
                u.getPassword(),
                List.of(new SimpleGrantedAuthority("ROLE_ADMIN"))
            );
        }

        Optional<Customer> customer = customerRepository.findByEmail(normalizedUsername);
        if (customer.isPresent()) {
            Customer existingCustomer = customer.get();
            String pwd = existingCustomer.getPassword() != null ? existingCustomer.getPassword() : "";
            return new org.springframework.security.core.userdetails.User(
                existingCustomer.getEmail(),
                pwd,
                List.of(new SimpleGrantedAuthority("ROLE_CUSTOMER"))
            );
        }

        throw new UsernameNotFoundException("No user: " + username);
    }
}
