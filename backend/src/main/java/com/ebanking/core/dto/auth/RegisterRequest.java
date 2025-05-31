package com.ebanking.core.dto.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.util.Date;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RegisterRequest {

    // Informations personnelles
    @NotBlank
    private String nom;

    @NotBlank
    private String prenom;

    private Date dateNaissance;
    private String genre;
    private String nationalite;
    private String numTel;
    private String adresse;
    private String cin;

    // Informations de connexion
    @NotBlank
    @Email
    private String email;

    @NotBlank
    private String password;
}


