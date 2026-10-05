package com.dairyflow.modules.health.repository;

import com.dairyflow.modules.health.entity.QuarantineRecord;
import com.dairyflow.modules.health.entity.enums.QuarantineStatus;
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
public interface QuarantineRecordRepository extends JpaRepository<QuarantineRecord, UUID>, JpaSpecificationExecutor<QuarantineRecord> {

    @Override
    @EntityGraph(attributePaths = {"cow", "veterinarian"})
    Page<QuarantineRecord> findAll(Specification<QuarantineRecord> spec, Pageable pageable);

    @EntityGraph(attributePaths = {"cow", "veterinarian"})
    @Query("SELECT q FROM QuarantineRecord q WHERE q.id = :id")
    Optional<QuarantineRecord> findWithDetailsById(@Param("id") UUID id);

    @EntityGraph(attributePaths = {"cow", "veterinarian"})
    Page<QuarantineRecord> findByCowId(UUID cowId, Pageable pageable);

    boolean existsByCowIdAndStatus(UUID cowId, QuarantineStatus status);

    @EntityGraph(attributePaths = {"cow", "veterinarian"})
    Optional<QuarantineRecord> findFirstByCowIdAndStatusOrderByStartDateDesc(UUID cowId, QuarantineStatus status);

    @EntityGraph(attributePaths = {"cow", "veterinarian"})
    List<QuarantineRecord> findByStatusOrderByStartDateDesc(QuarantineStatus status);

    long countByStatus(QuarantineStatus status);
}
