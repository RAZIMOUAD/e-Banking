package com.ebanking.core.service.globalsettings;

import com.ebanking.core.domain.base.globalsettings.GlobalSettings;
import com.ebanking.core.dto.globalsettings.GlobalSettingsRequest;
import com.ebanking.core.dto.globalsettings.GlobalSettingsResponse;
import com.ebanking.core.repository.sql.GlobalSettingsRepository;
import com.ebanking.core.service.globalsettings.GlobalSettingsService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class GlobalSettingsServiceImpl implements GlobalSettingsService {

    private final GlobalSettingsRepository repo;

    @Override
    public GlobalSettingsResponse get() {
        GlobalSettings s = repo.findAll().stream().findFirst()
                .orElseThrow(() -> new RuntimeException("Paramètres non trouvés"));

        return toDto(s);
    }

    @Override
    public GlobalSettingsResponse update(GlobalSettingsRequest request) {
        GlobalSettings s = repo.findAll().stream().findFirst()
                .orElseThrow(() -> new RuntimeException("Paramètres non trouvés"));

        s.setTauxCommission(request.getTauxCommission());
        s.setPlafondVirement(request.getPlafondVirement());
        s.setFraisFixes(request.getFraisFixes());

        return toDto(repo.save(s));
    }

    // Méthode utilitaire de mapping
    private GlobalSettingsResponse toDto(GlobalSettings s) {
        return GlobalSettingsResponse.builder()
                .tauxCommission(s.getTauxCommission())
                .plafondVirement(s.getPlafondVirement())
                .fraisFixes(s.getFraisFixes())
                .build();
    }
}
