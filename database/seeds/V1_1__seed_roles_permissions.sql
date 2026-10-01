-- ==============================================================================
-- DairyFlow Seeds: V1_1__seed_roles_permissions.sql
-- Description: Standard roles and permissions for DairyFlow RBAC
-- ==============================================================================

-- Insert standard roles
INSERT INTO roles (name, description) VALUES
    ('ROLE_OWNER', 'Farm Owner with full administrative and business rights'),
    ('ROLE_ADMIN', 'System Administrator with technical management privileges'),
    ('ROLE_MANAGER', 'Farm Operations Manager managing day-to-day operations'),
    ('ROLE_VETERINARIAN', 'Veterinarian responsible for health, vaccinations, and breeding'),
    ('ROLE_WORKER', 'Farm Hand / Worker recording milk yields and feed intake'),
    ('ROLE_DELIVERY_STAFF', 'Logistics and delivery personnel fulfilling customer orders'),
    ('ROLE_CUSTOMER', 'Retail/Wholesale customer ordering milk and viewing subscriptions')
ON CONFLICT (name) DO NOTHING;

-- Insert module permissions
INSERT INTO permissions (name, description, module) VALUES
    -- Cow permissions
    ('COW_READ', 'View cows and livestock details', 'cows'),
    ('COW_WRITE', 'Register, update, and manage cows', 'cows'),
    ('COW_DELETE', 'Archive or delete cow records', 'cows'),

    -- Milk permissions
    ('MILK_READ', 'View milk collection and yield logs', 'milk'),
    ('MILK_WRITE', 'Record morning/evening milk collection', 'milk'),

    -- Health & Vaccination permissions
    ('HEALTH_READ', 'View health checkups, diagnoses, and treatments', 'health'),
    ('HEALTH_WRITE', 'Record treatments, prescriptions, and checkups', 'health'),
    ('VACCINATION_READ', 'View vaccination schedules and logs', 'vaccinations'),
    ('VACCINATION_WRITE', 'Schedule and record vaccinations', 'vaccinations'),

    -- Breeding permissions
    ('BREEDING_READ', 'View heat cycles, inseminations, and calvings', 'breeding'),
    ('BREEDING_WRITE', 'Record AI, pregnancy checks, and calving', 'breeding'),

    -- Feed & Inventory permissions
    ('FEED_READ', 'View feed rations and consumption logs', 'feed'),
    ('FEED_WRITE', 'Record daily feed intake and rations', 'feed'),
    ('INVENTORY_READ', 'View warehouse stock, feed, and medical supplies', 'inventory'),
    ('INVENTORY_WRITE', 'Manage inventory batches, stock levels, suppliers', 'inventory'),

    -- Customer & Sales permissions
    ('CUSTOMER_READ', 'View customer details and delivery addresses', 'customers'),
    ('CUSTOMER_WRITE', 'Create and modify customer profiles', 'customers'),
    ('ORDER_READ', 'View milk and dairy orders', 'orders'),
    ('ORDER_WRITE', 'Create, update, and cancel orders', 'orders'),
    ('DELIVERY_READ', 'View delivery routes and status', 'deliveries'),
    ('DELIVERY_WRITE', 'Assign and update delivery completion', 'deliveries'),

    -- Financial & Reports permissions
    ('FINANCE_READ', 'View revenue, expenses, and profit margins', 'finance'),
    ('FINANCE_WRITE', 'Record farm expenses and revenue vouchers', 'finance'),
    ('REPORTS_VIEW', 'Generate and export domain analytics reports', 'reports'),

    -- User & System permissions
    ('USER_MANAGE', 'Create, update, and manage system users and roles', 'users'),
    ('SYSTEM_CONFIG', 'Modify farm settings and system configurations', 'settings')
ON CONFLICT (name) DO NOTHING;

-- Map permissions to OWNER and ADMIN (All permissions)
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r CROSS JOIN permissions p
WHERE r.name IN ('ROLE_OWNER', 'ROLE_ADMIN')
ON CONFLICT DO NOTHING;

-- Map permissions to MANAGER
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r, permissions p
WHERE r.name = 'ROLE_MANAGER'
AND p.name IN (
    'COW_READ', 'COW_WRITE', 'MILK_READ', 'MILK_WRITE',
    'HEALTH_READ', 'VACCINATION_READ', 'BREEDING_READ',
    'FEED_READ', 'FEED_WRITE', 'INVENTORY_READ', 'INVENTORY_WRITE',
    'CUSTOMER_READ', 'CUSTOMER_WRITE', 'ORDER_READ', 'ORDER_WRITE',
    'DELIVERY_READ', 'DELIVERY_WRITE', 'FINANCE_READ', 'REPORTS_VIEW'
)
ON CONFLICT DO NOTHING;

-- Map permissions to VETERINARIAN
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r, permissions p
WHERE r.name = 'ROLE_VETERINARIAN'
AND p.name IN (
    'COW_READ', 'HEALTH_READ', 'HEALTH_WRITE',
    'VACCINATION_READ', 'VACCINATION_WRITE',
    'BREEDING_READ', 'BREEDING_WRITE'
)
ON CONFLICT DO NOTHING;

-- Map permissions to WORKER
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r, permissions p
WHERE r.name = 'ROLE_WORKER'
AND p.name IN (
    'COW_READ', 'MILK_READ', 'MILK_WRITE',
    'FEED_READ', 'FEED_WRITE', 'INVENTORY_READ'
)
ON CONFLICT DO NOTHING;

-- Map permissions to DELIVERY_STAFF
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r, permissions p
WHERE r.name = 'ROLE_DELIVERY_STAFF'
AND p.name IN ('ORDER_READ', 'DELIVERY_READ', 'DELIVERY_WRITE')
ON CONFLICT DO NOTHING;

-- Map permissions to CUSTOMER
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r, permissions p
WHERE r.name = 'ROLE_CUSTOMER'
AND p.name IN ('ORDER_READ', 'ORDER_WRITE')
ON CONFLICT DO NOTHING;
