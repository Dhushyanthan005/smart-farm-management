package com.dairyflow.modules.cows.mapper;

import com.dairyflow.modules.cows.dto.CowResponse;
import com.dairyflow.modules.cows.dto.CreateCowRequest;
import com.dairyflow.modules.cows.dto.UpdateCowRequest;
import com.dairyflow.modules.cows.entity.Cow;
import org.springframework.stereotype.Component;

@Component
public class CowMapper {

    public Cow toEntity(CreateCowRequest request) {
        if (request == null) {
            return null;
        }

        return Cow.builder()
                .tagNumber(request.getTagNumber().trim().toUpperCase())
                .name(request.getName() != null ? request.getName().trim() : null)
                .breed(request.getBreed().trim())
                .dateOfBirth(request.getDateOfBirth())
                .gender(request.getGender().toUpperCase())
                .status(request.getStatus() != null ? request.getStatus().toUpperCase() : "ACTIVE")
                .motherId(request.getMotherId())
                .fatherId(request.getFatherId())
                .notes(request.getNotes())
                .build();
    }

    public CowResponse toResponse(Cow cow) {
        if (cow == null) {
            return null;
        }

        return CowResponse.builder()
                .id(cow.getId())
                .tagNumber(cow.getTagNumber())
                .name(cow.getName())
                .breed(cow.getBreed())
                .dateOfBirth(cow.getDateOfBirth())
                .gender(cow.getGender())
                .status(cow.getStatus())
                .motherId(cow.getMotherId())
                .fatherId(cow.getFatherId())
                .photoUrl(cow.getPhotoUrl())
                .notes(cow.getNotes())
                .createdAt(cow.getCreatedAt())
                .updatedAt(cow.getUpdatedAt())
                .build();
    }

    public void updateEntityFromRequest(Cow cow, UpdateCowRequest request) {
        if (request == null || cow == null) {
            return;
        }

        if (request.getName() != null) {
            cow.setName(request.getName().trim());
        }
        if (request.getBreed() != null) {
            cow.setBreed(request.getBreed().trim());
        }
        if (request.getStatus() != null) {
            cow.setStatus(request.getStatus().toUpperCase());
        }
        if (request.getPhotoUrl() != null) {
            cow.setPhotoUrl(request.getPhotoUrl().trim());
        }
        if (request.getNotes() != null) {
            cow.setNotes(request.getNotes().trim());
        }
    }
}
