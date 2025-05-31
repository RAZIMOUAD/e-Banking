package com.ebanking.core.domain.base.CompteBancaire;

import jakarta.persistence.*;
import lombok.*;

import java.util.Date;

@Entity
@Table(name = "historique_comptes")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HistoriqueCompte {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String action;

    @Temporal(TemporalType.TIMESTAMP)
    private Date date;

    @ManyToOne
    @JoinColumn(name = "compte_id")
    private CompteBancaire compte;
}
