package com.ebanking.core.service.dashboard;

import com.ebanking.core.dto.dashboard.DashboardStatsResponse;
import com.ebanking.core.repository.sql.UserRepository;
import com.ebanking.core.repository.sql.TransactionRepository;
import com.ebanking.core.domain.base.enums.RoleType;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.TextStyle;
import java.util.*;
import java.util.stream.IntStream;

@Service
@RequiredArgsConstructor
@Slf4j
public class DashboardService {

    private final UserRepository userRepository;
    private final TransactionRepository transactionRepository;

    public DashboardStatsResponse getDashboardStats() {
        return getDashboardStatsByPeriod("month");
    }

    public DashboardStatsResponse getDashboardStatsByPeriod(String period) {
        log.info("Generating dashboard stats for period: {}", period);

        // Récupération des données réelles de la base
        long totalUsers = userRepository.count();
        int totalAgents = userRepository.countByRole(RoleType.AGENT);
        int totalClients = userRepository.countByRole(RoleType.CLIENT);
        long totalTransactions = transactionRepository.count();
        Double totalRevenue = transactionRepository.sumTotalAmount();

        return DashboardStatsResponse.builder()
                .totalUsers(totalUsers)
                .totalAgents((long) totalAgents)
                .activeAgents((long) Math.max(totalAgents - 2, 0)) // simulation agents actifs
                .totalTransactions(totalTransactions)
                .totalRevenue(totalRevenue != null ? BigDecimal.valueOf(totalRevenue) : BigDecimal.ZERO)
                .userGrowthRate(12.5)
                .transactionsGrowthRate(8.3)
                .revenueGrowthRate(-2.7)
                .agentGrowthRate(5.4)
                .transactionsByMonth(generateTransactionsByMonth())
                .currencyDistribution(generateCurrencyDistribution())
                .recentTransactions(generateRecentTransactions())
                .recentAgentActivity(generateRecentAgentActivity())
                .period(period)
                .lastUpdated(LocalDateTime.now())
                .build();
    }

    public Object getRecentActivity() {
        Map<String, Object> activity = new HashMap<>();
        activity.put("transactions", generateRecentTransactions());
        activity.put("agentActivity", generateRecentAgentActivity());
        return activity;
    }

    public Object getTransactionChartData(String period) {
        Map<String, Object> chartData = new HashMap<>();
        chartData.put("labels", getLabelsForPeriod(period));
        chartData.put("datasets", List.of(
                Map.of(
                        "label", "Transactions",
                        "data", generateDataForPeriod(period),
                        "backgroundColor", "rgba(59, 130, 246, 0.2)",
                        "borderColor", "#3b82f6"
                )
        ));
        return chartData;
    }

    public Object getCurrencyDistributionData() {
        Map<String, Object> chartData = new HashMap<>();
        Map<String, Integer> distribution = generateCurrencyDistribution();
        chartData.put("labels", new ArrayList<>(distribution.keySet()));
        chartData.put("datasets", List.of(
                Map.of(
                        "data", new ArrayList<>(distribution.values()),
                        "backgroundColor", List.of("#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ef4444")
                )
        ));
        return chartData;
    }

    // Méthodes privées pour générer des données mock
    private Map<String, Integer> generateTransactionsByMonth() {
        Map<String, Integer> data = new LinkedHashMap<>();
        String[] months = {"Jan", "Feb", "Mar", "Apr", "May", "Jun",
                "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"};

        Random random = new Random();
        for (String month : months) {
            data.put(month, 1000 + random.nextInt(7000));
        }
        return data;
    }

    private Map<String, Integer> generateCurrencyDistribution() {
        Map<String, Integer> data = new LinkedHashMap<>();
        data.put("USD", 45);
        data.put("EUR", 25);
        data.put("GBP", 15);
        data.put("JPY", 10);
        data.put("CAD", 5);
        return data;
    }

    private List<DashboardStatsResponse.RecentTransactionDto> generateRecentTransactions() {
        List<DashboardStatsResponse.RecentTransactionDto> transactions = new ArrayList<>();

        transactions.add(DashboardStatsResponse.RecentTransactionDto.builder()
                .id(1L)
                .type("Deposit")
                .amount(new BigDecimal("1200.00"))
                .currency("USD")
                .date(LocalDateTime.now())
                .status("Completed")
                .fromAccount("External")
                .toAccount("AC001234")
                .build());

        transactions.add(DashboardStatsResponse.RecentTransactionDto.builder()
                .id(2L)
                .type("Withdrawal")
                .amount(new BigDecimal("800.00"))
                .currency("EUR")
                .date(LocalDateTime.now().minusHours(1))
                .status("Completed")
                .fromAccount("AC005678")
                .toAccount("External")
                .build());

        transactions.add(DashboardStatsResponse.RecentTransactionDto.builder()
                .id(3L)
                .type("Transfer")
                .amount(new BigDecimal("2500.00"))
                .currency("USD")
                .date(LocalDateTime.now().minusHours(2))
                .status("Pending")
                .fromAccount("AC001234")
                .toAccount("AC009876")
                .build());

        return transactions;
    }

    private List<DashboardStatsResponse.RecentAgentActivityDto> generateRecentAgentActivity() {
        List<DashboardStatsResponse.RecentAgentActivityDto> activities = new ArrayList<>();

        activities.add(DashboardStatsResponse.RecentAgentActivityDto.builder()
                .id(1L)
                .name("John Doe")
                .action("Created new client account")
                .date(LocalDateTime.now())
                .details("Account AC012345 created for client Marie Dubois")
                .ipAddress("192.168.1.105")
                .build());

        activities.add(DashboardStatsResponse.RecentAgentActivityDto.builder()
                .id(2L)
                .name("Jane Smith")
                .action("Processed withdrawal request")
                .date(LocalDateTime.now().minusHours(1))
                .details("Withdrawal of 500 EUR from account AC005678")
                .ipAddress("192.168.1.110")
                .build());

        activities.add(DashboardStatsResponse.RecentAgentActivityDto.builder()
                .id(3L)
                .name("Robert Johnson")
                .action("Updated client information")
                .date(LocalDateTime.now().minusHours(2))
                .details("Updated contact information for client AC009876")
                .ipAddress("192.168.1.115")
                .build());

        return activities;
    }

    private List<String> getLabelsForPeriod(String period) {
        switch (period.toLowerCase()) {
            case "week":
                return List.of("Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun");
            case "month":
                return IntStream.rangeClosed(1, 30)
                        .mapToObj(String::valueOf)
                        .toList();
            case "year":
                return List.of("Jan", "Feb", "Mar", "Apr", "May", "Jun",
                        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec");
            default:
                return List.of("Today");
        }
    }

    private List<Integer> generateDataForPeriod(String period) {
        Random random = new Random();
        int size = getLabelsForPeriod(period).size();
        return IntStream.range(0, size)
                .map(i -> 50 + random.nextInt(200))
                .boxed()
                .toList();
    }
}