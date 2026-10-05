package com.dairyflow.modules.health.dto;

import com.dairyflow.modules.health.entity.enums.QuarantineStatus;
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
public class QuarantineFilterCriteria {

    private UUID cowId;
    private String cowTag;
    private QuarantineStatus status;
    private String location;
    private LocalDate fromDate;
    private LocalDate toDate;
    private UUID veterinarianId;
    private String search;
}
