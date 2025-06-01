package com.ebanking.core.controller.admin;

import com.ebanking.core.dto.stats.StatsResponse;
import com.ebanking.core.service.stats.StatsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/admin")
@RequiredArgsConstructor
//@PreAuthorize("hasRole('ADMIN')")

public class StatsController {

    private final StatsService statsService;

    @GetMapping("/stats")
    public ResponseEntity<StatsResponse> getStats() {
        return ResponseEntity.ok(statsService.getStats());
    }
}
