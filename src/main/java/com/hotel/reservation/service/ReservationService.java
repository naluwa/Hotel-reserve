package com.hotel.reservation.service;

import com.hotel.reservation.dto.ReservationRequest;
import com.hotel.reservation.exception.ResourceNotFoundException;
import com.hotel.reservation.model.Customer;
import com.hotel.reservation.model.Reservation;
import com.hotel.reservation.model.Room;
import com.hotel.reservation.repository.CustomerRepository;
import com.hotel.reservation.repository.ReservationRepository;
import com.hotel.reservation.repository.RoomRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ReservationService {

    private final ReservationRepository reservationRepository;
    private final RoomRepository roomRepository;
    private final CustomerRepository customerRepository;
    private final EmailService emailService;

    public List<Reservation> getAllReservations() {
        return reservationRepository.findAll();
    }

    public Reservation getReservation(String id) {
        return reservationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Reservation", "id", id));
    }

    public Reservation createReservation(ReservationRequest request) {
        if (!request.getCheckOutDate().isAfter(request.getCheckInDate())) {
            throw new IllegalArgumentException("Check-out date must be after check-in date.");
        }

        Room room = roomRepository.findById(request.getRoomId())
                .orElseThrow(() -> new ResourceNotFoundException("Room", "id", request.getRoomId()));
        if (room.getStatus().equals("Occupied")) {
            throw new IllegalArgumentException("Room is currently occupied.");
        }

        boolean hasOverlap = !reservationRepository
                .findByRoomIdAndCheckInDateBeforeAndCheckOutDateAfterAndStatusIn(
                        request.getRoomId(), request.getCheckOutDate(), request.getCheckInDate(),
                        List.of("Reserved", "Checked In")
                ).isEmpty();
        if (hasOverlap) {
            throw new IllegalArgumentException("Selected dates overlap with an existing reservation.");
        }

        Customer customer = resolveCustomer(request);

        long nights = ChronoUnit.DAYS.between(request.getCheckInDate(), request.getCheckOutDate());
        double totalAmount = nights * room.getPricePerNight();

        Reservation reservation = Reservation.builder()
                .customerId(customer.getId())
                .customerName(customer.getFullName())
                .customerEmail(customer.getEmail())
                .roomId(room.getId())
                .checkInDate(request.getCheckInDate())
                .checkOutDate(request.getCheckOutDate())
                .numberOfGuests(request.getNumberOfGuests())
                .numberOfNights((int) nights)
                .totalAmount(totalAmount)
                .status("Reserved")
                .paymentStatus("PENDING")
                .build();

        room.setStatus("Reserved");
        roomRepository.save(room);

        Reservation savedReservation = reservationRepository.save(reservation);
        emailService.sendBookingConfirmation(savedReservation, room);
        return savedReservation;
    }

    public Reservation updateReservation(String id, ReservationRequest request) {
        Reservation existing = getReservation(id);
        existing.setCustomerId(request.getCustomerId());
        existing.setRoomId(request.getRoomId());
        existing.setCheckInDate(request.getCheckInDate());
        existing.setCheckOutDate(request.getCheckOutDate());
        existing.setNumberOfGuests(request.getNumberOfGuests());

        long nights = ChronoUnit.DAYS.between(request.getCheckInDate(), request.getCheckOutDate());
        existing.setNumberOfNights((int) nights);
        existing.setTotalAmount(nights * roomRepository.findById(request.getRoomId())
                .orElseThrow(() -> new ResourceNotFoundException("Room", "id", request.getRoomId()))
                .getPricePerNight());

        return reservationRepository.save(existing);
    }

    public Reservation updatePaymentStatus(String id, String status) {
        Reservation reservation = getReservation(id);
        reservation.setPaymentStatus(status);
        return reservationRepository.save(reservation);
    }

    public List<Reservation> getReservationsForCustomer(String customerEmail) {
        return reservationRepository.findByCustomerEmail(customerEmail);
    }

    private Customer resolveCustomer(ReservationRequest request) {
        if (request.getCustomerId() != null && !request.getCustomerId().isBlank()) {
            return customerRepository.findById(request.getCustomerId())
                    .orElseThrow(() -> new ResourceNotFoundException("Customer", "id", request.getCustomerId()));
        }
        if (request.getCustomerEmail() != null && !request.getCustomerEmail().isBlank()) {
            Customer customer = customerRepository.findByEmail(request.getCustomerEmail())
                    .orElseGet(() -> Customer.builder().email(request.getCustomerEmail()).build());

            if (request.getCustomerName() != null && !request.getCustomerName().isBlank()) {
                customer.setFullName(request.getCustomerName());
            }
            if (request.getNicPassport() != null && !request.getNicPassport().isBlank()) {
                customer.setNicPassport(request.getNicPassport());
            }
            if (request.getPhone() != null && !request.getPhone().isBlank()) {
                customer.setPhone(request.getPhone());
            }
            if (request.getAddress() != null && !request.getAddress().isBlank()) {
                customer.setAddress(request.getAddress());
            }
            return customerRepository.save(customer);
        }
        throw new IllegalArgumentException("Customer information is required.");
    }

    public void deleteReservation(String id) {
        Reservation reservation = reservationRepository.findById(id).orElse(null);
        if (reservation != null) {
            Room room = roomRepository.findById(reservation.getRoomId()).orElse(null);
            reservationRepository.deleteById(id);
            emailService.sendBookingCancellation(reservation, room);
        }
    }

    public Reservation checkIn(String id) {
        Reservation reservation = getReservation(id);
        if (!"Reserved".equals(reservation.getStatus())) {
            throw new IllegalArgumentException(
                "Check-in is only allowed for reservations with status 'Reserved'. Current status: " + reservation.getStatus()
            );
        }
        reservation.setStatus("Checked In");
        reservation.setActualCheckIn(LocalDateTime.now());

        Room room = roomRepository.findById(reservation.getRoomId())
                .orElseThrow(() -> new ResourceNotFoundException("Room", "id", reservation.getRoomId()));
        room.setStatus("Occupied");
        roomRepository.save(room);

        return reservationRepository.save(reservation);
    }

    public Reservation checkOut(String id) {
        Reservation reservation = getReservation(id);
        if (!"Checked In".equals(reservation.getStatus())) {
            throw new IllegalArgumentException(
                "Check-out is only allowed for reservations with status 'Checked In'. Current status: " + reservation.getStatus()
            );
        }
        reservation.setStatus("Checked Out");
        reservation.setActualCheckOut(LocalDateTime.now());

        Room room = roomRepository.findById(reservation.getRoomId())
                .orElseThrow(() -> new ResourceNotFoundException("Room", "id", reservation.getRoomId()));
        room.setStatus("Available");
        roomRepository.save(room);

        return reservationRepository.save(reservation);
    }
}
