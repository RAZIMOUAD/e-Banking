package com.ebanking.core.dto.client;


import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class VirementRequestDTO {
    private Long sourceCompteId;
    private Long cibleCompteId; // Null si externe
    private double montant;
    private String motif;
    private String mode;
    private String nomBanque;
}
