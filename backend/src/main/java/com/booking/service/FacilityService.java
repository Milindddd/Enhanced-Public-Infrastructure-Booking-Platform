package com.booking.service;

import com.booking.model.Facility;
import java.util.List;
import java.util.Optional;

public interface FacilityService {
    List<Facility> getAllFacilities();

    Optional<Facility> getFacilityById(Long id);

    List<Facility> getFacilitiesByType(String type);

    List<Facility> getActiveFacilities();

    List<Facility> searchFacilitiesByLocation(String location);

    Facility createFacility(Facility facility);

    Facility updateFacility(Long id, Facility facility);

    void deleteFacility(Long id);

    void toggleFacilityStatus(Long id);

    void deactivateFacility(Long id);

    void activateFacility(Long id);
}