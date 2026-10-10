package com.carepulse.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
public class Slot {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long id;
    @ManyToOne(optional = false)
    public Doctor doctor;
    public LocalDateTime startTime;
    public boolean booked;
    /** Optimistic lock: two people clicking the same slot cannot both win. */
    @Version
    public Long version;
}
