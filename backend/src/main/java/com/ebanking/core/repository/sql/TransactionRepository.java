package com.ebanking.core.repository.sql;



import com.ebanking.core.domain.base.transaction.Transaction;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    //Optional<Transaction> findByTransactionReference(String transactionReference);
    @Query(value = "SELECT COUNT(*) FROM transactions WHERE DATE(createdAt) = CURRENT_DATE", nativeQuery = true)
    long countToday();





    @Query("SELECT SUM(t.montant) FROM Transaction t")
    Double sumTotalAmount();

}