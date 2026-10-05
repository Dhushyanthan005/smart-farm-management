package com.dairyflow.modules.breeding;

import com.dairyflow.common.audit.AuditService;
import com.dairyflow.common.exception.BadRequestException;
import com.dairyflow.modules.breeding.dto.*;
import com.dairyflow.modules.breeding.entity.*;
import com.dairyflow.modules.breeding.entity.enums.*;
import com.dairyflow.modules.breeding.exception.ActivePregnancyConflictException;
import com.dairyflow.modules.breeding.exception.BreedingRecordNotFoundException;
import com.dairyflow.modules.breeding.exception.HeatRecordNotFoundException;
import com.dairyflow.modules.breeding.exception.PregnancyRecordNotFoundException;
import com.dairyflow.modules.breeding.mapper.BreedingMapper;
import com.dairyflow.modules.breeding.repository.*;
import com.dairyflow.modules.breeding.service.BreedingServiceImpl;
import com.dairyflow.modules.cows.entity.Cow;
import com.dairyflow.modules.cows.entity.enums.Breed;
import com.dairyflow.modules.cows.entity.enums.Gender;
import com.dairyflow.modules.cows.entity.enums.HealthStatus;
import com.dairyflow.modules.cows.entity.enums.LifecycleStatus;
import com.dairyflow.modules.cows.repository.CowRepository;
import com.dairyflow.modules.users.entity.User;
import com.dairyflow.modules.users.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class BreedingServiceTest {

    @Mock
    private HeatRecordRepository heatRecordRepository;

    @Mock
    private BreedingRecordRepository breedingRecordRepository;

    @Mock
    private PregnancyRecordRepository pregnancyRecordRepository;

    @Mock
    private CalvingRecordRepository calvingRecordRepository;

    @Mock
    private CowRepository cowRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private AuditService auditService;

    @Spy
    private BreedingMapper breedingMapper = new BreedingMapper();

    @InjectMocks
    private BreedingServiceImpl breedingService;

    private Cow testCow;
    private Cow testBull;
    private User testUser;
    private UUID cowId;

    @BeforeEach
    void setUp() {
        cowId = UUID.randomUUID();
        testCow = Cow.builder()
                .id(cowId)
                .tagNumber("COW-001")
                .name("Daisy")
                .breed(Breed.HOLSTEIN)
                .gender(Gender.FEMALE)
                .dateOfBirth(LocalDate.now().minusYears(3))
                .parity(1)
                .healthStatus(HealthStatus.HEALTHY)
                .lifecycleStatus(LifecycleStatus.ACTIVE)
                .currentMilkStatus("IN_MILK")
                .build();

        testBull = Cow.builder()
                .id(UUID.randomUUID())
                .tagNumber("BULL-99")
                .name("Maximus")
                .breed(Breed.HOLSTEIN)
                .gender(Gender.MALE)
                .dateOfBirth(LocalDate.now().minusYears(4))
                .parity(0)
                .healthStatus(HealthStatus.HEALTHY)
                .lifecycleStatus(LifecycleStatus.ACTIVE)
                .build();

        testUser = User.builder()
                .id(UUID.randomUUID())
                .username("vet_john")
                .firstName("John")
                .lastName("Doe")
                .build();
    }

    // ==========================================
    // HEAT DETECTION TESTS
    // ==========================================

    @Test
    @DisplayName("Should successfully record heat observation")
    void shouldCreateHeatRecord() {
        when(cowRepository.findById(cowId)).thenReturn(Optional.of(testCow));
        when(userRepository.findById(testUser.getId())).thenReturn(Optional.of(testUser));
        when(heatRecordRepository.save(any(HeatRecord.class))).thenAnswer(invocation -> {
            HeatRecord r = invocation.getArgument(0);
            r.setId(UUID.randomUUID());
            return r;
        });

        CreateHeatRecordRequest request = CreateHeatRecordRequest.builder()
                .cowId(cowId)
                .detectedAt(LocalDateTime.now().minusHours(2))
                .detectionMethod(HeatDetectionMethod.OBSERVATION)
                .signsObserved("Standing to be mounted, mucus discharge")
                .confidence(HeatConfidence.HIGH)
                .detectedById(testUser.getId())
                .build();

        HeatRecordResponse response = breedingService.createHeatRecord(request, "vet_john");

        assertThat(response).isNotNull();
        assertThat(response.getCowTagNumber()).isEqualTo("COW-001");
        assertThat(response.getDetectionMethod()).isEqualTo(HeatDetectionMethod.OBSERVATION);
        assertThat(response.getSignsObserved()).contains("Standing to be mounted");
        verify(auditService).logAction(eq("HeatRecord"), anyString(), eq("HEAT_RECORDED"), eq("vet_john"), anyString(), isNull());
    }

    // ==========================================
    // BREEDING RECORD TESTS
    // ==========================================

    @Test
    @DisplayName("Should successfully record breeding / insemination")
    void shouldCreateBreedingRecord() {
        when(cowRepository.findById(cowId)).thenReturn(Optional.of(testCow));
        when(breedingRecordRepository.save(any(BreedingRecord.class))).thenAnswer(invocation -> {
            BreedingRecord b = invocation.getArgument(0);
            b.setId(UUID.randomUUID());
            return b;
        });

        CreateBreedingRecordRequest request = CreateBreedingRecordRequest.builder()
                .cowId(cowId)
                .breedingDate(LocalDate.now())
                .breedingMethod(BreedingMethod.ARTIFICIAL_INSEMINATION)
                .semenReference("SEM-HOL-2026-X")
                .technicianName("Dr. Alex")
                .status(BreedingStatus.COMPLETED)
                .build();

        BreedingRecordResponse response = breedingService.createBreedingRecord(request, "admin");

        assertThat(response).isNotNull();
        assertThat(response.getCowTagNumber()).isEqualTo("COW-001");
        assertThat(response.getBreedingMethod()).isEqualTo(BreedingMethod.ARTIFICIAL_INSEMINATION);
        assertThat(response.getSemenReference()).isEqualTo("SEM-HOL-2026-X");
        assertThat(response.getStatus()).isEqualTo(BreedingStatus.COMPLETED);
    }

    @Test
    @DisplayName("Should fail breeding creation if breeding date is before observed heat date")
    void shouldRejectBreedingDateBeforeHeatDate() {
        when(cowRepository.findById(cowId)).thenReturn(Optional.of(testCow));

        UUID heatId = UUID.randomUUID();
        HeatRecord heatRecord = HeatRecord.builder()
                .id(heatId)
                .cow(testCow)
                .detectedAt(LocalDateTime.now().minusDays(2))
                .build();
        when(heatRecordRepository.findById(heatId)).thenReturn(Optional.of(heatRecord));

        CreateBreedingRecordRequest request = CreateBreedingRecordRequest.builder()
                .cowId(cowId)
                .heatRecordId(heatId)
                .breedingDate(LocalDate.now().minusDays(5)) // Impossible: 5 days ago vs heat 2 days ago
                .breedingMethod(BreedingMethod.NATURAL)
                .build();

        assertThatThrownBy(() -> breedingService.createBreedingRecord(request, "admin"))
                .isInstanceOf(BadRequestException.class)
                .hasMessageContaining("Breeding date cannot be earlier than the detected heat date");
    }

    // ==========================================
    // PREGNANCY TESTS
    // ==========================================

    @Test
    @DisplayName("Should reject duplicate active pregnancy for the same cow")
    void shouldRejectDuplicateActivePregnancy() {
        when(cowRepository.findById(cowId)).thenReturn(Optional.of(testCow));
        when(pregnancyRecordRepository.existsByCowIdAndPregnancyStatusIn(eq(cowId), anyList())).thenReturn(true);

        PregnancyRecord existing = PregnancyRecord.builder()
                .id(UUID.randomUUID())
                .cow(testCow)
                .pregnancyStatus(PregnancyStatus.CONFIRMED)
                .expectedCalvingDate(LocalDate.now().plusMonths(6))
                .build();
        when(pregnancyRecordRepository.findFirstByCowIdAndPregnancyStatusInOrderByCreatedAtDesc(eq(cowId), anyList()))
                .thenReturn(Optional.of(existing));

        CreatePregnancyRecordRequest request = CreatePregnancyRecordRequest.builder()
                .cowId(cowId)
                .pregnancyStatus(PregnancyStatus.PENDING)
                .build();

        assertThatThrownBy(() -> breedingService.createPregnancyRecord(request, "admin"))
                .isInstanceOf(ActivePregnancyConflictException.class);
    }

    @Test
    @DisplayName("Should calculate expected calving date as breeding date + 283 days upon confirmation")
    void shouldCalculateExpectedCalvingDateCorrectly() {
        UUID pregId = UUID.randomUUID();
        LocalDate breedingDate = LocalDate.now().minusDays(40);
        BreedingRecord breeding = BreedingRecord.builder()
                .id(UUID.randomUUID())
                .cow(testCow)
                .breedingDate(breedingDate)
                .build();

        PregnancyRecord record = PregnancyRecord.builder()
                .id(pregId)
                .cow(testCow)
                .breeding(breeding)
                .pregnancyStatus(PregnancyStatus.PENDING)
                .build();

        when(pregnancyRecordRepository.findWithDetailsById(pregId)).thenReturn(Optional.of(record));
        when(pregnancyRecordRepository.save(any(PregnancyRecord.class))).thenAnswer(invocation -> invocation.getArgument(0));

        ConfirmPregnancyRequest confirmRequest = ConfirmPregnancyRequest.builder()
                .confirmationDate(LocalDate.now())
                .confirmationMethod(PregnancyConfirmationMethod.ULTRASOUND)
                .confirmedByName("Dr. Smith")
                .build();

        PregnancyRecordResponse response = breedingService.confirmPregnancy(pregId, confirmRequest, "vet_john");

        assertThat(response).isNotNull();
        assertThat(response.getPregnancyStatus()).isEqualTo(PregnancyStatus.CONFIRMED);
        assertThat(response.getExpectedCalvingDate()).isEqualTo(breedingDate.plusDays(283));
        assertThat(testCow.getHealthStatus()).isEqualTo(HealthStatus.PREGNANT);
    }

    // ==========================================
    // CALVING TESTS
    // ==========================================

    @Test
    @DisplayName("Should successfully record calving, increment cow parity, and complete pregnancy")
    void shouldRecordCalvingAndIncrementParity() {
        when(cowRepository.findById(cowId)).thenReturn(Optional.of(testCow));

        UUID pregId = UUID.randomUUID();
        LocalDate breedingDate = LocalDate.now().minusDays(280);
        BreedingRecord breeding = BreedingRecord.builder()
                .id(UUID.randomUUID())
                .cow(testCow)
                .breedingDate(breedingDate)
                .build();

        PregnancyRecord pregnancy = PregnancyRecord.builder()
                .id(pregId)
                .cow(testCow)
                .breeding(breeding)
                .confirmationDate(breedingDate.plusDays(35))
                .pregnancyStatus(PregnancyStatus.CONFIRMED)
                .build();

        when(pregnancyRecordRepository.findById(pregId)).thenReturn(Optional.of(pregnancy));
        when(calvingRecordRepository.save(any(CalvingRecord.class))).thenAnswer(invocation -> {
            CalvingRecord c = invocation.getArgument(0);
            c.setId(UUID.randomUUID());
            return c;
        });

        int initialParity = testCow.getParity();

        CreateCalvingRecordRequest request = CreateCalvingRecordRequest.builder()
                .cowId(cowId)
                .pregnancyId(pregId)
                .calvingDate(LocalDate.now())
                .calvingType(CalvingType.NORMAL)
                .calfCount(1)
                .calfDetails("Female calf, 42kg, Tag #COW-NEW-01")
                .assistanceRequired(false)
                .build();

        CalvingRecordResponse response = breedingService.createCalvingRecord(request, "admin");

        assertThat(response).isNotNull();
        assertThat(response.getCalfCount()).isEqualTo(1);
        assertThat(response.getCalvingType()).isEqualTo(CalvingType.NORMAL);

        // Verify cow parity incremented
        assertThat(testCow.getParity()).isEqualTo(initialParity + 1);
        assertThat(testCow.getCurrentMilkStatus()).isEqualTo("FRESH");

        // Verify pregnancy transitioned to COMPLETED
        assertThat(pregnancy.getPregnancyStatus()).isEqualTo(PregnancyStatus.COMPLETED);
    }

    @Test
    @DisplayName("Should reject calving if calving date is before breeding date")
    void shouldRejectCalvingBeforeBreedingDate() {
        when(cowRepository.findById(cowId)).thenReturn(Optional.of(testCow));

        UUID pregId = UUID.randomUUID();
        BreedingRecord breeding = BreedingRecord.builder()
                .id(UUID.randomUUID())
                .cow(testCow)
                .breedingDate(LocalDate.now().minusDays(100))
                .build();

        PregnancyRecord pregnancy = PregnancyRecord.builder()
                .id(pregId)
                .cow(testCow)
                .breeding(breeding)
                .confirmationDate(LocalDate.now().minusDays(70))
                .build();

        when(pregnancyRecordRepository.findById(pregId)).thenReturn(Optional.of(pregnancy));

        CreateCalvingRecordRequest request = CreateCalvingRecordRequest.builder()
                .cowId(cowId)
                .pregnancyId(pregId)
                .calvingDate(LocalDate.now().minusDays(120)) // 120 days ago < 100 days ago
                .calvingType(CalvingType.NORMAL)
                .calfCount(1)
                .build();

        assertThatThrownBy(() -> breedingService.createCalvingRecord(request, "admin"))
                .isInstanceOf(BadRequestException.class)
                .hasMessageContaining("cannot be before");
    }

    // ==========================================
    // COW REPRODUCTIVE SUMMARY / TIMELINE TESTS
    // ==========================================

    @Test
    @DisplayName("Should return NEAR_CALVING status when confirmed expected calving is within 14 days")
    void shouldDeriveNearCalvingStatus() {
        when(cowRepository.findById(cowId)).thenReturn(Optional.of(testCow));

        PregnancyRecord preg = PregnancyRecord.builder()
                .id(UUID.randomUUID())
                .cow(testCow)
                .pregnancyStatus(PregnancyStatus.CONFIRMED)
                .expectedCalvingDate(LocalDate.now().plusDays(5)) // 5 days away!
                .build();

        when(pregnancyRecordRepository.findByCowIdOrderByCreatedAtDesc(cowId)).thenReturn(List.of(preg));
        when(heatRecordRepository.findByCowIdOrderByDetectedAtDesc(cowId)).thenReturn(Collections.emptyList());
        when(breedingRecordRepository.findByCowIdOrderByBreedingDateDesc(cowId)).thenReturn(Collections.emptyList());
        when(calvingRecordRepository.findByCowIdOrderByCalvingDateDesc(cowId)).thenReturn(Collections.emptyList());

        CowReproductiveSummaryResponse summary = breedingService.getCowReproductiveSummary(cowId);

        assertThat(summary).isNotNull();
        assertThat(summary.getReproductiveStatus()).isEqualTo(ReproductiveStatus.NEAR_CALVING);
    }
}
