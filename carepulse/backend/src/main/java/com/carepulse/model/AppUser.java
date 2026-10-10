package com.carepulse.model;

import jakarta.persistence.*;

@Entity
@Table(name = "users")
public class AppUser {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long id;
    public String name;
    @Column(unique = true, nullable = false)
    public String email;
    @Column(nullable = false)
    public String passwordHash;
    @Enumerated(EnumType.STRING)
    public Role role = Role.PATIENT;
    /** Set only for DOCTOR accounts. */
    public Long doctorId;
    /** Preferred language: EN, HI, TA, TE, KN, ML, MR, GU, BN or PA. */
    public String language = "EN";
}
