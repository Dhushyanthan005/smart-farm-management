package com.dairyflow.modules.auth.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class PasswordResetNotificationServiceImpl implements PasswordResetNotificationService {

    @Override
    public void sendPasswordResetEmail(String email, String resetToken) {
        // In production this will integrate with AWS SES / SMTP / SendGrid
        // For development and testing, abstract and log instructions securely
        log.info("Password reset dispatch initiated for email: [{}]. Token generated successfully.", email);
        log.debug("Development reset token for [{}]: {}", email, resetToken);
    }
}
