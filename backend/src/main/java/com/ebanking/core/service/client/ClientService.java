package com.ebanking.core.service.client;

import com.ebanking.core.domain.base.CompteBancaire.CompteBancaire;
import com.ebanking.core.domain.base.client.Client;
import com.ebanking.core.domain.base.personne.Personne;
import com.ebanking.core.domain.base.user.User;
import com.ebanking.core.dto.mappingClasses.AbonneDto;
import com.ebanking.core.dto.mappingClasses.ClientMapper;
import com.ebanking.core.repository.sql.ClientRepository;
import com.ebanking.core.repository.sql.CompteBancaireRepository;
import com.ebanking.core.repository.sql.PersonneRepository;
import com.ebanking.core.repository.sql.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class ClientService {

    @Autowired
    private ClientRepository clientRepository;

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PersonneRepository personneRepository;

    public AbonneDto getClientById(Long id) {
        Client client = clientRepository.findById(id).orElseThrow(() ->
                new IllegalArgumentException("Client non trouvé avec id : " + id));
        return ClientMapper.toAbonne(client);
    }

    public List<AbonneDto> getAllClient() {
        List<Client> clients = clientRepository.findAll();
        List<AbonneDto> abonnes = new ArrayList<>();
        for (Client client : clients) {
            abonnes.add(ClientMapper.toAbonne(client));
        }
        return abonnes;
    }
   // private final ClientRepository clientRepo;
    private final CompteBancaireRepository compteRepo;

    public ClientService(CompteBancaireRepository compteRepo) {
        //this.clientRepo = clientRepo;
        this.compteRepo = compteRepo;
    }

    public Client findClientById(Long id) {
        return clientRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Client non trouvé"));
    }

    public List<CompteBancaire> getComptesByClient(Long clientId) {
        return compteRepo.findByClientId(clientId);
    }
    @Transactional
    public void deleteClientById(Long clientId) {
        // 1. Récupérer le client
        Client client = clientRepository.findById(clientId)
                .orElseThrow(() -> new RuntimeException("Client non trouvé"));

        // 2. Récupérer l'utilisateur lié
        User user = client.getUser();

        // 3. Supprimer les comptes (optionnel car cascade = ALL déjà présent)
        client.getComptes().clear();

        // 4. Supprimer le lien entre client et user
        client.setUser(null);

        // 5. Supprimer le client
        clientRepository.delete(client);

        // 6. Supprimer user et personne si nécessaire
        if (user != null) {
            Personne personne = user.getPersonne();
            user.setPersonne(null);
            userRepository.delete(user);

            if (personne != null) {
                personneRepository.delete(personne);
            }
        }
    }
    public Client saveClient(Client client) {
        System.out.println(client.getNom());
        System.out.println(client.getUser().getUsername());
        return clientRepository.save(client);
    }

}

