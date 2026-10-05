package com.dairyflow.modules.breeding.entity;

import com.dairyflow.common.audit.AuditableEntity;
import com.dairyflow.modules.breeding.entity.enums.CalvingType;
import com.dairyflow.modules.cows.entity.Cow;
import com.dairyflow.modules.users.entity.User;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "calving_records")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CalvingRecord extends AuditableEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(columnDefinition = "UUID", updatable = false, nullable = false)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "cow_id", nullable = false)
    private Cow cow;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pregnancy_id")
    private PregnancyRecord pregnancy;

    @Column(name = "calving_date", nullable = false)
    private LocalDate calvingDate;

    @Builder.Default
    @Enumerated(EnumType.STRING)
    @Column(name = "calving_type", nullable = false, length = 30)
    private CalvingType calvingType = CalvingType.NORMAL;

    @Builder.Default
    @Column(name = "calf_count", nullable = false)
    private Integer calfCount = 1;

    @Column(name = "calf_details", columnDefinition = "TEXT")
    private String calfDetails;

    @Column(columnDefinition = "TEXT")
    private String complications;

    @Builder.Default
    @Column(name = "assistance_required", nullable = false)
    private Boolean assistanceRequired = false;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "veterinarian_id")
    private User veterinarian;

    @Column(name = "veterinarian_name", length = 100)
    private String veterinarianName;

    @Column(columnDefinition = "TEXT")
    private String notes;
}
