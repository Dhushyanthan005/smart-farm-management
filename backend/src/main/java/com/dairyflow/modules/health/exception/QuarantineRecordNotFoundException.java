package com.dairyflow.modules.health.exception;

import com.dairyflow.common.exception.ResourceNotFoundException;

public class QuarantineRecordNotFoundException extends ResourceNotFoundException {

    public QuarantineRecordNotFoundException(String fieldName, Object fieldValue) {
        super("QuarantineRecord", fieldName, fieldValue);
    }
}
