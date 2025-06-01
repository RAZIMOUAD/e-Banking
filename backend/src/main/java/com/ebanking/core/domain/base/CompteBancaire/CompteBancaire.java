package com.ebanking.core.domain.base.CompteBancaire;

import com.ebanking.core.domain.base.client.Client;
import com.ebanking.core.domain.base.transaction.Transaction;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
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
    @JsonBackReference // inverse de Client → comptes
    private Client client;

    @OneToMany(mappedBy = "source", cascade = CascadeType.ALL)
    @JsonManagedReference(value = "source-transactions")
    private List<Transaction> transactionsSource;

    @OneToMany(mappedBy = "cible", cascade = CascadeType.ALL)
    @JsonManagedReference(value = "cible-transactions")
    private List<Transaction> transactionsCible;
}
