package com.ebanking.core.repository.sql;


import com.ebanking.core.domain.base.token.Token;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface TokenRepository extends JpaRepository<Token, Integer> {

    @Query("""
    select t from Token t inner join t.user u
    where u.id = :id and (t.expired = false or t.revoked = false)
""")
    List<Token> findAllValidTokenByUser(Long id);

    Optional<Token> findByToken(String token);

}
