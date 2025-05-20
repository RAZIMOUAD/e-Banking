package com.ebanking.core.config.initializer;

import com.ebanking.core.domain.base.enums.RoleType;
import com.ebanking.core.domain.base.personne.AdminPersonne;
import com.ebanking.core.domain.base.role.Role;
import com.ebanking.core.domain.base.user.User;
import com.ebanking.core.domain.base.UserRole;
import com.ebanking.core.repository.sql.RoleRepository;
import com.ebanking.core.repository.sql.UserRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Date;
import java.util.Optional;

@Component
@RequiredArgsConstructor
@Slf4j
public class AdminInitializer {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${admin.email}")
    private String adminEmail;

    @Value("${admin.password}")
    private String adminPassword;

    @PostConstruct
    public void createAdminIfNotExists() {
        Optional<User> existingAdmin = userRepository.findByEmail(adminEmail);
        if (existingAdmin.isPresent()) {
            log.info("🔁 Admin déjà existant avec email : {}", adminEmail);
            return;
        }

        Role adminRole = roleRepository.findByName(RoleType.ADMIN)
                .orElseThrow(() -> new RuntimeException("Rôle ADMIN introuvable dans la base"));

        AdminPersonne personne = AdminPersonne.builder()
                .nom("Super")
                .prenom("Admin")
                .genre("Homme")
                .nationalite("Marocaine")
                .numTel("0000000000")
                .adresse("ENSA Marrakech")
                .cin("AA123456")
                .dateNaissance(new Date())
                .build();

        User admin = User.builder()
                .email(adminEmail)
                .username(adminEmail) // ✅ AJOUT ESSENTIEL ICI
                .motDePasse(passwordEncoder.encode(adminPassword))
                .personne(personne)
                .verifie(true)
                .bloque(false)
                .isActive(true)
                .isLocked(false)
                .twoFactorEnabled(false)
                .build();


        UserRole userRole = UserRole.builder()
                .user(admin)
                .role(adminRole)
                .build();

        admin.getUserRoles().add(userRole); // ❗ important pour persister via cascade

        userRepository.save(admin);
        log.info("✅ Compte admin créé avec succès : {}", adminEmail);
    }
}
