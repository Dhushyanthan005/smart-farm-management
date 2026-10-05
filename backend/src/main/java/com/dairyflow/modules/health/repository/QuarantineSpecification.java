package com.dairyflow.modules.health.repository;

import com.dairyflow.modules.health.dto.QuarantineFilterCriteria;
import com.dairyflow.modules.health.entity.QuarantineRecord;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;

public final class QuarantineSpecification {

    private QuarantineSpecification() {}

    public static Specification<QuarantineRecord> withFilters(QuarantineFilterCriteria criteria) {
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

            if (criteria.getLocation() != null && !criteria.getLocation().trim().isEmpty()) {
                predicates.add(cb.like(cb.lower(root.get("location")), "%" + criteria.getLocation().trim().toLowerCase() + "%"));
            }

            if (criteria.getFromDate() != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("startDate"), criteria.getFromDate()));
            }

            if (criteria.getToDate() != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("startDate"), criteria.getToDate()));
            }

            if (criteria.getVeterinarianId() != null) {
                predicates.add(cb.equal(root.get("veterinarian").get("id"), criteria.getVeterinarianId()));
            }

            if (criteria.getSearch() != null && !criteria.getSearch().trim().isEmpty()) {
                String term = "%" + criteria.getSearch().trim().toLowerCase().replace("#", "") + "%";
                Predicate cowTagMatch = cb.like(cb.lower(root.get("cow").get("tagNumber")), term);
                Predicate cowNameMatch = cb.like(cb.lower(root.get("cow").get("name")), term);
                Predicate reasonMatch = cb.like(cb.lower(root.get("reason")), term);
                Predicate locationMatch = cb.like(cb.lower(root.get("location")), term);
                predicates.add(cb.or(cowTagMatch, cowNameMatch, reasonMatch, locationMatch));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
