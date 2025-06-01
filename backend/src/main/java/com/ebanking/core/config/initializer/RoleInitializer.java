package com.ebanking.core.config.initializer;

import com.ebanking.core.domain.base.enums.RoleType;
import com.ebanking.core.domain.base.role.Role;
import com.ebanking.core.repository.sql.RoleRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class RoleInitializer {

    private final RoleRepository roleRepository;

    @PostConstruct
    public void initRoles() {
        for (RoleType roleType : RoleType.values()) {
            roleRepository.findByName(roleType).ifPresentOrElse(
                    role -> log.info("✔️ Rôle [{}] déjà présent.", roleType),
                    () -> {
                        Role role = Role.builder()
                                .name(roleType)
                                .description("Rôle par défaut: " + roleType.name())
                                .niveauAcces(getAccessLevel(roleType))
                                .build();
                        roleRepository.save(role);
                        log.info("➕ Rôle [{}] ajouté à la base de données.", roleType);
                    }
            );
        }
    }

    private int getAccessLevel(RoleType type) {
        return switch (type) {
            case ADMIN -> 5;
            case AGENT -> 3;
            case CLIENT -> 1;
        };
    }
}
