package com.ebanking.core.controller.auth;

import com.ebanking.core.dto.auth.ActivationRequest;
import com.ebanking.core.service.auth.ActivationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
@Validated
public class ActivationController {

    private final ActivationService activationService;

    @PostMapping("/activate")
    public ResponseEntity<?> activateAccount(@RequestBody ActivationRequest request) {
        log.info("📨 Demande d'activation pour : {}", request.getEmail());
        log.info("🔢 Code soumis : {}", request.getCode());

        try {
            activationService.activateUser(request); // ✅ ici on passe l'objet entier
            return ResponseEntity.ok(Map.of("message", "Compte activé avec succès"));
        } catch (IllegalArgumentException e) {
            log.warn("❌ Erreur d'activation : {}", e.getMessage());
            throw e;
        } catch (Exception e) {
            log.error("🔥 Erreur inattendue lors de l'activation", e);
            throw new RuntimeException("Erreur interne lors de l'activation");
        }
    }

}
