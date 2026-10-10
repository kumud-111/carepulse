package com.carepulse.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.io.InputStream;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/** Symptom and condition knowledge base, loaded once from JSON (single source of truth for the app). */
@Component
public class Catalog {
    public record SymptomDef(String id, String region, String en, String hi, String hing, int weight, String specialty,
                             List<String> keywords, boolean redFlag) {}

    public record ConditionDef(String id, String name, String hi, String hing, List<String> symptoms, String about,
                               List<String> homeCare, List<String> seeDoctorIf, String specialty,
                               String commonness) {}

    private final List<SymptomDef> symptoms;
    private final List<ConditionDef> conditions;
    private final Map<String, SymptomDef> byId = new HashMap<>();

    public Catalog(ObjectMapper mapper) throws IOException {
        try (InputStream a = new ClassPathResource("data/symptoms.json").getInputStream();
             InputStream b = new ClassPathResource("data/conditions.json").getInputStream()) {
            symptoms = mapper.readValue(a, new TypeReference<List<SymptomDef>>() {});
            conditions = mapper.readValue(b, new TypeReference<List<ConditionDef>>() {});
        }
        for (SymptomDef s : symptoms) byId.put(s.id(), s);
    }

    public List<SymptomDef> symptoms() { return symptoms; }
    public List<ConditionDef> conditions() { return conditions; }
    public SymptomDef symptom(String id) { return byId.get(id); }
}
