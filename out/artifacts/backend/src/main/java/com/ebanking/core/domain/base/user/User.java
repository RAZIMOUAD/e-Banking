package com.ebanking.core.domain.base.user;

import com.ebanking.core.domain.base.SecurityToken;
import com.ebanking.core.domain.base.UserRole;
import com.ebanking.core.domain.base.personne.Personne;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.*;
import java.util.stream.Collectors;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User implements UserDetails {

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

    // 🔒 2FA (à activer plus tard) modélisele 2FA.
    @Column(name = "two_factor_enabled")
    private boolean twoFactorEnabled;

    @Column(name = "two_factor_secret")
    private String twoFactorSecret;

    // 🔧 Statut général du compte
    @Column(name = "is_active")
    private boolean isActive ;

    @Column(name = "is_locked")
    private boolean isLocked ;

    @Temporal(TemporalType.TIMESTAMP)
    private Date createdAt;

    @Temporal(TemporalType.TIMESTAMP)
    private Date updatedAt;

    // ✅ Relations
    @OneToOne(cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @JoinColumn(name = "personne_id", nullable = false)
    private Personne personne;

    @Builder.Default
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    private Set<UserRole> userRoles = new HashSet<>();



    // 🔒 À activer plus tard
    @Builder.Default
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private Set<SecurityToken> tokens = new HashSet<>();


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

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return !isLocked;
    }

    @Override
    public boolean isEnabled() {
        return isActive;
    }

    @Override
    public String getUsername() {
        return email;
    }
    @Override
    public String getPassword() {
        return motDePasse;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return userRoles.stream()
                .map(userRole -> new SimpleGrantedAuthority("ROLE_" + userRole.getRole().getName().name()))
                .collect(Collectors.toSet());
    }



    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }
}
