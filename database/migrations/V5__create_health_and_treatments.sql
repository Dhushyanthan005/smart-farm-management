-- V5__create_health_and_treatments.sql
-- Health, Veterinary Records, Treatments, Antibiotic Withdrawals, and Quarantine Bays

CREATE TABLE health_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cow_id UUID NOT NULL REFERENCES cows(id) ON DELETE RESTRICT,
    record_date DATE NOT NULL,
    health_status VARCHAR(30) NOT NULL,
    diagnosis VARCHAR(255),
    symptoms TEXT,
    temperature NUMERIC(4, 1),
    weight NUMERIC(6, 1),
    veterinarian_id UUID REFERENCES users(id) ON DELETE SET NULL,
    veterinarian_name VARCHAR(100),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(50),
    updated_by VARCHAR(50)
);

CREATE INDEX idx_health_cow_id ON health_records(cow_id);
CREATE INDEX idx_health_record_date ON health_records(record_date);
CREATE INDEX idx_health_status ON health_records(health_status);
CREATE INDEX idx_health_vet_id ON health_records(veterinarian_id);

CREATE TABLE treatments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cow_id UUID NOT NULL REFERENCES cows(id) ON DELETE RESTRICT,
    health_record_id UUID REFERENCES health_records(id) ON DELETE SET NULL,
    treatment_date DATE NOT NULL,
    diagnosis VARCHAR(255) NOT NULL,
    treatment_type VARCHAR(50),
    medication VARCHAR(100) NOT NULL,
    dosage VARCHAR(50),
    frequency VARCHAR(50),
    route VARCHAR(50),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    withdrawal_days INT NOT NULL DEFAULT 0,
    withdrawal_end_date DATE,
    veterinarian_id UUID REFERENCES users(id) ON DELETE SET NULL,
    veterinarian_name VARCHAR(100),
    instructions TEXT,
    notes TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(50),
    updated_by VARCHAR(50),
    CONSTRAINT chk_treatment_dates CHECK (end_date >= start_date),
    CONSTRAINT chk_withdrawal_days CHECK (withdrawal_days >= 0)
);

CREATE INDEX idx_treatment_cow_id ON treatments(cow_id);
CREATE INDEX idx_treatment_status ON treatments(status);
CREATE INDEX idx_treatment_start_date ON treatments(start_date);
CREATE INDEX idx_treatment_end_date ON treatments(end_date);
CREATE INDEX idx_treatment_withdrawal_end ON treatments(withdrawal_end_date);
CREATE INDEX idx_treatment_vet_id ON treatments(veterinarian_id);

CREATE TABLE quarantine_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cow_id UUID NOT NULL REFERENCES cows(id) ON DELETE RESTRICT,
    start_date DATE NOT NULL,
    expected_release_date DATE,
    actual_release_date DATE,
    reason VARCHAR(255) NOT NULL,
    location VARCHAR(100) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    veterinarian_id UUID REFERENCES users(id) ON DELETE SET NULL,
    veterinarian_name VARCHAR(100),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(50),
    updated_by VARCHAR(50)
);

CREATE INDEX idx_quarantine_cow_id ON quarantine_records(cow_id);
CREATE INDEX idx_quarantine_status ON quarantine_records(status);
CREATE INDEX idx_quarantine_start_date ON quarantine_records(start_date);
CREATE INDEX idx_quarantine_location ON quarantine_records(location);

-- Seed Permissions for Health & Veterinary Management
INSERT INTO permissions (name, description, module) VALUES
    ('HEALTH_VIEW', 'View veterinary examinations, diagnoses, and medical histories', 'health'),
    ('HEALTH_CREATE', 'Create health examination and diagnosis records', 'health'),
    ('HEALTH_UPDATE', 'Modify health records and clinical notes', 'health'),
    ('HEALTH_DELETE', 'Delete erroneous health records', 'health'),
    ('TREATMENT_VIEW', 'View treatment plans, medications, and dosage logs', 'health'),
    ('TREATMENT_CREATE', 'Prescribe treatments, medications, and withdrawal periods', 'health'),
    ('TREATMENT_UPDATE', 'Modify active treatment regimens', 'health'),
    ('TREATMENT_COMPLETE', 'Mark treatments as completed or resolved', 'health'),
    ('QUARANTINE_VIEW', 'View quarantine bay assignments and isolation records', 'health'),
    ('QUARANTINE_CREATE', 'Isolate cows in quarantine bays', 'health'),
    ('QUARANTINE_UPDATE', 'Modify quarantine details and bay assignments', 'health'),
    ('QUARANTINE_RELEASE', 'Release cows from quarantine isolation', 'health'),
    ('WITHDRAWAL_VIEW', 'View active antibiotic milk withholdings and countdowns', 'health'),
    ('HEALTH_REPORT_VIEW', 'View veterinary health summaries and udder health KPIs', 'health')
ON CONFLICT (name) DO NOTHING;

-- Assign permissions to roles
-- 1. OWNER (All permissions)
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r, permissions p
WHERE r.name = 'ROLE_OWNER' AND p.name IN (
    'HEALTH_VIEW', 'HEALTH_CREATE', 'HEALTH_UPDATE', 'HEALTH_DELETE',
    'TREATMENT_VIEW', 'TREATMENT_CREATE', 'TREATMENT_UPDATE', 'TREATMENT_COMPLETE',
    'QUARANTINE_VIEW', 'QUARANTINE_CREATE', 'QUARANTINE_UPDATE', 'QUARANTINE_RELEASE',
    'WITHDRAWAL_VIEW', 'HEALTH_REPORT_VIEW'
)
ON CONFLICT (role_id, permission_id) DO NOTHING;

-- 2. ADMIN (All permissions)
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r, permissions p
WHERE r.name = 'ROLE_ADMIN' AND p.name IN (
    'HEALTH_VIEW', 'HEALTH_CREATE', 'HEALTH_UPDATE', 'HEALTH_DELETE',
    'TREATMENT_VIEW', 'TREATMENT_CREATE', 'TREATMENT_UPDATE', 'TREATMENT_COMPLETE',
    'QUARANTINE_VIEW', 'QUARANTINE_CREATE', 'QUARANTINE_UPDATE', 'QUARANTINE_RELEASE',
    'WITHDRAWAL_VIEW', 'HEALTH_REPORT_VIEW'
)
ON CONFLICT (role_id, permission_id) DO NOTHING;

-- 3. VETERINARIAN (Full clinical access)
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r, permissions p
WHERE r.name = 'ROLE_VETERINARIAN' AND p.name IN (
    'HEALTH_VIEW', 'HEALTH_CREATE', 'HEALTH_UPDATE',
    'TREATMENT_VIEW', 'TREATMENT_CREATE', 'TREATMENT_UPDATE', 'TREATMENT_COMPLETE',
    'QUARANTINE_VIEW', 'QUARANTINE_CREATE', 'QUARANTINE_UPDATE', 'QUARANTINE_RELEASE',
    'WITHDRAWAL_VIEW', 'HEALTH_REPORT_VIEW'
)
ON CONFLICT (role_id, permission_id) DO NOTHING;

-- 4. MANAGER (Operational health access)
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r, permissions p
WHERE r.name = 'ROLE_MANAGER' AND p.name IN (
    'HEALTH_VIEW', 'HEALTH_CREATE', 'HEALTH_UPDATE',
    'TREATMENT_VIEW', 'TREATMENT_CREATE', 'TREATMENT_UPDATE', 'TREATMENT_COMPLETE',
    'QUARANTINE_VIEW', 'QUARANTINE_CREATE', 'QUARANTINE_UPDATE', 'QUARANTINE_RELEASE',
    'WITHDRAWAL_VIEW', 'HEALTH_REPORT_VIEW'
)
ON CONFLICT (role_id, permission_id) DO NOTHING;

-- 5. WORKER (Read-only operational health awareness)
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r, permissions p
WHERE r.name = 'ROLE_WORKER' AND p.name IN (
    'HEALTH_VIEW', 'TREATMENT_VIEW', 'QUARANTINE_VIEW', 'WITHDRAWAL_VIEW'
)
ON CONFLICT (role_id, permission_id) DO NOTHING;
