package com.ebanking.core.repository.sql;

import com.ebanking.core.domain.base.client.Client;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ClientRepository extends JpaRepository<Client,Long> {


}
