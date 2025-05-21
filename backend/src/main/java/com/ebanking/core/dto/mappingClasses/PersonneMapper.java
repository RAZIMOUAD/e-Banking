package com.ebanking.core.dto.mappingClasses;

import com.ebanking.core.domain.base.personne.Personne;
import com.ebanking.core.model.mappers.Person;

public class PersonneMapper {

    public static Person toPerson(Personne personne){
        Person per = new Person();
        per.setNom(personne.getNom());
        per.setPrenom(personne.getPrenom());
        per.setAdresse(personne.getAdresse());
        per.setCin(personne.getCin());
        per.setGenre(personne.getGenre());
        per.setDateNaissance(personne.getDateNaissance());
        per.setTelephone(personne.getNumTel());
        return per;
    }
}
