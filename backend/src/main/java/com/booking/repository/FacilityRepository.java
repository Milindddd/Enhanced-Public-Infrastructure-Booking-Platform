package com.booking.repository;

import com.booking.model.Facility;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface FacilityRepository extends JpaRepository<Facility, Long> {
    List<Facility> findByType(String type);

    List<Facility> findByIsActive(Boolean isActive);

    List<Facility> findByTypeAndIsActive(String type, Boolean isActive);

    boolean existsByNameAndAddress(String name, String address);
}