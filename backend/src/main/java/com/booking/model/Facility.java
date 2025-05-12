package com.booking.model;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalTime;

@Entity
@Data
@Table(name = "facilities")
public class Facility {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String type; // HALL, PARK, CREMATORIUM, GUEST_HOUSE, STADIUM

    @Column(nullable = false)
    private String address;

    @Column(nullable = false)
    private String description;

    @Column(nullable = false)
    private BigDecimal hourlyRate;

    @Column(nullable = false)
    private LocalTime openingTime;

    @Column(nullable = false)
    private LocalTime closingTime;

    @Column(nullable = false)
    private Integer maxCapacity;

    @Column(nullable = false)
    private Boolean isActive = true;

    // Additional fields for specific facility types
    @Column
    private Boolean hasParking;

    @Column
    private Boolean hasCatering;

    @Column
    private String amenities; // JSON string of available amenities
}