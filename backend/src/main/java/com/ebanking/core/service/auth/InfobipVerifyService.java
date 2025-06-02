package com.ebanking.core.service.auth;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class InfobipVerifyService {

    @Value("${infobip.api.key}")
    private String apiKey;

    @Value("${infobip.base.url}")
    private String baseUrl;

    @Value("${infobip.sender}")
    private String sender;

    private final RestTemplate restTemplate = new RestTemplate();

    private static final String SMS_PATH = "/sms/2/text/advanced";

    /**
     * Envoie un code de vérification via Infobip SMS API.
     */
    public void sendVerificationCode(String phoneNumber, String code) {
        String url = baseUrl + SMS_PATH;

        // Construction du payload
        Map<String, Object> message = Map.of(
                "from", sender,
                "destinations", List.of(Map.of("to", phoneNumber)),
                "text", "Votre code de vérification est : " + code
        );

        Map<String, Object> payload = Map.of("messages", List.of(message));

        // Préparation des headers
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(apiKey.replaceFirst("^App\\s+", "")); // Juste au cas où
        headers.set("Authorization", "App " + apiKey);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(payload, headers);

        try {
            ResponseEntity<String> response = restTemplate.exchange(
                    url,
                    HttpMethod.POST,
                    entity,
                    String.class
            );

            if (response.getStatusCode().is2xxSuccessful()) {
                log.info("✅ Code envoyé avec succès au numéro ***{} — Status: {}",
                        maskPhoneNumber(phoneNumber),
                        response.getStatusCode());
            } else {
                log.warn("⚠️ Réponse non réussie d’Infobip : {}", response);
            }

        } catch (RestClientException e) {
            log.error("❌ Erreur d’envoi du code à {} : {}", maskPhoneNumber(phoneNumber), e.getMessage());
            // Tu peux repropager ici une exception métier si nécessaire
        }
    }

    /**
     * Masque le numéro sauf les 4 derniers chiffres.
     */
    private String maskPhoneNumber(String number) {
        if (number == null || number.length() < 4) return "****";
        return "****" + number.substring(number.length() - 4);
    }
}
