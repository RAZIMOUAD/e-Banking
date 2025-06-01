package com.ebanking.core.domain.base.transaction;

import jakarta.persistence.*;
import lombok.*;
import java.util.Date;

@Entity
@Table(name = "transactions")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Transaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Double montant;

    @Temporal(TemporalType.TIMESTAMP)
    private Date createdAt;

    // relation vers l’expéditeur, le destinataire, etc. à ajouter
}
