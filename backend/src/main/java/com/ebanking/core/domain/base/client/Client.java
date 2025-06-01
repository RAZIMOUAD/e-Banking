package com.ebanking.core.domain.base.client;

import com.ebanking.core.domain.base.CompteBancaire.CompteBancaire;
import com.ebanking.core.domain.base.personne.Personne;
import com.ebanking.core.domain.base.user.User;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.*;
import lombok.experimental.SuperBuilder;
import jakarta.persistence.*;
import java.util.Date;
import java.util.List;

import java.util.Date;

@Entity
@Table(name = "clients")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class Client extends Personne {

    private Date dateEnrolement;
    private Boolean valideParAgent;
    private String status;


    @OneToOne
    @JoinColumn(name = "user_id")
    private User user;

    @OneToMany(mappedBy = "client")
    private List<CompteBancaire> comptes;
    @Override
    public String toString() {
        return "Client{" +
                super.toString() + // Appelle le toString() de Personne
                ", dateEnrolement=" + dateEnrolement +
                ", valideParAgent=" + valideParAgent +
                ", status='" + status + '\'' +
                ", user=" + (user != null ? user.getId() : "null") + // évite les objets entiers dans le log
                ", comptes=" + (comptes != null ? comptes.size() + " comptes" : "null") +
                '}';
    }



}
