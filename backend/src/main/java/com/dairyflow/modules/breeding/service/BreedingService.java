package com.dairyflow.modules.breeding.service;

import com.dairyflow.modules.breeding.dto.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.UUID;

public interface BreedingService {

    // --- Heat Records ---
    HeatRecordResponse createHeatRecord(CreateHeatRecordRequest request, String username);
    HeatRecordResponse updateHeatRecord(UUID id, UpdateHeatRecordRequest request, String username);
    HeatRecordResponse getHeatRecord(UUID id);
    Page<HeatRecordResponse> getHeatRecords(HeatFilterCriteria criteria, Pageable pageable);
    void deleteHeatRecord(UUID id, String username);
    Page<HeatRecordResponse> getHeatHistoryByCow(UUID cowId, Pageable pageable);

    // --- Breeding Records ---
    BreedingRecordResponse createBreedingRecord(CreateBreedingRecordRequest request, String username);
    BreedingRecordResponse updateBreedingRecord(UUID id, UpdateBreedingRecordRequest request, String username);
    BreedingRecordResponse getBreedingRecord(UUID id);
    Page<BreedingRecordResponse> getBreedingRecords(BreedingFilterCriteria criteria, Pageable pageable);
    BreedingRecordResponse completeBreedingRecord(UUID id, String username);
    BreedingRecordResponse cancelBreedingRecord(UUID id, String username);
    Page<BreedingRecordResponse> getBreedingHistoryByCow(UUID cowId, Pageable pageable);

    // --- Pregnancy Records ---
    PregnancyRecordResponse createPregnancyRecord(CreatePregnancyRecordRequest request, String username);
    PregnancyRecordResponse updatePregnancyRecord(UUID id, UpdatePregnancyRecordRequest request, String username);
    PregnancyRecordResponse confirmPregnancy(UUID id, ConfirmPregnancyRequest request, String username);
    PregnancyRecordResponse markNotPregnant(UUID id, String username);
    PregnancyRecordResponse markPregnancyLost(UUID id, String username);
    PregnancyRecordResponse getPregnancyRecord(UUID id);
    Page<PregnancyRecordResponse> getPregnancyRecords(PregnancyFilterCriteria criteria, Pageable pageable);
    Page<PregnancyRecordResponse> getPregnancyHistoryByCow(UUID cowId, Pageable pageable);

    // --- Calving Records ---
    CalvingRecordResponse createCalvingRecord(CreateCalvingRecordRequest request, String username);
    CalvingRecordResponse updateCalvingRecord(UUID id, UpdateCalvingRecordRequest request, String username);
    CalvingRecordResponse getCalvingRecord(UUID id);
    Page<CalvingRecordResponse> getCalvingRecords(CalvingFilterCriteria criteria, Pageable pageable);
    Page<CalvingRecordResponse> getCalvingHistoryByCow(UUID cowId, Pageable pageable);

    // --- Analytics & Cow Profile ---
    BreedingSummaryResponse getBreedingSummary();
    CowReproductiveSummaryResponse getCowReproductiveSummary(UUID cowId);
}
