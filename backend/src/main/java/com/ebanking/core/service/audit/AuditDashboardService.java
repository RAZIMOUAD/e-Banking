// AuditDashboardService.java
package com.ebanking.core.service.audit;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuditDashboardService {

    private final AuditService auditService;

    public Map<String, Object> getDashboardAuditStats() {
        log.info("Generating audit stats for dashboard");

        Map<String, Object> stats = new HashMap<>();

        // Statistiques de base
        stats.put("totalAuditLogs", 245L);
        stats.put("todayLogs", 12L);
        stats.put("failedActionsToday", 2L);
        stats.put("mostActiveUser", "Admin User");

        // Activité par heure (dernières 24h)
        stats.put("hourlyActivity", generateHourlyActivity());

        // Top actions
        stats.put("topActions", generateTopActions());

        // Alertes de sécurité
        stats.put("securityAlerts", generateSecurityAlerts());

        return stats;
    }

    public List<Map<String, Object>> getRecentSecurityEvents() {
        List<Map<String, Object>> events = new ArrayList<>();

        events.add(Map.of(
                "id", 1L,
                "type", "FAILED_LOGIN",
                "user", "unknown",
                "ip", "192.168.1.120",
                "timestamp", LocalDateTime.now().minusMinutes(15),
                "severity", "MEDIUM"
        ));

        events.add(Map.of(
                "id", 2L,
                "type", "UNUSUAL_ACTIVITY",
                "user", "john.agent",
                "ip", "192.168.1.110",
                "timestamp", LocalDateTime.now().minusHours(2),
                "severity", "LOW"
        ));

        return events;
    }

    private Map<String, Integer> generateHourlyActivity() {
        Map<String, Integer> hourlyData = new LinkedHashMap<>();
        Random random = new Random();

        for (int i = 23; i >= 0; i--) {
            String hour = String.format("%02d:00", (24 - i) % 24);
            hourlyData.put(hour, random.nextInt(20));
        }

        return hourlyData;
    }

    private List<Map<String, Object>> generateTopActions() {
        return List.of(
                Map.of("action", "LOGIN", "count", 45),
                Map.of("action", "CREATE", "count", 23),
                Map.of("action", "UPDATE", "count", 18),
                Map.of("action", "DELETE", "count", 5),
                Map.of("action", "TRANSFER", "count", 12)
        );
    }

    private List<Map<String, Object>> generateSecurityAlerts() {
        return List.of(
                Map.of(
                        "type", "Multiple failed login attempts",
                        "count", 3,
                        "severity", "HIGH",
                        "lastOccurrence", LocalDateTime.now().minusMinutes(10)
                ),
                Map.of(
                        "type", "Unusual IP access",
                        "count", 1,
                        "severity", "MEDIUM",
                        "lastOccurrence", LocalDateTime.now().minusHours(1)
                )
        );
    }
}