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
                .emailSent(false)
                .emailStatus("PENDING")
                .build();

        message.send();

        GuestMessage savedMessage = guestMessageRepository.save(message);
        boolean wasEmailSent = emailService.sendGuestMessageNotification(savedMessage);
        savedMessage.setEmailSent(wasEmailSent);
        savedMessage.setEmailStatus(wasEmailSent ? "SENT" : "FAILED");
        if (wasEmailSent) {
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

        message.reply(replyText);
        String replyAuthor = repliedBy != null ? repliedBy : "Concierge";
        message.setRepliedBy(replyAuthor);

        GuestMessage saved = guestMessageRepository.save(message);
        emailService.sendAdminReplyNotification(saved);
        return saved;
    }

    public void deleteMessage(String id) {
        if (!guestMessageRepository.existsById(id)) {
            throw new IllegalArgumentException("Message not found");
        }
        guestMessageRepository.deleteById(id);
    }
}
