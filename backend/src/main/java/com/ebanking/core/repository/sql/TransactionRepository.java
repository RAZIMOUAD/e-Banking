package com.ebanking.core.repository.sql;


import com.ebanking.core.domain.base.transaction.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    List<Transaction> findBySourceId(Long sourceId);
    List<Transaction> findByCibleId(Long cibleId);

    @Query(value = "SELECT COUNT(*) FROM transactions WHERE DATE(createdAt) = CURRENT_DATE", nativeQuery = true)
    long countToday();
    @Query("SELECT SUM(t.montant) FROM Transaction t")
    Double sumTotalAmount();

    @Query("SELECT t FROM Transaction t WHERE t.source.client.id = :clientId OR t.cible.client.id = :clientId ORDER BY t.date DESC")
    List<Transaction> findTop5ByClientIdOrderByDateDesc(@Param("clientId") Long clientId);
}

/*
    Optional<Transaction> findByTransactionReference(String transactionReference);

    List<Transaction> findByAccount(Account account);

    List<Transaction> findByAccountAndTransactionDateBetween(Account account, Date startDate, Date endDate);

    List<Transaction> findByCategory(BudgetCategory category);

    List<Transaction> findByStatus(Transaction.TransactionStatus status);

    List<Transaction> findByTransactionType(Transaction.TransactionType type);

    Page<Transaction> findByAccount(Account account, Pageable pageable);

    List<Transaction> findByAmountGreaterThan(BigDecimal amount);

    @Query("SELECT t FROM Transaction t WHERE t.account.user.id = :userId")
    List<Transaction> findByUserId(@Param("userId") Long userId);

    @Query("SELECT t FROM Transaction t WHERE t.account.user.id = :userId AND t.transactionDate BETWEEN :startDate AND :endDate")
    List<Transaction> findByUserIdAndDateRange(
            @Param("userId") Long userId,
            @Param("startDate") Date startDate,
            @Param("endDate") Date endDate);

    @Query("SELECT SUM(t.amount) FROM Transaction t WHERE t.account.id = :accountId AND t.transactionType = :type")
    BigDecimal sumAmountByAccountAndType(
            @Param("accountId") Long accountId,
            @Param("type") Transaction.TransactionType type);

    @Query("SELECT SUM(t.amount) FROM Transaction t WHERE t.account.user.id = :userId AND t.category.id = :categoryId")
    BigDecimal sumAmountByUserAndCategory(
            @Param("userId") Long userId,
            @Param("categoryId") Long categoryId);
 */