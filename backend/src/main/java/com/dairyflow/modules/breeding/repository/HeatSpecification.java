package com.dairyflow.modules.breeding.repository;

import com.dairyflow.modules.breeding.dto.HeatFilterCriteria;
import com.dairyflow.modules.breeding.entity.HeatRecord;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;

public final class HeatSpecification {

    private HeatSpecification() {}

    public static Specification<HeatRecord> withFilters(HeatFilterCriteria criteria) {
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

            if (criteria.getDetectionMethod() != null) {
                predicates.add(cb.equal(root.get("detectionMethod"), criteria.getDetectionMethod()));
            }

            if (criteria.getConfidence() != null) {
                predicates.add(cb.equal(root.get("confidence"), criteria.getConfidence()));
            }

            if (criteria.getFromDate() != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("detectedAt"), criteria.getFromDate()));
            }

            if (criteria.getToDate() != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("detectedAt"), criteria.getToDate()));
            }

            if (criteria.getSearch() != null && !criteria.getSearch().trim().isEmpty()) {
                String term = "%" + criteria.getSearch().trim().toLowerCase().replace("#", "") + "%";
                Predicate cowTagMatch = cb.like(cb.lower(root.get("cow").get("tagNumber")), term);
                Predicate cowNameMatch = cb.like(cb.lower(root.get("cow").get("name")), term);
                Predicate signsMatch = cb.like(cb.lower(root.get("signsObserved")), term);
                predicates.add(cb.or(cowTagMatch, cowNameMatch, signsMatch));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
