package com.ebanking.core.controller.globalsettings;

import com.ebanking.core.dto.globalsettings.GlobalSettingsRequest;
import com.ebanking.core.dto.globalsettings.GlobalSettingsResponse;
import com.ebanking.core.service.globalsettings.GlobalSettingsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/admin/settings")
@RequiredArgsConstructor
//@PreAuthorize("hasRole('ADMIN')")
public class GlobalSettingsController {

    private final GlobalSettingsService settingsService;

    @GetMapping
    public ResponseEntity<GlobalSettingsResponse> getSettings() {
        return ResponseEntity.ok(settingsService.get());
    }

    @PutMapping
    public ResponseEntity<GlobalSettingsResponse> updateSettings(
            @RequestBody GlobalSettingsRequest request
    ) {
        return ResponseEntity.ok(settingsService.update(request));
    }
}
