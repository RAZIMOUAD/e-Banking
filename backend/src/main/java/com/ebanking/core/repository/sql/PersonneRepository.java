package com.ebanking.core.repository.sql;

import com.ebanking.core.domain.base.personne.Personne;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PersonneRepository extends JpaRepository<Personne,Long> {
    public Personne findById(long id);
}
