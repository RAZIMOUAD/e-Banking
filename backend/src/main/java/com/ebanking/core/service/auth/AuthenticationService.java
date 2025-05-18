package com.ebanking.core.service.auth;


import com.ebanking.core.domain.base.enums.TokenType;
import com.ebanking.core.domain.base.token.Token;
import com.ebanking.core.domain.base.user.User;
import com.ebanking.core.dto.auth.AuthenticationRequest;
import com.ebanking.core.dto.auth.AuthenticationResponse;
import com.ebanking.core.dto.auth.RegisterRequest;
import com.ebanking.core.repository.sql.RoleRepository;
import com.ebanking.core.repository.sql.TokenRepository;
import com.ebanking.core.repository.sql.UserRepository;

import com.ebanking.core.service.token.JwtService;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.io.IOException;

@Service
@RequiredArgsConstructor
public class AuthenticationService {

    private final UserRepository repository;
    private final TokenRepository tokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final RoleRepository roleRepository;
    private final RegistrationService registrationService;
    private final TwilioVerifyService twilioVerifyService;

    public AuthenticationResponse register(RegisterRequest request) {
        return registrationService.register(request);
    }

    public AuthenticationResponse authenticate(AuthenticationRequest request) {
        System.out.println("Tentative d'authentification : " + request.getEmail());

        // Étape 1 : vérifier les identifiants
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        var user = repository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));

        System.out.println("✅ Utilisateur trouvé : " + user.getEmail());

        // ✉️ Étape 2 : envoi du code SMS 2FA pour tout le monde (même si twoFactorEnabled = false)
        twilioVerifyService.sendVerificationCode(user.getPersonne().getNumTel());

        // 🔁 Ne pas encore générer les tokens
        return AuthenticationResponse.builder()
                .message("2FA_REQUIRED")
                .requires2FA(true)
                .build();
    }




    private void saveUserToken(User user, String jwtToken) {
        var token = Token.builder()
                .user(user)
                .token(jwtToken)
                .tokenType(TokenType.BEARER)
                .expired(false)
                .revoked(false)
                .build();

        tokenRepository.save(token);
    }

    private void revokeAllUserTokens(User user) {
        var validUserTokens = tokenRepository.findAllValidTokenByUser(user.getId());
        if (validUserTokens.isEmpty()) return;

        validUserTokens.forEach(token -> {
            token.setExpired(true);
            token.setRevoked(true);
        });

        tokenRepository.saveAll(validUserTokens);
    }

    public void refreshToken(HttpServletRequest request, HttpServletResponse response) throws IOException {
        final String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);
        final String refreshToken;
        final String userEmail;

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return;
        }

        refreshToken = authHeader.substring(7);
        userEmail = jwtService.extractUsername(refreshToken);

        if (userEmail != null) {
            var user = this.repository.findByEmail(userEmail).orElseThrow();
            if (jwtService.isTokenValid(refreshToken, user)) {
                var accessToken = jwtService.generateToken(user);
                revokeAllUserTokens(user);
                saveUserToken(user, accessToken);
                var authResponse = AuthenticationResponse.builder()
                        .accessToken(accessToken)
                        .refreshToken(refreshToken)
                        .build();
                new ObjectMapper().writeValue(response.getOutputStream(), authResponse);
            }
        }
    }
}

