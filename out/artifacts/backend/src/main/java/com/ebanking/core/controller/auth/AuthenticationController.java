package com.ebanking.core.controller.auth;


import com.ebanking.core.domain.base.user.User;
import com.ebanking.core.dto.auth.AuthenticationRequest;
import com.ebanking.core.dto.auth.AuthenticationResponse;
import com.ebanking.core.dto.auth.RegisterRequest;
import com.ebanking.core.dto.auth.TwoFactorRequest;
import com.ebanking.core.repository.sql.UserRepository;
import com.ebanking.core.service.auth.AuthenticationService;
import com.ebanking.core.service.auth.TwilioVerifyService;
import com.ebanking.core.service.token.JwtService;
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
    private final TwilioVerifyService twilioVerifyService;
    private final UserRepository userRepository;
    private final JwtService jwtService;

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
        } catch (Exception e) {
            e.printStackTrace(); // 🔥 Montre l'erreur exacte dans Tomcat
            throw e;
        }
    }

    @PostMapping("/refresh-token")
    public void refreshToken(
            HttpServletRequest request,
            HttpServletResponse response
    ) throws IOException {
        service.refreshToken(request, response);
    }

    @PostMapping("/verify-2fa")
    public ResponseEntity<?> verify2FA(@RequestBody TwoFactorRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new UsernameNotFoundException("Utilisateur introuvable"));

        boolean isCodeValid = twilioVerifyService.verifyCode(user.getPersonne().getNumTel(), request.getCode());

        if (!isCodeValid) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Code incorrect ou expiré"));
        }

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

}
