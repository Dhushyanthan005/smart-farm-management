package com.dairyflow.modules.breeding.repository;

import com.dairyflow.modules.breeding.dto.BreedingFilterCriteria;
import com.dairyflow.modules.breeding.entity.BreedingRecord;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;

public final class BreedingSpecification {

    private BreedingSpecification() {}

    public static Specification<BreedingRecord> withFilters(BreedingFilterCriteria criteria) {
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

            if (criteria.getBreedingMethod() != null) {
                predicates.add(cb.equal(root.get("breedingMethod"), criteria.getBreedingMethod()));
            }

            if (criteria.getStatus() != null) {
                predicates.add(cb.equal(root.get("status"), criteria.getStatus()));
            }

            if (criteria.getTechnicianId() != null) {
                predicates.add(cb.equal(root.get("technician").get("id"), criteria.getTechnicianId()));
            }

            if (criteria.getVeterinarianId() != null) {
                predicates.add(cb.equal(root.get("veterinarian").get("id"), criteria.getVeterinarianId()));
            }

            if (criteria.getFromDate() != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("breedingDate"), criteria.getFromDate()));
            }

            if (criteria.getToDate() != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("breedingDate"), criteria.getToDate()));
            }

            if (criteria.getSearch() != null && !criteria.getSearch().trim().isEmpty()) {
                String term = "%" + criteria.getSearch().trim().toLowerCase().replace("#", "") + "%";
                Predicate cowTagMatch = cb.like(cb.lower(root.get("cow").get("tagNumber")), term);
                Predicate cowNameMatch = cb.like(cb.lower(root.get("cow").get("name")), term);
                Predicate semenMatch = cb.like(cb.lower(root.get("semenReference")), term);
                Predicate bullTagMatch = cb.like(cb.lower(root.get("bullTagNumber")), term);
                predicates.add(cb.or(cowTagMatch, cowNameMatch, semenMatch, bullTagMatch));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
