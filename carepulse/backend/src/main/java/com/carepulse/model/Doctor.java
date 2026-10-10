package com.carepulse.model;

import jakarta.persistence.*;

@Entity
public class Doctor {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long id;
    public String name;
    public String specialty;
    public String state;
    public String city;
    public String area;
    public String address;
    public String phone;
    public String clinic;
    public int fee;
    public double rating;
    public int experienceYears;
    public String qualification;
    public String languages;
    @Column(length = 500)
    public String about;
}
