package com.carepulse.service;

import com.carepulse.dto.Dtos.AppointmentDto;
import com.carepulse.model.*;
import com.carepulse.repo.AppointmentRepository;
import com.carepulse.repo.SlotRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class BookingService {
    private final SlotRepository slots;
    private final AppointmentRepository appointments;

    public BookingService(SlotRepository slots, AppointmentRepository appointments) {
        this.slots = slots;
        this.appointments = appointments;
    }

    @Transactional
    public AppointmentDto book(AppUser user, Long slotId, String note) {
        Slot slot = slots.findById(slotId).orElseThrow(() -> new ApiException(404, "Slot not found."));
        if (slot.booked) throw new ApiException(409, "Someone just booked this slot. Please pick another time.");
        if (slot.startTime.isBefore(LocalDateTime.now())) throw new ApiException(400, "This time has already passed.");
        slot.booked = true;
        slots.saveAndFlush(slot); // @Version check: a concurrent booking fails here with a 409
        Appointment a = new Appointment();
        a.user = user;
        a.doctor = slot.doctor;
        a.slot = slot;
        a.note = note;
        return toDto(appointments.save(a));
    }

    @Transactional
    public void cancel(AppUser user, Long id) {
        Appointment a = appointments.findById(id).orElseThrow(() -> new ApiException(404, "Appointment not found."));
        if (!a.user.id.equals(user.id)) throw new ApiException(403, "This is not your appointment.");
        if (!"BOOKED".equals(a.status)) return;
        a.status = "CANCELLED";
        a.slot.booked = false;
        slots.save(a.slot);
        appointments.save(a);
    }

    @Transactional(readOnly = true)
    public List<AppointmentDto> mine(AppUser user) {
        return appointments.findByUserIdOrderByCreatedAtDesc(user.id).stream().map(this::toDto).toList();
    }

    @Transactional(readOnly = true)
    public List<AppointmentDto> forDoctor(Long doctorId) {
        return appointments.findByDoctorIdAndStatusOrderBySlot_StartTimeAsc(doctorId, "BOOKED").stream()
                .map(this::toDto).toList();
    }

    private AppointmentDto toDto(Appointment a) {
        Doctor d = a.doctor;
        return new AppointmentDto(a.id, d.id, d.name, d.specialty, d.clinic, d.address, d.phone,
                a.slot.startTime, a.status, a.note, a.user.name);
    }
}
