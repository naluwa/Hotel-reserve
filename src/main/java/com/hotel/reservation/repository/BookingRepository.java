
package com.hotel.reservation.repository;

import com.hotel.reservation.entity.Booking;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.time.LocalDate;
import java.util.List;

public interface BookingRepository extends MongoRepository<Booking, String> {

    List<Booking> findByCustomerEmail(String customerEmail);

    /**
     * Returns bookings for a room whose dates overlap with [checkIn, checkOut).
     * Two ranges overlap when: existingCheckIn < requestedCheckOut AND
     * existingCheckOut > requestedCheckIn
     */
    List<Booking> findByRoomIdAndCheckInDateBeforeAndCheckOutDateAfter(
            String roomId, LocalDate checkOutDate, LocalDate checkInDate);
}
