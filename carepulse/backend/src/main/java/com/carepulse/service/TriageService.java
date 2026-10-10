package com.carepulse.service;

import com.carepulse.dto.Dtos.ConditionMatch;
import com.carepulse.dto.Dtos.TriageReq;
import com.carepulse.dto.Dtos.TriageRes;
import com.carepulse.model.AppUser;
import com.carepulse.model.Assessment;
import com.carepulse.repo.AssessmentRepository;
import org.springframework.stereotype.Service;

import java.util.*;

/**
 * Rule-based symptom triage. It never diagnoses: it estimates urgency, suggests a specialty
 * and lists COMMON causes with home-care and warning signs. Red flags always win.
 */
@Service
public class TriageService {
    static final String GP = "General Physician";
    private static final String DISCLAIMER = "This is general health information, not a diagnosis or a prescription. "
            + "It cannot replace a doctor. If you feel very unwell, go to a hospital.";
    private static final String DISCLAIMER_HI = "यह सिर्फ़ सामान्य स्वास्थ्य जानकारी है, बीमारी की पहचान या दवा की सलाह नहीं। "
            + "यह डॉक्टर की जगह नहीं ले सकती। ज़्यादा तबीयत खराब हो तो अस्पताल जाएँ।";
    private static final List<String> RED_TEXT = List.of("chest pain", "heart attack", "can't breathe", "cannot breathe",
            "not breathing", "saans nahi", "seene me dard", "seene mein dard", "unconscious", "behosh", "seizure",
            "daura pada", "suicide", "kill myself", "khudkushi", "overdose", "poison", "zehar", "snake bite",
            "saanp ne kaata", "heavy bleeding", "bleeding wont stop", "stroke", "lakwa");
    private static final List<String> SELF_HARM_TEXT = List.of("suicide", "kill myself", "khudkushi", "jeena nahi",
            "harm myself", "khud ko nuksan");
    private static final List<String> HELPLINES = List.of("112 – National emergency number",
            "108 – Ambulance (most states)", "14416 – Tele-MANAS, free mental-health helpline (24x7)");

    private final Catalog catalog;
    private final GeminiService gemini;
    private final AssessmentRepository assessments;

    public TriageService(Catalog catalog, GeminiService gemini, AssessmentRepository assessments) {
        this.catalog = catalog;
        this.gemini = gemini;
        this.assessments = assessments;
    }

    public TriageRes assess(TriageReq req, AppUser user) {
        String text = req.text() == null ? "" : req.text().toLowerCase(Locale.ROOT).replace("’", "'");
        Set<String> ids = new LinkedHashSet<>();
        if (req.symptomIds() != null) {
            for (String id : req.symptomIds()) if (catalog.symptom(id) != null) ids.add(id);
        }
        for (Catalog.SymptomDef s : catalog.symptoms()) {
            for (String k : s.keywords()) {
                if (text.contains(k)) { ids.add(s.id()); break; }
            }
        }
        boolean textRed = RED_TEXT.stream().anyMatch(text::contains);
        if (ids.isEmpty() && !textRed) {
            throw new ApiException(400, "Select at least one symptom or describe how you feel.");
        }

        boolean redFlag = textRed;
        boolean selfHarm = SELF_HARM_TEXT.stream().anyMatch(text::contains);
        int score = 0, max = 0;
        Map<String, Integer> specialtyScore = new HashMap<>();
        List<String> labels = new ArrayList<>();
        String redSpecialty = null;
        for (String id : ids) {
            Catalog.SymptomDef s = catalog.symptom(id);
            labels.add(s.en());
            score += s.weight();
            max = Math.max(max, s.weight());
            specialtyScore.merge(s.specialty(), s.weight() * (GP.equals(s.specialty()) ? 1 : 2), Integer::sum);
            if (s.redFlag()) {
                redFlag = true;
                if (redSpecialty == null) redSpecialty = s.specialty();
                if ("self_harm".equals(s.id())) selfHarm = true;
            }
        }
        if (req.days() != null) score += req.days() > 7 ? 2 : (req.days() > 3 ? 1 : 0);
        if (req.age() != null && (req.age() < 5 || req.age() > 65)) score += 1;

        String level = redFlag ? "EMERGENCY" : (max >= 4 || score >= 9) ? "HIGH" : score >= 4 ? "MODERATE" : "LOW";

        String specialty = specialtyScore.entrySet().stream()
                .max(Map.Entry.comparingByValue()).map(Map.Entry::getKey).orElse(GP);
        if (redSpecialty != null) specialty = redSpecialty;
        if (req.age() != null && req.age() < 12 && GP.equals(specialty)) specialty = "Pediatrician";

        List<ConditionMatch> matches = matchConditions(ids);

        String title, titleHi, summary;
        List<String> advice = new ArrayList<>();
        List<String> helplines = new ArrayList<>();
        switch (level) {
            case "EMERGENCY" -> {
                title = "Get emergency help now";
                titleHi = "तुरंत आपातकालीन मदद लें";
                summary = "What you described can be a medical emergency. Please do not wait for an appointment.";
                advice.add("Call 112 (or ambulance 108) right now.");
                advice.add("Do not drive yourself. Ask someone nearby to stay with you.");
                advice.add("Go to the nearest hospital emergency department.");
                if (selfHarm) advice.add("You are not alone. Talk to someone now: call Tele-MANAS 14416 (free, 24x7) or a person you trust.");
                helplines.addAll(HELPLINES);
                matches = List.of();
            }
            case "HIGH" -> {
                title = "See a doctor today";
                titleHi = "आज ही डॉक्टर को दिखाएँ";
                summary = "Your symptoms need a doctor's check-up soon. A " + specialty + " is the best fit.";
                advice.add("Visit a doctor or nearby hospital today.");
                advice.add("Take someone with you and carry your old reports.");
                advice.add("Go to the emergency department if it gets worse quickly.");
            }
            case "MODERATE" -> {
                title = "See a doctor in 1–2 days";
                titleHi = "1–2 दिन में डॉक्टर को दिखाएँ";
                summary = "This should be checked if it does not settle soon. A " + specialty + " is the best fit.";
                advice.add("Book a visit in the next 1–2 days.");
                advice.add("Rest, drink enough water and eat light food meanwhile.");
                advice.add("Go earlier if the symptoms get worse or new ones appear.");
            }
            default -> {
                title = "You can likely manage this at home";
                titleHi = "आप इसे घर पर संभाल सकते हैं";
                summary = "These look mild. Try the home-care steps below and watch for changes.";
                advice.add("Rest, drink enough water and eat light food.");
                advice.add("See a " + specialty + " if there is no improvement in 3–5 days.");
                advice.add("See a doctor sooner if a warning sign listed below appears.");
            }
        }

        String aiNote = "EMERGENCY".equals(level) ? null
                : gemini.note(String.join(", ", labels) + ". " + (req.text() == null ? "" : req.text()), level, specialty, req.lang());

        boolean saved = false;
        if (user != null) {
            Assessment a = new Assessment();
            a.user = user;
            a.symptoms = clip(String.join(", ", labels), 1900);
            a.riskLevel = level;
            a.specialty = specialty;
            a.summary = clip(title + ". " + summary, 1900);
            assessments.save(a);
            saved = true;
        }
        return new TriageRes(level, title, titleHi, summary, advice, specialty, matches, labels, helplines,
                aiNote, DISCLAIMER, DISCLAIMER_HI, saved, selfHarm);
    }

    private List<ConditionMatch> matchConditions(Set<String> ids) {
        record Scored(Catalog.ConditionDef c, int hit) {}
        List<Scored> scored = new ArrayList<>();
        for (Catalog.ConditionDef c : catalog.conditions()) {
            int hit = 0;
            for (String s : c.symptoms()) if (ids.contains(s)) hit++;
            if (hit > 0) scored.add(new Scored(c, hit));
        }
        scored.sort(Comparator.comparingInt((Scored s) -> s.hit()).reversed()
                .thenComparingDouble(s -> -((double) s.hit() / s.c().symptoms().size())));
        List<ConditionMatch> out = new ArrayList<>();
        for (Scored s : scored.subList(0, Math.min(3, scored.size()))) {
            Catalog.ConditionDef c = s.c();
            out.add(new ConditionMatch(c.id(), c.name(), c.hi(), c.about(), c.homeCare(), c.seeDoctorIf(),
                    c.specialty(), s.hit()));
        }
        return out;
    }

    private static String clip(String s, int n) { return s.length() <= n ? s : s.substring(0, n); }
}
