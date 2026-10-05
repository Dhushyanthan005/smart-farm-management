package com.dairyflow.modules.breeding.repository;

import com.dairyflow.modules.breeding.entity.CalvingRecord;
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
public interface CalvingRecordRepository extends JpaRepository<CalvingRecord, UUID>, JpaSpecificationExecutor<CalvingRecord> {

    @Override
    @EntityGraph(attributePaths = {"cow", "pregnancy", "veterinarian"})
    Page<CalvingRecord> findAll(Specification<CalvingRecord> spec, Pageable pageable);

    @EntityGraph(attributePaths = {"cow", "pregnancy", "veterinarian"})
    @Query("SELECT c FROM CalvingRecord c WHERE c.id = :id")
    Optional<CalvingRecord> findWithDetailsById(@Param("id") UUID id);

    @EntityGraph(attributePaths = {"cow", "pregnancy", "veterinarian"})
    Page<CalvingRecord> findByCowIdOrderByCalvingDateDesc(UUID cowId, Pageable pageable);

    @EntityGraph(attributePaths = {"cow", "pregnancy", "veterinarian"})
    List<CalvingRecord> findByCowIdOrderByCalvingDateDesc(UUID cowId);

    @EntityGraph(attributePaths = {"cow", "pregnancy", "veterinarian"})
    Optional<CalvingRecord> findFirstByCowIdOrderByCalvingDateDesc(UUID cowId);

    long countByCalvingDateAfter(LocalDate date);

    void deleteByCowId(UUID cowId);
}
