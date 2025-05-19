package com.ebanking.core.config.initializer;

import com.ebanking.core.domain.base.enums.RoleType;
import com.ebanking.core.domain.base.personne.Personne;
import com.ebanking.core.domain.base.role.Role;
import com.ebanking.core.domain.base.user.User;
import com.ebanking.core.domain.base.UserRole;
import com.ebanking.core.repository.sql.RoleRepository;
import com.ebanking.core.repository.sql.UserRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
@RequiredArgsConstructor
public class AdminInitializer {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final UserRoleRepository userRoleRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${admin.email}")
    private String adminEmail;

    @Value("${admin.password}")
    private String adminPassword;

    @PostConstruct
    public void createAdminIfNotExists() {
        Optional<User> existingAdmin = userRepository.findByEmail(adminEmail);
        if (existingAdmin.isPresent()) return;

        Personne personne = Personne.builder()
                .nom("Super")
                .prenom("Admin")
                .email(adminEmail)
                .numTel("0000000000")
                .build();

        User admin = User.builder()
                .email(adminEmail)
                .motDePasse(passwordEncoder.encode(adminPassword))
                .personne(personne)
                .verifie(true)
                .bloque(false)
                .isActive(true)
                .isLocked(false)
                .twoFactorEnabled(false)
                .build();

        userRepository.save(admin);

        Role adminRole = roleRepository.findByName(RoleType.ADMIN)
                .orElseThrow(() -> new RuntimeException("Le rôle ADMIN est introuvable"));

        UserRole userRole = UserRole.builder()
                .user(admin)
                .role(adminRole)
                .build();

        userRoleRepository.save(userRole);
    }
}
