package com.dairyflow.modules.breeding.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReproductiveTimelineEventResponse {

    private UUID id;
    private String eventType;
    private LocalDateTime eventDate;
    private String title;
    private String description;
    private String status;
    private String performedBy;
    private String notes;
}
