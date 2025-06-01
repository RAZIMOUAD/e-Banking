package com.ebanking.core.dto.client;


import lombok.Data;
import lombok.experimental.SuperBuilder;

import java.util.Date;

@Data
@SuperBuilder
public class PersonneResponseDTO {
    private Long id;
    private String nom;
    private String prenom;
    private Date dateNaissance;
    private String genre;
    private String nationalite;
    private String numTel;
    private String adresse;
    private String cin;
}
