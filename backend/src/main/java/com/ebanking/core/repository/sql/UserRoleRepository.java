package com.ebanking.core.repository.sql;

import com.ebanking.core.domain.base.UserRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRoleRepository extends JpaRepository<UserRole, Long> {

    @Query("SELECT COUNT(ur.user) FROM UserRole ur WHERE ur.role.name = :role")
    int countByRole(@Param("role") String role);
}
