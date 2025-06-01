package com.ebanking.core.controller.admin;

import com.ebanking.core.dto.agent.AgentRequest;
import com.ebanking.core.dto.agent.AgentResponse;
import com.ebanking.core.service.agent.AgentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin/agents")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AgentController {

    private final AgentService agentService;

    @GetMapping
    public ResponseEntity<List<AgentResponse>> getAll() {
        return ResponseEntity.ok(agentService.findAll());
    }

    @PostMapping
    public ResponseEntity<AgentResponse> create(@RequestBody AgentRequest request) {
        return ResponseEntity.ok(agentService.create(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<AgentResponse> update(@PathVariable Long id, @RequestBody AgentRequest request) {
        return ResponseEntity.ok(agentService.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        agentService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
