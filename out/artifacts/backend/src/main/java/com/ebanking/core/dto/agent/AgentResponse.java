package com.ebanking.core.dto.agent;

import lombok.Builder;
import lombok.Data;

import java.util.Date;

@Data
@Builder
public class AgentResponse {
    private Long id;
    private String nom;
    private String prenom;
    private String email;
    private String numTel;
    private String service;
    private String matricule;
    private Date dateEmbauche;
}

