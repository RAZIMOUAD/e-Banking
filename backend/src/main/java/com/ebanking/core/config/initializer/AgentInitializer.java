package com.ebanking.core.config.initializer;

import com.ebanking.core.domain.base.UserRole;
import com.ebanking.core.domain.base.enums.RoleType;
import com.ebanking.core.domain.base.personne.Personne;
import com.ebanking.core.domain.base.role.Role;
import com.ebanking.core.domain.base.user.User;
import com.ebanking.core.repository.sql.RoleRepository;
import com.ebanking.core.repository.sql.UserRepository;
import com.ebanking.core.repository.sql.UserRoleRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
@RequiredArgsConstructor
public class AgentInitializer {
    @Value("${agent.email}")
    private String agentemail;
    @Value("${agent.password}")
    private String agentpassword;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private RoleRepository roleRepository;
    @Autowired
    private UserRoleRepository userRoleRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;
/**
    @PostConstruct
    public void createAgentIfNotExists() {
        Optional<User> existingAgent = userRepository.findByEmail(agentpassword);
        if (existingAgent.isPresent()) return;
        Personne personne = Personne.builder()
                .nom("Super")
                .prenom("Agent")
                .numTel("0789647357")
                .build();

        User agent = User.builder()
                .email(agentemail)
                .motDePasse(passwordEncoder.encode(agentpassword))
                .username("monagent")
                .personne(personne)
                .verifie(true)
                .bloque(false)
                .isActive(true)
                .isLocked(false)
                .twoFactorEnabled(false)
                .build();

      //  userRepository.save(agent);

        Role agentRole = roleRepository.findByName(RoleType.AGENT)
                .orElseThrow(() -> new RuntimeException("Le rôle AGENT est introuvable"));

        UserRole userRole = UserRole.builder()
                .user(agent)
                .role(agentRole)
                .build();

     //   userRoleRepository.save(userRole);

    }
    **/

}
