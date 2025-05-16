package com.ebanking.core.audit;

import org.springframework.data.domain.AuditorAware;

import java.util.Optional;

public class ApplicationAuditAware implements AuditorAware<String> {

    @Override
    public Optional<String> getCurrentAuditor() {
        // ⛔️ À améliorer plus tard pour détecter l’utilisateur connecté
        return Optional.of("system"); // Par défaut
    }
}
