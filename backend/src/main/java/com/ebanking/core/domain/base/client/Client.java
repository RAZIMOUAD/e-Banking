package com.ebanking.core.domain.base.client;

import com.ebanking.core.domain.base.CompteBancaire.CompteBancaire;
import com.ebanking.core.domain.base.personne.Personne;
import com.ebanking.core.domain.base.transaction.Transaction;
import com.ebanking.core.domain.base.user.User;
import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;


@Entity
@Table(name = "clients")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class Client extends Personne {
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime dateEnrolement;
    private Boolean valideParAgent;
    private String status;
    @OneToOne
    @JoinColumn(name = "user_id")
    private User user;

    @OneToMany(mappedBy = "client")
    private List<CompteBancaire> comptes;


}
