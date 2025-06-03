package com.ebanking.core.controller.agent;

import com.ebanking.core.dto.mappingClasses.AbonneDto;
import com.ebanking.core.model.mappers.TransactionMapped;
import com.ebanking.core.service.client.ClientService;
import com.ebanking.core.service.transaction.TransactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController("agentControllerAgent")
@RequestMapping("/api/v1/agent")
@CrossOrigin(value = "http://localhost:4200/")
public class AgentController {

    @Autowired
    private ClientService clientService;

    @Autowired
    private TransactionService transactionService;

    @GetMapping(value = "/clients", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> getClients() {
        try {
            List<AbonneDto> clients = clientService.getAllClient();
            return ResponseEntity.ok(clients);
        } catch (Exception e) {
            e.printStackTrace(); // pour avoir l'erreur exacte dans les logs
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }


    @GetMapping("/transactions")
    public ResponseEntity<List<TransactionMapped>> getTransactions() {
        List<TransactionMapped> transactions = transactionService.allTransactions();
        return ResponseEntity.ok(transactions);
    }
}
