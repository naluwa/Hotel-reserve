package com.hotel.reservation.service;

import com.hotel.reservation.dto.BookingRequestDTO;
import com.hotel.reservation.entity.Booking;
import com.hotel.reservation.entity.Room;
import com.hotel.reservation.exception.ResourceNotFoundException;
import com.hotel.reservation.exception.RoomUnavailableException;
import com.hotel.reservation.repository.BookingRepository;
import com.hotel.reservation.repository.RoomRepository;

import org.springframework.stereotype.Service;

import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
public class ReservationService {

    private final RoomRepository roomRepository;
    private final BookingRepository bookingRepository;

    public ReservationService(RoomRepository roomRepository,
                              BookingRepository bookingRepository) {
        this.roomRepository = roomRepository;
        this.bookingRepository = bookingRepository;
    }


    public List<Room> getAllRooms() {
        return roomRepository.findAll();
    }

    public Room getRoomById(String id) {
        return roomRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Room", "id", id));
    }

    public Room saveRoom(Room room) {
        return roomRepository.save(room);
    }

    public Booking createBooking(BookingRequestDTO request) {

        validateBookingRequest(request);

        Room room = getRoomById(request.getRoomId());

        if (!room.isAvailable()) {
            throw new RoomUnavailableException(room.getRoomNumber());
        }

        // Mark room as occupied
        room.setAvailable(false);
        roomRepository.save(room);

        long nights = ChronoUnit.DAYS.between(
                request.getCheckInDate(),
                request.getCheckOutDate());

        double totalPayment = nights * room.getPricePerNight();

        Booking booking = new Booking();
        booking.setRoomId(request.getRoomId());
        booking.setCustomerName(request.getCustomerName());
        booking.setCustomerEmail(request.getCustomerEmail());
        booking.setCheckInDate(request.getCheckInDate());
        booking.setCheckOutDate(request.getCheckOutDate());
        booking.setTotalPayment(totalPayment);
        booking.setPaymentStatus("PENDING");

        return bookingRepository.save(booking);
    }

    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    public List<Booking> getBookingsByCustomerEmail(String email) {
        return bookingRepository.findByCustomerEmail(email);
    }

    public void cancelBooking(String bookingId) {

        Booking booking = bookingRepository.findById(bookingId)
                .orElse(null);

        if (booking == null) {
            return;
        }

        Room room = roomRepository.findById(booking.getRoomId())
                .orElse(null);

        if (room != null) {
            room.setAvailable(true);
            roomRepository.save(room);
        }

        bookingRepository.deleteById(bookingId);
    }

    public Booking updatePaymentStatus(String bookingId, String status) {

        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Booking", "id", bookingId));

        booking.setPaymentStatus(status);

        return bookingRepository.save(booking);
    }

    private void validateBookingRequest(BookingRequestDTO request) {

        if (request.getCheckInDate() == null ||
            request.getCheckOutDate() == null) {
            throw new IllegalArgumentException("Check-in and Check-out dates are required.");
        }

        if (!request.getCheckOutDate().isAfter(request.getCheckInDate())) {
            throw new IllegalArgumentException("Check-out date must be after Check-in date.");
        }
    }
}