package com.ebanking.core.repository.sql;

import com.ebanking.core.domain.base.enums.RoleType;
import com.ebanking.core.domain.base.role.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RoleRepository extends JpaRepository<Role, Long> {

    Optional<Role> findByName(RoleType name);

}
