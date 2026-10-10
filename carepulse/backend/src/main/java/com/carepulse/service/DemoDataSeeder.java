package com.carepulse.service;

import com.carepulse.model.AppUser;
import com.carepulse.model.Doctor;
import com.carepulse.model.Role;
import com.carepulse.model.Slot;
import com.carepulse.repo.AppointmentRepository;
import com.carepulse.repo.DoctorRepository;
import com.carepulse.repo.SlotRepository;
import com.carepulse.repo.UserRepository;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.io.ClassPathResource;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.io.InputStream;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/** Loads sample doctors on first start and keeps future appointment slots topped up. */
@Component
public class DemoDataSeeder implements CommandLineRunner {
    private static final Logger log = LoggerFactory.getLogger(DemoDataSeeder.class);
    private static final int[] HOURS = {10, 12, 17, 18};

    private final DoctorRepository doctors;
    private final SlotRepository slots;
    private final AppointmentRepository appointments;
    private final UserRepository users;
    private final PasswordEncoder encoder;
    private final ObjectMapper mapper;

    public DemoDataSeeder(DoctorRepository doctors, SlotRepository slots, AppointmentRepository appointments, UserRepository users,
                          PasswordEncoder encoder, ObjectMapper mapper) {
        this.doctors = doctors;
        this.slots = slots;
        this.appointments = appointments;
        this.users = users;
        this.encoder = encoder;
        this.mapper = mapper;
    }

    @Override
    public void run(String... args) throws Exception {
        // Data from an older version has no state: clear it and load the new state-wise list.
        if (doctors.count() > 0 && doctors.findAll().stream().anyMatch(d -> d.state == null)) {
            appointments.deleteAll();
            slots.deleteAll();
            users.deleteAll(users.findAll().stream().filter(u -> u.role == Role.DOCTOR).toList());
            doctors.deleteAll();
            log.info("Old doctor data cleared; reloading");
        }
        if (doctors.count() == 0) {
            try (InputStream in = new ClassPathResource("data/doctors.json").getInputStream()) {
                List<Doctor> seed = mapper.readValue(in, new TypeReference<List<Doctor>>() {});
                doctors.saveAll(seed);
                log.info("Loaded {} sample doctors", seed.size());
            }
        }
        if (!users.existsByEmail("dr.sharma@carepulse.test")) {
            doctors.findAll().stream().filter(d -> "Dr. Anil Sharma".equals(d.name)).findFirst().ifPresent(d -> {
                AppUser u = new AppUser();
                u.name = d.name;
                u.email = "dr.sharma@carepulse.test";
                u.passwordHash = encoder.encode("Doctor@123");
                u.role = Role.DOCTOR;
                u.doctorId = d.id;
                users.save(u);
            });
        }
        LocalDateTime now = LocalDateTime.now();
        int created = 0;
        for (Doctor d : doctors.findAll()) {
            if (slots.existsByDoctorIdAndStartTimeAfter(d.id, now.plusDays(2))) continue;
            List<Slot> batch = new ArrayList<>();
            for (int day = 0; day < 5; day++) {
                for (int h : HOURS) {
                    LocalDateTime t = LocalDate.now().plusDays(day).atTime(h, 0);
                    if (t.isAfter(now)) {
                        Slot s = new Slot();
                        s.doctor = d;
                        s.startTime = t;
                        batch.add(s);
                    }
                }
            }
            slots.saveAll(batch);
            created += batch.size();
        }
        if (created > 0) log.info("Created {} appointment slots", created);
    }
}
