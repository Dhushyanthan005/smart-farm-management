package com.dairyflow.modules.health.dto;

import com.dairyflow.modules.health.entity.enums.CowHealthStatus;
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
public class HealthFilterCriteria {

    private UUID cowId;
    private String cowTag;
    private CowHealthStatus healthStatus;
    private LocalDate fromDate;
    private LocalDate toDate;
    private String diagnosis;
    private UUID veterinarianId;
    private String search;
}
