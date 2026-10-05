package com.dairyflow.modules.breeding.dto;

import com.dairyflow.modules.breeding.entity.enums.BreedingMethod;
import com.dairyflow.modules.breeding.entity.enums.BreedingStatus;
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
public class BreedingFilterCriteria {

    private UUID cowId;
    private String cowTag;
    private BreedingMethod breedingMethod;
    private BreedingStatus status;
    private UUID technicianId;
    private UUID veterinarianId;
    private LocalDate fromDate;
    private LocalDate toDate;
    private String search;
}
