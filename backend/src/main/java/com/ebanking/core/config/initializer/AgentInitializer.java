package com.ebanking.core.config.initializer;

import com.ebanking.core.domain.base.UserRole;
import com.ebanking.core.domain.base.agent.Agent;
import com.ebanking.core.domain.base.enums.RoleType;
import com.ebanking.core.domain.base.role.Role;
import com.ebanking.core.domain.base.user.User;
import com.ebanking.core.repository.sql.AgentRepository;
import com.ebanking.core.repository.sql.RoleRepository;
import com.ebanking.core.repository.sql.UserRepository;
import com.ebanking.core.repository.sql.UserRoleRepository;
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
public class AgentInitializer {

    @Value("${agent.email}")
    private String agentEmail;

    @Value("${agent.password}")
    private String agentPassword;

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final UserRoleRepository userRoleRepository;
    private final AgentRepository agentRepository;
    private final PasswordEncoder passwordEncoder;

    @PostConstruct
    public void createAgentIfNotExists() {
        Optional<User> existingAgent = userRepository.findByEmail(agentEmail);
        if (existingAgent.isPresent()) {
            log.info("✅ L’agent avec l’email '{}' existe déjà. Initialisation ignorée.", agentEmail);
            return;
        }

        try {
            Agent agentPersonne = Agent.builder()
                    .nom("Super")
                    .prenom("Agent")
                    .numTel("0789647357")
                    .dateNaissance(new Date(90, 0, 1)) // 01/01/1990
                    .genre("Homme")
                    .nationalite("Marocaine")
                    .adresse("Casablanca")
                    .cin("AA123456")
                    .dateEmbauche(new Date())
                    .service("Support Technique")
                    .matricule("AGT001")
                    .build();

            // 🔒 Persiste Agent manuellement pour s'assurer qu'il est bien géré par le contexte JPA
            agentPersonne = agentRepository.save(agentPersonne);

            User agentUser = User.builder()
                    .email(agentEmail)
                    .motDePasse(passwordEncoder.encode(agentPassword))
                    .username("monagent")
                    .personne(agentPersonne)
                    .verifie(true)
                    .bloque(false)
                    .isActive(true)
                    .isLocked(false)
                    .twoFactorEnabled(false)
                    .build();

            userRepository.save(agentUser);

            Role agentRole = roleRepository.findByName(RoleType.AGENT)
                    .orElseThrow(() -> new IllegalStateException("❌ Le rôle AGENT est introuvable."));

            UserRole userRole = UserRole.builder()
                    .user(agentUser)
                    .role(agentRole)
                    .build();

            userRoleRepository.save(userRole);

            log.info("✅ Agent initialisé avec succès : email='{}', rôle='{}'", agentEmail, RoleType.AGENT);

        } catch (Exception e) {
            log.error("❌ Échec de l’initialisation de l’agent : {}", e.getMessage(), e);
        }
    }
}
