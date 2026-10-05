package com.dairyflow.modules.health.repository;

import com.dairyflow.modules.health.dto.TreatmentFilterCriteria;
import com.dairyflow.modules.health.entity.Treatment;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

public final class TreatmentSpecification {

    private TreatmentSpecification() {}

    public static Specification<Treatment> withFilters(TreatmentFilterCriteria criteria) {
        return (root, query, cb) -> {
            if (criteria == null) {
                return cb.conjunction();
            }

            List<Predicate> predicates = new ArrayList<>();

            if (criteria.getCowId() != null) {
                predicates.add(cb.equal(root.get("cow").get("id"), criteria.getCowId()));
            }

            if (criteria.getCowTag() != null && !criteria.getCowTag().trim().isEmpty()) {
                String cleanTag = criteria.getCowTag().trim().toUpperCase().replace("#", "");
                predicates.add(cb.equal(cb.upper(root.get("cow").get("tagNumber")), cleanTag));
            }

            if (criteria.getStatus() != null) {
                predicates.add(cb.equal(root.get("status"), criteria.getStatus()));
            }

            if (criteria.getMedication() != null && !criteria.getMedication().trim().isEmpty()) {
                predicates.add(cb.like(cb.lower(root.get("medication")), "%" + criteria.getMedication().trim().toLowerCase() + "%"));
            }

            if (criteria.getTreatmentType() != null && !criteria.getTreatmentType().trim().isEmpty()) {
                predicates.add(cb.equal(cb.lower(root.get("treatmentType")), criteria.getTreatmentType().trim().toLowerCase()));
            }

            if (criteria.getFromDate() != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("startDate"), criteria.getFromDate()));
            }

            if (criteria.getToDate() != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("startDate"), criteria.getToDate()));
            }

            if (Boolean.TRUE.equals(criteria.getActiveWithdrawalOnly())) {
                LocalDate now = LocalDate.now();
                Predicate hasWithdrawalDays = cb.greaterThan(root.get("withdrawalDays"), 0);
                Predicate withdrawalNotPassed = cb.greaterThanOrEqualTo(root.get("withdrawalEndDate"), now);
                predicates.add(cb.and(hasWithdrawalDays, withdrawalNotPassed));
            }

            if (criteria.getVeterinarianId() != null) {
                predicates.add(cb.equal(root.get("veterinarian").get("id"), criteria.getVeterinarianId()));
            }

            if (criteria.getSearch() != null && !criteria.getSearch().trim().isEmpty()) {
                String term = "%" + criteria.getSearch().trim().toLowerCase().replace("#", "") + "%";
                Predicate cowTagMatch = cb.like(cb.lower(root.get("cow").get("tagNumber")), term);
                Predicate cowNameMatch = cb.like(cb.lower(root.get("cow").get("name")), term);
                Predicate diagnosisMatch = cb.like(cb.lower(root.get("diagnosis")), term);
                Predicate medicationMatch = cb.like(cb.lower(root.get("medication")), term);
                predicates.add(cb.or(cowTagMatch, cowNameMatch, diagnosisMatch, medicationMatch));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
