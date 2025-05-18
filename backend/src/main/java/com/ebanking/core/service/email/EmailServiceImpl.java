package com.ebanking.core.service.email;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailServiceImpl implements EmailService {

    private final JavaMailSender mailSender;

    // Adresse statique pour tests avec MailDev
    private final String from = "no-reply@ebanking.local";

    @Override
    public void sendActivationEmail(String to, String code) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, "UTF-8");

            helper.setTo(to);
            helper.setSubject("Activation de votre compte e-banking");
            helper.setFrom(from); // Utilisation de l'adresse statique

            String content = buildHtmlContent(code);
            helper.setText(content, true); // true = HTML

            mailSender.send(message);
        } catch (MessagingException e) {
            throw new IllegalStateException("Échec de l’envoi de l’email : " + e.getMessage());
        }
    }

    private String buildHtmlContent(String code) {
        String template = """
        <!DOCTYPE html>
        <html lang="fr">
          <head>
            <meta charset="UTF-8">
            <style>
              body {
                font-family: 'Arial', sans-serif;
                background-color: #f4f4f4;
                padding: 20px;
              }
              .container {
                background-color: #ffffff;
                border-radius: 8px;
                padding: 30px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                max-width: 500px;
                margin: auto;
              }
              .code {
                font-size: 24px;
                font-weight: bold;
                color: #2c3e50;
                letter-spacing: 3px;
                margin: 20px 0;
              }
              .footer {
                font-size: 12px;
                color: #999999;
                margin-top: 30px;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <h2>Bienvenue chez eBanking !</h2>
              <p>Merci pour votre inscription. Voici votre code de validation :</p>
              <div class="code">%s</div>
              <p>Ce code est valable pendant <strong>10 minutes</strong>.</p>
              <div class="footer">
                Ne partagez jamais ce code avec qui que ce soit.
              </div>
            </div>
          </body>
        </html>
        """;

        return String.format(template, code);
    }
}
