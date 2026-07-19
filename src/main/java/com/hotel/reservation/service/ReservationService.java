package com.hotel.reservation.service;

// Spring Framework
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
// Project — exceptions, DTOs, entities, repositories
import com.hotel.reservation.dto.BookingRequestDTO;
import com.hotel.reservation.entity.Booking;
import com.hotel.reservation.entity.Customer;
import com.hotel.reservation.entity.Room;
import com.hotel.reservation.exception.ResourceNotFoundException;
import com.hotel.reservation.exception.RoomUnavailableException;
import com.hotel.reservation.repository.BookingRepository;
import com.hotel.reservation.repository.CustomerRepository;
import com.hotel.reservation.repository.RoomRepository;
import com.hotel.reservation.repository.UserRepository;
// Lombok
import lombok.RequiredArgsConstructor;
// Java stdlib
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ReservationService {

    private final RoomRepository roomRepository;
    private final BookingRepository bookingRepository;
    private final CustomerRepository customerRepository;
    private final UserRepository userRepository;
    private final EmailService emailService;

    // Room operations

    public List<Room> getAllRooms() { return roomRepository.findAll(); }

    public Room getRoomById(String id) {
        return roomRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Room", "id", id));
    }

    public Room saveRoom(Room room) { return roomRepository.save(room); }

    public void deleteRoom(String id) { roomRepository.deleteById(id); }

    public List<Room> getRoomsAvailableForDates(LocalDate checkIn, LocalDate checkOut) {
        return roomRepository.findAll().stream()
            .filter(room -> room.isAvailable() &&
                bookingRepository.findByRoomIdAndCheckInDateBeforeAndCheckOutDateAfter(room.getId(), checkOut, checkIn).isEmpty())
            .toList();
    }

    /**
     * Patches the booking request with the authenticated customer's profile data
     * when the request comes from a logged-in ROLE_CUSTOMER. This is a service-layer
     * concern because it requires a user lookup and DTO mutation before booking creation.
     */
    public void resolveCustomerFromAuth(BookingRequestDTO request, Authentication auth) {
        if (auth == null) return;
        boolean isCustomer = auth.getAuthorities().stream()
            .anyMatch(authority -> authority.getAuthority().equals("ROLE_CUSTOMER"));
        if (isCustomer) {
            userRepository.findByEmail(auth.getName()).ifPresent(user -> {
                request.setCustomerName(user.getFullName());
                request.setCustomerEmail(user.getEmail());
            });
        }
    }

    // Booking operations

    public Booking createBooking(BookingRequestDTO request) {
        if (request.getCheckInDate() == null || request.getCheckOutDate() == null
                || !request.getCheckOutDate().isAfter(request.getCheckInDate())) {
            throw new IllegalArgumentException("Invalid dates.");
        }
        if (request.getCustomerName() == null || request.getCustomerName().isBlank()
                || request.getCustomerEmail() == null || request.getCustomerEmail().isBlank()) {
            throw new IllegalArgumentException("Missing guest information.");
        }

        Room room = getRoomById(request.getRoomId());
        boolean hasConflict = !bookingRepository
            .findByRoomIdAndCheckInDateBeforeAndCheckOutDateAfter(request.getRoomId(), request.getCheckOutDate(), request.getCheckInDate())
            .isEmpty();
        if (!room.isAvailable() || hasConflict) {
            throw new RoomUnavailableException(room.getRoomNumber());
        }

        long nights = ChronoUnit.DAYS.between(request.getCheckInDate(), request.getCheckOutDate());
        double totalCost = room.getPricePerNight() * nights;

        Booking booking = new Booking();
        booking.setRoomId(request.getRoomId());
        booking.setCustomerName(request.getCustomerName());
        booking.setCustomerEmail(request.getCustomerEmail());
        booking.setCheckInDate(request.getCheckInDate());
        booking.setCheckOutDate(request.getCheckOutDate());
        booking.setTotalPayment(totalCost);
        booking.setPaymentStatus("PENDING");

        Booking savedBooking = bookingRepository.save(booking);
        customerRepository.findByEmail(request.getCustomerEmail()).ifPresentOrElse(
            customer -> { customer.setTotalBookingsMade(customer.getTotalBookingsMade() + 1); customerRepository.save(customer); },
            () -> customerRepository.save(new Customer(request.getCustomerName(), request.getCustomerEmail()))
        );
        emailService.sendBookingConfirmation(savedBooking, room);
        return savedBooking;
    }

    // Booking operations

    public List<Booking> getAllBookings() { return bookingRepository.findAll(); }

    public List<Booking> getBookingsByCustomerEmail(String email) {
        return bookingRepository.findByCustomerEmail(email);
    }

    public Booking getBookingById(String id) { return bookingRepository.findById(id).orElse(null); }

    public void cancelBooking(String id) {
        Booking booking = bookingRepository.findById(id).orElse(null);
        if (booking == null) return;
        bookingRepository.deleteById(id);
        emailService.sendCancellationNotice(booking);
    }

    public Booking updatePaymentStatus(String id, String status) {
        Booking booking = bookingRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Booking", "id", id));
        if ("PAID".equalsIgnoreCase(status) && !"PENDING".equalsIgnoreCase(booking.getPaymentStatus())) {
            throw new IllegalStateException("Already processed.");
        }
        booking.setPaymentStatus(status.toUpperCase());
        return bookingRepository.save(booking);
    }

    // Customer operations

    public List<Customer> getAllCustomers() { return customerRepository.findAll(); }

    public void deleteCustomer(String id) { customerRepository.deleteById(id); }
}
