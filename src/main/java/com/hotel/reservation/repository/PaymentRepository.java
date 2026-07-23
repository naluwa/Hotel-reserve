package com.hotel.reservation.repository;

import com.hotel.reservation.model.Payment;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface PaymentRepository extends MongoRepository<Payment, String> {
    List<Payment> findByReservationId(String reservationId);
}
