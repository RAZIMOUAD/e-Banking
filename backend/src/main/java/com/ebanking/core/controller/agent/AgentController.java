package com.ebanking.core.controller.agent;


import com.ebanking.core.model.mappers.Abonne;
import com.ebanking.core.model.mappers.TransactionMapped;
import com.ebanking.core.service.client.ClientService;
import com.ebanking.core.service.transaction.TransactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/agent")
@CrossOrigin(value="http://localhost:4200/")
public class AgentController {
    @Autowired
    ClientService clientService;

    @Autowired
    TransactionService transactionService;

    @GetMapping(value="/clients",produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<Abonne>> getClients() {
        System.out.println("dsdsds");
        List<Abonne> clients = clientService.getAllClient();
        System.out.println("sdwxcddfsd"+ clients.size());
        return ResponseEntity.ok(clients);
    }

    @GetMapping("/transactions")
    public ResponseEntity<List<TransactionMapped>> getTransactions() {
         List<TransactionMapped> transactions = transactionService.allTransactions();
         return ResponseEntity.ok(transactions);
    }


}
