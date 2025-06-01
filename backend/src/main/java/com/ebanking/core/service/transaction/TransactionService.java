package com.ebanking.core.service.transaction;


import com.ebanking.core.domain.base.transaction.Transaction;
import com.ebanking.core.dto.mappingClasses.TransactionMapper;
import com.ebanking.core.model.mappers.TransactionMapped;

import com.ebanking.core.repository.sql.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class TransactionService {
    @Autowired
    private TransactionRepository transactionRepository;

    public List<TransactionMapped> allTransactions() {
        List<TransactionMapped> transactions = new ArrayList<>();
        List<Transaction> transactionList = transactionRepository.findAll();
        for (Transaction transaction : transactionList) {
            transactions.add(TransactionMapper.toTransaction(transaction));
        }
        return transactions;
    }
}
