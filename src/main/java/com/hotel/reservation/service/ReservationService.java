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

    /**
     * Retrieves a room by its ID. Throws an exception if the room does not exist.
     */
    public Room getRoomById(String id) {
        return roomRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Room", "id", id));
    }

    public Room saveRoom(Room room) {
        return roomRepository.save(room);
    }

    // Booking Operations

    /**
     * Creates a new booking. Validates the request, checks room availability,
     * updates the room status, and persists the booking and customer data.
     */
    public Booking createBooking(BookingRequestDTO request) {
        validateBookingRequest(request);

        Room room = getRoomById(request.getRoomId());
        
        if (!room.isAvailable()) {
            throw new RoomUnavailableException(room.getRoomNumber());
        }

        markRoomAsOccupied(room);

        double totalPayment = calculateTotalPayment(
            room.getPricePerNight(), 
            request.getCheckInDate(), 
            request.getCheckOutDate()
        );

        Booking savedBooking = persistBooking(request, totalPayment);
        upsertCustomer(request.getCustomerName(), request.getCustomerEmail());

        return savedBooking;
    }

    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }



    /**
     * Cancels an existing booking and frees up the associated room.
     */
    public void cancelBooking(String bookingId) {
        Booking booking = bookingRepository.findById(bookingId).orElse(null);
        if (booking == null) {
            return; // Booking already cancelled or does not exist
        }

        Room room = roomRepository.findById(booking.getRoomId()).orElse(null);
        if (room != null) {
            room.setAvailable(true);
            roomRepository.save(room);
        }

        bookingRepository.deleteById(bookingId);
        
    }

    public Booking updatePaymentStatus(String bookingId, String status) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking", "id", bookingId));
        booking.setPaymentStatus(status);
        return bookingRepository.save(booking);
    }

    // Customer Operations

    public List<Customer> getAllCustomers() {
        return customerRepository.findAll();
    }

    /**
     * Creates a new customer or increments the booking count for an existing customer.
     * Idempotent operation based on customer email.
     */
    private void upsertCustomer(String name, String email) {
        customerRepository.findByEmail(email).ifPresentOrElse(
                existing -> {
                    existing.setTotalBookingsMade(existing.getTotalBookingsMade() + 1);
                    customerRepository.save(existing);
                },
                () -> customerRepository.save(new Customer(name, email))
        );
    }

    // Helper Methods

    private void validateBookingRequest(BookingRequestDTO request) {
        if (!request.getCheckOutDate().isAfter(request.getCheckInDate())) {
            throw new IllegalArgumentException("Check-out date must be after check-in date.");
        }
        if (request.getCustomerName() == null || request.getCustomerName().isBlank()) {
            throw new IllegalArgumentException("Customer name is required.");
        }
        if (request.getCustomerEmail() == null || request.getCustomerEmail().isBlank()) {
            throw new IllegalArgumentException("Customer email is required.");
        }
    }

    private void markRoomAsOccupied(Room room) {
        room.setAvailable(false);
        roomRepository.save(room);
    }

    private double calculateTotalPayment(double pricePerNight, java.time.LocalDate checkIn, java.time.LocalDate checkOut) {
        long nights = ChronoUnit.DAYS.between(checkIn, checkOut);
        return pricePerNight * nights;
    }

    private Booking persistBooking(BookingRequestDTO request, double totalPayment) {
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
}
