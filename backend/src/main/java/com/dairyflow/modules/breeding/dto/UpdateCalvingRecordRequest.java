package com.dairyflow.modules.breeding.dto;

import com.dairyflow.modules.breeding.entity.enums.CalvingType;
import jakarta.validation.constraints.Min;
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
public class UpdateCalvingRecordRequest {

    private LocalDate calvingDate;
    private CalvingType calvingType;

    @Min(value = 1, message = "Calf count must be at least 1")
    private Integer calfCount;

    @Size(max = 2000, message = "Calf details must not exceed 2000 characters")
    private String calfDetails;

    @Size(max = 1000, message = "Complications must not exceed 1000 characters")
    private String complications;

    private Boolean assistanceRequired;

    private UUID veterinarianId;

    @Size(max = 100, message = "Veterinarian name must not exceed 100 characters")
    private String veterinarianName;

    @Size(max = 2000, message = "Notes must not exceed 2000 characters")
    private String notes;
}
