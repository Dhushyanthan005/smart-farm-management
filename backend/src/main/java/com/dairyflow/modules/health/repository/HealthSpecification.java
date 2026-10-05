package com.dairyflow.modules.health.repository;

import com.dairyflow.modules.health.dto.HealthFilterCriteria;
import com.dairyflow.modules.health.entity.HealthRecord;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;

public final class HealthSpecification {

    private HealthSpecification() {}

    public static Specification<HealthRecord> withFilters(HealthFilterCriteria criteria) {
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

            if (criteria.getHealthStatus() != null) {
                predicates.add(cb.equal(root.get("healthStatus"), criteria.getHealthStatus()));
            }

            if (criteria.getFromDate() != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("recordDate"), criteria.getFromDate()));
            }

            if (criteria.getToDate() != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("recordDate"), criteria.getToDate()));
            }

            if (criteria.getDiagnosis() != null && !criteria.getDiagnosis().trim().isEmpty()) {
                predicates.add(cb.like(cb.lower(root.get("diagnosis")), "%" + criteria.getDiagnosis().trim().toLowerCase() + "%"));
            }

            if (criteria.getVeterinarianId() != null) {
                predicates.add(cb.equal(root.get("veterinarian").get("id"), criteria.getVeterinarianId()));
            }

            if (criteria.getSearch() != null && !criteria.getSearch().trim().isEmpty()) {
                String term = "%" + criteria.getSearch().trim().toLowerCase().replace("#", "") + "%";
                Predicate cowTagMatch = cb.like(cb.lower(root.get("cow").get("tagNumber")), term);
                Predicate cowNameMatch = cb.like(cb.lower(root.get("cow").get("name")), term);
                Predicate diagnosisMatch = cb.like(cb.lower(root.get("diagnosis")), term);
                Predicate symptomsMatch = cb.like(cb.lower(root.get("symptoms")), term);
                predicates.add(cb.or(cowTagMatch, cowNameMatch, diagnosisMatch, symptomsMatch));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
