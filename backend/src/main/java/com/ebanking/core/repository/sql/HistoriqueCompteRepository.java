package com.ebanking.core.repository.sql;

import com.ebanking.core.domain.base.CompteBancaire.HistoriqueCompte;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HistoriqueCompteRepository extends JpaRepository<HistoriqueCompte, Long> {
    List<HistoriqueCompte> findByCompteId(Long compteId);
}