package com.carepulse.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
public class Assessment {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long id;
    @ManyToOne(optional = false)
    public AppUser user;
    @Column(length = 2000)
    public String symptoms;
    public String riskLevel;
    public String specialty;
    @Column(length = 2000)
    public String summary;
    public LocalDateTime createdAt = LocalDateTime.now();
}
