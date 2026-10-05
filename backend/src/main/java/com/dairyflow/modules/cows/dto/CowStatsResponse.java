package com.dairyflow.modules.cows.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CowStatsResponse {

    private long totalHead;
    private long inMilk;
    private long dry;
    private long heifers;
    private long quarantine;
}
