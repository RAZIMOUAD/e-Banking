package com.ebanking.core.model.nosql;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.math.BigDecimal;
import java.util.Date;

@Document(collection = "crypto_transactions")
public class CryptoTransaction {

    @Id
    private String id;

    private String transactionHash;

    private Long userId;

    private String walletId;

    private String cryptoSymbol;

    private BigDecimal amount;

    private BigDecimal feeAmount;

    private String feeSymbol;

    private TransactionType transactionType;

    private String toAddress;

    private String fromAddress;

    private Date timestamp;

    private TransactionStatus status;

    private String blockNumber;

    private Integer confirmations;

    private BigDecimal priceAtTransaction;

    private String currencyCode;

    public enum TransactionType {
        DEPOSIT, WITHDRAWAL, EXCHANGE, PURCHASE, SALE
    }

    public enum TransactionStatus {
        PENDING, CONFIRMED, FAILED, CANCELLED
    }

    // Constructeurs
    public CryptoTransaction() {
        this.timestamp = new Date();
        this.status = TransactionStatus.PENDING;
        this.confirmations = 0;
    }

    public CryptoTransaction(Long userId, String walletId, String cryptoSymbol, BigDecimal amount,
                             TransactionType transactionType, String toAddress, String fromAddress) {
        this();
        this.userId = userId;
        this.walletId = walletId;
        this.cryptoSymbol = cryptoSymbol;
        this.amount = amount;
        this.transactionType = transactionType;
        this.toAddress = toAddress;
        this.fromAddress = fromAddress;
    }

    // Getters et Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getTransactionHash() {
        return transactionHash;
    }

    public void setTransactionHash(String transactionHash) {
        this.transactionHash = transactionHash;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getWalletId() {
        return walletId;
    }

    public void setWalletId(String walletId) {
        this.walletId = walletId;
    }

    public String getCryptoSymbol() {
        return cryptoSymbol;
    }

    public void setCryptoSymbol(String cryptoSymbol) {
        this.cryptoSymbol = cryptoSymbol;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public BigDecimal getFeeAmount() {
        return feeAmount;
    }

    public void setFeeAmount(BigDecimal feeAmount) {
        this.feeAmount = feeAmount;
    }

    public String getFeeSymbol() {
        return feeSymbol;
    }

    public void setFeeSymbol(String feeSymbol) {
        this.feeSymbol = feeSymbol;
    }

    public TransactionType getTransactionType() {
        return transactionType;
    }

    public void setTransactionType(TransactionType transactionType) {
        this.transactionType = transactionType;
    }

    public String getToAddress() {
        return toAddress;
    }

    public void setToAddress(String toAddress) {
        this.toAddress = toAddress;
    }

    public String getFromAddress() {
        return fromAddress;
    }

    public void setFromAddress(String fromAddress) {
        this.fromAddress = fromAddress;
    }

    public Date getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(Date timestamp) {
        this.timestamp = timestamp;
    }

    public TransactionStatus getStatus() {
        return status;
    }

    public void setStatus(TransactionStatus status) {
        this.status = status;
    }

    public String getBlockNumber() {
        return blockNumber;
    }

    public void setBlockNumber(String blockNumber) {
        this.blockNumber = blockNumber;
    }

    public Integer getConfirmations() {
        return confirmations;
    }

    public void setConfirmations(Integer confirmations) {
        this.confirmations = confirmations;
    }

    public BigDecimal getPriceAtTransaction() {
        return priceAtTransaction;
    }

    public void setPriceAtTransaction(BigDecimal priceAtTransaction) {
        this.priceAtTransaction = priceAtTransaction;
    }

    public String getCurrencyCode() {
        return currencyCode;
    }

    public void setCurrencyCode(String currencyCode) {
        this.currencyCode = currencyCode;
    }

    @Override
    public String toString() {
        return "CryptoTransaction{" +
                "id='" + id + '\'' +
                ", transactionHash='" + transactionHash + '\'' +
                ", userId=" + userId +
                ", cryptoSymbol='" + cryptoSymbol + '\'' +
                ", amount=" + amount +
                ", transactionType=" + transactionType +
                ", status=" + status +
                ", timestamp=" + timestamp +
                '}';
    }
}