package com.ebanking.core.repository.sql;

import com.ebanking.core.model.sql.Account;
import com.ebanking.core.model.sql.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface AccountRepository extends JpaRepository<Account, Long> {

    List<Account> findByUser(User user);

    Optional<Account> findByAccountNumber(String accountNumber);

    List<Account> findByUserAndIsActive(User user, boolean isActive);

    List<Account> findByAccountType(Account.AccountType accountType);

    List<Account> findByBalanceGreaterThan(BigDecimal minBalance);

    @Query("SELECT a FROM Account a WHERE a.user.id = :userId")
    List<Account> findByUserId(@Param("userId") Long userId);

    @Query("SELECT a FROM Account a WHERE a.balance < :threshold AND a.isActive = true")
    List<Account> findLowBalanceAccounts(@Param("threshold") BigDecimal threshold);

    @Query("SELECT SUM(a.balance) FROM Account a WHERE a.accountType = :type")
    BigDecimal getTotalBalanceByType(@Param("type") Account.AccountType type);

    @Query("SELECT COUNT(a) FROM Account a WHERE a.user.id = :userId AND a.isActive = true")
    long countActiveAccountsByUserId(@Param("userId") Long userId);
}