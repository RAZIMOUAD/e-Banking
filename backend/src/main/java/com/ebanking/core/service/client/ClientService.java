package com.ebanking.core.service.client;

import com.ebanking.core.domain.base.CompteBancaire.CompteBancaire;
import com.ebanking.core.domain.base.client.Client;
import com.ebanking.core.repository.sql.ClientRepository;
import com.ebanking.core.repository.sql.CompteBancaireRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ClientService {
    private final ClientRepository clientRepo;
    private final CompteBancaireRepository compteRepo;

    public ClientService(ClientRepository clientRepo, CompteBancaireRepository compteRepo) {
        this.clientRepo = clientRepo;
        this.compteRepo = compteRepo;
    }

    public Client findClientById(Long id) {
        return clientRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Client non trouvé"));
    }

    public List<CompteBancaire> getComptesByClient(Long clientId) {
        return compteRepo.findByClientId(clientId);
    }

}
