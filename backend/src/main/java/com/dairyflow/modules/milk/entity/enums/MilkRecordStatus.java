package com.dairyflow.modules.milk.entity.enums;

import com.fasterxml.jackson.annotation.JsonCreator;

public enum MilkRecordStatus {
    BULK,
    APPROVED,
    WASTE,
    COLOSTRUM,
    WITHHELD,
    DISCARDED;

    @JsonCreator
    public static MilkRecordStatus fromString(String value) {
        if (value == null || value.trim().isEmpty()) {
            return BULK;
        }
        String normalized = value.trim().toUpperCase();
        for (MilkRecordStatus status : values()) {
            if (status.name().equalsIgnoreCase(normalized)) {
                return status;
            }
        }
        return BULK;
    }

    public boolean isSaleable() {
        return this == BULK || this == APPROVED;
    }
}
