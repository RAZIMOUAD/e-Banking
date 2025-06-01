package com.ebanking.core.dto.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class TwoFactorRequest {
    @Email
    private String email;

    @NotBlank
    private String code;
}

