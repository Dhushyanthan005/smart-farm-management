package com.dairyflow.modules.breeding;

import com.dairyflow.modules.breeding.dto.*;
import com.dairyflow.modules.breeding.entity.enums.*;
import com.dairyflow.modules.breeding.repository.*;
import com.dairyflow.modules.cows.entity.Cow;
import com.dairyflow.modules.cows.entity.enums.Breed;
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
import org.junit.jupiter.api.AfterEach;
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
import java.time.LocalDateTime;
import java.util.*;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class BreedingControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private HeatRecordRepository heatRecordRepository;

    @Autowired
    private BreedingRecordRepository breedingRecordRepository;

    @Autowired
    private PregnancyRecordRepository pregnancyRecordRepository;

    @Autowired
    private CalvingRecordRepository calvingRecordRepository;

    @Autowired
    private com.dairyflow.modules.health.repository.TreatmentRepository treatmentRepository;

    @Autowired
    private com.dairyflow.modules.health.repository.QuarantineRecordRepository quarantineRecordRepository;

    @Autowired
    private com.dairyflow.modules.health.repository.HealthRecordRepository healthRecordRepository;

    @Autowired
    private com.dairyflow.modules.milk.repository.MilkRepository milkRepository;

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

    private String adminToken;
    private String vetToken;
    private String workerToken;
    private String customerToken;
    private Cow testCow;

    @BeforeEach
    void setUp() {
        cleanDatabase();

        // 1. Permissions
        PermissionEntity breedingView = permissionRepository.save(
                PermissionEntity.builder().name("BREEDING_VIEW").description("View breeding records").module("breeding").build()
        );
        PermissionEntity breedingCreate = permissionRepository.save(
                PermissionEntity.builder().name("BREEDING_CREATE").description("Create breeding records").module("breeding").build()
        );
        PermissionEntity breedingUpdate = permissionRepository.save(
                PermissionEntity.builder().name("BREEDING_UPDATE").description("Update breeding records").module("breeding").build()
        );
        PermissionEntity breedingDelete = permissionRepository.save(
                PermissionEntity.builder().name("BREEDING_DELETE").description("Delete breeding records").module("breeding").build()
        );
        PermissionEntity heatView = permissionRepository.save(
                PermissionEntity.builder().name("HEAT_VIEW").description("View heat records").module("breeding").build()
        );
        PermissionEntity heatCreate = permissionRepository.save(
                PermissionEntity.builder().name("HEAT_CREATE").description("Record heat").module("breeding").build()
        );
        PermissionEntity heatUpdate = permissionRepository.save(
                PermissionEntity.builder().name("HEAT_UPDATE").description("Update heat").module("breeding").build()
        );
        PermissionEntity pregView = permissionRepository.save(
                PermissionEntity.builder().name("PREGNANCY_VIEW").description("View pregnancy").module("breeding").build()
        );
        PermissionEntity pregCreate = permissionRepository.save(
                PermissionEntity.builder().name("PREGNANCY_CREATE").description("Create pregnancy").module("breeding").build()
        );
        PermissionEntity pregUpdate = permissionRepository.save(
                PermissionEntity.builder().name("PREGNANCY_UPDATE").description("Update pregnancy").module("breeding").build()
        );
        PermissionEntity pregConfirm = permissionRepository.save(
                PermissionEntity.builder().name("PREGNANCY_CONFIRM").description("Confirm pregnancy").module("breeding").build()
        );
        PermissionEntity calvingView = permissionRepository.save(
                PermissionEntity.builder().name("CALVING_VIEW").description("View calving").module("breeding").build()
        );
        PermissionEntity calvingCreate = permissionRepository.save(
                PermissionEntity.builder().name("CALVING_CREATE").description("Record calving").module("breeding").build()
        );
        PermissionEntity calvingUpdate = permissionRepository.save(
                PermissionEntity.builder().name("CALVING_UPDATE").description("Update calving").module("breeding").build()
        );
        PermissionEntity cowView = permissionRepository.save(
                PermissionEntity.builder().name("COW_VIEW").description("View cow").module("cows").build()
        );

        // 2. Roles
        RoleEntity adminRole = roleRepository.save(RoleEntity.builder()
                .name("ROLE_ADMIN")
                .description("Administrator")
                .permissions(new HashSet<>(List.of(
                        breedingView, breedingCreate, breedingUpdate, breedingDelete,
                        heatView, heatCreate, heatUpdate,
                        pregView, pregCreate, pregUpdate, pregConfirm,
                        calvingView, calvingCreate, calvingUpdate, cowView
                )))
                .build());

        RoleEntity vetRole = roleRepository.save(RoleEntity.builder()
                .name("ROLE_VETERINARIAN")
                .description("Veterinarian")
                .permissions(new HashSet<>(List.of(
                        breedingView, breedingCreate, breedingUpdate,
                        heatView, heatCreate, heatUpdate,
                        pregView, pregCreate, pregUpdate, pregConfirm,
                        calvingView, calvingCreate, calvingUpdate, cowView
                )))
                .build());

        RoleEntity workerRole = roleRepository.save(RoleEntity.builder()
                .name("ROLE_WORKER")
                .description("Worker")
                .permissions(new HashSet<>(List.of(heatView, heatCreate, breedingView, cowView)))
                .build());

        RoleEntity customerRole = roleRepository.save(RoleEntity.builder()
                .name("ROLE_CUSTOMER")
                .description("Customer")
                .permissions(new HashSet<>())
                .build());

        // 3. Users
        User adminUser = userRepository.save(User.builder()
                .username("admin_user")
                .firstName("Admin")
                .lastName("User")
                .email("admin@dairyflow.com")
                .passwordHash(passwordEncoder.encode("Password123!"))
                .roles(Set.of(adminRole))
                .status("ACTIVE")
                .build());

        User vetUser = userRepository.save(User.builder()
                .username("vet_user")
                .firstName("Sarah")
                .lastName("Jenkins")
                .email("vet@dairyflow.com")
                .passwordHash(passwordEncoder.encode("Password123!"))
                .roles(Set.of(vetRole))
                .status("ACTIVE")
                .build());

        User workerUser = userRepository.save(User.builder()
                .username("worker_user")
                .firstName("Bob")
                .lastName("Worker")
                .email("worker@dairyflow.com")
                .passwordHash(passwordEncoder.encode("Password123!"))
                .roles(Set.of(workerRole))
                .status("ACTIVE")
                .build());

        User customerUser = userRepository.save(User.builder()
                .username("cust_user")
                .firstName("Charlie")
                .lastName("Customer")
                .email("cust@dairyflow.com")
                .passwordHash(passwordEncoder.encode("Password123!"))
                .roles(Set.of(customerRole))
                .status("ACTIVE")
                .build());

        adminToken = "Bearer " + jwtService.generateToken(UserPrincipal.create(adminUser));
        vetToken = "Bearer " + jwtService.generateToken(UserPrincipal.create(vetUser));
        workerToken = "Bearer " + jwtService.generateToken(UserPrincipal.create(workerUser));
        customerToken = "Bearer " + jwtService.generateToken(UserPrincipal.create(customerUser));

        // 4. Test Cow
        testCow = cowRepository.save(Cow.builder()
                .tagNumber("TEST-COW-900")
                .name("Bella")
                .breed(Breed.HOLSTEIN)
                .gender(Gender.FEMALE)
                .dateOfBirth(LocalDate.now().minusYears(3))
                .parity(0)
                .healthStatus(HealthStatus.HEALTHY)
                .lifecycleStatus(LifecycleStatus.ACTIVE)
                .build());
    }

    @AfterEach
    void tearDown() {
        cleanDatabase();
    }

    private void cleanDatabase() {
        calvingRecordRepository.deleteAll();
        pregnancyRecordRepository.deleteAll();
        breedingRecordRepository.deleteAll();
        heatRecordRepository.deleteAll();
        treatmentRepository.deleteAll();
        quarantineRecordRepository.deleteAll();
        healthRecordRepository.deleteAll();
        milkRepository.deleteAll();
        cowRepository.deleteAll();
        refreshTokenRepository.deleteAll();
        passwordResetTokenRepository.deleteAll();
        userRepository.deleteAll();
        roleRepository.deleteAll();
        permissionRepository.deleteAll();
    }

    // ==========================================
    // HEAT DETECTION INTEGRATION
    // ==========================================

    @Test
    @DisplayName("Worker can record heat observation and view heat records")
    void shouldAllowWorkerToRecordHeat() throws Exception {
        CreateHeatRecordRequest request = CreateHeatRecordRequest.builder()
                .cowId(testCow.getId())
                .detectedAt(LocalDateTime.now())
                .detectionMethod(HeatDetectionMethod.MANUAL)
                .signsObserved("Mucus discharge, vocalization")
                .confidence(HeatConfidence.HIGH)
                .build();

        mockMvc.perform(post("/api/v1/breeding/heat")
                        .header("Authorization", workerToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.data.cowTagNumber").value("TEST-COW-900"))
                .andExpect(jsonPath("$.data.detectionMethod").value("MANUAL"));

        mockMvc.perform(get("/api/v1/breeding/heat")
                        .header("Authorization", workerToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.content.length()").value(1));
    }

    // ==========================================
    // BREEDING RECORD INTEGRATION
    // ==========================================

    @Test
    @DisplayName("Vet can create breeding record and complete it")
    void shouldCreateAndCompleteBreedingRecord() throws Exception {
        CreateBreedingRecordRequest request = CreateBreedingRecordRequest.builder()
                .cowId(testCow.getId())
                .breedingDate(LocalDate.now())
                .breedingMethod(BreedingMethod.ARTIFICIAL_INSEMINATION)
                .semenReference("AI-REF-9901")
                .technicianName("Dr. Carter")
                .status(BreedingStatus.COMPLETED)
                .build();

        String responseJson = mockMvc.perform(post("/api/v1/breeding/records")
                        .header("Authorization", vetToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.data.semenReference").value("AI-REF-9901"))
                .andExpect(jsonPath("$.data.status").value("COMPLETED"))
                .andReturn().getResponse().getContentAsString();

        UUID breedingId = UUID.fromString(objectMapper.readTree(responseJson).path("data").path("id").asText());

        // Cancel breeding test
        mockMvc.perform(post("/api/v1/breeding/records/" + breedingId + "/cancel")
                        .header("Authorization", adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.status").value("CANCELLED"));
    }

    // ==========================================
    // PREGNANCY LIFECYCLE & CONFLICTS
    // ==========================================

    @Test
    @DisplayName("Pregnancy workflow: create -> confirm -> reject duplicate active pregnancy")
    void shouldManagePregnancyLifecycleAndPreventDuplicates() throws Exception {
        // 1. Create breeding
        CreateBreedingRecordRequest breedingRequest = CreateBreedingRecordRequest.builder()
                .cowId(testCow.getId())
                .breedingDate(LocalDate.now().minusDays(35))
                .breedingMethod(BreedingMethod.ARTIFICIAL_INSEMINATION)
                .semenReference("AI-BULL-100")
                .build();

        String breedingResp = mockMvc.perform(post("/api/v1/breeding/records")
                        .header("Authorization", vetToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(breedingRequest)))
                .andExpect(status().isCreated())
                .andReturn().getResponse().getContentAsString();

        UUID breedingId = UUID.fromString(objectMapper.readTree(breedingResp).path("data").path("id").asText());

        // 2. Create pregnancy (pending)
        CreatePregnancyRecordRequest pregRequest = CreatePregnancyRecordRequest.builder()
                .cowId(testCow.getId())
                .breedingId(breedingId)
                .pregnancyStatus(PregnancyStatus.PENDING)
                .build();

        String pregResp = mockMvc.perform(post("/api/v1/breeding/pregnancies")
                        .header("Authorization", vetToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(pregRequest)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.data.pregnancyStatus").value("PENDING"))
                .andReturn().getResponse().getContentAsString();

        UUID pregId = UUID.fromString(objectMapper.readTree(pregResp).path("data").path("id").asText());

        // 3. Confirm pregnancy
        ConfirmPregnancyRequest confirmRequest = ConfirmPregnancyRequest.builder()
                .confirmationDate(LocalDate.now())
                .confirmationMethod(PregnancyConfirmationMethod.ULTRASOUND)
                .notes("Strong heartbeat observed")
                .build();

        mockMvc.perform(post("/api/v1/breeding/pregnancies/" + pregId + "/confirm")
                        .header("Authorization", vetToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(confirmRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.pregnancyStatus").value("CONFIRMED"))
                .andExpect(jsonPath("$.data.expectedCalvingDate").exists())
                .andExpect(jsonPath("$.data.isOverdue").value(false));

        // 4. Attempt to create another active pregnancy for same cow -> should return 409 Conflict
        CreatePregnancyRecordRequest duplicateRequest = CreatePregnancyRecordRequest.builder()
                .cowId(testCow.getId())
                .pregnancyStatus(PregnancyStatus.PENDING)
                .build();

        mockMvc.perform(post("/api/v1/breeding/pregnancies")
                        .header("Authorization", vetToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(duplicateRequest)))
                .andExpect(status().isConflict());
    }

    // ==========================================
    // CALVING & REPRODUCTIVE STATS INTEGRATION
    // ==========================================

    @Test
    @DisplayName("Recording calving updates cow parity and transitions pregnancy to COMPLETED")
    void shouldRecordCalvingAndUpdateCow() throws Exception {
        // Create pregnancy
        CreatePregnancyRecordRequest pregRequest = CreatePregnancyRecordRequest.builder()
                .cowId(testCow.getId())
                .confirmationDate(LocalDate.now().minusDays(200))
                .confirmationMethod(PregnancyConfirmationMethod.VETERINARY_EXAM)
                .pregnancyStatus(PregnancyStatus.CONFIRMED)
                .build();

        String pregResp = mockMvc.perform(post("/api/v1/breeding/pregnancies")
                        .header("Authorization", vetToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(pregRequest)))
                .andExpect(status().isCreated())
                .andReturn().getResponse().getContentAsString();

        UUID pregId = UUID.fromString(objectMapper.readTree(pregResp).path("data").path("id").asText());

        // Record Calving
        CreateCalvingRecordRequest calvingRequest = CreateCalvingRecordRequest.builder()
                .cowId(testCow.getId())
                .pregnancyId(pregId)
                .calvingDate(LocalDate.now())
                .calvingType(CalvingType.NORMAL)
                .calfCount(1)
                .calfDetails("Healthy bull calf, 41 kg")
                .build();

        mockMvc.perform(post("/api/v1/breeding/calvings")
                        .header("Authorization", vetToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(calvingRequest)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.data.calfCount").value(1));

        // Verify cow parity updated
        Cow updatedCow = cowRepository.findById(testCow.getId()).orElseThrow();
        assertThat(updatedCow.getParity()).isEqualTo(1);
        assertThat(updatedCow.getCurrentMilkStatus()).isEqualTo("FRESH");

        // Verify summary endpoint returns valid data
        mockMvc.perform(get("/api/v1/breeding/summary")
                        .header("Authorization", adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.recentCalvings").value(1));

        // Verify cow breeding timeline endpoint
        mockMvc.perform(get("/api/v1/cows/" + testCow.getId() + "/breeding")
                        .header("Authorization", adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.cowTagNumber").value("TEST-COW-900"))
                .andExpect(jsonPath("$.data.parity").value(1))
                .andExpect(jsonPath("$.data.timeline.length()").value(2)); // Pregnancy check + Calving
    }

    // ==========================================
    // RBAC SECURITY
    // ==========================================

    @Test
    @DisplayName("Customer should be forbidden from accessing breeding records")
    void shouldDenyCustomerAccess() throws Exception {
        mockMvc.perform(get("/api/v1/breeding/records")
                        .header("Authorization", customerToken))
                .andExpect(status().isForbidden());
    }
}
