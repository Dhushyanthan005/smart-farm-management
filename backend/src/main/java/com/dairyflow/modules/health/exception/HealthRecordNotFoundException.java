package com.dairyflow.modules.health.exception;

import com.dairyflow.common.exception.ResourceNotFoundException;

public class HealthRecordNotFoundException extends ResourceNotFoundException {

    public HealthRecordNotFoundException(String fieldName, Object fieldValue) {
        super("HealthRecord", fieldName, fieldValue);
    }
}
