package com.hotel.reservation.controller;

// Spring Framework
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
// Project — DTOs, entities, service
import com.hotel.reservation.dto.BookingRequestDTO;
import com.hotel.reservation.entity.Booking;
import com.hotel.reservation.entity.Customer;
import com.hotel.reservation.entity.Room;
import com.hotel.reservation.service.ReservationService;
// Lombok
import lombok.RequiredArgsConstructor;
// Java stdlib
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "${VITE_ALLOWED_ORIGIN:http://localhost:5173}")
@RequiredArgsConstructor
public class HotelController {

    private final ReservationService reservationService;

    // Rooms

    @GetMapping("/rooms")
    public List<Room> getRooms() { return reservationService.getAllRooms(); }

    @GetMapping("/rooms/available")
    public ResponseEntity<List<Room>> getAvailableRooms(@RequestParam String checkIn, @RequestParam String checkOut) {
        LocalDate checkInDate = LocalDate.parse(checkIn);
        LocalDate checkOutDate = LocalDate.parse(checkOut);
        if (!checkOutDate.isAfter(checkInDate)) return ResponseEntity.badRequest().build();
        return ResponseEntity.ok(reservationService.getRoomsAvailableForDates(checkInDate, checkOutDate));
    }

    @PostMapping("/rooms")
    @ResponseStatus(HttpStatus.CREATED)
    public Room createRoom(@RequestBody Room room) { return reservationService.saveRoom(room); }

    @PutMapping("/rooms/{id}")
    public Room updateRoom(@PathVariable String id, @RequestBody Room updatedRoom) {
        Room existingRoom = reservationService.getRoomById(id);
        existingRoom.setRoomNumber(updatedRoom.getRoomNumber());
        existingRoom.setType(updatedRoom.getType());
        existingRoom.setPricePerNight(updatedRoom.getPricePerNight());
        existingRoom.setImageUrl(updatedRoom.getImageUrl());
        existingRoom.setAvailable(updatedRoom.isAvailable());
        return reservationService.saveRoom(existingRoom);
    }

    @DeleteMapping("/rooms/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteRoom(@PathVariable String id) { reservationService.deleteRoom(id); }

    // Bookings

    @PostMapping("/bookings")
    @ResponseStatus(HttpStatus.CREATED)
    public Booking createBooking(@RequestBody BookingRequestDTO request, Authentication auth) {
        // Populates customer name/email from the authenticated user's profile when applicable.
        reservationService.resolveCustomerFromAuth(request, auth);
        return reservationService.createBooking(request);
    }

    @GetMapping("/bookings")
    public List<Booking> getAllBookings() { return reservationService.getAllBookings(); }

    @GetMapping("/bookings/my")
    public List<Booking> getMyBookings(Authentication auth) {
        return reservationService.getBookingsByCustomerEmail(auth.getName());
    }

    @DeleteMapping("/bookings/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void cancelBooking(@PathVariable String id, Authentication auth) {
        Booking booking = reservationService.getBookingById(id);
        if (booking == null) throw new ResponseStatusException(HttpStatus.NOT_FOUND);

        boolean isAdmin = auth.getAuthorities().stream()
            .anyMatch(authority -> authority.getAuthority().equals("ROLE_ADMIN"));
        if (!isAdmin && !booking.getCustomerEmail().equalsIgnoreCase(auth.getName())) {
            throw new AccessDeniedException("Unauthorized cancellation.");
        }
        reservationService.cancelBooking(id);
    }

    @PutMapping("/bookings/{id}/payment")
    public Booking updatePaymentStatus(@PathVariable String id, @RequestParam String status) {
        return reservationService.updatePaymentStatus(id, status);
    }

   
}
