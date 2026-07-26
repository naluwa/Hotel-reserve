package com.hotel.reservation.service;

import com.hotel.reservation.model.Reservation;
import org.junit.jupiter.api.Test;

import java.time.LocalDate;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class ReservationDomainServiceTest {

    private final ReservationDomainService reservationDomainService = new ReservationDomainService();

    @Test
    void validateStayDates_throwsWhenCheckoutIsNotAfterCheckin() {
        assertThatThrownBy(() -> reservationDomainService.validateStayDates(
                LocalDate.of(2026, 8, 10),
                LocalDate.of(2026, 8, 10)
        )).isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("after check-in");
    }

    @Test
    void calculateNights_returnsDifferenceBetweenDates() {
        int nights = reservationDomainService.calculateNights(
                LocalDate.of(2026, 8, 10),
                LocalDate.of(2026, 8, 12)
        );

        assertThat(nights).isEqualTo(2);
    }

    @Test
    void ensureTransitionAllowed_throwsWhenReservationIsNotInExpectedState() {
        Reservation reservation = new Reservation();
        reservation.setStatus("Checked In");

        assertThatThrownBy(() -> reservationDomainService.ensureTransitionAllowed(
                reservation,
                "Reserved",
                "check-in"
        )).isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("check-in");
    }
}
