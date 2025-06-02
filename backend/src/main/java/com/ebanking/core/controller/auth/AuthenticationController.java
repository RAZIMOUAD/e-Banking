package com.ebanking.core.controller.auth;

import com.ebanking.core.domain.base.user.User;
import com.ebanking.core.dto.auth.AuthenticationRequest;
import com.ebanking.core.dto.auth.AuthenticationResponse;
import com.ebanking.core.dto.auth.RegisterRequest;
import com.ebanking.core.dto.auth.TwoFactorRequest;
import com.ebanking.core.repository.sql.UserRepository;
import com.ebanking.core.service.auth.AuthenticationService;
import com.ebanking.core.service.token.JwtService;
import com.ebanking.core.service.token.SecurityTokenService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthenticationController {

    private final AuthenticationService service;
    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final SecurityTokenService securityTokenService;

    @PostMapping("/register")
    public ResponseEntity<AuthenticationResponse> register(
            @Valid @RequestBody RegisterRequest request
    ) {
        return ResponseEntity.ok(service.register(request));
    }

    @PostMapping("/authenticate")
    public ResponseEntity<AuthenticationResponse> authenticate(
            @Valid @RequestBody AuthenticationRequest request
    ) {
        try {
            return ResponseEntity.ok(service.authenticate(request));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(AuthenticationResponse.builder()
                            .message(e.getMessage())
                            .build());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(AuthenticationResponse.builder()
                            .message("Erreur interne du serveur : " + e.getMessage())
                            .build());
        }
    }


    @PostMapping("/verify-2fa")
    public ResponseEntity<?> verify2FA(@RequestBody TwoFactorRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new UsernameNotFoundException("Utilisateur introuvable"));

        boolean isCodeValid = securityTokenService.isTokenValid(user, request.getCode(), "TWO_FACTOR");

        if (!isCodeValid) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Code incorrect ou expiré"));
        }

        // Marquer le token comme utilisé
        var token = securityTokenService
                .getValidToken(user, request.getCode(), "TWO_FACTOR")
                .orElseThrow(); // devrait exister si validé
        securityTokenService.markTokenAsUsed(token);

        // Authentifier l'utilisateur (JWT)
        String accessToken = jwtService.generateToken(user);
        String refreshToken = jwtService.generateRefreshToken(user);

        return ResponseEntity.ok(
                AuthenticationResponse.builder()
                        .accessToken(accessToken)
                        .refreshToken(refreshToken)
                        .message("2FA réussi")
                        .requires2FA(false)
                        .build()
        );
    }

    @PostMapping("/refresh-token")
    public void refreshToken(
            HttpServletRequest request,
            HttpServletResponse response
    ) throws IOException {
        service.refreshToken(request, response);
    }
}
