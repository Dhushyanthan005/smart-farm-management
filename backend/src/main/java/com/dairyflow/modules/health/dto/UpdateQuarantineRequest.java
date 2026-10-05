package com.dairyflow.modules.health.dto;

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
public class UpdateQuarantineRequest {

    private LocalDate expectedReleaseDate;

    @Size(max = 255, message = "Reason cannot exceed 255 characters")
    private String reason;

    @Size(max = 100, message = "Location cannot exceed 100 characters")
    private String location;

    private UUID veterinarianId;

    @Size(max = 100, message = "Veterinarian name must not exceed 100 characters")
    private String veterinarianName;

    @Size(max = 2000, message = "Notes must not exceed 2000 characters")
    private String notes;
}
