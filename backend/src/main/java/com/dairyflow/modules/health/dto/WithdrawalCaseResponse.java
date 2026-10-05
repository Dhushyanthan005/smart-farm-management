package com.dairyflow.modules.health.dto;

import com.dairyflow.modules.health.entity.enums.TreatmentStatus;
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
public class WithdrawalCaseResponse {

    private UUID cowId;
    private String cowTagNumber;
    private String cowName;
    private String pen;
    private UUID treatmentId;
    private String medication;
    private String dosage;
    private LocalDate startDate;
    private LocalDate endDate;
    private Integer withdrawalDays;
    private LocalDate withdrawalEndDate;
    private long hoursRemaining;
    private long daysRemaining;
    private String clearTime;
    private boolean isMilkEligible;
    private TreatmentStatus status;
}
