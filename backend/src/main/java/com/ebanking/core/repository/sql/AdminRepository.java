package com.ebanking.core.repository.sql;

import com.ebanking.core.model.sql.Admin;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AdminRepository extends JpaRepository<Admin, Long> {

    List<Admin> findByAdminLevel(Admin.AdminLevel adminLevel);

    List<Admin> findByDepartment(String department);

    List<Admin> findByCanManageUsers(boolean canManageUsers);

    List<Admin> findByCanManageSystem(boolean canManageSystem);

    List<Admin> findByCanApproveLargeTransactions(boolean canApproveLargeTransactions);

    @Query("SELECT a FROM Admin a WHERE a.adminLevel = :level AND a.isActive = true")
    List<Admin> findActiveAdminsByLevel(@Param("level") Admin.AdminLevel level);

    @Query("SELECT COUNT(a) FROM Admin a WHERE a.department = :department")
    long countAdminsByDepartment(@Param("department") String department);

    @Query("SELECT a FROM Admin a WHERE a.canManageSystem = true AND a.canManageUsers = true")
    List<Admin> findSuperAdmins();

    @Query("SELECT a FROM Admin a JOIN a.roles r WHERE r = :role")
    List<Admin> findAdminsByRole(@Param("role") String role);
}