package com.ebanking.core.repository.sql;

import com.ebanking.core.model.sql.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;
import java.util.Optional;
/*
@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByUsername(String username);

    Optional<User> findByEmail(String email);

    boolean existsByUsername(String username);

    boolean existsByEmail(String email);

    List<User> findByIsActive(boolean isActive);

    List<User> findByIsLocked(boolean isLocked);

    @Query("SELECT u FROM User u WHERE u.createdAt >= :startDate")
    List<User> findNewUsersSince(@Param("startDate") Date startDate);

    @Query("SELECT u FROM User u WHERE :role MEMBER OF u.roles")
    List<User> findByRole(@Param("role") String role);

    @Query("SELECT u FROM User u WHERE u.lastLogin < :date")
    List<User> findInactiveUsersSince(@Param("date") Date date);
}*/