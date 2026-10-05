package com.dairyflow.modules.breeding.exception;

import com.dairyflow.common.exception.ResourceNotFoundException;

public class HeatRecordNotFoundException extends ResourceNotFoundException {

    public HeatRecordNotFoundException(String fieldName, Object fieldValue) {
        super("HeatRecord", fieldName, fieldValue);
    }
}
