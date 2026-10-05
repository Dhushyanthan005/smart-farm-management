package com.dairyflow.modules.breeding.dto;

import com.dairyflow.modules.breeding.entity.enums.PregnancyConfirmationMethod;
import com.dairyflow.modules.breeding.entity.enums.PregnancyStatus;
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
public class UpdatePregnancyRecordRequest {

    private LocalDate confirmationDate;
    private PregnancyConfirmationMethod confirmationMethod;
    private LocalDate expectedCalvingDate;
    private PregnancyStatus pregnancyStatus;
    private UUID confirmedById;

    @Size(max = 100, message = "Confirmed by name must not exceed 100 characters")
    private String confirmedByName;

    @Size(max = 2000, message = "Notes must not exceed 2000 characters")
    private String notes;
}
