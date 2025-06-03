package com.ebanking.core.dto.mappingClasses;

import com.ebanking.core.domain.base.CompteBancaire.CompteBancaire;
import com.ebanking.core.domain.base.client.Client;

import com.ebanking.core.dto.mappingClasses.AbonneDto;
import com.ebanking.core.repository.sql.ClientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Objects;
import java.util.Optional;

import static java.util.stream.Collectors.toList;

public class ClientMapper {

    public static AbonneDto toAbonne(Client client) {
        if (client == null) return null;
        /**
        List<CompteBancaireDto> comptes = Optional.ofNullable(client.getComptes())
                .orElse(List.of()) // évite NullPointerException
                .stream()
                .filter(Objects::nonNull) // si jamais y a des comptes nulls dans la liste
                .map(ClientMapper::toDto)
                .toList();
         **/
        return AbonneDto.builder()
                .id(client.getId())
                .nom(client.getNom())
                .prenom(client.getPrenom())
                .numTel(client.getNumTel())
                .cin(client.getCin())
                .adresse(client.getAdresse())
                .status(client.getStatus())
                .dateEnrolement(client.getDateEnrolement())
                .valideParAgent(client.getValideParAgent())
                .build();
    }
    public static CompteBancaireDto toDto(CompteBancaire compte) {
        if (compte == null){
            System.out.println("Compte bancaire null détecté");
            return null;}
        return CompteBancaireDto.builder()
                .id(compte.getId())
                .IBAN(compte.getIBAN())
                .type(compte.getType())
                .solde(compte.getSolde())
                .build();
    }

}
