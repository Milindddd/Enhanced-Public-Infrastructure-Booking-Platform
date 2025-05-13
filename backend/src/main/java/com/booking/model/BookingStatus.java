package com.booking.model;

public enum BookingStatus {
    PENDING, // Initial state when booking is created
    CONFIRMED, // Payment successful, booking confirmed
    CANCELLED, // Booking cancelled by user
    COMPLETED, // Booking time has passed
    REFUNDED, // Cancelled and refunded
    REJECTED // Rejected by admin
}