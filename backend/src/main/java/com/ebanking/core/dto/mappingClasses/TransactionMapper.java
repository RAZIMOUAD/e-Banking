package com.ebanking.core.dto.mappingClasses;

import com.ebanking.core.domain.base.transaction.Transaction;
import com.ebanking.core.model.mappers.TransactionMapped;

public class TransactionMapper {

     public static TransactionMapped toTransaction(Transaction transaction) {
          return TransactionMapped.builder()
                  .id(transaction.getId())
                  .reference(transaction.getReference())
                  .montant(transaction.getMontant())
                  .type(transaction.getType())
                  .date(transaction.getDate())
                  .statut(transaction.getStatut())
                  .ibanSource(transaction.getSource() != null ? transaction.getSource().getIBAN() : null)
                  .ibanCible(transaction.getCible() != null ? transaction.getCible().getIBAN() : null)
                  .build();
     }
}
