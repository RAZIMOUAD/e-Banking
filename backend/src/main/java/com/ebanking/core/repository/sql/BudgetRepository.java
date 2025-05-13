package com.ebanking.core.repository.sql;

import com.ebanking.core.model.sql.Budget;
import com.ebanking.core.model.sql.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

@Repository
public interface BudgetRepository extends JpaRepository<Budget, Long> {

    List<Budget> findByUser(User user);

    List<Budget> findByUserAndIsActive(User user, boolean isActive);

    List<Budget> findByStartDateBeforeAndEndDateAfter(Date currentDate, Date sameCurrentDate);

    List<Budget> findByEndDateBefore(Date date);

    List<Budget> findByTotalAmountGreaterThan(BigDecimal amount);

    @Query("SELECT b FROM Budget b WHERE b.user.id = :userId")
    List<Budget> findByUserId(@Param("userId") Long userId);

    @Query("SELECT b FROM Budget b WHERE b.user.id = :userId AND b.startDate <= :date AND b.endDate >= :date")
    List<Budget> findActiveBudgetsForUserAtDate(
            @Param("userId") Long userId,
            @Param("date") Date date);

    @Query("SELECT b FROM Budget b WHERE b.user.id = :userId AND b.name LIKE %:keyword%")
    List<Budget> searchBudgetsByKeyword(
            @Param("userId") Long userId,
            @Param("keyword") String keyword);

    @Query("SELECT COUNT(b) FROM Budget b WHERE b.user.id = :userId AND b.isActive = true")
    long countActiveBudgetsByUserId(@Param("userId") Long userId);
}