package com.ebanking.core.repository.sql;

import com.ebanking.core.domain.base.UserRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRoleRepository  extends JpaRepository<UserRole, Long>{
}
