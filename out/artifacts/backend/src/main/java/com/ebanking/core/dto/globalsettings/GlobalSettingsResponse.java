package com.ebanking.core.dto.globalsettings;


import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GlobalSettingsResponse {
    private Double tauxCommission;
    private Double plafondVirement;
    private Double fraisFixes;
}
