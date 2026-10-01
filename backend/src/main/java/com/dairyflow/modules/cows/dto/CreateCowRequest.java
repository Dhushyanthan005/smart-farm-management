package com.dairyflow.modules.cows.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PastOrPresent;
import jakarta.validation.constraints.Pattern;
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
public class CreateCowRequest {

    @NotBlank(message = "Tag number cannot be blank")
    @Size(min = 2, max = 30, message = "Tag number must be between 2 and 30 characters")
    private String tagNumber;

    @Size(max = 50, message = "Name must not exceed 50 characters")
    private String name;

    @NotBlank(message = "Breed is required")
    @Size(max = 50, message = "Breed must not exceed 50 characters")
    private String breed;

    @NotNull(message = "Date of birth is required")
    @PastOrPresent(message = "Date of birth cannot be in the future")
    private LocalDate dateOfBirth;

    @NotBlank(message = "Gender is required")
    @Pattern(regexp = "^(FEMALE|MALE)$", message = "Gender must be either FEMALE or MALE")
    private String gender;

    @Pattern(regexp = "^(ACTIVE|LACTATING|DRY|PREGNANT|SICK|SOLD|DECEASED)$", message = "Invalid cow status")
    private String status;

    private UUID motherId;
    private UUID fatherId;

    @Size(max = 500, message = "Notes must not exceed 500 characters")
    private String notes;
}
