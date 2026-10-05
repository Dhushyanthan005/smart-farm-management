package com.dairyflow.modules.auth;

import com.dairyflow.modules.auth.dto.LoginRequest;
import com.dairyflow.modules.users.entity.PermissionEntity;
import com.dairyflow.modules.users.entity.RoleEntity;
import com.dairyflow.modules.users.entity.User;
import com.dairyflow.modules.users.repository.PermissionRepository;
import com.dairyflow.modules.users.repository.RoleRepository;
import com.dairyflow.modules.users.repository.UserRepository;
import com.dairyflow.security.JwtService;
import com.dairyflow.security.UserPrincipal;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.util.*;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class AuthControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PermissionRepository permissionRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private com.dairyflow.modules.auth.repository.RefreshTokenRepository refreshTokenRepository;

    @Autowired
    private com.dairyflow.modules.auth.repository.PasswordResetTokenRepository passwordResetTokenRepository;

    private User ownerUser;
    private User customerUser;
    private String ownerAccessToken;
    private String customerAccessToken;

    @BeforeEach
    void setUp() {
        refreshTokenRepository.deleteAll();
        passwordResetTokenRepository.deleteAll();
        userRepository.deleteAll();
        roleRepository.deleteAll();
        permissionRepository.deleteAll();

        // 1. Setup Permissions
        PermissionEntity cowView = permissionRepository.save(
                PermissionEntity.builder().name("COW_VIEW").description("View cows").module("cows").build()
        );
        PermissionEntity cowCreate = permissionRepository.save(
                PermissionEntity.builder().name("COW_CREATE").description("Register cows").module("cows").build()
        );

        // 2. Setup Roles
        RoleEntity ownerRole = roleRepository.save(
                RoleEntity.builder()
                        .name("ROLE_OWNER")
                        .description("Owner")
                        .permissions(new HashSet<>(List.of(cowView, cowCreate)))
                        .build()
        );

        RoleEntity customerRole = roleRepository.save(
                RoleEntity.builder()
                        .name("ROLE_CUSTOMER")
                        .description("Customer")
                        .permissions(new HashSet<>())
                        .build()
        );

        // 3. Setup Users
        ownerUser = userRepository.save(
                User.builder()
                        .username("testowner")
                        .email("owner@dairyflow.com")
                        .passwordHash(passwordEncoder.encode("password123"))
                        .firstName("Elena")
                        .lastName("Vance")
                        .status("ACTIVE")
                        .roles(new HashSet<>(Collections.singletonList(ownerRole)))
                        .build()
        );

        customerUser = userRepository.save(
                User.builder()
                        .username("testcustomer")
                        .email("customer@dairyflow.com")
                        .passwordHash(passwordEncoder.encode("password123"))
                        .firstName("Alice")
                        .lastName("Cooper")
                        .status("ACTIVE")
                        .roles(new HashSet<>(Collections.singletonList(customerRole)))
                        .build()
        );

        ownerAccessToken = jwtService.generateToken(UserPrincipal.create(ownerUser));
        customerAccessToken = jwtService.generateToken(UserPrincipal.create(customerUser));
    }

    @Test
    @DisplayName("POST /api/v1/auth/login should authenticate valid credentials and issue tokens")
    void testLoginSuccess() throws Exception {
        LoginRequest request = LoginRequest.builder()
                .username("owner@dairyflow.com")
                .password("password123")
                .build();

        mockMvc.perform(post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.accessToken").isString())
                .andExpect(jsonPath("$.data.refreshToken").isString())
                .andExpect(jsonPath("$.data.username").value("testowner"))
                .andExpect(jsonPath("$.data.roles[0]").value("ROLE_OWNER"));
    }

    @Test
    @DisplayName("POST /api/v1/auth/login with wrong password should return 401 Unauthorized")
    void testLoginInvalidPassword() throws Exception {
        LoginRequest request = LoginRequest.builder()
                .username("owner@dairyflow.com")
                .password("wrong-password")
                .build();

        mockMvc.perform(post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.error").value("BAD_CREDENTIALS"));
    }

    @Test
    @DisplayName("GET /api/v1/auth/me without token should return 401 Unauthorized")
    void testGetMeUnauthorized() throws Exception {
        mockMvc.perform(get("/api/v1/auth/me"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.error").value("UNAUTHORIZED"));
    }

    @Test
    @DisplayName("GET /api/v1/auth/me with valid Bearer token should return 200 OK and user profile")
    void testGetMeAuthorized() throws Exception {
        mockMvc.perform(get("/api/v1/auth/me")
                        .header("Authorization", "Bearer " + ownerAccessToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.username").value("testowner"))
                .andExpect(jsonPath("$.data.email").value("owner@dairyflow.com"))
                .andExpect(jsonPath("$.data.roles[0]").value("ROLE_OWNER"));
    }

    @Test
    @DisplayName("GET /api/v1/cows without token should return 401 Unauthorized")
    void testCowsEndpointUnauthorized() throws Exception {
        mockMvc.perform(get("/api/v1/cows"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.error").value("UNAUTHORIZED"));
    }

    @Test
    @DisplayName("POST /api/v1/cows with customer role (lacking COW_CREATE) should return 403 Forbidden")
    void testCowsEndpointForbidden() throws Exception {
        Map<String, Object> cowPayload = Map.of(
                "tagNumber", "DF-9999",
                "name", "Bella",
                "breed", "HOLSTEIN",
                "dateOfBirth", "2023-01-01",
                "gender", "FEMALE"
        );

        mockMvc.perform(post("/api/v1/cows")
                        .header("Authorization", "Bearer " + customerAccessToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(cowPayload)))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.error").value("ACCESS_DENIED"));
    }

    @Test
    @DisplayName("GET /api/v1/cows with owner role should succeed with 200 OK")
    void testCowsEndpointAuthorized() throws Exception {
        mockMvc.perform(get("/api/v1/cows")
                        .header("Authorization", "Bearer " + ownerAccessToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data").exists());
    }

    @Test
    @DisplayName("POST /api/v1/auth/change-password with valid credentials should succeed")
    void testChangePasswordSuccess() throws Exception {
        Map<String, String> request = Map.of(
                "currentPassword", "password123",
                "newPassword", "brandNewPassword123"
        );

        mockMvc.perform(post("/api/v1/auth/change-password")
                        .header("Authorization", "Bearer " + ownerAccessToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Password updated successfully"));
    }

    @Test
    @DisplayName("POST /api/v1/auth/logout should invalidate session successfully")
    void testLogoutSuccess() throws Exception {
        mockMvc.perform(post("/api/v1/auth/logout")
                        .header("Authorization", "Bearer " + ownerAccessToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of())))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Logged out successfully"));
    }

    @Test
    @DisplayName("POST /api/v1/auth/register should create new customer user and return tokens")
    void testRegisterSuccess() throws Exception {
        Map<String, String> request = Map.of(
                "username", "newcustomer",
                "email", "newcustomer@dairyflow.com",
                "password", "securePassword123",
                "firstName", "John",
                "lastName", "Doe"
        );

        mockMvc.perform(post("/api/v1/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.data.accessToken").isString())
                .andExpect(jsonPath("$.data.username").value("newcustomer"))
                .andExpect(jsonPath("$.data.roles[0]").value("ROLE_CUSTOMER"));
    }
}
