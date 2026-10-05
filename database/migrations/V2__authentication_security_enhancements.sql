-- ==============================================================================
-- DairyFlow Migration: V2__authentication_security_enhancements.sql
-- Description: Enhancements for refresh token rotation tracking and password reset tokens
-- Dialect: PostgreSQL 16+
-- ==============================================================================

-- 1. ENHANCE REFRESH_TOKENS TABLE
-- Add tracking for revocation timestamp and replacement token chain
ALTER TABLE refresh_tokens ADD COLUMN IF NOT EXISTS revoked_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE refresh_tokens ADD COLUMN IF NOT EXISTS replaced_by_token_hash VARCHAR(255);

CREATE INDEX IF NOT EXISTS idx_refresh_tokens_replaced ON refresh_tokens(replaced_by_token_hash);

-- 2. CREATE PASSWORD_RESET_TOKENS TABLE
CREATE TABLE IF NOT EXISTS password_reset_tokens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash VARCHAR(255) NOT NULL UNIQUE,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    used BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_user ON password_reset_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_hash ON password_reset_tokens(token_hash);

-- 3. ENSURE GRANULAR COW PERMISSIONS
INSERT INTO permissions (name, description, module) VALUES
    ('COW_VIEW', 'View cow profiles, herd statistics, and telemetry', 'cows'),
    ('COW_CREATE', 'Register new cattle in herd management', 'cows'),
    ('COW_UPDATE', 'Modify cattle attributes, status, and pen assignments', 'cows')
ON CONFLICT (name) DO NOTHING;

-- Map newly introduced granular permissions to roles
-- ROLE_OWNER & ROLE_ADMIN get all permissions
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r CROSS JOIN permissions p
WHERE r.name IN ('ROLE_OWNER', 'ROLE_ADMIN')
  AND p.name IN ('COW_VIEW', 'COW_CREATE', 'COW_UPDATE')
ON CONFLICT DO NOTHING;

-- ROLE_MANAGER
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r, permissions p
WHERE r.name = 'ROLE_MANAGER'
  AND p.name IN ('COW_VIEW', 'COW_CREATE', 'COW_UPDATE')
ON CONFLICT DO NOTHING;

-- ROLE_VETERINARIAN
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r, permissions p
WHERE r.name = 'ROLE_VETERINARIAN'
  AND p.name IN ('COW_VIEW', 'COW_UPDATE')
ON CONFLICT DO NOTHING;

-- ROLE_WORKER
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r, permissions p
WHERE r.name = 'ROLE_WORKER'
  AND p.name IN ('COW_VIEW')
ON CONFLICT DO NOTHING;
