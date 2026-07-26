package com.hotel.reservation.service;

import com.hotel.reservation.exception.ResourceNotFoundException;
import com.hotel.reservation.model.Reservation;
import com.hotel.reservation.model.Room;
import com.hotel.reservation.repository.ReservationRepository;
import com.hotel.reservation.repository.RoomRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ReservationStateService {

    private final ReservationRepository reservationRepository;
    private final RoomRepository roomRepository;

    public void cancelReservation(String reservationId, String callerEmail, boolean isAdmin) {
        Reservation reservation = reservationRepository.findById(reservationId).orElse(null);
        if (reservation == null) {
            return;
        }

        if (!isAdmin && !reservation.getCustomerEmail().equals(callerEmail)) {
            throw new AccessDeniedException("You do not have permission to cancel this reservation.");
        }

        if (isActive(reservation)) {
            Room room = roomRepository.findById(reservation.getRoomId()).orElse(null);
            if (room != null) {
                room.updateStatus("Available");
                roomRepository.save(room);
            }
        }

        reservation.cancel();
        reservationRepository.deleteById(reservationId);
    }

    private boolean isActive(Reservation reservation) {
        return "Reserved".equals(reservation.getStatus()) || "Checked In".equals(reservation.getStatus());
    }
}
