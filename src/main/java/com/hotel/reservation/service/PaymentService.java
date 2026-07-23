package com.hotel.reservation.service;

import com.hotel.reservation.model.Payment;
import com.hotel.reservation.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final PaymentRepository paymentRepository;

    public List<Payment> getAllPayments() {
        return paymentRepository.findAll();
    }

    public Payment savePayment(Payment payment) {
        return paymentRepository.save(payment);
    }

    public Payment updatePayment(String id, Payment updated) {
        return paymentRepository.findById(id)
                .map(existing -> {
                    existing.setAmount(updated.getAmount());
                    existing.setPaymentDate(updated.getPaymentDate());
                    existing.setPaymentMethod(updated.getPaymentMethod());
                    existing.setPaymentStatus(updated.getPaymentStatus());
                    return paymentRepository.save(existing);
                })
                .orElseThrow();
    }
}
