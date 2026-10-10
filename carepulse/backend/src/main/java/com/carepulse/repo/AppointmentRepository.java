package com.carepulse.repo;

import com.carepulse.model.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    List<Appointment> findByUserIdOrderByCreatedAtDesc(Long userId);
    List<Appointment> findByDoctorIdAndStatusOrderBySlot_StartTimeAsc(Long doctorId, String status);
}
