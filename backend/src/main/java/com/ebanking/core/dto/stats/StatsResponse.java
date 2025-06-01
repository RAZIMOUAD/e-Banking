package com.ebanking.core.dto.stats;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class StatsResponse {
    private int totalClients;
    private int totalAgents;
    private int transactionsToday;
}
