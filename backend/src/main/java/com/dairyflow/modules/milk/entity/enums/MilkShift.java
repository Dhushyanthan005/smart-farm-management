package com.dairyflow.modules.milk.entity.enums;

import com.fasterxml.jackson.annotation.JsonCreator;

public enum MilkShift {
    MORNING,
    EVENING;

    @JsonCreator
    public static MilkShift fromString(String value) {
        if (value == null || value.trim().isEmpty()) {
            return null;
        }
        String normalized = value.trim().toUpperCase();
        for (MilkShift shift : values()) {
            if (shift.name().equalsIgnoreCase(normalized)) {
                return shift;
            }
        }
        throw new IllegalArgumentException("Invalid milk shift: " + value + ". Must be MORNING or EVENING.");
    }
}
