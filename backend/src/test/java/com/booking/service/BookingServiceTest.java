package com.booking.service;

import com.booking.model.Booking;
import com.booking.model.BookingStatus;
import com.booking.model.Facility;
import com.booking.repository.BookingRepository;
import com.booking.repository.FacilityRepository;
import com.booking.service.impl.BookingServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class BookingServiceTest {

    @Mock
    private BookingRepository bookingRepository;

    @Mock
    private FacilityRepository facilityRepository;

    @InjectMocks
    private BookingServiceImpl bookingService;

    private Facility facility;
    private Booking booking;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        facility = new Facility();
        facility.setId(1L);
        facility.setName("Test Facility");
        facility.setType("SPORTS");
        facility.setLocation("Test Location");
        facility.setHourlyRate(new BigDecimal("100.00"));
        facility.setCapacity(10);
        facility.setIsActive(true);

        booking = new Booking();
        booking.setId(1L);
        booking.setFacility(facility);
        booking.setUserId("user1");
        booking.setStartTime(LocalDateTime.now().plusHours(1));
        booking.setEndTime(LocalDateTime.now().plusHours(2));
        booking.setTotalAmount(new BigDecimal("100.00"));
        booking.setStatus(BookingStatus.PENDING);
    }

    @Test
    void createBooking_Success() {
        when(facilityRepository.findById(1L)).thenReturn(Optional.of(facility));
        when(bookingRepository.findOverlappingBookings(any(), any(), any(), any()))
                .thenReturn(List.of());
        when(bookingRepository.save(any(Booking.class))).thenReturn(booking);

        Booking result = bookingService.createBooking(booking);

        assertNotNull(result);
        assertEquals(BookingStatus.PENDING, result.getStatus());
        verify(bookingRepository).save(any(Booking.class));
    }

    @Test
    void createBooking_FacilityNotFound() {
        when(facilityRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(IllegalArgumentException.class, () -> bookingService.createBooking(booking));
    }

    @Test
    void createBooking_TimeSlotUnavailable() {
        when(facilityRepository.findById(1L)).thenReturn(Optional.of(facility));
        when(bookingRepository.findOverlappingBookings(any(), any(), any(), any()))
                .thenReturn(List.of(booking));

        assertThrows(IllegalArgumentException.class, () -> bookingService.createBooking(booking));
    }

    @Test
    void getBookingById_Success() {
        when(bookingRepository.findById(1L)).thenReturn(Optional.of(booking));

        Optional<Booking> result = bookingService.getBookingById(1L);

        assertTrue(result.isPresent());
        assertEquals(1L, result.get().getId());
    }

    @Test
    void getBookingById_NotFound() {
        when(bookingRepository.findById(1L)).thenReturn(Optional.empty());

        Optional<Booking> result = bookingService.getBookingById(1L);
        assertFalse(result.isPresent());
    }

    @Test
    void getBookingsByUserId_Success() {
        when(bookingRepository.findByUserId("user1")).thenReturn(List.of(booking));

        List<Booking> result = bookingService.getBookingsByUserId("user1");

        assertNotNull(result);
        assertEquals(1, result.size());
    }

    @Test
    void getBookingsByFacilityId_Success() {
        when(bookingRepository.findByFacilityId(1L)).thenReturn(List.of(booking));

        List<Booking> result = bookingService.getBookingsByFacilityId(1L);

        assertNotNull(result);
        assertEquals(1, result.size());
    }

    @Test
    void confirmBooking_Success() {
        when(bookingRepository.findById(1L)).thenReturn(Optional.of(booking));
        when(bookingRepository.save(any(Booking.class))).thenReturn(booking);

        Booking result = bookingService.confirmBooking(1L, "payment_123");

        assertNotNull(result);
        assertEquals(BookingStatus.CONFIRMED, result.getStatus());
    }

    @Test
    void confirmBooking_NotFound() {
        when(bookingRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(IllegalArgumentException.class, () -> bookingService.confirmBooking(1L, "payment_123"));
    }

    @Test
    void cancelBooking_Success() {
        booking.setStatus(BookingStatus.CONFIRMED);
        when(bookingRepository.findById(1L)).thenReturn(Optional.of(booking));
        when(bookingRepository.save(any(Booking.class))).thenReturn(booking);

        Booking result = bookingService.cancelBooking(1L, "Test cancellation reason");

        assertNotNull(result);
        assertEquals(BookingStatus.CANCELLED, result.getStatus());
    }

    @Test
    void cancelBooking_NotConfirmed() {
        when(bookingRepository.findById(1L)).thenReturn(Optional.of(booking));
        when(bookingRepository.save(any(Booking.class))).thenReturn(booking);

        assertThrows(IllegalArgumentException.class,
                () -> bookingService.cancelBooking(1L, "Test cancellation reason"));
    }

    @Test
    void rejectBooking_Success() {
        when(bookingRepository.findById(1L)).thenReturn(Optional.of(booking));
        when(bookingRepository.save(any(Booking.class))).thenReturn(booking);

        Booking result = bookingService.rejectBooking(1L);

        assertNotNull(result);
        assertEquals(BookingStatus.REJECTED, result.getStatus());
    }

    @Test
    void rejectBooking_NotPending() {
        booking.setStatus(BookingStatus.CONFIRMED);
        when(bookingRepository.findById(1L)).thenReturn(Optional.of(booking));
        when(bookingRepository.save(any(Booking.class))).thenReturn(booking);

        assertThrows(IllegalArgumentException.class, () -> bookingService.rejectBooking(1L));
    }
}