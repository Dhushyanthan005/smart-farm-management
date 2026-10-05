package com.dairyflow.modules.breeding.repository;

import com.dairyflow.modules.breeding.entity.PregnancyRecord;
import com.dairyflow.modules.breeding.entity.enums.PregnancyStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.Collection;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface PregnancyRecordRepository extends JpaRepository<PregnancyRecord, UUID>, JpaSpecificationExecutor<PregnancyRecord> {

    @Override
    @EntityGraph(attributePaths = {"cow", "breeding", "confirmedBy"})
    Page<PregnancyRecord> findAll(Specification<PregnancyRecord> spec, Pageable pageable);

    @EntityGraph(attributePaths = {"cow", "breeding", "confirmedBy"})
    @Query("SELECT p FROM PregnancyRecord p WHERE p.id = :id")
    Optional<PregnancyRecord> findWithDetailsById(@Param("id") UUID id);

    @EntityGraph(attributePaths = {"cow", "breeding", "confirmedBy"})
    Page<PregnancyRecord> findByCowIdOrderByCreatedAtDesc(UUID cowId, Pageable pageable);

    @EntityGraph(attributePaths = {"cow", "breeding", "confirmedBy"})
    List<PregnancyRecord> findByCowIdOrderByCreatedAtDesc(UUID cowId);

    @EntityGraph(attributePaths = {"cow", "breeding", "confirmedBy"})
    Optional<PregnancyRecord> findFirstByCowIdAndPregnancyStatusInOrderByCreatedAtDesc(UUID cowId, Collection<PregnancyStatus> statuses);

    @EntityGraph(attributePaths = {"cow", "breeding", "confirmedBy"})
    Optional<PregnancyRecord> findFirstByCowIdOrderByCreatedAtDesc(UUID cowId);

    boolean existsByCowIdAndPregnancyStatusIn(UUID cowId, Collection<PregnancyStatus> statuses);

    boolean existsByCowIdAndPregnancyStatusInAndIdNot(UUID cowId, Collection<PregnancyStatus> statuses, UUID id);

    long countByPregnancyStatus(PregnancyStatus status);

    @Query("SELECT COUNT(p) FROM PregnancyRecord p WHERE p.pregnancyStatus = :status AND p.expectedCalvingDate BETWEEN :startDate AND :endDate")
    long countUpcomingCalvings(@Param("status") PregnancyStatus status, @Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

    @Query("SELECT COUNT(p) FROM PregnancyRecord p WHERE p.pregnancyStatus = :status AND p.expectedCalvingDate < :currentDate")
    long countOverdueCalvings(@Param("status") PregnancyStatus status, @Param("currentDate") LocalDate currentDate);

    void deleteByCowId(UUID cowId);
}
