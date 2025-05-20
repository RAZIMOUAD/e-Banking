package com.ebanking.core.repository.sql;

import com.ebanking.core.domain.base.globalsettings.GlobalSettings;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GlobalSettingsRepository extends JpaRepository<GlobalSettings, Long> {
}
