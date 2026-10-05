package com.dairyflow.modules.health.mapper;

import com.dairyflow.modules.cows.entity.Cow;
import com.dairyflow.modules.health.dto.*;
import com.dairyflow.modules.health.entity.HealthRecord;
import com.dairyflow.modules.health.entity.QuarantineRecord;
import com.dairyflow.modules.health.entity.Treatment;
import com.dairyflow.modules.health.entity.enums.QuarantineStatus;
import com.dairyflow.modules.health.entity.enums.TreatmentStatus;
import com.dairyflow.modules.users.entity.User;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;

@Component
public class HealthMapper {

    private static final DateTimeFormatter CLEAR_TIME_FORMATTER = DateTimeFormatter.ofPattern("MMM dd, yyyy");

    public HealthRecord toEntity(CreateHealthRecordRequest request, Cow cow, User veterinarian) {
        return HealthRecord.builder()
                .cow(cow)
                .recordDate(request.getRecordDate())
                .healthStatus(request.getHealthStatus())
                .diagnosis(request.getDiagnosis())
                .symptoms(request.getSymptoms())
                .temperature(request.getTemperature())
                .weight(request.getWeight())
                .veterinarian(veterinarian)
                .veterinarianName(request.getVeterinarianName() != null ? request.getVeterinarianName() :
                        (veterinarian != null ? formatUserName(veterinarian) : null))
                .notes(request.getNotes())
                .build();
    }

    public HealthRecordResponse toResponse(HealthRecord entity) {
        if (entity == null) return null;

        Cow cow = entity.getCow();
        User vet = entity.getVeterinarian();

        return HealthRecordResponse.builder()
                .id(entity.getId())
                .cowId(cow != null ? cow.getId() : null)
                .cowTagNumber(cow != null ? cow.getTagNumber() : null)
                .cowName(cow != null ? cow.getName() : null)
                .recordDate(entity.getRecordDate())
                .healthStatus(entity.getHealthStatus())
                .diagnosis(entity.getDiagnosis())
                .symptoms(entity.getSymptoms())
                .temperature(entity.getTemperature())
                .weight(entity.getWeight())
                .veterinarianId(vet != null ? vet.getId() : null)
                .veterinarianName(entity.getVeterinarianName() != null ? entity.getVeterinarianName() :
                        (vet != null ? formatUserName(vet) : null))
                .notes(entity.getNotes())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .createdBy(entity.getCreatedBy())
                .build();
    }

    public void updateEntityFromRequest(HealthRecord entity, UpdateHealthRecordRequest request, User veterinarian) {
        if (request.getRecordDate() != null) entity.setRecordDate(request.getRecordDate());
        if (request.getHealthStatus() != null) entity.setHealthStatus(request.getHealthStatus());
        if (request.getDiagnosis() != null) entity.setDiagnosis(request.getDiagnosis());
        if (request.getSymptoms() != null) entity.setSymptoms(request.getSymptoms());
        if (request.getTemperature() != null) entity.setTemperature(request.getTemperature());
        if (request.getWeight() != null) entity.setWeight(request.getWeight());
        if (veterinarian != null) {
            entity.setVeterinarian(veterinarian);
            entity.setVeterinarianName(formatUserName(veterinarian));
        } else if (request.getVeterinarianName() != null) {
            entity.setVeterinarianName(request.getVeterinarianName());
        }
        if (request.getNotes() != null) entity.setNotes(request.getNotes());
    }

    public Treatment toEntity(CreateTreatmentRequest request, Cow cow, HealthRecord healthRecord, User veterinarian) {
        int withdrawalDays = request.getWithdrawalDays() != null ? request.getWithdrawalDays() : 0;
        LocalDate withdrawalEndDate = withdrawalDays > 0 ? request.getEndDate().plusDays(withdrawalDays) : null;

        return Treatment.builder()
                .cow(cow)
                .healthRecord(healthRecord)
                .treatmentDate(request.getTreatmentDate())
                .diagnosis(request.getDiagnosis())
                .treatmentType(request.getTreatmentType())
                .medication(request.getMedication())
                .dosage(request.getDosage())
                .frequency(request.getFrequency())
                .route(request.getRoute())
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .withdrawalDays(withdrawalDays)
                .withdrawalEndDate(withdrawalEndDate)
                .veterinarian(veterinarian)
                .veterinarianName(request.getVeterinarianName() != null ? request.getVeterinarianName() :
                        (veterinarian != null ? formatUserName(veterinarian) : null))
                .instructions(request.getInstructions())
                .notes(request.getNotes())
                .status(TreatmentStatus.ACTIVE)
                .build();
    }

    public TreatmentResponse toResponse(Treatment entity) {
        if (entity == null) return null;

        Cow cow = entity.getCow();
        User vet = entity.getVeterinarian();

        return TreatmentResponse.builder()
                .id(entity.getId())
                .cowId(cow != null ? cow.getId() : null)
                .cowTagNumber(cow != null ? cow.getTagNumber() : null)
                .cowName(cow != null ? cow.getName() : null)
                .healthRecordId(entity.getHealthRecord() != null ? entity.getHealthRecord().getId() : null)
                .treatmentDate(entity.getTreatmentDate())
                .diagnosis(entity.getDiagnosis())
                .treatmentType(entity.getTreatmentType())
                .medication(entity.getMedication())
                .dosage(entity.getDosage())
                .frequency(entity.getFrequency())
                .route(entity.getRoute())
                .startDate(entity.getStartDate())
                .endDate(entity.getEndDate())
                .withdrawalDays(entity.getWithdrawalDays())
                .withdrawalEndDate(entity.getWithdrawalEndDate())
                .veterinarianId(vet != null ? vet.getId() : null)
                .veterinarianName(entity.getVeterinarianName() != null ? entity.getVeterinarianName() :
                        (vet != null ? formatUserName(vet) : null))
                .instructions(entity.getInstructions())
                .notes(entity.getNotes())
                .status(entity.getStatus())
                .isWithdrawalActive(entity.isWithdrawalActive())
                .withdrawalDaysRemaining(entity.getWithdrawalDaysRemaining())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .createdBy(entity.getCreatedBy())
                .build();
    }

    public void updateEntityFromRequest(Treatment entity, UpdateTreatmentRequest request, User veterinarian) {
        if (request.getDiagnosis() != null) entity.setDiagnosis(request.getDiagnosis());
        if (request.getTreatmentType() != null) entity.setTreatmentType(request.getTreatmentType());
        if (request.getMedication() != null) entity.setMedication(request.getMedication());
        if (request.getDosage() != null) entity.setDosage(request.getDosage());
        if (request.getFrequency() != null) entity.setFrequency(request.getFrequency());
        if (request.getRoute() != null) entity.setRoute(request.getRoute());
        if (request.getStartDate() != null) entity.setStartDate(request.getStartDate());
        if (request.getEndDate() != null) entity.setEndDate(request.getEndDate());
        if (request.getWithdrawalDays() != null) entity.setWithdrawalDays(request.getWithdrawalDays());

        // Recalculate withdrawal end date if dates or withdrawalDays changed
        if (entity.getEndDate() != null && entity.getWithdrawalDays() != null && entity.getWithdrawalDays() > 0) {
            entity.setWithdrawalEndDate(entity.getEndDate().plusDays(entity.getWithdrawalDays()));
        } else if (entity.getWithdrawalDays() != null && entity.getWithdrawalDays() == 0) {
            entity.setWithdrawalEndDate(null);
        }

        if (veterinarian != null) {
            entity.setVeterinarian(veterinarian);
            entity.setVeterinarianName(formatUserName(veterinarian));
        } else if (request.getVeterinarianName() != null) {
            entity.setVeterinarianName(request.getVeterinarianName());
        }

        if (request.getInstructions() != null) entity.setInstructions(request.getInstructions());
        if (request.getNotes() != null) entity.setNotes(request.getNotes());
        if (request.getStatus() != null) entity.setStatus(request.getStatus());
    }

    public QuarantineRecord toEntity(CreateQuarantineRequest request, Cow cow, User veterinarian) {
        return QuarantineRecord.builder()
                .cow(cow)
                .startDate(request.getStartDate())
                .expectedReleaseDate(request.getExpectedReleaseDate())
                .reason(request.getReason())
                .location(request.getLocation())
                .status(QuarantineStatus.ACTIVE)
                .veterinarian(veterinarian)
                .veterinarianName(request.getVeterinarianName() != null ? request.getVeterinarianName() :
                        (veterinarian != null ? formatUserName(veterinarian) : null))
                .notes(request.getNotes())
                .build();
    }

    public QuarantineResponse toResponse(QuarantineRecord entity) {
        if (entity == null) return null;

        Cow cow = entity.getCow();
        User vet = entity.getVeterinarian();

        return QuarantineResponse.builder()
                .id(entity.getId())
                .cowId(cow != null ? cow.getId() : null)
                .cowTagNumber(cow != null ? cow.getTagNumber() : null)
                .cowName(cow != null ? cow.getName() : null)
                .startDate(entity.getStartDate())
                .expectedReleaseDate(entity.getExpectedReleaseDate())
                .actualReleaseDate(entity.getActualReleaseDate())
                .reason(entity.getReason())
                .location(entity.getLocation())
                .status(entity.getStatus())
                .daysInIsolation(entity.getDaysInIsolation())
                .veterinarianId(vet != null ? vet.getId() : null)
                .veterinarianName(entity.getVeterinarianName() != null ? entity.getVeterinarianName() :
                        (vet != null ? formatUserName(vet) : null))
                .notes(entity.getNotes())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .createdBy(entity.getCreatedBy())
                .build();
    }

    public void updateEntityFromRequest(QuarantineRecord entity, UpdateQuarantineRequest request, User veterinarian) {
        if (request.getExpectedReleaseDate() != null) entity.setExpectedReleaseDate(request.getExpectedReleaseDate());
        if (request.getReason() != null) entity.setReason(request.getReason());
        if (request.getLocation() != null) entity.setLocation(request.getLocation());
        if (veterinarian != null) {
            entity.setVeterinarian(veterinarian);
            entity.setVeterinarianName(formatUserName(veterinarian));
        } else if (request.getVeterinarianName() != null) {
            entity.setVeterinarianName(request.getVeterinarianName());
        }
        if (request.getNotes() != null) entity.setNotes(request.getNotes());
    }

    public WithdrawalCaseResponse toWithdrawalCaseResponse(Treatment treatment) {
        if (treatment == null) return null;

        Cow cow = treatment.getCow();
        long daysRemaining = treatment.getWithdrawalDaysRemaining();
        long hoursRemaining = daysRemaining * 24;

        String clearTime = treatment.getWithdrawalEndDate() != null
                ? treatment.getWithdrawalEndDate().format(CLEAR_TIME_FORMATTER)
                : "Indefinite (Active Treatment)";

        boolean isEligible = !treatment.isWithdrawalActive();

        return WithdrawalCaseResponse.builder()
                .cowId(cow != null ? cow.getId() : null)
                .cowTagNumber(cow != null ? cow.getTagNumber() : null)
                .cowName(cow != null ? cow.getName() : null)
                .pen(cow != null ? (cow.getBarn() != null ? cow.getBarn() + " • " + (cow.getPen() != null ? cow.getPen() : "General") : cow.getPen()) : null)
                .treatmentId(treatment.getId())
                .medication(treatment.getMedication())
                .dosage(treatment.getDosage())
                .startDate(treatment.getStartDate())
                .endDate(treatment.getEndDate())
                .withdrawalDays(treatment.getWithdrawalDays())
                .withdrawalEndDate(treatment.getWithdrawalEndDate())
                .daysRemaining(daysRemaining)
                .hoursRemaining(hoursRemaining)
                .clearTime(clearTime)
                .isMilkEligible(isEligible)
                .status(treatment.getStatus())
                .build();
    }

    private String formatUserName(User user) {
        if (user == null) return null;
        if (user.getFirstName() != null || user.getLastName() != null) {
            return (user.getFirstName() != null ? user.getFirstName() : "") + " " +
                    (user.getLastName() != null ? user.getLastName() : "").trim();
        }
        return user.getUsername();
    }
}
