package com.dairyflow.modules.milk.exception;

import com.dairyflow.common.exception.ResourceNotFoundException;

public class MilkRecordNotFoundException extends ResourceNotFoundException {

    public MilkRecordNotFoundException(String fieldName, Object fieldValue) {
        super("MilkProductionRecord", fieldName, fieldValue);
    }
}
