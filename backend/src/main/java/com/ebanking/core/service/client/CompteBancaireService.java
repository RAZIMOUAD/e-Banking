package com.ebanking.core.service.client;

import com.ebanking.core.domain.base.CompteBancaire.CompteBancaire;
import com.ebanking.core.domain.base.CompteBancaire.HistoriqueCompte;
import com.ebanking.core.repository.sql.CompteBancaireRepository;
import com.ebanking.core.repository.sql.HistoriqueCompteRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CompteBancaireService {
    private final CompteBancaireRepository compteRepo;
    private final HistoriqueCompteRepository historiqueRepo;

    public CompteBancaireService(CompteBancaireRepository compteRepo, HistoriqueCompteRepository historiqueRepo) {
        this.compteRepo = compteRepo;
        this.historiqueRepo = historiqueRepo;
    }

    public CompteBancaire findById(Long id) {
        return compteRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Compte non trouvé"));
    }

    public List<HistoriqueCompte> getHistorique(Long compteId) {
        return historiqueRepo.findByCompteId(compteId);
    }
}
