package com.dairyflow.modules.milk;

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
import com.dairyflow.modules.milk.dto.*;
import com.dairyflow.modules.milk.entity.MilkProductionRecord;
import com.dairyflow.modules.milk.entity.enums.MilkRecordStatus;
import com.dairyflow.modules.milk.entity.enums.MilkShift;
import com.dairyflow.modules.milk.exception.MilkRecordNotFoundException;
import com.dairyflow.modules.milk.mapper.MilkMapper;
import com.dairyflow.modules.milk.repository.MilkRepository;
import com.dairyflow.modules.milk.service.MilkServiceImpl;
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
class MilkServiceTest {

    @Mock
    private MilkRepository milkRepository;

    @Mock
    private CowRepository cowRepository;

    @Mock
    private MilkMapper milkMapper;

    @Mock
    private AuditService auditService;

    @InjectMocks
    private MilkServiceImpl milkService;

    private Cow sampleCow;
    private MilkProductionRecord sampleRecord;
    private MilkRecordResponse sampleResponse;
    private CreateMilkRecordRequest sampleRequest;
    private UUID cowId;
    private UUID recordId;

    @BeforeEach
    void setUp() {
        cowId = UUID.randomUUID();
        recordId = UUID.randomUUID();

        sampleCow = Cow.builder()
                .id(cowId)
                .tagNumber("DF-1042")
                .name("Aurora")
                .breed(Breed.HOLSTEIN_FRIESIAN)
                .gender(Gender.FEMALE)
                .dateOfBirth(LocalDate.of(2022, 4, 15))
                .healthStatus(HealthStatus.HEALTHY)
                .lifecycleStatus(LifecycleStatus.ACTIVE)
                .build();

        sampleRecord = MilkProductionRecord.builder()
                .id(recordId)
                .cow(sampleCow)
                .productionDate(LocalDate.now())
                .shift(MilkShift.MORNING)
                .quantityLiters(28.5)
                .status(MilkRecordStatus.BULK)
                .build();

        sampleResponse = MilkRecordResponse.builder()
                .id(recordId)
                .cowId(cowId)
                .cowTagNumber("DF-1042")
                .productionDate(LocalDate.now())
                .shift(MilkShift.MORNING)
                .quantityLiters(28.5)
                .status(MilkRecordStatus.BULK)
                .build();

        sampleRequest = CreateMilkRecordRequest.builder()
                .cowId(cowId)
                .productionDate(LocalDate.now())
                .shift(MilkShift.MORNING)
                .quantityLiters(28.5)
                .status(MilkRecordStatus.BULK)
                .build();
    }

    @Test
    @DisplayName("Should record milk successfully when cow is valid and session is unique")
    void shouldRecordMilkSuccessfully() {
        when(cowRepository.findById(cowId)).thenReturn(Optional.of(sampleCow));
        when(milkRepository.existsByCowIdAndProductionDateAndShift(cowId, sampleRequest.getProductionDate(), MilkShift.MORNING))
                .thenReturn(false);
        when(milkMapper.toEntity(eq(sampleRequest), eq(sampleCow), any(), any())).thenReturn(sampleRecord);
        when(milkRepository.save(any(MilkProductionRecord.class))).thenReturn(sampleRecord);
        when(milkMapper.toResponse(sampleRecord)).thenReturn(sampleResponse);

        MilkRecordResponse result = milkService.recordMilk(sampleRequest);

        assertThat(result).isNotNull();
        assertThat(result.getQuantityLiters()).isEqualTo(28.5);
        assertThat(result.getCowTagNumber()).isEqualTo("DF-1042");
        verify(milkRepository, times(1)).save(any(MilkProductionRecord.class));
        verify(auditService, times(1)).logAction(eq("MilkProductionRecord"), eq(recordId.toString()), eq("MILK_RECORDED"), isNull(), anyString(), isNull());
    }

    @Test
    @DisplayName("Should throw ConflictException (409) when milk record already exists for date and shift")
    void shouldThrowConflictWhenDuplicateMilkRecord() {
        when(cowRepository.findById(cowId)).thenReturn(Optional.of(sampleCow));
        when(milkRepository.existsByCowIdAndProductionDateAndShift(cowId, sampleRequest.getProductionDate(), MilkShift.MORNING))
                .thenReturn(true);

        assertThatThrownBy(() -> milkService.recordMilk(sampleRequest))
                .isInstanceOf(ConflictException.class)
                .hasMessageContaining("already exists");

        verify(milkRepository, never()).save(any());
    }

    @Test
    @DisplayName("Should throw ResourceNotFoundException (404) when cow does not exist")
    void shouldThrowWhenCowNotFound() {
        UUID nonExistent = UUID.randomUUID();
        sampleRequest.setCowId(nonExistent);
        when(cowRepository.findById(nonExistent)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> milkService.recordMilk(sampleRequest))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Cow");
    }

    @Test
    @DisplayName("Should throw BadRequestException when recording milk for deceased cow")
    void shouldThrowWhenCowDeceased() {
        sampleCow.setLifecycleStatus(LifecycleStatus.DECEASED);
        when(cowRepository.findById(cowId)).thenReturn(Optional.of(sampleCow));

        assertThatThrownBy(() -> milkService.recordMilk(sampleRequest))
                .isInstanceOf(BadRequestException.class)
                .hasMessageContaining("DECEASED");
    }

    @Test
    @DisplayName("Should throw BadRequestException when production date is in the future")
    void shouldThrowWhenDateInFuture() {
        sampleRequest.setProductionDate(LocalDate.now().plusDays(2));
        when(cowRepository.findById(cowId)).thenReturn(Optional.of(sampleCow));

        assertThatThrownBy(() -> milkService.recordMilk(sampleRequest))
                .isInstanceOf(BadRequestException.class)
                .hasMessageContaining("future");
    }

    @Test
    @DisplayName("Should record batch milking entries from rotary parlor session")
    void shouldRecordBatchMilkingSession() {
        when(cowRepository.findById(cowId)).thenReturn(Optional.of(sampleCow));
        when(milkRepository.existsByCowIdAndProductionDateAndShift(eq(cowId), any(), any())).thenReturn(false);
        when(milkMapper.toEntity(any(), any(), any(), any())).thenReturn(sampleRecord);
        when(milkRepository.save(any())).thenReturn(sampleRecord);
        when(milkMapper.toResponse(sampleRecord)).thenReturn(sampleResponse);

        BatchMilkRecordRequest batchReq = BatchMilkRecordRequest.builder()
                .productionDate(LocalDate.now())
                .shift(MilkShift.MORNING)
                .records(List.of(
                        BatchMilkRecordRequest.BatchMilkEntryItem.builder()
                                .cowId(cowId)
                                .quantityLiters(28.5)
                                .status(MilkRecordStatus.BULK)
                                .build()
                ))
                .build();

        List<MilkRecordResponse> results = milkService.recordBatchMilk(batchReq);

        assertThat(results).hasSize(1);
        verify(milkRepository, times(1)).save(any());
    }

    @Test
    @DisplayName("Should update milk record and audit discard when status changed to WASTE")
    void shouldUpdateMilkRecordAndAuditDiscard() {
        UpdateMilkRecordRequest updateReq = UpdateMilkRecordRequest.builder()
                .quantityLiters(22.0)
                .status(MilkRecordStatus.WASTE)
                .notes("High conductivity detected")
                .build();

        when(milkRepository.findWithCowById(recordId)).thenReturn(Optional.of(sampleRecord));
        when(milkRepository.save(sampleRecord)).thenReturn(sampleRecord);
        when(milkMapper.toResponse(sampleRecord)).thenReturn(sampleResponse);

        milkService.updateMilkRecord(recordId, updateReq);

        verify(milkMapper, times(1)).updateEntityFromRequest(sampleRecord, updateReq);
        verify(auditService, times(1)).logAction(eq("MilkProductionRecord"), eq(recordId.toString()), eq("MILK_DISCARDED"), isNull(), anyString(), isNull());
    }

    @Test
    @DisplayName("Should delete milk record and log audit")
    void shouldDeleteMilkRecord() {
        when(milkRepository.findById(recordId)).thenReturn(Optional.of(sampleRecord));

        milkService.deleteMilkRecord(recordId);

        verify(milkRepository, times(1)).delete(sampleRecord);
        verify(auditService, times(1)).logAction(eq("MilkProductionRecord"), eq(recordId.toString()), eq("MILK_DELETED"), isNull(), anyString(), isNull());
    }

    @Test
    @DisplayName("Should calculate daily farm milk summary with morning/evening aggregations")
    void shouldCalculateDailySummary() {
        LocalDate today = LocalDate.now();
        when(milkRepository.sumYieldByDateAndShift(today, MilkShift.MORNING)).thenReturn(3250.5);
        when(milkRepository.sumYieldByDateAndShift(today, MilkShift.EVENING)).thenReturn(3012.4);
        when(milkRepository.sumBulkYieldByDate(today)).thenReturn(6100.0);
        when(milkRepository.sumWithheldYieldByDate(today)).thenReturn(162.9);
        when(milkRepository.countRecordsByDate(today)).thenReturn(240L);

        DailyMilkSummaryResponse summary = milkService.getDailySummary(today);

        assertThat(summary).isNotNull();
        assertThat(summary.getMorningLiters()).isEqualTo(3250.5);
        assertThat(summary.getEveningLiters()).isEqualTo(3012.4);
        assertThat(summary.getTotalLiters()).isEqualTo(6262.9);
        assertThat(summary.getCowsMilked()).isEqualTo(240);
        assertThat(summary.getAverageYield()).isGreaterThan(0.0);
    }

    @Test
    @DisplayName("Should calculate shift milking KPIs for rotary header")
    void shouldCalculateShiftSummary() {
        LocalDate today = LocalDate.now();
        when(milkRepository.sumBulkYieldByDateAndShift(today, MilkShift.MORNING)).thenReturn(3200.0);
        when(milkRepository.sumWithheldYieldByDateAndShift(today, MilkShift.MORNING)).thenReturn(50.5);
        when(milkRepository.countByDateAndShift(today, MilkShift.MORNING)).thenReturn(120L);
        when(milkRepository.maxYieldByDateAndShift(today, MilkShift.MORNING)).thenReturn(38.4);
        when(milkRepository.minYieldByDateAndShift(today, MilkShift.MORNING)).thenReturn(14.2);
        when(milkRepository.avgYieldByDateAndShift(today, MilkShift.MORNING)).thenReturn(27.08);

        ShiftMilkSummaryResponse summary = milkService.getShiftSummary(today, MilkShift.MORNING);

        assertThat(summary).isNotNull();
        assertThat(summary.getTotalYield()).isEqualTo(3250.5);
        assertThat(summary.getBulkYield()).isEqualTo(3200.0);
        assertThat(summary.getHighestYield()).isEqualTo(38.4);
        assertThat(summary.getCowsMilked()).isEqualTo(120);
    }

    @Test
    @DisplayName("Should return paginated cow milk production history")
    void shouldReturnCowMilkHistory() {
        when(cowRepository.existsById(cowId)).thenReturn(true);
        Page<MilkProductionRecord> page = new PageImpl<>(List.of(sampleRecord));
        when(milkRepository.findByCowId(eq(cowId), any(PageRequest.class))).thenReturn(page);
        when(milkMapper.toResponse(sampleRecord)).thenReturn(sampleResponse);

        var history = milkService.getCowMilkHistory(cowId, PageRequest.of(0, 10));

        assertThat(history).isNotNull();
        assertThat(history.getContent()).hasSize(1);
    }
}
