package com.ebanking.core.model.mappers;

import org.springframework.data.mongodb.core.mapping.TimeSeries;

import java.sql.Timestamp;
import java.util.Date;

public class Abonne {
    private Long id;
    private Date dateEnrolement;
    private String status;

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
