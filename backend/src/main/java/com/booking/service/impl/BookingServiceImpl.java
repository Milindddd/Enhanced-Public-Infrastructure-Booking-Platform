package com.booking.service.impl;

import com.booking.model.Booking;
import com.booking.model.BookingStatus;
import com.booking.model.Facility;
import com.booking.repository.BookingRepository;
import com.booking.repository.FacilityRepository;
import com.booking.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class BookingServiceImpl implements BookingService {

    private final BookingRepository bookingRepository;
    private final FacilityRepository facilityRepository;

    @Autowired
    public BookingServiceImpl(BookingRepository bookingRepository, FacilityRepository facilityRepository) {
        this.bookingRepository = bookingRepository;
        this.facilityRepository = facilityRepository;
    }

    @Override
    public Booking createBooking(Booking booking) {
        if (!isSlotAvailable(booking.getFacility().getId(), booking.getStartTime(), booking.getEndTime())) {
            throw new RuntimeException("Selected time slot is not available");
        }
        booking.setStatus(BookingStatus.PENDING);
        booking.setCreatedAt(LocalDateTime.now());
        return bookingRepository.save(booking);
    }

    @Override
    public Optional<Booking> getBookingById(Long id) {
        return bookingRepository.findById(id);
    }

    @Override
    public List<Booking> getBookingsByUserId(String userId) {
        return bookingRepository.findByUserId(userId);
    }

    @Override
    public List<Booking> getBookingsByFacilityId(Long facilityId) {
        return bookingRepository.findByFacilityId(facilityId);
    }

    @Override
    public List<Booking> getBookingsByStatus(BookingStatus status) {
        return bookingRepository.findByStatus(status);
    }

    @Override
    public boolean isSlotAvailable(Long facilityId, LocalDateTime startTime, LocalDateTime endTime) {
        List<Booking> overlappingBookings = bookingRepository.findOverlappingBookings(
                facilityId,
                BookingStatus.CONFIRMED,
                startTime,
                endTime);
        return overlappingBookings.isEmpty();
    }

    @Override
    public Booking updateBookingStatus(Long id, BookingStatus status) {
        return bookingRepository.findById(id)
                .map(booking -> {
                    booking.setStatus(status);
                    booking.setUpdatedAt(LocalDateTime.now());
                    return bookingRepository.save(booking);
                })
                .orElseThrow(() -> new RuntimeException("Booking not found with id: " + id));
    }

    @Override
    public Booking cancelBooking(Long id, String reason) {
        return bookingRepository.findById(id)
                .map(booking -> {
                    if (booking.getStatus() != BookingStatus.CONFIRMED) {
                        throw new RuntimeException("Only confirmed bookings can be cancelled");
                    }
                    booking.setStatus(BookingStatus.CANCELLED);
                    booking.setCancellationReason(reason);
                    booking.setUpdatedAt(LocalDateTime.now());
                    return bookingRepository.save(booking);
                })
                .orElseThrow(() -> new RuntimeException("Booking not found with id: " + id));
    }

    @Override
    public Booking confirmBooking(Long id, String paymentId) {
        return bookingRepository.findById(id)
                .map(booking -> {
                    if (booking.getStatus() != BookingStatus.PENDING) {
                        throw new RuntimeException("Only pending bookings can be confirmed");
                    }
                    booking.setStatus(BookingStatus.CONFIRMED);
                    booking.setPaymentId(paymentId);
                    booking.setUpdatedAt(LocalDateTime.now());
                    return bookingRepository.save(booking);
                })
                .orElseThrow(() -> new RuntimeException("Booking not found with id: " + id));
    }

    @Override
    public Booking rejectBooking(Long id) {
        return bookingRepository.findById(id)
                .map(booking -> {
                    if (booking.getStatus() != BookingStatus.PENDING) {
                        throw new RuntimeException("Only pending bookings can be rejected");
                    }
                    booking.setStatus(BookingStatus.REJECTED);
                    booking.setUpdatedAt(LocalDateTime.now());
                    return bookingRepository.save(booking);
                })
                .orElseThrow(() -> new RuntimeException("Booking not found with id: " + id));
    }

    @Override
    public List<Booking> getUpcomingBookings(Long facilityId) {
        return bookingRepository.findUpcomingBookings(facilityId, BookingStatus.CONFIRMED, LocalDateTime.now());
    }

    @Override
    public void processCompletedBookings() {
        LocalDateTime now = LocalDateTime.now();
        List<Booking> confirmedBookings = bookingRepository.findByStatus(BookingStatus.CONFIRMED);

        confirmedBookings.stream()
                .filter(booking -> booking.getEndTime().isBefore(now))
                .forEach(booking -> {
                    booking.setStatus(BookingStatus.COMPLETED);
                    booking.setUpdatedAt(now);
                    bookingRepository.save(booking);
                });
    }
}