package com.dairyflow.modules.breeding.repository;

import com.dairyflow.modules.breeding.dto.PregnancyFilterCriteria;
import com.dairyflow.modules.breeding.entity.PregnancyRecord;
import com.dairyflow.modules.breeding.entity.enums.PregnancyStatus;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

public final class PregnancySpecification {

    private PregnancySpecification() {}

    public static Specification<PregnancyRecord> withFilters(PregnancyFilterCriteria criteria) {
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

            if (criteria.getPregnancyStatus() != null) {
                predicates.add(cb.equal(root.get("pregnancyStatus"), criteria.getPregnancyStatus()));
            }

            if (criteria.getFromExpectedDate() != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("expectedCalvingDate"), criteria.getFromExpectedDate()));
            }

            if (criteria.getToExpectedDate() != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("expectedCalvingDate"), criteria.getToExpectedDate()));
            }

            if (criteria.getFromConfirmationDate() != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("confirmationDate"), criteria.getFromConfirmationDate()));
            }

            if (criteria.getToConfirmationDate() != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("confirmationDate"), criteria.getToConfirmationDate()));
            }

            if (Boolean.TRUE.equals(criteria.getOverdueOnly())) {
                predicates.add(cb.equal(root.get("pregnancyStatus"), PregnancyStatus.CONFIRMED));
                predicates.add(cb.lessThan(root.get("expectedCalvingDate"), LocalDate.now()));
            }

            if (criteria.getSearch() != null && !criteria.getSearch().trim().isEmpty()) {
                String term = "%" + criteria.getSearch().trim().toLowerCase().replace("#", "") + "%";
                Predicate cowTagMatch = cb.like(cb.lower(root.get("cow").get("tagNumber")), term);
                Predicate cowNameMatch = cb.like(cb.lower(root.get("cow").get("name")), term);
                predicates.add(cb.or(cowTagMatch, cowNameMatch));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
