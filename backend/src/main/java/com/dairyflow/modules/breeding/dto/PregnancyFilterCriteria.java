package com.dairyflow.modules.breeding.dto;

import com.dairyflow.modules.breeding.entity.enums.PregnancyStatus;
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
public class PregnancyFilterCriteria {

    private UUID cowId;
    private String cowTag;
    private PregnancyStatus pregnancyStatus;
    private LocalDate fromExpectedDate;
    private LocalDate toExpectedDate;
    private LocalDate fromConfirmationDate;
    private LocalDate toConfirmationDate;
    private Boolean overdueOnly;
    private String search;
}
