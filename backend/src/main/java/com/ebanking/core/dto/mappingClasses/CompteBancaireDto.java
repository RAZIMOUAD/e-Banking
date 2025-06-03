package com.ebanking.core.dto.mappingClasses;

import lombok.Builder;
import lombok.Data;

import java.util.Date;

@Data
@Builder
public class CompteBancaireDto {
    private Long id;
    private String IBAN;
    private String type;
    private double solde;
    /**
    private String devise;
    private Date dateCreation;
    private double plafond;
    private double soldeDisponible;
    private boolean actif;
     **/
}
