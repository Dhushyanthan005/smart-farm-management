package com.dairyflow.common.audit;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface AuditService {

    void logAction(String entityName, String entityId, String action, String performedBy, String details, String ipAddress);

    Page<AuditLog> getLogsForEntity(String entityName, String entityId, Pageable pageable);
}
