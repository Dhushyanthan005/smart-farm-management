package com.dairyflow.modules.breeding.dto;

import com.dairyflow.modules.breeding.entity.enums.BreedingMethod;
import com.dairyflow.modules.breeding.entity.enums.BreedingStatus;
import jakarta.validation.constraints.Size;
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
public class UpdateBreedingRecordRequest {

    private LocalDate breedingDate;
    private BreedingMethod breedingMethod;
    private UUID bullId;

    @Size(max = 30, message = "Bull tag number must not exceed 30 characters")
    private String bullTagNumber;

    @Size(max = 100, message = "Semen reference must not exceed 100 characters")
    private String semenReference;

    private UUID technicianId;

    @Size(max = 100, message = "Technician name must not exceed 100 characters")
    private String technicianName;

    private UUID veterinarianId;

    @Size(max = 100, message = "Veterinarian name must not exceed 100 characters")
    private String veterinarianName;

    private UUID heatRecordId;

    @Size(max = 2000, message = "Notes must not exceed 2000 characters")
    private String notes;

    private BreedingStatus status;
}
