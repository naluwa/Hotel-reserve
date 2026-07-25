package com.hotel.reservation.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "guest_messages")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GuestMessage {

    @Id
    private String id;

    private String senderName;
    private String senderEmail;
    private String subject;
    private String message;
    private String source;
    private boolean read;
    private boolean emailSent;
    private String emailStatus;
    private LocalDateTime emailSentAt;

    private String replyMessage;
    private LocalDateTime repliedAt;
    private String repliedBy;
    private boolean replied;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
