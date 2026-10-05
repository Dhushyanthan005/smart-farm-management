package com.dairyflow.modules.health.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CowWithdrawalStatusResponse {

    private UUID cowId;
    private String cowTagNumber;
    private boolean isMilkEligible;
    private int activeWithdrawalCount;
    private LocalDate earliestEligibleDate;
    private List<String> activeMedications;
}
