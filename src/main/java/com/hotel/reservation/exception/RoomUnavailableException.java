package com.hotel.reservation.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.CONFLICT)
public class RoomUnavailableException extends RuntimeException {

    public RoomUnavailableException(String roomNumber) {
        super(String.format("Room %s is already booked and cannot be reserved at this time.", roomNumber));
    }
}
