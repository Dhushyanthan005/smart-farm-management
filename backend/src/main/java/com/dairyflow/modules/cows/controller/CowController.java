package com.dairyflow.modules.cows.controller;

import com.dairyflow.common.response.ApiResponse;
import com.dairyflow.common.response.PageResponse;
import com.dairyflow.modules.cows.dto.CowResponse;
import com.dairyflow.modules.cows.dto.CreateCowRequest;
import com.dairyflow.modules.cows.dto.UpdateCowRequest;
import com.dairyflow.modules.cows.service.CowService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/cows")
@RequiredArgsConstructor
@Tag(name = "Cows", description = "Herd & Livestock Management Operations")
public class CowController {

    private final CowService cowService;

    @PostMapping
    @PreAuthorize("hasAnyAuthority('COW_WRITE', 'ROLE_OWNER', 'ROLE_ADMIN', 'ROLE_MANAGER')")
    @Operation(summary = "Register a new cow in the herd")
    public ResponseEntity<ApiResponse<CowResponse>> registerCow(@Valid @RequestBody CreateCowRequest request) {
        CowResponse response = cowService.registerCow(request);
        return new ResponseEntity<>(ApiResponse.ok("Cow registered successfully", response), HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('COW_READ', 'ROLE_OWNER', 'ROLE_ADMIN', 'ROLE_MANAGER', 'ROLE_VETERINARIAN', 'ROLE_WORKER')")
    @Operation(summary = "Get cow details by UUID")
    public ResponseEntity<ApiResponse<CowResponse>> getCowById(@PathVariable UUID id) {
        CowResponse response = cowService.getCowById(id);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @GetMapping("/tag/{tagNumber}")
    @PreAuthorize("hasAnyAuthority('COW_READ', 'ROLE_OWNER', 'ROLE_ADMIN', 'ROLE_MANAGER', 'ROLE_VETERINARIAN', 'ROLE_WORKER')")
    @Operation(summary = "Get cow details by Ear Tag number")
    public ResponseEntity<ApiResponse<CowResponse>> getCowByTagNumber(@PathVariable String tagNumber) {
        CowResponse response = cowService.getCowByTagNumber(tagNumber);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @GetMapping
    @PreAuthorize("hasAnyAuthority('COW_READ', 'ROLE_OWNER', 'ROLE_ADMIN', 'ROLE_MANAGER', 'ROLE_VETERINARIAN', 'ROLE_WORKER')")
    @Operation(summary = "List registered cows with pagination and optional status filter")
    public ResponseEntity<ApiResponse<PageResponse<CowResponse>>> listCows(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String status
    ) {
        PageResponse<CowResponse> response = cowService.listCows(page, size, status);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('COW_WRITE', 'ROLE_OWNER', 'ROLE_ADMIN', 'ROLE_MANAGER')")
    @Operation(summary = "Update an existing cow profile")
    public ResponseEntity<ApiResponse<CowResponse>> updateCow(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateCowRequest request
    ) {
        CowResponse response = cowService.updateCow(id, request);
        return ResponseEntity.ok(ApiResponse.ok("Cow updated successfully", response));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('COW_DELETE', 'ROLE_OWNER', 'ROLE_ADMIN')")
    @Operation(summary = "Delete or archive a cow record")
    public ResponseEntity<ApiResponse<Void>> deleteCow(@PathVariable UUID id) {
        cowService.deleteCow(id);
        return ResponseEntity.ok(ApiResponse.ok("Cow record deleted successfully"));
    }
}
