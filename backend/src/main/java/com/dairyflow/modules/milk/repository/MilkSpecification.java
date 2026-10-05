package com.dairyflow.modules.milk.repository;

import com.dairyflow.modules.cows.entity.Cow;
import com.dairyflow.modules.milk.dto.MilkFilterCriteria;
import com.dairyflow.modules.milk.entity.MilkProductionRecord;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;

public class MilkSpecification {

    public static Specification<MilkProductionRecord> withFilters(MilkFilterCriteria criteria) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (criteria == null) {
                return cb.conjunction();
            }

            // Exact date filter
            if (criteria.getDate() != null) {
                predicates.add(cb.equal(root.get("productionDate"), criteria.getDate()));
            }

            // Date range filter
            if (criteria.getFromDate() != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("productionDate"), criteria.getFromDate()));
            }
            if (criteria.getToDate() != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("productionDate"), criteria.getToDate()));
            }

            // Shift filter
            if (criteria.getShift() != null) {
                predicates.add(cb.equal(root.get("shift"), criteria.getShift()));
            }

            // Status filter
            if (criteria.getStatus() != null) {
                predicates.add(cb.equal(root.get("status"), criteria.getStatus()));
            }

            // Cow ID filter
            if (criteria.getCowId() != null) {
                predicates.add(cb.equal(root.get("cow").get("id"), criteria.getCowId()));
            }

            // Search filter by Cow Tag, Cow Name, or RFID
            if (criteria.getSearch() != null && !criteria.getSearch().trim().isEmpty()) {
                Join<MilkProductionRecord, Cow> cowJoin = root.join("cow", JoinType.LEFT);
                String pattern = "%" + criteria.getSearch().trim().toLowerCase() + "%";
                Predicate tagMatch = cb.like(cb.lower(cowJoin.get("tagNumber")), pattern);
                Predicate nameMatch = cb.like(cb.lower(cowJoin.get("name")), pattern);
                Predicate rfidMatch = cb.like(cb.lower(cowJoin.get("rfid")), pattern);
                predicates.add(cb.or(tagMatch, nameMatch, rfidMatch));
            } else if (criteria.getCowTag() != null && !criteria.getCowTag().trim().isEmpty()) {
                Join<MilkProductionRecord, Cow> cowJoin = root.join("cow", JoinType.LEFT);
                predicates.add(cb.equal(cb.upper(cowJoin.get("tagNumber")), criteria.getCowTag().trim().toUpperCase()));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
