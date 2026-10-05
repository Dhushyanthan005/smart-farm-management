package com.dairyflow.modules.breeding.exception;

import com.dairyflow.common.exception.ResourceNotFoundException;

public class CalvingRecordNotFoundException extends ResourceNotFoundException {

    public CalvingRecordNotFoundException(String fieldName, Object fieldValue) {
        super("CalvingRecord", fieldName, fieldValue);
    }
}
