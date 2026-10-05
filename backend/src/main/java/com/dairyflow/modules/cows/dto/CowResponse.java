package com.dairyflow.modules.cows.dto;

import com.dairyflow.modules.cows.entity.enums.Breed;
import com.dairyflow.modules.cows.entity.enums.CowSource;
import com.dairyflow.modules.cows.entity.enums.Gender;
import com.dairyflow.modules.cows.entity.enums.HealthStatus;
import com.dairyflow.modules.cows.entity.enums.LifecycleStatus;
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
public class CowResponse {

    private UUID id;
    private String tagNumber;
    private String rfid;
    private String name;
    private Breed breed;
    private Gender gender;
    private LocalDate dateOfBirth;
    private String age;
    private Double ageInYears;
    private Integer parity;
    private HealthStatus healthStatus;
    private LifecycleStatus lifecycleStatus;
    private CowSource source;
    private String barn;
    private String pen;
    private Double expectedMilkCapacity;
    private String currentMilkStatus;
    private UUID motherId;
    private UUID fatherId;
    private LocalDate acquisitionDate;
    private String acquisitionPlace;
    private String photoUrl;
    private String notes;
    private Instant createdAt;
    private Instant updatedAt;
    private String createdBy;
    private String updatedBy;
}
