package com.dairyflow.modules.health.exception;

import com.dairyflow.common.exception.ConflictException;

public class CowAlreadyQuarantinedException extends ConflictException {

    public CowAlreadyQuarantinedException(String tagNumber, String location) {
        super(String.format("Cow '%s' is already in active quarantine isolation at '%s'", tagNumber, location),
                "COW_ALREADY_QUARANTINED");
    }
}
