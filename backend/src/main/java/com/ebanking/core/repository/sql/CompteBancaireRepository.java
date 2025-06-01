package com.ebanking.core.repository.sql;

import com.ebanking.core.domain.base.CompteBancaire.CompteBancaire;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CompteBancaireRepository extends JpaRepository<CompteBancaire, Long> {
    List<CompteBancaire> findByClientId(Long clientId);
    @Query("SELECT SUM(c.solde) FROM CompteBancaire c WHERE c.client.id = :clientId")
    Double getTotalSoldeByClient(@Param("clientId") Long clientId);
}
