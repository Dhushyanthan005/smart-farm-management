package com.dairyflow.modules.breeding.controller;

import com.dairyflow.common.response.ApiResponse;
import com.dairyflow.common.response.PageResponse;
import com.dairyflow.modules.breeding.dto.*;
import com.dairyflow.modules.breeding.entity.enums.*;
import com.dairyflow.modules.breeding.service.BreedingService;
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
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Set;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/breeding")
@RequiredArgsConstructor
@Tag(name = "Breeding & Reproduction Management", description = "Heat detection, insemination records, pregnancy confirmation, and calving lifecycle")
@SecurityRequirement(name = "bearerAuth")
public class BreedingController {

    private static final Set<String> ALLOWED_HEAT_SORT = Set.of("detectedAt", "confidence", "createdAt");
    private static final Set<String> ALLOWED_BREEDING_SORT = Set.of("breedingDate", "status", "breedingMethod", "createdAt");
    private static final Set<String> ALLOWED_PREGNANCY_SORT = Set.of("confirmationDate", "expectedCalvingDate", "pregnancyStatus", "createdAt");
    private static final Set<String> ALLOWED_CALVING_SORT = Set.of("calvingDate", "calfCount", "calvingType", "createdAt");

    private final BreedingService breedingService;

    // ==========================================
    // HEAT DETECTION
    // ==========================================

    @PostMapping("/heat")
    @PreAuthorize("hasAnyAuthority('HEAT_CREATE', 'BREEDING_CREATE', 'BREEDING_WRITE', 'ROLE_OWNER', 'ROLE_ADMIN', 'ROLE_MANAGER', 'ROLE_VETERINARIAN', 'ROLE_WORKER')")
    @Operation(summary = "Record heat detection observation for a cow")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "201", description = "Heat record created"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Validation error"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Cow not found")
    })
    public ResponseEntity<ApiResponse<HeatRecordResponse>> createHeatRecord(
            @Valid @RequestBody CreateHeatRecordRequest request,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        String username = userDetails != null ? userDetails.getUsername() : "system";
        HeatRecordResponse response = breedingService.createHeatRecord(request, username);
        return new ResponseEntity<>(ApiResponse.ok("Heat record logged successfully", response), HttpStatus.CREATED);
    }

    @GetMapping("/heat/{id}")
    @PreAuthorize("hasAnyAuthority('HEAT_VIEW', 'BREEDING_VIEW', 'BREEDING_READ', 'ROLE_OWNER', 'ROLE_ADMIN', 'ROLE_MANAGER', 'ROLE_VETERINARIAN', 'ROLE_WORKER')")
    @Operation(summary = "Get heat detection record by UUID")
    public ResponseEntity<ApiResponse<HeatRecordResponse>> getHeatRecordById(@PathVariable UUID id) {
        HeatRecordResponse response = breedingService.getHeatRecord(id);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @GetMapping("/heat")
    @PreAuthorize("hasAnyAuthority('HEAT_VIEW', 'BREEDING_VIEW', 'BREEDING_READ', 'ROLE_OWNER', 'ROLE_ADMIN', 'ROLE_MANAGER', 'ROLE_VETERINARIAN', 'ROLE_WORKER')")
    @Operation(summary = "List heat detection records with filtering and pagination")
    public ResponseEntity<ApiResponse<PageResponse<HeatRecordResponse>>> listHeatRecords(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "detectedAt,desc") String sort,
            @RequestParam(required = false) UUID cowId,
            @RequestParam(required = false) String cowTag,
            @RequestParam(required = false) HeatDetectionMethod detectionMethod,
            @RequestParam(required = false) HeatConfidence confidence,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fromDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime toDate,
            @RequestParam(required = false) String search
    ) {
        Pageable pageable = createPageable(page, size, sort, ALLOWED_HEAT_SORT, "detectedAt");
        HeatFilterCriteria criteria = HeatFilterCriteria.builder()
                .cowId(cowId)
                .cowTag(cowTag)
                .detectionMethod(detectionMethod)
                .confidence(confidence)
                .fromDate(fromDate)
                .toDate(toDate)
                .search(search)
                .build();

        PageResponse<HeatRecordResponse> response = PageResponse.from(breedingService.getHeatRecords(criteria, pageable));
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @PutMapping("/heat/{id}")
    @PreAuthorize("hasAnyAuthority('HEAT_UPDATE', 'BREEDING_UPDATE', 'BREEDING_WRITE', 'ROLE_OWNER', 'ROLE_ADMIN', 'ROLE_MANAGER', 'ROLE_VETERINARIAN')")
    @Operation(summary = "Update heat detection record")
    public ResponseEntity<ApiResponse<HeatRecordResponse>> updateHeatRecord(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateHeatRecordRequest request,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        String username = userDetails != null ? userDetails.getUsername() : "system";
        HeatRecordResponse response = breedingService.updateHeatRecord(id, request, username);
        return ResponseEntity.ok(ApiResponse.ok("Heat record updated successfully", response));
    }

    @DeleteMapping("/heat/{id}")
    @PreAuthorize("hasAnyAuthority('BREEDING_DELETE', 'BREEDING_WRITE', 'ROLE_OWNER', 'ROLE_ADMIN')")
    @Operation(summary = "Delete an erroneous heat record")
    public ResponseEntity<ApiResponse<Void>> deleteHeatRecord(
            @PathVariable UUID id,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        String username = userDetails != null ? userDetails.getUsername() : "system";
        breedingService.deleteHeatRecord(id, username);
        return ResponseEntity.ok(ApiResponse.ok("Heat record deleted successfully", null));
    }

    // ==========================================
    // BREEDING RECORDS
    // ==========================================

    @PostMapping("/records")
    @PreAuthorize("hasAnyAuthority('BREEDING_CREATE', 'BREEDING_WRITE', 'ROLE_OWNER', 'ROLE_ADMIN', 'ROLE_MANAGER', 'ROLE_VETERINARIAN')")
    @Operation(summary = "Record artificial insemination or natural breeding event")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "201", description = "Breeding record created"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Validation error"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Cow not found")
    })
    public ResponseEntity<ApiResponse<BreedingRecordResponse>> createBreedingRecord(
            @Valid @RequestBody CreateBreedingRecordRequest request,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        String username = userDetails != null ? userDetails.getUsername() : "system";
        BreedingRecordResponse response = breedingService.createBreedingRecord(request, username);
        return new ResponseEntity<>(ApiResponse.ok("Breeding record logged successfully", response), HttpStatus.CREATED);
    }

    @GetMapping("/records/{id}")
    @PreAuthorize("hasAnyAuthority('BREEDING_VIEW', 'BREEDING_READ', 'ROLE_OWNER', 'ROLE_ADMIN', 'ROLE_MANAGER', 'ROLE_VETERINARIAN', 'ROLE_WORKER')")
    @Operation(summary = "Get breeding record by UUID")
    public ResponseEntity<ApiResponse<BreedingRecordResponse>> getBreedingRecordById(@PathVariable UUID id) {
        BreedingRecordResponse response = breedingService.getBreedingRecord(id);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @GetMapping("/records")
    @PreAuthorize("hasAnyAuthority('BREEDING_VIEW', 'BREEDING_READ', 'ROLE_OWNER', 'ROLE_ADMIN', 'ROLE_MANAGER', 'ROLE_VETERINARIAN', 'ROLE_WORKER')")
    @Operation(summary = "List breeding records with filtering and pagination")
    public ResponseEntity<ApiResponse<PageResponse<BreedingRecordResponse>>> listBreedingRecords(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "breedingDate,desc") String sort,
            @RequestParam(required = false) UUID cowId,
            @RequestParam(required = false) String cowTag,
            @RequestParam(required = false) BreedingMethod breedingMethod,
            @RequestParam(required = false) BreedingStatus status,
            @RequestParam(required = false) UUID technicianId,
            @RequestParam(required = false) UUID veterinarianId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fromDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate toDate,
            @RequestParam(required = false) String search
    ) {
        Pageable pageable = createPageable(page, size, sort, ALLOWED_BREEDING_SORT, "breedingDate");
        BreedingFilterCriteria criteria = BreedingFilterCriteria.builder()
                .cowId(cowId)
                .cowTag(cowTag)
                .breedingMethod(breedingMethod)
                .status(status)
                .technicianId(technicianId)
                .veterinarianId(veterinarianId)
                .fromDate(fromDate)
                .toDate(toDate)
                .search(search)
                .build();

        PageResponse<BreedingRecordResponse> response = PageResponse.from(breedingService.getBreedingRecords(criteria, pageable));
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @PutMapping("/records/{id}")
    @PreAuthorize("hasAnyAuthority('BREEDING_UPDATE', 'BREEDING_WRITE', 'ROLE_OWNER', 'ROLE_ADMIN', 'ROLE_MANAGER', 'ROLE_VETERINARIAN')")
    @Operation(summary = "Update breeding record")
    public ResponseEntity<ApiResponse<BreedingRecordResponse>> updateBreedingRecord(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateBreedingRecordRequest request,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        String username = userDetails != null ? userDetails.getUsername() : "system";
        BreedingRecordResponse response = breedingService.updateBreedingRecord(id, request, username);
        return ResponseEntity.ok(ApiResponse.ok("Breeding record updated successfully", response));
    }

    @PostMapping("/records/{id}/complete")
    @PreAuthorize("hasAnyAuthority('BREEDING_UPDATE', 'BREEDING_WRITE', 'ROLE_OWNER', 'ROLE_ADMIN', 'ROLE_MANAGER', 'ROLE_VETERINARIAN')")
    @Operation(summary = "Mark breeding record as completed")
    public ResponseEntity<ApiResponse<BreedingRecordResponse>> completeBreedingRecord(
            @PathVariable UUID id,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        String username = userDetails != null ? userDetails.getUsername() : "system";
        BreedingRecordResponse response = breedingService.completeBreedingRecord(id, username);
        return ResponseEntity.ok(ApiResponse.ok("Breeding marked as COMPLETED", response));
    }

    @PostMapping("/records/{id}/cancel")
    @PreAuthorize("hasAnyAuthority('BREEDING_UPDATE', 'BREEDING_WRITE', 'ROLE_OWNER', 'ROLE_ADMIN', 'ROLE_MANAGER', 'ROLE_VETERINARIAN')")
    @Operation(summary = "Cancel breeding record")
    public ResponseEntity<ApiResponse<BreedingRecordResponse>> cancelBreedingRecord(
            @PathVariable UUID id,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        String username = userDetails != null ? userDetails.getUsername() : "system";
        BreedingRecordResponse response = breedingService.cancelBreedingRecord(id, username);
        return ResponseEntity.ok(ApiResponse.ok("Breeding marked as CANCELLED", response));
    }

    // ==========================================
    // PREGNANCY RECORDS
    // ==========================================

    @PostMapping("/pregnancies")
    @PreAuthorize("hasAnyAuthority('PREGNANCY_CREATE', 'BREEDING_CREATE', 'BREEDING_WRITE', 'ROLE_OWNER', 'ROLE_ADMIN', 'ROLE_MANAGER', 'ROLE_VETERINARIAN')")
    @Operation(summary = "Register pregnancy monitoring entry")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "201", description = "Pregnancy record created"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Validation error"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "409", description = "Active pregnancy conflict")
    })
    public ResponseEntity<ApiResponse<PregnancyRecordResponse>> createPregnancyRecord(
            @Valid @RequestBody CreatePregnancyRecordRequest request,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        String username = userDetails != null ? userDetails.getUsername() : "system";
        PregnancyRecordResponse response = breedingService.createPregnancyRecord(request, username);
        return new ResponseEntity<>(ApiResponse.ok("Pregnancy record created successfully", response), HttpStatus.CREATED);
    }

    @GetMapping("/pregnancies/{id}")
    @PreAuthorize("hasAnyAuthority('PREGNANCY_VIEW', 'BREEDING_VIEW', 'BREEDING_READ', 'ROLE_OWNER', 'ROLE_ADMIN', 'ROLE_MANAGER', 'ROLE_VETERINARIAN', 'ROLE_WORKER')")
    @Operation(summary = "Get pregnancy record by UUID")
    public ResponseEntity<ApiResponse<PregnancyRecordResponse>> getPregnancyRecordById(@PathVariable UUID id) {
        PregnancyRecordResponse response = breedingService.getPregnancyRecord(id);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @GetMapping("/pregnancies")
    @PreAuthorize("hasAnyAuthority('PREGNANCY_VIEW', 'BREEDING_VIEW', 'BREEDING_READ', 'ROLE_OWNER', 'ROLE_ADMIN', 'ROLE_MANAGER', 'ROLE_VETERINARIAN', 'ROLE_WORKER')")
    @Operation(summary = "List pregnancy records with filtering, overdue flags, and pagination")
    public ResponseEntity<ApiResponse<PageResponse<PregnancyRecordResponse>>> listPregnancies(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "expectedCalvingDate,asc") String sort,
            @RequestParam(required = false) UUID cowId,
            @RequestParam(required = false) String cowTag,
            @RequestParam(required = false) PregnancyStatus pregnancyStatus,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fromExpectedDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate toExpectedDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fromConfirmationDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate toConfirmationDate,
            @RequestParam(required = false) Boolean overdueOnly,
            @RequestParam(required = false) String search
    ) {
        Pageable pageable = createPageable(page, size, sort, ALLOWED_PREGNANCY_SORT, "expectedCalvingDate");
        PregnancyFilterCriteria criteria = PregnancyFilterCriteria.builder()
                .cowId(cowId)
                .cowTag(cowTag)
                .pregnancyStatus(pregnancyStatus)
                .fromExpectedDate(fromExpectedDate)
                .toExpectedDate(toExpectedDate)
                .fromConfirmationDate(fromConfirmationDate)
                .toConfirmationDate(toConfirmationDate)
                .overdueOnly(overdueOnly)
                .search(search)
                .build();

        PageResponse<PregnancyRecordResponse> response = PageResponse.from(breedingService.getPregnancyRecords(criteria, pageable));
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @PutMapping("/pregnancies/{id}")
    @PreAuthorize("hasAnyAuthority('PREGNANCY_UPDATE', 'BREEDING_UPDATE', 'BREEDING_WRITE', 'ROLE_OWNER', 'ROLE_ADMIN', 'ROLE_MANAGER', 'ROLE_VETERINARIAN')")
    @Operation(summary = "Update pregnancy record details")
    public ResponseEntity<ApiResponse<PregnancyRecordResponse>> updatePregnancyRecord(
            @PathVariable UUID id,
            @Valid @RequestBody UpdatePregnancyRecordRequest request,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        String username = userDetails != null ? userDetails.getUsername() : "system";
        PregnancyRecordResponse response = breedingService.updatePregnancyRecord(id, request, username);
        return ResponseEntity.ok(ApiResponse.ok("Pregnancy record updated successfully", response));
    }

    @PostMapping("/pregnancies/{id}/confirm")
    @PreAuthorize("hasAnyAuthority('PREGNANCY_CONFIRM', 'PREGNANCY_UPDATE', 'BREEDING_WRITE', 'ROLE_OWNER', 'ROLE_ADMIN', 'ROLE_MANAGER', 'ROLE_VETERINARIAN')")
    @Operation(summary = "Confirm pregnancy and compute expected calving date")
    public ResponseEntity<ApiResponse<PregnancyRecordResponse>> confirmPregnancy(
            @PathVariable UUID id,
            @Valid @RequestBody ConfirmPregnancyRequest request,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        String username = userDetails != null ? userDetails.getUsername() : "system";
        PregnancyRecordResponse response = breedingService.confirmPregnancy(id, request, username);
        return ResponseEntity.ok(ApiResponse.ok("Pregnancy confirmed successfully", response));
    }

    @PostMapping("/pregnancies/{id}/mark-not-pregnant")
    @PreAuthorize("hasAnyAuthority('PREGNANCY_UPDATE', 'BREEDING_WRITE', 'ROLE_OWNER', 'ROLE_ADMIN', 'ROLE_MANAGER', 'ROLE_VETERINARIAN')")
    @Operation(summary = "Mark pregnancy as NOT_PREGNANT (open)")
    public ResponseEntity<ApiResponse<PregnancyRecordResponse>> markNotPregnant(
            @PathVariable UUID id,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        String username = userDetails != null ? userDetails.getUsername() : "system";
        PregnancyRecordResponse response = breedingService.markNotPregnant(id, username);
        return ResponseEntity.ok(ApiResponse.ok("Pregnancy marked as NOT_PREGNANT", response));
    }

    @PostMapping("/pregnancies/{id}/mark-lost")
    @PreAuthorize("hasAnyAuthority('PREGNANCY_UPDATE', 'BREEDING_WRITE', 'ROLE_OWNER', 'ROLE_ADMIN', 'ROLE_MANAGER', 'ROLE_VETERINARIAN')")
    @Operation(summary = "Mark pregnancy as LOST (miscarriage/abortion)")
    public ResponseEntity<ApiResponse<PregnancyRecordResponse>> markPregnancyLost(
            @PathVariable UUID id,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        String username = userDetails != null ? userDetails.getUsername() : "system";
        PregnancyRecordResponse response = breedingService.markPregnancyLost(id, username);
        return ResponseEntity.ok(ApiResponse.ok("Pregnancy marked as LOST", response));
    }

    // ==========================================
    // CALVING RECORDS
    // ==========================================

    @PostMapping("/calvings")
    @PreAuthorize("hasAnyAuthority('CALVING_CREATE', 'BREEDING_CREATE', 'BREEDING_WRITE', 'ROLE_OWNER', 'ROLE_ADMIN', 'ROLE_MANAGER', 'ROLE_VETERINARIAN')")
    @Operation(summary = "Record calving birth event, increment parity, and update milk status")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "201", description = "Calving recorded successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Validation error"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Cow or pregnancy not found")
    })
    public ResponseEntity<ApiResponse<CalvingRecordResponse>> createCalvingRecord(
            @Valid @RequestBody CreateCalvingRecordRequest request,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        String username = userDetails != null ? userDetails.getUsername() : "system";
        CalvingRecordResponse response = breedingService.createCalvingRecord(request, username);
        return new ResponseEntity<>(ApiResponse.ok("Calving recorded successfully", response), HttpStatus.CREATED);
    }

    @GetMapping("/calvings/{id}")
    @PreAuthorize("hasAnyAuthority('CALVING_VIEW', 'BREEDING_VIEW', 'BREEDING_READ', 'ROLE_OWNER', 'ROLE_ADMIN', 'ROLE_MANAGER', 'ROLE_VETERINARIAN', 'ROLE_WORKER')")
    @Operation(summary = "Get calving record by UUID")
    public ResponseEntity<ApiResponse<CalvingRecordResponse>> getCalvingRecordById(@PathVariable UUID id) {
        CalvingRecordResponse response = breedingService.getCalvingRecord(id);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @GetMapping("/calvings")
    @PreAuthorize("hasAnyAuthority('CALVING_VIEW', 'BREEDING_VIEW', 'BREEDING_READ', 'ROLE_OWNER', 'ROLE_ADMIN', 'ROLE_MANAGER', 'ROLE_VETERINARIAN', 'ROLE_WORKER')")
    @Operation(summary = "List calving records with multi-criteria filtering")
    public ResponseEntity<ApiResponse<PageResponse<CalvingRecordResponse>>> listCalvings(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "calvingDate,desc") String sort,
            @RequestParam(required = false) UUID cowId,
            @RequestParam(required = false) String cowTag,
            @RequestParam(required = false) CalvingType calvingType,
            @RequestParam(required = false) Boolean complicationsOnly,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fromDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate toDate,
            @RequestParam(required = false) String search
    ) {
        Pageable pageable = createPageable(page, size, sort, ALLOWED_CALVING_SORT, "calvingDate");
        CalvingFilterCriteria criteria = CalvingFilterCriteria.builder()
                .cowId(cowId)
                .cowTag(cowTag)
                .calvingType(calvingType)
                .complicationsOnly(complicationsOnly)
                .fromDate(fromDate)
                .toDate(toDate)
                .search(search)
                .build();

        PageResponse<CalvingRecordResponse> response = PageResponse.from(breedingService.getCalvingRecords(criteria, pageable));
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @PutMapping("/calvings/{id}")
    @PreAuthorize("hasAnyAuthority('CALVING_UPDATE', 'BREEDING_UPDATE', 'BREEDING_WRITE', 'ROLE_OWNER', 'ROLE_ADMIN', 'ROLE_MANAGER', 'ROLE_VETERINARIAN')")
    @Operation(summary = "Update calving record details")
    public ResponseEntity<ApiResponse<CalvingRecordResponse>> updateCalvingRecord(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateCalvingRecordRequest request,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        String username = userDetails != null ? userDetails.getUsername() : "system";
        CalvingRecordResponse response = breedingService.updateCalvingRecord(id, request, username);
        return ResponseEntity.ok(ApiResponse.ok("Calving record updated successfully", response));
    }

    // ==========================================
    // SUMMARY / KPIS
    // ==========================================

    @GetMapping("/summary")
    @PreAuthorize("hasAnyAuthority('BREEDING_VIEW', 'BREEDING_READ', 'BREEDING_REPORT_VIEW', 'ROLE_OWNER', 'ROLE_ADMIN', 'ROLE_MANAGER', 'ROLE_VETERINARIAN', 'ROLE_WORKER')")
    @Operation(summary = "Get aggregated breeding and reproductive KPIs")
    public ResponseEntity<ApiResponse<BreedingSummaryResponse>> getBreedingSummary() {
        BreedingSummaryResponse response = breedingService.getBreedingSummary();
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
