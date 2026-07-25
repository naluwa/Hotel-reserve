package com.hotel.reservation.service;

import com.hotel.reservation.dto.GuestMessageRequest;
import com.hotel.reservation.model.GuestMessage;
import com.hotel.reservation.repository.GuestMessageRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class GuestMessageServiceTest {

    @Mock
    private GuestMessageRepository guestMessageRepository;

    @Mock
    private EmailService emailService;

    private GuestMessageService guestMessageService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        guestMessageService = new GuestMessageService(guestMessageRepository, emailService);
    }

    @Test
    void createMessage_marksEmailAsSentWhenNotificationSucceeds() {
        GuestMessageRequest request = new GuestMessageRequest();
        request.setName("Jane Doe");
        request.setEmail("jane@example.com");
        request.setSubject("Need help");
        request.setMessage("Hello from the test suite");

        GuestMessage persisted = GuestMessage.builder()
                .id("msg-1")
                .senderName("Jane Doe")
                .senderEmail("jane@example.com")
                .subject("Need help")
                .message("Hello from the test suite")
                .source("guest")
                .read(false)
                .build();

        when(guestMessageRepository.save(any(GuestMessage.class))).thenReturn(persisted);
        when(emailService.sendGuestMessageNotification(any(GuestMessage.class))).thenReturn(true);

        GuestMessage result = guestMessageService.createMessage(request);

        assertThat(result.isEmailSent()).isTrue();
        assertThat(result.getEmailStatus()).isEqualTo("SENT");
        verify(emailService).sendGuestMessageNotification(any(GuestMessage.class));
    }

    @Test
    void createMessage_marksEmailAsFailedWhenNotificationFails() {
        GuestMessageRequest request = new GuestMessageRequest();
        request.setName("Jane Doe");
        request.setEmail("jane@example.com");
        request.setSubject("Need help");
        request.setMessage("Hello from the test suite");

        GuestMessage persisted = GuestMessage.builder()
                .id("msg-2")
                .senderName("Jane Doe")
                .senderEmail("jane@example.com")
                .subject("Need help")
                .message("Hello from the test suite")
                .source("guest")
                .read(false)
                .build();

        when(guestMessageRepository.save(any(GuestMessage.class))).thenReturn(persisted);
        when(emailService.sendGuestMessageNotification(any(GuestMessage.class))).thenReturn(false);

        GuestMessage result = guestMessageService.createMessage(request);

        assertThat(result.isEmailSent()).isFalse();
        assertThat(result.getEmailStatus()).isEqualTo("FAILED");
        verify(emailService).sendGuestMessageNotification(any(GuestMessage.class));
    }
}
