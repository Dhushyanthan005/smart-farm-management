package com.dairyflow.security;

public enum Role {
    OWNER,
    ADMIN,
    MANAGER,
    VETERINARIAN,
    WORKER,
    DELIVERY_STAFF,
    CUSTOMER;

    public String getAuthority() {
        return "ROLE_" + this.name();
    }
}
