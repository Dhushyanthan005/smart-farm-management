package com.dairyflow.modules.breeding.dto;

import com.dairyflow.modules.breeding.entity.enums.CalvingType;
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
public class CalvingRecordResponse {

    private UUID id;
    private UUID cowId;
    private String cowTagNumber;
    private String cowName;
    private UUID pregnancyId;
    private LocalDate calvingDate;
    private CalvingType calvingType;
    private Integer calfCount;
    private String calfDetails;
    private String complications;
    private Boolean assistanceRequired;
    private UUID veterinarianId;
    private String veterinarianName;
    private String notes;
    private Instant createdAt;
    private Instant updatedAt;
    private String createdBy;
}
