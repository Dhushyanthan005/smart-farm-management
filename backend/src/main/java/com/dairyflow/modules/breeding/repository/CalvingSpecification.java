package com.dairyflow.modules.breeding.repository;

import com.dairyflow.modules.breeding.dto.CalvingFilterCriteria;
import com.dairyflow.modules.breeding.entity.CalvingRecord;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;

public final class CalvingSpecification {

    private CalvingSpecification() {}

    public static Specification<CalvingRecord> withFilters(CalvingFilterCriteria criteria) {
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

            if (criteria.getCalvingType() != null) {
                predicates.add(cb.equal(root.get("calvingType"), criteria.getCalvingType()));
            }

            if (Boolean.TRUE.equals(criteria.getComplicationsOnly())) {
                predicates.add(cb.isNotNull(root.get("complications")));
                predicates.add(cb.notEqual(cb.trim(root.get("complications")), ""));
            }

            if (criteria.getFromDate() != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("calvingDate"), criteria.getFromDate()));
            }

            if (criteria.getToDate() != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("calvingDate"), criteria.getToDate()));
            }

            if (criteria.getSearch() != null && !criteria.getSearch().trim().isEmpty()) {
                String term = "%" + criteria.getSearch().trim().toLowerCase().replace("#", "") + "%";
                Predicate cowTagMatch = cb.like(cb.lower(root.get("cow").get("tagNumber")), term);
                Predicate cowNameMatch = cb.like(cb.lower(root.get("cow").get("name")), term);
                Predicate detailsMatch = cb.like(cb.lower(root.get("calfDetails")), term);
                Predicate compMatch = cb.like(cb.lower(root.get("complications")), term);
                predicates.add(cb.or(cowTagMatch, cowNameMatch, detailsMatch, compMatch));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
