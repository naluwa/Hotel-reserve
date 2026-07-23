

package com.hotel.reservation.repository;

import com.hotel.reservation.model.Room;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface RoomRepository extends MongoRepository<Room, String> {
    List<Room> findByStatus(String status);
    Room findByRoomNumber(String roomNumber);
    long countByStatus(String status);
}
