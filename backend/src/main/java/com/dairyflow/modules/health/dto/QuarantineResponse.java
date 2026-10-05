package com.dairyflow.modules.health.dto;

import com.dairyflow.modules.health.entity.enums.QuarantineStatus;
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
public class QuarantineResponse {

    private UUID id;
    private UUID cowId;
    private String cowTagNumber;
    private String cowName;
    private LocalDate startDate;
    private LocalDate expectedReleaseDate;
    private LocalDate actualReleaseDate;
    private String reason;
    private String location;
    private QuarantineStatus status;
    private long daysInIsolation;
    private UUID veterinarianId;
    private String veterinarianName;
    private String notes;
    private Instant createdAt;
    private Instant updatedAt;
    private String createdBy;
}
