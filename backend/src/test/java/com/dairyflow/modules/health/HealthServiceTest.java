package com.dairyflow.modules.health;

import com.dairyflow.common.audit.AuditService;
import com.dairyflow.common.exception.BadRequestException;
import com.dairyflow.common.exception.ConflictException;
import com.dairyflow.common.exception.ResourceNotFoundException;
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
import com.dairyflow.modules.health.exception.CowAlreadyQuarantinedException;
import com.dairyflow.modules.health.mapper.HealthMapper;
import com.dairyflow.modules.health.repository.HealthRecordRepository;
import com.dairyflow.modules.health.repository.QuarantineRecordRepository;
import com.dairyflow.modules.health.repository.TreatmentRepository;
import com.dairyflow.modules.health.service.HealthServiceImpl;
import com.dairyflow.modules.users.entity.User;
import com.dairyflow.modules.users.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class HealthServiceTest {

    @Mock
    private HealthRecordRepository healthRecordRepository;

    @Mock
    private TreatmentRepository treatmentRepository;

    @Mock
    private QuarantineRecordRepository quarantineRecordRepository;

    @Mock
    private CowRepository cowRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private HealthMapper healthMapper;

    @Mock
    private AuditService auditService;

    @InjectMocks
    private HealthServiceImpl healthService;

    private Cow testCow;
    private User testVet;
    private HealthRecord testHealthRecord;
    private Treatment testTreatment;
    private QuarantineRecord testQuarantine;

    @BeforeEach
    void setUp() {
        testCow = Cow.builder()
                .id(UUID.randomUUID())
                .tagNumber("COW-042")
                .name("Aurora")
                .breed(Breed.HOLSTEIN)
                .gender(Gender.FEMALE)
                .healthStatus(HealthStatus.HEALTHY)
                .lifecycleStatus(LifecycleStatus.ACTIVE)
                .pen("Barn A")
                .build();

        testVet = User.builder()
                .id(UUID.randomUUID())
                .username("dr_jenkins")
                .firstName("Sarah")
                .lastName("Jenkins")
                .email("dr.jenkins@dairyflow.com")
                .status("ACTIVE")
                .build();

        testHealthRecord = HealthRecord.builder()
                .id(UUID.randomUUID())
                .cow(testCow)
                .recordDate(LocalDate.now())
                .healthStatus(CowHealthStatus.UNDER_TREATMENT)
                .diagnosis("Mastitis")
                .symptoms("Swelling in rear right quarter")
                .temperature(39.2)
                .weight(620.0)
                .veterinarian(testVet)
                .notes("Observed during morning milking")
                .build();

        testTreatment = Treatment.builder()
                .id(UUID.randomUUID())
                .cow(testCow)
                .healthRecord(testHealthRecord)
                .treatmentDate(LocalDate.now())
                .diagnosis("Mastitis")
                .treatmentType("Antibiotic")
                .medication("Ceftiofur 50mg/ml")
                .dosage("10ml")
                .frequency("Daily")
                .route("Intramuscular")
                .startDate(LocalDate.now())
                .endDate(LocalDate.now().plusDays(4))
                .withdrawalDays(5)
                .withdrawalEndDate(LocalDate.now().plusDays(9))
                .veterinarian(testVet)
                .status(TreatmentStatus.ACTIVE)
                .build();

        testQuarantine = QuarantineRecord.builder()
                .id(UUID.randomUUID())
                .cow(testCow)
                .startDate(LocalDate.now())
                .expectedReleaseDate(LocalDate.now().plusDays(14))
                .reason("Suspected Bovine Viral Diarrhea")
                .location("Bay 01 - North")
                .status(QuarantineStatus.ACTIVE)
                .veterinarian(testVet)
                .build();
    }

    // ==========================================
    // HEALTH RECORD TESTS
    // ==========================================

    @Test
    @DisplayName("Should create health record successfully and update cow status")
    void shouldCreateHealthRecord() {
        CreateHealthRecordRequest request = CreateHealthRecordRequest.builder()
                .cowId(testCow.getId())
                .recordDate(LocalDate.now())
                .healthStatus(CowHealthStatus.OBSERVATION)
                .diagnosis("Mild fever")
                .temperature(39.1)
                .veterinarianId(testVet.getId())
                .build();

        HealthRecord savedEntity = HealthRecord.builder()
                .id(UUID.randomUUID())
                .cow(testCow)
                .recordDate(request.getRecordDate())
                .healthStatus(request.getHealthStatus())
                .diagnosis(request.getDiagnosis())
                .build();

        HealthRecordResponse response = HealthRecordResponse.builder()
                .id(savedEntity.getId())
                .cowId(testCow.getId())
                .cowTagNumber(testCow.getTagNumber())
                .diagnosis("Mild fever")
                .build();

        when(cowRepository.findById(testCow.getId())).thenReturn(Optional.of(testCow));
        when(userRepository.findById(testVet.getId())).thenReturn(Optional.of(testVet));
        when(healthMapper.toEntity(eq(request), eq(testCow), eq(testVet))).thenReturn(savedEntity);
        when(healthRecordRepository.save(any(HealthRecord.class))).thenReturn(savedEntity);
        when(healthMapper.toResponse(savedEntity)).thenReturn(response);

        HealthRecordResponse result = healthService.createHealthRecord(request);

        assertThat(result).isNotNull();
        assertThat(result.getDiagnosis()).isEqualTo("Mild fever");
        verify(healthRecordRepository).save(any(HealthRecord.class));
        verify(auditService).logAction(eq("HealthRecord"), any(), eq("HEALTH_RECORD_CREATED"), any(), any(), any());
    }

    @Test
    @DisplayName("Should throw ResourceNotFoundException when creating record for non-existent cow")
    void shouldThrowWhenCowNotFoundForHealthRecord() {
        UUID nonExistent = UUID.randomUUID();
        CreateHealthRecordRequest request = CreateHealthRecordRequest.builder()
                .cowId(nonExistent)
                .recordDate(LocalDate.now())
                .healthStatus(CowHealthStatus.HEALTHY)
                .diagnosis("Routine")
                .build();

        when(cowRepository.findById(nonExistent)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> healthService.createHealthRecord(request))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Cow not found");
    }

    // ==========================================
    // TREATMENT TESTS
    // ==========================================

    @Test
    @DisplayName("Should create treatment, calculate withdrawal end date and set cow UNDER_TREATMENT")
    void shouldCreateTreatmentSuccessfully() {
        CreateTreatmentRequest request = CreateTreatmentRequest.builder()
                .cowId(testCow.getId())
                .diagnosis("Mastitis")
                .treatmentType("Antibiotic")
                .medication("Ceftiofur 50mg/ml")
                .dosage("10ml")
                .startDate(LocalDate.now())
                .endDate(LocalDate.now().plusDays(3))
                .withdrawalDays(5)
                .veterinarianId(testVet.getId())
                .build();

        Treatment saved = Treatment.builder()
                .id(UUID.randomUUID())
                .cow(testCow)
                .diagnosis(request.getDiagnosis())
                .medication(request.getMedication())
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .withdrawalDays(5)
                .withdrawalEndDate(request.getEndDate().plusDays(5))
                .status(TreatmentStatus.ACTIVE)
                .build();

        TreatmentResponse response = TreatmentResponse.builder()
                .id(saved.getId())
                .cowId(testCow.getId())
                .medication(saved.getMedication())
                .status(TreatmentStatus.ACTIVE)
                .withdrawalDays(5)
                .withdrawalEndDate(saved.getWithdrawalEndDate())
                .build();

        when(cowRepository.findById(testCow.getId())).thenReturn(Optional.of(testCow));
        when(userRepository.findById(testVet.getId())).thenReturn(Optional.of(testVet));
        when(healthMapper.toEntity(eq(request), eq(testCow), isNull(), eq(testVet))).thenReturn(saved);
        when(treatmentRepository.save(any(Treatment.class))).thenReturn(saved);
        when(healthMapper.toResponse(saved)).thenReturn(response);

        TreatmentResponse result = healthService.createTreatment(request);

        assertThat(result).isNotNull();
        assertThat(result.getMedication()).isEqualTo("Ceftiofur 50mg/ml");
        assertThat(testCow.getHealthStatus()).isEqualTo(HealthStatus.UNDER_TREATMENT);
        verify(cowRepository).save(testCow);
        verify(treatmentRepository).save(any(Treatment.class));
        verify(auditService).logAction(eq("Treatment"), any(), eq("TREATMENT_CREATED"), any(), any(), any());
    }

    @Test
    @DisplayName("Should reject treatment if end date is before start date")
    void shouldRejectTreatmentWithInvalidDateRange() {
        CreateTreatmentRequest request = CreateTreatmentRequest.builder()
                .cowId(testCow.getId())
                .diagnosis("Mastitis")
                .startDate(LocalDate.now())
                .endDate(LocalDate.now().minusDays(1))
                .build();

        when(cowRepository.findById(testCow.getId())).thenReturn(Optional.of(testCow));

        assertThatThrownBy(() -> healthService.createTreatment(request))
                .isInstanceOf(BadRequestException.class)
                .hasMessageContaining("end date cannot be before start date");
    }

    @Test
    @DisplayName("Should complete treatment and transition cow status to RECOVERING when no active treatments remain")
    void shouldCompleteTreatmentSuccessfully() {
        UUID treatmentId = testTreatment.getId();
        testCow.setHealthStatus(HealthStatus.UNDER_TREATMENT);

        when(treatmentRepository.findWithDetailsById(treatmentId)).thenReturn(Optional.of(testTreatment));
        when(treatmentRepository.save(any(Treatment.class))).thenReturn(testTreatment);
        when(treatmentRepository.findByCowIdAndStatus(testCow.getId(), TreatmentStatus.ACTIVE)).thenReturn(List.of());

        TreatmentResponse response = TreatmentResponse.builder()
                .id(treatmentId)
                .status(TreatmentStatus.COMPLETED)
                .build();
        when(healthMapper.toResponse(testTreatment)).thenReturn(response);

        CompleteTreatmentRequest completeReq = CompleteTreatmentRequest.builder()
                .completionDate(LocalDate.now())
                .notes("All symptoms cleared")
                .build();

        TreatmentResponse result = healthService.completeTreatment(treatmentId, completeReq);

        assertThat(result.getStatus()).isEqualTo(TreatmentStatus.COMPLETED);
        assertThat(testTreatment.getStatus()).isEqualTo(TreatmentStatus.COMPLETED);
        assertThat(testCow.getHealthStatus()).isEqualTo(HealthStatus.RECOVERING);
        verify(cowRepository).save(testCow);
    }

    @Test
    @DisplayName("Should throw ConflictException if completing an already completed treatment")
    void shouldThrowWhenCompletingAlreadyCompletedTreatment() {
        testTreatment.setStatus(TreatmentStatus.COMPLETED);
        when(treatmentRepository.findWithDetailsById(testTreatment.getId())).thenReturn(Optional.of(testTreatment));

        assertThatThrownBy(() -> healthService.completeTreatment(testTreatment.getId(), null))
                .isInstanceOf(ConflictException.class)
                .hasMessageContaining("already marked as completed");
    }

    // ==========================================
    // QUARANTINE TESTS
    // ==========================================

    @Test
    @DisplayName("Should quarantine cow, update cow pen and healthStatus to QUARANTINED")
    void shouldQuarantineCowSuccessfully() {
        CreateQuarantineRequest request = CreateQuarantineRequest.builder()
                .cowId(testCow.getId())
                .startDate(LocalDate.now())
                .expectedReleaseDate(LocalDate.now().plusDays(10))
                .reason("Infectious Foot Rot")
                .location("Bay 03 - South")
                .veterinarianId(testVet.getId())
                .build();

        when(cowRepository.findById(testCow.getId())).thenReturn(Optional.of(testCow));
        when(quarantineRecordRepository.existsByCowIdAndStatus(testCow.getId(), QuarantineStatus.ACTIVE)).thenReturn(false);
        when(userRepository.findById(testVet.getId())).thenReturn(Optional.of(testVet));
        when(healthMapper.toEntity(eq(request), eq(testCow), eq(testVet))).thenReturn(testQuarantine);
        when(quarantineRecordRepository.save(any(QuarantineRecord.class))).thenReturn(testQuarantine);

        QuarantineResponse response = QuarantineResponse.builder()
                .id(testQuarantine.getId())
                .cowId(testCow.getId())
                .location("Bay 03 - South")
                .status(QuarantineStatus.ACTIVE)
                .build();
        when(healthMapper.toResponse(testQuarantine)).thenReturn(response);

        QuarantineResponse result = healthService.createQuarantine(request);

        assertThat(result).isNotNull();
        assertThat(testCow.getHealthStatus()).isEqualTo(HealthStatus.QUARANTINED);
        assertThat(testCow.getPen()).isEqualTo("Bay 03 - South");
        verify(cowRepository).save(testCow);
        verify(auditService).logAction(eq("QuarantineRecord"), any(), eq("QUARANTINE_STARTED"), any(), any(), any());
    }

    @Test
    @DisplayName("Should prevent duplicate active quarantine on the same cow")
    void shouldPreventDuplicateActiveQuarantine() {
        CreateQuarantineRequest request = CreateQuarantineRequest.builder()
                .cowId(testCow.getId())
                .startDate(LocalDate.now())
                .location("Bay 02")
                .reason("Test duplicate")
                .build();

        when(cowRepository.findById(testCow.getId())).thenReturn(Optional.of(testCow));
        when(quarantineRecordRepository.existsByCowIdAndStatus(testCow.getId(), QuarantineStatus.ACTIVE)).thenReturn(true);
        when(quarantineRecordRepository.findFirstByCowIdAndStatusOrderByStartDateDesc(testCow.getId(), QuarantineStatus.ACTIVE))
                .thenReturn(Optional.of(testQuarantine));

        assertThatThrownBy(() -> healthService.createQuarantine(request))
                .isInstanceOf(CowAlreadyQuarantinedException.class)
                .hasMessageContaining("already in active quarantine");
    }

    @Test
    @DisplayName("Should release quarantine and transition cow status")
    void shouldReleaseQuarantineSuccessfully() {
        UUID qId = testQuarantine.getId();
        testCow.setHealthStatus(HealthStatus.QUARANTINED);

        when(quarantineRecordRepository.findWithDetailsById(qId)).thenReturn(Optional.of(testQuarantine));
        when(quarantineRecordRepository.save(any(QuarantineRecord.class))).thenReturn(testQuarantine);

        QuarantineResponse response = QuarantineResponse.builder()
                .id(qId)
                .status(QuarantineStatus.RELEASED)
                .build();
        when(healthMapper.toResponse(testQuarantine)).thenReturn(response);

        ReleaseQuarantineRequest request = ReleaseQuarantineRequest.builder()
                .actualReleaseDate(LocalDate.now())
                .nextHealthStatus(CowHealthStatus.HEALTHY)
                .notes("Cleared veterinary inspection")
                .build();

        QuarantineResponse result = healthService.releaseQuarantine(qId, request);

        assertThat(result.getStatus()).isEqualTo(QuarantineStatus.RELEASED);
        assertThat(testQuarantine.getStatus()).isEqualTo(QuarantineStatus.RELEASED);
        assertThat(testCow.getHealthStatus()).isEqualTo(HealthStatus.HEALTHY);
        verify(cowRepository).save(testCow);
        verify(auditService).logAction(eq("QuarantineRecord"), any(), eq("QUARANTINE_RELEASED"), any(), any(), any());
    }

    // ==========================================
    // ANTIBIOTIC WITHDRAWAL & MILK ELIGIBILITY
    // ==========================================

    @Test
    @DisplayName("Should detect active withdrawal and mark cow as not eligible for milk collection")
    void shouldDetectActiveWithdrawal() {
        when(cowRepository.findById(testCow.getId())).thenReturn(Optional.of(testCow));
        when(treatmentRepository.findActiveWithdrawalsForCow(eq(testCow.getId()), any(LocalDate.class)))
                .thenReturn(List.of(testTreatment));

        CowWithdrawalStatusResponse status = healthService.getCowWithdrawalStatus(testCow.getId());

        assertThat(status).isNotNull();
        assertThat(status.isMilkEligible()).isFalse();
        assertThat(status.getActiveMedications()).contains("Ceftiofur 50mg/ml");

        boolean eligible = healthService.isCowMilkEligible(testCow.getId());
        assertThat(eligible).isFalse();
    }

    @Test
    @DisplayName("Should mark cow as milk eligible when no active withdrawals exist")
    void shouldMarkEligibleWhenNoActiveWithdrawals() {
        when(cowRepository.findById(testCow.getId())).thenReturn(Optional.of(testCow));
        when(treatmentRepository.findActiveWithdrawalsForCow(eq(testCow.getId()), any(LocalDate.class)))
                .thenReturn(List.of());

        CowWithdrawalStatusResponse status = healthService.getCowWithdrawalStatus(testCow.getId());

        assertThat(status).isNotNull();
        assertThat(status.isMilkEligible()).isTrue();
        assertThat(status.getActiveMedications()).isEmpty();

        boolean eligible = healthService.isCowMilkEligible(testCow.getId());
        assertThat(eligible).isTrue();
    }
}
