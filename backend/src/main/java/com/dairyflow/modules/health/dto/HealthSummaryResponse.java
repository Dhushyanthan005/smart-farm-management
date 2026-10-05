package com.dairyflow.modules.health.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class HealthSummaryResponse {

    private long totalCows;
    private long healthyCount;
    private long underTreatmentCount;
    private long quarantinedCount;
    private long criticalCount;
    private long observationCount;
    private long recoveringCount;
    private long activeTreatmentsCount;
    private long activeWithdrawalsCount;
    private long occupiedBaysCount;
    private long pendingReviewsCount;
}
