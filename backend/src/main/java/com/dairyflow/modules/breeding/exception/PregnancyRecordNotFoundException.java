package com.dairyflow.modules.breeding.exception;

import com.dairyflow.common.exception.ResourceNotFoundException;

public class PregnancyRecordNotFoundException extends ResourceNotFoundException {

    public PregnancyRecordNotFoundException(String fieldName, Object fieldValue) {
        super("PregnancyRecord", fieldName, fieldValue);
    }
}
