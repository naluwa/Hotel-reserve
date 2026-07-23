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

import java.nio.charset.StandardCharsets;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${app.mail.from:noreply@grandreserve.com}")
    private String fromAddress;

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

    public boolean sendHtmlEmail(String toAddress, String subject, String htmlBody) {
        log.info("Preparing to send HTML email to: {}", toAddress);
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
