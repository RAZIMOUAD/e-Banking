package com.ebanking.core.service.client;

import com.ebanking.core.domain.base.client.Client;
import com.ebanking.core.domain.base.personne.Personne;
import com.ebanking.core.dto.mappingClasses.ClientMapper;
import com.ebanking.core.dto.mappingClasses.PersonneMapper;
import com.ebanking.core.model.mappers.Abonne;
import com.ebanking.core.model.mappers.Person;
import com.ebanking.core.repository.sql.ClientRepository;
import com.ebanking.core.repository.sql.PersonneRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class ClientService {
    @Autowired
    private ClientRepository clientRepository;
     @Autowired
    private PersonneRepository personneRepository;

    public Abonne getClientbyId(Long id ){
        Client clt = clientRepository.findById(id).get();
        return ClientMapper.toAbonne(clt);
    }
    public List<Abonne> getAllClient(){
        List<Client> clients = clientRepository.findAll();
        List<Abonne> abonnes = new ArrayList<>();
        for (Client clt : clients) {
            abonnes.add(getClientbyId(clt.getId()));
        }
        return abonnes;
    }

    public Person getPersonById(Long id){
        System.out.println("djfsfhdjdhfjf");
        Optional<Personne> per = personneRepository.findById(id);
         if(per.isPresent()){
             Personne personne = per.get();
             return PersonneMapper.toPerson(personne);
         }
         else {
             return null;
         }
    }


}
