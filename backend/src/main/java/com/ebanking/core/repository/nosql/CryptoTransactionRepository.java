package com.ebanking.core.repository.nosql;


import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;
import java.util.Optional;
/*
@Repository
public interface CryptoTransactionRepository extends MongoRepository<CryptoTransaction, String> {

    Optional<CryptoTransaction> findByTransactionHash(String transactionHash);

    List<CryptoTransaction> findByUserId(Long userId);

    List<CryptoTransaction> findByWalletId(String walletId);

    List<CryptoTransaction> findByCryptoSymbol(String cryptoSymbol);

    List<CryptoTransaction> findByTransactionType(CryptoTransaction.TransactionType transactionType);

    List<CryptoTransaction> findByStatus(CryptoTransaction.TransactionStatus status);

    List<CryptoTransaction> findByTimestampBetween(Date startDate, Date endDate);

    List<CryptoTransaction> findByAmountGreaterThan(BigDecimal amount);

    @Query("{ 'userId': ?0, 'timestamp': { $gte: ?1, $lte: ?2 } }")
    List<CryptoTransaction> findByUserIdAndDateRange(Long userId, Date startDate, Date endDate);

    @Query("{ 'walletId': ?0, 'transactionType': ?1 }")
    List<CryptoTransaction> findByWalletIdAndTransactionType(String walletId, CryptoTransaction.TransactionType type);

    @Query("{ 'status': 'PENDING', 'timestamp': { $lt: ?0 } }")
    List<CryptoTransaction> findStuckTransactions(Date olderThan);

    @Query(value = "{ 'userId': ?0 }", sort = "{ 'timestamp': -1 }")
    List<CryptoTransaction> findLatestTransactionsByUser(Long userId, Pageable pageable);

    @Query("{ 'cryptoSymbol': ?0, 'amount': { $gt: ?1 } }")
    List<CryptoTransaction> findLargeTransactionsByCrypto(String cryptoSymbol, BigDecimal minAmount);

    @Query(value = "{ 'status': 'CONFIRMED' }", count = true)
    long countConfirmedTransactions();
}*/