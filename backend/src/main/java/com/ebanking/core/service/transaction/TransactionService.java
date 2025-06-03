package com.ebanking.core.service.transaction;


import com.ebanking.core.domain.base.transaction.Transaction;
import com.ebanking.core.dto.mappingClasses.TransactionMapper;
import com.ebanking.core.model.mappers.TransactionMapped;

import com.ebanking.core.repository.sql.TransactionRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.DeleteMapping;

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

    public void deleteTransactionById(Long id) {
        Transaction transaction = transactionRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Transaction with ID " + id + " not found"));
        System.out.println("ejjrneeernejn"+ transaction.getType());
        transactionRepository.delete(transaction);
    }
}
