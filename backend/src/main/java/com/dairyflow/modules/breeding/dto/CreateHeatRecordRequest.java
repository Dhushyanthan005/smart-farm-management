package com.dairyflow.modules.breeding.dto;

import com.dairyflow.modules.breeding.entity.enums.HeatConfidence;
import com.dairyflow.modules.breeding.entity.enums.HeatDetectionMethod;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateHeatRecordRequest {

    private UUID cowId;

    @Size(max = 30, message = "Cow tag number must not exceed 30 characters")
    private String cowTagNumber;

    @NotNull(message = "Detection timestamp is required")
    private LocalDateTime detectedAt;

    @NotNull(message = "Detection method is required")
    private HeatDetectionMethod detectionMethod;

    @NotBlank(message = "Observed signs of heat are required")
    @Size(max = 1000, message = "Observed signs must not exceed 1000 characters")
    private String signsObserved;

    @Builder.Default
    private HeatConfidence confidence = HeatConfidence.HIGH;

    @Size(max = 2000, message = "Notes must not exceed 2000 characters")
    private String notes;

    private UUID detectedById;

    @Size(max = 100, message = "Detected by name must not exceed 100 characters")
    private String detectedByName;
}
