package com.hotel.reservation.service;

import com.hotel.reservation.exception.ResourceNotFoundException;
import com.hotel.reservation.exception.RoomUnavailableException;
import com.hotel.reservation.entity.Booking;
import com.hotel.reservation.dto.BookingRequestDTO;
import com.hotel.reservation.entity.Customer;
import com.hotel.reservation.entity.Room;
import com.hotel.reservation.repository.BookingRepository;
import com.hotel.reservation.repository.CustomerRepository;
import com.hotel.reservation.repository.RoomRepository;

import org.springframework.stereotype.Service;

import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
public class ReservationService {

    private final RoomRepository roomRepository;
    private final BookingRepository bookingRepository;
    private final CustomerRepository customerRepository;


    public ReservationService(
            RoomRepository roomRepository,
            BookingRepository bookingRepository,
            CustomerRepository customerRepository) {
        this.roomRepository = roomRepository;
        this.bookingRepository = bookingRepository;
        this.customerRepository = customerRepository;
       
    }

    // Room Operations

    public List<Room> getAllRooms() {
        return roomRepository.findAll();
    }

    /*
     * Retrieves a room by its ID. Throws an exception if the room does not exist.
     */
    public Room getRoomById(String id) {
        return roomRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Room", "id", id));
    }

    public Room saveRoom(Room room) {
        return roomRepository.save(room);
    }


}
