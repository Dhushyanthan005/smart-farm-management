package com.dairyflow.modules.breeding.entity;

import com.dairyflow.common.audit.AuditableEntity;
import com.dairyflow.modules.breeding.entity.enums.PregnancyConfirmationMethod;
import com.dairyflow.modules.breeding.entity.enums.PregnancyStatus;
import com.dairyflow.modules.cows.entity.Cow;
import com.dairyflow.modules.users.entity.User;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.UUID;

@Entity
@Table(name = "pregnancy_records")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PregnancyRecord extends AuditableEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(columnDefinition = "UUID", updatable = false, nullable = false)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "cow_id", nullable = false)
    private Cow cow;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "breeding_id")
    private BreedingRecord breeding;

    @Column(name = "confirmation_date")
    private LocalDate confirmationDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "confirmation_method", length = 40)
    private PregnancyConfirmationMethod confirmationMethod;

    @Column(name = "expected_calving_date")
    private LocalDate expectedCalvingDate;

    @Builder.Default
    @Enumerated(EnumType.STRING)
    @Column(name = "pregnancy_status", nullable = false, length = 30)
    private PregnancyStatus pregnancyStatus = PregnancyStatus.PENDING;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "confirmed_by_id")
    private User confirmedBy;

    @Column(name = "confirmed_by_name", length = 100)
    private String confirmedByName;

    @Column(columnDefinition = "TEXT")
    private String notes;

    public long getDaysRemaining() {
        if (expectedCalvingDate == null) {
            return 0;
        }
        return ChronoUnit.DAYS.between(LocalDate.now(), expectedCalvingDate);
    }

    public boolean isOverdue() {
        if (pregnancyStatus != PregnancyStatus.CONFIRMED || expectedCalvingDate == null) {
            return false;
        }
        return LocalDate.now().isAfter(expectedCalvingDate);
    }

    public long getGestationDays() {
        if (breeding == null || breeding.getBreedingDate() == null) {
            return 0;
        }
        return ChronoUnit.DAYS.between(breeding.getBreedingDate(), LocalDate.now());
    }
}
