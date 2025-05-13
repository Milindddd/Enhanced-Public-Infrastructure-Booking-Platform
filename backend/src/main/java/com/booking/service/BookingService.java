package com.booking.service;

import com.booking.model.Booking;
import com.booking.model.BookingStatus;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface BookingService {
    List<Booking> getBookingsByUserId(String userId);

    List<Booking> getBookingsByFacilityId(Long facilityId);

    Optional<Booking> getBookingById(Long id);

    Booking createBooking(Booking booking);

    Booking confirmBooking(Long id, String paymentId);

    Booking cancelBooking(Long id, String reason);

    Booking rejectBooking(Long id);

    List<Booking> getBookingsByStatus(BookingStatus status);

    List<Booking> getUpcomingBookings(Long facilityId);

    boolean isSlotAvailable(Long facilityId, LocalDateTime startTime, LocalDateTime endTime);

    Booking updateBookingStatus(Long id, BookingStatus status);

    void processCompletedBookings();
}