package com.dairyflow.modules.health.dto;

import com.dairyflow.modules.health.entity.enums.CowHealthStatus;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.PastOrPresent;
import jakarta.validation.constraints.Positive;
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
public class UpdateHealthRecordRequest {

    @PastOrPresent(message = "Record date cannot be in the future")
    private LocalDate recordDate;

    private CowHealthStatus healthStatus;

    @Size(max = 255, message = "Diagnosis must not exceed 255 characters")
    private String diagnosis;

    @Size(max = 2000, message = "Symptoms description must not exceed 2000 characters")
    private String symptoms;

    @DecimalMin(value = "30.0", message = "Temperature must be at least 30.0 °C")
    @DecimalMax(value = "45.0", message = "Temperature must not exceed 45.0 °C")
    private Double temperature;

    @Positive(message = "Weight must be positive")
    private Double weight;

    private UUID veterinarianId;

    @Size(max = 100, message = "Veterinarian name must not exceed 100 characters")
    private String veterinarianName;

    @Size(max = 2000, message = "Notes must not exceed 2000 characters")
    private String notes;
}
