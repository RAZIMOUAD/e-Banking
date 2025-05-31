package com.ebanking.core.service.client;

import com.ebanking.core.domain.base.client.Client;
import com.ebanking.core.dto.mappingClasses.AbonneDto;
import com.ebanking.core.dto.mappingClasses.ClientMapper;
import com.ebanking.core.repository.sql.ClientRepository;
import com.ebanking.core.repository.sql.UserRepository;
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
}
