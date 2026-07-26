package com.hotel.reservation.service;

import com.hotel.reservation.exception.ResourceNotFoundException;
import com.hotel.reservation.model.Reservation;
import com.hotel.reservation.model.Room;
import com.hotel.reservation.repository.ReservationRepository;
import com.hotel.reservation.repository.RoomRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class ReservationLifecycleService {

    private final ReservationRepository reservationRepository;
    private final RoomRepository roomRepository;
    private final ReservationDomainService reservationDomainService;

    public Reservation checkIn(String reservationId) {
        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new ResourceNotFoundException("Reservation", "id", reservationId));
        reservationDomainService.ensureTransitionAllowed(reservation, "Reserved", "Check-in");

        reservation.setStatus("Checked In");
        reservation.setActualCheckIn(LocalDateTime.now());

        Room room = roomRepository.findById(reservation.getRoomId())
                .orElseThrow(() -> new ResourceNotFoundException("Room", "id", reservation.getRoomId()));
        room.updateStatus("Occupied");
        roomRepository.save(room);

        return reservationRepository.save(reservation);
    }

    public Reservation checkOut(String reservationId) {
        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new ResourceNotFoundException("Reservation", "id", reservationId));
        reservationDomainService.ensureTransitionAllowed(reservation, "Checked In", "Check-out");

        reservation.setStatus("Checked Out");
        reservation.setActualCheckOut(LocalDateTime.now());

        Room room = roomRepository.findById(reservation.getRoomId())
                .orElseThrow(() -> new ResourceNotFoundException("Room", "id", reservation.getRoomId()));
        room.updateStatus("Available");
        roomRepository.save(room);

        return reservationRepository.save(reservation);
    }
}
