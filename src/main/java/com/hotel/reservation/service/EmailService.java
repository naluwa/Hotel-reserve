package com.hotel.reservation.service;

import com.hotel.reservation.model.Reservation;
import com.hotel.reservation.model.Room;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ClassPathResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.util.StreamUtils;
import org.springframework.util.StringUtils;
import org.springframework.web.util.HtmlUtils;

import java.nio.charset.StandardCharsets;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${app.mail.from:noreply@grandreserve.com}")
    private String fromAddress;

    @Value("${spring.mail.host:}")
    private String smtpHost;

    @Value("${spring.mail.username:}")
    private String smtpUsername;

    @Value("${spring.mail.password:}")
    private String smtpPassword;

    @Value("${app.mail.admin-to:${app.mail.from:noreply@grandreserve.com}}")
    private String adminEmail;

    public boolean sendBookingConfirmation(Reservation reservation, Room room) {
        if (reservation == null || reservation.getCustomerEmail() == null || reservation.getCustomerEmail().isBlank()) {
            log.warn("Cannot send booking confirmation: missing customer email address.");
            return false;
        }

        String recipientEmail = reservation.getCustomerEmail();
        String subject = "Booking Confirmation - Grand Reserve Hotel";

        String guestName = (reservation.getCustomerName() != null && !reservation.getCustomerName().isBlank())
                ? reservation.getCustomerName()
                : "Valued Guest";
        String roomNumber = (room != null && room.getRoomNumber() != null)
                ? "Room " + room.getRoomNumber()
                : "Room " + reservation.getRoomId();
        String roomType = (room != null && room.getRoomType() != null)
                ? room.getRoomType()
                : "Standard";
        String checkIn = reservation.getCheckInDate() != null ? reservation.getCheckInDate().toString() : "N/A";
        String checkOut = reservation.getCheckOutDate() != null ? reservation.getCheckOutDate().toString() : "N/A";

        double pricePerNight = (room != null)
                ? room.getPricePerNight()
                : (reservation.getNumberOfNights() > 0 ? reservation.getTotalAmount() / reservation.getNumberOfNights() : 0.0);
        double totalAmount = reservation.getTotalAmount();

        String htmlTemplate = loadTemplate("templates/booking-confirmation.html");
        String htmlContent;

        if (htmlTemplate != null && !htmlTemplate.isBlank()) {
            htmlContent = String.format(htmlTemplate, guestName, roomNumber, roomType, checkIn, checkOut, pricePerNight, totalAmount);
        } else {
            htmlContent = String.format("<h2>Hello, %s!</h2><p>Your reservation for %s — %s from %s to %s has been confirmed. Total: LKR %.2f</p>",
                    guestName, roomNumber, roomType, checkIn, checkOut, totalAmount);
        }

        return sendHtmlEmail(recipientEmail, subject, htmlContent);
    }

    public boolean sendBookingCancellation(Reservation reservation, Room room) {
        if (reservation == null || reservation.getCustomerEmail() == null || reservation.getCustomerEmail().isBlank()) {
            log.warn("Cannot send booking cancellation: missing customer email address.");
            return false;
        }

        String recipientEmail = reservation.getCustomerEmail();
        String subject = "Booking Cancellation - Grand Reserve Hotel";

        String guestName = (reservation.getCustomerName() != null && !reservation.getCustomerName().isBlank())
                ? reservation.getCustomerName()
                : "Valued Guest";
        String roomNumber = (room != null && room.getRoomNumber() != null)
                ? "Room " + room.getRoomNumber()
                : "Room " + reservation.getRoomId();
        String roomType = (room != null && room.getRoomType() != null)
                ? room.getRoomType()
                : "Standard";

        String htmlTemplate = loadTemplate("templates/booking-cancellation.html");
        String htmlContent;

        if (htmlTemplate != null && !htmlTemplate.isBlank()) {
            htmlContent = String.format(htmlTemplate, guestName, roomNumber, roomType);
        } else {
            htmlContent = String.format("<h2>Hello, %s</h2><p>Your reservation for %s — %s has been cancelled.</p>",
                    guestName, roomNumber, roomType);
        }

        return sendHtmlEmail(recipientEmail, subject, htmlContent);
    }

    public boolean sendGuestMessageNotification(com.hotel.reservation.model.GuestMessage message) {
        if (message == null) {
            log.warn("Cannot send guest message notification: message payload is missing.");
            return false;
        }

        if (!StringUtils.hasText(message.getSenderEmail())) {
            log.warn("Cannot send guest message notification: sender email is missing.");
            return false;
        }

        String recipientEmail = StringUtils.hasText(adminEmail) ? adminEmail : fromAddress;
        String subject = StringUtils.hasText(message.getSubject())
                ? "New guest message: " + message.getSubject()
                : "New guest message";

        String htmlBody = buildGuestMessageHtml(message);
        return sendHtmlEmail(recipientEmail, subject, htmlBody);
    }

    public boolean sendAdminReplyNotification(com.hotel.reservation.model.GuestMessage message) {
        if (message == null || !StringUtils.hasText(message.getSenderEmail())) {
            log.warn("Cannot send admin reply notification: recipient email is missing.");
            return false;
        }

        String recipientEmail = message.getSenderEmail();
        String subject = "Reply to your inquiry: " + (StringUtils.hasText(message.getSubject()) ? message.getSubject() : "Grand Reserve Colombo");

        String guestName = StringUtils.hasText(message.getSenderName()) ? message.getSenderName() : "Valued Guest";
        String replyText = StringUtils.hasText(message.getReplyMessage()) ? message.getReplyMessage() : "";
        String originalMessage = StringUtils.hasText(message.getMessage()) ? message.getMessage() : "";

        String htmlBody = String.format(
                "<h2>Dear %s,</h2>" +
                "<p>Thank you for reaching out to Grand Reserve Colombo Concierge. Here is our response to your message:</p>" +
                "<blockquote style=\"border-left: 3px solid #c5a880; padding-left: 12px; font-style: italic; color: #555;\">%s</blockquote>" +
                "<hr style=\"border: none; border-top: 1px solid #eee; margin: 16px 0;\"/>" +
                "<p><strong>Your original message:</strong></p>" +
                "<p style=\"color: #777;\">%s</p>" +
                "<p>Warm regards,<br/>Concierge Team<br/>Grand Reserve Colombo</p>",
                HtmlUtils.htmlEscape(guestName),
                HtmlUtils.htmlEscape(replyText).replace("\n", "<br/>"),
                HtmlUtils.htmlEscape(originalMessage).replace("\n", "<br/>")
        );

        return sendHtmlEmail(recipientEmail, subject, htmlBody);
    }

    public boolean sendHtmlEmail(String toAddress, String subject, String htmlBody) {
        log.info("Preparing to send HTML email to: {}", toAddress);
        if (!StringUtils.hasText(toAddress)) {
            log.warn("Cannot send email because no recipient address was provided.");
            return false;
        }
        if (!StringUtils.hasText(subject)) {
            subject = "No subject";
        }
        if (!StringUtils.hasText(htmlBody)) {
            log.warn("Cannot send email because the message body is empty.");
            return false;
        }
        if (!StringUtils.hasText(smtpHost) || !StringUtils.hasText(smtpUsername) || !StringUtils.hasText(smtpPassword)) {
            log.warn("SMTP is not fully configured (spring.mail.host/username/password). Email will not be sent.");
            log.debug("Email preview to {} with subject '{}': {}", toAddress, subject, htmlBody);
            return false;
        }
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setFrom(fromAddress);
            helper.setTo(toAddress);
            helper.setSubject(subject);
            helper.setText(htmlBody, true);

            mailSender.send(message);
            log.info("Successfully sent HTML email to {} with subject '{}'", toAddress, subject);
            return true;
        } catch (Exception ex) {
            log.warn("SMTP delivery failed for recipient '{}': {}. Email HTML logged below for reference:\n[TO]: {}\n[SUBJECT]: {}\n[BODY]:\n{}",
                    toAddress, ex.getMessage(), toAddress, subject, htmlBody);
            return false;
        }
    }

    private String buildGuestMessageHtml(com.hotel.reservation.model.GuestMessage message) {
        String senderName = StringUtils.hasText(message.getSenderName()) ? message.getSenderName() : "Guest";
        String senderEmail = StringUtils.hasText(message.getSenderEmail()) ? message.getSenderEmail() : "Not provided";
        String subject = StringUtils.hasText(message.getSubject()) ? message.getSubject() : "No subject";
        String messageBody = StringUtils.hasText(message.getMessage()) ? message.getMessage() : "";

        String escapedMessage = HtmlUtils.htmlEscape(messageBody).replace("\n", "<br/>");
        return String.format(
                "<h2>New guest message received</h2>" +
                        "<p><strong>Name:</strong> %s</p>" +
                        "<p><strong>Email:</strong> %s</p>" +
                        "<p><strong>Subject:</strong> %s</p>" +
                        "<p><strong>Message:</strong><br/>%s</p>",
                HtmlUtils.htmlEscape(senderName),
                HtmlUtils.htmlEscape(senderEmail),
                HtmlUtils.htmlEscape(subject),
                escapedMessage
        );
    }

    private String loadTemplate(String path) {
        try {
            ClassPathResource resource = new ClassPathResource(path);
            return StreamUtils.copyToString(resource.getInputStream(), StandardCharsets.UTF_8);
        } catch (Exception e) {
            log.error("Failed to load email template from path: {}", path, e);
            return null;
        }
    }
}
