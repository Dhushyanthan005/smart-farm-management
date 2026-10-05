package com.dairyflow.modules.cows.repository;

import com.dairyflow.modules.cows.dto.CowFilterCriteria;
import com.dairyflow.modules.cows.entity.Cow;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;

public class CowSpecification {

    public static Specification<Cow> withFilters(CowFilterCriteria criteria) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (criteria == null) {
                return cb.conjunction();
            }

            // Search by tag number, name, or rfid
            if (criteria.getSearch() != null && !criteria.getSearch().trim().isEmpty()) {
                String searchPattern = "%" + criteria.getSearch().trim().toLowerCase() + "%";
                Predicate tagPredicate = cb.like(cb.lower(root.get("tagNumber")), searchPattern);
                Predicate namePredicate = cb.like(cb.lower(root.get("name")), searchPattern);
                Predicate rfidPredicate = cb.like(cb.lower(root.get("rfid")), searchPattern);
                predicates.add(cb.or(tagPredicate, namePredicate, rfidPredicate));
            }

            // Health status filter
            if (criteria.getHealthStatus() != null) {
                predicates.add(cb.equal(root.get("healthStatus"), criteria.getHealthStatus()));
            }

            // Lifecycle status filter
            if (criteria.getLifecycleStatus() != null) {
                predicates.add(cb.equal(root.get("lifecycleStatus"), criteria.getLifecycleStatus()));
            }

            // Breed filter
            if (criteria.getBreed() != null) {
                predicates.add(cb.equal(root.get("breed"), criteria.getBreed()));
            }

            // Gender filter
            if (criteria.getGender() != null) {
                predicates.add(cb.equal(root.get("gender"), criteria.getGender()));
            }

            // Barn filter
            if (criteria.getBarn() != null && !criteria.getBarn().trim().isEmpty() && !"ALL".equalsIgnoreCase(criteria.getBarn().trim())) {
                predicates.add(cb.like(cb.lower(root.get("barn")), "%" + criteria.getBarn().trim().toLowerCase() + "%"));
            }

            // Pen filter
            if (criteria.getPen() != null && !criteria.getPen().trim().isEmpty()) {
                predicates.add(cb.like(cb.lower(root.get("pen")), "%" + criteria.getPen().trim().toLowerCase() + "%"));
            }

            // Parity filter
            if (criteria.getParity() != null) {
                predicates.add(cb.equal(root.get("parity"), criteria.getParity()));
            }

            if (criteria.getMinParity() != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("parity"), criteria.getMinParity()));
            }

            // Current milk status / stage
            if (criteria.getLactationStage() != null && !criteria.getLactationStage().trim().isEmpty() && !"ALL".equalsIgnoreCase(criteria.getLactationStage().trim())) {
                predicates.add(cb.like(cb.lower(root.get("currentMilkStatus")), "%" + criteria.getLactationStage().trim().toLowerCase() + "%"));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
