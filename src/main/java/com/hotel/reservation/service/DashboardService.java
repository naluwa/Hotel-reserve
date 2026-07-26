package com.hotel.reservation.service;

import com.hotel.reservation.dto.DashboardResponse;
import com.hotel.reservation.repository.CustomerRepository;
import com.hotel.reservation.repository.ReservationRepository;
import com.hotel.reservation.repository.RoomRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final RoomRepository roomRepository;
    private final CustomerRepository customerRepository;
    private final ReservationRepository reservationRepository;

    public DashboardResponse getDashboardSummary() {
        long totalRooms = roomRepository.count();
        long availableRooms = roomRepository.countByStatus("Available");
        long reservedRooms = roomRepository.countByStatus("Reserved");
        long occupiedRooms = roomRepository.countByStatus("Occupied");
        long totalCustomers = customerRepository.count();
        long activeReservations = reservationRepository.countByStatus("Reserved");

        return new DashboardResponse(
                totalRooms,
                availableRooms,
                reservedRooms,
                occupiedRooms,
                totalCustomers,
                activeReservations
        );
    }
}
