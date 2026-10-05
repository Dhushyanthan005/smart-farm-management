package com.dairyflow.modules.milk.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DailyMilkSummaryResponse {

    private LocalDate date;
    private double morningLiters;
    private double eveningLiters;
    private double totalLiters;
    private double bulkLiters;
    private double withheldLiters;
    private long cowsMilked;
    private double averageYield;
}
