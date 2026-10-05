package com.dairyflow.modules.breeding.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BreedingSummaryResponse {

    private long cowsInHeat;
    private long breedingDue;
    private long pregnantCows;
    private long upcomingCalvings;
    private long overduePregnancies;
    private long recentCalvings;
    private long openCows;
    private double conceptionRate;
}
