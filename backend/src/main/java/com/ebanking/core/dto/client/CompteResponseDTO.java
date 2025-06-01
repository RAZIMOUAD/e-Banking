package com.ebanking.core.dto.client;


import lombok.*;

import java.util.Date;

@Data
@Builder
public class CompteResponseDTO {
    private Long id;
    private String IBAN;
    private String type;
    private double solde;
    private String devise;
    private Date dateCreation;
    private double plafond;
    private double soldeDisponible;
    private boolean actif;
}
