package com.dairyflow.modules.cows.exception;

import com.dairyflow.common.exception.ResourceNotFoundException;

public class CowNotFoundException extends ResourceNotFoundException {

    public CowNotFoundException(String fieldName, Object fieldValue) {
        super("Cow", fieldName, fieldValue);
    }
}
