package com.hotel.reservation.service;

import com.hotel.reservation.dto.PaymentRequest;
import com.hotel.reservation.exception.ResourceNotFoundException;
import com.hotel.reservation.model.Payment;
import com.hotel.reservation.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final ReservationService reservationService;

    public List<Payment> getAllPayments() {
        return paymentRepository.findAll();
    }

    public Payment createPayment(PaymentRequest request) {
        Payment payment = Payment.builder()
                .reservationId(request.getReservationId())
                .amount(request.getAmount())
                .paymentDate(request.getPaymentDate())
                .paymentMethod(request.getPaymentMethod())
                .paymentStatus(request.getPaymentStatus())
                .build();
        return paymentRepository.save(payment);
    }

    public Payment updatePayment(String id, PaymentRequest request) {
        Payment existing = paymentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Payment", "id", id));

        existing.setAmount(request.getAmount());
        existing.setPaymentDate(request.getPaymentDate());
        existing.setPaymentMethod(request.getPaymentMethod());

        String status = request.getPaymentStatus();
        if ("PAID".equalsIgnoreCase(status)) {
            existing.processPayment();
            if (existing.getReservationId() != null) {
                reservationService.updatePaymentStatus(existing.getReservationId(), "PAID");
            }
        } else if ("REFUNDED".equalsIgnoreCase(status)) {
            existing.refund();
        } else {
            existing.setPaymentStatus(status);
        }

        return paymentRepository.save(existing);
    }
}
