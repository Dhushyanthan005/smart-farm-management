package com.dairyflow.modules.milk.entity;

import com.dairyflow.common.audit.AuditableEntity;
import com.dairyflow.modules.cows.entity.Cow;
import com.dairyflow.modules.milk.entity.enums.MilkRecordStatus;
import com.dairyflow.modules.milk.entity.enums.MilkShift;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(
        name = "milk_production_records",
        uniqueConstraints = {
                @UniqueConstraint(name = "uk_milk_cow_date_shift", columnNames = {"cow_id", "production_date", "shift"})
        },
        indexes = {
                @Index(name = "idx_milk_cow", columnList = "cow_id"),
                @Index(name = "idx_milk_date", columnList = "production_date"),
                @Index(name = "idx_milk_shift", columnList = "shift"),
                @Index(name = "idx_milk_date_shift", columnList = "production_date, shift"),
                @Index(name = "idx_milk_status", columnList = "status"),
                @Index(name = "idx_milk_created_at", columnList = "created_at")
        }
)
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MilkProductionRecord extends AuditableEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(columnDefinition = "UUID", updatable = false, nullable = false)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "cow_id", nullable = false)
    private Cow cow;

    @Column(name = "production_date", nullable = false)
    private LocalDate productionDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 10)
    private MilkShift shift;

    @Column(name = "quantity_liters", nullable = false)
    private Double quantityLiters;

    @Builder.Default
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private MilkRecordStatus status = MilkRecordStatus.BULK;

    @Column(name = "fat_percentage")
    private Double fatPercentage;

    @Column(name = "protein_percentage")
    private Double proteinPercentage;

    @Column(name = "somatic_cell_count")
    private Integer somaticCellCount;

    @Column(name = "conductivity")
    private Double conductivity;

    @Column(name = "operator_id")
    private UUID operatorId;

    @Column(name = "operator_name", length = 100)
    private String operatorName;

    @Column(length = 500)
    private String notes;
}
