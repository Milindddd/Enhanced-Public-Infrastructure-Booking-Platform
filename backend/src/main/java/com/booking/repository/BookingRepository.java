package com.booking.repository;

import com.booking.model.Booking;
import com.booking.model.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
        List<Booking> findByUserId(String userId);

        List<Booking> findByFacilityId(Long facilityId);

        List<Booking> findByStatus(BookingStatus status);

        @Query("SELECT b FROM Booking b WHERE b.facility.id = ?1 AND b.status = ?2 AND " +
                        "((b.startTime <= ?3 AND b.endTime > ?3) OR " +
                        "(b.startTime < ?4 AND b.endTime >= ?4) OR " +
                        "(b.startTime >= ?3 AND b.endTime <= ?4))")
        List<Booking> findOverlappingBookings(Long facilityId, BookingStatus status,
                        LocalDateTime startTime, LocalDateTime endTime);

        @Query("SELECT b FROM Booking b WHERE b.facility.id = ?1 AND b.status = ?2 AND b.startTime >= ?3")
        List<Booking> findUpcomingBookings(Long facilityId, BookingStatus status, LocalDateTime now);

        List<Booking> findByFacilityIdAndStartTimeBetween(Long facilityId, LocalDateTime start, LocalDateTime end);

        List<Booking> findByUserIdAndStatus(String userId, BookingStatus status);
}