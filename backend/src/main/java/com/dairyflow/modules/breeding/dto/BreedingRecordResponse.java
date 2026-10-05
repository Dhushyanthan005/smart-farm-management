package com.dairyflow.modules.breeding.dto;

import com.dairyflow.modules.breeding.entity.enums.BreedingMethod;
import com.dairyflow.modules.breeding.entity.enums.BreedingStatus;
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
public class BreedingRecordResponse {

    private UUID id;
    private UUID cowId;
    private String cowTagNumber;
    private String cowName;
    private UUID heatRecordId;
    private LocalDate breedingDate;
    private BreedingMethod breedingMethod;
    private UUID bullId;
    private String bullTagNumber;
    private String bullName;
    private String semenReference;
    private UUID technicianId;
    private String technicianName;
    private UUID veterinarianId;
    private String veterinarianName;
    private String notes;
    private BreedingStatus status;
    private Instant createdAt;
    private Instant updatedAt;
    private String createdBy;
}
