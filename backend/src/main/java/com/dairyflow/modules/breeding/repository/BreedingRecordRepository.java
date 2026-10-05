package com.dairyflow.modules.breeding.repository;

import com.dairyflow.modules.breeding.entity.BreedingRecord;
import com.dairyflow.modules.breeding.entity.enums.BreedingStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface BreedingRecordRepository extends JpaRepository<BreedingRecord, UUID>, JpaSpecificationExecutor<BreedingRecord> {

    @Override
    @EntityGraph(attributePaths = {"cow", "bull", "technician", "veterinarian", "heatRecord"})
    Page<BreedingRecord> findAll(Specification<BreedingRecord> spec, Pageable pageable);

    @EntityGraph(attributePaths = {"cow", "bull", "technician", "veterinarian", "heatRecord"})
    @Query("SELECT b FROM BreedingRecord b WHERE b.id = :id")
    Optional<BreedingRecord> findWithDetailsById(@Param("id") UUID id);

    @EntityGraph(attributePaths = {"cow", "bull", "technician", "veterinarian", "heatRecord"})
    Page<BreedingRecord> findByCowIdOrderByBreedingDateDesc(UUID cowId, Pageable pageable);

    @EntityGraph(attributePaths = {"cow", "bull", "technician", "veterinarian", "heatRecord"})
    List<BreedingRecord> findByCowIdOrderByBreedingDateDesc(UUID cowId);

    @EntityGraph(attributePaths = {"cow", "bull", "technician", "veterinarian", "heatRecord"})
    Optional<BreedingRecord> findFirstByCowIdOrderByBreedingDateDesc(UUID cowId);

    long countByStatus(BreedingStatus status);

    void deleteByCowId(UUID cowId);
}
