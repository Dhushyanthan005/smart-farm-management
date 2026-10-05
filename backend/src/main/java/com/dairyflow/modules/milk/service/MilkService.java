package com.dairyflow.modules.milk.service;

import com.dairyflow.common.response.PageResponse;
import com.dairyflow.modules.milk.dto.*;
import com.dairyflow.modules.milk.entity.enums.MilkShift;
import org.springframework.data.domain.Pageable;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public interface MilkService {

    MilkRecordResponse recordMilk(CreateMilkRecordRequest request);

    List<MilkRecordResponse> recordBatchMilk(BatchMilkRecordRequest request);

    MilkRecordResponse getMilkRecordById(UUID id);

    PageResponse<MilkRecordResponse> listMilkRecords(MilkFilterCriteria criteria, Pageable pageable);

    PageResponse<MilkRecordResponse> getCowMilkHistory(UUID cowId, Pageable pageable);

    MilkRecordResponse updateMilkRecord(UUID id, UpdateMilkRecordRequest request);

    void deleteMilkRecord(UUID id);

    DailyMilkSummaryResponse getDailySummary(LocalDate date);

    ShiftMilkSummaryResponse getShiftSummary(LocalDate date, MilkShift shift);
}
