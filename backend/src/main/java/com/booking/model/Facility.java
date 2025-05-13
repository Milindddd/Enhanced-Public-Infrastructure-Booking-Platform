package com.booking.model;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.util.List;

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
    private String description;

    @Column(nullable = false)
    private String location;

    @Column(nullable = false)
    private BigDecimal hourlyRate;

    @Column(nullable = false)
    private Integer capacity;

    @Column(nullable = false)
    private Boolean isActive = true;

    @OneToMany(mappedBy = "facility", cascade = CascadeType.ALL)
    private List<Booking> bookings;

    @Column(nullable = false)
    private String imageUrl;

    @Column(nullable = false)
    private String contactNumber;

    @Column(nullable = false)
    private String email;
}