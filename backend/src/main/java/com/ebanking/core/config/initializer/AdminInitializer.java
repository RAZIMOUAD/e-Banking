package com.ebanking.core.config.initializer;

import com.ebanking.core.domain.base.UserRole;
import com.ebanking.core.domain.base.admin.Admin;
import com.ebanking.core.domain.base.enums.RoleType;
import com.ebanking.core.domain.base.role.Role;
import com.ebanking.core.domain.base.user.User;
import com.ebanking.core.repository.sql.RoleRepository;
import com.ebanking.core.repository.sql.UserRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Date;

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
        userRepository.findByEmail(adminEmail).ifPresentOrElse(
                admin -> log.info("🔁 Compte admin déjà existant : {}", adminEmail),
                this::createAdminAccount
        );
    }

    private void createAdminAccount() {
        log.info("⚙️ Création du compte admin par défaut...");

        Role adminRole = roleRepository.findByName(RoleType.ADMIN)
                .orElseThrow(() -> new IllegalStateException("❌ Le rôle ADMIN est introuvable en base."));

        Admin adminPersonne = Admin.builder()
                .nom("Super")
                .prenom("Admin")
                .genre("Homme")
                .nationalite("Marocaine")
                .numTel("+212600000000")
                .adresse("ENSA Marrakech")
                .cin("AA123456")
                .dateNaissance(new Date())
                .build();

        User adminUser = User.builder()
                .email(adminEmail)
                .username(adminEmail)
                .motDePasse(passwordEncoder.encode(adminPassword))
                .personne(adminPersonne)
                .verifie(true)
                .bloque(false)
                .isActive(true)
                .isLocked(false)
                .twoFactorEnabled(false)
                .build();

        UserRole userRole = UserRole.builder()
                .user(adminUser)
                .role(adminRole)
                .build();

        adminUser.getUserRoles().add(userRole);

        userRepository.save(adminUser);

        log.info("✅ Compte admin créé avec succès : {}", adminEmail);
    }
}
