package com.dairyflow.modules.health.dto;

import com.dairyflow.modules.health.entity.enums.CowHealthStatus;
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
public class HealthRecordResponse {

    private UUID id;
    private UUID cowId;
    private String cowTagNumber;
    private String cowName;
    private LocalDate recordDate;
    private CowHealthStatus healthStatus;
    private String diagnosis;
    private String symptoms;
    private Double temperature;
    private Double weight;
    private UUID veterinarianId;
    private String veterinarianName;
    private String notes;
    private Instant createdAt;
    private Instant updatedAt;
    private String createdBy;
}
