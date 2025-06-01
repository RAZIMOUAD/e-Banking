package com.ebanking.core.domain.base;

import com.ebanking.core.domain.base.user.User;
import jakarta.persistence.*;
import lombok.*;
import java.util.Date;

@Entity
@Table(name = "security_tokens")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SecurityToken {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 8)
    private String code;

    @Column(nullable = false, length = 20)
    private String type; // Exemple : "2FA", "RESET_PASSWORD","VERIFY_EMAIL"

    @Column(nullable = false)
    private boolean usageUnique;

    @Column(nullable = false)
    private String status; // Exemple : "VALID", "EXPIRED", "USED"

    @Temporal(TemporalType.TIMESTAMP)
    @Column(nullable = false)
    private Date expiration;

    @Column(length = 45)
    private String ip;

    // 🔐 Association avec l'utilisateur
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
}
