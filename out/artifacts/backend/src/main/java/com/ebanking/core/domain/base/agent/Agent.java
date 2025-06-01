package com.ebanking.core.domain.base.agent;

import com.ebanking.core.domain.base.personne.Personne;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.util.Date;

@Entity
@Table(name = "agents")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class Agent extends Personne {

    @Temporal(TemporalType.DATE)
    private Date dateEmbauche;

    @Column(length = 100)
    private String service;

    @Column(length = 50, unique = true)
    private String matricule;


}
