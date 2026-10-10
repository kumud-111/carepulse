package com.carepulse.repo;

import com.carepulse.model.Slot;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDateTime;
import java.util.List;

public interface SlotRepository extends JpaRepository<Slot, Long> {
    List<Slot> findByDoctorIdAndStartTimeAfterOrderByStartTime(Long doctorId, LocalDateTime after);
    boolean existsByDoctorIdAndStartTimeAfter(Long doctorId, LocalDateTime after);
}
