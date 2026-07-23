package com.hotel.reservation.repository;

import com.hotel.reservation.model.Reservation;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.time.LocalDate;
import java.util.List;

public interface ReservationRepository extends MongoRepository<Reservation, String> {
    List<Reservation> findByRoomIdAndStatusIn(String roomId, List<String> statuses);
    List<Reservation> findByRoomIdAndCheckInDateBeforeAndCheckOutDateAfterAndStatusIn(
            String roomId,
            LocalDate checkOutDate,
            LocalDate checkInDate,
            List<String> statuses
    );
    List<Reservation> findByCheckInDateBeforeAndCheckOutDateAfterAndStatusIn(
            LocalDate checkOutDate,
            LocalDate checkInDate,
            List<String> statuses
    );
    List<Reservation> findByCustomerEmail(String customerEmail);
    List<Reservation> findByStatus(String status);
    long countByStatus(String status);
}
