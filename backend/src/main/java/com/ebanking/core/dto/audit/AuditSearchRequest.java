package com.ebanking.core.dto.audit;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuditSearchRequest {
    private String searchTerm;
    private String action;
    private String entity;
    private String userRole;
    private String status;
    private Long userId;
    private LocalDate startDate;
    private LocalDate endDate;
    private String ipAddress;
}

