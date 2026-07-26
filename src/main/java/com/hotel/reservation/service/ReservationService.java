package com.hotel.reservation.service;

import com.hotel.reservation.dto.ReservationRequest;
import com.hotel.reservation.exception.ResourceNotFoundException;
import com.hotel.reservation.exception.RoomUnavailableException;
import com.hotel.reservation.model.Customer;
import com.hotel.reservation.model.Reservation;
import com.hotel.reservation.model.Room;
import com.hotel.reservation.repository.CustomerRepository;
import com.hotel.reservation.repository.ReservationRepository;
import com.hotel.reservation.repository.RoomRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class ReservationService {

    private final ReservationRepository reservationRepository;
    private final RoomRepository roomRepository;
    private final CustomerRepository customerRepository;
    private final EmailService emailService;
    private final ReservationDomainService reservationDomainService;
    private final ReservationStateService reservationStateService;
    private final ReservationLifecycleService reservationLifecycleService;

    public List<Reservation> getAllReservations() {
        return reservationRepository.findAll();
    }

    public Reservation getReservation(String id) {
        return reservationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Reservation", "id", id));
    }

    public Reservation createReservation(ReservationRequest request) {
        reservationDomainService.validateStayDates(request.getCheckInDate(), request.getCheckOutDate());

        Room room = roomRepository.findById(request.getRoomId())
                .orElseThrow(() -> new ResourceNotFoundException("Room", "id", request.getRoomId()));

        if (!room.checkAvailability(request.getCheckInDate(), request.getCheckOutDate())) {
            throw new RoomUnavailableException(room.getRoomNumber());
        }

        boolean hasOverlap = !reservationRepository
                .findByRoomIdAndCheckInDateBeforeAndCheckOutDateAfterAndStatusIn(
                        request.getRoomId(), request.getCheckOutDate(), request.getCheckInDate(),
                        List.of("Reserved", "Checked In")
                ).isEmpty();
        reservationDomainService.ensureNoOverlap(hasOverlap);

        Customer customer = resolveCustomer(request);

        int nights = reservationDomainService.calculateNights(request.getCheckInDate(), request.getCheckOutDate());
        double totalAmount = reservationDomainService.calculateTotalAmount(nights, room.getPricePerNight());

        Reservation reservation = reservationDomainService.createPendingReservation(request, customer, room, nights, totalAmount);
        reservation.confirm();

        room.updateStatus("Reserved");
        roomRepository.save(room);

        Reservation savedReservation = reservationRepository.save(reservation);
        boolean emailSent = emailService.sendBookingConfirmation(savedReservation, room);
        if (!emailSent) {
            log.warn("Failed to send booking confirmation for reservation id={}", savedReservation.getId());
        }
        return savedReservation;
    }

    public Reservation updateReservation(String id, ReservationRequest request) {
        Reservation existing = getReservation(id);
        existing.setCustomerId(request.getCustomerId());
        existing.setRoomId(request.getRoomId());
        existing.setCheckInDate(request.getCheckInDate());
        existing.setCheckOutDate(request.getCheckOutDate());
        existing.setNumberOfGuests(request.getNumberOfGuests());

        if (request.getStatus() != null && !request.getStatus().isBlank()) {
            existing.setStatus(request.getStatus());
        }
        if (request.getPaymentStatus() != null && !request.getPaymentStatus().isBlank()) {
            existing.setPaymentStatus(request.getPaymentStatus());
        }

        int nights = reservationDomainService.calculateNights(request.getCheckInDate(), request.getCheckOutDate());
        double pricePerNight = roomRepository.findById(request.getRoomId())
                .orElseThrow(() -> new ResourceNotFoundException("Room", "id", request.getRoomId()))
                .getPricePerNight();
        existing.setNumberOfNights(nights);
        existing.setTotalAmount(reservationDomainService.calculateTotalAmount(nights, pricePerNight));

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
                    .orElseGet(() -> Customer.builder().email(request.getCustomerEmail()).role("CUSTOMER").build());

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

    public void deleteReservation(String id, String callerEmail, boolean isAdmin) {
        Reservation reservation = reservationRepository.findById(id).orElse(null);
        if (reservation == null) {
            return;
        }

        reservationStateService.cancelReservation(id, callerEmail, isAdmin);

        boolean canceled = emailService.sendBookingCancellation(reservation,
                roomRepository.findById(reservation.getRoomId()).orElse(null));
        if (!canceled) {
            log.warn("Failed to send booking cancellation for reservation id={}", id);
        }
    }

    public Reservation checkIn(String id) {
        return reservationLifecycleService.checkIn(id);
    }

    public Reservation checkOut(String id) {
        return reservationLifecycleService.checkOut(id);
    }
}
