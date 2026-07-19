package com.hotel.reservation.service;

import com.hotel.reservation.entity.Booking;
import com.hotel.reservation.entity.Room;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import jakarta.mail.internet.MimeMessage;
import jakarta.annotation.PostConstruct;
import org.springframework.core.io.ClassPathResource;
import org.springframework.util.StreamUtils;
import java.nio.charset.StandardCharsets;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${app.mail.from:noreply@grandreserve.com}")
    private String fromAddress;

    private String confirmationTemplate;
    private String cancellationTemplate;

    @PostConstruct
    public void init() {
        try {
            confirmationTemplate = StreamUtils.copyToString(new ClassPathResource("templates/booking-confirmation.html").getInputStream(), StandardCharsets.UTF_8);
            cancellationTemplate = StreamUtils.copyToString(new ClassPathResource("templates/booking-cancellation.html").getInputStream(), StandardCharsets.UTF_8);
        } catch (Exception e) {
            log.error("Failed to load email templates", e);
            confirmationTemplate = "Booking confirmed: %s room %s %s to %s for $%.2f. Total: $%.2f";
            cancellationTemplate = "Booking cancelled for %s from %s to %s.";
        }
    }

    @Async
    public void sendBookingConfirmation(Booking booking, Room room) {
        String html = confirmationTemplate.formatted(booking.getCustomerName(), room.getRoomNumber(), room.getType(), booking.getCheckInDate(), booking.getCheckOutDate(), room.getPricePerNight(), booking.getTotalPayment());
        sendEmail(booking.getCustomerEmail(), "Booking Confirmed — Grand Reserve Hotel", html);
    }

    @Async
    public void sendCancellationNotice(Booking booking) {
        String html = cancellationTemplate.formatted(booking.getCustomerName(), booking.getCheckInDate(), booking.getCheckOutDate());
        sendEmail(booking.getCustomerEmail(), "Booking Cancelled — Grand Reserve Hotel", html);
    }

    private void sendEmail(String to, String subject, String htmlBody) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setFrom(fromAddress);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(htmlBody, true);
            mailSender.send(message);
        } catch (Exception ex) {
            log.error("Failed to send email to {} — {}", to, ex.getMessage());
        }
    }
}
