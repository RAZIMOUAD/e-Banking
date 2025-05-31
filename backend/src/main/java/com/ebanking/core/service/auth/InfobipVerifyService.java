package com.ebanking.core.service.auth;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
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

    /**
     * Envoie un code de vérification par SMS via Infobip.
     */
    public void sendVerificationCode(String phoneNumber, String code) {
        String url = baseUrl + "/sms/2/text/advanced";

        Map<String, Object> request = new HashMap<>();
        request.put("messages", new Object[]{
                Map.of(
                        "from", sender,
                        "destinations", new Object[]{Map.of("to", phoneNumber)},
                        "text", "Votre code de vérification est : " + code
                )
        });

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("Authorization", "App " + apiKey);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(request, headers);

        try {
            ResponseEntity<String> response = restTemplate.postForEntity(url, entity, String.class);
            log.info("✅ SMS envoyé à {} - Status: {}", phoneNumber, response.getStatusCode());
        } catch (Exception e) {
            log.error("❌ Échec de l'envoi du SMS à {} : {}", phoneNumber, e.getMessage());
        }
    }
}
