package com.ebanking.core.domain.base.personne;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.util.Date;

@Entity
@Table(name = "personnes")
@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@Inheritance(strategy = InheritanceType.JOINED)
@DiscriminatorColumn(name = "type_personne", discriminatorType = DiscriminatorType.STRING)

public abstract class Personne {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nom;
    private String prenom;
    private Date dateNaissance;
    private String genre;
    private String nationalite;
    private String numTel;
    private String adresse;
    private String cin;

    @Temporal(TemporalType.TIMESTAMP)
    private Date createdAt;

    @Temporal(TemporalType.TIMESTAMP)
    private Date updatedAt;

    @Column(name = "type_personne", insertable = false, updatable = false)
    private String typePersonne;

    @PrePersist
    protected void onCreate() {
        this.createdAt = this.updatedAt = new Date();
        }
    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = new Date();
    }

}
