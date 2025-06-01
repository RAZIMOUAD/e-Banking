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

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        var user = repository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));

        System.out.println("✅ Utilisateur trouvé : " + user.getEmail());

        // Vérifier si l'utilisateur a le rôle CLIENT
        boolean isClient = user.getUserRoles().stream()
                .anyMatch(userRole -> userRole.getRole().getName().name().equalsIgnoreCase("CLIENT"));

        if (isClient) {
            // Envoi du code 2FA par SMS uniquement pour les clients
            twilioVerifyService.sendVerificationCode(user.getPersonne().getNumTel());

            return AuthenticationResponse.builder()
                    .message("2FA_REQUIRED")
                    .requires2FA(true)
                    .build();
        }

        // Admin ou Agent : connexion immédiate sans 2FA
        var jwtToken = jwtService.generateToken(user);
        var refreshToken = jwtService.generateRefreshToken(user);
        revokeAllUserTokens(user);
        saveUserToken(user, jwtToken);

        return AuthenticationResponse.builder()
                .accessToken(jwtToken)
                .refreshToken(refreshToken)
                .requires2FA(false)
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

