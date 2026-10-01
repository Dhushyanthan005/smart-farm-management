package com.dairyflow.infrastructure.notification;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.Map;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NotificationMessage {
    private UUID recipientUserId;
    private String title;
    private String content;
    private String type; // e.g. VACCINATION_DUE, LOW_STOCK, ORDER_PLACED
    private String targetUrl;
    private Map<String, Object> metadata;

    @Builder.Default
    private Instant createdAt = Instant.now();
}
