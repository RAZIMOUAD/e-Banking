package com.ebanking.core.dto.client;


import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.Date;

@Data
@Builder
public class TransactionResponseDTO {
    private Long id;
    private String reference;
    private double montant;
    private String type;
    private LocalDateTime date;
    private String statut;
    private String mode;
    private String motif;
    private CompteResponseDTO source;
    private CompteResponseDTO cible;
}
