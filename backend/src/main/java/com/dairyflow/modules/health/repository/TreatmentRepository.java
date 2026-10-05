package com.dairyflow.modules.health.repository;

import com.dairyflow.modules.health.entity.Treatment;
import com.dairyflow.modules.health.entity.enums.TreatmentStatus;
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
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface TreatmentRepository extends JpaRepository<Treatment, UUID>, JpaSpecificationExecutor<Treatment> {

    @Override
    @EntityGraph(attributePaths = {"cow", "veterinarian", "healthRecord"})
    Page<Treatment> findAll(Specification<Treatment> spec, Pageable pageable);

    @EntityGraph(attributePaths = {"cow", "veterinarian", "healthRecord"})
    @Query("SELECT t FROM Treatment t WHERE t.id = :id")
    Optional<Treatment> findWithDetailsById(@Param("id") UUID id);

    @EntityGraph(attributePaths = {"cow", "veterinarian", "healthRecord"})
    Page<Treatment> findByCowId(UUID cowId, Pageable pageable);

    @EntityGraph(attributePaths = {"cow", "veterinarian", "healthRecord"})
    List<Treatment> findByCowIdAndStatus(UUID cowId, TreatmentStatus status);

    @Query("SELECT t FROM Treatment t JOIN FETCH t.cow WHERE t.withdrawalDays > 0 AND (t.status = 'ACTIVE' OR (t.withdrawalEndDate IS NOT NULL AND t.withdrawalEndDate >= :currentDate)) ORDER BY t.withdrawalEndDate ASC")
    List<Treatment> findActiveWithdrawals(@Param("currentDate") LocalDate currentDate);

    @Query("SELECT COUNT(t) FROM Treatment t WHERE t.withdrawalDays > 0 AND (t.status = 'ACTIVE' OR (t.withdrawalEndDate IS NOT NULL AND t.withdrawalEndDate >= :currentDate))")
    long countActiveWithdrawals(@Param("currentDate") LocalDate currentDate);

    @Query("SELECT t FROM Treatment t JOIN FETCH t.cow WHERE t.cow.id = :cowId AND t.withdrawalDays > 0 AND (t.status = 'ACTIVE' OR (t.withdrawalEndDate IS NOT NULL AND t.withdrawalEndDate >= :currentDate))")
    List<Treatment> findActiveWithdrawalsForCow(@Param("cowId") UUID cowId, @Param("currentDate") LocalDate currentDate);

    long countByStatus(TreatmentStatus status);
}
