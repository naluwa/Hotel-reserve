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

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {
    private final UserRepository userRepository;
    private final CustomerRepository customerRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User u = userRepository.findByUsername(username).orElse(null);
        if (u != null) {
            return new org.springframework.security.core.userdetails.User(
                u.getUsername(),
                u.getPassword(),
                List.of(new SimpleGrantedAuthority("ROLE_ADMIN"))
            );
        }

        Customer customer = customerRepository.findByEmail(username)
            .orElseThrow(() -> new UsernameNotFoundException("No user: " + username));
        return new org.springframework.security.core.userdetails.User(
            customer.getEmail(),
            customer.getPassword(),
            List.of(new SimpleGrantedAuthority("ROLE_CUSTOMER"))
        );
    }
}
