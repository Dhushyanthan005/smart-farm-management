package com.dairyflow.modules.cows.mapper;

import com.dairyflow.modules.cows.dto.CowResponse;
import com.dairyflow.modules.cows.dto.CreateCowRequest;
import com.dairyflow.modules.cows.dto.UpdateCowRequest;
import com.dairyflow.modules.cows.entity.Cow;
import com.dairyflow.modules.cows.entity.enums.CowSource;
import com.dairyflow.modules.cows.entity.enums.Gender;
import com.dairyflow.modules.cows.entity.enums.HealthStatus;
import com.dairyflow.modules.cows.entity.enums.LifecycleStatus;
import org.springframework.stereotype.Component;

@Component
public class CowMapper {

    public Cow toEntity(CreateCowRequest request) {
        if (request == null) {
            return null;
        }

        int parity = (request.getGender() == Gender.MALE) ? 0 : (request.getParity() != null ? request.getParity() : 0);

        return Cow.builder()
                .tagNumber(request.getTagNumber().trim().toUpperCase())
                .rfid(request.getRfid() != null && !request.getRfid().trim().isEmpty() ? request.getRfid().trim() : null)
                .name(request.getName() != null ? request.getName().trim() : null)
                .breed(request.getBreed())
                .gender(request.getGender())
                .dateOfBirth(request.getDateOfBirth())
                .parity(parity)
                .healthStatus(request.getHealthStatus() != null ? request.getHealthStatus() : HealthStatus.HEALTHY)
                .lifecycleStatus(request.getLifecycleStatus() != null ? request.getLifecycleStatus() : LifecycleStatus.ACTIVE)
                .source(request.getSource() != null ? request.getSource() : CowSource.BORN)
                .barn(request.getBarn() != null ? request.getBarn().trim() : null)
                .pen(request.getPen() != null ? request.getPen().trim() : null)
                .expectedMilkCapacity(request.getExpectedMilkCapacity())
                .currentMilkStatus(request.getCurrentMilkStatus() != null ? request.getCurrentMilkStatus().trim() : null)
                .motherId(request.getMotherId())
                .fatherId(request.getFatherId())
                .acquisitionDate(request.getAcquisitionDate())
                .acquisitionPlace(request.getAcquisitionPlace() != null ? request.getAcquisitionPlace().trim() : null)
                .photoUrl(request.getPhotoUrl() != null ? request.getPhotoUrl().trim() : null)
                .notes(request.getNotes() != null ? request.getNotes().trim() : null)
                .build();
    }

    public CowResponse toResponse(Cow cow) {
        if (cow == null) {
            return null;
        }

        return CowResponse.builder()
                .id(cow.getId())
                .tagNumber(cow.getTagNumber())
                .rfid(cow.getRfid())
                .name(cow.getName())
                .breed(cow.getBreed())
                .gender(cow.getGender())
                .dateOfBirth(cow.getDateOfBirth())
                .age(cow.calculateAgeString())
                .ageInYears(cow.calculateAgeInYears())
                .parity(cow.getParity())
                .healthStatus(cow.getHealthStatus())
                .lifecycleStatus(cow.getLifecycleStatus())
                .source(cow.getSource())
                .barn(cow.getBarn())
                .pen(cow.getPen())
                .expectedMilkCapacity(cow.getExpectedMilkCapacity())
                .currentMilkStatus(cow.getCurrentMilkStatus())
                .motherId(cow.getMotherId())
                .fatherId(cow.getFatherId())
                .acquisitionDate(cow.getAcquisitionDate())
                .acquisitionPlace(cow.getAcquisitionPlace())
                .photoUrl(cow.getPhotoUrl())
                .notes(cow.getNotes())
                .createdAt(cow.getCreatedAt())
                .updatedAt(cow.getUpdatedAt())
                .createdBy(cow.getCreatedBy())
                .updatedBy(cow.getUpdatedBy())
                .build();
    }

    public void updateEntityFromRequest(Cow cow, UpdateCowRequest request) {
        if (request == null || cow == null) {
            return;
        }

        if (request.getName() != null) {
            cow.setName(request.getName().trim());
        }
        if (request.getRfid() != null) {
            cow.setRfid(request.getRfid().trim().isEmpty() ? null : request.getRfid().trim());
        }
        if (request.getBreed() != null) {
            cow.setBreed(request.getBreed());
        }
        if (request.getGender() != null) {
            cow.setGender(request.getGender());
            if (request.getGender() == Gender.MALE) {
                cow.setParity(0);
            }
        }
        if (request.getDateOfBirth() != null) {
            cow.setDateOfBirth(request.getDateOfBirth());
        }
        if (request.getParity() != null && cow.getGender() != Gender.MALE) {
            cow.setParity(request.getParity());
        }
        if (request.getHealthStatus() != null) {
            cow.setHealthStatus(request.getHealthStatus());
        }
        if (request.getLifecycleStatus() != null) {
            cow.setLifecycleStatus(request.getLifecycleStatus());
        }
        if (request.getSource() != null) {
            cow.setSource(request.getSource());
        }
        if (request.getBarn() != null) {
            cow.setBarn(request.getBarn().trim());
        }
        if (request.getPen() != null) {
            cow.setPen(request.getPen().trim());
        }
        if (request.getExpectedMilkCapacity() != null) {
            cow.setExpectedMilkCapacity(request.getExpectedMilkCapacity());
        }
        if (request.getCurrentMilkStatus() != null) {
            cow.setCurrentMilkStatus(request.getCurrentMilkStatus().trim());
        }
        if (request.getMotherId() != null) {
            cow.setMotherId(request.getMotherId());
        }
        if (request.getFatherId() != null) {
            cow.setFatherId(request.getFatherId());
        }
        if (request.getAcquisitionDate() != null) {
            cow.setAcquisitionDate(request.getAcquisitionDate());
        }
        if (request.getAcquisitionPlace() != null) {
            cow.setAcquisitionPlace(request.getAcquisitionPlace().trim());
        }
        if (request.getPhotoUrl() != null) {
            cow.setPhotoUrl(request.getPhotoUrl().trim());
        }
        if (request.getNotes() != null) {
            cow.setNotes(request.getNotes().trim());
        }
    }
}
