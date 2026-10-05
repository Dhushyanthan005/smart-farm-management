package com.dairyflow.modules.cows;

import com.dairyflow.common.audit.AuditService;
import com.dairyflow.common.exception.BadRequestException;
import com.dairyflow.common.exception.ConflictException;
import com.dairyflow.modules.cows.dto.*;
import com.dairyflow.modules.cows.entity.Cow;
import com.dairyflow.modules.cows.entity.enums.Breed;
import com.dairyflow.modules.cows.entity.enums.CowSource;
import com.dairyflow.modules.cows.entity.enums.Gender;
import com.dairyflow.modules.cows.entity.enums.HealthStatus;
import com.dairyflow.modules.cows.entity.enums.LifecycleStatus;
import com.dairyflow.modules.cows.exception.CowNotFoundException;
import com.dairyflow.modules.cows.mapper.CowMapper;
import com.dairyflow.modules.cows.repository.CowRepository;
import com.dairyflow.modules.cows.service.CowServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CowServiceTest {

    @Mock
    private CowRepository cowRepository;

    @Mock
    private CowMapper cowMapper;

    @Mock
    private AuditService auditService;

    @InjectMocks
    private CowServiceImpl cowService;

    private CreateCowRequest sampleRequest;
    private Cow sampleCow;
    private CowResponse sampleResponse;
    private UUID sampleId;

    @BeforeEach
    void setUp() {
        sampleId = UUID.randomUUID();
        sampleRequest = CreateCowRequest.builder()
                .tagNumber("DF-101")
                .rfid("840-001")
                .name("Daisy")
                .breed(Breed.HOLSTEIN_FRIESIAN)
                .gender(Gender.FEMALE)
                .dateOfBirth(LocalDate.of(2023, 1, 15))
                .parity(2)
                .healthStatus(HealthStatus.HEALTHY)
                .lifecycleStatus(LifecycleStatus.ACTIVE)
                .source(CowSource.BORN)
                .barn("Barn A")
                .pen("Pen 01")
                .build();

        sampleCow = Cow.builder()
                .id(sampleId)
                .tagNumber("DF-101")
                .rfid("840-001")
                .name("Daisy")
                .breed(Breed.HOLSTEIN_FRIESIAN)
                .gender(Gender.FEMALE)
                .dateOfBirth(LocalDate.of(2023, 1, 15))
                .parity(2)
                .healthStatus(HealthStatus.HEALTHY)
                .lifecycleStatus(LifecycleStatus.ACTIVE)
                .source(CowSource.BORN)
                .barn("Barn A")
                .pen("Pen 01")
                .build();

        sampleResponse = CowResponse.builder()
                .id(sampleId)
                .tagNumber("DF-101")
                .rfid("840-001")
                .name("Daisy")
                .breed(Breed.HOLSTEIN_FRIESIAN)
                .gender(Gender.FEMALE)
                .dateOfBirth(sampleCow.getDateOfBirth())
                .age("2.1 yrs")
                .parity(2)
                .healthStatus(HealthStatus.HEALTHY)
                .lifecycleStatus(LifecycleStatus.ACTIVE)
                .source(CowSource.BORN)
                .barn("Barn A")
                .pen("Pen 01")
                .build();
    }

    @Test
    @DisplayName("Should register cow successfully when tag is unique")
    void shouldRegisterCowSuccessfully() {
        when(cowRepository.existsByTagNumber("DF-101")).thenReturn(false);
        when(cowRepository.existsByRfid("840-001")).thenReturn(false);
        when(cowMapper.toEntity(any(CreateCowRequest.class))).thenReturn(sampleCow);
        when(cowRepository.save(any(Cow.class))).thenReturn(sampleCow);
        when(cowMapper.toResponse(any(Cow.class))).thenReturn(sampleResponse);

        CowResponse result = cowService.registerCow(sampleRequest);

        assertThat(result).isNotNull();
        assertThat(result.getTagNumber()).isEqualTo("DF-101");
        assertThat(result.getName()).isEqualTo("Daisy");
        verify(cowRepository, times(1)).save(any(Cow.class));
        verify(auditService, times(1)).logAction(eq("Cow"), anyString(), eq("COW_CREATED"), isNull(), anyString(), isNull());
    }

    @Test
    @DisplayName("Should throw ConflictException (409) when tag number already exists")
    void shouldThrowWhenTagNumberDuplicate() {
        when(cowRepository.existsByTagNumber("DF-101")).thenReturn(true);

        assertThatThrownBy(() -> cowService.registerCow(sampleRequest))
                .isInstanceOf(ConflictException.class)
                .hasMessageContaining("already exists");

        verify(cowRepository, never()).save(any(Cow.class));
    }

    @Test
    @DisplayName("Should throw ConflictException (409) when RFID already exists")
    void shouldThrowWhenRfidDuplicate() {
        when(cowRepository.existsByTagNumber("DF-101")).thenReturn(false);
        when(cowRepository.existsByRfid("840-001")).thenReturn(true);

        assertThatThrownBy(() -> cowService.registerCow(sampleRequest))
                .isInstanceOf(ConflictException.class)
                .hasMessageContaining("RFID");

        verify(cowRepository, never()).save(any(Cow.class));
    }

    @Test
    @DisplayName("Should throw BadRequestException when date of birth is in the future")
    void shouldThrowWhenDateOfBirthInFuture() {
        sampleRequest.setDateOfBirth(LocalDate.now().plusDays(5));
        when(cowRepository.existsByTagNumber("DF-101")).thenReturn(false);

        assertThatThrownBy(() -> cowService.registerCow(sampleRequest))
                .isInstanceOf(BadRequestException.class)
                .hasMessageContaining("future");
    }

    @Test
    @DisplayName("Should throw BadRequestException when male animal has parity > 0")
    void shouldThrowWhenMaleHasParity() {
        sampleRequest.setGender(Gender.MALE);
        sampleRequest.setParity(2);
        when(cowRepository.existsByTagNumber("DF-101")).thenReturn(false);

        assertThatThrownBy(() -> cowService.registerCow(sampleRequest))
                .isInstanceOf(BadRequestException.class)
                .hasMessageContaining("male");
    }

    @Test
    @DisplayName("Should get cow by id successfully")
    void shouldGetCowById() {
        when(cowRepository.findById(sampleId)).thenReturn(Optional.of(sampleCow));
        when(cowMapper.toResponse(sampleCow)).thenReturn(sampleResponse);

        CowResponse result = cowService.getCowById(sampleId);

        assertThat(result).isNotNull();
        assertThat(result.getId()).isEqualTo(sampleId);
    }

    @Test
    @DisplayName("Should throw CowNotFoundException when cow id not found")
    void shouldThrowWhenCowNotFound() {
        UUID nonExistent = UUID.randomUUID();
        when(cowRepository.findById(nonExistent)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> cowService.getCowById(nonExistent))
                .isInstanceOf(CowNotFoundException.class);
    }

    @Test
    @DisplayName("Should update cow details and log audit")
    void shouldUpdateCow() {
        UpdateCowRequest updateRequest = UpdateCowRequest.builder()
                .name("Daisy Belle")
                .healthStatus(HealthStatus.PREGNANT)
                .build();

        when(cowRepository.findById(sampleId)).thenReturn(Optional.of(sampleCow));
        when(cowRepository.save(any(Cow.class))).thenReturn(sampleCow);
        when(cowMapper.toResponse(sampleCow)).thenReturn(sampleResponse);

        CowResponse result = cowService.updateCow(sampleId, updateRequest);

        assertThat(result).isNotNull();
        verify(cowRepository, times(1)).save(sampleCow);
        verify(auditService, times(1)).logAction(eq("Cow"), eq(sampleId.toString()), anyString(), isNull(), anyString(), isNull());
    }

    @Test
    @DisplayName("Should archive cow on delete to preserve historical records")
    void shouldArchiveCowOnDelete() {
        when(cowRepository.findById(sampleId)).thenReturn(Optional.of(sampleCow));
        when(cowRepository.save(any(Cow.class))).thenReturn(sampleCow);

        cowService.deleteCow(sampleId);

        assertThat(sampleCow.getLifecycleStatus()).isEqualTo(LifecycleStatus.DECEASED);
        verify(cowRepository, times(1)).save(sampleCow);
        verify(auditService, times(1)).logAction(eq("Cow"), eq(sampleId.toString()), eq("COW_ARCHIVED"), isNull(), anyString(), isNull());
    }

    @Test
    @DisplayName("Should return aggregate herd statistics")
    void shouldReturnHerdStats() {
        when(cowRepository.countByLifecycleStatus(LifecycleStatus.ACTIVE)).thenReturn(480L);
        when(cowRepository.countInMilk()).thenReturn(412L);
        when(cowRepository.countDry()).thenReturn(38L);
        when(cowRepository.countHeifers()).thenReturn(20L);
        when(cowRepository.countQuarantined()).thenReturn(10L);

        CowStatsResponse stats = cowService.getCowStats();

        assertThat(stats).isNotNull();
        assertThat(stats.getTotalHead()).isEqualTo(480L);
        assertThat(stats.getInMilk()).isEqualTo(412L);
        assertThat(stats.getDry()).isEqualTo(38L);
        assertThat(stats.getHeifers()).isEqualTo(20L);
        assertThat(stats.getQuarantine()).isEqualTo(10L);
    }
}
