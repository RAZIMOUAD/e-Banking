package com.ebanking.core.domain.base;

import jakarta.persistence.*;
import lombok.*;

import java.util.*;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 100)
    private String username;

    @Column(nullable = false, unique = true, length = 150)
    private String email;

    @Column(nullable = false)
    private String motDePasse;

    @Column(nullable = false)
    private boolean verifie;

    @Column(nullable = false)
    private boolean bloque;

    @Column(name = "tentatives_echouees")
    private int tentativesEchouees;

    @Temporal(TemporalType.TIMESTAMP)
    private Date lastLogin;

    // 🔒 2FA (à activer plus tard)
    @Column(name = "two_factor_enabled")
    private boolean twoFactorEnabled;

    @Column(name = "two_factor_secret")
    private String twoFactorSecret;

    // 🔧 Statut général du compte
    @Column(name = "is_active")
    private boolean isActive = true;

    @Column(name = "is_locked")
    private boolean isLocked = false;

    @Temporal(TemporalType.TIMESTAMP)
    private Date createdAt;

    @Temporal(TemporalType.TIMESTAMP)
    private Date updatedAt;

    // ✅ Relations
    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "user_roles",
            joinColumns = @JoinColumn(name = "id_user"),
            inverseJoinColumns = @JoinColumn(name = "id_role")
    )
    private Set<Role> roles = new HashSet<>();

    // 🔒 À activer plus tard
    // @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    // private Set<SecurityToken> tokens = new HashSet<>();

    // @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    // private Set<TentativeConnexion> connexions = new HashSet<>();

    @PrePersist
    protected void onCreate() {
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = new Date();
    }
}
