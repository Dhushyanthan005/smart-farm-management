package com.dairyflow.modules.cows.entity;

import com.dairyflow.common.audit.AuditableEntity;
import com.dairyflow.modules.cows.entity.enums.Breed;
import com.dairyflow.modules.cows.entity.enums.CowSource;
import com.dairyflow.modules.cows.entity.enums.Gender;
import com.dairyflow.modules.cows.entity.enums.HealthStatus;
import com.dairyflow.modules.cows.entity.enums.LifecycleStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.Period;
import java.util.UUID;

@Entity
@Table(name = "cows", indexes = {
        @Index(name = "idx_cows_tag_number", columnList = "tag_number", unique = true),
        @Index(name = "idx_cows_rfid", columnList = "rfid", unique = true),
        @Index(name = "idx_cows_health_status", columnList = "health_status"),
        @Index(name = "idx_cows_lifecycle_status", columnList = "lifecycle_status"),
        @Index(name = "idx_cows_breed", columnList = "breed"),
        @Index(name = "idx_cows_barn", columnList = "barn"),
        @Index(name = "idx_cows_pen", columnList = "pen"),
        @Index(name = "idx_cows_created_at", columnList = "created_at")
})
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Cow extends AuditableEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(columnDefinition = "UUID", updatable = false, nullable = false)
    private UUID id;

    @Column(name = "tag_number", nullable = false, unique = true, length = 30)
    private String tagNumber;

    @Column(name = "rfid", unique = true, length = 50)
    private String rfid;

    @Column(length = 50)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    private Breed breed;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 10)
    private Gender gender;

    @Column(name = "date_of_birth", nullable = false)
    private LocalDate dateOfBirth;

    @Builder.Default
    @Column(name = "parity", nullable = false)
    private Integer parity = 0;

    @Builder.Default
    @Enumerated(EnumType.STRING)
    @Column(name = "health_status", nullable = false, length = 30)
    private HealthStatus healthStatus = HealthStatus.HEALTHY;

    @Builder.Default
    @Enumerated(EnumType.STRING)
    @Column(name = "lifecycle_status", nullable = false, length = 30)
    private LifecycleStatus lifecycleStatus = LifecycleStatus.ACTIVE;

    @Builder.Default
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private CowSource source = CowSource.BORN;

    @Column(length = 50)
    private String barn;

    @Column(length = 50)
    private String pen;

    @Column(name = "expected_milk_capacity")
    private Double expectedMilkCapacity;

    @Column(name = "current_milk_status", length = 30)
    private String currentMilkStatus;

    @Column(name = "mother_id")
    private UUID motherId;

    @Column(name = "father_id")
    private UUID fatherId;

    @Column(name = "acquisition_date")
    private LocalDate acquisitionDate;

    @Column(name = "acquisition_place", length = 100)
    private String acquisitionPlace;

    @Column(name = "photo_url", length = 255)
    private String photoUrl;

    @Column(length = 1000)
    private String notes;

    /**
     * Dynamically derive animal age formatted e.g. "3.4 yrs" or "8 mos"
     */
    @Transient
    public String calculateAgeString() {
        if (dateOfBirth == null) {
            return "Unknown";
        }
        Period period = Period.between(dateOfBirth, LocalDate.now());
        if (period.getYears() > 0) {
            double yearsWithDecimal = period.getYears() + (period.getMonths() / 12.0);
            return String.format("%.1f yrs", yearsWithDecimal);
        } else if (period.getMonths() > 0) {
            return period.getMonths() + " mos";
        } else {
            return period.getDays() + " days";
        }
    }

    @Transient
    public Double calculateAgeInYears() {
        if (dateOfBirth == null) {
            return null;
        }
        Period period = Period.between(dateOfBirth, LocalDate.now());
        return period.getYears() + (period.getMonths() / 12.0);
    }
}
