package com.dairyflow.modules.milk.dto;

import com.dairyflow.modules.milk.entity.enums.MilkRecordStatus;
import com.dairyflow.modules.milk.entity.enums.MilkShift;
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
public class MilkRecordResponse {

    private UUID id;
    private UUID cowId;
    private String cowTagNumber;
    private String cowName;
    private String pen;
    private LocalDate productionDate;
    private MilkShift shift;
    private Double quantityLiters;
    private MilkRecordStatus status;
    private Double fatPercentage;
    private Double proteinPercentage;
    private Integer somaticCellCount;
    private Double conductivity;
    private UUID operatorId;
    private String operatorName;
    private String notes;
    private Instant createdAt;
    private Instant updatedAt;
    private String createdBy;
    private String updatedBy;
}
