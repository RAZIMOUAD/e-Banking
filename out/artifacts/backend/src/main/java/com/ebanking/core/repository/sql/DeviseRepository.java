package com.ebanking.core.repository.sql;


import com.ebanking.core.domain.base.devise.Devise;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface DeviseRepository extends JpaRepository<Devise, Long> {
    Optional<Devise> findByCode(String code);
}