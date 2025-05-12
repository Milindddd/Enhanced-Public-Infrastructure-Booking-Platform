package com.booking.controller;

import com.booking.model.Facility;
import com.booking.service.FacilityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/facilities")
@CrossOrigin(origins = "http://localhost:3000")
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

    @PostMapping
    public ResponseEntity<Facility> createFacility(@RequestBody Facility facility) {
        try {
            Facility createdFacility = facilityService.createFacility(facility);
            return ResponseEntity.ok(createdFacility);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Facility> updateFacility(@PathVariable Long id, @RequestBody Facility facility) {
        try {
            Facility updatedFacility = facilityService.updateFacility(id, facility);
            return ResponseEntity.ok(updatedFacility);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
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