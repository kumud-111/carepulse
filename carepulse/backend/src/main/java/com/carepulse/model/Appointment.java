package com.carepulse.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
public class Appointment {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long id;
    @ManyToOne(optional = false)
    public AppUser user;
    @ManyToOne(optional = false)
    public Doctor doctor;
    @ManyToOne(optional = false)
    public Slot slot;
    public String status = "BOOKED";
    @Column(length = 500)
    public String note;
    public LocalDateTime createdAt = LocalDateTime.now();
}
