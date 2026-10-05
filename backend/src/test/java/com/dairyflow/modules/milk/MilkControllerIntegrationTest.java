package com.dairyflow.modules.milk;

import com.dairyflow.modules.cows.entity.Cow;
import com.dairyflow.modules.cows.entity.enums.Breed;
import com.dairyflow.modules.cows.entity.enums.Gender;
import com.dairyflow.modules.cows.entity.enums.HealthStatus;
import com.dairyflow.modules.cows.entity.enums.LifecycleStatus;
import com.dairyflow.modules.cows.repository.CowRepository;
import com.dairyflow.modules.milk.dto.BatchMilkRecordRequest;
import com.dairyflow.modules.milk.dto.CreateMilkRecordRequest;
import com.dairyflow.modules.milk.dto.UpdateMilkRecordRequest;
import com.dairyflow.modules.milk.entity.MilkProductionRecord;
import com.dairyflow.modules.milk.entity.enums.MilkRecordStatus;
import com.dairyflow.modules.milk.entity.enums.MilkShift;
import com.dairyflow.modules.milk.repository.MilkRepository;
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
class MilkControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private MilkRepository milkRepository;

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
    private Cow testCow;

    @BeforeEach
    void setUp() {
        if (treatmentRepository != null) treatmentRepository.deleteAll();
        if (quarantineRecordRepository != null) quarantineRecordRepository.deleteAll();
        if (healthRecordRepository != null) healthRecordRepository.deleteAll();
        milkRepository.deleteAll();
        cowRepository.deleteAll();
        refreshTokenRepository.deleteAll();
        passwordResetTokenRepository.deleteAll();
        userRepository.deleteAll();
        roleRepository.deleteAll();
        permissionRepository.deleteAll();

        // 1. Permissions
        PermissionEntity milkView = permissionRepository.save(
                PermissionEntity.builder().name("MILK_VIEW").description("View milk logs").module("milk").build()
        );
        PermissionEntity milkCreate = permissionRepository.save(
                PermissionEntity.builder().name("MILK_CREATE").description("Record milk").module("milk").build()
        );
        PermissionEntity milkUpdate = permissionRepository.save(
                PermissionEntity.builder().name("MILK_UPDATE").description("Update milk").module("milk").build()
        );
        PermissionEntity milkDelete = permissionRepository.save(
                PermissionEntity.builder().name("MILK_DELETE").description("Delete milk").module("milk").build()
        );

        // 2. Roles
        RoleEntity adminRole = roleRepository.save(
                RoleEntity.builder()
                        .name("ROLE_ADMIN")
                        .description("Admin")
                        .permissions(new HashSet<>(List.of(milkView, milkCreate, milkUpdate, milkDelete)))
                        .build()
        );

        RoleEntity workerRole = roleRepository.save(
                RoleEntity.builder()
                        .name("ROLE_WORKER")
                        .description("Worker")
                        .permissions(new HashSet<>(List.of(milkView, milkCreate, milkUpdate)))
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
                        .email("admin@dairyflow.com")
                        .passwordHash(passwordEncoder.encode("password123"))
                        .firstName("Admin")
                        .lastName("Lead")
                        .status("ACTIVE")
                        .roles(new HashSet<>(Collections.singletonList(adminRole)))
                        .build()
        );

        User workerUser = userRepository.save(
                User.builder()
                        .username("worker_user")
                        .email("worker@dairyflow.com")
                        .passwordHash(passwordEncoder.encode("password123"))
                        .firstName("Marcus")
                        .lastName("Vance")
                        .status("ACTIVE")
                        .roles(new HashSet<>(Collections.singletonList(workerRole)))
                        .build()
        );

        User customerUser = userRepository.save(
                User.builder()
                        .username("customer_user")
                        .email("customer@dairyflow.com")
                        .passwordHash(passwordEncoder.encode("password123"))
                        .firstName("Alice")
                        .lastName("Smith")
                        .status("ACTIVE")
                        .roles(new HashSet<>(Collections.singletonList(customerRole)))
                        .build()
        );

        adminToken = jwtService.generateToken(UserPrincipal.create(adminUser));
        workerToken = jwtService.generateToken(UserPrincipal.create(workerUser));
        customerToken = jwtService.generateToken(UserPrincipal.create(customerUser));

        // 4. Test Cow
        testCow = cowRepository.save(
                Cow.builder()
                        .tagNumber("DF-1042")
                        .name("Aurora")
                        .breed(Breed.HOLSTEIN_FRIESIAN)
                        .gender(Gender.FEMALE)
                        .dateOfBirth(LocalDate.of(2022, 4, 15))
                        .parity(2)
                        .healthStatus(HealthStatus.HEALTHY)
                        .lifecycleStatus(LifecycleStatus.ACTIVE)
                        .barn("Barn A")
                        .pen("Pen 04")
                        .build()
        );
    }

    @Test
    @DisplayName("POST /api/v1/milk should record milk entry and return 201 Created")
    void shouldRecordMilkSuccessfully() throws Exception {
        CreateMilkRecordRequest request = CreateMilkRecordRequest.builder()
                .cowId(testCow.getId())
                .productionDate(LocalDate.now())
                .shift(MilkShift.MORNING)
                .quantityLiters(28.5)
                .status(MilkRecordStatus.BULK)
                .notes("Normal morning parlor flow")
                .build();

        mockMvc.perform(post("/api/v1/milk")
                        .header("Authorization", "Bearer " + workerToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.data.cowTagNumber").value("DF-1042"))
                .andExpect(jsonPath("$.data.quantityLiters").value(28.5))
                .andExpect(jsonPath("$.data.shift").value("MORNING"))
                .andExpect(jsonPath("$.data.status").value("BULK"));

        assertThat(milkRepository.existsByCowIdAndProductionDateAndShift(testCow.getId(), LocalDate.now(), MilkShift.MORNING))
                .isTrue();
    }

    @Test
    @DisplayName("POST /api/v1/milk should return 409 Conflict when duplicate session entry is submitted")
    void shouldReturn409OnDuplicateEntry() throws Exception {
        milkRepository.save(
                MilkProductionRecord.builder()
                        .cow(testCow)
                        .productionDate(LocalDate.now())
                        .shift(MilkShift.MORNING)
                        .quantityLiters(25.0)
                        .status(MilkRecordStatus.BULK)
                        .build()
        );

        CreateMilkRecordRequest duplicateReq = CreateMilkRecordRequest.builder()
                .cowId(testCow.getId())
                .productionDate(LocalDate.now())
                .shift(MilkShift.MORNING)
                .quantityLiters(26.0)
                .build();

        mockMvc.perform(post("/api/v1/milk")
                        .header("Authorization", "Bearer " + workerToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(duplicateReq)))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.error").value("DUPLICATE_MILK_RECORD"))
                .andExpect(jsonPath("$.message").value(org.hamcrest.Matchers.containsString("already exists")));
    }

    @Test
    @DisplayName("POST /api/v1/milk/batch should log batch milking session from parlor")
    void shouldRecordBatchMilkingSession() throws Exception {
        Cow secondCow = cowRepository.save(
                Cow.builder()
                        .tagNumber("DF-1043")
                        .name("Clover")
                        .breed(Breed.JERSEY)
                        .gender(Gender.FEMALE)
                        .dateOfBirth(LocalDate.of(2021, 5, 20))
                        .parity(3)
                        .healthStatus(HealthStatus.HEALTHY)
                        .lifecycleStatus(LifecycleStatus.ACTIVE)
                        .build()
        );

        BatchMilkRecordRequest batchReq = BatchMilkRecordRequest.builder()
                .productionDate(LocalDate.now())
                .shift(MilkShift.MORNING)
                .records(List.of(
                        BatchMilkRecordRequest.BatchMilkEntryItem.builder()
                                .cowId(testCow.getId())
                                .quantityLiters(30.2)
                                .status(MilkRecordStatus.BULK)
                                .build(),
                        BatchMilkRecordRequest.BatchMilkEntryItem.builder()
                                .cowId(secondCow.getId())
                                .quantityLiters(22.8)
                                .status(MilkRecordStatus.BULK)
                                .build()
                ))
                .build();

        mockMvc.perform(post("/api/v1/milk/batch")
                        .header("Authorization", "Bearer " + workerToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(batchReq)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.data.length()").value(2));

        assertThat(milkRepository.count()).isEqualTo(2);
    }

    @Test
    @DisplayName("GET /api/v1/milk/summary/daily should return morning, evening and total aggregations")
    void shouldReturnDailyMilkSummary() throws Exception {
        milkRepository.save(
                MilkProductionRecord.builder()
                        .cow(testCow)
                        .productionDate(LocalDate.now())
                        .shift(MilkShift.MORNING)
                        .quantityLiters(32.0)
                        .status(MilkRecordStatus.BULK)
                        .build()
        );
        milkRepository.save(
                MilkProductionRecord.builder()
                        .cow(testCow)
                        .productionDate(LocalDate.now())
                        .shift(MilkShift.EVENING)
                        .quantityLiters(28.0)
                        .status(MilkRecordStatus.BULK)
                        .build()
        );

        mockMvc.perform(get("/api/v1/milk/summary/daily")
                        .header("Authorization", "Bearer " + workerToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.morningLiters").value(32.0))
                .andExpect(jsonPath("$.data.eveningLiters").value(28.0))
                .andExpect(jsonPath("$.data.totalLiters").value(60.0))
                .andExpect(jsonPath("$.data.cowsMilked").value(2));
    }

    @Test
    @DisplayName("GET /api/v1/milk/summary/shift should return shift KPIs")
    void shouldReturnShiftMilkSummary() throws Exception {
        milkRepository.save(
                MilkProductionRecord.builder()
                        .cow(testCow)
                        .productionDate(LocalDate.now())
                        .shift(MilkShift.MORNING)
                        .quantityLiters(35.5)
                        .status(MilkRecordStatus.BULK)
                        .build()
        );

        mockMvc.perform(get("/api/v1/milk/summary/shift?shift=MORNING")
                        .header("Authorization", "Bearer " + workerToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.shift").value("MORNING"))
                .andExpect(jsonPath("$.data.totalYield").value(35.5))
                .andExpect(jsonPath("$.data.highestYield").value(35.5));
    }

    @Test
    @DisplayName("GET /api/v1/cows/{cowId}/milk should return paginated milk history for cow profile")
    void shouldReturnCowMilkHistory() throws Exception {
        milkRepository.save(
                MilkProductionRecord.builder()
                        .cow(testCow)
                        .productionDate(LocalDate.now().minusDays(1))
                        .shift(MilkShift.MORNING)
                        .quantityLiters(31.0)
                        .status(MilkRecordStatus.BULK)
                        .build()
        );

        mockMvc.perform(get("/api/v1/cows/" + testCow.getId() + "/milk")
                        .header("Authorization", "Bearer " + workerToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.content.length()").value(1))
                .andExpect(jsonPath("$.data.content[0].quantityLiters").value(31.0));
    }

    @Test
    @DisplayName("PUT /api/v1/milk/{id} should update milk yield and disposition")
    void shouldUpdateMilkRecord() throws Exception {
        MilkProductionRecord saved = milkRepository.save(
                MilkProductionRecord.builder()
                        .cow(testCow)
                        .productionDate(LocalDate.now())
                        .shift(MilkShift.MORNING)
                        .quantityLiters(25.0)
                        .status(MilkRecordStatus.BULK)
                        .build()
        );

        UpdateMilkRecordRequest updateReq = UpdateMilkRecordRequest.builder()
                .quantityLiters(24.5)
                .status(MilkRecordStatus.WASTE)
                .notes("Mastitis warning flag")
                .build();

        mockMvc.perform(put("/api/v1/milk/" + saved.getId())
                        .header("Authorization", "Bearer " + workerToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateReq)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.quantityLiters").value(24.5))
                .andExpect(jsonPath("$.data.status").value("WASTE"));

        MilkProductionRecord updated = milkRepository.findById(saved.getId()).orElseThrow();
        assertThat(updated.getStatus()).isEqualTo(MilkRecordStatus.WASTE);
    }

    @Test
    @DisplayName("DELETE /api/v1/milk/{id} should delete record when authorized with MILK_DELETE")
    void shouldDeleteMilkRecord() throws Exception {
        MilkProductionRecord saved = milkRepository.save(
                MilkProductionRecord.builder()
                        .cow(testCow)
                        .productionDate(LocalDate.now())
                        .shift(MilkShift.MORNING)
                        .quantityLiters(20.0)
                        .status(MilkRecordStatus.BULK)
                        .build()
        );

        mockMvc.perform(delete("/api/v1/milk/" + saved.getId())
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Milk record deleted successfully"));

        assertThat(milkRepository.existsById(saved.getId())).isFalse();
    }

    @Test
    @DisplayName("POST /api/v1/milk should return 403 Forbidden when user lacks MILK_CREATE authority")
    void shouldReturn403WhenForbidden() throws Exception {
        CreateMilkRecordRequest request = CreateMilkRecordRequest.builder()
                .cowId(testCow.getId())
                .productionDate(LocalDate.now())
                .shift(MilkShift.MORNING)
                .quantityLiters(25.0)
                .build();

        mockMvc.perform(post("/api/v1/milk")
                        .header("Authorization", "Bearer " + customerToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isForbidden());
    }

    @Test
    @DisplayName("GET /api/v1/milk should return 401 Unauthorized when request lacks authorization token")
    void shouldReturn401WhenUnauthorized() throws Exception {
        mockMvc.perform(get("/api/v1/milk"))
                .andExpect(status().isUnauthorized());
    }
}
