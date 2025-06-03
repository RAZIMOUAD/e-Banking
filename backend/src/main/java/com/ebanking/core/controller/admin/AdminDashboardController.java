package com.ebanking.core.controller.admin;

import com.ebanking.core.dto.dashboard.DashboardStatsResponse;
import com.ebanking.core.service.dashboard.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/admin/dashboard")
@RequiredArgsConstructor
//@PreAuthorize("hasRole('ADMIN')")
public class AdminDashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/stats")
    public ResponseEntity<DashboardStatsResponse> getDashboardStats() {
        return ResponseEntity.ok(dashboardService.getDashboardStats());
    }

    @GetMapping("/stats/{period}")
    public ResponseEntity<DashboardStatsResponse> getDashboardStatsByPeriod(
            @PathVariable String period
    ) {
        return ResponseEntity.ok(dashboardService.getDashboardStatsByPeriod(period));
    }

    @GetMapping("/recent-activity")
    public ResponseEntity<?> getRecentActivity() {
        return ResponseEntity.ok(dashboardService.getRecentActivity());
    }

    @GetMapping("/chart-data/transactions")
    public ResponseEntity<?> getTransactionChartData(
            @RequestParam(defaultValue = "month") String period
    ) {
        return ResponseEntity.ok(dashboardService.getTransactionChartData(period));
    }

    @GetMapping("/chart-data/currencies")
    public ResponseEntity<?> getCurrencyDistributionData() {
        return ResponseEntity.ok(dashboardService.getCurrencyDistributionData());
    }
}