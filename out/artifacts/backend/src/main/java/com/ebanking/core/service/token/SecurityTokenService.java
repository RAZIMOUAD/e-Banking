package com.ebanking.core.service.token;

import com.ebanking.core.domain.base.SecurityToken;
import com.ebanking.core.domain.base.enums.SecurityTokenStatus;
import com.ebanking.core.domain.base.user.User;
import com.ebanking.core.repository.sql.SecurityTokenRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.util.Date;

@Service
@RequiredArgsConstructor
public class SecurityTokenService {

    private final SecurityTokenRepository securityTokenRepository;

    private static final int EXPIRATION_MINUTES = 10; // configurable si besoin

    /**
     * Génère un code numérique à 8 chiffres.
     */
    public String generate8DigitCode() {
        SecureRandom random = new SecureRandom();
        int code = 10000000 + random.nextInt(90000000);
        return String.valueOf(code);
    }

    /**
     * Crée et enregistre un token de sécurité lié à un utilisateur.
     */
    public SecurityToken createToken(User user, String type, String ip) {
        String code = generate8DigitCode();

        SecurityToken token = SecurityToken.builder()
                .code(code)
                .type(type.toUpperCase()) // 🔐 normalisation importante
                .usageUnique(true)
                .status(SecurityTokenStatus.VALID.name())
                .expiration(new Date(System.currentTimeMillis() + EXPIRATION_MINUTES * 60 * 1000))
                .ip(ip)
                .user(user)
                .build();
        System.out.println("📤 Token créé : code=" + code + ", type=" + type.toUpperCase() + ", email=" + user.getEmail());

        return securityTokenRepository.save(token);
    }

    /**
     * Vérifie si un token est valide, non expiré et toujours utilisable.
     */
    public boolean isTokenValid(User user, String code, String type) {
        System.out.println("🔍 [isTokenValid] Vérification du token");
        System.out.println(" → Utilisateur : " + user.getEmail());
        System.out.println(" → Code reçu   : " + code);
        System.out.println(" → Type attendu: " + type.toUpperCase());

        var tokenOpt = securityTokenRepository
                .findValidTokenByUserIdAndCode(
                        user.getId(),
                        code,
                        type.toUpperCase(),
                        SecurityTokenStatus.VALID.name()
                );

        if (tokenOpt.isEmpty()) {
            System.out.println("❌ Aucun token trouvé avec ce code et ce statut.");
            System.out.println("📦 Listing des tokens existants pour l'utilisateur :");
            securityTokenRepository.findAllByUserAndType(user, type.toUpperCase())
                    .forEach(t -> System.out.printf(" - code=%s | status=%s | exp=%s%n",
                            t.getCode(), t.getStatus(), t.getExpiration()));
            return false;
        }

        SecurityToken token = tokenOpt.get();
        boolean expired = token.getExpiration().before(new Date());

        if (expired) {
            System.out.println("⛔ Le token est expiré. Expiration : " + token.getExpiration());
        } else {
            System.out.println("✅ Le token est valide et encore actif.");
        }

        return !expired;
    }


    /**
     * Marque un token comme utilisé.
     */
    public void markTokenAsUsed(SecurityToken token) {
        token.setStatus(SecurityTokenStatus.USED.name());
        securityTokenRepository.save(token);
    }

    /**
     * Expire tous les tokens d’un type donné pour un utilisateur.
     */
    public void expireAllTokensForUser(User user, String type) {
        var tokens = securityTokenRepository.findAllByUserAndType(user, type.toUpperCase());
        tokens.forEach(token -> token.setStatus(SecurityTokenStatus.EXPIRED.name()));
        securityTokenRepository.saveAll(tokens);
    }
}
