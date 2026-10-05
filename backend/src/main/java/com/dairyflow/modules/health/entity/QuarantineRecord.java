package com.dairyflow.modules.health.entity;

import com.dairyflow.common.audit.AuditableEntity;
import com.dairyflow.modules.cows.entity.Cow;
import com.dairyflow.modules.health.entity.enums.QuarantineStatus;
import com.dairyflow.modules.users.entity.User;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.UUID;

@Entity
@Table(name = "quarantine_records", indexes = {
        @Index(name = "idx_quarantine_cow_id", columnList = "cow_id"),
        @Index(name = "idx_quarantine_status", columnList = "status"),
        @Index(name = "idx_quarantine_start_date", columnList = "start_date"),
        @Index(name = "idx_quarantine_location", columnList = "location")
})
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class QuarantineRecord extends AuditableEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(columnDefinition = "UUID", updatable = false, nullable = false)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "cow_id", nullable = false)
    private Cow cow;

    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @Column(name = "expected_release_date")
    private LocalDate expectedReleaseDate;

    @Column(name = "actual_release_date")
    private LocalDate actualReleaseDate;

    @Column(nullable = false, length = 255)
    private String reason;

    @Column(nullable = false, length = 100)
    private String location;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    @Column(nullable = false, length = 20)
    private QuarantineStatus status = QuarantineStatus.ACTIVE;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "veterinarian_id")
    private User veterinarian;

    @Column(name = "veterinarian_name", length = 100)
    private String veterinarianName;

    @Column(columnDefinition = "TEXT")
    private String notes;

    public long getDaysInIsolation() {
        LocalDate end = (actualReleaseDate != null) ? actualReleaseDate : LocalDate.now();
        if (startDate == null) return 0;
        return Math.max(0, ChronoUnit.DAYS.between(startDate, end));
    }
}
