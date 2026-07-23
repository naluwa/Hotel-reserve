package com.hotel.reservation.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class DashboardResponse {
    private long totalRooms;
    private long availableRooms;
    private long reservedRooms;
    private long occupiedRooms;
    private long totalCustomers;
    private long activeReservations;
}
