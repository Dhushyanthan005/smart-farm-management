-- ==============================================================================
-- DairyFlow Migration: V3__create_cows.sql
-- Description: Complete schema for Cows / Livestock Management module
-- Dialect: PostgreSQL 16+
-- ==============================================================================

-- 1. CREATE COWS TABLE
CREATE TABLE IF NOT EXISTS cows (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tag_number VARCHAR(30) NOT NULL UNIQUE,
    rfid VARCHAR(50) UNIQUE,
    name VARCHAR(50),
    breed VARCHAR(50) NOT NULL,
    gender VARCHAR(10) NOT NULL,
    date_of_birth DATE NOT NULL,
    parity INT NOT NULL DEFAULT 0,
    health_status VARCHAR(30) NOT NULL DEFAULT 'HEALTHY',
    lifecycle_status VARCHAR(30) NOT NULL DEFAULT 'ACTIVE',
    source VARCHAR(20) NOT NULL DEFAULT 'BORN',
    barn VARCHAR(50),
    pen VARCHAR(50),
    expected_milk_capacity NUMERIC(5,2),
    current_milk_status VARCHAR(30),
    mother_id UUID,
    father_id UUID,
    acquisition_date DATE,
    acquisition_place VARCHAR(100),
    photo_url VARCHAR(255),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    created_by VARCHAR(50),
    updated_by VARCHAR(50),
    CONSTRAINT chk_cow_gender CHECK (gender IN ('FEMALE', 'MALE')),
    CONSTRAINT chk_cow_health_status CHECK (health_status IN ('HEALTHY', 'UNDER_TREATMENT', 'PREGNANT', 'QUARANTINED', 'RECOVERING')),
    CONSTRAINT chk_cow_lifecycle_status CHECK (lifecycle_status IN ('ACTIVE', 'SOLD', 'DECEASED', 'TRANSFERRED')),
    CONSTRAINT chk_cow_source CHECK (source IN ('BORN', 'PURCHASED', 'BOUGHT')),
    CONSTRAINT chk_cow_parity CHECK (parity >= 0)
);

-- 2. CREATE PERFORMANCE INDEXES
CREATE INDEX IF NOT EXISTS idx_cows_tag_number ON cows(tag_number);
CREATE INDEX IF NOT EXISTS idx_cows_rfid ON cows(rfid);
CREATE INDEX IF NOT EXISTS idx_cows_health_status ON cows(health_status);
CREATE INDEX IF NOT EXISTS idx_cows_lifecycle_status ON cows(lifecycle_status);
CREATE INDEX IF NOT EXISTS idx_cows_breed ON cows(breed);
CREATE INDEX IF NOT EXISTS idx_cows_barn ON cows(barn);
CREATE INDEX IF NOT EXISTS idx_cows_pen ON cows(pen);
CREATE INDEX IF NOT EXISTS idx_cows_created_at ON cows(created_at);

-- 3. ENSURE COW_DELETE PERMISSION MAPPING
INSERT INTO permissions (name, description, module) VALUES
    ('COW_DELETE', 'Archive or delete cow records', 'cows')
ON CONFLICT (name) DO NOTHING;

INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r CROSS JOIN permissions p
WHERE r.name IN ('ROLE_OWNER', 'ROLE_ADMIN')
  AND p.name = 'COW_DELETE'
ON CONFLICT DO NOTHING;
