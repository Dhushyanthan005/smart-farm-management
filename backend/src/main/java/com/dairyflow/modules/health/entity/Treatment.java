package com.dairyflow.modules.health.entity;

import com.dairyflow.common.audit.AuditableEntity;
import com.dairyflow.modules.cows.entity.Cow;
import com.dairyflow.modules.health.entity.enums.TreatmentStatus;
import com.dairyflow.modules.users.entity.User;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.UUID;

@Entity
@Table(name = "treatments", indexes = {
        @Index(name = "idx_treatment_cow_id", columnList = "cow_id"),
        @Index(name = "idx_treatment_status", columnList = "status"),
        @Index(name = "idx_treatment_start_date", columnList = "start_date"),
        @Index(name = "idx_treatment_end_date", columnList = "end_date"),
        @Index(name = "idx_treatment_withdrawal_end", columnList = "withdrawal_end_date"),
        @Index(name = "idx_treatment_vet_id", columnList = "veterinarian_id")
})
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Treatment extends AuditableEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(columnDefinition = "UUID", updatable = false, nullable = false)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "cow_id", nullable = false)
    private Cow cow;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "health_record_id")
    private HealthRecord healthRecord;

    @Column(name = "treatment_date", nullable = false)
    private LocalDate treatmentDate;

    @Column(nullable = false, length = 255)
    private String diagnosis;

    @Column(name = "treatment_type", length = 50)
    private String treatmentType;

    @Column(nullable = false, length = 100)
    private String medication;

    @Column(length = 50)
    private String dosage;

    @Column(length = 50)
    private String frequency;

    @Column(length = 50)
    private String route;

    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @Column(name = "end_date", nullable = false)
    private LocalDate endDate;

    @Builder.Default
    @Column(name = "withdrawal_days", nullable = false)
    private Integer withdrawalDays = 0;

    @Column(name = "withdrawal_end_date")
    private LocalDate withdrawalEndDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "veterinarian_id")
    private User veterinarian;

    @Column(name = "veterinarian_name", length = 100)
    private String veterinarianName;

    @Column(columnDefinition = "TEXT")
    private String instructions;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    @Column(nullable = false, length = 20)
    private TreatmentStatus status = TreatmentStatus.ACTIVE;

    public boolean isWithdrawalActive() {
        if (withdrawalDays == null || withdrawalDays <= 0) {
            return false;
        }
        LocalDate now = LocalDate.now();
        if (withdrawalEndDate != null) {
            return !now.isAfter(withdrawalEndDate);
        }
        return status == TreatmentStatus.ACTIVE;
    }

    public long getWithdrawalDaysRemaining() {
        if (!isWithdrawalActive() || withdrawalEndDate == null) {
            return 0;
        }
        LocalDate now = LocalDate.now();
        if (now.isAfter(withdrawalEndDate)) {
            return 0;
        }
        return ChronoUnit.DAYS.between(now, withdrawalEndDate);
    }
}
