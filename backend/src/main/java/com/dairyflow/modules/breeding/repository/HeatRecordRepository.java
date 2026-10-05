package com.dairyflow.modules.breeding.repository;

import com.dairyflow.modules.breeding.entity.HeatRecord;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface HeatRecordRepository extends JpaRepository<HeatRecord, UUID>, JpaSpecificationExecutor<HeatRecord> {

    @Override
    @EntityGraph(attributePaths = {"cow", "detectedBy"})
    Page<HeatRecord> findAll(Specification<HeatRecord> spec, Pageable pageable);

    @EntityGraph(attributePaths = {"cow", "detectedBy"})
    @Query("SELECT h FROM HeatRecord h WHERE h.id = :id")
    Optional<HeatRecord> findWithDetailsById(@Param("id") UUID id);

    @EntityGraph(attributePaths = {"cow", "detectedBy"})
    Page<HeatRecord> findByCowIdOrderByDetectedAtDesc(UUID cowId, Pageable pageable);

    @EntityGraph(attributePaths = {"cow", "detectedBy"})
    List<HeatRecord> findByCowIdOrderByDetectedAtDesc(UUID cowId);

    @Query("SELECT COUNT(DISTINCT h.cow.id) FROM HeatRecord h WHERE h.detectedAt >= :since")
    long countDistinctCowsInHeatSince(@Param("since") LocalDateTime since);

    void deleteByCowId(UUID cowId);
}
