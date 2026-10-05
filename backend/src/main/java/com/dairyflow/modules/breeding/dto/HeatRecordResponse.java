package com.dairyflow.modules.breeding.dto;

import com.dairyflow.modules.breeding.entity.enums.HeatConfidence;
import com.dairyflow.modules.breeding.entity.enums.HeatDetectionMethod;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class HeatRecordResponse {

    private UUID id;
    private UUID cowId;
    private String cowTagNumber;
    private String cowName;
    private LocalDateTime detectedAt;
    private HeatDetectionMethod detectionMethod;
    private String signsObserved;
    private HeatConfidence confidence;
    private String notes;
    private UUID detectedById;
    private String detectedByName;
    private Instant createdAt;
    private Instant updatedAt;
    private String createdBy;
}
