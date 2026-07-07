

package com.hotel.reservation.repository;

import com.hotel.reservation.entity.Booking;
import org.springframework.data.mongodb.repository.MongoRepository;


public interface BookingRepository extends MongoRepository<Booking, String> {
    
}

