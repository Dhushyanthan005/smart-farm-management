package com.dairyflow.modules.health.dto;

import com.dairyflow.modules.health.entity.enums.TreatmentStatus;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateTreatmentRequest {

    @Size(max = 255, message = "Diagnosis must not exceed 255 characters")
    private String diagnosis;

    @Size(max = 50, message = "Treatment type must not exceed 50 characters")
    private String treatmentType;

    @Size(max = 100, message = "Medication must not exceed 100 characters")
    private String medication;

    @Size(max = 50, message = "Dosage must not exceed 50 characters")
    private String dosage;

    @Size(max = 50, message = "Frequency must not exceed 50 characters")
    private String frequency;

    @Size(max = 50, message = "Route must not exceed 50 characters")
    private String route;

    private LocalDate startDate;
    private LocalDate endDate;

    @Min(value = 0, message = "Withdrawal days must be 0 or greater")
    private Integer withdrawalDays;

    private UUID veterinarianId;

    @Size(max = 100, message = "Veterinarian name must not exceed 100 characters")
    private String veterinarianName;

    @Size(max = 2000, message = "Instructions must not exceed 2000 characters")
    private String instructions;

    @Size(max = 2000, message = "Notes must not exceed 2000 characters")
    private String notes;

    private TreatmentStatus status;
}
