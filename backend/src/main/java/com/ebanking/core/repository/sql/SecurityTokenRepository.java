package com.ebanking.core.repository.sql;

import com.ebanking.core.domain.base.SecurityToken;
import com.ebanking.core.domain.base.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface SecurityTokenRepository extends JpaRepository<SecurityToken, Long> {
    @Query("SELECT t FROM SecurityToken t WHERE t.user.id = :userId AND t.code = :code AND t.type = :type AND t.status = :status")
    Optional<SecurityToken> findValidTokenByUserIdAndCode(
            @Param("userId") Long userId,
            @Param("code") String code,
            @Param("type") String type,
            @Param("status") String status
    );

    List<SecurityToken> findAllByUserAndType(User user, String type);
}

