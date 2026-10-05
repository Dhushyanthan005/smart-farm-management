package com.dairyflow.modules.health.repository;

import com.dairyflow.modules.health.entity.HealthRecord;
import com.dairyflow.modules.health.entity.enums.CowHealthStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface HealthRecordRepository extends JpaRepository<HealthRecord, UUID>, JpaSpecificationExecutor<HealthRecord> {

    @Override
    @EntityGraph(attributePaths = {"cow", "veterinarian"})
    Page<HealthRecord> findAll(Specification<HealthRecord> spec, Pageable pageable);

    @EntityGraph(attributePaths = {"cow", "veterinarian"})
    @Query("SELECT h FROM HealthRecord h WHERE h.id = :id")
    Optional<HealthRecord> findWithDetailsById(@Param("id") UUID id);

    @EntityGraph(attributePaths = {"cow", "veterinarian"})
    Page<HealthRecord> findByCowId(UUID cowId, Pageable pageable);

    long countByHealthStatus(CowHealthStatus healthStatus);
}
