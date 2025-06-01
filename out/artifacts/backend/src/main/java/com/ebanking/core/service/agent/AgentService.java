package com.ebanking.core.service.agent;

import com.ebanking.core.dto.agent.AgentRequest;
import com.ebanking.core.dto.agent.AgentResponse;

import java.util.List;

public interface AgentService {
    List<AgentResponse> findAll();
    AgentResponse create(AgentRequest request);
    AgentResponse update(Long id, AgentRequest request);
    void delete(Long id);
}

