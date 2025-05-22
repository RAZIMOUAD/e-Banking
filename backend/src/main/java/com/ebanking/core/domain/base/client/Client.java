package com.ebanking.core.domain.base.client;

import com.ebanking.core.domain.base.personne.Personne;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.util.Date;

@Entity
@Table(name = "clients")
@Getter
@Setter
@DiscriminatorValue("CLIENT")
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class Client extends Personne {

    private Date dateEnrolement;
    private Boolean valideParAgent;
    private String status;

}
