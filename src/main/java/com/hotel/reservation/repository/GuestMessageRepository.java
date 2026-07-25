package com.hotel.reservation.repository;

import com.hotel.reservation.model.GuestMessage;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GuestMessageRepository extends MongoRepository<GuestMessage, String> {
    List<GuestMessage> findAllByOrderByCreatedAtDesc();
    List<GuestMessage> findBySenderEmailOrderByCreatedAtDesc(String senderEmail);
}
