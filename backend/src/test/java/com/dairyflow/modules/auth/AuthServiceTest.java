package com.dairyflow.modules.auth;

import com.dairyflow.common.audit.AuditService;
import com.dairyflow.common.exception.BadRequestException;
import com.dairyflow.common.exception.UnauthorizedException;
import com.dairyflow.modules.auth.dto.*;
import com.dairyflow.modules.auth.entity.PasswordResetToken;
import com.dairyflow.modules.auth.entity.RefreshToken;
import com.dairyflow.modules.auth.repository.PasswordResetTokenRepository;
import com.dairyflow.modules.auth.repository.RefreshTokenRepository;
import com.dairyflow.modules.auth.service.AuthServiceImpl;
import com.dairyflow.modules.auth.service.PasswordResetNotificationService;
import com.dairyflow.modules.users.entity.RoleEntity;
import com.dairyflow.modules.users.entity.User;
import com.dairyflow.modules.users.repository.RoleRepository;
import com.dairyflow.modules.users.repository.UserRepository;
import com.dairyflow.security.JwtService;
import com.dairyflow.security.UserPrincipal;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.Instant;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private JwtService jwtService;

    @Mock
    private AuditService auditService;

    @Mock
    private UserRepository userRepository;

    @Mock
    private RoleRepository roleRepository;

    @Mock
    private RefreshTokenRepository refreshTokenRepository;

    @Mock
    private PasswordResetTokenRepository passwordResetTokenRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private PasswordResetNotificationService passwordResetNotificationService;

    @InjectMocks
    private AuthServiceImpl authService;

    private User testUser;
    private UserPrincipal testPrincipal;

    @BeforeEach
    void setUp() {
        RoleEntity ownerRole = RoleEntity.builder()
                .id(1L)
                .name("ROLE_OWNER")
                .permissions(new HashSet<>())
                .build();

        testUser = User.builder()
                .id(UUID.randomUUID())
                .username("owner")
                .email("owner@dairyflow.com")
                .passwordHash("encodedPassword")
                .firstName("Elena")
                .lastName("Vance")
                .status("ACTIVE")
                .roles(new HashSet<>(Collections.singletonList(ownerRole)))
                .build();

        testPrincipal = UserPrincipal.create(testUser);
    }

    @Test
    @DisplayName("Should successfully authenticate user and return tokens")
    void testLoginSuccess() {
        LoginRequest request = LoginRequest.builder()
                .username("owner@dairyflow.com")
                .password("password")
                .build();

        Authentication auth = mock(Authentication.class);
        when(auth.getPrincipal()).thenReturn(testPrincipal);
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class))).thenReturn(auth);
        when(userRepository.findById(testUser.getId())).thenReturn(Optional.of(testUser));
        when(jwtService.generateToken(testPrincipal)).thenReturn("mockAccessToken");
        when(jwtService.generateRefreshToken(testPrincipal)).thenReturn("mockRefreshToken");
        when(jwtService.getJwtExpirationMs()).thenReturn(86400000L);
        when(jwtService.getRefreshExpirationMs()).thenReturn(604800000L);

        AuthResponse response = authService.login(request);

        assertNotNull(response);
        assertEquals("mockAccessToken", response.getAccessToken());
        assertEquals("mockRefreshToken", response.getRefreshToken());
        assertEquals("owner", response.getUsername());
        assertEquals("owner@dairyflow.com", response.getEmail());

        verify(refreshTokenRepository, times(1)).save(any(RefreshToken.class));
        verify(auditService, times(1)).logAction(eq("User"), any(), eq("LOGIN_SUCCESS"), any(), any(), any());
    }

    @Test
    @DisplayName("Should rotate refresh token and issue new token pair")
    void testRefreshTokenSuccess() {
        String oldRefreshToken = "valid-old-refresh-token";
        String tokenHash = JwtService.hashToken(oldRefreshToken);

        RefreshToken existingEntity = RefreshToken.builder()
                .id(UUID.randomUUID())
                .user(testUser)
                .tokenHash(tokenHash)
                .expiresAt(Instant.now().plusSeconds(3600))
                .revoked(false)
                .build();

        when(jwtService.validateRefreshToken(oldRefreshToken)).thenReturn(true);
        when(refreshTokenRepository.findByTokenHash(tokenHash)).thenReturn(Optional.of(existingEntity));
        when(jwtService.generateToken(any())).thenReturn("newAccessToken");
        when(jwtService.generateRefreshToken(any())).thenReturn("newRefreshToken");
        when(jwtService.getJwtExpirationMs()).thenReturn(86400000L);
        when(jwtService.getRefreshExpirationMs()).thenReturn(604800000L);

        RefreshTokenRequest request = new RefreshTokenRequest(oldRefreshToken);
        AuthResponse response = authService.refreshToken(request);

        assertNotNull(response);
        assertEquals("newAccessToken", response.getAccessToken());
        assertEquals("newRefreshToken", response.getRefreshToken());
        assertTrue(existingEntity.isRevoked());

        verify(refreshTokenRepository, times(1)).save(existingEntity);
        verify(refreshTokenRepository, times(1)).save(argThat(RefreshToken::isActive));
    }

    @Test
    @DisplayName("Should trigger reuse protection and revoke all sessions when revoked refresh token is presented")
    void testRefreshTokenReuseProtection() {
        String reusedToken = "revoked-compromised-token";
        String tokenHash = JwtService.hashToken(reusedToken);

        RefreshToken revokedEntity = RefreshToken.builder()
                .id(UUID.randomUUID())
                .user(testUser)
                .tokenHash(tokenHash)
                .expiresAt(Instant.now().plusSeconds(3600))
                .revoked(true) // Already revoked
                .build();

        when(jwtService.validateRefreshToken(reusedToken)).thenReturn(true);
        when(refreshTokenRepository.findByTokenHash(tokenHash)).thenReturn(Optional.of(revokedEntity));

        RefreshTokenRequest request = new RefreshTokenRequest(reusedToken);

        assertThrows(UnauthorizedException.class, () -> authService.refreshToken(request));

        // Must revoke all tokens for this user
        verify(refreshTokenRepository, times(1)).revokeAllUserTokens(testUser);
        verify(auditService, times(1)).logAction(eq("User"), any(), eq("REFRESH_TOKEN_REUSE_DETECTED"), any(), any(), any());
    }

    @Test
    @DisplayName("Should silently handle forgot-password for non-existent email without error")
    void testForgotPasswordNonExistentEmail() {
        when(userRepository.findByEmail("unknown@dairyflow.com")).thenReturn(Optional.empty());

        ForgotPasswordRequest request = new ForgotPasswordRequest("unknown@dairyflow.com");
        assertDoesNotThrow(() -> authService.forgotPassword(request));

        verify(passwordResetTokenRepository, never()).save(any());
        verify(passwordResetNotificationService, never()).sendPasswordResetEmail(any(), any());
    }

    @Test
    @DisplayName("Should generate reset token and notify user for valid forgot-password request")
    void testForgotPasswordExistingUser() {
        when(userRepository.findByEmail("owner@dairyflow.com")).thenReturn(Optional.of(testUser));

        ForgotPasswordRequest request = new ForgotPasswordRequest("owner@dairyflow.com");
        authService.forgotPassword(request);

        verify(passwordResetTokenRepository, times(1)).deleteByUser(testUser);
        verify(passwordResetTokenRepository, times(1)).save(any(PasswordResetToken.class));
        verify(passwordResetNotificationService, times(1)).sendPasswordResetEmail(eq("owner@dairyflow.com"), any());
    }

    @Test
    @DisplayName("Should reset password and revoke active sessions when valid reset token is submitted")
    void testResetPasswordSuccess() {
        String rawToken = "valid-reset-token-123";
        String tokenHash = JwtService.hashToken(rawToken);

        PasswordResetToken resetEntity = PasswordResetToken.builder()
                .id(UUID.randomUUID())
                .user(testUser)
                .tokenHash(tokenHash)
                .expiresAt(Instant.now().plusSeconds(900))
                .used(false)
                .build();

        when(passwordResetTokenRepository.findByTokenHash(tokenHash)).thenReturn(Optional.of(resetEntity));
        when(passwordEncoder.encode("newPassword123")).thenReturn("newHashedPassword");

        ResetPasswordRequest request = new ResetPasswordRequest(rawToken, "newPassword123");
        authService.resetPassword(request);

        assertTrue(resetEntity.isUsed());
        assertEquals("newHashedPassword", testUser.getPasswordHash());

        verify(userRepository, times(1)).save(testUser);
        verify(refreshTokenRepository, times(1)).revokeAllUserTokens(testUser);
        verify(passwordResetTokenRepository, times(1)).save(resetEntity);
    }
}
