package com.booking.service;

import com.booking.model.Facility;
import com.booking.repository.FacilityRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;

@Service
public class FacilityService {

    private final FacilityRepository facilityRepository;

    @Autowired
    public FacilityService(FacilityRepository facilityRepository) {
        this.facilityRepository = facilityRepository;
    }

    public List<Facility> getAllFacilities() {
        return facilityRepository.findAll();
    }

    public List<Facility> getFacilitiesByType(String type) {
        return facilityRepository.findByTypeAndIsActive(type, true);
    }

    public Optional<Facility> getFacilityById(Long id) {
        return facilityRepository.findById(id);
    }

    @Transactional
    public Facility createFacility(Facility facility) {
        if (facilityRepository.existsByNameAndAddress(facility.getName(), facility.getAddress())) {
            throw new IllegalArgumentException("Facility with this name and address already exists");
        }
        return facilityRepository.save(facility);
    }

    @Transactional
    public Facility updateFacility(Long id, Facility updatedFacility) {
        return facilityRepository.findById(id)
                .map(existingFacility -> {
                    existingFacility.setName(updatedFacility.getName());
                    existingFacility.setType(updatedFacility.getType());
                    existingFacility.setAddress(updatedFacility.getAddress());
                    existingFacility.setDescription(updatedFacility.getDescription());
                    existingFacility.setHourlyRate(updatedFacility.getHourlyRate());
                    existingFacility.setOpeningTime(updatedFacility.getOpeningTime());
                    existingFacility.setClosingTime(updatedFacility.getClosingTime());
                    existingFacility.setMaxCapacity(updatedFacility.getMaxCapacity());
                    existingFacility.setHasParking(updatedFacility.getHasParking());
                    existingFacility.setHasCatering(updatedFacility.getHasCatering());
                    existingFacility.setAmenities(updatedFacility.getAmenities());
                    return facilityRepository.save(existingFacility);
                })
                .orElseThrow(() -> new IllegalArgumentException("Facility not found with id: " + id));
    }

    @Transactional
    public void deactivateFacility(Long id) {
        facilityRepository.findById(id)
                .ifPresent(facility -> {
                    facility.setIsActive(false);
                    facilityRepository.save(facility);
                });
    }

    @Transactional
    public void activateFacility(Long id) {
        facilityRepository.findById(id)
                .ifPresent(facility -> {
                    facility.setIsActive(true);
                    facilityRepository.save(facility);
                });
    }
}