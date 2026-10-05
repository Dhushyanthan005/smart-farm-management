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
public class TreatmentFilterCriteria {

    private UUID cowId;
    private String cowTag;
    private TreatmentStatus status;
    private String medication;
    private String treatmentType;
    private LocalDate fromDate;
    private LocalDate toDate;
    private Boolean activeWithdrawalOnly;
    private UUID veterinarianId;
    private String search;
}
