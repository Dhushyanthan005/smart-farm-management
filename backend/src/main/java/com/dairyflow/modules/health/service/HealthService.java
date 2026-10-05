package com.dairyflow.modules.health.service;

import com.dairyflow.common.response.PageResponse;
import com.dairyflow.modules.health.dto.*;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.UUID;

public interface HealthService {

    // Health Records
    HealthRecordResponse createHealthRecord(CreateHealthRecordRequest request);
    HealthRecordResponse getHealthRecordById(UUID id);
    PageResponse<HealthRecordResponse> listHealthRecords(HealthFilterCriteria criteria, Pageable pageable);
    PageResponse<HealthRecordResponse> getCowHealthHistory(UUID cowId, Pageable pageable);
    HealthRecordResponse updateHealthRecord(UUID id, UpdateHealthRecordRequest request);
    void deleteHealthRecord(UUID id);

    // Treatments
    TreatmentResponse createTreatment(CreateTreatmentRequest request);
    TreatmentResponse getTreatmentById(UUID id);
    PageResponse<TreatmentResponse> listTreatments(TreatmentFilterCriteria criteria, Pageable pageable);
    PageResponse<TreatmentResponse> getCowTreatmentHistory(UUID cowId, Pageable pageable);
    TreatmentResponse updateTreatment(UUID id, UpdateTreatmentRequest request);
    TreatmentResponse completeTreatment(UUID id, CompleteTreatmentRequest request);

    // Quarantine
    QuarantineResponse createQuarantine(CreateQuarantineRequest request);
    QuarantineResponse getQuarantineById(UUID id);
    PageResponse<QuarantineResponse> listQuarantineRecords(QuarantineFilterCriteria criteria, Pageable pageable);
    PageResponse<QuarantineResponse> getCowQuarantineHistory(UUID cowId, Pageable pageable);
    QuarantineResponse updateQuarantine(UUID id, UpdateQuarantineRequest request);
    QuarantineResponse releaseQuarantine(UUID id, ReleaseQuarantineRequest request);

    // Antibiotic Withdrawals & Milk Collection Eligibility
    List<WithdrawalCaseResponse> getActiveWithdrawals();
    CowWithdrawalStatusResponse getCowWithdrawalStatus(UUID cowId);
    boolean isCowMilkEligible(UUID cowId);

    // Summary & KPIs
    HealthSummaryResponse getHealthSummary();
}
