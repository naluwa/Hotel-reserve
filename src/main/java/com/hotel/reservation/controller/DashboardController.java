package com.hotel.reservation.controller;

import com.hotel.reservation.dto.DashboardResponse;
import com.hotel.reservation.repository.CustomerRepository;
import com.hotel.reservation.repository.ReservationRepository;
import com.hotel.reservation.repository.RoomRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "http://localhost:5173")
@RequiredArgsConstructor
public class DashboardController {

    private final RoomRepository roomRepository;
    private final CustomerRepository customerRepository;
    private final ReservationRepository reservationRepository;

    @GetMapping("/summary")
    public DashboardResponse getSummary() {
        long totalRooms = roomRepository.count();
        long availableRooms = roomRepository.countByStatus("Available");
        long reservedRooms = roomRepository.countByStatus("Reserved");
        long occupiedRooms = roomRepository.countByStatus("Occupied");
        long totalCustomers = customerRepository.count();
        long activeReservations = reservationRepository.countByStatus("Reserved");
        return new DashboardResponse(totalRooms, availableRooms, reservedRooms, occupiedRooms, totalCustomers, activeReservations);
    }
}
