package com.dairyflow.modules.milk.repository;

import com.dairyflow.modules.milk.entity.MilkProductionRecord;
import com.dairyflow.modules.milk.entity.enums.MilkShift;
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
import java.util.Optional;
import java.util.UUID;

@Repository
public interface MilkRepository extends JpaRepository<MilkProductionRecord, UUID>, JpaSpecificationExecutor<MilkProductionRecord> {

    boolean existsByCowIdAndProductionDateAndShift(UUID cowId, LocalDate productionDate, MilkShift shift);

    Optional<MilkProductionRecord> findByCowIdAndProductionDateAndShift(UUID cowId, LocalDate productionDate, MilkShift shift);

    @EntityGraph(attributePaths = {"cow"})
    Optional<MilkProductionRecord> findWithCowById(UUID id);

    @EntityGraph(attributePaths = {"cow"})
    Page<MilkProductionRecord> findByCowId(UUID cowId, Pageable pageable);

    @Override
    @EntityGraph(attributePaths = {"cow"})
    Page<MilkProductionRecord> findAll(Specification<MilkProductionRecord> spec, Pageable pageable);

    @Query("SELECT COALESCE(SUM(m.quantityLiters), 0.0) FROM MilkProductionRecord m WHERE m.productionDate = :date AND m.shift = :shift")
    Double sumYieldByDateAndShift(@Param("date") LocalDate date, @Param("shift") MilkShift shift);

    @Query("SELECT COALESCE(SUM(m.quantityLiters), 0.0) FROM MilkProductionRecord m WHERE m.productionDate = :date AND m.status IN (com.dairyflow.modules.milk.entity.enums.MilkRecordStatus.BULK, com.dairyflow.modules.milk.entity.enums.MilkRecordStatus.APPROVED)")
    Double sumBulkYieldByDate(@Param("date") LocalDate date);

    @Query("SELECT COALESCE(SUM(m.quantityLiters), 0.0) FROM MilkProductionRecord m WHERE m.productionDate = :date AND m.status NOT IN (com.dairyflow.modules.milk.entity.enums.MilkRecordStatus.BULK, com.dairyflow.modules.milk.entity.enums.MilkRecordStatus.APPROVED)")
    Double sumWithheldYieldByDate(@Param("date") LocalDate date);

    @Query("SELECT COUNT(m) FROM MilkProductionRecord m WHERE m.productionDate = :date")
    Long countRecordsByDate(@Param("date") LocalDate date);

    @Query("SELECT COALESCE(SUM(m.quantityLiters), 0.0) FROM MilkProductionRecord m WHERE m.productionDate = :date AND m.shift = :shift AND m.status IN (com.dairyflow.modules.milk.entity.enums.MilkRecordStatus.BULK, com.dairyflow.modules.milk.entity.enums.MilkRecordStatus.APPROVED)")
    Double sumBulkYieldByDateAndShift(@Param("date") LocalDate date, @Param("shift") MilkShift shift);

    @Query("SELECT COALESCE(SUM(m.quantityLiters), 0.0) FROM MilkProductionRecord m WHERE m.productionDate = :date AND m.shift = :shift AND m.status NOT IN (com.dairyflow.modules.milk.entity.enums.MilkRecordStatus.BULK, com.dairyflow.modules.milk.entity.enums.MilkRecordStatus.APPROVED)")
    Double sumWithheldYieldByDateAndShift(@Param("date") LocalDate date, @Param("shift") MilkShift shift);

    @Query("SELECT COUNT(m) FROM MilkProductionRecord m WHERE m.productionDate = :date AND m.shift = :shift")
    Long countByDateAndShift(@Param("date") LocalDate date, @Param("shift") MilkShift shift);

    @Query("SELECT COALESCE(MAX(m.quantityLiters), 0.0) FROM MilkProductionRecord m WHERE m.productionDate = :date AND m.shift = :shift")
    Double maxYieldByDateAndShift(@Param("date") LocalDate date, @Param("shift") MilkShift shift);

    @Query("SELECT COALESCE(MIN(m.quantityLiters), 0.0) FROM MilkProductionRecord m WHERE m.productionDate = :date AND m.shift = :shift")
    Double minYieldByDateAndShift(@Param("date") LocalDate date, @Param("shift") MilkShift shift);

    @Query("SELECT COALESCE(AVG(m.quantityLiters), 0.0) FROM MilkProductionRecord m WHERE m.productionDate = :date AND m.shift = :shift")
    Double avgYieldByDateAndShift(@Param("date") LocalDate date, @Param("shift") MilkShift shift);
}
