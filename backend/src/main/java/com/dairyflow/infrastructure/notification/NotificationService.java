package com.dairyflow.infrastructure.notification;

public interface NotificationService {

    void sendNotification(NotificationMessage message);

    boolean supports(NotificationChannel channel);

    enum NotificationChannel {
        IN_APP,
        EMAIL,
        SMS,
        WHATSAPP
    }
}
