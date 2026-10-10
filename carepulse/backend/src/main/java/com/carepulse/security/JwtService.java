package com.carepulse.security;

import com.carepulse.model.AppUser;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Service
public class JwtService {
    private final SecretKey key;
    private final long hours;

    public JwtService(@Value("${carepulse.jwt-secret}") String secret,
                      @Value("${carepulse.jwt-hours}") long hours) {
        this.key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        this.hours = hours;
    }

    public String create(AppUser u) {
        Date now = new Date();
        return Jwts.builder()
                .subject(u.email)
                .claim("role", u.role.name())
                .issuedAt(now)
                .expiration(new Date(now.getTime() + hours * 3600_000L))
                .signWith(key)
                .compact();
    }

    /** Returns the email inside a valid token, or null if the token is invalid or expired. */
    public String emailFrom(String token) {
        try {
            return Jwts.parser().verifyWith(key).build().parseSignedClaims(token).getPayload().getSubject();
        } catch (JwtException | IllegalArgumentException e) {
            return null;
        }
    }
}
