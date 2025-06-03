package com.ebanking.core.dto.mappingClasses;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.Date;

@Data
@Builder
public class AbonneDto {
    private Long id;
    private String nom;
    private String prenom;
    private String numTel;
    private String cin;
    private String adresse;
    private String status;
    private Date dateEnrolement;
    private Boolean valideParAgent;
}
