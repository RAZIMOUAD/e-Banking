package com.ebanking.core.service.client;

import com.ebanking.core.domain.base.CompteBancaire.CompteBancaire;
import com.ebanking.core.domain.base.transaction.Transaction;
import com.ebanking.core.domain.base.transaction.Virement;
import com.ebanking.core.dto.client.VirementRequestDTO;
import com.ebanking.core.repository.sql.CompteBancaireRepository;
import com.ebanking.core.repository.sql.TransactionRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;

@Service
public class TransactionClientService {
    @Autowired
    private final TransactionRepository transactionRepo;
    @Autowired
    private final CompteBancaireRepository compteRepo;

    public TransactionClientService(TransactionRepository transactionRepo, CompteBancaireRepository compteRepo) {
        this.transactionRepo = transactionRepo;
        this.compteRepo = compteRepo;
    }

    public List<Transaction> getTransactionsByCompte(Long compteId) {
        return transactionRepo.findBySourceIdOrCibleId(compteId, compteId);
    }
    @Transactional
    public Virement effectuerVirement(VirementRequestDTO dto) {
        CompteBancaire source = compteRepo.findById(dto.getSourceCompteId())
                .orElseThrow(() -> new RuntimeException("Compte source non trouvé"));
        CompteBancaire cible = compteRepo.findById(dto.getCibleCompteId())
                .orElseThrow(() -> new RuntimeException("Compte cible non trouvé"));

        if(source.getSoldeDisponible() < dto.getMontant()) {
            throw new RuntimeException("Solde insuffisant");
        }

        source.setSoldeDisponible(source.getSoldeDisponible() - dto.getMontant());
        cible.setSoldeDisponible(cible.getSoldeDisponible() + dto.getMontant());

        Virement virement = Virement.builder()
                .source(source)
                .cible(cible)
                .montant(dto.getMontant())
                .motif(dto.getMotif())
                .mode(dto.getMode())
                .statut("Validé")
                .type("Virement")
                .date(LocalDateTime.now())
                .autorisePar(dto.getAutorisePar())
                .build();

        compteRepo.save(source);
        compteRepo.save(cible);
        return transactionRepo.save(virement);
    }
}
