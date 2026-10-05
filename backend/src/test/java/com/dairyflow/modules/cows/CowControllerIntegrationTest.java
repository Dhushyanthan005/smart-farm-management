package com.dairyflow.modules.cows;

import com.dairyflow.modules.cows.dto.CreateCowRequest;
import com.dairyflow.modules.cows.dto.UpdateCowRequest;
import com.dairyflow.modules.cows.entity.Cow;
import com.dairyflow.modules.cows.entity.enums.Breed;
import com.dairyflow.modules.cows.entity.enums.CowSource;
import com.dairyflow.modules.cows.entity.enums.Gender;
import com.dairyflow.modules.cows.entity.enums.HealthStatus;
import com.dairyflow.modules.cows.entity.enums.LifecycleStatus;
import com.dairyflow.modules.cows.repository.CowRepository;
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

import java.time.LocalDate;
import java.util.*;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class CowControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private CowRepository cowRepository;

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

    @Autowired(required = false)
    private com.dairyflow.modules.health.repository.TreatmentRepository treatmentRepository;

    @Autowired(required = false)
    private com.dairyflow.modules.health.repository.QuarantineRecordRepository quarantineRecordRepository;

    @Autowired(required = false)
    private com.dairyflow.modules.health.repository.HealthRecordRepository healthRecordRepository;

    private String adminToken;
    private String workerToken;
    private String customerToken;

    @BeforeEach
    void setUp() {
        if (treatmentRepository != null) treatmentRepository.deleteAll();
        if (quarantineRecordRepository != null) quarantineRecordRepository.deleteAll();
        if (healthRecordRepository != null) healthRecordRepository.deleteAll();
        cowRepository.deleteAll();
        refreshTokenRepository.deleteAll();
        passwordResetTokenRepository.deleteAll();
        userRepository.deleteAll();
        roleRepository.deleteAll();
        permissionRepository.deleteAll();

        // Permissions
        PermissionEntity cowView = permissionRepository.save(
                PermissionEntity.builder().name("COW_VIEW").description("View cows").module("cows").build()
        );
        PermissionEntity cowCreate = permissionRepository.save(
                PermissionEntity.builder().name("COW_CREATE").description("Register cows").module("cows").build()
        );
        PermissionEntity cowUpdate = permissionRepository.save(
                PermissionEntity.builder().name("COW_UPDATE").description("Update cows").module("cows").build()
        );
        PermissionEntity cowDelete = permissionRepository.save(
                PermissionEntity.builder().name("COW_DELETE").description("Delete cows").module("cows").build()
        );

        // Roles
        RoleEntity adminRole = roleRepository.save(
                RoleEntity.builder()
                        .name("ROLE_ADMIN")
                        .description("Admin with all cow perms")
                        .permissions(new HashSet<>(List.of(cowView, cowCreate, cowUpdate, cowDelete)))
                        .build()
        );

        RoleEntity workerRole = roleRepository.save(
                RoleEntity.builder()
                        .name("ROLE_WORKER")
                        .description("Worker with view only")
                        .permissions(new HashSet<>(List.of(cowView)))
                        .build()
        );

        RoleEntity customerRole = roleRepository.save(
                RoleEntity.builder()
                        .name("ROLE_CUSTOMER")
                        .description("Customer without cow perms")
                        .permissions(new HashSet<>())
                        .build()
        );

        // Users
        User adminUser = userRepository.save(
                User.builder()
                        .username("admin")
                        .email("admin@dairyflow.com")
                        .passwordHash(passwordEncoder.encode("password123"))
                        .firstName("Admin")
                        .lastName("User")
                        .status("ACTIVE")
                        .roles(new HashSet<>(Collections.singletonList(adminRole)))
                        .build()
        );

        User workerUser = userRepository.save(
                User.builder()
                        .username("worker")
                        .email("worker@dairyflow.com")
                        .passwordHash(passwordEncoder.encode("password123"))
                        .firstName("Worker")
                        .lastName("User")
                        .status("ACTIVE")
                        .roles(new HashSet<>(Collections.singletonList(workerRole)))
                        .build()
        );

        User customerUser = userRepository.save(
                User.builder()
                        .username("customer")
                        .email("customer@dairyflow.com")
                        .passwordHash(passwordEncoder.encode("password123"))
                        .firstName("Customer")
                        .lastName("User")
                        .status("ACTIVE")
                        .roles(new HashSet<>(Collections.singletonList(customerRole)))
                        .build()
        );

        adminToken = jwtService.generateToken(UserPrincipal.create(adminUser));
        workerToken = jwtService.generateToken(UserPrincipal.create(workerUser));
        customerToken = jwtService.generateToken(UserPrincipal.create(customerUser));
    }

    @Test
    @DisplayName("POST /api/v1/cows should register a new cow and return 201 Created")
    void shouldRegisterCowSuccessfully() throws Exception {
        CreateCowRequest request = CreateCowRequest.builder()
                .tagNumber("DF-1042")
                .rfid("840-003-241-1042")
                .name("Aurora")
                .breed(Breed.HOLSTEIN_FRIESIAN)
                .gender(Gender.FEMALE)
                .dateOfBirth(LocalDate.of(2022, 4, 15))
                .parity(3)
                .healthStatus(HealthStatus.HEALTHY)
                .lifecycleStatus(LifecycleStatus.ACTIVE)
                .source(CowSource.BORN)
                .barn("Barn A")
                .pen("Pen 04")
                .expectedMilkCapacity(35.5)
                .currentMilkStatus("Mid")
                .notes("High-yield animal")
                .build();

        mockMvc.perform(post("/api/v1/cows")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.data.tagNumber").value("DF-1042"))
                .andExpect(jsonPath("$.data.name").value("Aurora"))
                .andExpect(jsonPath("$.data.breed").value("HOLSTEIN_FRIESIAN"))
                .andExpect(jsonPath("$.data.healthStatus").value("HEALTHY"))
                .andExpect(jsonPath("$.data.lifecycleStatus").value("ACTIVE"))
                .andExpect(jsonPath("$.data.age").isString())
                .andExpect(jsonPath("$.data.createdAt").isNotEmpty());

        assertThat(cowRepository.existsByTagNumber("DF-1042")).isTrue();
    }

    @Test
    @DisplayName("POST /api/v1/cows should return 409 Conflict when tag number already exists")
    void shouldReturn409OnDuplicateTag() throws Exception {
        cowRepository.save(Cow.builder()
                .tagNumber("DF-1042")
                .breed(Breed.HOLSTEIN_FRIESIAN)
                .gender(Gender.FEMALE)
                .dateOfBirth(LocalDate.of(2022, 4, 15))
                .parity(1)
                .healthStatus(HealthStatus.HEALTHY)
                .lifecycleStatus(LifecycleStatus.ACTIVE)
                .source(CowSource.BORN)
                .build());

        CreateCowRequest request = CreateCowRequest.builder()
                .tagNumber("DF-1042")
                .breed(Breed.JERSEY)
                .gender(Gender.FEMALE)
                .dateOfBirth(LocalDate.of(2023, 1, 10))
                .parity(0)
                .build();

        mockMvc.perform(post("/api/v1/cows")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.error").value("DUPLICATE_TAG_NUMBER"))
                .andExpect(jsonPath("$.message").value("Cow with tag number 'DF-1042' already exists"));
    }

    @Test
    @DisplayName("GET /api/v1/cows/{id} should return cow details")
    void shouldReturnCowDetails() throws Exception {
        Cow saved = cowRepository.save(Cow.builder()
                .tagNumber("DF-1043")
                .name("Clover")
                .breed(Breed.JERSEY)
                .gender(Gender.FEMALE)
                .dateOfBirth(LocalDate.of(2021, 5, 20))
                .parity(2)
                .healthStatus(HealthStatus.HEALTHY)
                .lifecycleStatus(LifecycleStatus.ACTIVE)
                .source(CowSource.BORN)
                .barn("Barn A")
                .pen("Pen 02")
                .build());

        mockMvc.perform(get("/api/v1/cows/" + saved.getId())
                        .header("Authorization", "Bearer " + workerToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.id").value(saved.getId().toString()))
                .andExpect(jsonPath("$.data.tagNumber").value("DF-1043"))
                .andExpect(jsonPath("$.data.name").value("Clover"))
                .andExpect(jsonPath("$.data.barn").value("Barn A"));
    }

    @Test
    @DisplayName("GET /api/v1/cows/{id} should return 404 Not Found for non-existent ID")
    void shouldReturn404WhenNotFound() throws Exception {
        UUID randomId = UUID.randomUUID();
        mockMvc.perform(get("/api/v1/cows/" + randomId)
                        .header("Authorization", "Bearer " + workerToken))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.error").value("RESOURCE_NOT_FOUND"));
    }

    @Test
    @DisplayName("PUT /api/v1/cows/{id} should update cow attributes")
    void shouldUpdateCowSuccessfully() throws Exception {
        Cow saved = cowRepository.save(Cow.builder()
                .tagNumber("DF-1044")
                .name("Daisy")
                .breed(Breed.HOLSTEIN_FRIESIAN)
                .gender(Gender.FEMALE)
                .dateOfBirth(LocalDate.of(2022, 3, 10))
                .parity(1)
                .healthStatus(HealthStatus.HEALTHY)
                .lifecycleStatus(LifecycleStatus.ACTIVE)
                .source(CowSource.BORN)
                .barn("Barn B")
                .pen("Pen 01")
                .build());

        UpdateCowRequest updateReq = UpdateCowRequest.builder()
                .name("Daisy II")
                .healthStatus(HealthStatus.PREGNANT)
                .barn("Barn A")
                .pen("Pen 03")
                .build();

        mockMvc.perform(put("/api/v1/cows/" + saved.getId())
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateReq)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.name").value("Daisy II"))
                .andExpect(jsonPath("$.data.healthStatus").value("PREGNANT"))
                .andExpect(jsonPath("$.data.barn").value("Barn A"))
                .andExpect(jsonPath("$.data.pen").value("Pen 03"));

        Cow updated = cowRepository.findById(saved.getId()).orElseThrow();
        assertThat(updated.getName()).isEqualTo("Daisy II");
        assertThat(updated.getHealthStatus()).isEqualTo(HealthStatus.PREGNANT);
    }

    @Test
    @DisplayName("DELETE /api/v1/cows/{id} should archive cow to preserve history")
    void shouldArchiveCowOnDelete() throws Exception {
        Cow saved = cowRepository.save(Cow.builder()
                .tagNumber("DF-1045")
                .name("Bella")
                .breed(Breed.GUERNSEY)
                .gender(Gender.FEMALE)
                .dateOfBirth(LocalDate.of(2021, 2, 10))
                .parity(2)
                .healthStatus(HealthStatus.HEALTHY)
                .lifecycleStatus(LifecycleStatus.ACTIVE)
                .source(CowSource.BORN)
                .build());

        mockMvc.perform(delete("/api/v1/cows/" + saved.getId())
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Cow record archived successfully"));

        Cow archived = cowRepository.findById(saved.getId()).orElseThrow();
        assertThat(archived.getLifecycleStatus()).isEqualTo(LifecycleStatus.DECEASED);
    }

    @Test
    @DisplayName("GET /api/v1/cows should filter by search term, health, barn, and pagination")
    void shouldListCowsWithFiltering() throws Exception {
        cowRepository.save(Cow.builder()
                .tagNumber("DF-101")
                .name("Bella")
                .breed(Breed.HOLSTEIN_FRIESIAN)
                .gender(Gender.FEMALE)
                .dateOfBirth(LocalDate.of(2022, 1, 1))
                .healthStatus(HealthStatus.HEALTHY)
                .lifecycleStatus(LifecycleStatus.ACTIVE)
                .source(CowSource.BORN)
                .barn("Barn A")
                .build());

        cowRepository.save(Cow.builder()
                .tagNumber("DF-102")
                .name("Luna")
                .breed(Breed.JERSEY)
                .gender(Gender.FEMALE)
                .dateOfBirth(LocalDate.of(2021, 6, 1))
                .healthStatus(HealthStatus.QUARANTINED)
                .lifecycleStatus(LifecycleStatus.ACTIVE)
                .source(CowSource.BORN)
                .barn("Quarantine Bay")
                .build());

        mockMvc.perform(get("/api/v1/cows?search=Luna")
                        .header("Authorization", "Bearer " + workerToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.content.length()").value(1))
                .andExpect(jsonPath("$.data.content[0].tagNumber").value("DF-102"));

        mockMvc.perform(get("/api/v1/cows?healthStatus=HEALTHY")
                        .header("Authorization", "Bearer " + workerToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.content.length()").value(1))
                .andExpect(jsonPath("$.data.content[0].tagNumber").value("DF-101"));
    }

    @Test
    @DisplayName("GET /api/v1/cows/stats should return aggregate livestock metrics")
    void shouldReturnCowsStats() throws Exception {
        cowRepository.save(Cow.builder()
                .tagNumber("DF-101")
                .name("Bella")
                .breed(Breed.HOLSTEIN_FRIESIAN)
                .gender(Gender.FEMALE)
                .dateOfBirth(LocalDate.of(2022, 1, 1))
                .parity(2)
                .currentMilkStatus("Mid")
                .healthStatus(HealthStatus.HEALTHY)
                .lifecycleStatus(LifecycleStatus.ACTIVE)
                .source(CowSource.BORN)
                .build());

        cowRepository.save(Cow.builder()
                .tagNumber("DF-102")
                .name("Heifer 1")
                .breed(Breed.JERSEY)
                .gender(Gender.FEMALE)
                .dateOfBirth(LocalDate.of(2024, 2, 1))
                .parity(0)
                .healthStatus(HealthStatus.HEALTHY)
                .lifecycleStatus(LifecycleStatus.ACTIVE)
                .source(CowSource.BORN)
                .build());

        cowRepository.save(Cow.builder()
                .tagNumber("DF-103")
                .name("Quarantine 1")
                .breed(Breed.HOLSTEIN_FRIESIAN)
                .gender(Gender.FEMALE)
                .dateOfBirth(LocalDate.of(2021, 3, 1))
                .parity(1)
                .healthStatus(HealthStatus.QUARANTINED)
                .lifecycleStatus(LifecycleStatus.ACTIVE)
                .source(CowSource.BORN)
                .build());

        mockMvc.perform(get("/api/v1/cows/stats")
                        .header("Authorization", "Bearer " + workerToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.totalHead").value(3))
                .andExpect(jsonPath("$.data.heifers").value(1))
                .andExpect(jsonPath("$.data.quarantine").value(1));
    }

    @Test
    @DisplayName("POST /api/v1/cows should return 403 Forbidden when user lacks COW_CREATE authority")
    void shouldReturn403WhenUnauthorizedToCreate() throws Exception {
        CreateCowRequest request = CreateCowRequest.builder()
                .tagNumber("DF-999")
                .breed(Breed.HOLSTEIN_FRIESIAN)
                .gender(Gender.FEMALE)
                .dateOfBirth(LocalDate.of(2023, 1, 1))
                .build();

        mockMvc.perform(post("/api/v1/cows")
                        .header("Authorization", "Bearer " + customerToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isForbidden());
    }

    @Test
    @DisplayName("GET /api/v1/cows should return 401 Unauthorized when no token is provided")
    void shouldReturn401WhenNoToken() throws Exception {
        mockMvc.perform(get("/api/v1/cows"))
                .andExpect(status().isUnauthorized());
    }
}
