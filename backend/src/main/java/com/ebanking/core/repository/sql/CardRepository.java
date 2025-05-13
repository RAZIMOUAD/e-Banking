package com.ebanking.core.repository.sql;

import com.ebanking.core.model.sql.Account;
import com.ebanking.core.model.sql.Card;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Repository
public interface CardRepository extends JpaRepository<Card, Long> {

    List<Card> findByAccount(Account account);

    Optional<Card> findByCardNumber(String cardNumber);

    List<Card> findByCardStatus(Card.CardStatus status);

    List<Card> findByCardType(Card.CardType type);

    List<Card> findByExpiryDateBefore(Date date);

    List<Card> findByIsContactless(boolean isContactless);

    List<Card> findByIsVirtual(boolean isVirtual);

    @Query("SELECT c FROM Card c WHERE c.account.user.id = :userId")
    List<Card> findByUserId(@Param("userId") Long userId);

    @Query("SELECT c FROM Card c WHERE c.account.id = :accountId AND c.cardStatus = :status")
    List<Card> findByAccountIdAndStatus(
            @Param("accountId") Long accountId,
            @Param("status") Card.CardStatus status);

    @Query("SELECT COUNT(c) FROM Card c WHERE c.account.user.id = :userId AND c.cardStatus = 'ACTIVE'")
    long countActiveCardsByUserId(@Param("userId") Long userId);

    @Query("SELECT c FROM Card c WHERE c.expiryDate BETWEEN :startDate AND :endDate")
    List<Card> findCardsExpiringBetween(
            @Param("startDate") Date startDate,
            @Param("endDate") Date endDate);
}