package com.hotel.reservation.service;

import com.hotel.reservation.dto.GuestMessageRequest;
import com.hotel.reservation.model.GuestMessage;
import com.hotel.reservation.repository.GuestMessageRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class GuestMessageService {

    private final GuestMessageRepository guestMessageRepository;
    private final EmailService emailService;

    public GuestMessage createMessage(GuestMessageRequest request) {
        GuestMessage message = GuestMessage.builder()
                .senderName(request.getName())
                .senderEmail(request.getEmail())
                .subject(request.getSubject())
                .message(request.getMessage())
                .source("guest")
                .read(false)
                .replied(false)
                .emailSent(false)
                .emailStatus("PENDING")
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        GuestMessage savedMessage = guestMessageRepository.save(message);
        boolean emailSent = emailService.sendGuestMessageNotification(savedMessage);
        savedMessage.setEmailSent(emailSent);
        savedMessage.setEmailStatus(emailSent ? "SENT" : "FAILED");
        if (emailSent) {
            savedMessage.setEmailSentAt(LocalDateTime.now());
        }
        return guestMessageRepository.save(savedMessage);
    }

    public List<GuestMessage> getAllMessages() {
        return guestMessageRepository.findAllByOrderByCreatedAtDesc();
    }

    public List<GuestMessage> getMessagesForCustomer(String email) {
        return guestMessageRepository.findBySenderEmailOrderByCreatedAtDesc(email);
    }

    public GuestMessage markAsRead(String id) {
        GuestMessage message = guestMessageRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Message not found"));
        message.setRead(true);
        message.setUpdatedAt(LocalDateTime.now());
        return guestMessageRepository.save(message);
    }

    public GuestMessage replyToMessage(String id, String replyText, String repliedBy) {
        GuestMessage message = guestMessageRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Message not found"));
        
        message.setReplyMessage(replyText);
        message.setRepliedBy(repliedBy != null ? repliedBy : "Concierge");
        message.setRepliedAt(LocalDateTime.now());
        message.setReplied(true);
        message.setRead(true);
        message.setUpdatedAt(LocalDateTime.now());

        GuestMessage saved = guestMessageRepository.save(message);
        emailService.sendAdminReplyNotification(saved);
        return saved;
    }
}
