package com.ebanking.core.dto.dashboard;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardStatsResponse {

    // Métriques principales
    private Long totalUsers;
    private Long totalAgents;
    private Long activeAgents;
    private Long totalTransactions;
    private BigDecimal totalRevenue;

    // Taux de croissance
    private Double userGrowthRate;
    private Double transactionsGrowthRate;
    private Double revenueGrowthRate;
    private Double agentGrowthRate;

    // Données graphiques
    private Map<String, Integer> transactionsByMonth;
    private Map<String, Integer> currencyDistribution;

    // Activités récentes
    private List<RecentTransactionDto> recentTransactions;
    private List<RecentAgentActivityDto> recentAgentActivity;

    // Métadonnées
    private String period;
    private LocalDateTime lastUpdated;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RecentTransactionDto {
        private Long id;
        private String type;
        private BigDecimal amount;
        private String currency;
        private LocalDateTime date;
        private String status;
        private String fromAccount;
        private String toAccount;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RecentAgentActivityDto {
        private Long id;
        private String name;
        private String action;
        private LocalDateTime date;
        private String details;
        private String ipAddress;
    }
}