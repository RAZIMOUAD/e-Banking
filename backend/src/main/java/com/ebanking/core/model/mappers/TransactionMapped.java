package com.ebanking.core.model.mappers;

import com.ebanking.core.domain.base.CompteBancaire.CompteBancaire;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;

import java.util.Date;

public class TransactionMapped {

    private String reference;
    private double montant;
    private String type;

    @Temporal(TemporalType.TIMESTAMP)
    private Date date;

    private String statut;
    private CompteBancaire source;
    private CompteBancaire cible;

    public String getReference() {
        return reference;
    }

    public void setReference(String reference) {
        this.reference = reference;
    }

    public double getMontant() {
        return montant;
    }

    public void setMontant(double montant) {
        this.montant = montant;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }

    public String getStatut() {
        return statut;
    }

    public void setStatut(String statut) {
        this.statut = statut;
    }

    public CompteBancaire getSource() {
        return source;
    }

    public void setSource(CompteBancaire source) {
        this.source = source;
    }

    public CompteBancaire getCible() {
        return cible;
    }

    public void setCible(CompteBancaire cible) {
        this.cible = cible;
    }
}
