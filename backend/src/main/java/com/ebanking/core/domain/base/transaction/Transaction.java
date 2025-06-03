package com.ebanking.core.domain.base.transaction;

import com.ebanking.core.domain.base.CompteBancaire.CompteBancaire;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.time.LocalDateTime;
import java.util.Date;

@Entity
@Table(name = "transactions")
@Getter
@Setter
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


    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @Temporal(TemporalType.TIMESTAMP)
    private LocalDateTime date;

    private String statut;
    private String mode;
    private String motif;

    @ManyToOne
    @JoinColumn(name = "source_id")
    @JsonBackReference(value = "source-transactions")
    private CompteBancaire source;

    @ManyToOne
    @JoinColumn(name = "cible_id")
    @JsonBackReference(value = "cible-transactions")
    private CompteBancaire cible;
}
