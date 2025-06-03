package com.ebanking.core.service.client;

import com.ebanking.core.domain.base.CompteBancaire.CompteBancaire;
import com.ebanking.core.domain.base.CompteBancaire.HistoriqueCompte;
import com.ebanking.core.domain.base.transaction.Transaction;
import com.ebanking.core.repository.sql.CompteBancaireRepository;
import com.ebanking.core.repository.sql.HistoriqueCompteRepository;
import com.ebanking.core.repository.sql.TransactionRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.*;
import java.util.UUID;

@Service
public class TransactionClientService {

    @Autowired
    private TransactionRepository transactionRepo;
    @Autowired
    private CompteBancaireRepository compteRepo;
    @Autowired
    private HistoriqueCompteRepository historiqueRepo;


    public List<Transaction> getTransactionsByComptesource(Long compteId) {
        return transactionRepo.findBySourceId(compteId);
    }
    public List<Transaction> getTransactionsByComptecible(Long compteId2) {
        return transactionRepo.findByCibleId(compteId2);
    }

    private void ajouterHistorique(CompteBancaire compte, String action) {
        HistoriqueCompte historique = HistoriqueCompte.builder()
                .compte(compte)
                .action(action)
                .date(new Date())
                .build();

        historiqueRepo.save(historique);
    }

    private static final Map<String, Double> FRAIS_PAR_BANQUE = Map.of(
            "Attijariwafa Bank", 10.0,
            "Banque Populaire", 8.0,
            "BMCE Bank", 12.0,
            "CIH", 9.5,
            "Crédit Agricole du Maroc", 7.5,
            "Société Générale Maroc", 10.0,
            "BMCI", 11.0,
            "CFG Bank", 9.0,         // tu peux mettre la valeur que tu veux
            "Al Barid Bank", 8.5     // idem
    );

    @Transactional
    public Transaction effectuerVirementInterne(Long sourceId, Long cibleId, double montant, String motif, String mode) {
        CompteBancaire source = compteRepo.findById(sourceId)
                .orElseThrow(() -> new RuntimeException("Compte source non trouvé"));
        CompteBancaire cible = compteRepo.findById(cibleId)
                .orElseThrow(() -> new RuntimeException("Compte cible non trouvé"));

        if (!source.isActif() || !cible.isActif()) {
            throw new RuntimeException("L'un des comptes est inactif");
        }

        if (!source.getBanque().equalsIgnoreCase(cible.getBanque())) {
            throw new RuntimeException("Virement interne refusé : banques différentes");
        }

        if (source.getSoldeDisponible() < montant) {
            throw new RuntimeException("Solde insuffisant pour le virement");
        }

        source.setSoldeDisponible(source.getSoldeDisponible() - montant);
        cible.setSoldeDisponible(cible.getSoldeDisponible() + montant);

        compteRepo.save(source);
        compteRepo.save(cible);

        Transaction virement = Transaction.builder()
                .reference(UUID.randomUUID().toString())
                .montant(montant)
                .type("Virement Interne")
                .date(new Date())
                .statut("Validé")
                .mode(mode)
                .motif(motif)
                .source(source)
                .cible(cible)
                .build();

        transactionRepo.save(virement);

        ajouterHistorique(source, "Virement interne de " + montant + " vers " + cible.getIBAN());
        ajouterHistorique(cible, "Réception de " + montant + " depuis " + source.getIBAN());

        return virement;
    }
    @Transactional
    public Transaction effectuerVirementExterne(Long sourceId, double montant, String motif, String mode, String nomBanque, String nomBeneficiaire, String iban) {
        CompteBancaire source = compteRepo.findById(sourceId)
                .orElseThrow(() -> new RuntimeException("Compte source non trouvé"));

        if (!source.isActif()) {
            throw new RuntimeException("Le compte source est inactif");
        }

        double frais = FRAIS_PAR_BANQUE.getOrDefault(nomBanque, 10.0);
        double totalDebit = montant + frais;

        if (source.getSoldeDisponible() < totalDebit) {
            throw new RuntimeException("Solde insuffisant pour le virement externe");
        }

        source.setSoldeDisponible(source.getSoldeDisponible() - totalDebit);
        compteRepo.save(source);

        Transaction virement = Transaction.builder()
                .reference(UUID.randomUUID().toString())
                .montant(montant)
                .type("Virement Externe")
                .date(new Date())
                .statut("Validé")
                .mode(mode)
                .motif(motif)
                .source(source)
                .cible(null)
                .build();

        transactionRepo.save(virement);

        ajouterHistorique(source, "Virement externe de " + montant + " vers " + nomBeneficiaire + " (" + iban + ") à " + nomBanque + " avec frais de " + frais);

        return virement;
    }

}