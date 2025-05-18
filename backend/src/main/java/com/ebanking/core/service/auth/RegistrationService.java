package com.ebanking.core.service.auth;

import com.ebanking.core.domain.base.SecurityToken;
import com.ebanking.core.domain.base.UserRole;
import com.ebanking.core.domain.base.client.Client;
import com.ebanking.core.domain.base.enums.RoleType;
import com.ebanking.core.domain.base.enums.TokenType;
import com.ebanking.core.domain.base.role.Role;
import com.ebanking.core.domain.base.token.SecurityTokenType;
import com.ebanking.core.domain.base.token.Token;
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
        if (repository.findByEmail(request.getEmail()).isPresent()) {
            throw new EmailAlreadyUsedException("Un compte existe déjà avec cet email");
        }

        var client = buildClientFromRequest(request);
        var user = buildUserFromRequest(request, client);
        assignClientRole(user);

        var savedUser = repository.save(user);
        log.info("👤 Nouvel utilisateur enregistré avec l’email {}", savedUser.getEmail());

        // Génération et envoi du code d’activation
        String ip = extractClientIpAddress();
        SecurityToken token = securityTokenService.createToken(savedUser, SecurityTokenType.ACTIVATION, ip);
        emailService.sendActivationEmail(savedUser.getEmail(), token.getCode());

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
                .twoFactorEnabled(true) // ✅ Active 2FA directement
                .twoFactorSecret(UUID.randomUUID().toString()) // pour tracking / TOTP plus tard
                .build();
    }

    private void assignClientRole(User user) {
        Role clientRole = roleRepository.findByName(RoleType.CLIENT)
                .orElseThrow(() -> new IllegalStateException("Rôle CLIENT introuvable"));

        user.getUserRoles().add(
                UserRole.builder().user(user).role(clientRole).build()
        );
    }

    private String extractClientIpAddress() {
        String xfHeader = request.getHeader("X-Forwarded-For");
        return (xfHeader == null) ? request.getRemoteAddr() : xfHeader.split(",")[0];
    }
}
