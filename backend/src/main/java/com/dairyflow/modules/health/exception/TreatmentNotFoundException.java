package com.dairyflow.modules.health.exception;

import com.dairyflow.common.exception.ResourceNotFoundException;

public class TreatmentNotFoundException extends ResourceNotFoundException {

    public TreatmentNotFoundException(String fieldName, Object fieldValue) {
        super("Treatment", fieldName, fieldValue);
    }
}
