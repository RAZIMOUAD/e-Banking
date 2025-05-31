package com.ebanking.core.service.agent;

import com.ebanking.core.domain.base.agent.Agent;
import com.ebanking.core.dto.agent.AgentRequest;
import com.ebanking.core.dto.agent.AgentResponse;
import com.ebanking.core.repository.sql.AgentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AgentServiceImpl implements AgentService {

    private final AgentRepository agentRepository;

    @Override
    public List<AgentResponse> findAll() {
        return agentRepository.findAll().stream()
                .map(this::toDto)
                .toList();
    }

    @Override
    public AgentResponse create(AgentRequest request) {
        Agent agent = toEntity(request);
        return toDto(agentRepository.save(agent));
    }

    @Override
    public AgentResponse update(Long id, AgentRequest request) {
        Agent agent = agentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Agent introuvable"));

        agent.setNom(request.getNom());
        agent.setPrenom(request.getPrenom());
        agent.setCin(request.getCin());
        agent.setNumTel(request.getNumTel());
        agent.setAdresse(request.getAdresse());
        agent.setService(request.getService());
        agent.setMatricule(request.getMatricule());
        agent.setDateEmbauche(request.getDateEmbauche());

        return toDto(agentRepository.save(agent));
    }

    @Override
    public void delete(Long id) {
        agentRepository.deleteById(id);
    }

    private AgentResponse toDto(Agent agent) {
        return AgentResponse.builder()
                .id(agent.getId())
                .nom(agent.getNom())
                .prenom(agent.getPrenom())
                .numTel(agent.getNumTel())
                .service(agent.getService())
                .matricule(agent.getMatricule())
                .dateEmbauche(agent.getDateEmbauche())
                .build();
    }

    private Agent toEntity(AgentRequest request) {
        return Agent.builder()
                .nom(request.getNom())
                .prenom(request.getPrenom())
                .cin(request.getCin())
                .adresse(request.getAdresse())
                .numTel(request.getNumTel())
                .matricule(request.getMatricule())
                .service(request.getService())
                .dateEmbauche(request.getDateEmbauche())
                .build();
    }
}
