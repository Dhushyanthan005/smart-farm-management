package com.dairyflow.modules.cows.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CowResponse {

    private UUID id;
    private String tagNumber;
    private String name;
    private String breed;
    private LocalDate dateOfBirth;
    private String gender;
    private String status;
    private UUID motherId;
    private UUID fatherId;
    private String photoUrl;
    private String notes;
    private Instant createdAt;
    private Instant updatedAt;
}
