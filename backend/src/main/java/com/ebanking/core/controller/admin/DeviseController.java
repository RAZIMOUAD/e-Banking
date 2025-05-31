package com.ebanking.core.controller.admin;



import com.ebanking.core.dto.devise.DeviseRequest;
import com.ebanking.core.dto.devise.DeviseResponse;
import com.ebanking.core.service.devise.DeviseService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin/devises")
@RequiredArgsConstructor
//@PreAuthorize("hasRole('ADMIN')")
public class DeviseController {

    private final DeviseService deviseService;

    @GetMapping
    public ResponseEntity<List<DeviseResponse>> getAll() {
        return ResponseEntity.ok(deviseService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<DeviseResponse> getOne(@PathVariable Long id) {
        return ResponseEntity.ok(deviseService.findById(id));
    }

    @PostMapping
    public ResponseEntity<DeviseResponse> create(@RequestBody DeviseRequest request) {
        return ResponseEntity.ok(deviseService.save(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<DeviseResponse> update(@PathVariable Long id, @RequestBody DeviseRequest request) {
        return ResponseEntity.ok(deviseService.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        deviseService.delete(id);
        return ResponseEntity.noContent().build();
    }
}