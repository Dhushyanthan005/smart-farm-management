package com.dairyflow.modules.breeding.mapper;

import com.dairyflow.modules.breeding.dto.*;
import com.dairyflow.modules.breeding.entity.*;
import com.dairyflow.modules.breeding.entity.enums.BreedingStatus;
import com.dairyflow.modules.breeding.entity.enums.PregnancyStatus;
import com.dairyflow.modules.cows.entity.Cow;
import com.dairyflow.modules.users.entity.User;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

@Component
public class BreedingMapper {

    public static final int STANDARD_GESTATION_DAYS = 283;

    // --- Heat Record ---

    public HeatRecord toEntity(CreateHeatRecordRequest request, Cow cow, User detectedBy) {
        return HeatRecord.builder()
                .cow(cow)
                .detectedAt(request.getDetectedAt())
                .detectionMethod(request.getDetectionMethod())
                .signsObserved(request.getSignsObserved())
                .confidence(request.getConfidence())
                .notes(request.getNotes())
                .detectedBy(detectedBy)
                .detectedByName(request.getDetectedByName() != null ? request.getDetectedByName() :
                        (detectedBy != null ? formatUserName(detectedBy) : null))
                .build();
    }

    public HeatRecordResponse toResponse(HeatRecord entity) {
        if (entity == null) return null;

        Cow cow = entity.getCow();
        User detectedBy = entity.getDetectedBy();

        return HeatRecordResponse.builder()
                .id(entity.getId())
                .cowId(cow != null ? cow.getId() : null)
                .cowTagNumber(cow != null ? cow.getTagNumber() : null)
                .cowName(cow != null ? cow.getName() : null)
                .detectedAt(entity.getDetectedAt())
                .detectionMethod(entity.getDetectionMethod())
                .signsObserved(entity.getSignsObserved())
                .confidence(entity.getConfidence())
                .notes(entity.getNotes())
                .detectedById(detectedBy != null ? detectedBy.getId() : null)
                .detectedByName(entity.getDetectedByName() != null ? entity.getDetectedByName() :
                        (detectedBy != null ? formatUserName(detectedBy) : null))
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .createdBy(entity.getCreatedBy())
                .build();
    }

    public void updateEntityFromRequest(HeatRecord entity, UpdateHeatRecordRequest request, User detectedBy) {
        if (request.getDetectedAt() != null) entity.setDetectedAt(request.getDetectedAt());
        if (request.getDetectionMethod() != null) entity.setDetectionMethod(request.getDetectionMethod());
        if (request.getSignsObserved() != null) entity.setSignsObserved(request.getSignsObserved());
        if (request.getConfidence() != null) entity.setConfidence(request.getConfidence());
        if (request.getNotes() != null) entity.setNotes(request.getNotes());
        if (detectedBy != null) {
            entity.setDetectedBy(detectedBy);
            entity.setDetectedByName(formatUserName(detectedBy));
        } else if (request.getDetectedByName() != null) {
            entity.setDetectedByName(request.getDetectedByName());
        }
    }

    // --- Breeding Record ---

    public BreedingRecord toEntity(CreateBreedingRecordRequest request, Cow cow, Cow bull,
                                  User technician, User veterinarian, HeatRecord heatRecord) {
        return BreedingRecord.builder()
                .cow(cow)
                .heatRecord(heatRecord)
                .breedingDate(request.getBreedingDate())
                .breedingMethod(request.getBreedingMethod())
                .bull(bull)
                .bullTagNumber(request.getBullTagNumber() != null ? request.getBullTagNumber() :
                        (bull != null ? bull.getTagNumber() : null))
                .semenReference(request.getSemenReference())
                .technician(technician)
                .technicianName(request.getTechnicianName() != null ? request.getTechnicianName() :
                        (technician != null ? formatUserName(technician) : null))
                .veterinarian(veterinarian)
                .veterinarianName(request.getVeterinarianName() != null ? request.getVeterinarianName() :
                        (veterinarian != null ? formatUserName(veterinarian) : null))
                .notes(request.getNotes())
                .status(request.getStatus() != null ? request.getStatus() : BreedingStatus.COMPLETED)
                .build();
    }

    public BreedingRecordResponse toResponse(BreedingRecord entity) {
        if (entity == null) return null;

        Cow cow = entity.getCow();
        Cow bull = entity.getBull();
        User tech = entity.getTechnician();
        User vet = entity.getVeterinarian();

        return BreedingRecordResponse.builder()
                .id(entity.getId())
                .cowId(cow != null ? cow.getId() : null)
                .cowTagNumber(cow != null ? cow.getTagNumber() : null)
                .cowName(cow != null ? cow.getName() : null)
                .heatRecordId(entity.getHeatRecord() != null ? entity.getHeatRecord().getId() : null)
                .breedingDate(entity.getBreedingDate())
                .breedingMethod(entity.getBreedingMethod())
                .bullId(bull != null ? bull.getId() : null)
                .bullTagNumber(entity.getBullTagNumber() != null ? entity.getBullTagNumber() :
                        (bull != null ? bull.getTagNumber() : null))
                .bullName(bull != null ? bull.getName() : null)
                .semenReference(entity.getSemenReference())
                .technicianId(tech != null ? tech.getId() : null)
                .technicianName(entity.getTechnicianName() != null ? entity.getTechnicianName() :
                        (tech != null ? formatUserName(tech) : null))
                .veterinarianId(vet != null ? vet.getId() : null)
                .veterinarianName(entity.getVeterinarianName() != null ? entity.getVeterinarianName() :
                        (vet != null ? formatUserName(vet) : null))
                .notes(entity.getNotes())
                .status(entity.getStatus())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .createdBy(entity.getCreatedBy())
                .build();
    }

    public void updateEntityFromRequest(BreedingRecord entity, UpdateBreedingRecordRequest request,
                                       Cow bull, User technician, User veterinarian, HeatRecord heatRecord) {
        if (request.getBreedingDate() != null) entity.setBreedingDate(request.getBreedingDate());
        if (request.getBreedingMethod() != null) entity.setBreedingMethod(request.getBreedingMethod());
        if (bull != null) {
            entity.setBull(bull);
            entity.setBullTagNumber(bull.getTagNumber());
        } else if (request.getBullTagNumber() != null) {
            entity.setBullTagNumber(request.getBullTagNumber());
        }
        if (request.getSemenReference() != null) entity.setSemenReference(request.getSemenReference());
        if (technician != null) {
            entity.setTechnician(technician);
            entity.setTechnicianName(formatUserName(technician));
        } else if (request.getTechnicianName() != null) {
            entity.setTechnicianName(request.getTechnicianName());
        }
        if (veterinarian != null) {
            entity.setVeterinarian(veterinarian);
            entity.setVeterinarianName(formatUserName(veterinarian));
        } else if (request.getVeterinarianName() != null) {
            entity.setVeterinarianName(request.getVeterinarianName());
        }
        if (heatRecord != null) entity.setHeatRecord(heatRecord);
        if (request.getNotes() != null) entity.setNotes(request.getNotes());
        if (request.getStatus() != null) entity.setStatus(request.getStatus());
    }

    // --- Pregnancy Record ---

    public PregnancyRecord toEntity(CreatePregnancyRecordRequest request, Cow cow, BreedingRecord breeding, User confirmedBy) {
        LocalDate expectedCalving = request.getExpectedCalvingDate();
        if (expectedCalving == null && breeding != null && breeding.getBreedingDate() != null) {
            expectedCalving = breeding.getBreedingDate().plusDays(STANDARD_GESTATION_DAYS);
        }

        return PregnancyRecord.builder()
                .cow(cow)
                .breeding(breeding)
                .confirmationDate(request.getConfirmationDate())
                .confirmationMethod(request.getConfirmationMethod())
                .expectedCalvingDate(expectedCalving)
                .pregnancyStatus(request.getPregnancyStatus() != null ? request.getPregnancyStatus() : PregnancyStatus.PENDING)
                .confirmedBy(confirmedBy)
                .confirmedByName(request.getConfirmedByName() != null ? request.getConfirmedByName() :
                        (confirmedBy != null ? formatUserName(confirmedBy) : null))
                .notes(request.getNotes())
                .build();
    }

    public PregnancyRecordResponse toResponse(PregnancyRecord entity) {
        if (entity == null) return null;

        Cow cow = entity.getCow();
        BreedingRecord breeding = entity.getBreeding();
        User confirmedBy = entity.getConfirmedBy();

        return PregnancyRecordResponse.builder()
                .id(entity.getId())
                .cowId(cow != null ? cow.getId() : null)
                .cowTagNumber(cow != null ? cow.getTagNumber() : null)
                .cowName(cow != null ? cow.getName() : null)
                .breedingId(breeding != null ? breeding.getId() : null)
                .breedingDate(breeding != null ? breeding.getBreedingDate() : null)
                .breedingMethod(breeding != null ? breeding.getBreedingMethod() : null)
                .confirmationDate(entity.getConfirmationDate())
                .confirmationMethod(entity.getConfirmationMethod())
                .expectedCalvingDate(entity.getExpectedCalvingDate())
                .pregnancyStatus(entity.getPregnancyStatus())
                .confirmedById(confirmedBy != null ? confirmedBy.getId() : null)
                .confirmedByName(entity.getConfirmedByName() != null ? entity.getConfirmedByName() :
                        (confirmedBy != null ? formatUserName(confirmedBy) : null))
                .notes(entity.getNotes())
                .daysRemaining(entity.getDaysRemaining())
                .isOverdue(entity.isOverdue())
                .gestationDays(entity.getGestationDays())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .createdBy(entity.getCreatedBy())
                .build();
    }

    public void updateEntityFromRequest(PregnancyRecord entity, UpdatePregnancyRecordRequest request, User confirmedBy) {
        if (request.getConfirmationDate() != null) entity.setConfirmationDate(request.getConfirmationDate());
        if (request.getConfirmationMethod() != null) entity.setConfirmationMethod(request.getConfirmationMethod());
        if (request.getExpectedCalvingDate() != null) entity.setExpectedCalvingDate(request.getExpectedCalvingDate());
        if (request.getPregnancyStatus() != null) entity.setPregnancyStatus(request.getPregnancyStatus());
        if (confirmedBy != null) {
            entity.setConfirmedBy(confirmedBy);
            entity.setConfirmedByName(formatUserName(confirmedBy));
        } else if (request.getConfirmedByName() != null) {
            entity.setConfirmedByName(request.getConfirmedByName());
        }
        if (request.getNotes() != null) entity.setNotes(request.getNotes());
    }

    // --- Calving Record ---

    public CalvingRecord toEntity(CreateCalvingRecordRequest request, Cow cow, PregnancyRecord pregnancy, User veterinarian) {
        return CalvingRecord.builder()
                .cow(cow)
                .pregnancy(pregnancy)
                .calvingDate(request.getCalvingDate())
                .calvingType(request.getCalvingType())
                .calfCount(request.getCalfCount() != null ? request.getCalfCount() : 1)
                .calfDetails(request.getCalfDetails())
                .complications(request.getComplications())
                .assistanceRequired(Boolean.TRUE.equals(request.getAssistanceRequired()))
                .veterinarian(veterinarian)
                .veterinarianName(request.getVeterinarianName() != null ? request.getVeterinarianName() :
                        (veterinarian != null ? formatUserName(veterinarian) : null))
                .notes(request.getNotes())
                .build();
    }

    public CalvingRecordResponse toResponse(CalvingRecord entity) {
        if (entity == null) return null;

        Cow cow = entity.getCow();
        PregnancyRecord preg = entity.getPregnancy();
        User vet = entity.getVeterinarian();

        return CalvingRecordResponse.builder()
                .id(entity.getId())
                .cowId(cow != null ? cow.getId() : null)
                .cowTagNumber(cow != null ? cow.getTagNumber() : null)
                .cowName(cow != null ? cow.getName() : null)
                .pregnancyId(preg != null ? preg.getId() : null)
                .calvingDate(entity.getCalvingDate())
                .calvingType(entity.getCalvingType())
                .calfCount(entity.getCalfCount())
                .calfDetails(entity.getCalfDetails())
                .complications(entity.getComplications())
                .assistanceRequired(entity.getAssistanceRequired())
                .veterinarianId(vet != null ? vet.getId() : null)
                .veterinarianName(entity.getVeterinarianName() != null ? entity.getVeterinarianName() :
                        (vet != null ? formatUserName(vet) : null))
                .notes(entity.getNotes())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .createdBy(entity.getCreatedBy())
                .build();
    }

    public void updateEntityFromRequest(CalvingRecord entity, UpdateCalvingRecordRequest request, User veterinarian) {
        if (request.getCalvingDate() != null) entity.setCalvingDate(request.getCalvingDate());
        if (request.getCalvingType() != null) entity.setCalvingType(request.getCalvingType());
        if (request.getCalfCount() != null) entity.setCalfCount(request.getCalfCount());
        if (request.getCalfDetails() != null) entity.setCalfDetails(request.getCalfDetails());
        if (request.getComplications() != null) entity.setComplications(request.getComplications());
        if (request.getAssistanceRequired() != null) entity.setAssistanceRequired(request.getAssistanceRequired());
        if (veterinarian != null) {
            entity.setVeterinarian(veterinarian);
            entity.setVeterinarianName(formatUserName(veterinarian));
        } else if (request.getVeterinarianName() != null) {
            entity.setVeterinarianName(request.getVeterinarianName());
        }
        if (request.getNotes() != null) entity.setNotes(request.getNotes());
    }

    private String formatUserName(User user) {
        if (user == null) return null;
        if (user.getFirstName() != null || user.getLastName() != null) {
            return ((user.getFirstName() != null ? user.getFirstName() : "") + " " +
                    (user.getLastName() != null ? user.getLastName() : "")).trim();
        }
        return user.getUsername();
    }
}
