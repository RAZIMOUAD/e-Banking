package com.ebanking.core.config.initializer;

import com.ebanking.core.domain.base.globalsettings.GlobalSettings;
import com.ebanking.core.repository.sql.GlobalSettingsRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class SettingsInitializer {

    private final GlobalSettingsRepository repo;

    @PostConstruct
    public void init() {
        if (repo.count() == 0) {
            repo.save(GlobalSettings.builder()
                    .tauxCommission(0.02)
                    .plafondVirement(10000.0)
                    .fraisFixes(5.0)
                    .build()
            );
        }
    }
}
