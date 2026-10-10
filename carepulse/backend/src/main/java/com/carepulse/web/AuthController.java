package com.carepulse.web;

import com.carepulse.dto.Dtos.*;
import com.carepulse.model.AppUser;
import com.carepulse.model.Role;
import com.carepulse.repo.UserRepository;
import com.carepulse.security.JwtService;
import com.carepulse.service.ApiException;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Locale;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final UserRepository users;
    private final PasswordEncoder encoder;
    private final JwtService jwt;

    public AuthController(UserRepository users, PasswordEncoder encoder, JwtService jwt) {
        this.users = users;
        this.encoder = encoder;
        this.jwt = jwt;
    }

    /** Public sign-up only ever creates PATIENT accounts. */
    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public AuthRes register(@Valid @RequestBody RegisterReq req) {
        String email = req.email().trim().toLowerCase(Locale.ROOT);
        if (users.existsByEmail(email)) throw new ApiException(409, "An account with this email already exists.");
        AppUser u = new AppUser();
        u.name = req.name().trim();
        u.email = email;
        u.passwordHash = encoder.encode(req.password());
        u.role = Role.PATIENT;
        u.language = normLang(req.language());
        users.save(u);
        return res(u);
    }

    @PostMapping("/login")
    public AuthRes login(@Valid @RequestBody LoginReq req) {
        AppUser u = users.findByEmail(req.email().trim().toLowerCase(Locale.ROOT))
                .orElseThrow(() -> new ApiException(401, "Wrong email or password."));
        if (!encoder.matches(req.password(), u.passwordHash)) throw new ApiException(401, "Wrong email or password.");
        return res(u);
    }

    @GetMapping("/me")
    public AuthRes me(Authentication auth) {
        AppUser u = users.findByEmail(auth.getName()).orElseThrow(() -> new ApiException(401, "Please sign in"));
        return res(u);
    }

    @PutMapping("/language")
    public AuthRes language(@Valid @RequestBody LanguageReq req, Authentication auth) {
        AppUser u = users.findByEmail(auth.getName()).orElseThrow(() -> new ApiException(401, "Please sign in"));
        u.language = normLang(req.language());
        users.save(u);
        return res(u);
    }

    private static String normLang(String l) {
        String v = l == null ? "EN" : l.trim().toUpperCase(Locale.ROOT);
        return java.util.Set.of("HI", "TA", "TE", "KN", "ML", "MR", "GU", "BN", "PA").contains(v) ? v : "EN"; // old HINGLISH becomes EN
    }

    private AuthRes res(AppUser u) {
        return new AuthRes(jwt.create(u), u.name, u.email, u.role.name(), u.language == null ? "EN" : u.language);
    }
}
