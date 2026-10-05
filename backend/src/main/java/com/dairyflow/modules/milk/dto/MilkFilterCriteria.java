package com.dairyflow.modules.milk.dto;

import com.dairyflow.modules.milk.entity.enums.MilkRecordStatus;
import com.dairyflow.modules.milk.entity.enums.MilkShift;
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
public class MilkFilterCriteria {

    private LocalDate date;
    private LocalDate fromDate;
    private LocalDate toDate;
    private MilkShift shift;
    private UUID cowId;
    private String cowTag;
    private MilkRecordStatus status;
    private String search;
}
