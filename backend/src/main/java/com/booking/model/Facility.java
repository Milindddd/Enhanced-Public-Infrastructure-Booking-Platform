package com.booking.model;

import jakarta.persistence.*;
import lombok.Data;
import java.util.List;

@Data
@Entity
@Table(name = "facilities")
public class Facility {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private FacilityType type;

    @Column(length = 1000)
    private String description;

    private Integer capacity;

    @Column(name = "price_per_hour", nullable = false)
    private Double pricePerHour;

    @ElementCollection
    @CollectionTable(name = "facility_images", joinColumns = @JoinColumn(name = "facility_id"))
    @Column(name = "image_url")
    private List<String> images;

    @OneToMany(mappedBy = "facility", cascade = CascadeType.ALL)
    private List<TimeSlot> availableSlots;
} 