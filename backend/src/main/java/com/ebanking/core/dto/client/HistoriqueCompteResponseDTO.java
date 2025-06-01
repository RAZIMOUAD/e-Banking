package com.ebanking.core.dto.client;

import lombok.Builder;
import lombok.Data;

import java.util.Date;

@Data
@Builder
public class HistoriqueCompteResponseDTO {
    private Long id;
    private String action;
    private Date date;
}
