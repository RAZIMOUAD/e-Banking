package com.ebanking.core.dto.globalsettings;

import lombok.*;

import java.util.Date;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GlobalSettingsRequest {
    // Paramètres système
    private String defaultCurrency;
    private Double transactionFeePercentage;
    private Double minimumTransactionFee;
    private Double maximumTransactionFee;
    private Double dailyTransactionLimit;
    private Boolean maintenanceMode;
    private String supportEmail;
    private String supportPhone;
    private Date termsLastUpdated;

    // Paramètres de sécurité
    private Integer passwordExpiryDays;
    private Integer maxLoginAttempts;
    private Integer lockoutDurationMinutes;
    private Boolean requireTwoFactor;
    private Integer sessionTimeoutMinutes;
    private String allowedIpAddresses;

    // Paramètres de notification
    private Boolean enableEmailNotifications;
    private Boolean enableSmsNotifications;
    private Boolean enablePushNotifications;
    private Boolean transactionNotifications;
    private Boolean loginNotifications;
    private Boolean marketingNotifications;
    private Boolean systemNotifications;

    // Anciens paramètres pour compatibilité
    private Double tauxCommission;
    private Double plafondVirement;
    private Double fraisFixes;
}