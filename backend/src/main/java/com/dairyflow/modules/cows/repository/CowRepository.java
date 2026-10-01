package com.dairyflow.modules.cows.repository;

import com.dairyflow.modules.cows.entity.Cow;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface CowRepository extends JpaRepository<Cow, UUID> {

    Optional<Cow> findByTagNumber(String tagNumber);

    boolean existsByTagNumber(String tagNumber);

    Page<Cow> findByStatus(String status, Pageable pageable);
}
