package com.dairyflow.modules.breeding.service;

import com.dairyflow.common.audit.AuditService;
import com.dairyflow.common.exception.BadRequestException;
import com.dairyflow.modules.breeding.dto.*;
import com.dairyflow.modules.breeding.entity.*;
import com.dairyflow.modules.breeding.entity.enums.*;
import com.dairyflow.modules.breeding.exception.*;
import com.dairyflow.modules.breeding.mapper.BreedingMapper;
import com.dairyflow.modules.breeding.repository.*;
import com.dairyflow.modules.cows.entity.Cow;
import com.dairyflow.modules.cows.entity.enums.Gender;
import com.dairyflow.modules.cows.entity.enums.HealthStatus;
import com.dairyflow.modules.cows.entity.enums.LifecycleStatus;
import com.dairyflow.modules.cows.exception.CowNotFoundException;
import com.dairyflow.modules.cows.repository.CowRepository;
import com.dairyflow.modules.users.entity.User;
import com.dairyflow.modules.users.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class BreedingServiceImpl implements BreedingService {

    private final HeatRecordRepository heatRecordRepository;
    private final BreedingRecordRepository breedingRecordRepository;
    private final PregnancyRecordRepository pregnancyRecordRepository;
    private final CalvingRecordRepository calvingRecordRepository;
    private final CowRepository cowRepository;
    private final UserRepository userRepository;
    private final BreedingMapper breedingMapper;
    private final AuditService auditService;

    // ==========================================
    // HEAT DETECTION
    // ==========================================

    @Override
    @Transactional
    public HeatRecordResponse createHeatRecord(CreateHeatRecordRequest request, String username) {
        Cow cow = resolveCow(request.getCowId(), request.getCowTagNumber());
        User detectedBy = resolveUser(request.getDetectedById(), username);

        HeatRecord record = breedingMapper.toEntity(request, cow, detectedBy);
        HeatRecord saved = heatRecordRepository.save(record);

        auditService.logAction("HeatRecord", saved.getId().toString(), "HEAT_RECORDED", username,
                String.format("Recorded heat for cow %s via %s", cow.getTagNumber(), request.getDetectionMethod()), null);

        return breedingMapper.toResponse(saved);
    }

    @Override
    @Transactional
    public HeatRecordResponse updateHeatRecord(UUID id, UpdateHeatRecordRequest request, String username) {
        HeatRecord record = heatRecordRepository.findWithDetailsById(id)
                .orElseThrow(() -> new HeatRecordNotFoundException("id", id));

        User detectedBy = resolveUser(request.getDetectedById(), null);
        breedingMapper.updateEntityFromRequest(record, request, detectedBy);
        HeatRecord updated = heatRecordRepository.save(record);

        auditService.logAction("HeatRecord", id.toString(), "HEAT_UPDATED", username,
                "Updated heat detection record", null);

        return breedingMapper.toResponse(updated);
    }

    @Override
    public HeatRecordResponse getHeatRecord(UUID id) {
        return heatRecordRepository.findWithDetailsById(id)
                .map(breedingMapper::toResponse)
                .orElseThrow(() -> new HeatRecordNotFoundException("id", id));
    }

    @Override
    public Page<HeatRecordResponse> getHeatRecords(HeatFilterCriteria criteria, Pageable pageable) {
        return heatRecordRepository.findAll(HeatSpecification.withFilters(criteria), pageable)
                .map(breedingMapper::toResponse);
    }

    @Override
    @Transactional
    public void deleteHeatRecord(UUID id, String username) {
        HeatRecord record = heatRecordRepository.findById(id)
                .orElseThrow(() -> new HeatRecordNotFoundException("id", id));
        heatRecordRepository.delete(record);
        auditService.logAction("HeatRecord", id.toString(), "HEAT_DELETED", username,
                "Deleted heat record", null);
    }

    @Override
    public Page<HeatRecordResponse> getHeatHistoryByCow(UUID cowId, Pageable pageable) {
        validateCowExists(cowId);
        return heatRecordRepository.findByCowIdOrderByDetectedAtDesc(cowId, pageable)
                .map(breedingMapper::toResponse);
    }

    // ==========================================
    // BREEDING RECORDS
    // ==========================================

    @Override
    @Transactional
    public BreedingRecordResponse createBreedingRecord(CreateBreedingRecordRequest request, String username) {
        Cow cow = resolveCow(request.getCowId(), request.getCowTagNumber());
        Cow bull = resolveOptionalCow(request.getBullId(), request.getBullTagNumber());
        User technician = resolveUser(request.getTechnicianId(), null);
        User veterinarian = resolveUser(request.getVeterinarianId(), null);

        HeatRecord heatRecord = null;
        if (request.getHeatRecordId() != null) {
            heatRecord = heatRecordRepository.findById(request.getHeatRecordId())
                    .orElseThrow(() -> new HeatRecordNotFoundException("id", request.getHeatRecordId()));

            // Date consistency check: breeding cannot occur before observed heat
            if (heatRecord.getDetectedAt() != null && request.getBreedingDate().isBefore(heatRecord.getDetectedAt().toLocalDate())) {
                throw new BadRequestException("Breeding date cannot be earlier than the detected heat date (" +
                        heatRecord.getDetectedAt().toLocalDate() + ")");
            }
        }

        BreedingRecord record = breedingMapper.toEntity(request, cow, bull, technician, veterinarian, heatRecord);
        BreedingRecord saved = breedingRecordRepository.save(record);

        auditService.logAction("BreedingRecord", saved.getId().toString(), "BREEDING_CREATED", username,
                String.format("Created breeding record for cow %s via %s", cow.getTagNumber(), request.getBreedingMethod()), null);

        return breedingMapper.toResponse(saved);
    }

    @Override
    @Transactional
    public BreedingRecordResponse updateBreedingRecord(UUID id, UpdateBreedingRecordRequest request, String username) {
        BreedingRecord record = breedingRecordRepository.findWithDetailsById(id)
                .orElseThrow(() -> new BreedingRecordNotFoundException("id", id));

        Cow bull = resolveOptionalCow(request.getBullId(), request.getBullTagNumber());
        User technician = resolveUser(request.getTechnicianId(), null);
        User veterinarian = resolveUser(request.getVeterinarianId(), null);
        HeatRecord heatRecord = null;
        if (request.getHeatRecordId() != null) {
            heatRecord = heatRecordRepository.findById(request.getHeatRecordId())
                    .orElseThrow(() -> new HeatRecordNotFoundException("id", request.getHeatRecordId()));
        }

        breedingMapper.updateEntityFromRequest(record, request, bull, technician, veterinarian, heatRecord);
        BreedingRecord updated = breedingRecordRepository.save(record);

        auditService.logAction("BreedingRecord", id.toString(), "BREEDING_UPDATED", username,
                "Updated breeding record", null);

        return breedingMapper.toResponse(updated);
    }

    @Override
    public BreedingRecordResponse getBreedingRecord(UUID id) {
        return breedingRecordRepository.findWithDetailsById(id)
                .map(breedingMapper::toResponse)
                .orElseThrow(() -> new BreedingRecordNotFoundException("id", id));
    }

    @Override
    public Page<BreedingRecordResponse> getBreedingRecords(BreedingFilterCriteria criteria, Pageable pageable) {
        return breedingRecordRepository.findAll(BreedingSpecification.withFilters(criteria), pageable)
                .map(breedingMapper::toResponse);
    }

    @Override
    @Transactional
    public BreedingRecordResponse completeBreedingRecord(UUID id, String username) {
        BreedingRecord record = breedingRecordRepository.findWithDetailsById(id)
                .orElseThrow(() -> new BreedingRecordNotFoundException("id", id));

        record.setStatus(BreedingStatus.COMPLETED);
        BreedingRecord updated = breedingRecordRepository.save(record);

        auditService.logAction("BreedingRecord", id.toString(), "BREEDING_COMPLETED", username,
                "Marked breeding as COMPLETED", null);

        return breedingMapper.toResponse(updated);
    }

    @Override
    @Transactional
    public BreedingRecordResponse cancelBreedingRecord(UUID id, String username) {
        BreedingRecord record = breedingRecordRepository.findWithDetailsById(id)
                .orElseThrow(() -> new BreedingRecordNotFoundException("id", id));

        record.setStatus(BreedingStatus.CANCELLED);
        BreedingRecord updated = breedingRecordRepository.save(record);

        auditService.logAction("BreedingRecord", id.toString(), "BREEDING_CANCELLED", username,
                "Marked breeding as CANCELLED", null);

        return breedingMapper.toResponse(updated);
    }

    @Override
    public Page<BreedingRecordResponse> getBreedingHistoryByCow(UUID cowId, Pageable pageable) {
        validateCowExists(cowId);
        return breedingRecordRepository.findByCowIdOrderByBreedingDateDesc(cowId, pageable)
                .map(breedingMapper::toResponse);
    }

    // ==========================================
    // PREGNANCY RECORDS
    // ==========================================

    @Override
    @Transactional
    public PregnancyRecordResponse createPregnancyRecord(CreatePregnancyRecordRequest request, String username) {
        Cow cow = resolveCow(request.getCowId(), request.getCowTagNumber());

        // Check for duplicate active pregnancy
        List<PregnancyStatus> activeStatuses = List.of(PregnancyStatus.PENDING, PregnancyStatus.CONFIRMED);
        if (pregnancyRecordRepository.existsByCowIdAndPregnancyStatusIn(cow.getId(), activeStatuses)) {
            PregnancyRecord active = pregnancyRecordRepository
                    .findFirstByCowIdAndPregnancyStatusInOrderByCreatedAtDesc(cow.getId(), activeStatuses)
                    .orElse(null);
            throw new ActivePregnancyConflictException(cow.getTagNumber(),
                    active != null ? active.getExpectedCalvingDate() : null);
        }

        BreedingRecord breeding = null;
        if (request.getBreedingId() != null) {
            breeding = breedingRecordRepository.findById(request.getBreedingId())
                    .orElseThrow(() -> new BreedingRecordNotFoundException("id", request.getBreedingId()));

            // Date validation: confirmation cannot precede breeding
            if (request.getConfirmationDate() != null && breeding.getBreedingDate() != null
                    && request.getConfirmationDate().isBefore(breeding.getBreedingDate())) {
                throw new BadRequestException("Pregnancy confirmation date (" + request.getConfirmationDate() +
                        ") cannot be before breeding date (" + breeding.getBreedingDate() + ")");
            }
        }

        // Integrity check: cannot be CONFIRMED without required confirmation details
        if (request.getPregnancyStatus() == PregnancyStatus.CONFIRMED) {
            if (request.getConfirmationDate() == null || request.getConfirmationMethod() == null) {
                throw new BadRequestException("Confirmation date and confirmation method are required to confirm pregnancy");
            }
        }

        User confirmedBy = resolveUser(request.getConfirmedById(), username);
        PregnancyRecord record = breedingMapper.toEntity(request, cow, breeding, confirmedBy);
        PregnancyRecord saved = pregnancyRecordRepository.save(record);

        if (saved.getPregnancyStatus() == PregnancyStatus.CONFIRMED) {
            cow.setHealthStatus(HealthStatus.PREGNANT);
            cowRepository.save(cow);
        }

        auditService.logAction("PregnancyRecord", saved.getId().toString(), "PREGNANCY_CREATED", username,
                String.format("Created pregnancy record (%s) for cow %s", saved.getPregnancyStatus(), cow.getTagNumber()), null);

        return breedingMapper.toResponse(saved);
    }

    @Override
    @Transactional
    public PregnancyRecordResponse updatePregnancyRecord(UUID id, UpdatePregnancyRecordRequest request, String username) {
        PregnancyRecord record = pregnancyRecordRepository.findWithDetailsById(id)
                .orElseThrow(() -> new PregnancyRecordNotFoundException("id", id));

        User confirmedBy = resolveUser(request.getConfirmedById(), null);
        breedingMapper.updateEntityFromRequest(record, request, confirmedBy);
        PregnancyRecord updated = pregnancyRecordRepository.save(record);

        auditService.logAction("PregnancyRecord", id.toString(), "PREGNANCY_UPDATED", username,
                "Updated pregnancy record", null);

        return breedingMapper.toResponse(updated);
    }

    @Override
    @Transactional
    public PregnancyRecordResponse confirmPregnancy(UUID id, ConfirmPregnancyRequest request, String username) {
        PregnancyRecord record = pregnancyRecordRepository.findWithDetailsById(id)
                .orElseThrow(() -> new PregnancyRecordNotFoundException("id", id));

        // Date validation: confirmation cannot precede breeding
        if (record.getBreeding() != null && record.getBreeding().getBreedingDate() != null
                && request.getConfirmationDate().isBefore(record.getBreeding().getBreedingDate())) {
            throw new BadRequestException("Pregnancy confirmation date (" + request.getConfirmationDate() +
                    ") cannot be before breeding date (" + record.getBreeding().getBreedingDate() + ")");
        }

        LocalDate expectedCalving = request.getExpectedCalvingDate();
        if (expectedCalving == null) {
            if (record.getBreeding() != null && record.getBreeding().getBreedingDate() != null) {
                expectedCalving = record.getBreeding().getBreedingDate().plusDays(BreedingMapper.STANDARD_GESTATION_DAYS);
            } else {
                expectedCalving = request.getConfirmationDate().plusDays(BreedingMapper.STANDARD_GESTATION_DAYS - 35);
            }
        }

        record.setPregnancyStatus(PregnancyStatus.CONFIRMED);
        record.setConfirmationDate(request.getConfirmationDate());
        record.setConfirmationMethod(request.getConfirmationMethod());
        record.setExpectedCalvingDate(expectedCalving);
        if (request.getNotes() != null) record.setNotes(request.getNotes());

        User confirmedBy = resolveUser(request.getConfirmedById(), username);
        if (confirmedBy != null) {
            record.setConfirmedBy(confirmedBy);
            record.setConfirmedByName(confirmedBy.getUsername());
        } else if (request.getConfirmedByName() != null) {
            record.setConfirmedByName(request.getConfirmedByName());
        }

        PregnancyRecord saved = pregnancyRecordRepository.save(record);

        // Update cow health status
        Cow cow = saved.getCow();
        if (cow != null) {
            cow.setHealthStatus(HealthStatus.PREGNANT);
            cowRepository.save(cow);
        }

        auditService.logAction("PregnancyRecord", id.toString(), "PREGNANCY_CONFIRMED", username,
                String.format("Confirmed pregnancy for cow %s (expected calving: %s)",
                        cow != null ? cow.getTagNumber() : "unknown", expectedCalving), null);

        return breedingMapper.toResponse(saved);
    }

    @Override
    @Transactional
    public PregnancyRecordResponse markNotPregnant(UUID id, String username) {
        PregnancyRecord record = pregnancyRecordRepository.findWithDetailsById(id)
                .orElseThrow(() -> new PregnancyRecordNotFoundException("id", id));

        record.setPregnancyStatus(PregnancyStatus.NOT_PREGNANT);
        PregnancyRecord saved = pregnancyRecordRepository.save(record);

        // Reset cow health status if it was set to pregnant
        Cow cow = saved.getCow();
        if (cow != null && cow.getHealthStatus() == HealthStatus.PREGNANT) {
            cow.setHealthStatus(HealthStatus.HEALTHY);
            cowRepository.save(cow);
        }

        auditService.logAction("PregnancyRecord", id.toString(), "PREGNANCY_MARKED_NOT_PREGNANT", username,
                "Marked pregnancy as NOT_PREGNANT", null);

        return breedingMapper.toResponse(saved);
    }

    @Override
    @Transactional
    public PregnancyRecordResponse markPregnancyLost(UUID id, String username) {
        PregnancyRecord record = pregnancyRecordRepository.findWithDetailsById(id)
                .orElseThrow(() -> new PregnancyRecordNotFoundException("id", id));

        record.setPregnancyStatus(PregnancyStatus.LOST);
        PregnancyRecord saved = pregnancyRecordRepository.save(record);

        Cow cow = saved.getCow();
        if (cow != null && cow.getHealthStatus() == HealthStatus.PREGNANT) {
            cow.setHealthStatus(HealthStatus.HEALTHY);
            cowRepository.save(cow);
        }

        auditService.logAction("PregnancyRecord", id.toString(), "PREGNANCY_LOST", username,
                "Marked pregnancy as LOST", null);

        return breedingMapper.toResponse(saved);
    }

    @Override
    public PregnancyRecordResponse getPregnancyRecord(UUID id) {
        return pregnancyRecordRepository.findWithDetailsById(id)
                .map(breedingMapper::toResponse)
                .orElseThrow(() -> new PregnancyRecordNotFoundException("id", id));
    }

    @Override
    public Page<PregnancyRecordResponse> getPregnancyRecords(PregnancyFilterCriteria criteria, Pageable pageable) {
        return pregnancyRecordRepository.findAll(PregnancySpecification.withFilters(criteria), pageable)
                .map(breedingMapper::toResponse);
    }

    @Override
    public Page<PregnancyRecordResponse> getPregnancyHistoryByCow(UUID cowId, Pageable pageable) {
        validateCowExists(cowId);
        return pregnancyRecordRepository.findByCowIdOrderByCreatedAtDesc(cowId, pageable)
                .map(breedingMapper::toResponse);
    }

    // ==========================================
    // CALVING RECORDS
    // ==========================================

    @Override
    @Transactional
    public CalvingRecordResponse createCalvingRecord(CreateCalvingRecordRequest request, String username) {
        Cow cow = resolveCow(request.getCowId(), request.getCowTagNumber());
        User veterinarian = resolveUser(request.getVeterinarianId(), null);

        PregnancyRecord pregnancy = null;
        if (request.getPregnancyId() != null) {
            pregnancy = pregnancyRecordRepository.findById(request.getPregnancyId())
                    .orElseThrow(() -> new PregnancyRecordNotFoundException("id", request.getPregnancyId()));

            if (!pregnancy.getCow().getId().equals(cow.getId())) {
                throw new BadRequestException("Pregnancy record does not belong to cow " + cow.getTagNumber());
            }

            // Sequence validation: calving cannot happen before confirmation or breeding
            if (pregnancy.getConfirmationDate() != null && request.getCalvingDate().isBefore(pregnancy.getConfirmationDate())) {
                throw new BadRequestException("Calving date (" + request.getCalvingDate() +
                        ") cannot be before pregnancy confirmation date (" + pregnancy.getConfirmationDate() + ")");
            }
            if (pregnancy.getBreeding() != null && pregnancy.getBreeding().getBreedingDate() != null
                    && request.getCalvingDate().isBefore(pregnancy.getBreeding().getBreedingDate())) {
                throw new BadRequestException("Calving date (" + request.getCalvingDate() +
                        ") cannot be before breeding date (" + pregnancy.getBreeding().getBreedingDate() + ")");
            }

            // Transition pregnancy to COMPLETED
            pregnancy.setPregnancyStatus(PregnancyStatus.COMPLETED);
            pregnancyRecordRepository.save(pregnancy);
        }

        // Cow lifecycle synchronization:
        // Parity increments by 1
        cow.setParity(cow.getParity() != null ? cow.getParity() + 1 : 1);
        cow.setCurrentMilkStatus("FRESH");
        if (cow.getHealthStatus() == HealthStatus.PREGNANT) {
            cow.setHealthStatus(HealthStatus.HEALTHY);
        }
        cowRepository.save(cow);

        CalvingRecord record = breedingMapper.toEntity(request, cow, pregnancy, veterinarian);
        CalvingRecord saved = calvingRecordRepository.save(record);

        auditService.logAction("CalvingRecord", saved.getId().toString(), "CALVING_RECORDED", username,
                String.format("Recorded calving for cow %s: %d calf/calves, type: %s",
                        cow.getTagNumber(), request.getCalfCount(), request.getCalvingType()), null);

        return breedingMapper.toResponse(saved);
    }

    @Override
    @Transactional
    public CalvingRecordResponse updateCalvingRecord(UUID id, UpdateCalvingRecordRequest request, String username) {
        CalvingRecord record = calvingRecordRepository.findWithDetailsById(id)
                .orElseThrow(() -> new CalvingRecordNotFoundException("id", id));

        User veterinarian = resolveUser(request.getVeterinarianId(), null);
        breedingMapper.updateEntityFromRequest(record, request, veterinarian);
        CalvingRecord updated = calvingRecordRepository.save(record);

        auditService.logAction("CalvingRecord", id.toString(), "CALVING_UPDATED", username,
                "Updated calving record", null);

        return breedingMapper.toResponse(updated);
    }

    @Override
    public CalvingRecordResponse getCalvingRecord(UUID id) {
        return calvingRecordRepository.findWithDetailsById(id)
                .map(breedingMapper::toResponse)
                .orElseThrow(() -> new CalvingRecordNotFoundException("id", id));
    }

    @Override
    public Page<CalvingRecordResponse> getCalvingRecords(CalvingFilterCriteria criteria, Pageable pageable) {
        return calvingRecordRepository.findAll(CalvingSpecification.withFilters(criteria), pageable)
                .map(breedingMapper::toResponse);
    }

    @Override
    public Page<CalvingRecordResponse> getCalvingHistoryByCow(UUID cowId, Pageable pageable) {
        validateCowExists(cowId);
        return calvingRecordRepository.findByCowIdOrderByCalvingDateDesc(cowId, pageable)
                .map(breedingMapper::toResponse);
    }

    // ==========================================
    // SUMMARY & REPRODUCTIVE TIMELINE
    // ==========================================

    @Override
    public BreedingSummaryResponse getBreedingSummary() {
        LocalDateTime heatWindow = LocalDateTime.now().minusHours(48);
        long cowsInHeat = heatRecordRepository.countDistinctCowsInHeatSince(heatWindow);

        long breedingDue = heatRecordRepository.countDistinctCowsInHeatSince(LocalDateTime.now().minusHours(24));
        long pregnantCows = pregnancyRecordRepository.countByPregnancyStatus(PregnancyStatus.CONFIRMED);

        LocalDate today = LocalDate.now();
        LocalDate nextMonth = today.plusDays(30);
        long upcomingCalvings = pregnancyRecordRepository.countUpcomingCalvings(PregnancyStatus.CONFIRMED, today, nextMonth);
        long overdueCalvings = pregnancyRecordRepository.countOverdueCalvings(PregnancyStatus.CONFIRMED, today);

        long recentCalvings = calvingRecordRepository.countByCalvingDateAfter(today.minusDays(30));

        // Open cows: active female cows not pregnant
        long totalActiveFemales = cowRepository.count();
        long openCows = Math.max(0, totalActiveFemales - pregnantCows);

        // Conception rate calculation
        long confirmed = pregnantCows + pregnancyRecordRepository.countByPregnancyStatus(PregnancyStatus.COMPLETED);
        long notPregnant = pregnancyRecordRepository.countByPregnancyStatus(PregnancyStatus.NOT_PREGNANT);
        long lost = pregnancyRecordRepository.countByPregnancyStatus(PregnancyStatus.LOST);
        long evaluated = confirmed + notPregnant + lost;

        double conceptionRate = 0.0;
        if (evaluated > 0) {
            conceptionRate = BigDecimal.valueOf((double) confirmed / evaluated * 100.0)
                    .setScale(1, RoundingMode.HALF_UP)
                    .doubleValue();
        }

        return BreedingSummaryResponse.builder()
                .cowsInHeat(cowsInHeat)
                .breedingDue(breedingDue)
                .pregnantCows(pregnantCows)
                .upcomingCalvings(upcomingCalvings)
                .overduePregnancies(overdueCalvings)
                .recentCalvings(recentCalvings)
                .openCows(openCows)
                .conceptionRate(conceptionRate)
                .build();
    }

    @Override
    public CowReproductiveSummaryResponse getCowReproductiveSummary(UUID cowId) {
        Cow cow = cowRepository.findById(cowId)
                .orElseThrow(() -> new CowNotFoundException("id", cowId));

        List<HeatRecord> heatRecords = heatRecordRepository.findByCowIdOrderByDetectedAtDesc(cowId);
        List<BreedingRecord> breedingRecords = breedingRecordRepository.findByCowIdOrderByBreedingDateDesc(cowId);
        List<PregnancyRecord> pregnancyRecords = pregnancyRecordRepository.findByCowIdOrderByCreatedAtDesc(cowId);
        List<CalvingRecord> calvingRecords = calvingRecordRepository.findByCowIdOrderByCalvingDateDesc(cowId);

        HeatRecord latestHeat = heatRecords.isEmpty() ? null : heatRecords.get(0);
        BreedingRecord latestBreeding = breedingRecords.isEmpty() ? null : breedingRecords.get(0);
        CalvingRecord latestCalving = calvingRecords.isEmpty() ? null : calvingRecords.get(0);

        // Find active confirmed or pending pregnancy
        PregnancyRecord activePregnancy = pregnancyRecords.stream()
                .filter(p -> p.getPregnancyStatus() == PregnancyStatus.CONFIRMED || p.getPregnancyStatus() == PregnancyStatus.PENDING)
                .findFirst()
                .orElse(null);

        // Derive current reproductive status
        ReproductiveStatus status = deriveReproductiveStatus(latestHeat, latestBreeding, activePregnancy, latestCalving);

        // Build Chronological Timeline
        List<ReproductiveTimelineEventResponse> timeline = new ArrayList<>();

        for (HeatRecord h : heatRecords) {
            timeline.add(ReproductiveTimelineEventResponse.builder()
                    .id(h.getId())
                    .eventType("HEAT")
                    .eventDate(h.getDetectedAt())
                    .title("Heat Detected")
                    .description(String.format("Method: %s • Signs: %s", h.getDetectionMethod(), h.getSignsObserved()))
                    .status(h.getConfidence() != null ? h.getConfidence().name() : "HIGH")
                    .performedBy(h.getDetectedByName())
                    .notes(h.getNotes())
                    .build());
        }

        for (BreedingRecord b : breedingRecords) {
            String bullOrSemen = b.getSemenReference() != null ? b.getSemenReference() :
                    (b.getBullTagNumber() != null ? b.getBullTagNumber() : "N/A");
            timeline.add(ReproductiveTimelineEventResponse.builder()
                    .id(b.getId())
                    .eventType("BREEDING")
                    .eventDate(b.getBreedingDate().atTime(9, 0))
                    .title(String.format("Insemination (%s)", b.getBreedingMethod()))
                    .description(String.format("Bull/Semen: %s • Status: %s", bullOrSemen, b.getStatus()))
                    .status(b.getStatus() != null ? b.getStatus().name() : "COMPLETED")
                    .performedBy(b.getTechnicianName() != null ? b.getTechnicianName() : b.getVeterinarianName())
                    .notes(b.getNotes())
                    .build());
        }

        for (PregnancyRecord p : pregnancyRecords) {
            if (p.getConfirmationDate() != null) {
                timeline.add(ReproductiveTimelineEventResponse.builder()
                        .id(p.getId())
                        .eventType("PREGNANCY_CHECK")
                        .eventDate(p.getConfirmationDate().atTime(10, 0))
                        .title(String.format("Pregnancy Exam: %s", p.getPregnancyStatus()))
                        .description(String.format("Method: %s • Expected: %s",
                                p.getConfirmationMethod() != null ? p.getConfirmationMethod() : "Manual",
                                p.getExpectedCalvingDate() != null ? p.getExpectedCalvingDate() : "Pending"))
                        .status(p.getPregnancyStatus().name())
                        .performedBy(p.getConfirmedByName())
                        .notes(p.getNotes())
                        .build());
            }
        }

        for (CalvingRecord c : calvingRecords) {
            timeline.add(ReproductiveTimelineEventResponse.builder()
                    .id(c.getId())
                    .eventType("CALVING")
                    .eventDate(c.getCalvingDate().atTime(8, 0))
                    .title(String.format("Calving Event (%s)", c.getCalvingType()))
                    .description(String.format("Calves: %d • Complications: %s",
                            c.getCalfCount(),
                            c.getComplications() != null && !c.getComplications().isBlank() ? c.getComplications() : "None"))
                    .status("COMPLETED")
                    .performedBy(c.getVeterinarianName())
                    .notes(c.getNotes())
                    .build());
        }

        // Sort descending by event date
        timeline.sort(Comparator.comparing(ReproductiveTimelineEventResponse::getEventDate, Comparator.nullsLast(Comparator.reverseOrder())));

        return CowReproductiveSummaryResponse.builder()
                .cowId(cow.getId())
                .cowTagNumber(cow.getTagNumber())
                .cowName(cow.getName())
                .reproductiveStatus(status)
                .parity(cow.getParity())
                .latestHeat(breedingMapper.toResponse(latestHeat))
                .latestBreeding(breedingMapper.toResponse(latestBreeding))
                .activePregnancy(breedingMapper.toResponse(activePregnancy))
                .latestCalving(breedingMapper.toResponse(latestCalving))
                .timeline(timeline)
                .build();
    }

    private ReproductiveStatus deriveReproductiveStatus(HeatRecord latestHeat, BreedingRecord latestBreeding,
                                                        PregnancyRecord activePregnancy, CalvingRecord latestCalving) {
        LocalDate today = LocalDate.now();

        // 1. Confirmed active pregnancy
        if (activePregnancy != null && activePregnancy.getPregnancyStatus() == PregnancyStatus.CONFIRMED) {
            if (activePregnancy.getExpectedCalvingDate() != null &&
                    !activePregnancy.getExpectedCalvingDate().isAfter(today.plusDays(14))) {
                return ReproductiveStatus.NEAR_CALVING;
            }
            return ReproductiveStatus.PREGNANT;
        }

        // 2. Recently calved within 30 days
        if (latestCalving != null && latestCalving.getCalvingDate().isAfter(today.minusDays(30))) {
            return ReproductiveStatus.RECENTLY_CALVED;
        }

        // 3. In heat within last 48 hours
        if (latestHeat != null && latestHeat.getDetectedAt().isAfter(LocalDateTime.now().minusHours(48))) {
            return ReproductiveStatus.IN_HEAT;
        }

        // 4. In breeding process (planned or within 21 days after breeding)
        if (latestBreeding != null) {
            if (latestBreeding.getStatus() == BreedingStatus.PLANNED) {
                return ReproductiveStatus.BREEDING;
            }
            if (latestBreeding.getStatus() == BreedingStatus.COMPLETED &&
                    latestBreeding.getBreedingDate().isAfter(today.minusDays(21))) {
                return ReproductiveStatus.BREEDING;
            }
        }

        // Default open
        return ReproductiveStatus.OPEN;
    }

    // ==========================================
    // HELPERS
    // ==========================================

    private Cow resolveCow(UUID cowId, String cowTagNumber) {
        if (cowId != null) {
            return cowRepository.findById(cowId)
                    .orElseThrow(() -> new CowNotFoundException("id", cowId));
        }
        if (cowTagNumber != null && !cowTagNumber.trim().isEmpty()) {
            String cleanTag = cowTagNumber.trim().toUpperCase().replace("#", "");
            return cowRepository.findByTagNumber(cleanTag)
                    .orElseThrow(() -> new CowNotFoundException("tagNumber", cleanTag));
        }
        throw new BadRequestException("Cow ID or Cow Tag Number is required");
    }

    private Cow resolveOptionalCow(UUID cowId, String cowTagNumber) {
        if (cowId != null) {
            return cowRepository.findById(cowId).orElse(null);
        }
        if (cowTagNumber != null && !cowTagNumber.trim().isEmpty()) {
            String cleanTag = cowTagNumber.trim().toUpperCase().replace("#", "");
            return cowRepository.findByTagNumber(cleanTag).orElse(null);
        }
        return null;
    }

    private User resolveUser(UUID userId, String username) {
        if (userId != null) {
            return userRepository.findById(userId).orElse(null);
        }
        if (username != null && !username.trim().isEmpty()) {
            return userRepository.findByUsername(username).orElse(null);
        }
        return null;
    }

    private void validateCowExists(UUID cowId) {
        if (!cowRepository.existsById(cowId)) {
            throw new CowNotFoundException("id", cowId);
        }
    }
}
