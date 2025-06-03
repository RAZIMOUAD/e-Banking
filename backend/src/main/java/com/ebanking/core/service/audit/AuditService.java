package com.ebanking.core.service.audit;

import com.ebanking.core.dto.audit.AuditLogResponse;
import com.ebanking.core.dto.audit.AuditSearchRequest;
import com.ebanking.core.dto.audit.AuditStatsResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuditService {

    // TODO: Injecter AuditLogRepository quand il sera créé
    // private final AuditLogRepository auditLogRepository;

    public Page<AuditLogResponse> findAll(Pageable pageable) {
        log.info("Fetching all audit logs with pagination: {}", pageable);

        List<AuditLogResponse> mockData = generateMockAuditLogs();

        int start = (int) pageable.getOffset();
        int end = Math.min((start + pageable.getPageSize()), mockData.size());
        List<AuditLogResponse> pageContent = mockData.subList(start, end);

        return new PageImpl<>(pageContent, pageable, mockData.size());
    }

    public Page<AuditLogResponse> searchAuditLogs(AuditSearchRequest searchRequest, Pageable pageable) {
        log.info("Searching audit logs with criteria: {}", searchRequest);

        List<AuditLogResponse> allLogs = generateMockAuditLogs();
        List<AuditLogResponse> filteredLogs = allLogs.stream()
                .filter(log -> matchesSearchCriteria(log, searchRequest))
                .collect(Collectors.toList());

        int start = (int) pageable.getOffset();
        int end = Math.min((start + pageable.getPageSize()), filteredLogs.size());
        List<AuditLogResponse> pageContent = filteredLogs.subList(start, end);

        return new PageImpl<>(pageContent, pageable, filteredLogs.size());
    }

    public AuditLogResponse findById(Long id) {
        log.info("Fetching audit log by id: {}", id);

        return generateMockAuditLogs().stream()
                .filter(log -> log.getId().equals(id))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Audit log not found with id: " + id));
    }

    public List<AuditLogResponse> findByUserId(Long userId, Pageable pageable) {
        log.info("Fetching audit logs for user: {}", userId);

        return generateMockAuditLogs().stream()
                .filter(log -> log.getUserId().equals(userId))
                .collect(Collectors.toList());
    }

    public List<AuditLogResponse> findByAction(String action, Pageable pageable) {
        log.info("Fetching audit logs for action: {}", action);

        return generateMockAuditLogs().stream()
                .filter(log -> log.getAction().equalsIgnoreCase(action))
                .collect(Collectors.toList());
    }

    public List<AuditLogResponse> findByEntity(String entity, Pageable pageable) {
        log.info("Fetching audit logs for entity: {}", entity);

        return generateMockAuditLogs().stream()
                .filter(log -> log.getEntity().equalsIgnoreCase(entity))
                .collect(Collectors.toList());
    }

    public List<AuditLogResponse> findByDateRange(LocalDate startDate, LocalDate endDate, Pageable pageable) {
        log.info("Fetching audit logs between {} and {}", startDate, endDate);

        return generateMockAuditLogs().stream()
                .filter(log -> {
                    LocalDate logDate = log.getTimestamp().toLocalDate();
                    return !logDate.isBefore(startDate) && !logDate.isAfter(endDate);
                })
                .collect(Collectors.toList());
    }

    public Object exportAuditLogs(LocalDate startDate, LocalDate endDate, String format) {
        log.info("Exporting audit logs from {} to {} in format: {}", startDate, endDate, format);

        Map<String, Object> exportResult = new HashMap<>();
        exportResult.put("message", "Export functionality will be implemented");
        exportResult.put("format", format);
        exportResult.put("startDate", startDate);
        exportResult.put("endDate", endDate);

        return exportResult;
    }

    public AuditStatsResponse getAuditStats() {
        log.info("Generating audit statistics");

        List<AuditLogResponse> allLogs = generateMockAuditLogs();

        Map<String, Long> actionCounts = allLogs.stream()
                .collect(Collectors.groupingBy(AuditLogResponse::getAction, Collectors.counting()));

        Map<String, Long> entityCounts = allLogs.stream()
                .collect(Collectors.groupingBy(AuditLogResponse::getEntity, Collectors.counting()));

        Map<String, Long> statusCounts = allLogs.stream()
                .collect(Collectors.groupingBy(AuditLogResponse::getStatus, Collectors.counting()));

        long failedActionsCount = allLogs.stream()
                .mapToLong(log -> "FAILURE".equals(log.getStatus()) ? 1 : 0)
                .sum();

        double successRate = allLogs.isEmpty() ? 0.0 :
                (double) (allLogs.size() - failedActionsCount) / allLogs.size() * 100;

        return AuditStatsResponse.builder()
                .totalLogs((long) allLogs.size())
                .actionCounts(actionCounts)
                .entityCounts(entityCounts)
                .statusCounts(statusCounts)
                .dailyCounts(generateDailyCounts())
                .mostActiveUser(findMostActiveUser(allLogs))
                .mostCommonAction(findMostCommonAction(actionCounts))
                .failedActionsCount(failedActionsCount)
                .successRate(successRate)
                .build();
    }

    // Méthodes privées pour générer des données mock
    private List<AuditLogResponse> generateMockAuditLogs() {
        List<AuditLogResponse> logs = new ArrayList<>();

        logs.add(AuditLogResponse.builder()
                .id(1L)
                .action("CREATE")
                .entity("AGENT")
                .entityId(15L)
                .userId(1L)
                .userName("Admin User")
                .userRole("ADMIN")
                .timestamp(LocalDateTime.now())
                .details("Created new agent account for John Doe")
                .ipAddress("192.168.1.105")
                .status("SUCCESS")
                .userAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64)")
                .sessionId("session_123")
                .build());

        logs.add(AuditLogResponse.builder()
                .id(2L)
                .action("LOGIN")
                .entity("USER")
                .entityId(1L)
                .userId(1L)
                .userName("Admin User")
                .userRole("ADMIN")
                .timestamp(LocalDateTime.now().minusHours(1))
                .details("Admin login from dashboard")
                .ipAddress("192.168.1.105")
                .status("SUCCESS")
                .userAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64)")
                .sessionId("session_123")
                .build());

        logs.add(AuditLogResponse.builder()
                .id(3L)
                .action("UPDATE")
                .entity("DEVISE")
                .entityId(2L)
                .userId(1L)
                .userName("Admin User")
                .userRole("ADMIN")
                .timestamp(LocalDateTime.now().minusHours(2))
                .details("Updated EUR exchange rate from 0.92 to 0.91")
                .ipAddress("192.168.1.105")
                .status("SUCCESS")
                .userAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64)")
                .sessionId("session_123")
                .build());

        logs.add(AuditLogResponse.builder()
                .id(4L)
                .action("DELETE")
                .entity("AGENT")
                .entityId(12L)
                .userId(1L)
                .userName("Admin User")
                .userRole("ADMIN")
                .timestamp(LocalDateTime.now().minusDays(1))
                .details("Deleted inactive agent account")
                .ipAddress("192.168.1.105")
                .status("SUCCESS")
                .userAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64)")
                .sessionId("session_124")
                .build());

        logs.add(AuditLogResponse.builder()
                .id(5L)
                .action("TRANSFER")
                .entity("TRANSACTION")
                .entityId(345L)
                .userId(5L)
                .userName("John Agent")
                .userRole("AGENT")
                .timestamp(LocalDateTime.now().minusDays(2))
                .details("Transfer of 5000 USD from account #12345 to account #67890")
                .ipAddress("192.168.1.110")
                .status("SUCCESS")
                .userAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64)")
                .sessionId("session_125")
                .build());

        logs.add(AuditLogResponse.builder()
                .id(6L)
                .action("LOGIN")
                .entity("USER")
                .entityId(5L)
                .userId(5L)
                .userName("John Agent")
                .userRole("AGENT")
                .timestamp(LocalDateTime.now().minusDays(2))
                .details("Failed login attempt")
                .ipAddress("192.168.1.110")
                .status("FAILURE")
                .userAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64)")
                .sessionId("session_126")
                .build());

        // Ajouter plus de logs pour la pagination
        for (int i = 7; i <= 50; i++) {
            logs.add(AuditLogResponse.builder()
                    .id((long) i)
                    .action(getRandomAction())
                    .entity(getRandomEntity())
                    .entityId((long) (i * 10))
                    .userId((long) (i % 5 + 1))
                    .userName("User " + (i % 5 + 1))
                    .userRole(getRandomRole())
                    .timestamp(LocalDateTime.now().minusDays(i % 30))
                    .details("Mock audit log entry " + i)
                    .ipAddress("192.168.1." + (100 + i % 20))
                    .status(i % 10 == 0 ? "FAILURE" : "SUCCESS")
                    .userAgent("Mozilla/5.0")
                    .sessionId("session_" + i)
                    .build());
        }

        return logs;
    }

    private boolean matchesSearchCriteria(AuditLogResponse log, AuditSearchRequest request) {
        if (request.getSearchTerm() != null && !request.getSearchTerm().isEmpty()) {
            String searchTerm = request.getSearchTerm().toLowerCase();
            if (!log.getUserName().toLowerCase().contains(searchTerm) &&
                    !log.getDetails().toLowerCase().contains(searchTerm) &&
                    !log.getIpAddress().contains(searchTerm)) {
                return false;
            }
        }

        if (request.getAction() != null && !request.getAction().equals("all") &&
                !log.getAction().equalsIgnoreCase(request.getAction())) {
            return false;
        }

        if (request.getEntity() != null && !request.getEntity().equals("all") &&
                !log.getEntity().equalsIgnoreCase(request.getEntity())) {
            return false;
        }

        if (request.getStatus() != null && !request.getStatus().equals("all") &&
                !log.getStatus().equalsIgnoreCase(request.getStatus())) {
            return false;
        }

        if (request.getUserId() != null && !log.getUserId().equals(request.getUserId())) {
            return false;
        }

        if (request.getStartDate() != null) {
            LocalDate logDate = log.getTimestamp().toLocalDate();
            if (logDate.isBefore(request.getStartDate())) {
                return false;
            }
        }

        if (request.getEndDate() != null) {
            LocalDate logDate = log.getTimestamp().toLocalDate();
            if (logDate.isAfter(request.getEndDate())) {
                return false;
            }
        }

        return true;
    }

    private Map<String, Long> generateDailyCounts() {
        Map<String, Long> dailyCounts = new LinkedHashMap<>();
        for (int i = 6; i >= 0; i--) {
            LocalDate date = LocalDate.now().minusDays(i);
            dailyCounts.put(date.toString(), (long) (10 + new Random().nextInt(40)));
        }
        return dailyCounts;
    }

    private String findMostActiveUser(List<AuditLogResponse> logs) {
        return logs.stream()
                .collect(Collectors.groupingBy(AuditLogResponse::getUserName, Collectors.counting()))
                .entrySet().stream()
                .max(Map.Entry.comparingByValue())
                .map(Map.Entry::getKey)
                .orElse("Unknown");
    }

    private String findMostCommonAction(Map<String, Long> actionCounts) {
        return actionCounts.entrySet().stream()
                .max(Map.Entry.comparingByValue())
                .map(Map.Entry::getKey)
                .orElse("Unknown");
    }

    private String getRandomAction() {
        String[] actions = {"CREATE", "READ", "UPDATE", "DELETE", "LOGIN", "LOGOUT", "TRANSFER", "DEPOSIT", "WITHDRAWAL"};
        return actions[new Random().nextInt(actions.length)];
    }

    private String getRandomEntity() {
        String[] entities = {"USER", "AGENT", "CLIENT", "ACCOUNT", "TRANSACTION", "DEVISE", "SYSTEM"};
        return entities[new Random().nextInt(entities.length)];
    }

    private String getRandomRole() {
        String[] roles = {"ADMIN", "AGENT", "CLIENT"};
        return roles[new Random().nextInt(roles.length)];
    }
}