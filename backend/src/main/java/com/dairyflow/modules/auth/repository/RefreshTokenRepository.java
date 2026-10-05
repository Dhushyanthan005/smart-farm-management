package com.dairyflow.modules.auth.repository;

import com.dairyflow.modules.auth.entity.RefreshToken;
import com.dairyflow.modules.users.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface RefreshTokenRepository extends JpaRepository<RefreshToken, UUID> {

    Optional<RefreshToken> findByTokenHash(String tokenHash);

    @Modifying
    @Query("UPDATE RefreshToken r SET r.revoked = true, r.revokedAt = :revokedAt WHERE r.user = :user AND r.revoked = false")
    void revokeAllUserTokensInternal(@Param("user") User user, @Param("revokedAt") Instant revokedAt);

    default void revokeAllUserTokens(User user) {
        revokeAllUserTokensInternal(user, Instant.now());
    }
}
