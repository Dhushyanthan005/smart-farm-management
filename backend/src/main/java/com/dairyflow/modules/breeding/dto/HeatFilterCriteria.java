package com.dairyflow.modules.breeding.dto;

import com.dairyflow.modules.breeding.entity.enums.HeatConfidence;
import com.dairyflow.modules.breeding.entity.enums.HeatDetectionMethod;
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
public class HeatFilterCriteria {

    private UUID cowId;
    private String cowTag;
    private HeatDetectionMethod detectionMethod;
    private HeatConfidence confidence;
    private LocalDateTime fromDate;
    private LocalDateTime toDate;
    private String search;
}
