package com.ebanking.core.domain.base.devise;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "devises")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Devise {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 10)
    private String code; // Ex: EUR, USD, MAD

    @Column(nullable = false)
    private String libelle; // Euro, Dollar, Dirham...

    @Column(nullable = false, precision = 10, scale = 4)
    private BigDecimal tauxConversion; // Par rapport à la devise par défaut
}
