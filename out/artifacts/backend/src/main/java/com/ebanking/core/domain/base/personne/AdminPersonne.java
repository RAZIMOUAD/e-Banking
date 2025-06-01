package com.ebanking.core.domain.base.personne;

import jakarta.persistence.Entity;
import lombok.*;
import lombok.experimental.SuperBuilder;

@Entity
@SuperBuilder
@AllArgsConstructor // ✅ fournit le constructeur complet
public class AdminPersonne extends Personne {
    // Ne redéfinis PAS de constructeur manuellement ici
}
