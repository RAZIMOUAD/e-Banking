package com.ebanking.core.dto.mappingClasses;

import com.ebanking.core.domain.base.transaction.Transaction;
import com.ebanking.core.model.mappers.TransactionMapped;

public class TransactionMapper {

    public static TransactionMapped toTransaction(Transaction transaction) {
         TransactionMapped transactionMapped = new TransactionMapped();
         transactionMapped.setReference(transaction.getReference());
         transactionMapped.setMontant(transaction.getMontant());
         transactionMapped.setCible(transaction.getCible());
         transactionMapped.setSource(transaction.getSource());
         transactionMapped.setStatut(transaction.getStatut());
         transactionMapped.setType(transaction.getType());
         transactionMapped.setDate(transaction.getDate());

         return transactionMapped;

    }

}
