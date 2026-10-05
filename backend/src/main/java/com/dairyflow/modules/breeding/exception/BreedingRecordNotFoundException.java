package com.dairyflow.modules.breeding.exception;

import com.dairyflow.common.exception.ResourceNotFoundException;

public class BreedingRecordNotFoundException extends ResourceNotFoundException {

    public BreedingRecordNotFoundException(String fieldName, Object fieldValue) {
        super("BreedingRecord", fieldName, fieldValue);
    }
}
