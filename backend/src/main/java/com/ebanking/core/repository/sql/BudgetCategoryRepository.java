package com.ebanking.core.repository.sql;

import com.ebanking.core.model.sql.Budget;
import com.ebanking.core.model.sql.BudgetCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface BudgetCategoryRepository extends JpaRepository<BudgetCategory, Long> {

    List<BudgetCategory> findByBudget(Budget budget);

    List<BudgetCategory> findByName(String name);

    List<BudgetCategory> findByIsIncome(boolean isIncome);

    List<BudgetCategory> findBySpentAmountGreaterThan(BigDecimal amount);

    List<BudgetCategory> findByAllocatedAmountLessThan(BigDecimal amount);

    @Query("SELECT bc FROM BudgetCategory bc WHERE bc.budget.user.id = :userId")
    List<BudgetCategory> findByUserId(@Param("userId") Long userId);

    @Query("SELECT bc FROM BudgetCategory bc WHERE bc.budget.id = :budgetId")
    List<BudgetCategory> findByBudgetId(@Param("budgetId") Long budgetId);

    @Query("SELECT bc FROM BudgetCategory bc WHERE bc.budget.id = :budgetId AND bc.spentAmount > bc.allocatedAmount")
    List<BudgetCategory> findOverspentCategoriesByBudgetId(@Param("budgetId") Long budgetId);

    @Query("SELECT bc FROM BudgetCategory bc WHERE bc.budget.user.id = :userId AND bc.name LIKE %:keyword%")
    List<BudgetCategory> searchCategoriesByKeyword(
            @Param("userId") Long userId,
            @Param("keyword") String keyword);

    @Query("SELECT SUM(bc.allocatedAmount) FROM BudgetCategory bc WHERE bc.budget.id = :budgetId")
    BigDecimal getTotalAllocatedAmountByBudgetId(@Param("budgetId") Long budgetId);

    @Query("SELECT SUM(bc.spentAmount) FROM BudgetCategory bc WHERE bc.budget.id = :budgetId")
    BigDecimal getTotalSpentAmountByBudgetId(@Param("budgetId") Long budgetId);
}