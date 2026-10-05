package com.dairyflow.modules.breeding.dto;

import com.dairyflow.modules.breeding.entity.enums.BreedingMethod;
import com.dairyflow.modules.breeding.entity.enums.PregnancyConfirmationMethod;
import com.dairyflow.modules.breeding.entity.enums.PregnancyStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PregnancyRecordResponse {

    private UUID id;
    private UUID cowId;
    private String cowTagNumber;
    private String cowName;
    private UUID breedingId;
    private LocalDate breedingDate;
    private BreedingMethod breedingMethod;
    private LocalDate confirmationDate;
    private PregnancyConfirmationMethod confirmationMethod;
    private LocalDate expectedCalvingDate;
    private PregnancyStatus pregnancyStatus;
    private UUID confirmedById;
    private String confirmedByName;
    private String notes;
    private Long daysRemaining;
    private Boolean isOverdue;
    private Long gestationDays;
    private Instant createdAt;
    private Instant updatedAt;
    private String createdBy;
}
