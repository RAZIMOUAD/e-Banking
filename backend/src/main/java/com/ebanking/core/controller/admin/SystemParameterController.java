package com.ebanking.core.controller.admin;

import com.ebanking.core.dto.system.SystemParameterRequest;
import com.ebanking.core.dto.system.SystemParameterResponse;
import com.ebanking.core.service.system.SystemParameterService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/v1/admin/system-parameters")
@RequiredArgsConstructor
//@PreAuthorize("hasRole('ADMIN')")
public class SystemParameterController {

    private final SystemParameterService systemParameterService;

    @GetMapping
    public ResponseEntity<List<SystemParameterResponse>> getAllParameters() {
        return ResponseEntity.ok(systemParameterService.findAll());
    }

    @GetMapping("/{key}")
    public ResponseEntity<SystemParameterResponse> getParameterByKey(@PathVariable String key) {
        return ResponseEntity.ok(systemParameterService.findByKey(key));
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<List<SystemParameterResponse>> getParametersByCategory(@PathVariable String category) {
        return ResponseEntity.ok(systemParameterService.findByCategory(category));
    }

    @PostMapping
    public ResponseEntity<SystemParameterResponse> createParameter(@Valid @RequestBody SystemParameterRequest request) {
        return ResponseEntity.ok(systemParameterService.create(request));
    }

    @PutMapping("/{key}")
    public ResponseEntity<SystemParameterResponse> updateParameter(
            @PathVariable String key,
            @Valid @RequestBody SystemParameterRequest request
    ) {
        return ResponseEntity.ok(systemParameterService.update(key, request));
    }

    @DeleteMapping("/{key}")
    public ResponseEntity<Void> deleteParameter(@PathVariable String key) {
        systemParameterService.delete(key);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/batch-update")
    public ResponseEntity<List<SystemParameterResponse>> batchUpdateParameters(
            @Valid @RequestBody List<SystemParameterRequest> requests
    ) {
        return ResponseEntity.ok(systemParameterService.batchUpdate(requests));
    }

    @PostMapping("/reset-defaults")
    public ResponseEntity<List<SystemParameterResponse>> resetToDefaults() {
        return ResponseEntity.ok(systemParameterService.resetToDefaults());
    }

    @GetMapping("/categories")
    public ResponseEntity<List<String>> getAllCategories() {
        return ResponseEntity.ok(systemParameterService.getAllCategories());
    }

    @PostMapping("/export")
    public ResponseEntity<?> exportParameters(@RequestParam(defaultValue = "json") String format) {
        return ResponseEntity.ok(systemParameterService.exportParameters(format));
    }

    @PostMapping("/import")
    public ResponseEntity<List<SystemParameterResponse>> importParameters(
            @RequestBody List<SystemParameterRequest> parameters
    ) {
        return ResponseEntity.ok(systemParameterService.importParameters(parameters));
    }
}