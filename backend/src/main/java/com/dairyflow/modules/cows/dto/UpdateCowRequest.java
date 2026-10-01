package com.dairyflow.modules.cows.dto;

import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateCowRequest {

    @Size(max = 50, message = "Name must not exceed 50 characters")
    private String name;

    @Size(max = 50, message = "Breed must not exceed 50 characters")
    private String breed;

    @Pattern(regexp = "^(ACTIVE|LACTATING|DRY|PREGNANT|SICK|SOLD|DECEASED)$", message = "Invalid cow status")
    private String status;

    @Size(max = 255, message = "Photo URL must not exceed 255 characters")
    private String photoUrl;

    @Size(max = 500, message = "Notes must not exceed 500 characters")
    private String notes;
}
