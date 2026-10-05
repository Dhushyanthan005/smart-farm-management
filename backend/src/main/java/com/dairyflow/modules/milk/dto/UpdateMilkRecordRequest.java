package com.dairyflow.modules.milk.dto;

import com.dairyflow.modules.milk.entity.enums.MilkRecordStatus;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateMilkRecordRequest {

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
