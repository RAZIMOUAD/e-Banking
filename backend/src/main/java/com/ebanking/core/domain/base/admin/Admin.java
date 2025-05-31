package com.ebanking.core.domain.base.admin;

import com.ebanking.core.domain.base.personne.Personne;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

@Entity
@Table(name = "admins")
@Getter
@Setter
@DiscriminatorValue("ADMIN")
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class Admin extends Personne {

    @Column(length = 100)
    private String niveauAcces;

    @Column(length = 255)
    private String fonction;


}
