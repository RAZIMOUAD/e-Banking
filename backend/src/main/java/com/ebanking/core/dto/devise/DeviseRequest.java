package com.ebanking.core.dto.devise;

import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DeviseRequest {
    private String code;
    private String libelle;
    private BigDecimal tauxConversion;
}
