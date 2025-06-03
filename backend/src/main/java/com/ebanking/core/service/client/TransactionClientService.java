package com.ebanking.core.service.client;

import com.ebanking.core.domain.base.CompteBancaire.CompteBancaire;
import com.ebanking.core.domain.base.CompteBancaire.HistoriqueCompte;
import com.ebanking.core.domain.base.transaction.Transaction;
import com.ebanking.core.domain.base.transaction.Virement;
import com.ebanking.core.dto.client.VirementRequestDTO;
import com.ebanking.core.repository.sql.CompteBancaireRepository;
import com.ebanking.core.repository.sql.HistoriqueCompteRepository;
import com.ebanking.core.repository.sql.TransactionRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.UUID;

@Service
public class TransactionClientService {
    @Autowired
    private final TransactionRepository transactionRepo;
    @Autowired
    private final CompteBancaireRepository compteRepo;
    @Autowired
    private HistoriqueCompteRepository historiqueRepo;

    public TransactionClientService(TransactionRepository transactionRepo, CompteBancaireRepository compteRepo) {
        this.transactionRepo = transactionRepo;
        this.compteRepo = compteRepo;
    }

    public List<Transaction> getTransactionsByCompte(Long compteId) {
        return transactionRepo.findBySourceIdOrCibleId(compteId, compteId);
    }

    private void ajouterHistorique(CompteBancaire compte, String action) {
        HistoriqueCompte historique = HistoriqueCompte.builder()
                .compte(compte)
                .action(action)
                .date(new Date())
                .build();

        historiqueRepo.save(historique);
    }

    @Transactional
    public Virement effectuerVirement(VirementRequestDTO dto) {
        CompteBancaire source = compteRepo.findById(dto.getSourceCompteId())
                .orElseThrow(() -> new RuntimeException("Compte source non trouvé"));

        CompteBancaire cible = null;
        String typeVirement;

        if (dto.getCibleCompteId() != null) {
            // Virement interne
            cible = compteRepo.findById(dto.getCibleCompteId())
                    .orElseThrow(() -> new RuntimeException("Compte cible non trouvé"));

            if (!source.isActif() || !cible.isActif()) {
                throw new RuntimeException("L'un des comptes est inactif");
            }

            typeVirement = "Virement Interne";
        } else {
            // Virement externe
            if (!source.isActif()) {
                throw new RuntimeException("Le compte source est inactif");
            }

            typeVirement = "Virement Externe";
        }

        double frais = typeVirement.equals("Virement Externe") ? 10.0 : 0.0;
        double totalDebit = dto.getMontant() + frais;

        if (source.getSoldeDisponible() < totalDebit) {
            throw new RuntimeException("Solde insuffisant pour le virement");
        }

        // Débit du compte source
        source.setSoldeDisponible(source.getSoldeDisponible() - totalDebit);

        if (cible != null) {
            // Crédit du compte cible
            cible.setSoldeDisponible(cible.getSoldeDisponible() + dto.getMontant());
            compteRepo.save(cible);
        }

        Virement virement = Virement.builder()
                .source(source)
                .cible(cible)
                .montant(dto.getMontant())
                .motif(dto.getMotif())
                .mode(dto.getMode())
                .statut("Validé")
                .type(typeVirement)
                .date(new Date())
                .autorisePar(null) // Par défaut null
                .reference(UUID.randomUUID().toString())
                .build();

        if (typeVirement.equals("Virement Externe")) {
            virement.setMotif(dto.getMotif() + " (" + dto.getNomBanque() + ")");
        }

        // Sauvegarde
        compteRepo.save(source);
        Virement saved = transactionRepo.save(virement);

        // Historique
        ajouterHistorique(source, "Virement de " + dto.getMontant() + " " +
                (cible != null ? ("vers " + cible.getIBAN()) : ("vers " + dto.getNomBanque())));

        if (cible != null) {
            ajouterHistorique(cible, "Réception de " + dto.getMontant() + " depuis " + source.getIBAN());
        }

        return saved;
    }
}


