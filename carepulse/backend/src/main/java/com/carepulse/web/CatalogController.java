package com.carepulse.web;

import com.carepulse.dto.Dtos.TriageReq;
import com.carepulse.dto.Dtos.TriageRes;
import com.carepulse.model.AppUser;
import com.carepulse.repo.UserRepository;
import com.carepulse.service.Catalog;
import com.carepulse.service.TriageService;
import jakarta.validation.Valid;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class CatalogController {
    private final Catalog catalog;
    private final TriageService triage;
    private final UserRepository users;

    public CatalogController(Catalog catalog, TriageService triage, UserRepository users) {
        this.catalog = catalog;
        this.triage = triage;
        this.users = users;
    }

    @GetMapping("/symptoms")
    public List<Catalog.SymptomDef> symptoms() { return catalog.symptoms(); }

    @GetMapping("/conditions")
    public List<Catalog.ConditionDef> conditions() { return catalog.conditions(); }

    /** Open to everyone; results are saved to "My records" only when the patient is signed in. */
    @PostMapping("/triage")
    public TriageRes triage(@Valid @RequestBody TriageReq req, Authentication auth) {
        AppUser user = null;
        if (auth instanceof UsernamePasswordAuthenticationToken) {
            user = users.findByEmail(auth.getName()).orElse(null);
        }
        return triage.assess(req, user);
    }
}
