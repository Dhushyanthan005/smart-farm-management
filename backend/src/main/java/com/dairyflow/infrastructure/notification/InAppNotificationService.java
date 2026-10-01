package com.dairyflow.infrastructure.notification;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class InAppNotificationService implements NotificationService {

    @Override
    public void sendNotification(NotificationMessage message) {
        log.info("In-App Notification dispatched: toUser='{}', title='{}', type='{}'",
                message.getRecipientUserId(), message.getTitle(), message.getType());
        // Phase 13 will persist to notifications table and publish via WebSocket/SSE
    }

    @Override
    public boolean supports(NotificationChannel channel) {
        return channel == NotificationChannel.IN_APP;
    }
}
