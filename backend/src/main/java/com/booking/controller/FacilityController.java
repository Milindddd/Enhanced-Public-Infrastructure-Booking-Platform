package com.booking.controller;

import com.booking.model.Facility;
import com.booking.service.FacilityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/facilities")
@CrossOrigin(origins = "*")
public class FacilityController {

    private final FacilityService facilityService;

    @Autowired
    public FacilityController(FacilityService facilityService) {
        this.facilityService = facilityService;
    }

    @GetMapping
    public ResponseEntity<List<Facility>> getAllFacilities() {
        return ResponseEntity.ok(facilityService.getAllFacilities());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Facility> getFacilityById(@PathVariable Long id) {
        return facilityService.getFacilityById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/type/{type}")
    public ResponseEntity<List<Facility>> getFacilitiesByType(@PathVariable String type) {
        return ResponseEntity.ok(facilityService.getFacilitiesByType(type));
    }

    @GetMapping("/active")
    public ResponseEntity<List<Facility>> getActiveFacilities() {
        return ResponseEntity.ok(facilityService.getActiveFacilities());
    }

    @GetMapping("/search")
    public ResponseEntity<List<Facility>> searchFacilitiesByLocation(@RequestParam String location) {
        return ResponseEntity.ok(facilityService.searchFacilitiesByLocation(location));
    }

    @PostMapping
    public ResponseEntity<Facility> createFacility(@RequestBody Facility facility) {
        return ResponseEntity.ok(facilityService.createFacility(facility));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Facility> updateFacility(@PathVariable Long id, @RequestBody Facility facility) {
        try {
            return ResponseEntity.ok(facilityService.updateFacility(id, facility));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFacility(@PathVariable Long id) {
        facilityService.deleteFacility(id);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/{id}/toggle-status")
    public ResponseEntity<Void> toggleFacilityStatus(@PathVariable Long id) {
        facilityService.toggleFacilityStatus(id);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/{id}/deactivate")
    public ResponseEntity<Void> deactivateFacility(@PathVariable Long id) {
        facilityService.deactivateFacility(id);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/{id}/activate")
    public ResponseEntity<Void> activateFacility(@PathVariable Long id) {
        facilityService.activateFacility(id);
        return ResponseEntity.ok().build();
    }
}