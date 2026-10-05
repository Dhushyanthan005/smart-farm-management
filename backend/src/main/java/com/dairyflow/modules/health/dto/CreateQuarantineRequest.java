package com.dairyflow.modules.health.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PastOrPresent;
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
public class CreateQuarantineRequest {

    private UUID cowId;

    @Size(max = 30, message = "Cow tag number must not exceed 30 characters")
    private String cowTagNumber;

    @NotNull(message = "Start date is required")
    @PastOrPresent(message = "Start date cannot be in the future")
    private LocalDate startDate;

    private LocalDate expectedReleaseDate;

    @NotBlank(message = "Reason for quarantine isolation is required")
    @Size(max = 255, message = "Reason cannot exceed 255 characters")
    private String reason;

    @NotBlank(message = "Location/bay number is required")
    @Size(max = 100, message = "Location cannot exceed 100 characters")
    private String location;

    private UUID veterinarianId;

    @Size(max = 100, message = "Veterinarian name must not exceed 100 characters")
    private String veterinarianName;

    @Size(max = 2000, message = "Notes must not exceed 2000 characters")
    private String notes;
}
