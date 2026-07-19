package com.hotel.reservation.service;

import com.hotel.reservation.entity.User;
import com.hotel.reservation.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {
    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User u = userRepository.findByEmail(email).orElseThrow(() -> new UsernameNotFoundException("No user: " + email));
        return new org.springframework.security.core.userdetails.User(u.getEmail(), u.getPassword(), u.getRoles().stream().map(SimpleGrantedAuthority::new).toList());
    }
}
