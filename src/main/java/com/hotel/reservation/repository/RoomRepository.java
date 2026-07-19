
package com.hotel.reservation.repository;

import com.hotel.reservation.entity.Room;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface RoomRepository extends MongoRepository<Room, String> {

    List<Room> findByAvailable(boolean available);

    Room findByRoomNumber(String roomNumber);
}
