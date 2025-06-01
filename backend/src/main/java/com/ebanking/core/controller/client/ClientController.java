package com.ebanking.core.controller.client;

import com.ebanking.core.domain.base.CompteBancaire.CompteBancaire;
import com.ebanking.core.domain.base.client.Client;
import com.ebanking.core.domain.base.transaction.Virement;
import com.ebanking.core.dto.client.*;
import com.ebanking.core.service.client.ClientService;
import com.ebanking.core.service.client.CompteBancaireService;
import com.ebanking.core.service.client.TransactionService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/client")
public class ClientController {

    private final ClientService clientService;
    private final CompteBancaireService compteService;
    private final TransactionService transactionService;

    public ClientController(ClientService clientService, CompteBancaireService compteService,
                            TransactionService transactionService) {
        this.clientService = clientService;
        this.compteService = compteService;
        this.transactionService = transactionService;
    }

    // Récupérer infos client + comptes
    @GetMapping("/ccc/{clientId}")
    public ClientResponseDTO getClientWithComptes(@PathVariable Long clientId) {
        Client client = clientService.findClientById(clientId);
        List<CompteBancaire> comptes = clientService.getComptesByClient(clientId);

        List<CompteResponseDTO> comptesDto = comptes.stream().map(c ->
                CompteResponseDTO.builder()
                        .id(c.getId())
                        .IBAN(c.getIBAN())
                        .type(c.getType())
                        .solde(c.getSolde())
                        .devise(c.getDevise())
                        .dateCreation(c.getDateCreation())
                        .plafond(c.getPlafond())
                        .soldeDisponible(c.getSoldeDisponible())
                        .actif(c.isActif())
                        .build()
        ).collect(Collectors.toList());

        return ClientResponseDTO.builder()
                .id(client.getId())
                .nom(client.getNom())
                .prenom(client.getPrenom())
                .dateNaissance(client.getDateNaissance())
                .genre(client.getGenre())
                .nationalite(client.getNationalite())
                .numTel(client.getNumTel())
                .adresse(client.getAdresse())
                .cin(client.getCin())
                .comptes(comptesDto)
                .build();
    }
    @GetMapping("/{id}")
    public ResponseEntity<?> getClientById(@PathVariable Long id) {
        try {
            Client client = clientService.findClientById(id);

            // Mapping manuel sans ClientMapper
            ClientResponseDTO response = ClientResponseDTO.builder()
                    .id(client.getId())
                    .nom(client.getNom())
                    .prenom(client.getPrenom())
                    .numTel(client.getNumTel())
                    .adresse(client.getAdresse())
                    .build();

            return ResponseEntity.ok(response);

        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Client non trouvé");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erreur interne du serveur");
        }
    }


    // Historique compte
    @GetMapping("/compte/{compteId}/historique")
    public List<HistoriqueCompteResponseDTO> getHistoriqueCompte(@PathVariable Long compteId) {
        return compteService.getHistorique(compteId).stream().map(h -> HistoriqueCompteResponseDTO.builder()
                .id(h.getId())
                .action(h.getAction())
                .date(h.getDate())
                .build()
        ).collect(Collectors.toList());
    }

    // Transactions d’un compte
    @GetMapping("/compte/{compteId}/transactions")
    public List<TransactionResponseDTO> getTransactionsCompte(@PathVariable Long compteId) {
        return transactionService.getTransactionsByCompte(compteId).stream().map(t -> TransactionResponseDTO.builder()
                .id(t.getId())
                .reference(t.getReference())
                .montant(t.getMontant())
                .type(t.getType())
                .date(t.getDate())
                .statut(t.getStatut())
                .mode(t.getMode())
                .motif(t.getMotif())
                .source(CompteResponseDTO.builder()
                        .id(t.getSource().getId())
                        .IBAN(t.getSource().getIBAN())
                        .type(t.getSource().getType())
                        .solde(t.getSource().getSolde())
                        .devise(t.getSource().getDevise())
                        .dateCreation(t.getSource().getDateCreation())
                        .plafond(t.getSource().getPlafond())
                        .soldeDisponible(t.getSource().getSoldeDisponible())
                        .actif(t.getSource().isActif())
                        .build())
                .cible(CompteResponseDTO.builder()
                        .id(t.getCible().getId())
                        .IBAN(t.getCible().getIBAN())
                        .type(t.getCible().getType())
                        .solde(t.getCible().getSolde())
                        .devise(t.getCible().getDevise())
                        .dateCreation(t.getCible().getDateCreation())
                        .plafond(t.getCible().getPlafond())
                        .soldeDisponible(t.getCible().getSoldeDisponible())
                        .actif(t.getCible().isActif())
                        .build())
                .build()
        ).collect(Collectors.toList());
    }

    // Effectuer un virement
    @PostMapping("/virement")
    public ResponseEntity<?> faireVirement(@RequestBody VirementRequestDTO dto) {
        try {
            Virement v = transactionService.effectuerVirement(dto);
            return ResponseEntity.ok("Virement effectué avec succès, ID = " + v.getId());
        } catch (RuntimeException ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }
}
