package com.ebanking.core.domain.base.CompteBancaire;

import com.ebanking.core.domain.base.client.Client;
import com.ebanking.core.domain.base.transaction.Transaction;
import jakarta.persistence.*;
import lombok.*;


import java.util.Date;
import java.util.List;

@Entity
@Table(name = "comptes_bancaires")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CompteBancaire {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String IBAN;
    private String type;
    private double solde;
    private String devise;
    @Temporal(TemporalType.DATE)
    private Date dateCreation;
    private double plafond;
    private double soldeDisponible;
    private boolean actif;

    @ManyToOne
    @JoinColumn(name = "client_id")
    private Client client;

    @OneToMany(mappedBy = "source")
    private List<Transaction> transactionsSource;

    @OneToMany(mappedBy = "cible")
    private List<Transaction> transactionsCible;

    @OneToMany(mappedBy = "compte")
    private List<HistoriqueCompte> historiques;

    // Getters et Setters
}
