package com.dairyflow.modules.auth.service;

public interface PasswordResetNotificationService {

    void sendPasswordResetEmail(String email, String resetToken);
}
