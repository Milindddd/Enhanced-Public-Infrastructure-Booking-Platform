package com.booking.service;

import com.booking.model.Facility;
import com.booking.repository.FacilityRepository;
import com.booking.service.impl.FacilityServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class FacilityServiceTest {

    @Mock
    private FacilityRepository facilityRepository;

    @InjectMocks
    private FacilityServiceImpl facilityService;

    private Facility testFacility;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        testFacility = new Facility();
        testFacility.setId(1L);
        testFacility.setName("Test Hall");
        testFacility.setType("HALL");
        testFacility.setDescription("Test Description");
        testFacility.setLocation("Test Location");
        testFacility.setHourlyRate(new BigDecimal("100.00"));
        testFacility.setCapacity(100);
        testFacility.setIsActive(true);
        testFacility.setImageUrl("http://test.com/image.jpg");
        testFacility.setContactNumber("1234567890");
        testFacility.setEmail("test@example.com");
    }

    @Test
    void getAllFacilities_ShouldReturnAllFacilities() {
        when(facilityRepository.findAll()).thenReturn(Arrays.asList(testFacility));
        List<Facility> facilities = facilityService.getAllFacilities();
        assertNotNull(facilities);
        assertEquals(1, facilities.size());
        assertEquals(testFacility.getName(), facilities.get(0).getName());
    }

    @Test
    void getFacilityById_ShouldReturnFacility_WhenExists() {
        when(facilityRepository.findById(1L)).thenReturn(Optional.of(testFacility));
        Optional<Facility> facility = facilityService.getFacilityById(1L);
        assertTrue(facility.isPresent());
        assertEquals(testFacility.getName(), facility.get().getName());
    }

    @Test
    void getFacilityById_ShouldReturnEmpty_WhenNotExists() {
        when(facilityRepository.findById(1L)).thenReturn(Optional.empty());
        Optional<Facility> facility = facilityService.getFacilityById(1L);
        assertFalse(facility.isPresent());
    }

    @Test
    void createFacility_ShouldReturnCreatedFacility() {
        when(facilityRepository.save(any(Facility.class))).thenReturn(testFacility);
        Facility createdFacility = facilityService.createFacility(testFacility);
        assertNotNull(createdFacility);
        assertEquals(testFacility.getName(), createdFacility.getName());
        assertTrue(createdFacility.getIsActive());
    }

    @Test
    void updateFacility_ShouldReturnUpdatedFacility_WhenExists() {
        when(facilityRepository.findById(1L)).thenReturn(Optional.of(testFacility));
        when(facilityRepository.save(any(Facility.class))).thenReturn(testFacility);

        Facility updatedFacility = facilityService.updateFacility(1L, testFacility);
        assertNotNull(updatedFacility);
        assertEquals(testFacility.getName(), updatedFacility.getName());
    }

    @Test
    void updateFacility_ShouldThrowException_WhenNotExists() {
        when(facilityRepository.findById(1L)).thenReturn(Optional.empty());
        assertThrows(RuntimeException.class, () -> facilityService.updateFacility(1L, testFacility));
    }

    @Test
    void deleteFacility_ShouldCallRepository() {
        doNothing().when(facilityRepository).deleteById(1L);
        facilityService.deleteFacility(1L);
        verify(facilityRepository, times(1)).deleteById(1L);
    }

    @Test
    void toggleFacilityStatus_ShouldToggleStatus() {
        when(facilityRepository.findById(1L)).thenReturn(Optional.of(testFacility));
        when(facilityRepository.save(any(Facility.class))).thenReturn(testFacility);

        facilityService.toggleFacilityStatus(1L);
        verify(facilityRepository, times(1)).save(any(Facility.class));
    }
}