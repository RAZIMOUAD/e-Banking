package com.ebanking.core.dto.mappingClasses;

import com.ebanking.core.domain.base.client.Client;

import com.ebanking.core.dto.mappingClasses.AbonneDto;

public class ClientMapper {

    public static AbonneDto toAbonne(Client client) {
        if (client == null) return null;

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
}
