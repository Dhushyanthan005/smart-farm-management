package com.dairyflow.modules.health.service;

import com.dairyflow.common.audit.AuditService;
import com.dairyflow.common.exception.BadRequestException;
import com.dairyflow.common.exception.ConflictException;
import com.dairyflow.common.exception.ResourceNotFoundException;
import com.dairyflow.common.response.PageResponse;
import com.dairyflow.modules.cows.entity.Cow;
import com.dairyflow.modules.cows.entity.enums.HealthStatus;
import com.dairyflow.modules.cows.entity.enums.LifecycleStatus;
import com.dairyflow.modules.cows.repository.CowRepository;
import com.dairyflow.modules.health.dto.*;
import com.dairyflow.modules.health.entity.HealthRecord;
import com.dairyflow.modules.health.entity.QuarantineRecord;
import com.dairyflow.modules.health.entity.Treatment;
import com.dairyflow.modules.health.entity.enums.CowHealthStatus;
import com.dairyflow.modules.health.entity.enums.QuarantineStatus;
import com.dairyflow.modules.health.entity.enums.TreatmentStatus;
import com.dairyflow.modules.health.exception.CowAlreadyQuarantinedException;
import com.dairyflow.modules.health.exception.HealthRecordNotFoundException;
import com.dairyflow.modules.health.exception.QuarantineRecordNotFoundException;
import com.dairyflow.modules.health.exception.TreatmentNotFoundException;
import com.dairyflow.modules.health.mapper.HealthMapper;
import com.dairyflow.modules.health.repository.*;
import com.dairyflow.modules.users.entity.User;
import com.dairyflow.modules.users.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class HealthServiceImpl implements HealthService {

    private final HealthRecordRepository healthRecordRepository;
    private final TreatmentRepository treatmentRepository;
    private final QuarantineRecordRepository quarantineRecordRepository;
    private final CowRepository cowRepository;
    private final UserRepository userRepository;
    private final HealthMapper healthMapper;
    private final AuditService auditService;

    // ==========================================
    // HEALTH RECORDS
    // ==========================================

    @Override
    @Transactional
    public HealthRecordResponse createHealthRecord(CreateHealthRecordRequest request) {
        Cow cow = resolveCow(request.getCowId(), request.getCowTagNumber());
        validateCowForMedicalAttention(cow);

        User veterinarian = resolveVeterinarian(request.getVeterinarianId());
        HealthRecord record = healthMapper.toEntity(request, cow, veterinarian);
        HealthRecord saved = healthRecordRepository.save(record);

        // Update cow's overall health status if appropriate
        syncCowHealthStatus(cow, request.getHealthStatus());

        auditService.logAction(
                "HealthRecord",
                saved.getId().toString(),
                "HEALTH_RECORD_CREATED",
                null,
                String.format("Logged health exam for cow %s: %s (Status: %s)", cow.getTagNumber(), saved.getDiagnosis(), saved.getHealthStatus()),
                null
        );

        log.info("Created health record id: {} for cow: {}", saved.getId(), cow.getTagNumber());
        return healthMapper.toResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public HealthRecordResponse getHealthRecordById(UUID id) {
        HealthRecord record = healthRecordRepository.findWithDetailsById(id)
                .orElseThrow(() -> new HealthRecordNotFoundException("id", id));
        return healthMapper.toResponse(record);
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<HealthRecordResponse> listHealthRecords(HealthFilterCriteria criteria, Pageable pageable) {
        Page<HealthRecord> page = healthRecordRepository.findAll(HealthSpecification.withFilters(criteria), pageable);
        return PageResponse.from(page.map(healthMapper::toResponse));
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<HealthRecordResponse> getCowHealthHistory(UUID cowId, Pageable pageable) {
        if (!cowRepository.existsById(cowId)) {
            throw new ResourceNotFoundException("Cow", "id", cowId);
        }
        Page<HealthRecord> page = healthRecordRepository.findByCowId(cowId, pageable);
        return PageResponse.from(page.map(healthMapper::toResponse));
    }

    @Override
    @Transactional
    public HealthRecordResponse updateHealthRecord(UUID id, UpdateHealthRecordRequest request) {
        HealthRecord record = healthRecordRepository.findWithDetailsById(id)
                .orElseThrow(() -> new HealthRecordNotFoundException("id", id));

        User veterinarian = request.getVeterinarianId() != null ? resolveVeterinarian(request.getVeterinarianId()) : null;
        healthMapper.updateEntityFromRequest(record, request, veterinarian);
        HealthRecord updated = healthRecordRepository.save(record);

        if (request.getHealthStatus() != null) {
            syncCowHealthStatus(record.getCow(), request.getHealthStatus());
        }

        auditService.logAction(
                "HealthRecord",
                id.toString(),
                "HEALTH_RECORD_UPDATED",
                null,
                String.format("Updated health record %s for cow %s", id, record.getCow().getTagNumber()),
                null
        );

        log.info("Updated health record id: {}", id);
        return healthMapper.toResponse(updated);
    }

    @Override
    @Transactional
    public void deleteHealthRecord(UUID id) {
        HealthRecord record = healthRecordRepository.findById(id)
                .orElseThrow(() -> new HealthRecordNotFoundException("id", id));

        healthRecordRepository.delete(record);

        auditService.logAction(
                "HealthRecord",
                id.toString(),
                "HEALTH_RECORD_DELETED",
                null,
                "Deleted health examination record id: " + id,
                null
        );

        log.info("Deleted health record id: {}", id);
    }

    // ==========================================
    // TREATMENTS
    // ==========================================

    @Override
    @Transactional
    public TreatmentResponse createTreatment(CreateTreatmentRequest request) {
        Cow cow = resolveCow(request.getCowId(), request.getCowTagNumber());
        validateCowForMedicalAttention(cow);

        if (request.getEndDate().isBefore(request.getStartDate())) {
            throw new BadRequestException("Treatment end date cannot be before start date");
        }

        HealthRecord healthRecord = null;
        if (request.getHealthRecordId() != null) {
            healthRecord = healthRecordRepository.findById(request.getHealthRecordId())
                    .orElseThrow(() -> new HealthRecordNotFoundException("id", request.getHealthRecordId()));
        }

        User veterinarian = resolveVeterinarian(request.getVeterinarianId());
        Treatment treatment = healthMapper.toEntity(request, cow, healthRecord, veterinarian);
        Treatment saved = treatmentRepository.save(treatment);

        // Update cow status to UNDER_TREATMENT if not quarantined
        if (cow.getHealthStatus() != HealthStatus.QUARANTINED) {
            cow.setHealthStatus(HealthStatus.UNDER_TREATMENT);
            cowRepository.save(cow);
        }

        String auditMsg = String.format("Prescribed %s (%s) for cow %s (Withdrawal: %s days)",
                saved.getMedication(), saved.getDiagnosis(), cow.getTagNumber(), saved.getWithdrawalDays());

        auditService.logAction(
                "Treatment",
                saved.getId().toString(),
                "TREATMENT_CREATED",
                null,
                auditMsg,
                null
        );

        if (saved.getWithdrawalDays() > 0) {
            auditService.logAction(
                    "Withdrawal",
                    saved.getId().toString(),
                    "WITHDRAWAL_CREATED",
                    null,
                    String.format("Antibiotic withdrawal active for cow %s until %s", cow.getTagNumber(), saved.getWithdrawalEndDate()),
                    null
            );
        }

        log.info("Created treatment id: {} for cow: {} with medication: {}", saved.getId(), cow.getTagNumber(), saved.getMedication());
        return healthMapper.toResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public TreatmentResponse getTreatmentById(UUID id) {
        Treatment treatment = treatmentRepository.findWithDetailsById(id)
                .orElseThrow(() -> new TreatmentNotFoundException("id", id));
        return healthMapper.toResponse(treatment);
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<TreatmentResponse> listTreatments(TreatmentFilterCriteria criteria, Pageable pageable) {
        Page<Treatment> page = treatmentRepository.findAll(TreatmentSpecification.withFilters(criteria), pageable);
        return PageResponse.from(page.map(healthMapper::toResponse));
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<TreatmentResponse> getCowTreatmentHistory(UUID cowId, Pageable pageable) {
        if (!cowRepository.existsById(cowId)) {
            throw new ResourceNotFoundException("Cow", "id", cowId);
        }
        Page<Treatment> page = treatmentRepository.findByCowId(cowId, pageable);
        return PageResponse.from(page.map(healthMapper::toResponse));
    }

    @Override
    @Transactional
    public TreatmentResponse updateTreatment(UUID id, UpdateTreatmentRequest request) {
        Treatment treatment = treatmentRepository.findWithDetailsById(id)
                .orElseThrow(() -> new TreatmentNotFoundException("id", id));

        if (request.getStartDate() != null && request.getEndDate() != null && request.getEndDate().isBefore(request.getStartDate())) {
            throw new BadRequestException("Treatment end date cannot be before start date");
        }

        User veterinarian = request.getVeterinarianId() != null ? resolveVeterinarian(request.getVeterinarianId()) : null;
        healthMapper.updateEntityFromRequest(treatment, request, veterinarian);
        Treatment updated = treatmentRepository.save(treatment);

        auditService.logAction(
                "Treatment",
                id.toString(),
                "TREATMENT_UPDATED",
                null,
                String.format("Updated treatment %s for cow %s", id, treatment.getCow().getTagNumber()),
                null
        );

        log.info("Updated treatment id: {}", id);
        return healthMapper.toResponse(updated);
    }

    @Override
    @Transactional
    public TreatmentResponse completeTreatment(UUID id, CompleteTreatmentRequest request) {
        Treatment treatment = treatmentRepository.findWithDetailsById(id)
                .orElseThrow(() -> new TreatmentNotFoundException("id", id));

        if (treatment.getStatus() == TreatmentStatus.COMPLETED) {
            throw new ConflictException("Treatment is already marked as completed", "TREATMENT_ALREADY_COMPLETED");
        }

        treatment.setStatus(TreatmentStatus.COMPLETED);
        if (request != null && request.getNotes() != null && !request.getNotes().trim().isEmpty()) {
            String combined = (treatment.getNotes() != null ? treatment.getNotes() + "\n" : "") +
                    "[Completed: " + (request.getCompletionDate() != null ? request.getCompletionDate() : LocalDate.now()) + "] " +
                    request.getNotes().trim();
            treatment.setNotes(combined);
        }

        Treatment saved = treatmentRepository.save(treatment);
        Cow cow = saved.getCow();

        // Check if other active treatments remain for this cow
        List<Treatment> activeRemaining = treatmentRepository.findByCowIdAndStatus(cow.getId(), TreatmentStatus.ACTIVE);
        if (activeRemaining.isEmpty() && cow.getHealthStatus() == HealthStatus.UNDER_TREATMENT) {
            cow.setHealthStatus(HealthStatus.RECOVERING);
            cowRepository.save(cow);
        }

        auditService.logAction(
                "Treatment",
                id.toString(),
                "TREATMENT_COMPLETED",
                null,
                String.format("Completed treatment %s for cow %s", id, cow.getTagNumber()),
                null
        );

        log.info("Completed treatment id: {} for cow: {}", id, cow.getTagNumber());
        return healthMapper.toResponse(saved);
    }

    // ==========================================
    // QUARANTINE
    // ==========================================

    @Override
    @Transactional
    public QuarantineResponse createQuarantine(CreateQuarantineRequest request) {
        Cow cow = resolveCow(request.getCowId(), request.getCowTagNumber());
        validateCowForMedicalAttention(cow);

        // Rule: Only one active quarantine per animal
        if (quarantineRecordRepository.existsByCowIdAndStatus(cow.getId(), QuarantineStatus.ACTIVE)) {
            QuarantineRecord existing = quarantineRecordRepository
                    .findFirstByCowIdAndStatusOrderByStartDateDesc(cow.getId(), QuarantineStatus.ACTIVE)
                    .orElse(null);
            String loc = existing != null ? existing.getLocation() : "Quarantine";
            throw new CowAlreadyQuarantinedException(cow.getTagNumber(), loc);
        }

        User veterinarian = resolveVeterinarian(request.getVeterinarianId());
        QuarantineRecord record = healthMapper.toEntity(request, cow, veterinarian);
        QuarantineRecord saved = quarantineRecordRepository.save(record);

        // Update cow's health status and pen
        cow.setHealthStatus(HealthStatus.QUARANTINED);
        cow.setPen(request.getLocation());
        cowRepository.save(cow);

        auditService.logAction(
                "QuarantineRecord",
                saved.getId().toString(),
                "QUARANTINE_STARTED",
                null,
                String.format("Moved cow %s to quarantine %s (Reason: %s)", cow.getTagNumber(), saved.getLocation(), saved.getReason()),
                null
        );

        log.info("Assigned cow: {} to quarantine bay: {}", cow.getTagNumber(), saved.getLocation());
        return healthMapper.toResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public QuarantineResponse getQuarantineById(UUID id) {
        QuarantineRecord record = quarantineRecordRepository.findWithDetailsById(id)
                .orElseThrow(() -> new QuarantineRecordNotFoundException("id", id));
        return healthMapper.toResponse(record);
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<QuarantineResponse> listQuarantineRecords(QuarantineFilterCriteria criteria, Pageable pageable) {
        Page<QuarantineRecord> page = quarantineRecordRepository.findAll(QuarantineSpecification.withFilters(criteria), pageable);
        return PageResponse.from(page.map(healthMapper::toResponse));
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<QuarantineResponse> getCowQuarantineHistory(UUID cowId, Pageable pageable) {
        if (!cowRepository.existsById(cowId)) {
            throw new ResourceNotFoundException("Cow", "id", cowId);
        }
        Page<QuarantineRecord> page = quarantineRecordRepository.findByCowId(cowId, pageable);
        return PageResponse.from(page.map(healthMapper::toResponse));
    }

    @Override
    @Transactional
    public QuarantineResponse updateQuarantine(UUID id, UpdateQuarantineRequest request) {
        QuarantineRecord record = quarantineRecordRepository.findWithDetailsById(id)
                .orElseThrow(() -> new QuarantineRecordNotFoundException("id", id));

        User veterinarian = request.getVeterinarianId() != null ? resolveVeterinarian(request.getVeterinarianId()) : null;
        healthMapper.updateEntityFromRequest(record, request, veterinarian);
        QuarantineRecord updated = quarantineRecordRepository.save(record);

        if (request.getLocation() != null && !request.getLocation().trim().isEmpty()) {
            Cow cow = record.getCow();
            cow.setPen(request.getLocation());
            cowRepository.save(cow);
        }

        auditService.logAction(
                "QuarantineRecord",
                id.toString(),
                "QUARANTINE_UPDATED",
                null,
                String.format("Updated quarantine record %s for cow %s", id, record.getCow().getTagNumber()),
                null
        );

        log.info("Updated quarantine record id: {}", id);
        return healthMapper.toResponse(updated);
    }

    @Override
    @Transactional
    public QuarantineResponse releaseQuarantine(UUID id, ReleaseQuarantineRequest request) {
        QuarantineRecord record = quarantineRecordRepository.findWithDetailsById(id)
                .orElseThrow(() -> new QuarantineRecordNotFoundException("id", id));

        if (record.getStatus() == QuarantineStatus.RELEASED) {
            throw new ConflictException("Cow is already released from quarantine", "COW_ALREADY_RELEASED");
        }

        record.setStatus(QuarantineStatus.RELEASED);
        record.setActualReleaseDate(request != null && request.getActualReleaseDate() != null
                ? request.getActualReleaseDate() : LocalDate.now());

        if (request != null && request.getNotes() != null && !request.getNotes().trim().isEmpty()) {
            String combined = (record.getNotes() != null ? record.getNotes() + "\n" : "") +
                    "[Released: " + record.getActualReleaseDate() + "] " + request.getNotes().trim();
            record.setNotes(combined);
        }

        QuarantineRecord saved = quarantineRecordRepository.save(record);
        Cow cow = saved.getCow();

        // Transition cow health status
        CowHealthStatus nextHealth = (request != null && request.getNextHealthStatus() != null)
                ? request.getNextHealthStatus() : CowHealthStatus.HEALTHY;
        syncCowHealthStatus(cow, nextHealth);

        auditService.logAction(
                "QuarantineRecord",
                id.toString(),
                "QUARANTINE_RELEASED",
                null,
                String.format("Released cow %s from quarantine %s (Next Status: %s)", cow.getTagNumber(), saved.getLocation(), nextHealth),
                null
        );

        log.info("Released cow: {} from quarantine bay: {}", cow.getTagNumber(), saved.getLocation());
        return healthMapper.toResponse(saved);
    }

    // ==========================================
    // ANTIBIOTIC WITHDRAWALS & MILK ELIGIBILITY
    // ==========================================

    @Override
    @Transactional(readOnly = true)
    public List<WithdrawalCaseResponse> getActiveWithdrawals() {
        List<Treatment> active = treatmentRepository.findActiveWithdrawals(LocalDate.now());
        return active.stream()
                .map(healthMapper::toWithdrawalCaseResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public CowWithdrawalStatusResponse getCowWithdrawalStatus(UUID cowId) {
        Cow cow = cowRepository.findById(cowId)
                .orElseThrow(() -> new ResourceNotFoundException("Cow", "id", cowId));

        List<Treatment> treatments = treatmentRepository.findActiveWithdrawalsForCow(cowId, LocalDate.now());
        boolean isEligible = treatments.isEmpty();

        LocalDate earliestDate = null;
        List<String> medications = new ArrayList<>();

        for (Treatment t : treatments) {
            medications.add(t.getMedication());
            if (t.getWithdrawalEndDate() != null) {
                if (earliestDate == null || t.getWithdrawalEndDate().isAfter(earliestDate)) {
                    earliestDate = t.getWithdrawalEndDate();
                }
            }
        }

        return CowWithdrawalStatusResponse.builder()
                .cowId(cow.getId())
                .cowTagNumber(cow.getTagNumber())
                .isMilkEligible(isEligible)
                .activeWithdrawalCount(treatments.size())
                .earliestEligibleDate(earliestDate)
                .activeMedications(medications)
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public boolean isCowMilkEligible(UUID cowId) {
        List<Treatment> treatments = treatmentRepository.findActiveWithdrawalsForCow(cowId, LocalDate.now());
        return treatments.isEmpty();
    }

    // ==========================================
    // SUMMARY / KPIS
    // ==========================================

    @Override
    @Transactional(readOnly = true)
    public HealthSummaryResponse getHealthSummary() {
        long totalCows = cowRepository.countByLifecycleStatus(LifecycleStatus.ACTIVE);
        long healthy = cowRepository.countByHealthStatus(HealthStatus.HEALTHY);
        long underTreatment = cowRepository.countByHealthStatus(HealthStatus.UNDER_TREATMENT);
        long quarantined = cowRepository.countByHealthStatus(HealthStatus.QUARANTINED);
        long recovering = cowRepository.countByHealthStatus(HealthStatus.RECOVERING);

        long activeTreatments = treatmentRepository.countByStatus(TreatmentStatus.ACTIVE);
        long activeWithdrawals = treatmentRepository.countActiveWithdrawals(LocalDate.now());
        long occupiedBays = quarantineRecordRepository.countByStatus(QuarantineStatus.ACTIVE);

        return HealthSummaryResponse.builder()
                .totalCows(totalCows)
                .healthyCount(healthy)
                .underTreatmentCount(underTreatment)
                .quarantinedCount(quarantined)
                .recoveringCount(recovering)
                .criticalCount(0)
                .observationCount(0)
                .activeTreatmentsCount(activeTreatments)
                .activeWithdrawalsCount(activeWithdrawals)
                .occupiedBaysCount(occupiedBays)
                .pendingReviewsCount(activeTreatments)
                .build();
    }

    // ==========================================
    // HELPER METHODS
    // ==========================================

    private Cow resolveCow(UUID cowId, String tagNumber) {
        if (cowId != null) {
            return cowRepository.findById(cowId)
                    .orElseThrow(() -> new ResourceNotFoundException("Cow", "id", cowId));
        }
        if (tagNumber != null && !tagNumber.trim().isEmpty()) {
            String clean = tagNumber.trim().toUpperCase().replace("#", "");
            return cowRepository.findByTagNumber(clean)
                    .orElseThrow(() -> new ResourceNotFoundException("Cow", "tagNumber", clean));
        }
        throw new BadRequestException("Either cowId or cowTagNumber must be provided");
    }

    private User resolveVeterinarian(UUID veterinarianId) {
        if (veterinarianId == null) {
            return null;
        }
        return userRepository.findById(veterinarianId)
                .orElse(null);
    }

    private void validateCowForMedicalAttention(Cow cow) {
        if (cow.getLifecycleStatus() == LifecycleStatus.DECEASED || cow.getLifecycleStatus() == LifecycleStatus.SOLD) {
            throw new BadRequestException(
                    String.format("Cannot modify clinical records for animal '%s' with status %s", cow.getTagNumber(), cow.getLifecycleStatus())
            );
        }
    }

    private void syncCowHealthStatus(Cow cow, CowHealthStatus newStatus) {
        if (newStatus == null) return;

        switch (newStatus) {
            case HEALTHY -> cow.setHealthStatus(HealthStatus.HEALTHY);
            case UNDER_TREATMENT -> cow.setHealthStatus(HealthStatus.UNDER_TREATMENT);
            case QUARANTINED -> cow.setHealthStatus(HealthStatus.QUARANTINED);
            case RECOVERING -> cow.setHealthStatus(HealthStatus.RECOVERING);
            case OBSERVATION, CRITICAL -> {
                if (cow.getHealthStatus() != HealthStatus.QUARANTINED && cow.getHealthStatus() != HealthStatus.UNDER_TREATMENT) {
                    cow.setHealthStatus(HealthStatus.UNDER_TREATMENT);
                }
            }
        }
        cowRepository.save(cow);
    }
}
