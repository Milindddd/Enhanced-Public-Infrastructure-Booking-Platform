package com.booking.service.impl;

import com.booking.model.Facility;
import com.booking.repository.FacilityRepository;
import com.booking.service.FacilityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class FacilityServiceImpl implements FacilityService {

    private final FacilityRepository facilityRepository;

    @Autowired
    public FacilityServiceImpl(FacilityRepository facilityRepository) {
        this.facilityRepository = facilityRepository;
    }

    @Override
    public List<Facility> getAllFacilities() {
        return facilityRepository.findAll();
    }

    @Override
    public Optional<Facility> getFacilityById(Long id) {
        return facilityRepository.findById(id);
    }

    @Override
    public List<Facility> getFacilitiesByType(String type) {
        return facilityRepository.findByType(type);
    }

    @Override
    public List<Facility> getActiveFacilities() {
        return facilityRepository.findByIsActiveTrue();
    }

    @Override
    public List<Facility> searchFacilitiesByLocation(String location) {
        return facilityRepository.findByLocationContainingIgnoreCase(location);
    }

    @Override
    public Facility createFacility(Facility facility) {
        facility.setIsActive(true);
        return facilityRepository.save(facility);
    }

    @Override
    public Facility updateFacility(Long id, Facility facility) {
        return facilityRepository.findById(id)
                .map(existingFacility -> {
                    facility.setId(id);
                    facility.setIsActive(existingFacility.getIsActive());
                    return facilityRepository.save(facility);
                })
                .orElseThrow(() -> new RuntimeException("Facility not found with id: " + id));
    }

    @Override
    public void deleteFacility(Long id) {
        facilityRepository.deleteById(id);
    }

    @Override
    public void toggleFacilityStatus(Long id) {
        facilityRepository.findById(id)
                .ifPresent(facility -> {
                    facility.setIsActive(!facility.getIsActive());
                    facilityRepository.save(facility);
                });
    }

    @Override
    public void deactivateFacility(Long id) {
        facilityRepository.findById(id)
                .ifPresent(facility -> {
                    facility.setIsActive(false);
                    facilityRepository.save(facility);
                });
    }

    @Override
    public void activateFacility(Long id) {
        facilityRepository.findById(id)
                .ifPresent(facility -> {
                    facility.setIsActive(true);
                    facilityRepository.save(facility);
                });
    }
}