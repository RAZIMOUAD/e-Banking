package com.ebanking.core.dto.devise;

import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DeviseResponse {
    private Long id;
    private String code;
    private String libelle;
    private BigDecimal tauxConversion;
}
