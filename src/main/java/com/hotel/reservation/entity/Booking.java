

package com.hotel.reservation.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDate;


@Document(collection = "bookings")
public class Booking {
    
    
    @Id
    private String id;
    
    
    private String roomId;
    
    private String customerName;
    private String customerEmail;
    
    
    private LocalDate checkInDate;
    private LocalDate checkOutDate;
    
    private double totalPayment;
    private String paymentStatus; 

    
    public Booking() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getRoomId() { return roomId; }
    public void setRoomId(String roomId) { this.roomId = roomId; }
    public String getCustomerName() { return customerName; }
    public void setCustomerName(String customerName) { this.customerName = customerName; }
    public String getCustomerEmail() { return customerEmail; }
    public void setCustomerEmail(String customerEmail) { this.customerEmail = customerEmail; }
    public LocalDate getCheckInDate() { return checkInDate; }
    public void setCheckInDate(LocalDate checkInDate) { this.checkInDate = checkInDate; }
    public LocalDate getCheckOutDate() { return checkOutDate; }
    public void setCheckOutDate(LocalDate checkOutDate) { this.checkOutDate = checkOutDate; }
    public double getTotalPayment() { return totalPayment; }
    public void setTotalPayment(double totalPayment) { this.totalPayment = totalPayment; }
    public String getPaymentStatus() { return paymentStatus; }
    public void setPaymentStatus(String paymentStatus) { this.paymentStatus = paymentStatus; }
}
