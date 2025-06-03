package com.ebanking.core.service.auth;


import com.twilio.Twilio;
import com.twilio.rest.verify.v2.service.Verification;
import com.twilio.rest.verify.v2.service.VerificationCheck;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class TwilioVerifyService {

    @Value("${twilio.accountSid}")
    private String accountSid;

    @Value("${twilio.authToken}")
    private String authToken;

    @Value("${twilio.verify.serviceSid}")
    private String verifyServiceSid;

    /**
     * Initialise le client Twilio une fois au démarrage.
     */
    @PostConstruct
    public void init() {
        Twilio.init(accountSid, authToken);
        log.info("✅ Twilio client initialisé");
    }

    /**
     * Envoie un code de vérification au numéro fourni.
     * @param phoneNumber format E.164 (ex: +212XXXXXXXXX)
     */
    public void sendVerificationCode(String phoneNumber) {
        Verification verification = Verification
                .creator(verifyServiceSid, phoneNumber, "sms")
                .create();

        log.info("📨 Code de vérification envoyé à {} : status={}", phoneNumber, verification.getStatus());
    }

    /**
     * Vérifie si le code fourni est correct.
     * @param phoneNumber format E.164 (ex: +212XXXXXXXXX)
     * @param code le code envoyé par SMS
     * @return true si le code est correct
     */
    public boolean verifyCode(String phoneNumber, String code) {
        VerificationCheck check = VerificationCheck
                .creator(verifyServiceSid)
                .setTo(phoneNumber)
                .setCode(code)
                .create();

        log.info("🔍 Vérification du code pour {} : status={}", phoneNumber, check.getStatus());

        return "approved".equals(check.getStatus());
    }
}