package com.ebanking.core.service.auth;

import com.ebanking.core.domain.base.SecurityToken;
import com.ebanking.core.domain.base.UserRole;
import com.ebanking.core.domain.base.client.Client;
import com.ebanking.core.domain.base.enums.RoleType;
import com.ebanking.core.domain.base.role.Role;
import com.ebanking.core.domain.base.token.SecurityTokenType;
import com.ebanking.core.domain.base.user.User;
import com.ebanking.core.dto.auth.AuthenticationResponse;
import com.ebanking.core.dto.auth.RegisterRequest;
import com.ebanking.core.exception.EmailAlreadyUsedException;
import com.ebanking.core.repository.sql.RoleRepository;
import com.ebanking.core.repository.sql.TokenRepository;
import com.ebanking.core.repository.sql.UserRepository;
import com.ebanking.core.service.email.EmailService;
import com.ebanking.core.service.token.JwtService;
import com.ebanking.core.service.token.SecurityTokenService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.UUID;
@Service
@RequiredArgsConstructor
@Slf4j
public class RegistrationService {

    private final UserRepository repository;
    private final TokenRepository tokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final HttpServletRequest request;
    private final RoleRepository roleRepository;
    private final SecurityTokenService securityTokenService;
    private final EmailService emailService;

    @Transactional
    public AuthenticationResponse register(RegisterRequest request) {
        log.info("📥 Reçu une requête d'enregistrement pour email={}", request.getEmail());

        if (repository.findByEmail(request.getEmail()).isPresent()) {
            log.warn("⚠️ Email déjà utilisé : {}", request.getEmail());
            throw new EmailAlreadyUsedException("Un compte existe déjà avec cet email");
        }

        // Construction des objets
        var client = buildClientFromRequest(request);
        log.info("🧾 Client construit : {}", client);

        var user = buildUserFromRequest(request, client);
        log.info("🧾 User construit (sans rôles encore) : {}", user);

        try {
            assignClientRole(user);
            log.info("🎯 Rôle CLIENT attribué à l’utilisateur");
        } catch (Exception e) {
            log.error("❌ Échec lors de l’attribution du rôle CLIENT : {}", e.getMessage(), e);
            throw new RuntimeException("Erreur d’attribution du rôle", e);
        }

        // Sauvegarde en base de données
        User savedUser;
        try {
            savedUser = repository.save(user);
            log.info("✅ Utilisateur sauvegardé avec ID={} et email={}", savedUser.getId(), savedUser.getEmail());
        } catch (Exception e) {
            log.error("💥 Erreur lors du save(user) : {}", e.getMessage(), e);
            log.error("📋 Données de User : {}", user);
            log.error("📋 Données de Client : {}", client);
            throw new RuntimeException("Erreur lors de la sauvegarde de l’utilisateur", e);
        }

        // Génération du token d’activation
        String ip = extractClientIpAddress();
        log.info("🌐 IP client détectée : {}", ip);

        SecurityToken token;
        try {
            token = securityTokenService.createToken(savedUser, SecurityTokenType.ACTIVATION, ip);
            log.info("🔑 Token d’activation généré : {}", token.getCode());
        } catch (Exception e) {
            log.error("❌ Erreur lors de la génération du token d’activation : {}", e.getMessage(), e);
            throw e;
        }

        // Envoi de l'email d'activation
        try {
            emailService.sendActivationEmail(savedUser.getEmail(), token.getCode());
            log.info("📧 Email d’activation envoyé à {}", savedUser.getEmail());
        } catch (Exception e) {
            log.error("❌ Erreur lors de l’envoi de l’email d’activation : {}", e.getMessage(), e);
            throw new RuntimeException("Erreur lors de l’envoi de l’email", e);
        }

        return AuthenticationResponse.builder()
                .message("Compte créé. Un code d’activation a été envoyé à votre email.")
                .build();
    }

    private Client buildClientFromRequest(RegisterRequest request) {
        return Client.builder()
                .nom(request.getNom())
                .prenom(request.getPrenom())
                .dateNaissance(request.getDateNaissance())
                .genre(request.getGenre())
                .nationalite(request.getNationalite())
                .numTel(request.getNumTel())
                .adresse(request.getAdresse())
                .cin(request.getCin())
                .dateEnrolement(new Date())
                .valideParAgent(false)
                .status("EN_ATTENTE")
                .build();
    }

    private User buildUserFromRequest(RegisterRequest request, Client client) {
        return User.builder()
                .email(request.getEmail())
                .username(request.getEmail())
                .motDePasse(passwordEncoder.encode(request.getPassword()))
                .verifie(false)
                .isActive(true)
                .isLocked(false)
                .personne(client)
                .twoFactorEnabled(true)
                .twoFactorSecret(UUID.randomUUID().toString())
                .build();
    }

    private void assignClientRole(User user) {
        Role clientRole = roleRepository.findByName(RoleType.CLIENT)
                .orElseThrow(() -> new IllegalStateException("Rôle CLIENT introuvable"));
        user.getUserRoles().add(UserRole.builder().user(user).role(clientRole).build());
    }

    private String extractClientIpAddress() {
        String xfHeader = request.getHeader("X-Forwarded-For");
        return (xfHeader == null) ? request.getRemoteAddr() : xfHeader.split(",")[0];
    }
}
