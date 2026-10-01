package com.dairyflow.modules.auth.service;

import com.dairyflow.common.audit.AuditService;
import com.dairyflow.common.exception.UnauthorizedException;
import com.dairyflow.modules.auth.dto.AuthResponse;
import com.dairyflow.modules.auth.dto.LoginRequest;
import com.dairyflow.modules.auth.dto.RefreshTokenRequest;
import com.dairyflow.security.JwtService;
import com.dairyflow.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final AuditService auditService;

    @Override
    public AuthResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );

        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        String accessToken = jwtService.generateToken(userPrincipal);
        String refreshToken = jwtService.generateRefreshToken(userPrincipal);

        List<String> roles = userPrincipal.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .toList();

        auditService.logAction("User", userPrincipal.getId().toString(), "USER_LOGIN",
                userPrincipal.getUsername(), "Successful login", null);

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .tokenType("Bearer")
                .userId(userPrincipal.getId())
                .username(userPrincipal.getUsername())
                .email(userPrincipal.getEmail())
                .roles(roles)
                .build();
    }

    @Override
    public AuthResponse refreshToken(RefreshTokenRequest request) {
        if (!jwtService.validateToken(request.getRefreshToken())) {
            throw new UnauthorizedException("Invalid or expired refresh token");
        }

        UUID userId = jwtService.extractUserId(request.getRefreshToken());
        log.info("Token refresh requested for userId: {}", userId);

        // Complete rotation logic will be expanded in Phase 3
        return AuthResponse.builder()
                .tokenType("Bearer")
                .userId(userId)
                .build();
    }
}
