package com.dairyflow.modules.cows.repository;

import com.dairyflow.modules.cows.entity.Cow;
import com.dairyflow.modules.cows.entity.enums.HealthStatus;
import com.dairyflow.modules.cows.entity.enums.LifecycleStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface CowRepository extends JpaRepository<Cow, UUID>, JpaSpecificationExecutor<Cow> {

    Optional<Cow> findByTagNumber(String tagNumber);

    boolean existsByTagNumber(String tagNumber);

    Optional<Cow> findByRfid(String rfid);

    boolean existsByRfid(String rfid);

    long countByLifecycleStatus(LifecycleStatus lifecycleStatus);

    long countByHealthStatus(HealthStatus healthStatus);

    @Query("SELECT COUNT(c) FROM Cow c WHERE c.parity = 0 AND c.gender = com.dairyflow.modules.cows.entity.enums.Gender.FEMALE AND c.lifecycleStatus = com.dairyflow.modules.cows.entity.enums.LifecycleStatus.ACTIVE")
    long countHeifers();

    @Query("SELECT COUNT(c) FROM Cow c WHERE c.healthStatus = com.dairyflow.modules.cows.entity.enums.HealthStatus.QUARANTINED AND c.lifecycleStatus = com.dairyflow.modules.cows.entity.enums.LifecycleStatus.ACTIVE")
    long countQuarantined();

    @Query("SELECT COUNT(c) FROM Cow c WHERE (UPPER(c.currentMilkStatus) = 'DRY' OR c.healthStatus = com.dairyflow.modules.cows.entity.enums.HealthStatus.PREGNANT) AND c.lifecycleStatus = com.dairyflow.modules.cows.entity.enums.LifecycleStatus.ACTIVE AND c.parity > 0")
    long countDry();

    @Query("SELECT COUNT(c) FROM Cow c WHERE (UPPER(c.currentMilkStatus) IN ('IN MILK', 'EARLY', 'PEAK', 'MID', 'LATE') OR (c.currentMilkStatus IS NULL AND c.parity > 0 AND c.healthStatus != com.dairyflow.modules.cows.entity.enums.HealthStatus.QUARANTINED)) AND c.gender = com.dairyflow.modules.cows.entity.enums.Gender.FEMALE AND c.lifecycleStatus = com.dairyflow.modules.cows.entity.enums.LifecycleStatus.ACTIVE")
    long countInMilk();
}
