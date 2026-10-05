package com.dairyflow.modules.breeding.exception;

import com.dairyflow.common.exception.ConflictException;

import java.time.LocalDate;

public class ActivePregnancyConflictException extends ConflictException {

    public ActivePregnancyConflictException(String tagNumber, LocalDate expectedCalving) {
        super(String.format("Cow '%s' already has an active confirmed pregnancy with expected calving on '%s'",
                tagNumber, expectedCalving != null ? expectedCalving : "pending"),
                "ACTIVE_PREGNANCY_CONFLICT");
    }
}
