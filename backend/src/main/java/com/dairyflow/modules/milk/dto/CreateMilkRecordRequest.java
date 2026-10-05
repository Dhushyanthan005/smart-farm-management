package com.dairyflow.modules.milk.dto;

import com.dairyflow.modules.milk.entity.enums.MilkRecordStatus;
import com.dairyflow.modules.milk.entity.enums.MilkShift;
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
public class CreateMilkRecordRequest {

    private UUID cowId;

    @Size(max = 30, message = "Cow tag number must not exceed 30 characters")
    private String cowTagNumber;

    @NotNull(message = "Production date is required")
    @PastOrPresent(message = "Production date cannot be in the future")
    private LocalDate productionDate;

    @NotNull(message = "Milking shift is required (MORNING or EVENING)")
    private MilkShift shift;

    @NotNull(message = "Quantity in liters is required")
    @PositiveOrZero(message = "Milk quantity must be greater than or equal to 0")
    @DecimalMax(value = "100.0", message = "Milk quantity exceeds realistic single-session capacity (100L)")
    private Double quantityLiters;

    private MilkRecordStatus status;

    @DecimalMin(value = "0.0", message = "Fat percentage must be non-negative")
    @DecimalMax(value = "15.0", message = "Fat percentage must be realistic (<= 15%)")
    private Double fatPercentage;

    @DecimalMin(value = "0.0", message = "Protein percentage must be non-negative")
    @DecimalMax(value = "15.0", message = "Protein percentage must be realistic (<= 15%)")
    private Double proteinPercentage;

    @Min(value = 0, message = "Somatic cell count cannot be negative")
    private Integer somaticCellCount;

    @PositiveOrZero(message = "Conductivity must be non-negative")
    private Double conductivity;

    @Size(max = 500, message = "Notes cannot exceed 500 characters")
    private String notes;
}
