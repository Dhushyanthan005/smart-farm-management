package com.dairyflow.modules.auth.service;

import com.dairyflow.common.audit.AuditService;
import com.dairyflow.common.exception.BadRequestException;
import com.dairyflow.common.exception.ConflictException;
import com.dairyflow.common.exception.UnauthorizedException;
import com.dairyflow.modules.auth.dto.*;
import com.dairyflow.modules.auth.entity.PasswordResetToken;
import com.dairyflow.modules.auth.entity.RefreshToken;
import com.dairyflow.modules.auth.repository.PasswordResetTokenRepository;
import com.dairyflow.modules.auth.repository.RefreshTokenRepository;
import com.dairyflow.modules.users.entity.RoleEntity;
import com.dairyflow.modules.users.entity.User;
import com.dairyflow.modules.users.repository.RoleRepository;
import com.dairyflow.modules.users.repository.UserRepository;
import com.dairyflow.security.JwtService;
import com.dairyflow.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.*;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final AuditService auditService;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final PasswordResetTokenRepository passwordResetTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final PasswordResetNotificationService passwordResetNotificationService;

    @Override
    @Transactional
    public AuthResponse login(LoginRequest request) {
        String identifier = request.getLoginIdentifier();

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(identifier, request.getPassword())
        );

        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        User user = userRepository.findById(userPrincipal.getId())
                .orElseThrow(() -> new UnauthorizedException("User account not found"));

        if (!"ACTIVE".equalsIgnoreCase(user.getStatus())) {
            throw new UnauthorizedException("User account is not active");
        }

        String accessToken = jwtService.generateToken(userPrincipal);
        String refreshToken = jwtService.generateRefreshToken(userPrincipal);

        // Persist hashed refresh token
        String tokenHash = JwtService.hashToken(refreshToken);
        RefreshToken refreshTokenEntity = RefreshToken.builder()
                .user(user)
                .tokenHash(tokenHash)
                .expiresAt(Instant.now().plusMillis(jwtService.getRefreshExpirationMs()))
                .revoked(false)
                .build();
        refreshTokenRepository.save(refreshTokenEntity);

        auditService.logAction("User", user.getId().toString(), "LOGIN_SUCCESS",
                user.getUsername(), "Successful user login", null);

        UserProfileResponse profile = buildUserProfile(user, userPrincipal);

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .tokenType("Bearer")
                .expiresIn(jwtService.getJwtExpirationMs() / 1000)
                .userId(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .roles(userPrincipal.getRoles())
                .permissions(userPrincipal.getPermissions())
                .user(profile)
                .build();
    }

    @Override
    @Transactional
    public AuthResponse refreshToken(RefreshTokenRequest request) {
        String rawToken = request.getRefreshToken();
        if (!jwtService.validateRefreshToken(rawToken)) {
            throw new UnauthorizedException("Invalid or expired refresh token");
        }

        String tokenHash = JwtService.hashToken(rawToken);
        RefreshToken existingToken = refreshTokenRepository.findByTokenHash(tokenHash)
                .orElseThrow(() -> new UnauthorizedException("Refresh token session not found"));

        User user = existingToken.getUser();

        // Reuse protection: if already revoked, compromise detected -> revoke all sessions
        if (existingToken.isRevoked()) {
            refreshTokenRepository.revokeAllUserTokens(user);
            auditService.logAction("User", user.getId().toString(), "REFRESH_TOKEN_REUSE_DETECTED",
                    user.getUsername(), "Compromised refresh token reuse attempt detected. All sessions revoked.", null);
            throw new UnauthorizedException("Revoked refresh token presented. All active sessions have been terminated for security.");
        }

        if (existingToken.isExpired()) {
            throw new UnauthorizedException("Refresh token has expired. Please sign in again.");
        }

        if (!"ACTIVE".equalsIgnoreCase(user.getStatus())) {
            throw new UnauthorizedException("User account is no longer active");
        }

        // Revoke the old refresh token
        existingToken.setRevoked(true);
        existingToken.setRevokedAt(Instant.now());

        // Issue new pair
        UserPrincipal userPrincipal = UserPrincipal.create(user);
        String newAccessToken = jwtService.generateToken(userPrincipal);
        String newRefreshToken = jwtService.generateRefreshToken(userPrincipal);
        String newTokenHash = JwtService.hashToken(newRefreshToken);

        existingToken.setReplacedByTokenHash(newTokenHash);
        refreshTokenRepository.save(existingToken);

        RefreshToken newTokenEntity = RefreshToken.builder()
                .user(user)
                .tokenHash(newTokenHash)
                .expiresAt(Instant.now().plusMillis(jwtService.getRefreshExpirationMs()))
                .revoked(false)
                .build();
        refreshTokenRepository.save(newTokenEntity);

        auditService.logAction("User", user.getId().toString(), "TOKEN_REFRESH",
                user.getUsername(), "Access token refreshed with token rotation", null);

        UserProfileResponse profile = buildUserProfile(user, userPrincipal);

        return AuthResponse.builder()
                .accessToken(newAccessToken)
                .refreshToken(newRefreshToken)
                .tokenType("Bearer")
                .expiresIn(jwtService.getJwtExpirationMs() / 1000)
                .userId(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .roles(userPrincipal.getRoles())
                .permissions(userPrincipal.getPermissions())
                .user(profile)
                .build();
    }

    @Override
    @Transactional
    public void logout(String refreshToken) {
        String username = "ANONYMOUS";
        String userId = null;

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof UserPrincipal principal) {
            username = principal.getUsername();
            userId = principal.getId().toString();
        }

        if (refreshToken != null && !refreshToken.isBlank()) {
            String tokenHash = JwtService.hashToken(refreshToken);
            refreshTokenRepository.findByTokenHash(tokenHash).ifPresent(token -> {
                token.setRevoked(true);
                token.setRevokedAt(Instant.now());
                refreshTokenRepository.save(token);
            });
        }

        if (userId != null) {
            auditService.logAction("User", userId, "LOGOUT", username, "User logged out successfully", null);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public UserProfileResponse getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !(authentication.getPrincipal() instanceof UserPrincipal principal)) {
            throw new UnauthorizedException("User is not authenticated");
        }

        User user = userRepository.findById(principal.getId())
                .orElseThrow(() -> new UnauthorizedException("User profile not found"));

        return buildUserProfile(user, principal);
    }

    @Override
    @Transactional
    public void changePassword(ChangePasswordRequest request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !(authentication.getPrincipal() instanceof UserPrincipal principal)) {
            throw new UnauthorizedException("User is not authenticated");
        }

        User user = userRepository.findById(principal.getId())
                .orElseThrow(() -> new UnauthorizedException("User not found"));

        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPasswordHash())) {
            throw new BadRequestException("Current password does not match");
        }

        if (passwordEncoder.matches(request.getNewPassword(), user.getPasswordHash())) {
            throw new BadRequestException("New password cannot be identical to the current password");
        }

        user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        // Revoke all existing sessions for security
        refreshTokenRepository.revokeAllUserTokens(user);

        auditService.logAction("User", user.getId().toString(), "PASSWORD_CHANGED",
                user.getUsername(), "Password changed successfully; active sessions revoked", null);
    }

    @Override
    @Transactional
    public void forgotPassword(ForgotPasswordRequest request) {
        String email = request.getEmail().trim().toLowerCase();
        Optional<User> optionalUser = userRepository.findByEmail(email);

        // Security best practice: do not leak whether user exists
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            if ("ACTIVE".equalsIgnoreCase(user.getStatus())) {
                // Delete previous reset tokens for this user
                passwordResetTokenRepository.deleteByUser(user);

                String rawToken = UUID.randomUUID().toString();
                String tokenHash = JwtService.hashToken(rawToken);

                PasswordResetToken resetToken = PasswordResetToken.builder()
                        .user(user)
                        .tokenHash(tokenHash)
                        .expiresAt(Instant.now().plusSeconds(900)) // 15 minutes
                        .used(false)
                        .build();
                passwordResetTokenRepository.save(resetToken);

                passwordResetNotificationService.sendPasswordResetEmail(user.getEmail(), rawToken);

                auditService.logAction("User", user.getId().toString(), "PASSWORD_RESET_REQUESTED",
                        user.getUsername(), "Password reset instructions dispatched", null);
            }
        } else {
            log.info("Password reset requested for non-existent email address: {}", email);
        }
    }

    @Override
    @Transactional
    public void resetPassword(ResetPasswordRequest request) {
        String tokenHash = JwtService.hashToken(request.getToken().trim());
        PasswordResetToken resetToken = passwordResetTokenRepository.findByTokenHash(tokenHash)
                .orElseThrow(() -> new BadRequestException("Password reset token is invalid or has expired"));

        if (!resetToken.isValid()) {
            throw new BadRequestException("Password reset token is invalid, expired, or already used");
        }

        User user = resetToken.getUser();
        if (!"ACTIVE".equalsIgnoreCase(user.getStatus())) {
            throw new BadRequestException("User account is inactive");
        }

        user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        resetToken.setUsed(true);
        passwordResetTokenRepository.save(resetToken);

        // Invalidate active refresh tokens
        refreshTokenRepository.revokeAllUserTokens(user);

        auditService.logAction("User", user.getId().toString(), "PASSWORD_RESET_COMPLETED",
                user.getUsername(), "Password successfully reset via token", null);
    }

    @Override
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername().trim())) {
            throw new ConflictException("Username is already taken");
        }

        if (userRepository.existsByEmail(request.getEmail().trim().toLowerCase())) {
            throw new ConflictException("Email is already registered");
        }

        RoleEntity customerRole = roleRepository.findByName("ROLE_CUSTOMER")
                .orElseThrow(() -> new IllegalStateException("ROLE_CUSTOMER not configured in database"));

        User newUser = User.builder()
                .username(request.getUsername().trim())
                .email(request.getEmail().trim().toLowerCase())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .firstName(request.getFirstName().trim())
                .lastName(request.getLastName().trim())
                .phoneNumber(request.getPhoneNumber() != null ? request.getPhoneNumber().trim() : null)
                .status("ACTIVE")
                .roles(new HashSet<>(Collections.singletonList(customerRole)))
                .build();

        User savedUser = userRepository.save(newUser);

        UserPrincipal userPrincipal = UserPrincipal.create(savedUser);
        String accessToken = jwtService.generateToken(userPrincipal);
        String refreshToken = jwtService.generateRefreshToken(userPrincipal);

        String tokenHash = JwtService.hashToken(refreshToken);
        RefreshToken refreshTokenEntity = RefreshToken.builder()
                .user(savedUser)
                .tokenHash(tokenHash)
                .expiresAt(Instant.now().plusMillis(jwtService.getRefreshExpirationMs()))
                .revoked(false)
                .build();
        refreshTokenRepository.save(refreshTokenEntity);

        auditService.logAction("User", savedUser.getId().toString(), "ACCOUNT_CREATED",
                savedUser.getUsername(), "New customer account registered", null);

        UserProfileResponse profile = buildUserProfile(savedUser, userPrincipal);

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .tokenType("Bearer")
                .expiresIn(jwtService.getJwtExpirationMs() / 1000)
                .userId(savedUser.getId())
                .username(savedUser.getUsername())
                .email(savedUser.getEmail())
                .firstName(savedUser.getFirstName())
                .lastName(savedUser.getLastName())
                .roles(userPrincipal.getRoles())
                .permissions(userPrincipal.getPermissions())
                .user(profile)
                .build();
    }

    private UserProfileResponse buildUserProfile(User user, UserPrincipal principal) {
        return UserProfileResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .phoneNumber(user.getPhoneNumber())
                .status(user.getStatus())
                .roles(principal.getRoles())
                .permissions(principal.getPermissions())
                .build();
    }
}
