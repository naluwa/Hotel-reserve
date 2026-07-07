

package com.hotel.reservation.repository;

import com.hotel.reservation.entity.Booking;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface BookingRepository extends MongoRepository<Booking, String> {
    List<Booking> findByCustomerEmail(String customerEmail);
}

