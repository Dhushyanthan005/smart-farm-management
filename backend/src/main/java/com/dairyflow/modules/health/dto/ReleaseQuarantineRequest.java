package com.dairyflow.modules.health.dto;

import com.dairyflow.modules.health.entity.enums.CowHealthStatus;
import jakarta.validation.constraints.PastOrPresent;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReleaseQuarantineRequest {

    @PastOrPresent(message = "Release date cannot be in the future")
    private LocalDate actualReleaseDate;

    @Builder.Default
    private CowHealthStatus nextHealthStatus = CowHealthStatus.HEALTHY;

    @Size(max = 2000, message = "Release notes cannot exceed 2000 characters")
    private String notes;
}
