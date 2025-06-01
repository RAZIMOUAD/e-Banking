package com.ebanking.core.service.auth;

import com.ebanking.core.domain.base.token.SecurityTokenType;
import com.ebanking.core.domain.base.user.User;
import com.ebanking.core.dto.auth.ActivationRequest;
import com.ebanking.core.repository.sql.UserRepository;
import com.ebanking.core.service.token.SecurityTokenService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ActivationService {

    private final UserRepository userRepository;
    private final SecurityTokenService securityTokenService;

    @Transactional
    public void activateUser(ActivationRequest request) {
        System.out.println("📨 Demande d'activation pour : " + request.getEmail());
        System.out.println("🔢 Code soumis : " + request.getCode());

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new UsernameNotFoundException("Utilisateur non trouvé"));

        boolean isValid = securityTokenService.isTokenValid(
                user,
                request.getCode(),
                SecurityTokenType.ACTIVATION
        );

        if (!isValid) {
            System.out.println("❌ Code invalide ou expiré pour l'utilisateur : " + user.getEmail());
            throw new IllegalArgumentException("Code invalide ou expiré");
        }

        System.out.println("✅ Code correct. Activation du compte : " + user.getEmail());

        securityTokenService.expireAllTokensForUser(user, SecurityTokenType.ACTIVATION);
        user.setVerifie(true);
        userRepository.save(user);
    }

}
