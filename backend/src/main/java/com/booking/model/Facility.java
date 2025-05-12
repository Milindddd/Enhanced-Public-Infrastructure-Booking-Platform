package com.booking.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "facilities")
public class Facility {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private FacilityType type;

    @Column(nullable = false)
    private Integer maxCapacity;

    @Column(nullable = false)
    private Double hourlyRate;

    @Column(nullable = false)
    private Boolean isActive = true;

    @OneToMany(mappedBy = "facility", cascade = CascadeType.ALL)
    private List<Booking> bookings;
}