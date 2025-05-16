package com.ebanking.core.repository.sql;

import com.ebanking.core.model.sql.BankAgent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;
import java.util.Optional;
/*
@Repository
public interface BankAgentRepository extends JpaRepository<BankAgent, Long> {

    Optional<BankAgent> findByEmployeeId(String employeeId);

    List<BankAgent> findByBranchCode(String branchCode);

    List<BankAgent> findByPosition(String position);

    List<BankAgent> findByAccessLevel(BankAgent.AccessLevel accessLevel);

    List<BankAgent> findByHireDateBefore(Date date);

    @Query("SELECT ba FROM BankAgent ba WHERE ba.hireDateAfter >= :startDate")
    List<BankAgent> findAgentsHiredAfter(@Param("startDate") Date startDate);

    @Query("SELECT COUNT(ba) FROM BankAgent ba WHERE ba.branchCode = :branchCode")
    long countAgentsByBranch(@Param("branchCode") String branchCode);

    @Query("SELECT ba FROM BankAgent ba WHERE ba.accessLevel = :accessLevel AND ba.isActive = true")
    List<BankAgent> findActiveAgentsByAccessLevel(@Param("accessLevel") BankAgent.AccessLevel accessLevel);

    @Query("SELECT ba FROM BankAgent ba JOIN ba.roles r WHERE r = :role")
    List<BankAgent> findAgentsByRole(@Param("role") String role);
}*/