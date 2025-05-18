package com.ebanking.core.model.nosql;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.math.BigDecimal;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
/*
@Document(collection = "crypto_wallets")
public class CryptoWallet {
/*
    @Id
    private String id;

    private Long userId;

    private String walletAddress;

    private String walletType;

    private Date createdAt;

    private Date updatedAt;

    private boolean isActive;

    // Stockage des soldes par cryptomonnaie
    private Map<String, BigDecimal> balances = new HashMap<>();

    // Clé publique du wallet (pour certains types de wallets)
    private String publicKey;

    // Données chiffrées contenant des informations sensibles (clés privées chiffrées, etc.)
    private String encryptedData;

    // Constructeurs
    public CryptoWallet() {
        this.createdAt = new Date();
        this.updatedAt = new Date();
        this.isActive = true;
    }

    public CryptoWallet(Long userId, String walletAddress, String walletType) {
        this();
        this.userId = userId;
        this.walletAddress = walletAddress;
        this.walletType = walletType;
    }

    // Méthodes pour gérer les soldes
    public void addBalance(String cryptoSymbol, BigDecimal amount) {
        BigDecimal currentBalance = balances.getOrDefault(cryptoSymbol, BigDecimal.ZERO);
        balances.put(cryptoSymbol, currentBalance.add(amount));
        this.updatedAt = new Date();
    }

    public void subtractBalance(String cryptoSymbol, BigDecimal amount) {
        BigDecimal currentBalance = balances.getOrDefault(cryptoSymbol, BigDecimal.ZERO);
        if (currentBalance.compareTo(amount) < 0) {
            throw new IllegalArgumentException("Insufficient funds for " + cryptoSymbol);
        }
        balances.put(cryptoSymbol, currentBalance.subtract(amount));
        this.updatedAt = new Date();
    }

    public BigDecimal getBalance(String cryptoSymbol) {
        return balances.getOrDefault(cryptoSymbol, BigDecimal.ZERO);
    }

    // Getters et Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getWalletAddress() {
        return walletAddress;
    }

    public void setWalletAddress(String walletAddress) {
        this.walletAddress = walletAddress;
    }

    public String getWalletType() {
        return walletType;
    }

    public void setWalletType(String walletType) {
        this.walletType = walletType;
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }

    public Date getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Date updatedAt) {
        this.updatedAt = updatedAt;
    }

    public boolean isActive() {
        return isActive;
    }

    public void setActive(boolean active) {
        isActive = active;
    }

    public Map<String, BigDecimal> getBalances() {
        return balances;
    }

    public void setBalances(Map<String, BigDecimal> balances) {
        this.balances = balances;
    }

    public String getPublicKey() {
        return publicKey;
    }

    public void setPublicKey(String publicKey) {
        this.publicKey = publicKey;
    }

    public String getEncryptedData() {
        return encryptedData;
    }

    public void setEncryptedData(String encryptedData) {
        this.encryptedData = encryptedData;
    }

    @Override
    public String toString() {
        return "CryptoWallet{" +
                "id='" + id + '\'' +
                ", userId=" + userId +
                ", walletAddress='" + walletAddress + '\'' +
                ", walletType='" + walletType + '\'' +
                ", isActive=" + isActive +
                ", balances=" + balances.size() + " cryptocurrencies" +
                '}';
    }
}*/