package com.dairyflow.modules.health.entity;

import com.dairyflow.common.audit.AuditableEntity;
import com.dairyflow.modules.cows.entity.Cow;
import com.dairyflow.modules.health.entity.enums.CowHealthStatus;
import com.dairyflow.modules.users.entity.User;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "health_records", indexes = {
        @Index(name = "idx_health_cow_id", columnList = "cow_id"),
        @Index(name = "idx_health_record_date", columnList = "record_date"),
        @Index(name = "idx_health_status", columnList = "health_status"),
        @Index(name = "idx_health_vet_id", columnList = "veterinarian_id")
})
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class HealthRecord extends AuditableEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(columnDefinition = "UUID", updatable = false, nullable = false)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "cow_id", nullable = false)
    private Cow cow;

    @Column(name = "record_date", nullable = false)
    private LocalDate recordDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "health_status", nullable = false, length = 30)
    private CowHealthStatus healthStatus;

    @Column(length = 255)
    private String diagnosis;

    @Column(columnDefinition = "TEXT")
    private String symptoms;

    @Column
    private Double temperature;

    @Column
    private Double weight;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "veterinarian_id")
    private User veterinarian;

    @Column(name = "veterinarian_name", length = 100)
    private String veterinarianName;

    @Column(columnDefinition = "TEXT")
    private String notes;
}
