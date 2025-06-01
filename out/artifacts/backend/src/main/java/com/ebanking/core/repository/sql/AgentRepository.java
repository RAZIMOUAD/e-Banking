package com.ebanking.core.repository.sql;

import com.ebanking.core.domain.base.agent.Agent;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AgentRepository extends JpaRepository<Agent, Long> {
    Optional<Agent> findByMatricule(String matricule);
}
