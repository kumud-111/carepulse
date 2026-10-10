package com.carepulse.web;

import com.carepulse.dto.Dtos.*;
import com.carepulse.model.Doctor;
import com.carepulse.repo.DoctorRepository;
import com.carepulse.repo.SlotRepository;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/doctors")
public class DoctorController {
    private final DoctorRepository doctors;
    private final SlotRepository slots;

    public DoctorController(DoctorRepository doctors, SlotRepository slots) {
        this.doctors = doctors;
        this.slots = slots;
    }

    @GetMapping
    public List<DoctorDto> list(@RequestParam(required = false) String state,
                                @RequestParam(required = false) String city,
                                @RequestParam(required = false) String area,
                                @RequestParam(required = false) String specialty,
                                @RequestParam(required = false) String q) {
        String needle = q == null ? "" : q.trim().toLowerCase(Locale.ROOT);
        return doctors.findAll().stream()
                .filter(d -> blank(state) || d.state.equalsIgnoreCase(state))
                .filter(d -> blank(city) || d.city.equalsIgnoreCase(city))
                .filter(d -> blank(area) || d.area.equalsIgnoreCase(area))
                .filter(d -> blank(specialty) || d.specialty.equalsIgnoreCase(specialty))
                .filter(d -> needle.isEmpty() || (d.name + " " + d.clinic + " " + d.area).toLowerCase(Locale.ROOT).contains(needle))
                .map(DoctorController::dto)
                .toList();
    }

    @GetMapping("/meta")
    public MetaDto meta() {
        List<Doctor> all = doctors.findAll();
        Map<String, Map<String, TreeSet<String>>> tree = new TreeMap<>();
        for (Doctor d : all) {
            tree.computeIfAbsent(d.state, k -> new TreeMap<>())
                .computeIfAbsent(d.city, k -> new TreeSet<>()).add(d.area);
        }
        List<StateDto> states = new ArrayList<>();
        tree.forEach((st, cityMap) -> {
            List<CityDto> cities = new ArrayList<>();
            cityMap.forEach((c, areas) -> cities.add(new CityDto(c, new ArrayList<>(areas))));
            states.add(new StateDto(st, cities));
        });
        List<String> specs = all.stream().map(d -> d.specialty).distinct().sorted().collect(Collectors.toList());
        return new MetaDto(states, specs);
    }

    @GetMapping("/{id}/slots")
    public List<SlotDto> slots(@PathVariable Long id) {
        return slots.findByDoctorIdAndStartTimeAfterOrderByStartTime(id, LocalDateTime.now()).stream()
                .map(s -> new SlotDto(s.id, s.startTime, s.booked)).toList();
    }

    private static boolean blank(String s) { return s == null || s.isBlank(); }

    static DoctorDto dto(Doctor d) {
        return new DoctorDto(d.id, d.name, d.specialty, d.state, d.city, d.area, d.address, d.phone, d.clinic, d.fee,
                d.rating, d.experienceYears, d.qualification, d.languages, d.about);
    }
}
