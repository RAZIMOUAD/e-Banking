package com.ebanking.core.dto.audit;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuditStatsResponse {
    private Long totalLogs;
    private Map<String, Long> actionCounts;
    private Map<String, Long> entityCounts;
    private Map<String, Long> statusCounts;
    private Map<String, Long> dailyCounts;
    private String mostActiveUser;
    private String mostCommonAction;
    private Long failedActionsCount;
    private Double successRate;
}
