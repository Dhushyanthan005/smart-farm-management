package com.dairyflow.modules.cows.dto;

import com.dairyflow.modules.cows.entity.enums.Breed;
import com.dairyflow.modules.cows.entity.enums.CowSource;
import com.dairyflow.modules.cows.entity.enums.Gender;
import com.dairyflow.modules.cows.entity.enums.HealthStatus;
import com.dairyflow.modules.cows.entity.enums.LifecycleStatus;
import jakarta.validation.constraints.*;
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

    @Size(max = 50, message = "RFID identifier must not exceed 50 characters")
    private String rfid;

    @Size(max = 50, message = "Name must not exceed 50 characters")
    private String name;

    @NotNull(message = "Breed is required")
    private Breed breed;

    @NotNull(message = "Gender is required")
    private Gender gender;

    @NotNull(message = "Date of birth is required")
    @PastOrPresent(message = "Date of birth cannot be in the future")
    private LocalDate dateOfBirth;

    @Min(value = 0, message = "Parity must be greater than or equal to 0")
    private Integer parity;

    private HealthStatus healthStatus;

    private LifecycleStatus lifecycleStatus;

    private CowSource source;

    @Size(max = 50, message = "Barn name must not exceed 50 characters")
    private String barn;

    @Size(max = 50, message = "Pen name must not exceed 50 characters")
    private String pen;

    @PositiveOrZero(message = "Expected milk capacity must be positive or zero")
    private Double expectedMilkCapacity;

    @Size(max = 30, message = "Current milk status must not exceed 30 characters")
    private String currentMilkStatus;

    private UUID motherId;
    private UUID fatherId;

    private LocalDate acquisitionDate;

    @Size(max = 100, message = "Acquisition place must not exceed 100 characters")
    private String acquisitionPlace;

    @Size(max = 255, message = "Photo URL must not exceed 255 characters")
    private String photoUrl;

    @Size(max = 1000, message = "Notes must not exceed 1000 characters")
    private String notes;
}
