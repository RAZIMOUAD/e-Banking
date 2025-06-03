package com.ebanking.core.model.mappers;

import com.ebanking.core.domain.base.personne.Personne;
import com.ebanking.core.domain.base.user.User;
import org.springframework.data.mongodb.core.mapping.TimeSeries;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.Date;

public class Abonne {
    private Long id;
    private Date dateEnrolement;
    private String status;
    private Personne personne ;
    private User user;

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Personne getPersonne() {
        return personne;
    }

    public void setPersonne(Personne personne) {
        this.personne = personne;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Date getDateEnrolement() {
        return dateEnrolement;
    }

    public void setDateEnrolement(Date dateEnrolement) {
        this.dateEnrolement = dateEnrolement;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
