package com.dairyflow.modules.milk.service;

import com.dairyflow.common.audit.AuditService;
import com.dairyflow.common.exception.BadRequestException;
import com.dairyflow.common.exception.ConflictException;
import com.dairyflow.common.exception.ResourceNotFoundException;
import com.dairyflow.common.response.PageResponse;
import com.dairyflow.modules.cows.entity.Cow;
import com.dairyflow.modules.cows.entity.enums.LifecycleStatus;
import com.dairyflow.modules.cows.repository.CowRepository;
import com.dairyflow.modules.milk.dto.*;
import com.dairyflow.modules.milk.entity.MilkProductionRecord;
import com.dairyflow.modules.milk.entity.enums.MilkRecordStatus;
import com.dairyflow.modules.milk.entity.enums.MilkShift;
import com.dairyflow.modules.milk.exception.MilkRecordNotFoundException;
import com.dairyflow.modules.milk.mapper.MilkMapper;
import com.dairyflow.modules.milk.repository.MilkRepository;
import com.dairyflow.modules.milk.repository.MilkSpecification;
import com.dairyflow.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class MilkServiceImpl implements MilkService {

    private final MilkRepository milkRepository;
    private final CowRepository cowRepository;
    private final MilkMapper milkMapper;
    private final AuditService auditService;

    @Override
    @Transactional
    public MilkRecordResponse recordMilk(CreateMilkRecordRequest request) {
        Cow cow = resolveCow(request.getCowId(), request.getCowTagNumber());
        validateCowForMilking(cow);
        validateProductionData(request.getProductionDate(), request.getQuantityLiters());

        if (milkRepository.existsByCowIdAndProductionDateAndShift(cow.getId(), request.getProductionDate(), request.getShift())) {
            throw new ConflictException(
                    "Milk collection record for cow '" + cow.getTagNumber() + "' on "
                            + request.getProductionDate() + " (" + request.getShift() + ") already exists",
                    "DUPLICATE_MILK_RECORD"
            );
        }

        UUID operatorId = null;
        String operatorName = null;
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getPrincipal() instanceof UserPrincipal principal) {
            operatorId = principal.getId();
            operatorName = principal.getFullName();
        }

        MilkProductionRecord record = milkMapper.toEntity(request, cow, operatorId, operatorName);
        MilkProductionRecord saved = milkRepository.save(record);

        auditService.logAction(
                "MilkProductionRecord",
                saved.getId().toString(),
                "MILK_RECORDED",
                null,
                String.format("Logged %s L (%s shift) for cow %s", saved.getQuantityLiters(), saved.getShift(), cow.getTagNumber()),
                null
        );

        log.info("Recorded milk entry id: {} for cow: {} (qty: {} L)", saved.getId(), cow.getTagNumber(), saved.getQuantityLiters());
        return milkMapper.toResponse(saved);
    }

    @Override
    @Transactional
    public List<MilkRecordResponse> recordBatchMilk(BatchMilkRecordRequest batchRequest) {
        validateProductionData(batchRequest.getProductionDate(), 0.0);

        List<MilkRecordResponse> responses = new ArrayList<>();
        for (BatchMilkRecordRequest.BatchMilkEntryItem item : batchRequest.getRecords()) {
            CreateMilkRecordRequest singleRequest = CreateMilkRecordRequest.builder()
                    .cowId(item.getCowId())
                    .cowTagNumber(item.getCowTagNumber())
                    .productionDate(batchRequest.getProductionDate())
                    .shift(batchRequest.getShift())
                    .quantityLiters(item.getQuantityLiters())
                    .status(item.getStatus())
                    .fatPercentage(item.getFatPercentage())
                    .proteinPercentage(item.getProteinPercentage())
                    .somaticCellCount(item.getSomaticCellCount())
                    .conductivity(item.getConductivity())
                    .notes(item.getNotes())
                    .build();
            responses.add(recordMilk(singleRequest));
        }

        log.info("Successfully processed batch milking session of {} records for {}", responses.size(), batchRequest.getProductionDate());
        return responses;
    }

    @Override
    @Transactional(readOnly = true)
    public MilkRecordResponse getMilkRecordById(UUID id) {
        MilkProductionRecord record = milkRepository.findWithCowById(id)
                .orElseThrow(() -> new MilkRecordNotFoundException("id", id));
        return milkMapper.toResponse(record);
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<MilkRecordResponse> listMilkRecords(MilkFilterCriteria criteria, Pageable pageable) {
        Page<MilkProductionRecord> page = milkRepository.findAll(MilkSpecification.withFilters(criteria), pageable);
        return PageResponse.from(page.map(milkMapper::toResponse));
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<MilkRecordResponse> getCowMilkHistory(UUID cowId, Pageable pageable) {
        if (!cowRepository.existsById(cowId)) {
            throw new ResourceNotFoundException("Cow", "id", cowId);
        }

        Page<MilkProductionRecord> page = milkRepository.findByCowId(cowId, pageable);
        return PageResponse.from(page.map(milkMapper::toResponse));
    }

    @Override
    @Transactional
    public MilkRecordResponse updateMilkRecord(UUID id, UpdateMilkRecordRequest request) {
        MilkProductionRecord record = milkRepository.findWithCowById(id)
                .orElseThrow(() -> new MilkRecordNotFoundException("id", id));

        if (request.getQuantityLiters() != null && request.getQuantityLiters() < 0) {
            throw new BadRequestException("Milk quantity cannot be negative");
        }

        MilkRecordStatus previousStatus = record.getStatus();
        milkMapper.updateEntityFromRequest(record, request);
        MilkProductionRecord updated = milkRepository.save(record);

        String auditAction = "MILK_UPDATED";
        if (request.getStatus() != null && request.getStatus() != previousStatus) {
            if (request.getStatus() == MilkRecordStatus.WASTE || request.getStatus() == MilkRecordStatus.DISCARDED) {
                auditAction = "MILK_DISCARDED";
            } else if (request.getStatus() == MilkRecordStatus.APPROVED) {
                auditAction = "MILK_APPROVED";
            }
        }

        auditService.logAction(
                "MilkProductionRecord",
                id.toString(),
                auditAction,
                null,
                String.format("Updated milk record %s (status: %s, qty: %s L)", id, updated.getStatus(), updated.getQuantityLiters()),
                null
        );

        log.info("Updated milk record id: {} with status: {}", id, updated.getStatus());
        return milkMapper.toResponse(updated);
    }

    @Override
    @Transactional
    public void deleteMilkRecord(UUID id) {
        MilkProductionRecord record = milkRepository.findById(id)
                .orElseThrow(() -> new MilkRecordNotFoundException("id", id));

        milkRepository.delete(record);

        auditService.logAction(
                "MilkProductionRecord",
                id.toString(),
                "MILK_DELETED",
                null,
                "Deleted milk record id: " + id,
                null
        );

        log.info("Deleted milk record id: {}", id);
    }

    @Override
    @Transactional(readOnly = true)
    public DailyMilkSummaryResponse getDailySummary(LocalDate date) {
        LocalDate targetDate = (date != null) ? date : LocalDate.now();

        Double morning = milkRepository.sumYieldByDateAndShift(targetDate, MilkShift.MORNING);
        Double evening = milkRepository.sumYieldByDateAndShift(targetDate, MilkShift.EVENING);
        Double bulk = milkRepository.sumBulkYieldByDate(targetDate);
        Double withheld = milkRepository.sumWithheldYieldByDate(targetDate);
        Long count = milkRepository.countRecordsByDate(targetDate);

        double total = (morning != null ? morning : 0.0) + (evening != null ? evening : 0.0);
        double avg = (count != null && count > 0) ? (total / count) : 0.0;

        return DailyMilkSummaryResponse.builder()
                .date(targetDate)
                .morningLiters(round2(morning))
                .eveningLiters(round2(evening))
                .totalLiters(round2(total))
                .bulkLiters(round2(bulk))
                .withheldLiters(round2(withheld))
                .cowsMilked(count != null ? count : 0)
                .averageYield(round2(avg))
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public ShiftMilkSummaryResponse getShiftSummary(LocalDate date, MilkShift shift) {
        LocalDate targetDate = (date != null) ? date : LocalDate.now();
        MilkShift targetShift = (shift != null) ? shift : MilkShift.MORNING;

        Double bulk = milkRepository.sumBulkYieldByDateAndShift(targetDate, targetShift);
        Double withheld = milkRepository.sumWithheldYieldByDateAndShift(targetDate, targetShift);
        Long count = milkRepository.countByDateAndShift(targetDate, targetShift);
        Double max = milkRepository.maxYieldByDateAndShift(targetDate, targetShift);
        Double min = milkRepository.minYieldByDateAndShift(targetDate, targetShift);
        Double avg = milkRepository.avgYieldByDateAndShift(targetDate, targetShift);

        double total = (bulk != null ? bulk : 0.0) + (withheld != null ? withheld : 0.0);

        return ShiftMilkSummaryResponse.builder()
                .date(targetDate)
                .shift(targetShift)
                .totalYield(round2(total))
                .bulkYield(round2(bulk))
                .withheldYield(round2(withheld))
                .cowsMilked(count != null ? count : 0)
                .averageYield(round2(avg))
                .highestYield(round2(max))
                .lowestYield(round2(min))
                .build();
    }

    private Cow resolveCow(UUID cowId, String tagNumber) {
        if (cowId != null) {
            return cowRepository.findById(cowId)
                    .orElseThrow(() -> new ResourceNotFoundException("Cow", "id", cowId));
        }
        if (tagNumber != null && !tagNumber.trim().isEmpty()) {
            String normalizedTag = tagNumber.trim().toUpperCase().replace("#", "");
            return cowRepository.findByTagNumber(normalizedTag)
                    .orElseThrow(() -> new ResourceNotFoundException("Cow", "tagNumber", normalizedTag));
        }
        throw new BadRequestException("Either cowId or cowTagNumber must be provided");
    }

    private void validateCowForMilking(Cow cow) {
        if (cow.getLifecycleStatus() == LifecycleStatus.DECEASED || cow.getLifecycleStatus() == LifecycleStatus.SOLD) {
            throw new BadRequestException(
                    "Cannot record milk production for cow '" + cow.getTagNumber() + "' with status " + cow.getLifecycleStatus()
            );
        }
    }

    private void validateProductionData(LocalDate date, Double quantity) {
        if (date != null && date.isAfter(LocalDate.now())) {
            throw new BadRequestException("Production date cannot be in the future");
        }
        if (quantity != null && quantity < 0) {
            throw new BadRequestException("Quantity in liters cannot be negative");
        }
    }

    private double round2(Double value) {
        if (value == null) return 0.0;
        return Math.round(value * 100.0) / 100.0;
    }
}
