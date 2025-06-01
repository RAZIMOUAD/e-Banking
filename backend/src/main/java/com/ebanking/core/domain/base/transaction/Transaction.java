package com.ebanking.core.domain.base.transaction;

import com.ebanking.core.domain.base.CompteBancaire.CompteBancaire;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.util.Date;

@Entity
@Table(name = "transactions")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@Inheritance(strategy = InheritanceType.JOINED)
public class Transaction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String reference;
    private double montant;
    private String type;

    @Temporal(TemporalType.TIMESTAMP)
    private Date date;

    private String statut;
    private String mode;
    private String motif;

    @ManyToOne
    @JoinColumn(name = "source_id")
    private CompteBancaire source;

    @ManyToOne
    @JoinColumn(name = "cible_id")
    private CompteBancaire cible;

    @Override
    public String toString() {
        return "Transaction{ref=" + reference + ", montant=" + montant + ", type=" + type + ", date=" + date + "}";
    }


    // relation vers l’expéditeur, le destinataire, etc. à ajouter
}