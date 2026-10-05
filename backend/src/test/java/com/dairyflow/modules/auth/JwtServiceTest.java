package com.dairyflow.modules.auth;

import com.dairyflow.security.JwtService;
import com.dairyflow.security.UserPrincipal;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

class JwtServiceTest {

    private JwtService jwtService;
    private final String testSecret = "404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970";

    @BeforeEach
    void setUp() {
        jwtService = new JwtService();
        ReflectionTestUtils.setField(jwtService, "jwtSecret", testSecret);
        ReflectionTestUtils.setField(jwtService, "jwtExpirationMs", 3600000L); // 1 hour
        ReflectionTestUtils.setField(jwtService, "refreshExpirationMs", 604800000L); // 7 days
    }

    @Test
    @DisplayName("Should generate and validate access token with claims")
    void testGenerateAndValidateAccessToken() {
        UUID userId = UUID.randomUUID();
        UserPrincipal principal = UserPrincipal.builder()
                .id(userId)
                .username("testmanager")
                .email("manager@dairyflow.com")
                .password("hash")
                .authorities(List.of(
                        new SimpleGrantedAuthority("ROLE_MANAGER"),
                        new SimpleGrantedAuthority("COW_VIEW"),
                        new SimpleGrantedAuthority("COW_CREATE")
                ))
                .active(true)
                .build();

        String token = jwtService.generateToken(principal);
        assertNotNull(token);
        assertTrue(jwtService.validateToken(token));
        assertTrue(jwtService.validateAccessToken(token));
        assertFalse(jwtService.isRefreshToken(token));

        assertEquals(userId, jwtService.extractUserId(token));
        assertEquals("testmanager", jwtService.extractUsername(token));
    }

    @Test
    @DisplayName("Should generate and validate refresh token with REFRESH token type")
    void testGenerateAndValidateRefreshToken() {
        UUID userId = UUID.randomUUID();
        UserPrincipal principal = UserPrincipal.builder()
                .id(userId)
                .username("testworker")
                .email("worker@dairyflow.com")
                .password("hash")
                .authorities(List.of(new SimpleGrantedAuthority("ROLE_WORKER")))
                .active(true)
                .build();

        String refreshToken = jwtService.generateRefreshToken(principal);
        assertNotNull(refreshToken);
        assertTrue(jwtService.validateToken(refreshToken));
        assertTrue(jwtService.validateRefreshToken(refreshToken));
        assertTrue(jwtService.isRefreshToken(refreshToken));
        assertFalse(jwtService.validateAccessToken(refreshToken));

        assertEquals(userId, jwtService.extractUserId(refreshToken));
    }

    @Test
    @DisplayName("Should reject malformed or tampered token")
    void testRejectInvalidToken() {
        assertFalse(jwtService.validateToken("invalid.token.signature"));
        assertFalse(jwtService.validateAccessToken("invalid.token.signature"));
        assertFalse(jwtService.validateRefreshToken("invalid.token.signature"));
    }

    @Test
    @DisplayName("Should hash token deterministically using SHA-256")
    void testHashTokenDeterministic() {
        String token = "sample-secret-jwt-token-string-12345";
        String hash1 = JwtService.hashToken(token);
        String hash2 = JwtService.hashToken(token);

        assertNotNull(hash1);
        assertEquals(hash1, hash2);
        assertEquals(64, hash1.length()); // SHA-256 hex is 64 characters
    }
}
