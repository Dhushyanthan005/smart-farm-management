package com.dairyflow.modules.breeding.dto;

import com.dairyflow.modules.breeding.entity.enums.CalvingType;
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
public class CalvingFilterCriteria {

    private UUID cowId;
    private String cowTag;
    private CalvingType calvingType;
    private Boolean complicationsOnly;
    private LocalDate fromDate;
    private LocalDate toDate;
    private String search;
}
