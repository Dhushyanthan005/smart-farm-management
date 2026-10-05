package com.dairyflow.modules.cows.service;

import com.dairyflow.common.audit.AuditService;
import com.dairyflow.common.exception.BadRequestException;
import com.dairyflow.common.exception.ConflictException;
import com.dairyflow.common.response.PageResponse;
import com.dairyflow.modules.cows.dto.*;
import com.dairyflow.modules.cows.entity.Cow;
import com.dairyflow.modules.cows.entity.enums.CowSource;
import com.dairyflow.modules.cows.entity.enums.Gender;
import com.dairyflow.modules.cows.entity.enums.HealthStatus;
import com.dairyflow.modules.cows.entity.enums.LifecycleStatus;
import com.dairyflow.modules.cows.exception.CowNotFoundException;
import com.dairyflow.modules.cows.mapper.CowMapper;
import com.dairyflow.modules.cows.repository.CowRepository;
import com.dairyflow.modules.cows.repository.CowSpecification;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class CowServiceImpl implements CowService {

    private final CowRepository cowRepository;
    private final CowMapper cowMapper;
    private final AuditService auditService;

    @Override
    @Transactional
    public CowResponse registerCow(CreateCowRequest request) {
        String normalizedTag = request.getTagNumber().trim().toUpperCase();
        if (cowRepository.existsByTagNumber(normalizedTag)) {
            throw new ConflictException("Cow with tag number '" + normalizedTag + "' already exists", "DUPLICATE_TAG_NUMBER");
        }

        if (request.getRfid() != null && !request.getRfid().trim().isEmpty()) {
            String trimmedRfid = request.getRfid().trim();
            if (cowRepository.existsByRfid(trimmedRfid)) {
                throw new ConflictException("Cow with RFID '" + trimmedRfid + "' already exists", "DUPLICATE_RFID");
            }
        }

        if (request.getDateOfBirth() != null && request.getDateOfBirth().isAfter(LocalDate.now())) {
            throw new BadRequestException("Date of birth cannot be in the future");
        }

        if (request.getGender() == Gender.MALE && request.getParity() != null && request.getParity() > 0) {
            throw new BadRequestException("Parity cannot be greater than 0 for male animals");
        }

        if (request.getSource() == CowSource.PURCHASED && request.getAcquisitionDate() != null
                && request.getDateOfBirth() != null && request.getAcquisitionDate().isBefore(request.getDateOfBirth())) {
            throw new BadRequestException("Acquisition date cannot be prior to date of birth");
        }

        Cow cow = cowMapper.toEntity(request);
        Cow savedCow = cowRepository.save(cow);

        auditService.logAction("Cow", savedCow.getId().toString(), "COW_CREATED",
                null, "Registered cow with tag " + savedCow.getTagNumber(), null);

        log.info("Registered cow with id: {} and tag: {}", savedCow.getId(), savedCow.getTagNumber());
        return cowMapper.toResponse(savedCow);
    }

    @Override
    @Transactional(readOnly = true)
    public CowResponse getCowById(UUID id) {
        Cow cow = cowRepository.findById(id)
                .orElseThrow(() -> new CowNotFoundException("id", id));
        return cowMapper.toResponse(cow);
    }

    @Override
    @Transactional(readOnly = true)
    public CowResponse getCowByTagNumber(String tagNumber) {
        Cow cow = cowRepository.findByTagNumber(tagNumber.trim().toUpperCase())
                .orElseThrow(() -> new CowNotFoundException("tagNumber", tagNumber));
        return cowMapper.toResponse(cow);
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<CowResponse> listCows(CowFilterCriteria criteria, Pageable pageable) {
        Page<Cow> cowPage = cowRepository.findAll(CowSpecification.withFilters(criteria), pageable);
        Page<CowResponse> responsePage = cowPage.map(cowMapper::toResponse);
        return PageResponse.from(responsePage);
    }

    @Override
    @Transactional
    public CowResponse updateCow(UUID id, UpdateCowRequest request) {
        Cow cow = cowRepository.findById(id)
                .orElseThrow(() -> new CowNotFoundException("id", id));

        if (request.getRfid() != null && !request.getRfid().trim().isEmpty()) {
            String trimmedRfid = request.getRfid().trim();
            if (!trimmedRfid.equalsIgnoreCase(cow.getRfid()) && cowRepository.existsByRfid(trimmedRfid)) {
                throw new ConflictException("Cow with RFID '" + trimmedRfid + "' already exists", "DUPLICATE_RFID");
            }
        }

        if (request.getDateOfBirth() != null && request.getDateOfBirth().isAfter(LocalDate.now())) {
            throw new BadRequestException("Date of birth cannot be in the future");
        }

        HealthStatus oldHealth = cow.getHealthStatus();
        LifecycleStatus oldLifecycle = cow.getLifecycleStatus();

        cowMapper.updateEntityFromRequest(cow, request);
        Cow updatedCow = cowRepository.save(cow);

        boolean statusChanged = (oldHealth != updatedCow.getHealthStatus()) || (oldLifecycle != updatedCow.getLifecycleStatus());
        String action = statusChanged ? "COW_STATUS_CHANGED" : "COW_UPDATED";

        auditService.logAction("Cow", id.toString(), action,
                null, "Updated cow record for tag " + updatedCow.getTagNumber(), null);

        log.info("Updated cow id: {} (action: {})", id, action);
        return cowMapper.toResponse(updatedCow);
    }

    @Override
    @Transactional
    public void deleteCow(UUID id) {
        Cow cow = cowRepository.findById(id)
                .orElseThrow(() -> new CowNotFoundException("id", id));

        // Business-safe archiving to preserve historical farm records (lineage, yields, vet history)
        cow.setLifecycleStatus(LifecycleStatus.DECEASED);
        cowRepository.save(cow);

        auditService.logAction("Cow", id.toString(), "COW_ARCHIVED",
                null, "Archived cow record for tag " + cow.getTagNumber() + " (status set to DECEASED)", null);

        log.info("Archived cow id: {} with tag: {}", id, cow.getTagNumber());
    }

    @Override
    @Transactional(readOnly = true)
    public CowStatsResponse getCowStats() {
        long totalHead = cowRepository.countByLifecycleStatus(LifecycleStatus.ACTIVE);
        long inMilk = cowRepository.countInMilk();
        long dry = cowRepository.countDry();
        long heifers = cowRepository.countHeifers();
        long quarantine = cowRepository.countQuarantined();

        return CowStatsResponse.builder()
                .totalHead(totalHead)
                .inMilk(inMilk)
                .dry(dry)
                .heifers(heifers)
                .quarantine(quarantine)
                .build();
    }
}
