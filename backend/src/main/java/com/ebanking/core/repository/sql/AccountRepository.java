package com.ebanking.core.repository.sql;

/*
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
}*/