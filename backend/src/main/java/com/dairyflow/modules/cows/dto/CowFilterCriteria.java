package com.dairyflow.modules.cows.dto;

import com.dairyflow.modules.cows.entity.enums.Breed;
import com.dairyflow.modules.cows.entity.enums.Gender;
import com.dairyflow.modules.cows.entity.enums.HealthStatus;
import com.dairyflow.modules.cows.entity.enums.LifecycleStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CowFilterCriteria {

    private String search;
    private HealthStatus healthStatus;
    private LifecycleStatus lifecycleStatus;
    private Breed breed;
    private Gender gender;
    private String barn;
    private String pen;
    private Integer parity;
    private Integer minParity;
    private String lactationStage;
}
