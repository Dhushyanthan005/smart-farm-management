package com.dairyflow.modules.breeding.dto;

import com.dairyflow.modules.breeding.entity.enums.ReproductiveStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CowReproductiveSummaryResponse {

    private UUID cowId;
    private String cowTagNumber;
    private String cowName;
    private ReproductiveStatus reproductiveStatus;
    private Integer parity;
    private HeatRecordResponse latestHeat;
    private BreedingRecordResponse latestBreeding;
    private PregnancyRecordResponse activePregnancy;
    private CalvingRecordResponse latestCalving;

    @Builder.Default
    private List<ReproductiveTimelineEventResponse> timeline = new ArrayList<>();
}
