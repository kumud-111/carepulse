package com.carepulse.dto;

import jakarta.validation.constraints.*;
import java.time.LocalDateTime;
import java.util.List;

public final class Dtos {
    private Dtos() {}

    public record RegisterReq(@NotBlank @Size(max = 80) String name,
                              @NotBlank @Email String email,
                              @NotBlank @Size(min = 6, max = 100) String password,
                              String language) {}
    public record LanguageReq(@NotBlank String language) {}
    public record LoginReq(@NotBlank String email, @NotBlank String password) {}
    public record AuthRes(String token, String name, String email, String role, String language) {}

    public record DoctorDto(Long id, String name, String specialty, String state, String city, String area, String address,
                            String phone, String clinic, int fee, double rating, int experienceYears,
                            String qualification, String languages, String about) {}
    public record CityDto(String city, List<String> areas) {}
    public record StateDto(String state, List<CityDto> cities) {}
    public record MetaDto(List<StateDto> states, List<String> specialties) {}
    public record SlotDto(Long id, LocalDateTime startTime, boolean booked) {}

    public record BookReq(@NotNull Long slotId, @Size(max = 400) String note) {}
    public record AppointmentDto(Long id, Long doctorId, String doctorName, String specialty, String clinic,
                                 String address, String phone, LocalDateTime startTime, String status,
                                 String note, String patientName) {}

    public record TriageReq(List<String> symptomIds, @Size(max = 1000) String text, Integer age, Integer days, String lang) {}
    public record ConditionMatch(String id, String name, String hi, String about, List<String> homeCare,
                                 List<String> seeDoctorIf, String specialty, int matched) {}
    public record TriageRes(String level, String title, String titleHi, String summary, List<String> advice,
                            String specialty, List<ConditionMatch> matches, List<String> symptomLabels,
                            List<String> helplines, String aiNote, String disclaimer, String disclaimerHi,
                            boolean saved, boolean selfHarm) {}
    public record AssessmentDto(Long id, String symptoms, String riskLevel, String specialty, String summary,
                                LocalDateTime createdAt) {}
}
