package com.ebanking.core.service.devise;

import com.ebanking.core.domain.base.devise.Devise;
import com.ebanking.core.dto.devise.DeviseRequest;
import com.ebanking.core.dto.devise.DeviseResponse;
import com.ebanking.core.repository.sql.DeviseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;


@Service
@RequiredArgsConstructor
public class DeviseServiceImpl implements DeviseService {

    private final DeviseRepository deviseRepository;

    @Override
    public List<DeviseResponse> findAll() {
        System.out.println("➡️ Appel de findAll dans DeviseServiceImpl");

        List<Devise> devises = deviseRepository.findAll();
        System.out.println("📦 Nombre de devises récupérées : " + devises.size());

        return devises.stream()
                .map(this::toDto)
                .toList();
    }


    @Override
    public DeviseResponse findById(Long id) {
        Devise devise = deviseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Devise introuvable"));
        return toDto(devise);
    }

    @Override
    public DeviseResponse save(DeviseRequest request) {
        Devise devise = toEntity(request);
        return toDto(deviseRepository.save(devise));
    }

    @Override
    public DeviseResponse update(Long id, DeviseRequest request) {
        Devise devise = deviseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Devise introuvable"));

        devise.setCode(request.getCode());
        devise.setLibelle(request.getLibelle());
        devise.setTauxConversion(request.getTauxConversion());

        return toDto(deviseRepository.save(devise));
    }

    @Override
    public void delete(Long id) {
        deviseRepository.deleteById(id);
    }

    // === Mapping methods ===

    private Devise toEntity(DeviseRequest dto) {
        return Devise.builder()
                .code(dto.getCode())
                .libelle(dto.getLibelle())
                .tauxConversion(dto.getTauxConversion())
                .build();
    }

    private DeviseResponse toDto(Devise devise) {
        return DeviseResponse.builder()
                .id(devise.getId())
                .code(devise.getCode())
                .libelle(devise.getLibelle())
                .tauxConversion(devise.getTauxConversion())
                .build();
    }
}
