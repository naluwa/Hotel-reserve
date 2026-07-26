package com.hotel.reservation.service;

import com.hotel.reservation.dto.AdminCreateRequest;
import com.hotel.reservation.dto.RegisterRequest;
import com.hotel.reservation.model.Customer;
import com.hotel.reservation.model.User;
import com.hotel.reservation.repository.CustomerRepository;
import com.hotel.reservation.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

class AuthServiceTest {

    @Mock private UserRepository userRepository;
    @Mock private CustomerRepository customerRepository;
    @Mock private PasswordEncoder passwordEncoder;

    private AuthService authService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        authService = new AuthService(userRepository, customerRepository, passwordEncoder);
    }

    // ── registerCustomer ────────────────────────────────────────────────────────

    @Test
    void buildAuthResponse_usesEmailAsIdentityForCustomer() {
        var auth = new UsernamePasswordAuthenticationToken(
                "customer@test.com",
                "secret",
                List.of(new SimpleGrantedAuthority("ROLE_CUSTOMER"))
        );
        Customer customer = Customer.builder()
                .id("cust-1")
                .email("customer@test.com")
                .fullName("Jane Doe")
                .role("CUSTOMER")
                .build();

        when(customerRepository.findByEmail("customer@test.com")).thenReturn(Optional.of(customer));

        var response = authService.buildAuthResponse("token", "customer@test.com", auth);

        assertThat(response.getUsername()).isEqualTo("customer@test.com");
        assertThat(response.getFullName()).isEqualTo("Jane Doe");
        assertThat(response.getId()).isEqualTo("cust-1");
    }

    @Test
    void registerCustomer_throwsWhenEmailAlreadyRegistered() {
        when(customerRepository.existsByEmail("taken@test.com")).thenReturn(true);

        RegisterRequest request = buildRegisterRequest("taken@test.com", "Alice");

        assertThatThrownBy(() -> authService.registerCustomer(request))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Email already registered");
    }

    @Test
    void registerCustomer_throwsWhenNicPassportAlreadyRegistered() {
        when(customerRepository.existsByEmail("new@test.com")).thenReturn(false);
        when(customerRepository.findByNicPassport("NIC-123"))
                .thenReturn(Optional.of(new Customer()));

        RegisterRequest request = buildRegisterRequest("new@test.com", "Alice");
        request.setNicPassport("NIC-123");

        assertThatThrownBy(() -> authService.registerCustomer(request))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("NIC/Passport");
    }

    @Test
    void registerCustomer_savesCustomerWithHashedPassword() {
        when(customerRepository.existsByEmail("alice@test.com")).thenReturn(false);
        when(passwordEncoder.encode("pass123")).thenReturn("hashed_pass");
        when(customerRepository.save(any(Customer.class))).thenAnswer(inv -> inv.getArgument(0));

        RegisterRequest request = buildRegisterRequest("alice@test.com", "Alice");
        request.setPassword("pass123");

        Customer result = authService.registerCustomer(request);

        assertThat(result.getEmail()).isEqualTo("alice@test.com");
        assertThat(result.getPassword()).isEqualTo("hashed_pass");
        assertThat(result.getRole()).isEqualTo("CUSTOMER");
        verify(passwordEncoder).encode("pass123");
    }

    // ── createAdminUser ─────────────────────────────────────────────────────────

    @Test
    void createAdminUser_throwsWhenAdminEmailAlreadyExists() {
        when(userRepository.existsByUsername("admin@test.com")).thenReturn(true);

        AdminCreateRequest request = new AdminCreateRequest();
        request.setEmail("admin@test.com");

        assertThatThrownBy(() -> authService.createAdminUser(request))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Administrator already exists");
    }

    @Test
    void createAdminUser_derivesFullNameFromEmailWhenNotProvided() {
        when(userRepository.existsByUsername("john@hotel.com")).thenReturn(false);
        when(passwordEncoder.encode(anyString())).thenReturn("encoded");
        when(userRepository.save(any(User.class))).thenAnswer(inv -> inv.getArgument(0));

        AdminCreateRequest request = new AdminCreateRequest();
        request.setEmail("john@hotel.com");
        // fullName intentionally left null

        User result = authService.createAdminUser(request);

        assertThat(result.getFullName()).isEqualTo("john"); // derived from email prefix
        assertThat(result.getRole()).isEqualTo("ADMIN");
    }

    @Test
    void createAdminUser_usesPendingSetupPasswordWhenNotProvided() {
        when(userRepository.existsByUsername("admin@hotel.com")).thenReturn(false);
        when(passwordEncoder.encode(anyString())).thenReturn("encoded_pending");
        when(userRepository.save(any(User.class))).thenAnswer(inv -> inv.getArgument(0));

        AdminCreateRequest request = new AdminCreateRequest();
        request.setEmail("admin@hotel.com");
        // password intentionally left null

        authService.createAdminUser(request);

        // Verify that a temporary password was encoded (not null/blank)
        verify(passwordEncoder).encode(argThat((String p) -> p != null && p.startsWith("PENDING_SETUP_")));
    }

    // ── deleteAdminUser ─────────────────────────────────────────────────────────

    @Test
    void deleteAdminUser_throwsWhenUserNotFound() {
        when(userRepository.findById("bad-id")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> authService.deleteAdminUser("bad-id", "admin@hotel.com"))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Admin user not found");
    }

    @Test
    void deleteAdminUser_throwsWhenAdminTriesToDeleteOwnAccount() {
        User self = new User();
        self.setId("admin-1");
        self.setUsername("admin@hotel.com");

        when(userRepository.findById("admin-1")).thenReturn(Optional.of(self));

        assertThatThrownBy(() -> authService.deleteAdminUser("admin-1", "admin@hotel.com"))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("cannot remove their own account");
    }

    @Test
    void deleteAdminUser_successfullyDeletesAnotherAdmin() {
        User target = new User();
        target.setId("admin-2");
        target.setUsername("other@hotel.com");

        when(userRepository.findById("admin-2")).thenReturn(Optional.of(target));

        authService.deleteAdminUser("admin-2", "admin@hotel.com");

        verify(userRepository).deleteById("admin-2");
    }

    // ── setupAdminPassword ──────────────────────────────────────────────────────

    @Test
    void setupAdminPassword_throwsWhenEmailNotFound() {
        when(userRepository.findByUsername("ghost@hotel.com")).thenReturn(Optional.empty());

        assertThatThrownBy(() ->
                authService.setupAdminPassword("ghost@hotel.com", "newpass", "Ghost"))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("No eligible admin invitation");
    }

    @Test
    void setupAdminPassword_throwsWhenUserIsNotAdmin() {
        User customer = new User();
        customer.setUsername("cust@hotel.com");
        customer.setRole("CUSTOMER");

        when(userRepository.findByUsername("cust@hotel.com")).thenReturn(Optional.of(customer));

        assertThatThrownBy(() ->
                authService.setupAdminPassword("cust@hotel.com", "newpass", null))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("No eligible admin invitation");
    }

    // ── helpers ─────────────────────────────────────────────────────────────────

    private RegisterRequest buildRegisterRequest(String email, String fullName) {
        RegisterRequest r = new RegisterRequest();
        r.setEmail(email);
        r.setFullName(fullName);
        r.setPassword("password123");
        return r;
    }
}
