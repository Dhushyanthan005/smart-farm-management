package com.dairyflow.modules.health;

import com.dairyflow.modules.cows.entity.Cow;
import com.dairyflow.modules.cows.entity.enums.Breed;
import com.dairyflow.modules.cows.entity.enums.Gender;
import com.dairyflow.modules.cows.entity.enums.HealthStatus;
import com.dairyflow.modules.cows.entity.enums.LifecycleStatus;
import com.dairyflow.modules.cows.repository.CowRepository;
import com.dairyflow.modules.health.dto.*;
import com.dairyflow.modules.health.entity.HealthRecord;
import com.dairyflow.modules.health.entity.QuarantineRecord;
import com.dairyflow.modules.health.entity.Treatment;
import com.dairyflow.modules.health.entity.enums.CowHealthStatus;
import com.dairyflow.modules.health.entity.enums.QuarantineStatus;
import com.dairyflow.modules.health.entity.enums.TreatmentStatus;
import com.dairyflow.modules.health.repository.HealthRecordRepository;
import com.dairyflow.modules.health.repository.QuarantineRecordRepository;
import com.dairyflow.modules.health.repository.TreatmentRepository;
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
class HealthControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private HealthRecordRepository healthRecordRepository;

    @Autowired
    private TreatmentRepository treatmentRepository;

    @Autowired
    private QuarantineRecordRepository quarantineRecordRepository;

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
    private User testVet;

    @BeforeEach
    void setUp() {
        treatmentRepository.deleteAll();
        quarantineRecordRepository.deleteAll();
        healthRecordRepository.deleteAll();
        cowRepository.deleteAll();
        refreshTokenRepository.deleteAll();
        passwordResetTokenRepository.deleteAll();
        userRepository.deleteAll();
        roleRepository.deleteAll();
        permissionRepository.deleteAll();

        // 1. Permissions
        PermissionEntity healthView = permissionRepository.save(
                PermissionEntity.builder().name("HEALTH_VIEW").description("View health records").module("health").build()
        );
        PermissionEntity healthCreate = permissionRepository.save(
                PermissionEntity.builder().name("HEALTH_CREATE").description("Create health records").module("health").build()
        );
        PermissionEntity healthUpdate = permissionRepository.save(
                PermissionEntity.builder().name("HEALTH_UPDATE").description("Update health records").module("health").build()
        );
        PermissionEntity healthDelete = permissionRepository.save(
                PermissionEntity.builder().name("HEALTH_DELETE").description("Delete health records").module("health").build()
        );
        PermissionEntity treatmentView = permissionRepository.save(
                PermissionEntity.builder().name("TREATMENT_VIEW").description("View treatments").module("health").build()
        );
        PermissionEntity treatmentCreate = permissionRepository.save(
                PermissionEntity.builder().name("TREATMENT_CREATE").description("Prescribe treatment").module("health").build()
        );
        PermissionEntity treatmentUpdate = permissionRepository.save(
                PermissionEntity.builder().name("TREATMENT_UPDATE").description("Update treatment").module("health").build()
        );
        PermissionEntity treatmentComplete = permissionRepository.save(
                PermissionEntity.builder().name("TREATMENT_COMPLETE").description("Complete treatment").module("health").build()
        );
        PermissionEntity quarantineView = permissionRepository.save(
                PermissionEntity.builder().name("QUARANTINE_VIEW").description("View quarantine records").module("health").build()
        );
        PermissionEntity quarantineCreate = permissionRepository.save(
                PermissionEntity.builder().name("QUARANTINE_CREATE").description("Isolate cow").module("health").build()
        );
        PermissionEntity quarantineUpdate = permissionRepository.save(
                PermissionEntity.builder().name("QUARANTINE_UPDATE").description("Update quarantine").module("health").build()
        );
        PermissionEntity quarantineRelease = permissionRepository.save(
                PermissionEntity.builder().name("QUARANTINE_RELEASE").description("Release cow from quarantine").module("health").build()
        );
        PermissionEntity cowView = permissionRepository.save(
                PermissionEntity.builder().name("COW_VIEW").description("View cow profile").module("cows").build()
        );

        // 2. Roles
        RoleEntity adminRole = roleRepository.save(
                RoleEntity.builder()
                        .name("ROLE_ADMIN")
                        .description("Administrator")
                        .permissions(new HashSet<>(List.of(
                                healthView, healthCreate, healthUpdate, healthDelete,
                                treatmentView, treatmentCreate, treatmentUpdate, treatmentComplete,
                                quarantineView, quarantineCreate, quarantineUpdate, quarantineRelease,
                                cowView
                        )))
                        .build()
        );

        RoleEntity vetRole = roleRepository.save(
                RoleEntity.builder()
                        .name("ROLE_VETERINARIAN")
                        .description("Veterinarian")
                        .permissions(new HashSet<>(List.of(
                                healthView, healthCreate, healthUpdate,
                                treatmentView, treatmentCreate, treatmentUpdate, treatmentComplete,
                                quarantineView, quarantineCreate, quarantineUpdate, quarantineRelease,
                                cowView
                        )))
                        .build()
        );

        RoleEntity workerRole = roleRepository.save(
                RoleEntity.builder()
                        .name("ROLE_WORKER")
                        .description("Farm Worker")
                        .permissions(new HashSet<>(List.of(healthView, treatmentView, quarantineView, cowView)))
                        .build()
        );

        RoleEntity customerRole = roleRepository.save(
                RoleEntity.builder()
                        .name("ROLE_CUSTOMER")
                        .description("Customer")
                        .permissions(new HashSet<>())
                        .build()
        );

        // 3. Users
        User adminUser = userRepository.save(
                User.builder()
                        .username("admin_user")
                        .firstName("Admin")
                        .lastName("User")
                        .email("admin@dairyflow.com")
                        .passwordHash(passwordEncoder.encode("Password123!"))
                        .roles(new HashSet<>(Collections.singletonList(adminRole)))
                        .status("ACTIVE")
                        .build()
        );

        testVet = userRepository.save(
                User.builder()
                        .username("vet_user")
                        .firstName("Sarah")
                        .lastName("Jenkins")
                        .email("vet@dairyflow.com")
                        .passwordHash(passwordEncoder.encode("Password123!"))
                        .roles(new HashSet<>(Collections.singletonList(vetRole)))
                        .status("ACTIVE")
                        .build()
        );

        User workerUser = userRepository.save(
                User.builder()
                        .username("worker_user")
                        .firstName("Bob")
                        .lastName("Worker")
                        .email("worker@dairyflow.com")
                        .passwordHash(passwordEncoder.encode("Password123!"))
                        .roles(new HashSet<>(Collections.singletonList(workerRole)))
                        .status("ACTIVE")
                        .build()
        );

        User customerUser = userRepository.save(
                User.builder()
                        .username("customer_user")
                        .firstName("Charlie")
                        .lastName("Customer")
                        .email("customer@dairyflow.com")
                        .passwordHash(passwordEncoder.encode("Password123!"))
                        .roles(new HashSet<>(Collections.singletonList(customerRole)))
                        .status("ACTIVE")
                        .build()
        );

        // 4. JWT Tokens
        adminToken = jwtService.generateToken(UserPrincipal.create(adminUser));
        vetToken = jwtService.generateToken(UserPrincipal.create(testVet));
        workerToken = jwtService.generateToken(UserPrincipal.create(workerUser));
        customerToken = jwtService.generateToken(UserPrincipal.create(customerUser));

        // 5. Test Cow
        testCow = cowRepository.save(
                Cow.builder()
                        .tagNumber("COW-042")
                        .name("Aurora")
                        .breed(Breed.HOLSTEIN)
                        .gender(Gender.FEMALE)
                        .healthStatus(HealthStatus.HEALTHY)
                        .lifecycleStatus(LifecycleStatus.ACTIVE)
                        .dateOfBirth(LocalDate.now().minusYears(3))
                        .pen("Barn A")
                        .build()
        );
    }

    @org.junit.jupiter.api.AfterEach
    void tearDown() {
        treatmentRepository.deleteAll();
        quarantineRecordRepository.deleteAll();
        healthRecordRepository.deleteAll();
        cowRepository.deleteAll();
    }

    // ==========================================
    // HEALTH RECORDS API TESTS
    // ==========================================

    @Test
    @DisplayName("POST /api/v1/health/records - Admin/Vet can create record")
    void shouldCreateHealthRecord() throws Exception {
        CreateHealthRecordRequest request = CreateHealthRecordRequest.builder()
                .cowId(testCow.getId())
                .recordDate(LocalDate.now())
                .healthStatus(CowHealthStatus.UNDER_TREATMENT)
                .diagnosis("Subclinical Mastitis")
                .symptoms("Elevated somatic cell count")
                .temperature(39.3)
                .weight(610.5)
                .veterinarianId(testVet.getId())
                .notes("Observed during routine screening")
                .build();

        mockMvc.perform(post("/api/v1/health/records")
                        .header("Authorization", "Bearer " + vetToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.diagnosis").value("Subclinical Mastitis"))
                .andExpect(jsonPath("$.data.cowTagNumber").value("COW-042"))
                .andExpect(jsonPath("$.data.veterinarianName").value("Sarah Jenkins"));
    }

    @Test
    @DisplayName("GET /api/v1/health/records - List health records with filters")
    void shouldListHealthRecords() throws Exception {
        healthRecordRepository.save(
                HealthRecord.builder()
                        .cow(testCow)
                        .recordDate(LocalDate.now())
                        .healthStatus(CowHealthStatus.HEALTHY)
                        .diagnosis("General Checkup")
                        .build()
        );

        mockMvc.perform(get("/api/v1/health/records")
                        .header("Authorization", "Bearer " + workerToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.content[0].diagnosis").value("General Checkup"));
    }

    // ==========================================
    // TREATMENT API TESTS
    // ==========================================

    @Test
    @DisplayName("POST /api/v1/health/treatments - Prescribe treatment and compute withdrawal")
    void shouldPrescribeTreatmentAndComputeWithdrawal() throws Exception {
        CreateTreatmentRequest request = CreateTreatmentRequest.builder()
                .cowId(testCow.getId())
                .treatmentDate(LocalDate.now())
                .diagnosis("Acute Mastitis")
                .treatmentType("Antibiotic")
                .medication("Ceftiofur 50mg/ml")
                .dosage("10ml")
                .frequency("Daily")
                .route("Intramuscular")
                .startDate(LocalDate.now())
                .endDate(LocalDate.now().plusDays(4))
                .withdrawalDays(5)
                .veterinarianId(testVet.getId())
                .instructions("Administer after morning milking")
                .build();

        mockMvc.perform(post("/api/v1/health/treatments")
                        .header("Authorization", "Bearer " + vetToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.medication").value("Ceftiofur 50mg/ml"))
                .andExpect(jsonPath("$.data.status").value("ACTIVE"))
                .andExpect(jsonPath("$.data.withdrawalDays").value(5))
                .andExpect(jsonPath("$.data.withdrawalActive").value(true));

        // Cow should now be UNDER_TREATMENT
        Cow updated = cowRepository.findById(testCow.getId()).orElseThrow();
        assertThat(updated.getHealthStatus()).isEqualTo(HealthStatus.UNDER_TREATMENT);
    }

    @Test
    @DisplayName("POST /api/v1/health/treatments/{id}/complete - Complete treatment")
    void shouldCompleteTreatment() throws Exception {
        Treatment treatment = treatmentRepository.save(
                Treatment.builder()
                        .cow(testCow)
                        .treatmentDate(LocalDate.now().minusDays(3))
                        .diagnosis("Mastitis")
                        .medication("Penicillin")
                        .dosage("5ml")
                        .startDate(LocalDate.now().minusDays(3))
                        .endDate(LocalDate.now())
                        .status(TreatmentStatus.ACTIVE)
                        .build()
        );

        CompleteTreatmentRequest request = CompleteTreatmentRequest.builder()
                .completionDate(LocalDate.now())
                .notes("Infection resolved")
                .build();

        mockMvc.perform(post("/api/v1/health/treatments/" + treatment.getId() + "/complete")
                        .header("Authorization", "Bearer " + vetToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.status").value("COMPLETED"));
    }

    // ==========================================
    // QUARANTINE API TESTS
    // ==========================================

    @Test
    @DisplayName("POST /api/v1/health/quarantine - Quarantine cow & prevent duplicate")
    void shouldQuarantineCowAndPreventDuplicate() throws Exception {
        CreateQuarantineRequest request = CreateQuarantineRequest.builder()
                .cowId(testCow.getId())
                .startDate(LocalDate.now())
                .expectedReleaseDate(LocalDate.now().plusDays(14))
                .reason("Infectious Foot Rot")
                .location("Bay 01 - North")
                .veterinarianId(testVet.getId())
                .notes("Keep isolated from main herd")
                .build();

        // 1. First quarantine succeeds
        mockMvc.perform(post("/api/v1/health/quarantine")
                        .header("Authorization", "Bearer " + vetToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.location").value("Bay 01 - North"))
                .andExpect(jsonPath("$.data.status").value("ACTIVE"));

        // Cow status is now QUARANTINED
        Cow quarantined = cowRepository.findById(testCow.getId()).orElseThrow();
        assertThat(quarantined.getHealthStatus()).isEqualTo(HealthStatus.QUARANTINED);
        assertThat(quarantined.getPen()).isEqualTo("Bay 01 - North");

        // 2. Duplicate active quarantine on same cow must return 409 Conflict
        mockMvc.perform(post("/api/v1/health/quarantine")
                        .header("Authorization", "Bearer " + vetToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.error").value("COW_ALREADY_QUARANTINED"));
    }

    @Test
    @DisplayName("POST /api/v1/health/quarantine/{id}/release - Release cow from quarantine")
    void shouldReleaseQuarantine() throws Exception {
        QuarantineRecord record = quarantineRecordRepository.save(
                QuarantineRecord.builder()
                        .cow(testCow)
                        .startDate(LocalDate.now().minusDays(10))
                        .location("Bay 02")
                        .reason("Fever")
                        .status(QuarantineStatus.ACTIVE)
                        .build()
        );

        ReleaseQuarantineRequest request = ReleaseQuarantineRequest.builder()
                .actualReleaseDate(LocalDate.now())
                .nextHealthStatus(CowHealthStatus.HEALTHY)
                .notes("Clear to return to milking line")
                .build();

        mockMvc.perform(post("/api/v1/health/quarantine/" + record.getId() + "/release")
                        .header("Authorization", "Bearer " + vetToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.status").value("RELEASED"));

        Cow released = cowRepository.findById(testCow.getId()).orElseThrow();
        assertThat(released.getHealthStatus()).isEqualTo(HealthStatus.HEALTHY);
    }

    // ==========================================
    // WITHDRAWALS & SUMMARY API TESTS
    // ==========================================

    @Test
    @DisplayName("GET /api/v1/health/withdrawals & /summary - Check real metrics")
    void shouldReturnActiveWithdrawalsAndHealthSummary() throws Exception {
        // Create an active antibiotic treatment with withdrawal
        treatmentRepository.save(
                Treatment.builder()
                        .cow(testCow)
                        .treatmentDate(LocalDate.now())
                        .diagnosis("Mastitis")
                        .medication("Ceftiofur")
                        .dosage("10ml")
                        .startDate(LocalDate.now())
                        .endDate(LocalDate.now().plusDays(2))
                        .withdrawalDays(5)
                        .withdrawalEndDate(LocalDate.now().plusDays(7))
                        .status(TreatmentStatus.ACTIVE)
                        .build()
        );

        // Check active withdrawals
        mockMvc.perform(get("/api/v1/health/withdrawals")
                        .header("Authorization", "Bearer " + workerToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data[0].cowTagNumber").value("COW-042"))
                .andExpect(jsonPath("$.data[0].medication").value("Ceftiofur"))
                .andExpect(jsonPath("$.data[0].milkEligible").value(false));

        // Check summary
        mockMvc.perform(get("/api/v1/health/summary")
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.totalCows").value(1))
                .andExpect(jsonPath("$.data.activeWithdrawalsCount").value(1))
                .andExpect(jsonPath("$.data.activeTreatmentsCount").value(1));
    }

    // ==========================================
    // COW HEALTH INTEGRATION ENDPOINTS
    // ==========================================

    @Test
    @DisplayName("GET /api/v1/cows/{cowId}/health, treatments, quarantine, withdrawal-status")
    void shouldReturnCowSpecificHealthData() throws Exception {
        mockMvc.perform(get("/api/v1/cows/" + testCow.getId() + "/withdrawal-status")
                        .header("Authorization", "Bearer " + workerToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.milkEligible").value(true));

        mockMvc.perform(get("/api/v1/cows/" + testCow.getId() + "/health")
                        .header("Authorization", "Bearer " + workerToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));

        mockMvc.perform(get("/api/v1/cows/" + testCow.getId() + "/treatments")
                        .header("Authorization", "Bearer " + workerToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));

        mockMvc.perform(get("/api/v1/cows/" + testCow.getId() + "/quarantine")
                        .header("Authorization", "Bearer " + workerToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));
    }

    // ==========================================
    // SECURITY & RBAC TESTS
    // ==========================================

    @Test
    @DisplayName("ROLE_CUSTOMER is forbidden (403) from health management")
    void shouldForbidCustomerFromHealthApis() throws Exception {
        mockMvc.perform(get("/api/v1/health/summary")
                        .header("Authorization", "Bearer " + customerToken))
                .andExpect(status().isForbidden());

        CreateHealthRecordRequest req = CreateHealthRecordRequest.builder()
                .cowId(testCow.getId())
                .recordDate(LocalDate.now())
                .healthStatus(CowHealthStatus.HEALTHY)
                .diagnosis("Test")
                .build();

        mockMvc.perform(post("/api/v1/health/records")
                        .header("Authorization", "Bearer " + customerToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isForbidden());
    }

    @Test
    @DisplayName("Unauthenticated request returns 401 Unauthorized")
    void shouldReturnUnauthorizedWhenNoToken() throws Exception {
        mockMvc.perform(get("/api/v1/health/summary"))
                .andExpect(status().isUnauthorized());
    }
}
