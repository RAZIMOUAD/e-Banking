package com.ebanking.core.dto.mappingClasses;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

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
    private LocalDateTime dateEnrolement;
    private Boolean valideParAgent;
}
