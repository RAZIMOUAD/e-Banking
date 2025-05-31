package com.ebanking.core.dto.mappingClasses;

import com.ebanking.core.domain.base.client.Client;
import com.ebanking.core.model.mappers.Abonne;

public class ClientMapper {

     public static Abonne toAbonne(Client client) {
         Abonne abonne = new Abonne();
         abonne.setId(client.getId());
         abonne.setDateEnrolement(client.getDateEnrolement());
         abonne.setStatus(client.getStatus());
         abonne.setUser(client.getUser());
         abonne.setPersonne(client.getUser().getPersonne());
         return abonne;
    }

}
