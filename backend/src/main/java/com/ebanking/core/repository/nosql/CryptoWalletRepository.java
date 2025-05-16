package com.ebanking.core.repository.nosql;

import com.ebanking.core.model.nosql.CryptoWallet;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;
import java.util.Optional;
/*
@Repository
public interface CryptoWalletRepository extends MongoRepository<CryptoWallet, String> {

    List<CryptoWallet> findByUserId(Long userId);

    Optional<CryptoWallet> findByWalletAddress(String walletAddress);

    List<CryptoWallet> findByWalletType(String walletType);

    List<CryptoWallet> findByIsActive(boolean isActive);

    List<CryptoWallet> findByUserIdAndIsActive(Long userId, boolean isActive);

    @Query("{ 'userId': ?0, 'balances.?1': { $exists: true } }")
    List<CryptoWallet> findWalletsWithCrypto(Long userId, String cryptoSymbol);

    @Query("{ 'balances.?0': { $gt: ?1 } }")
    List<CryptoWallet> findWalletsWithMinimumBalance(String cryptoSymbol, BigDecimal minBalance);

    @Query("{ 'createdAt': { $gte: ?0 } }")
    List<CryptoWallet> findWalletsCreatedAfter(Date date);

    @Query(value = "{ 'userId': ?0 }", sort = "{ 'createdAt': -1 }")
    List<CryptoWallet> findLatestWalletsByUser(Long userId);

    @Query(value = "{ 'isActive': true }", count = true)
    long countActiveWallets();

    @Query("{ 'balances': { $exists: true, $not: { $size: 0 } } }")
    List<CryptoWallet> findWalletsWithBalances();
}*/