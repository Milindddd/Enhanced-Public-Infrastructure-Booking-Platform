package com.booking.controller;

import com.booking.model.Booking;
import com.booking.model.BookingStatus;
import com.booking.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "*")
public class BookingController {

    private final BookingService bookingService;

    @Autowired
    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @PostMapping
    public ResponseEntity<Booking> createBooking(@RequestBody Booking booking) {
        try {
            return ResponseEntity.ok(bookingService.createBooking(booking));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Booking> getBookingById(@PathVariable Long id) {
        return bookingService.getBookingById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Booking>> getBookingsByUserId(@PathVariable String userId) {
        return ResponseEntity.ok(bookingService.getBookingsByUserId(userId));
    }

    @GetMapping("/facility/{facilityId}")
    public ResponseEntity<List<Booking>> getBookingsByFacilityId(@PathVariable Long facilityId) {
        return ResponseEntity.ok(bookingService.getBookingsByFacilityId(facilityId));
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<Booking>> getBookingsByStatus(@PathVariable BookingStatus status) {
        return ResponseEntity.ok(bookingService.getBookingsByStatus(status));
    }

    @GetMapping("/facility/{facilityId}/upcoming")
    public ResponseEntity<List<Booking>> getUpcomingBookings(@PathVariable Long facilityId) {
        return ResponseEntity.ok(bookingService.getUpcomingBookings(facilityId));
    }

    @GetMapping("/check-availability")
    public ResponseEntity<Boolean> checkSlotAvailability(
            @RequestParam Long facilityId,
            @RequestParam String startTime,
            @RequestParam String endTime) {
        return ResponseEntity.ok(bookingService.isSlotAvailable(
                facilityId,
                java.time.LocalDateTime.parse(startTime),
                java.time.LocalDateTime.parse(endTime)));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<Booking> updateBookingStatus(
            @PathVariable Long id,
            @RequestBody Map<String, BookingStatus> statusUpdate) {
        try {
            return ResponseEntity.ok(bookingService.updateBookingStatus(id, statusUpdate.get("status")));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PatchMapping("/{id}/cancel")
    public ResponseEntity<Booking> cancelBooking(
            @PathVariable Long id,
            @RequestBody Map<String, String> cancellationRequest) {
        try {
            return ResponseEntity.ok(bookingService.cancelBooking(id, cancellationRequest.get("reason")));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PatchMapping("/{id}/confirm")
    public ResponseEntity<Booking> confirmBooking(
            @PathVariable Long id,
            @RequestBody Map<String, String> confirmationRequest) {
        try {
            return ResponseEntity.ok(bookingService.confirmBooking(id, confirmationRequest.get("paymentId")));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
}