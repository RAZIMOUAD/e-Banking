package com.ebanking.core.domain.base.token;

import com.ebanking.core.domain.base.enums.TokenType;
import com.ebanking.core.domain.base.user.User;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "tokens")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Token { // Sert à stocker les JWT (access token) liés à un utilisateur.

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(unique = true, nullable = false, length = 512)
    private String token;

    @Builder.Default
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private TokenType tokenType = TokenType.BEARER;


    @Column(nullable = false)
    private boolean expired;

    @Column(nullable = false)
    private boolean revoked;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
}
