package com.ebanking.core.service.email;

public interface EmailService {
    void sendActivationEmail(String to, String code);
}
