package com.ebanking.core.service.client;

import com.ebanking.core.domain.base.CompteBancaire.CompteBancaire;
import com.ebanking.core.domain.base.client.Client;
import com.ebanking.core.dto.mappingClasses.AbonneDto;
import com.ebanking.core.dto.mappingClasses.ClientMapper;
import com.ebanking.core.repository.sql.ClientRepository;
import com.ebanking.core.repository.sql.CompteBancaireRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class ClientService {

    private final ClientRepository clientRepo;
    private final CompteBancaireRepository compteRepo;

    public ClientService(ClientRepository clientRepo, CompteBancaireRepository compteRepo) {
        this.clientRepo = clientRepo;
        this.compteRepo = compteRepo;
    }

    public AbonneDto getClientById(Long id) {
        Client client = clientRepo.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Client non trouvé avec id : " + id));
        return ClientMapper.toAbonne(client);
    }

    public List<AbonneDto> getAllClient() {
        List<Client> clients = clientRepo.findAll();
        List<AbonneDto> abonnes = new ArrayList<>();

        for (Client client : clients) {
            try {
                AbonneDto dto = ClientMapper.toAbonne(client);
                abonnes.add(dto);
            } catch (Exception e) {
                System.err.println("❌ Erreur lors du mapping du client ID=" + client.getId() +
                        " : " + e.getMessage());
                e.printStackTrace(); // utile pour le debug temporaire
            }
        }

        return abonnes;
    }

    public Client findClientById(Long id) {
        return clientRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Client non trouvé"));
    }

    public List<CompteBancaire> getComptesByClient(Long clientId) {
        return compteRepo.findByClientId(clientId);
    }
}
