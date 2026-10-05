package com.dairyflow.modules.breeding.entity;

import com.dairyflow.common.audit.AuditableEntity;
import com.dairyflow.modules.breeding.entity.enums.BreedingMethod;
import com.dairyflow.modules.breeding.entity.enums.BreedingStatus;
import com.dairyflow.modules.cows.entity.Cow;
import com.dairyflow.modules.users.entity.User;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "breeding_records")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BreedingRecord extends AuditableEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(columnDefinition = "UUID", updatable = false, nullable = false)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "cow_id", nullable = false)
    private Cow cow;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "heat_record_id")
    private HeatRecord heatRecord;

    @Column(name = "breeding_date", nullable = false)
    private LocalDate breedingDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "breeding_method", nullable = false, length = 40)
    private BreedingMethod breedingMethod;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "bull_id")
    private Cow bull;

    @Column(name = "bull_tag_number", length = 30)
    private String bullTagNumber;

    @Column(name = "semen_reference", length = 100)
    private String semenReference;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "technician_id")
    private User technician;

    @Column(name = "technician_name", length = 100)
    private String technicianName;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "veterinarian_id")
    private User veterinarian;

    @Column(name = "veterinarian_name", length = 100)
    private String veterinarianName;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Builder.Default
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private BreedingStatus status = BreedingStatus.COMPLETED;
}
