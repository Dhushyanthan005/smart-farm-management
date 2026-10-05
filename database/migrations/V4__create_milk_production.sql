-- ==============================================================================
-- DairyFlow Migration: V4__create_milk_production.sql
-- Description: Complete schema for Milk Production Management module
-- Dialect: PostgreSQL 16+
-- ==============================================================================

-- 1. CREATE MILK_PRODUCTION_RECORDS TABLE
CREATE TABLE IF NOT EXISTS milk_production_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cow_id UUID NOT NULL REFERENCES cows(id) ON DELETE RESTRICT,
    production_date DATE NOT NULL,
    shift VARCHAR(10) NOT NULL,
    quantity_liters NUMERIC(6,2) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'BULK',
    fat_percentage NUMERIC(4,2),
    protein_percentage NUMERIC(4,2),
    somatic_cell_count INT,
    conductivity NUMERIC(4,2),
    operator_id UUID,
    operator_name VARCHAR(100),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    created_by VARCHAR(50),
    updated_by VARCHAR(50),
    CONSTRAINT chk_milk_quantity CHECK (quantity_liters >= 0),
    CONSTRAINT chk_milk_shift CHECK (shift IN ('MORNING', 'EVENING')),
    CONSTRAINT chk_milk_status CHECK (status IN ('BULK', 'APPROVED', 'WASTE', 'COLOSTRUM', 'WITHHELD', 'DISCARDED')),
    CONSTRAINT uk_milk_cow_date_shift UNIQUE (cow_id, production_date, shift)
);

-- 2. CREATE PERFORMANCE INDEXES
CREATE INDEX IF NOT EXISTS idx_milk_cow ON milk_production_records(cow_id);
CREATE INDEX IF NOT EXISTS idx_milk_date ON milk_production_records(production_date);
CREATE INDEX IF NOT EXISTS idx_milk_shift ON milk_production_records(shift);
CREATE INDEX IF NOT EXISTS idx_milk_date_shift ON milk_production_records(production_date, shift);
CREATE INDEX IF NOT EXISTS idx_milk_status ON milk_production_records(status);
CREATE INDEX IF NOT EXISTS idx_milk_created_at ON milk_production_records(created_at);

-- 3. ENSURE GRANULAR MILK PERMISSIONS & ROLE ASSIGNMENTS
INSERT INTO permissions (name, description, module) VALUES
    ('MILK_VIEW', 'View milk collection, daily summaries, and yield metrics', 'milk'),
    ('MILK_CREATE', 'Record individual and batch milking entries', 'milk'),
    ('MILK_UPDATE', 'Modify milk quantities, disposition, and laboratory markers', 'milk'),
    ('MILK_DELETE', 'Remove or void invalid milk collection records', 'milk'),
    ('MILK_APPROVE', 'Approve bulk milk batches for tanker transfer', 'milk'),
    ('MILK_DISCARD', 'Designate milk batch as waste or colostrum withheld', 'milk')
ON CONFLICT (name) DO NOTHING;

-- Map permissions to OWNER & ADMIN
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r CROSS JOIN permissions p
WHERE r.name IN ('ROLE_OWNER', 'ROLE_ADMIN')
  AND p.name IN ('MILK_VIEW', 'MILK_CREATE', 'MILK_UPDATE', 'MILK_DELETE', 'MILK_APPROVE', 'MILK_DISCARD')
ON CONFLICT DO NOTHING;

-- Map permissions to MANAGER
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r, permissions p
WHERE r.name = 'ROLE_MANAGER'
  AND p.name IN ('MILK_VIEW', 'MILK_CREATE', 'MILK_UPDATE', 'MILK_APPROVE', 'MILK_DISCARD')
ON CONFLICT DO NOTHING;

-- Map permissions to WORKER
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r, permissions p
WHERE r.name = 'ROLE_WORKER'
  AND p.name IN ('MILK_VIEW', 'MILK_CREATE', 'MILK_UPDATE')
ON CONFLICT DO NOTHING;
