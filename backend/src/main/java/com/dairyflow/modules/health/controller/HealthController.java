package com.dairyflow.modules.health.controller;

import com.dairyflow.common.response.ApiResponse;
import com.dairyflow.common.response.PageResponse;
import com.dairyflow.modules.health.dto.*;
import com.dairyflow.modules.health.entity.enums.CowHealthStatus;
import com.dairyflow.modules.health.entity.enums.QuarantineStatus;
import com.dairyflow.modules.health.entity.enums.TreatmentStatus;
import com.dairyflow.modules.health.service.HealthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Set;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/health")
@RequiredArgsConstructor
@Tag(name = "Health & Veterinary Management", description = "Clinical health records, prescriptions, antibiotic withdrawal tracking, and quarantine isolation")
@SecurityRequirement(name = "bearerAuth")
public class HealthController {

    private static final Set<String> ALLOWED_HEALTH_SORT = Set.of("recordDate", "healthStatus", "createdAt", "updatedAt");
    private static final Set<String> ALLOWED_TREATMENT_SORT = Set.of("treatmentDate", "startDate", "endDate", "withdrawalEndDate", "status", "createdAt");
    private static final Set<String> ALLOWED_QUARANTINE_SORT = Set.of("startDate", "expectedReleaseDate", "actualReleaseDate", "status", "createdAt");

    private final HealthService healthService;

    // ==========================================
    // HEALTH RECORDS
    // ==========================================

    @PostMapping("/records")
    @PreAuthorize("hasAnyAuthority('HEALTH_CREATE', 'HEALTH_WRITE', 'ROLE_OWNER', 'ROLE_ADMIN', 'ROLE_VETERINARIAN', 'ROLE_MANAGER')")
    @Operation(summary = "Record clinical examination and diagnosis for an animal")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "201", description = "Health record created"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Validation error"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "Unauthorized"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "403", description = "Forbidden"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Cow not found")
    })
    public ResponseEntity<ApiResponse<HealthRecordResponse>> createHealthRecord(@Valid @RequestBody CreateHealthRecordRequest request) {
        HealthRecordResponse response = healthService.createHealthRecord(request);
        return new ResponseEntity<>(ApiResponse.ok("Health record logged successfully", response), HttpStatus.CREATED);
    }

    @GetMapping("/records/{id}")
    @PreAuthorize("hasAnyAuthority('HEALTH_VIEW', 'HEALTH_READ', 'ROLE_OWNER', 'ROLE_ADMIN', 'ROLE_VETERINARIAN', 'ROLE_MANAGER', 'ROLE_WORKER')")
    @Operation(summary = "Get clinical health record by UUID")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Health record retrieved"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "Unauthorized"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "403", description = "Forbidden"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Health record not found")
    })
    public ResponseEntity<ApiResponse<HealthRecordResponse>> getHealthRecordById(@PathVariable UUID id) {
        HealthRecordResponse response = healthService.getHealthRecordById(id);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @GetMapping("/records")
    @PreAuthorize("hasAnyAuthority('HEALTH_VIEW', 'HEALTH_READ', 'ROLE_OWNER', 'ROLE_ADMIN', 'ROLE_VETERINARIAN', 'ROLE_MANAGER', 'ROLE_WORKER')")
    @Operation(summary = "List clinical health examination records with filtering and pagination")
    public ResponseEntity<ApiResponse<PageResponse<HealthRecordResponse>>> listHealthRecords(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "recordDate,desc") String sort,
            @RequestParam(required = false) UUID cowId,
            @RequestParam(required = false) String cowTag,
            @RequestParam(required = false) CowHealthStatus healthStatus,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fromDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate toDate,
            @RequestParam(required = false) String diagnosis,
            @RequestParam(required = false) UUID veterinarianId,
            @RequestParam(required = false) String search
    ) {
        Pageable pageable = createPageable(page, size, sort, ALLOWED_HEALTH_SORT, "recordDate");
        HealthFilterCriteria criteria = HealthFilterCriteria.builder()
                .cowId(cowId)
                .cowTag(cowTag)
                .healthStatus(healthStatus)
                .fromDate(fromDate)
                .toDate(toDate)
                .diagnosis(diagnosis)
                .veterinarianId(veterinarianId)
                .search(search)
                .build();

        PageResponse<HealthRecordResponse> response = healthService.listHealthRecords(criteria, pageable);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @PutMapping("/records/{id}")
    @PreAuthorize("hasAnyAuthority('HEALTH_UPDATE', 'HEALTH_WRITE', 'ROLE_OWNER', 'ROLE_ADMIN', 'ROLE_VETERINARIAN', 'ROLE_MANAGER')")
    @Operation(summary = "Update clinical health record details")
    public ResponseEntity<ApiResponse<HealthRecordResponse>> updateHealthRecord(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateHealthRecordRequest request
    ) {
        HealthRecordResponse response = healthService.updateHealthRecord(id, request);
        return ResponseEntity.ok(ApiResponse.ok("Health record updated successfully", response));
    }

    @DeleteMapping("/records/{id}")
    @PreAuthorize("hasAnyAuthority('HEALTH_DELETE', 'ROLE_OWNER', 'ROLE_ADMIN')")
    @Operation(summary = "Delete an erroneous clinical health examination record")
    public ResponseEntity<ApiResponse<Void>> deleteHealthRecord(@PathVariable UUID id) {
        healthService.deleteHealthRecord(id);
        return ResponseEntity.ok(ApiResponse.ok("Health record deleted successfully", null));
    }

    // ==========================================
    // TREATMENTS
    // ==========================================

    @PostMapping("/treatments")
    @PreAuthorize("hasAnyAuthority('TREATMENT_CREATE', 'HEALTH_WRITE', 'ROLE_OWNER', 'ROLE_ADMIN', 'ROLE_VETERINARIAN', 'ROLE_MANAGER')")
    @Operation(summary = "Prescribe medication or clinical treatment regimen with withdrawal tracking")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "201", description = "Treatment prescribed successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Validation error"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "Unauthorized"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "403", description = "Forbidden"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Cow not found")
    })
    public ResponseEntity<ApiResponse<TreatmentResponse>> createTreatment(@Valid @RequestBody CreateTreatmentRequest request) {
        TreatmentResponse response = healthService.createTreatment(request);
        return new ResponseEntity<>(ApiResponse.ok("Treatment prescribed successfully", response), HttpStatus.CREATED);
    }

    @GetMapping("/treatments/{id}")
    @PreAuthorize("hasAnyAuthority('TREATMENT_VIEW', 'HEALTH_READ', 'ROLE_OWNER', 'ROLE_ADMIN', 'ROLE_VETERINARIAN', 'ROLE_MANAGER', 'ROLE_WORKER')")
    @Operation(summary = "Get treatment record by UUID")
    public ResponseEntity<ApiResponse<TreatmentResponse>> getTreatmentById(@PathVariable UUID id) {
        TreatmentResponse response = healthService.getTreatmentById(id);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @GetMapping("/treatments")
    @PreAuthorize("hasAnyAuthority('TREATMENT_VIEW', 'HEALTH_READ', 'ROLE_OWNER', 'ROLE_ADMIN', 'ROLE_VETERINARIAN', 'ROLE_MANAGER', 'ROLE_WORKER')")
    @Operation(summary = "List treatments and prescriptions with multi-criteria filtering")
    public ResponseEntity<ApiResponse<PageResponse<TreatmentResponse>>> listTreatments(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "treatmentDate,desc") String sort,
            @RequestParam(required = false) UUID cowId,
            @RequestParam(required = false) String cowTag,
            @RequestParam(required = false) TreatmentStatus status,
            @RequestParam(required = false) String medication,
            @RequestParam(required = false) String treatmentType,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fromDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate toDate,
            @RequestParam(required = false) Boolean activeWithdrawalOnly,
            @RequestParam(required = false) UUID veterinarianId,
            @RequestParam(required = false) String search
    ) {
        Pageable pageable = createPageable(page, size, sort, ALLOWED_TREATMENT_SORT, "treatmentDate");
        TreatmentFilterCriteria criteria = TreatmentFilterCriteria.builder()
                .cowId(cowId)
                .cowTag(cowTag)
                .status(status)
                .medication(medication)
                .treatmentType(treatmentType)
                .fromDate(fromDate)
                .toDate(toDate)
                .activeWithdrawalOnly(activeWithdrawalOnly)
                .veterinarianId(veterinarianId)
                .search(search)
                .build();

        PageResponse<TreatmentResponse> response = healthService.listTreatments(criteria, pageable);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @PutMapping("/treatments/{id}")
    @PreAuthorize("hasAnyAuthority('TREATMENT_UPDATE', 'HEALTH_WRITE', 'ROLE_OWNER', 'ROLE_ADMIN', 'ROLE_VETERINARIAN', 'ROLE_MANAGER')")
    @Operation(summary = "Modify active treatment regimen, medication, or withdrawal period")
    public ResponseEntity<ApiResponse<TreatmentResponse>> updateTreatment(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateTreatmentRequest request
    ) {
        TreatmentResponse response = healthService.updateTreatment(id, request);
        return ResponseEntity.ok(ApiResponse.ok("Treatment updated successfully", response));
    }

    @PostMapping("/treatments/{id}/complete")
    @PreAuthorize("hasAnyAuthority('TREATMENT_COMPLETE', 'HEALTH_WRITE', 'ROLE_OWNER', 'ROLE_ADMIN', 'ROLE_VETERINARIAN', 'ROLE_MANAGER')")
    @Operation(summary = "Mark treatment regimen as completed and resolved")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Treatment resolved successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Treatment not found"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "409", description = "Treatment is already completed")
    })
    public ResponseEntity<ApiResponse<TreatmentResponse>> completeTreatment(
            @PathVariable UUID id,
            @Valid @RequestBody(required = false) CompleteTreatmentRequest request
    ) {
        TreatmentResponse response = healthService.completeTreatment(id, request);
        return ResponseEntity.ok(ApiResponse.ok("Treatment marked as completed", response));
    }

    // ==========================================
    // QUARANTINE
    // ==========================================

    @PostMapping("/quarantine")
    @PreAuthorize("hasAnyAuthority('QUARANTINE_CREATE', 'HEALTH_WRITE', 'ROLE_OWNER', 'ROLE_ADMIN', 'ROLE_VETERINARIAN', 'ROLE_MANAGER')")
    @Operation(summary = "Assign a cow to quarantine isolation bay")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "201", description = "Cow isolated in quarantine bay"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Validation error"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Cow not found"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "409", description = "Cow is already in active quarantine")
    })
    public ResponseEntity<ApiResponse<QuarantineResponse>> createQuarantine(@Valid @RequestBody CreateQuarantineRequest request) {
        QuarantineResponse response = healthService.createQuarantine(request);
        return new ResponseEntity<>(ApiResponse.ok("Cow assigned to quarantine isolation", response), HttpStatus.CREATED);
    }

    @GetMapping("/quarantine/{id}")
    @PreAuthorize("hasAnyAuthority('QUARANTINE_VIEW', 'HEALTH_READ', 'ROLE_OWNER', 'ROLE_ADMIN', 'ROLE_VETERINARIAN', 'ROLE_MANAGER', 'ROLE_WORKER')")
    @Operation(summary = "Get quarantine record by UUID")
    public ResponseEntity<ApiResponse<QuarantineResponse>> getQuarantineById(@PathVariable UUID id) {
        QuarantineResponse response = healthService.getQuarantineById(id);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @GetMapping("/quarantine")
    @PreAuthorize("hasAnyAuthority('QUARANTINE_VIEW', 'HEALTH_READ', 'ROLE_OWNER', 'ROLE_ADMIN', 'ROLE_VETERINARIAN', 'ROLE_MANAGER', 'ROLE_WORKER')")
    @Operation(summary = "List quarantine isolation records and bay allocations")
    public ResponseEntity<ApiResponse<PageResponse<QuarantineResponse>>> listQuarantineRecords(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "startDate,desc") String sort,
            @RequestParam(required = false) UUID cowId,
            @RequestParam(required = false) String cowTag,
            @RequestParam(required = false) QuarantineStatus status,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fromDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate toDate,
            @RequestParam(required = false) UUID veterinarianId,
            @RequestParam(required = false) String search
    ) {
        Pageable pageable = createPageable(page, size, sort, ALLOWED_QUARANTINE_SORT, "startDate");
        QuarantineFilterCriteria criteria = QuarantineFilterCriteria.builder()
                .cowId(cowId)
                .cowTag(cowTag)
                .status(status)
                .location(location)
                .fromDate(fromDate)
                .toDate(toDate)
                .veterinarianId(veterinarianId)
                .search(search)
                .build();

        PageResponse<QuarantineResponse> response = healthService.listQuarantineRecords(criteria, pageable);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @PutMapping("/quarantine/{id}")
    @PreAuthorize("hasAnyAuthority('QUARANTINE_UPDATE', 'HEALTH_WRITE', 'ROLE_OWNER', 'ROLE_ADMIN', 'ROLE_VETERINARIAN', 'ROLE_MANAGER')")
    @Operation(summary = "Update quarantine isolation record details or location")
    public ResponseEntity<ApiResponse<QuarantineResponse>> updateQuarantine(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateQuarantineRequest request
    ) {
        QuarantineResponse response = healthService.updateQuarantine(id, request);
        return ResponseEntity.ok(ApiResponse.ok("Quarantine record updated successfully", response));
    }

    @PostMapping("/quarantine/{id}/release")
    @PreAuthorize("hasAnyAuthority('QUARANTINE_RELEASE', 'HEALTH_WRITE', 'ROLE_OWNER', 'ROLE_ADMIN', 'ROLE_VETERINARIAN', 'ROLE_MANAGER')")
    @Operation(summary = "Release animal from quarantine isolation back to normal housing")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Cow released from quarantine successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Quarantine record not found"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "409", description = "Cow is already released")
    })
    public ResponseEntity<ApiResponse<QuarantineResponse>> releaseQuarantine(
            @PathVariable UUID id,
            @Valid @RequestBody(required = false) ReleaseQuarantineRequest request
    ) {
        QuarantineResponse response = healthService.releaseQuarantine(id, request);
        return ResponseEntity.ok(ApiResponse.ok("Animal released from quarantine isolation", response));
    }

    // ==========================================
    // ANTIBIOTIC WITHDRAWALS & MILK ELIGIBILITY
    // ==========================================

    @GetMapping("/withdrawals")
    @PreAuthorize("hasAnyAuthority('WITHDRAWAL_VIEW', 'HEALTH_VIEW', 'HEALTH_READ', 'MILK_VIEW', 'MILK_READ', 'ROLE_OWNER', 'ROLE_ADMIN', 'ROLE_VETERINARIAN', 'ROLE_MANAGER', 'ROLE_WORKER')")
    @Operation(summary = "Get list of active antibiotic withdrawals and countdown timers")
    public ResponseEntity<ApiResponse<List<WithdrawalCaseResponse>>> getActiveWithdrawals() {
        List<WithdrawalCaseResponse> response = healthService.getActiveWithdrawals();
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @GetMapping("/cows/{cowId}/withdrawal-status")
    @PreAuthorize("hasAnyAuthority('WITHDRAWAL_VIEW', 'HEALTH_VIEW', 'HEALTH_READ', 'MILK_VIEW', 'MILK_READ', 'COW_VIEW', 'ROLE_OWNER', 'ROLE_ADMIN', 'ROLE_VETERINARIAN', 'ROLE_MANAGER', 'ROLE_WORKER')")
    @Operation(summary = "Check whether an animal's milk is eligible for collection or currently withheld")
    public ResponseEntity<ApiResponse<CowWithdrawalStatusResponse>> getCowWithdrawalStatus(@PathVariable UUID cowId) {
        CowWithdrawalStatusResponse response = healthService.getCowWithdrawalStatus(cowId);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    // ==========================================
    // SUMMARY / KPIS
    // ==========================================

    @GetMapping("/summary")
    @PreAuthorize("hasAnyAuthority('HEALTH_VIEW', 'HEALTH_READ', 'HEALTH_REPORT_VIEW', 'ROLE_OWNER', 'ROLE_ADMIN', 'ROLE_VETERINARIAN', 'ROLE_MANAGER', 'ROLE_WORKER')")
    @Operation(summary = "Get aggregated health KPIs (quarantined, active treatments, withdrawals, udder health)")
    public ResponseEntity<ApiResponse<HealthSummaryResponse>> getHealthSummary() {
        HealthSummaryResponse response = healthService.getHealthSummary();
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    private Pageable createPageable(int page, int size, String sort, Set<String> allowedFields, String defaultField) {
        int boundedSize = Math.max(1, Math.min(size, 100));
        int boundedPage = Math.max(0, page);

        Sort safeSort = Sort.by(Sort.Direction.DESC, defaultField);
        if (sort != null && !sort.trim().isEmpty()) {
            String[] parts = sort.split(",");
            String field = parts[0].trim();
            if (allowedFields.contains(field)) {
                Sort.Direction dir = (parts.length > 1 && "asc".equalsIgnoreCase(parts[1].trim()))
                        ? Sort.Direction.ASC
                        : Sort.Direction.DESC;
                safeSort = Sort.by(dir, field);
            }
        }
        return PageRequest.of(boundedPage, boundedSize, safeSort);
    }
}
