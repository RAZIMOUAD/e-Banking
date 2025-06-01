package com.ebanking.core.service.devise;


import com.ebanking.core.domain.base.devise.Devise;
import com.ebanking.core.dto.devise.DeviseRequest;
import com.ebanking.core.dto.devise.DeviseResponse;

import java.util.List;
import java.util.Optional;

public interface DeviseService {
    List<DeviseResponse> findAll();
    DeviseResponse findById(Long id);
    DeviseResponse save(DeviseRequest request);
    DeviseResponse update(Long id, DeviseRequest request);
    void delete(Long id);
}
