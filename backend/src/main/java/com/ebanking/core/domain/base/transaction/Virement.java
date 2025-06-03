package com.ebanking.core.domain.base.transaction;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.*;
import lombok.experimental.SuperBuilder;

@Entity
@Table(name = "virements")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class Virement extends Transaction{
    private String autorisePar;
    private String nomBanque;
}
