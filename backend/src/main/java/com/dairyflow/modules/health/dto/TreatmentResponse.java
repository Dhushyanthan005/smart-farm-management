package com.dairyflow.modules.health.dto;

import com.dairyflow.modules.health.entity.enums.TreatmentStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TreatmentResponse {

    private UUID id;
    private UUID cowId;
    private String cowTagNumber;
    private String cowName;
    private UUID healthRecordId;
    private LocalDate treatmentDate;
    private String diagnosis;
    private String treatmentType;
    private String medication;
    private String dosage;
    private String frequency;
    private String route;
    private LocalDate startDate;
    private LocalDate endDate;
    private Integer withdrawalDays;
    private LocalDate withdrawalEndDate;
    private UUID veterinarianId;
    private String veterinarianName;
    private String instructions;
    private String notes;
    private TreatmentStatus status;
    private boolean isWithdrawalActive;
    private long withdrawalDaysRemaining;
    private Instant createdAt;
    private Instant updatedAt;
    private String createdBy;
}
