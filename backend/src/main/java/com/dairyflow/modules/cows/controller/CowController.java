package com.dairyflow.modules.cows.controller;

import com.dairyflow.common.response.ApiResponse;
import com.dairyflow.common.response.PageResponse;
import com.dairyflow.modules.cows.dto.*;
import com.dairyflow.modules.cows.entity.enums.Breed;
import com.dairyflow.modules.cows.entity.enums.Gender;
import com.dairyflow.modules.cows.entity.enums.HealthStatus;
import com.dairyflow.modules.cows.entity.enums.LifecycleStatus;
import com.dairyflow.modules.cows.service.CowService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Set;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/cows")
@RequiredArgsConstructor
@Tag(name = "Cows", description = "Herd & Livestock Management Operations")
@SecurityRequirement(name = "bearerAuth")
public class CowController {

    private static final Set<String> ALLOWED_SORT_FIELDS = Set.of(
            "tagNumber", "name", "breed", "gender", "dateOfBirth",
            "parity", "healthStatus", "lifecycleStatus", "barn", "pen", "createdAt"
    );

    private final CowService cowService;
    private final com.dairyflow.modules.milk.service.MilkService milkService;
    private final com.dairyflow.modules.health.service.HealthService healthService;
    private final com.dairyflow.modules.breeding.service.BreedingService breedingService;

    @GetMapping("/{cowId}/breeding")
    @PreAuthorize("hasAnyAuthority('COW_VIEW', 'COW_READ', 'BREEDING_VIEW', 'BREEDING_READ', 'ROLE_OWNER', 'ROLE_ADMIN', 'ROLE_MANAGER', 'ROLE_VETERINARIAN', 'ROLE_WORKER')")
    @Operation(summary = "Get reproductive status, latest breeding/pregnancy, and chronological timeline for this cow")
    public ResponseEntity<ApiResponse<com.dairyflow.modules.breeding.dto.CowReproductiveSummaryResponse>> getCowBreedingSummary(
            @PathVariable UUID cowId
    ) {
        return ResponseEntity.ok(ApiResponse.ok(breedingService.getCowReproductiveSummary(cowId)));
    }

    @GetMapping("/{cowId}/heat-history")
    @PreAuthorize("hasAnyAuthority('COW_VIEW', 'COW_READ', 'HEAT_VIEW', 'BREEDING_READ', 'ROLE_OWNER', 'ROLE_ADMIN', 'ROLE_MANAGER', 'ROLE_VETERINARIAN', 'ROLE_WORKER')")
    @Operation(summary = "Get historical heat observations for this cow")
    public ResponseEntity<ApiResponse<PageResponse<com.dairyflow.modules.breeding.dto.HeatRecordResponse>>> getCowHeatHistory(
            @PathVariable UUID cowId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        int boundedSize = Math.max(1, Math.min(size, 100));
        int boundedPage = Math.max(0, page);
        Pageable pageable = PageRequest.of(boundedPage, boundedSize, Sort.by(Sort.Direction.DESC, "detectedAt"));
        return ResponseEntity.ok(ApiResponse.ok(PageResponse.from(breedingService.getHeatHistoryByCow(cowId, pageable))));
    }

    @GetMapping("/{cowId}/pregnancy-history")
    @PreAuthorize("hasAnyAuthority('COW_VIEW', 'COW_READ', 'PREGNANCY_VIEW', 'BREEDING_READ', 'ROLE_OWNER', 'ROLE_ADMIN', 'ROLE_MANAGER', 'ROLE_VETERINARIAN', 'ROLE_WORKER')")
    @Operation(summary = "Get historical pregnancy examinations for this cow")
    public ResponseEntity<ApiResponse<PageResponse<com.dairyflow.modules.breeding.dto.PregnancyRecordResponse>>> getCowPregnancyHistory(
            @PathVariable UUID cowId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        int boundedSize = Math.max(1, Math.min(size, 100));
        int boundedPage = Math.max(0, page);
        Pageable pageable = PageRequest.of(boundedPage, boundedSize, Sort.by(Sort.Direction.DESC, "createdAt"));
        return ResponseEntity.ok(ApiResponse.ok(PageResponse.from(breedingService.getPregnancyHistoryByCow(cowId, pageable))));
    }

    @GetMapping("/{cowId}/calving-history")
    @PreAuthorize("hasAnyAuthority('COW_VIEW', 'COW_READ', 'CALVING_VIEW', 'BREEDING_READ', 'ROLE_OWNER', 'ROLE_ADMIN', 'ROLE_MANAGER', 'ROLE_VETERINARIAN', 'ROLE_WORKER')")
    @Operation(summary = "Get historical calving birth records for this cow")
    public ResponseEntity<ApiResponse<PageResponse<com.dairyflow.modules.breeding.dto.CalvingRecordResponse>>> getCowCalvingHistory(
            @PathVariable UUID cowId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        int boundedSize = Math.max(1, Math.min(size, 100));
        int boundedPage = Math.max(0, page);
        Pageable pageable = PageRequest.of(boundedPage, boundedSize, Sort.by(Sort.Direction.DESC, "calvingDate"));
        return ResponseEntity.ok(ApiResponse.ok(PageResponse.from(breedingService.getCalvingHistoryByCow(cowId, pageable))));
    }

    @GetMapping("/{cowId}/milk")
    @PreAuthorize("hasAnyAuthority('COW_VIEW', 'COW_READ', 'MILK_VIEW', 'MILK_READ', 'ROLE_OWNER', 'ROLE_ADMIN', 'ROLE_MANAGER', 'ROLE_VETERINARIAN', 'ROLE_WORKER')")
    @Operation(summary = "Get historical milk production records for this cow")
    public ResponseEntity<ApiResponse<PageResponse<com.dairyflow.modules.milk.dto.MilkRecordResponse>>> getCowMilkHistory(
            @PathVariable UUID cowId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        int boundedSize = Math.max(1, Math.min(size, 100));
        int boundedPage = Math.max(0, page);
        Pageable pageable = PageRequest.of(boundedPage, boundedSize, Sort.by(Sort.Direction.DESC, "productionDate", "shift"));
        return ResponseEntity.ok(ApiResponse.ok(milkService.getCowMilkHistory(cowId, pageable)));
    }

    @GetMapping("/{cowId}/health")
    @PreAuthorize("hasAnyAuthority('COW_VIEW', 'COW_READ', 'HEALTH_VIEW', 'HEALTH_READ', 'ROLE_OWNER', 'ROLE_ADMIN', 'ROLE_MANAGER', 'ROLE_VETERINARIAN', 'ROLE_WORKER')")
    @Operation(summary = "Get historical clinical health records for this cow")
    public ResponseEntity<ApiResponse<PageResponse<com.dairyflow.modules.health.dto.HealthRecordResponse>>> getCowHealthHistory(
            @PathVariable UUID cowId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        int boundedSize = Math.max(1, Math.min(size, 100));
        int boundedPage = Math.max(0, page);
        Pageable pageable = PageRequest.of(boundedPage, boundedSize, Sort.by(Sort.Direction.DESC, "recordDate", "createdAt"));
        return ResponseEntity.ok(ApiResponse.ok(healthService.getCowHealthHistory(cowId, pageable)));
    }

    @GetMapping("/{cowId}/treatments")
    @PreAuthorize("hasAnyAuthority('COW_VIEW', 'COW_READ', 'TREATMENT_VIEW', 'HEALTH_READ', 'ROLE_OWNER', 'ROLE_ADMIN', 'ROLE_MANAGER', 'ROLE_VETERINARIAN', 'ROLE_WORKER')")
    @Operation(summary = "Get historical medical treatments and prescriptions for this cow")
    public ResponseEntity<ApiResponse<PageResponse<com.dairyflow.modules.health.dto.TreatmentResponse>>> getCowTreatmentHistory(
            @PathVariable UUID cowId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        int boundedSize = Math.max(1, Math.min(size, 100));
        int boundedPage = Math.max(0, page);
        Pageable pageable = PageRequest.of(boundedPage, boundedSize, Sort.by(Sort.Direction.DESC, "startDate", "createdAt"));
        return ResponseEntity.ok(ApiResponse.ok(healthService.getCowTreatmentHistory(cowId, pageable)));
    }

    @GetMapping("/{cowId}/quarantine")
    @PreAuthorize("hasAnyAuthority('COW_VIEW', 'COW_READ', 'QUARANTINE_VIEW', 'HEALTH_READ', 'ROLE_OWNER', 'ROLE_ADMIN', 'ROLE_MANAGER', 'ROLE_VETERINARIAN', 'ROLE_WORKER')")
    @Operation(summary = "Get quarantine isolation records for this cow")
    public ResponseEntity<ApiResponse<PageResponse<com.dairyflow.modules.health.dto.QuarantineResponse>>> getCowQuarantineHistory(
            @PathVariable UUID cowId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        int boundedSize = Math.max(1, Math.min(size, 100));
        int boundedPage = Math.max(0, page);
        Pageable pageable = PageRequest.of(boundedPage, boundedSize, Sort.by(Sort.Direction.DESC, "startDate", "createdAt"));
        return ResponseEntity.ok(ApiResponse.ok(healthService.getCowQuarantineHistory(cowId, pageable)));
    }

    @GetMapping("/{cowId}/withdrawal-status")
    @PreAuthorize("hasAnyAuthority('COW_VIEW', 'COW_READ', 'WITHDRAWAL_VIEW', 'HEALTH_READ', 'MILK_VIEW', 'ROLE_OWNER', 'ROLE_ADMIN', 'ROLE_MANAGER', 'ROLE_VETERINARIAN', 'ROLE_WORKER')")
    @Operation(summary = "Get antibiotic milk withdrawal status and eligibility for this cow")
    public ResponseEntity<ApiResponse<com.dairyflow.modules.health.dto.CowWithdrawalStatusResponse>> getCowWithdrawalStatus(
            @PathVariable UUID cowId
    ) {
        return ResponseEntity.ok(ApiResponse.ok(healthService.getCowWithdrawalStatus(cowId)));
    }

    @PostMapping
    @PreAuthorize("hasAnyAuthority('COW_CREATE', 'COW_WRITE', 'ROLE_OWNER', 'ROLE_ADMIN', 'ROLE_MANAGER')")
    @Operation(summary = "Register a new cow in the herd")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "201", description = "Cow registered successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Validation error or invalid business rules"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "Unauthorized"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "403", description = "Forbidden - requires COW_CREATE authority"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "409", description = "Conflict - Duplicate ear tag or RFID number")
    })
    public ResponseEntity<ApiResponse<CowResponse>> registerCow(@Valid @RequestBody CreateCowRequest request) {
        CowResponse response = cowService.registerCow(request);
        return new ResponseEntity<>(ApiResponse.ok("Cow registered successfully", response), HttpStatus.CREATED);
    }

    @GetMapping("/stats")
    @PreAuthorize("hasAnyAuthority('COW_VIEW', 'COW_READ', 'ROLE_OWNER', 'ROLE_ADMIN', 'ROLE_MANAGER', 'ROLE_VETERINARIAN', 'ROLE_WORKER')")
    @Operation(summary = "Get aggregate herd statistics (head count, in milk, dry, heifers, quarantine)")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Herd statistics retrieved"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "Unauthorized"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "403", description = "Forbidden")
    })
    public ResponseEntity<ApiResponse<CowStatsResponse>> getCowStats() {
        CowStatsResponse stats = cowService.getCowStats();
        return ResponseEntity.ok(ApiResponse.ok(stats));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('COW_VIEW', 'COW_READ', 'ROLE_OWNER', 'ROLE_ADMIN', 'ROLE_MANAGER', 'ROLE_VETERINARIAN', 'ROLE_WORKER')")
    @Operation(summary = "Get cow details by UUID")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Cow details retrieved"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "Unauthorized"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "403", description = "Forbidden"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Cow not found")
    })
    public ResponseEntity<ApiResponse<CowResponse>> getCowById(@PathVariable UUID id) {
        CowResponse response = cowService.getCowById(id);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @GetMapping("/tag/{tagNumber}")
    @PreAuthorize("hasAnyAuthority('COW_VIEW', 'COW_READ', 'ROLE_OWNER', 'ROLE_ADMIN', 'ROLE_MANAGER', 'ROLE_VETERINARIAN', 'ROLE_WORKER')")
    @Operation(summary = "Get cow details by Ear Tag number")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Cow details retrieved"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "Unauthorized"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "403", description = "Forbidden"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Cow not found")
    })
    public ResponseEntity<ApiResponse<CowResponse>> getCowByTagNumber(@PathVariable String tagNumber) {
        CowResponse response = cowService.getCowByTagNumber(tagNumber);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @GetMapping
    @PreAuthorize("hasAnyAuthority('COW_VIEW', 'COW_READ', 'ROLE_OWNER', 'ROLE_ADMIN', 'ROLE_MANAGER', 'ROLE_VETERINARIAN', 'ROLE_WORKER')")
    @Operation(summary = "List registered cows with search, filtering, and safe sorting")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Paginated cows retrieved successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "Unauthorized"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "403", description = "Forbidden")
    })
    public ResponseEntity<ApiResponse<PageResponse<CowResponse>>> listCows(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "createdAt,desc") String sort,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) HealthStatus healthStatus,
            @RequestParam(required = false) LifecycleStatus lifecycleStatus,
            @RequestParam(required = false) Breed breed,
            @RequestParam(required = false) Gender gender,
            @RequestParam(required = false) String barn,
            @RequestParam(required = false) String pen,
            @RequestParam(required = false) Integer parity,
            @RequestParam(required = false) Integer minParity,
            @RequestParam(required = false) String stage
    ) {
        int boundedSize = Math.max(1, Math.min(size, 100));
        int boundedPage = Math.max(0, page);

        Sort safeSort = parseSafeSort(sort);
        Pageable pageable = PageRequest.of(boundedPage, boundedSize, safeSort);

        CowFilterCriteria criteria = CowFilterCriteria.builder()
                .search(search)
                .healthStatus(healthStatus)
                .lifecycleStatus(lifecycleStatus)
                .breed(breed)
                .gender(gender)
                .barn(barn)
                .pen(pen)
                .parity(parity)
                .minParity(minParity)
                .lactationStage(stage)
                .build();

        PageResponse<CowResponse> response = cowService.listCows(criteria, pageable);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('COW_UPDATE', 'COW_WRITE', 'ROLE_OWNER', 'ROLE_ADMIN', 'ROLE_MANAGER')")
    @Operation(summary = "Update an existing cow profile")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Cow updated successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Validation error"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "Unauthorized"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "403", description = "Forbidden"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Cow not found"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "409", description = "Conflict - Duplicate RFID")
    })
    public ResponseEntity<ApiResponse<CowResponse>> updateCow(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateCowRequest request
    ) {
        CowResponse response = cowService.updateCow(id, request);
        return ResponseEntity.ok(ApiResponse.ok("Cow updated successfully", response));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('COW_DELETE', 'ROLE_OWNER', 'ROLE_ADMIN')")
    @Operation(summary = "Archive a cow record to preserve historical data")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Cow record archived successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "Unauthorized"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "403", description = "Forbidden"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Cow not found")
    })
    public ResponseEntity<ApiResponse<Void>> deleteCow(@PathVariable UUID id) {
        cowService.deleteCow(id);
        return ResponseEntity.ok(ApiResponse.ok("Cow record archived successfully"));
    }

    private Sort parseSafeSort(String sortParam) {
        if (sortParam == null || sortParam.trim().isEmpty()) {
            return Sort.by(Sort.Direction.DESC, "createdAt");
        }

        String[] parts = sortParam.split(",");
        String field = parts[0].trim();
        Sort.Direction direction = Sort.Direction.ASC;

        if (parts.length > 1 && "desc".equalsIgnoreCase(parts[1].trim())) {
            direction = Sort.Direction.DESC;
        }

        if (!ALLOWED_SORT_FIELDS.contains(field)) {
            field = "createdAt";
            direction = Sort.Direction.DESC;
        }

        return Sort.by(direction, field);
    }
}
