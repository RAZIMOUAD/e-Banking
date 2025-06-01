package com.ebanking.core.dto.agent;

import lombok.Data;

import java.util.Date;

@Data
public class AgentRequest {
    private String nom;
    private String prenom;
    private String email;
    private String numTel;
    private String cin;
    private String adresse;
    private String service;
    private String matricule;
    private Date dateEmbauche;
}
