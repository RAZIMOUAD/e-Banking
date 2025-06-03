package com.ebanking.core.model.mappers;

import lombok.Builder;
import lombok.Data;

import java.util.Date;

@Data
@Builder
public class TransactionMapped {
    private String reference;
    private double montant;
    private String type;
    private Date date;
    private String statut;

    private String ibanSource;
    private String ibanCible;
}
