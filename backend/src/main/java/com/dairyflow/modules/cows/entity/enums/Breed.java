package com.dairyflow.modules.cows.entity.enums;

import com.fasterxml.jackson.annotation.JsonCreator;

public enum Breed {
    HOLSTEIN_FRIESIAN,
    HOLSTEIN,
    JERSEY,
    GUERNSEY,
    AYRSHIRE,
    BROWN_SWISS,
    SIMMENTAL,
    OTHER;

    @JsonCreator
    public static Breed fromString(String value) {
        if (value == null || value.trim().isEmpty()) {
            return null;
        }
        String normalized = value.trim().toUpperCase().replace(" ", "_").replace("-", "_");
        if ("HOLSTEIN".equals(normalized)) {
            return HOLSTEIN;
        }
        for (Breed breed : values()) {
            if (breed.name().equalsIgnoreCase(normalized)) {
                return breed;
            }
        }
        return OTHER;
    }
}
