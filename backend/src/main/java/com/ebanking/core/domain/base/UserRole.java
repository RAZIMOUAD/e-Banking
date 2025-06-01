package com.ebanking.core.domain.base;

import com.ebanking.core.domain.base.role.Role;
import com.ebanking.core.domain.base.user.User;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "user_roles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserRole {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(optional = false)
    @JoinColumn(name = "role_id", nullable = false)
    private Role role;

    // 🚧 Optionnel pour les cas avancés (audit, permissions, etc.)
    // private boolean primaryRole;
}
