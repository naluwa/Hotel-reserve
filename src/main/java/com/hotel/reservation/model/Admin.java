package com.hotel.reservation.model;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Data
@NoArgsConstructor
@SuperBuilder
@EqualsAndHashCode(callSuper = true)
public class Admin extends User {

    // Admin can manage rooms through RoomController and RoomService
    public void manageRooms() {
    }

    // Admin can view and manage all reservations
    public void manageReservations() {
    }

    // Admin can update payment status for a reservation
    public void updatePaymentStatus(String reservationId, String status) {
    }
}
