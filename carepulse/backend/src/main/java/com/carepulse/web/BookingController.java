package com.carepulse.web;

import com.carepulse.dto.Dtos.*;
import com.carepulse.model.AppUser;
import com.carepulse.repo.AssessmentRepository;
import com.carepulse.repo.UserRepository;
import com.carepulse.service.ApiException;
import com.carepulse.service.BookingService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class BookingController {
    private final BookingService booking;
    private final UserRepository users;
    private final AssessmentRepository assessments;

    public BookingController(BookingService booking, UserRepository users, AssessmentRepository assessments) {
        this.booking = booking;
        this.users = users;
        this.assessments = assessments;
    }

    @PostMapping("/appointments")
    @ResponseStatus(HttpStatus.CREATED)
    public AppointmentDto book(@Valid @RequestBody BookReq req, Authentication auth) {
        return booking.book(me(auth), req.slotId(), req.note());
    }

    @GetMapping("/appointments/mine")
    public List<AppointmentDto> mine(Authentication auth) {
        return booking.mine(me(auth));
    }

    @DeleteMapping("/appointments/{id}")
    public void cancel(@PathVariable Long id, Authentication auth) {
        booking.cancel(me(auth), id);
    }

    @GetMapping("/records/assessments")
    public List<AssessmentDto> records(Authentication auth) {
        return assessments.findByUserIdOrderByCreatedAtDesc(me(auth).id).stream()
                .map(a -> new AssessmentDto(a.id, a.symptoms, a.riskLevel, a.specialty, a.summary, a.createdAt)).toList();
    }

    /** Doctor accounts only (enforced in SecurityConfig): upcoming booked patients. */
    @GetMapping("/doctor/appointments")
    public List<AppointmentDto> forDoctor(Authentication auth) {
        AppUser u = me(auth);
        if (u.doctorId == null) throw new ApiException(403, "This account is not linked to a doctor profile.");
        return booking.forDoctor(u.doctorId);
    }

    private AppUser me(Authentication auth) {
        return users.findByEmail(auth.getName()).orElseThrow(() -> new ApiException(401, "Please sign in"));
    }
}
