package com.ebanking.core.repository.sql;

import com.ebanking.core.domain.base.transaction.Virement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface VirementRepository extends JpaRepository<Virement, Long> {
}
