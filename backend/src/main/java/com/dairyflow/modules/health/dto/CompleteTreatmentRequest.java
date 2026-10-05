package com.dairyflow.modules.health.dto;

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
public class CompleteTreatmentRequest {

    @PastOrPresent(message = "Completion date cannot be in the future")
    private LocalDate completionDate;

    @Size(max = 2000, message = "Resolution notes cannot exceed 2000 characters")
    private String notes;
}
