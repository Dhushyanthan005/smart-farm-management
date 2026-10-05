package com.dairyflow.modules.milk.dto;

import com.dairyflow.modules.milk.entity.enums.MilkShift;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ShiftMilkSummaryResponse {

    private LocalDate date;
    private MilkShift shift;
    private double totalYield;
    private double bulkYield;
    private double withheldYield;
    private long cowsMilked;
    private double averageYield;
    private double highestYield;
    private double lowestYield;
}
