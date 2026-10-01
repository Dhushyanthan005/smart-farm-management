package com.dairyflow.modules.cows.entity;

import com.dairyflow.common.audit.AuditableEntity;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "cows", indexes = {
        @Index(name = "idx_cows_tag_number", columnList = "tag_number", unique = true),
        @Index(name = "idx_cows_status", columnList = "status"),
        @Index(name = "idx_cows_breed", columnList = "breed")
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

    @Column(length = 50)
    private String name;

    @Column(nullable = false, length = 50)
    private String breed;

    @Column(name = "date_of_birth", nullable = false)
    private LocalDate dateOfBirth;

    @Column(nullable = false, length = 10)
    private String gender; // FEMALE, MALE

    @Builder.Default
    @Column(nullable = false, length = 30)
    private String status = "ACTIVE"; // ACTIVE, LACTATING, DRY, PREGNANT, SICK, SOLD, DECEASED

    @Column(name = "mother_id")
    private UUID motherId;

    @Column(name = "father_id")
    private UUID fatherId;

    @Column(name = "photo_url", length = 255)
    private String photoUrl;

    @Column(length = 500)
    private String notes;
}
