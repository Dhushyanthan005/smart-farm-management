-- ==============================================================================
-- DairyFlow Seeds: V1_2__seed_default_users.sql
-- Description: Standard development and testing user accounts
-- Passwords for all accounts are 'password' (BCrypt strength 12)
-- ==============================================================================

-- Password hash below corresponds to 'password' with BCrypt 12
-- $2a$12$R.94.aE4P.B9Y26mGgh2ueZhy8p9v3fH8tKsmVfGf3vK03QpD6d0m

INSERT INTO users (id, username, email, password_hash, first_name, last_name, phone_number, status)
VALUES
    ('11111111-1111-1111-1111-111111111111', 'owner', 'owner@dairyflow.com', '$2a$12$R.94.aE4P.B9Y26mGgh2ueZhy8p9v3fH8tKsmVfGf3vK03QpD6d0m', 'Elena', 'Vance', '+15550101', 'ACTIVE'),
    ('22222222-2222-2222-2222-222222222222', 'admin', 'admin@dairyflow.com', '$2a$12$R.94.aE4P.B9Y26mGgh2ueZhy8p9v3fH8tKsmVfGf3vK03QpD6d0m', 'Marcus', 'Reed', '+15550102', 'ACTIVE'),
    ('33333333-3333-3333-3333-333333333333', 'manager', 'manager@dairyflow.com', '$2a$12$R.94.aE4P.B9Y26mGgh2ueZhy8p9v3fH8tKsmVfGf3vK03QpD6d0m', 'Sarah', 'Jenkins', '+15550103', 'ACTIVE'),
    ('44444444-4444-4444-4444-444444444444', 'vet', 'vet@dairyflow.com', '$2a$12$R.94.aE4P.B9Y26mGgh2ueZhy8p9v3fH8tKsmVfGf3vK03QpD6d0m', 'Dr. David', 'Evans', '+15550104', 'ACTIVE'),
    ('55555555-5555-5555-5555-555555555555', 'worker', 'worker@dairyflow.com', '$2a$12$R.94.aE4P.B9Y26mGgh2ueZhy8p9v3fH8tKsmVfGf3vK03QpD6d0m', 'Tom', 'Hanks', '+15550105', 'ACTIVE'),
    ('66666666-6666-6666-6666-666666666666', 'delivery', 'delivery@dairyflow.com', '$2a$12$R.94.aE4P.B9Y26mGgh2ueZhy8p9v3fH8tKsmVfGf3vK03QpD6d0m', 'Leo', 'Miller', '+15550106', 'ACTIVE'),
    ('77777777-7777-7777-7777-777777777777', 'customer', 'customer@dairyflow.com', '$2a$12$R.94.aE4P.B9Y26mGgh2ueZhy8p9v3fH8tKsmVfGf3vK03QpD6d0m', 'Alice', 'Cooper', '+15550107', 'ACTIVE')
ON CONFLICT (username) DO NOTHING;

-- Map users to roles
INSERT INTO user_roles (user_id, role_id)
SELECT u.id, r.id FROM users u, roles r
WHERE u.username = 'owner' AND r.name = 'ROLE_OWNER'
ON CONFLICT DO NOTHING;

INSERT INTO user_roles (user_id, role_id)
SELECT u.id, r.id FROM users u, roles r
WHERE u.username = 'admin' AND r.name = 'ROLE_ADMIN'
ON CONFLICT DO NOTHING;

INSERT INTO user_roles (user_id, role_id)
SELECT u.id, r.id FROM users u, roles r
WHERE u.username = 'manager' AND r.name = 'ROLE_MANAGER'
ON CONFLICT DO NOTHING;

INSERT INTO user_roles (user_id, role_id)
SELECT u.id, r.id FROM users u, roles r
WHERE u.username = 'vet' AND r.name = 'ROLE_VETERINARIAN'
ON CONFLICT DO NOTHING;

INSERT INTO user_roles (user_id, role_id)
SELECT u.id, r.id FROM users u, roles r
WHERE u.username = 'worker' AND r.name = 'ROLE_WORKER'
ON CONFLICT DO NOTHING;

INSERT INTO user_roles (user_id, role_id)
SELECT u.id, r.id FROM users u, roles r
WHERE u.username = 'delivery' AND r.name = 'ROLE_DELIVERY_STAFF'
ON CONFLICT DO NOTHING;

INSERT INTO user_roles (user_id, role_id)
SELECT u.id, r.id FROM users u, roles r
WHERE u.username = 'customer' AND r.name = 'ROLE_CUSTOMER'
ON CONFLICT DO NOTHING;
