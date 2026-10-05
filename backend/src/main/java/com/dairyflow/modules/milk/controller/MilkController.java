package com.dairyflow.modules.milk.controller;

import com.dairyflow.common.response.ApiResponse;
import com.dairyflow.common.response.PageResponse;
import com.dairyflow.modules.milk.dto.*;
import com.dairyflow.modules.milk.entity.enums.MilkRecordStatus;
import com.dairyflow.modules.milk.entity.enums.MilkShift;
import com.dairyflow.modules.milk.service.MilkService;
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
@RequestMapping("/api/v1/milk")
@RequiredArgsConstructor
@Tag(name = "Milk Production", description = "Daily milk recording, rotary parlor batches, and yield analytics")
@SecurityRequirement(name = "bearerAuth")
public class MilkController {

    private static final Set<String> ALLOWED_SORT_FIELDS = Set.of(
            "productionDate", "quantityLiters", "shift", "status", "createdAt", "updatedAt"
    );

    private final MilkService milkService;

    @PostMapping
    @PreAuthorize("hasAnyAuthority('MILK_CREATE', 'MILK_WRITE', 'ROLE_OWNER', 'ROLE_ADMIN', 'ROLE_MANAGER', 'ROLE_WORKER')")
    @Operation(summary = "Record single milk yield entry for an animal")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "201", description = "Milk collection logged"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Validation error or animal not eligible for milking"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "Unauthorized"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "403", description = "Forbidden"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Cow not found"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "409", description = "Duplicate milk entry for cow, date, and shift")
    })
    public ResponseEntity<ApiResponse<MilkRecordResponse>> recordMilk(@Valid @RequestBody CreateMilkRecordRequest request) {
        MilkRecordResponse response = milkService.recordMilk(request);
        return new ResponseEntity<>(ApiResponse.ok("Milk record logged successfully", response), HttpStatus.CREATED);
    }

    @PostMapping("/batch")
    @PreAuthorize("hasAnyAuthority('MILK_CREATE', 'MILK_WRITE', 'ROLE_OWNER', 'ROLE_ADMIN', 'ROLE_MANAGER', 'ROLE_WORKER')")
    @Operation(summary = "Submit batch milking session logs from rotary parlor/stanchions")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "201", description = "Batch session logged successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Validation error in batch entries"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "Unauthorized"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "403", description = "Forbidden")
    })
    public ResponseEntity<ApiResponse<List<MilkRecordResponse>>> recordBatchMilk(@Valid @RequestBody BatchMilkRecordRequest request) {
        List<MilkRecordResponse> responses = milkService.recordBatchMilk(request);
        return new ResponseEntity<>(ApiResponse.ok("Batch milk session committed successfully", responses), HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('MILK_VIEW', 'MILK_READ', 'ROLE_OWNER', 'ROLE_ADMIN', 'ROLE_MANAGER', 'ROLE_WORKER', 'ROLE_VETERINARIAN')")
    @Operation(summary = "Get milk collection entry by UUID")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Milk record retrieved"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "Unauthorized"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "403", description = "Forbidden"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Milk record not found")
    })
    public ResponseEntity<ApiResponse<MilkRecordResponse>> getMilkRecordById(@PathVariable UUID id) {
        MilkRecordResponse response = milkService.getMilkRecordById(id);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @GetMapping
    @PreAuthorize("hasAnyAuthority('MILK_VIEW', 'MILK_READ', 'ROLE_OWNER', 'ROLE_ADMIN', 'ROLE_MANAGER', 'ROLE_WORKER', 'ROLE_VETERINARIAN')")
    @Operation(summary = "List milk production records with multi-criteria filtering and pagination")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Paginated milk records retrieved"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "Unauthorized"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "403", description = "Forbidden")
    })
    public ResponseEntity<ApiResponse<PageResponse<MilkRecordResponse>>> listMilkRecords(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "productionDate,desc") String sort,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fromDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate toDate,
            @RequestParam(required = false) MilkShift shift,
            @RequestParam(required = false) UUID cowId,
            @RequestParam(required = false) String cowTag,
            @RequestParam(required = false) MilkRecordStatus status,
            @RequestParam(required = false) String search
    ) {
        int boundedSize = Math.max(1, Math.min(size, 100));
        int boundedPage = Math.max(0, page);
        Sort safeSort = parseSafeSort(sort);
        Pageable pageable = PageRequest.of(boundedPage, boundedSize, safeSort);

        MilkFilterCriteria criteria = MilkFilterCriteria.builder()
                .date(date)
                .fromDate(fromDate)
                .toDate(toDate)
                .shift(shift)
                .cowId(cowId)
                .cowTag(cowTag)
                .status(status)
                .search(search)
                .build();

        PageResponse<MilkRecordResponse> response = milkService.listMilkRecords(criteria, pageable);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @GetMapping("/summary/daily")
    @PreAuthorize("hasAnyAuthority('MILK_VIEW', 'MILK_READ', 'ROLE_OWNER', 'ROLE_ADMIN', 'ROLE_MANAGER', 'ROLE_WORKER', 'ROLE_VETERINARIAN')")
    @Operation(summary = "Get daily farm-wide aggregate milk metrics (morning, evening, bulk, average)")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Daily milk summary retrieved"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "Unauthorized"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "403", description = "Forbidden")
    })
    public ResponseEntity<ApiResponse<DailyMilkSummaryResponse>> getDailySummary(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date
    ) {
        DailyMilkSummaryResponse summary = milkService.getDailySummary(date);
        return ResponseEntity.ok(ApiResponse.ok(summary));
    }

    @GetMapping("/summary/shift")
    @PreAuthorize("hasAnyAuthority('MILK_VIEW', 'MILK_READ', 'ROLE_OWNER', 'ROLE_ADMIN', 'ROLE_MANAGER', 'ROLE_WORKER', 'ROLE_VETERINARIAN')")
    @Operation(summary = "Get shift-specific milking KPIs (total yield, cows milked, max/min extraction)")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Shift milk summary retrieved"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "Unauthorized"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "403", description = "Forbidden")
    })
    public ResponseEntity<ApiResponse<ShiftMilkSummaryResponse>> getShiftSummary(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestParam(required = false) MilkShift shift
    ) {
        ShiftMilkSummaryResponse summary = milkService.getShiftSummary(date, shift);
        return ResponseEntity.ok(ApiResponse.ok(summary));
    }

    @GetMapping("/cows/{cowId}")
    @PreAuthorize("hasAnyAuthority('MILK_VIEW', 'MILK_READ', 'COW_VIEW', 'COW_READ', 'ROLE_OWNER', 'ROLE_ADMIN', 'ROLE_MANAGER', 'ROLE_WORKER', 'ROLE_VETERINARIAN')")
    @Operation(summary = "Get historical milk yield records for a specific cow")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Cow milk history retrieved"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "Unauthorized"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "403", description = "Forbidden"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Cow not found")
    })
    public ResponseEntity<ApiResponse<PageResponse<MilkRecordResponse>>> getCowMilkHistory(
            @PathVariable UUID cowId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        int boundedSize = Math.max(1, Math.min(size, 100));
        int boundedPage = Math.max(0, page);
        Pageable pageable = PageRequest.of(boundedPage, boundedSize, Sort.by(Sort.Direction.DESC, "productionDate", "shift"));
        PageResponse<MilkRecordResponse> response = milkService.getCowMilkHistory(cowId, pageable);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('MILK_UPDATE', 'MILK_WRITE', 'ROLE_OWNER', 'ROLE_ADMIN', 'ROLE_MANAGER', 'ROLE_WORKER')")
    @Operation(summary = "Update milk collection entry (yield, disposition, laboratory markers)")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Milk record updated successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Validation error"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "Unauthorized"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "403", description = "Forbidden"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Milk record not found")
    })
    public ResponseEntity<ApiResponse<MilkRecordResponse>> updateMilkRecord(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateMilkRecordRequest request
    ) {
        MilkRecordResponse response = milkService.updateMilkRecord(id, request);
        return ResponseEntity.ok(ApiResponse.ok("Milk record updated successfully", response));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('MILK_DELETE', 'ROLE_OWNER', 'ROLE_ADMIN')")
    @Operation(summary = "Delete an erroneous milk collection entry")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Milk record deleted successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "Unauthorized"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "403", description = "Forbidden"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Milk record not found")
    })
    public ResponseEntity<ApiResponse<Void>> deleteMilkRecord(@PathVariable UUID id) {
        milkService.deleteMilkRecord(id);
        return ResponseEntity.ok(ApiResponse.ok("Milk record deleted successfully"));
    }

    private Sort parseSafeSort(String sortParam) {
        if (sortParam == null || sortParam.trim().isEmpty()) {
            return Sort.by(Sort.Direction.DESC, "productionDate");
        }

        String[] parts = sortParam.split(",");
        String field = parts[0].trim();
        Sort.Direction direction = Sort.Direction.ASC;

        if (parts.length > 1 && "desc".equalsIgnoreCase(parts[1].trim())) {
            direction = Sort.Direction.DESC;
        }

        if (!ALLOWED_SORT_FIELDS.contains(field)) {
            field = "productionDate";
            direction = Sort.Direction.DESC;
        }

        return Sort.by(direction, field);
    }
}
