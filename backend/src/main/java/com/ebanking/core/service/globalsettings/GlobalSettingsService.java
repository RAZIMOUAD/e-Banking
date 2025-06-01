package com.ebanking.core.service.globalsettings;

import com.ebanking.core.dto.globalsettings.GlobalSettingsRequest;
import com.ebanking.core.dto.globalsettings.GlobalSettingsResponse;

public interface GlobalSettingsService {
    GlobalSettingsResponse get();
    GlobalSettingsResponse update(GlobalSettingsRequest request);
}
