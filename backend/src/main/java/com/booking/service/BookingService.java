package com.booking.service;

import com.booking.model.Booking;
import com.booking.model.BookingStatus;
import com.booking.model.Facility;
import com.booking.repository.BookingRepository;
import com.booking.repository.FacilityRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Optional;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;
    private final FacilityRepository facilityRepository;

    @Autowired
    public BookingService(BookingRepository bookingRepository, FacilityRepository facilityRepository) {
        this.bookingRepository = bookingRepository;
        this.facilityRepository = facilityRepository;
    }

    public List<Booking> getUserBookings(String userId) {
        return bookingRepository.findByUserId(userId);
    }

    public List<Booking> getFacilityBookings(Long facilityId) {
        return bookingRepository.findByFacilityId(facilityId);
    }

    public Optional<Booking> getBookingById(Long id) {
        return bookingRepository.findById(id);
    }

    @Transactional
    public Booking createBooking(Booking booking) {
        // Validate facility exists and is active
        Facility facility = facilityRepository.findById(booking.getFacility().getId())
                .orElseThrow(() -> new IllegalArgumentException("Facility not found"));

        if (!facility.getIsActive()) {
            throw new IllegalArgumentException("Facility is not active");
        }

        // Validate booking time
        validateBookingTime(booking);

        // Check for overlapping bookings
        List<Booking> overlappingBookings = bookingRepository.findOverlappingBookings(
                facility.getId(), BookingStatus.CONFIRMED, booking.getStartTime(), booking.getEndTime());

        if (!overlappingBookings.isEmpty()) {
            throw new IllegalArgumentException("Time slot is already booked");
        }

        // Calculate total amount
        long hours = ChronoUnit.HOURS.between(booking.getStartTime(), booking.getEndTime());
        booking.setTotalAmount(facility.getHourlyRate().multiply(BigDecimal.valueOf(hours)));
        booking.setStatus(BookingStatus.PENDING);

        return bookingRepository.save(booking);
    }

    @Transactional
    public Booking confirmBooking(Long id) {
        return bookingRepository.findById(id)
                .map(booking -> {
                    booking.setStatus(BookingStatus.CONFIRMED);
                    return bookingRepository.save(booking);
                })
                .orElseThrow(() -> new IllegalArgumentException("Booking not found"));
    }

    @Transactional
    public Booking cancelBooking(Long id) {
        return bookingRepository.findById(id)
                .map(booking -> {
                    if (booking.getStatus() != BookingStatus.CONFIRMED) {
                        throw new IllegalArgumentException("Only confirmed bookings can be cancelled");
                    }
                    booking.setStatus(BookingStatus.CANCELLED);
                    return bookingRepository.save(booking);
                })
                .orElseThrow(() -> new IllegalArgumentException("Booking not found"));
    }

    @Transactional
    public Booking rejectBooking(Long id) {
        return bookingRepository.findById(id)
                .map(booking -> {
                    if (booking.getStatus() != BookingStatus.PENDING) {
                        throw new IllegalArgumentException("Only pending bookings can be rejected");
                    }
                    booking.setStatus(BookingStatus.REJECTED);
                    return bookingRepository.save(booking);
                })
                .orElseThrow(() -> new IllegalArgumentException("Booking not found"));
    }

    private void validateBookingTime(Booking booking) {
        LocalDateTime now = LocalDateTime.now();
        if (booking.getStartTime().isBefore(now)) {
            throw new IllegalArgumentException("Booking start time cannot be in the past");
        }
        if (booking.getEndTime().isBefore(booking.getStartTime())) {
            throw new IllegalArgumentException("End time must be after start time");
        }
        if (booking.getStartTime().equals(booking.getEndTime())) {
            throw new IllegalArgumentException("Start time and end time cannot be the same");
        }
    }
}