package com.ebanking.core.controller.agent;


import com.ebanking.core.model.mappers.Abonne;
import com.ebanking.core.model.mappers.Person;
import com.ebanking.core.service.client.ClientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/v1/agent")
public class AgentController {
    @Autowired
    ClientService clientService;

    @GetMapping("/clients")
    public List<Abonne> getAllAbonnes(){
       return clientService.getAllClient();
    }

    @GetMapping("/person/{id}")
    public Person getPerson(@PathVariable("id") Long id){
        return clientService.getPersonById(id);
    }


}
