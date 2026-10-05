package com.dairyflow.modules.breeding.entity;

import com.dairyflow.common.audit.AuditableEntity;
import com.dairyflow.modules.breeding.entity.enums.HeatConfidence;
import com.dairyflow.modules.breeding.entity.enums.HeatDetectionMethod;
import com.dairyflow.modules.cows.entity.Cow;
import com.dairyflow.modules.users.entity.User;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "heat_records")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class HeatRecord extends AuditableEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(columnDefinition = "UUID", updatable = false, nullable = false)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "cow_id", nullable = false)
    private Cow cow;

    @Column(name = "detected_at", nullable = false)
    private LocalDateTime detectedAt;

    @Enumerated(EnumType.STRING)
    @Column(name = "detection_method", nullable = false, length = 30)
    private HeatDetectionMethod detectionMethod;

    @Column(name = "signs_observed", nullable = false, columnDefinition = "TEXT")
    private String signsObserved;

    @Builder.Default
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private HeatConfidence confidence = HeatConfidence.HIGH;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "detected_by_id")
    private User detectedBy;

    @Column(name = "detected_by_name", length = 100)
    private String detectedByName;
}
